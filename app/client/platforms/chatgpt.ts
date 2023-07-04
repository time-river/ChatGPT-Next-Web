import { REQUEST_TIMEOUT_MS } from "@/app/constant";

import {
  RequestMessage,
  ChatOptions,
  getHeaders,
  LLMApi,
  LLMUsage,
} from "../api";
import Locale from "../../locales";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@fortaine/fetch-event-source";
import { prettyObject } from "@/app/utils/format";

export interface ConversationOptions {
  messageId: string;
  conversationId?: string;
  parentMessageId?: string;
}

export interface RevSession {
  token: string;
  puid: string;
}

interface ChatReq {
  model: string;
  prompt: string;
  options: ConversationOptions;
  timeout?: number;
  revSession?: RevSession;
}

interface APIError {
  code?: any;
  message: string;
  param?: string | null;
  type: string;
}

interface ChatRsp {
  error?: APIError;
  partContent: string;
  options: ConversationOptions;
  endTurn: string;
}

const ConversationPath = "api/v1/chatgpt/conversation";

export class ChatGPTChatApi implements LLMApi {
  extrace_prompt(messages: RequestMessage[]): string {
    return messages[0].content;
  }

  async chat(options: ChatOptions) {
    const prompt = this.extrace_prompt(options.messages);
    const model = options.config.model;

    const requestPayload: ChatReq = {
      prompt,
      model,
      options: options.conversationOptions!,
    };

    console.log("[Request] chatgpt payload: ", requestPayload);

    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = ConversationPath;
      const chatPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: getHeaders(),
      };

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      let responseText = "";
      let finished = false;

      const finish = () => {
        if (!finished) {
          options.onFinish(responseText);
          finished = true;
        }
      };

      controller.signal.onabort = finish;

      await fetchEventSource(chatPath, {
        ...chatPayload,
        async onopen(res) {
          clearTimeout(requestTimeoutId);
          const contentType = res.headers.get("content-type");
          console.log("[ChatGPT] request response content type: ", contentType);

          if (
            !res.ok ||
            !res.headers
              .get("content-type")
              ?.startsWith(EventStreamContentType) ||
            res.status !== 200
          ) {
            const responseTexts = [responseText];
            let extraInfo = await res.clone().text();
            try {
              const resJson = await res.clone().json();
              extraInfo = prettyObject(resJson);
            } catch {}

            if (res.status === 401) {
              responseTexts.push(Locale.Error.Unauthorized);
            }

            if (extraInfo) {
              responseTexts.push(extraInfo);
            }

            responseText = responseTexts.join("\n\n");

            return finish();
          }
        },
        onmessage(msg) {
          if (msg.data === "[DONE]" || finished) {
            options.onIgnore();
            return finish();
          }

          const text = msg.data;
          try {
            const json: ChatRsp = JSON.parse(text);
            responseText = json.partContent;
            options.onUpdate?.(responseText, json.options);
          } catch (e) {
            console.error("[Request] parse error", text, msg);
          }
        },
        onclose() {
          finish();
        },
        onerror(e) {
          options.onError?.(e);
          throw e;
        },
        openWhenHidden: true,
      });
    } catch (e) {
      console.log("[Request] failed to make a chat reqeust", e);
      options.onError?.(e as Error);
    }
  }

  async usage() {
    return {
      used: 0,
      total: 0,
    } as LLMUsage;
  }
}
