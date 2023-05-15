import { v4 as uuidv4, parse as uuidParse } from "uuid";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@fortaine/fetch-event-source";

import Locale from "@/app/locales";
import {
  ChatMessage,
  ChatSession,
  createMessage,
  useChatStore,
} from "@/app/store";
import { getHeaders } from "@/app/client/api";
import { REQUEST_TIMEOUT_MS } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { ChatControllerPool } from "../controller";

export interface ConversationOptions {
  messageId: string;
  conversationId?: string;
  parentMessageId?: string;
}

export interface ChatReq {
  model: string;
  prompt: string;
  options: ConversationOptions;
  timeout?: number;
}

export interface APIError {
  code?: any;
  message: string;
  param?: string | null;
  type: string;
}

export interface Usage {
  promptTokens: number;
  completionTokens: number;
}

export interface ChatRsp {
  error?: APIError;
  partContent: string;
  options: ConversationOptions;
  usage: Usage;
}

const chatPath = "/api/v1/chatgpt/chat";

function GetChatgptOptions(id: string): ConversationOptions {
  const chatStore = useChatStore.getState();

  const session = chatStore.currentSession();
  const messages: ChatMessage[] = session.messages;
  const n = messages.length;

  for (let i = n - 1; i >= 0; i -= 1) {
    // filter error msg and user msg
    if (messages[i].isError || messages[i].role !== "assistant") {
      continue;
    }

    if (messages[i].conversationId && messages[i].messageId) {
      return {
        messageId: id,
        conversationId: messages[i].conversationId,
        parentMessageId: messages[i].messageId,
      };
    }
  }

  return { messageId: id };
}

async function request(
  req: ChatReq,
  options: {
    onUpdate?: (message: string, options?: ConversationOptions) => void;
    onFinish: (message: string) => void;
    onError?: (err: Error) => void;
    onController?: (controller: AbortController) => void;
  },
) {
  const controller = new AbortController();
  options.onController?.(controller);

  try {
    const chatPayload = {
      method: "POST",
      body: JSON.stringify(req),
      signal: controller.signal,
      headers: getHeaders(),
    };

    let responseText = "";
    let finished = false;
    let firstChunk = true;

    const requestTimeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

    const finish = () => {
      if (!finished) {
        options.onFinish(responseText);
        finished = true;
      }
    };
    controller.signal.onabort = finish;

    fetchEventSource(chatPath, {
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
          return finish();
        }

        const text = msg.data;
        try {
          const json: ChatRsp = JSON.parse(text);
          responseText += json.partContent;
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

export async function requestChatStream(content: string, session: ChatSession) {
  const chatStore = useChatStore.getState();

  const chatReq: ChatReq = {
    model: session.mask.modelConfig.model,
    prompt: content,
    options: { messageId: uuidv4() },
  };

  /* the first message */
  if (session.messages.length === 0 && session.mask.context.length !== 0) {
    chatReq.prompt = session.mask.context[0].content.concat("\n" + content);
  } else if (session.messages.length !== 0) {
    chatReq.options = GetChatgptOptions(chatReq.options.messageId);
  }

  const userMessage: ChatMessage = createMessage({
    role: "user",
    content,
    messageId: chatReq.options.messageId,
  });

  const botMessage: ChatMessage = createMessage({
    role: "assistant",
    streaming: true,
    id: userMessage.id! + 1,
  });

  const sessionIndex = chatStore.currentSessionIndex;
  const messageIndex = chatStore.currentSession().messages.length + 1;

  chatStore.updateCurrentSession((session) => {
    session.messages.push(userMessage);
    session.messages.push(botMessage);
  });

  console.debug("[User Input] ", chatReq);
  request(chatReq, {
    onUpdate(message, options?) {
      botMessage.streaming = true;
      if (!!options) {
        botMessage.conversationId = options.conversationId;
        botMessage.parentMessageId = options.parentMessageId;
        botMessage.messageId = options.messageId;
      }
      if (message) {
        botMessage.content = message;
      }
      // force flush
      chatStore.update();
    },
    onFinish(message) {
      botMessage.streaming = false;
      if (message) {
        botMessage.content = message;
        chatStore.onNewMessage(botMessage);
      }
      ChatControllerPool.remove(sessionIndex, botMessage.id ?? messageIndex);
      chatStore.update();
    },
    onError(error) {
      const isAborted = error.message.includes("aborted");
      botMessage.content =
        "\n\n" +
        prettyObject({
          error: true,
          message: error.message,
        });
      botMessage.streaming = false;
      userMessage.isError = !isAborted;
      botMessage.isError = !isAborted;

      chatStore.update();
      ChatControllerPool.remove(sessionIndex, botMessage.id ?? messageIndex);

      console.error("[Chat] failed ", error);
    },
    onController(controller) {
      // collect controller for stop/retry
      ChatControllerPool.addController(
        sessionIndex,
        botMessage.id ?? messageIndex,
        controller,
      );
    },
  });
}
