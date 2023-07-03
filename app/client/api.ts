import { getClientConfig } from "../config/client";
import { ACCESS_CODE_PREFIX } from "../constant";
import { ChatMessage, ModelType, useAccessStore, useChatStore } from "../store";
import { ChatGPTApi } from "./platforms/openai";

import { sessionKey } from "@/customize/api/user/types";
import { ChatGPTChatApi } from "./platforms/chatgpt";
import { useModels } from "@/customize/store/model";

export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export const Models = ["gpt-3.5-turbo", "gpt-4"] as const;
export type ChatModel = ModelType;

export interface RequestMessage {
  role: MessageRole;
  content: string;

  messageId?: string;
}

export interface LLMConfig {
  model: string;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface ConversationOptions {
  messageId: string;
  conversationId?: string;
  parentMessageId?: string;
}

export interface ChatOptions {
  messages: RequestMessage[];
  config: LLMConfig;

  // chatGPT only
  conversationOptions?: ConversationOptions;

  onUpdate?: (message: string, chunk: any) => void;
  onFinish: (message: string) => void;
  onError?: (err: Error) => void;
  onController?: (controller: AbortController) => void;
  onIgnore: () => void;
}

export interface LLMUsage {
  used: number;
  total: number;
}

export abstract class LLMApi {
  abstract chat(options: ChatOptions): Promise<void>;
  abstract usage(): Promise<LLMUsage>;
}

export type ProviderName = "openai" | "azure" | "claude" | "palm" | "chatGPT";

export function needShowConfig(provider: string): boolean {
  if (provider === "openai") {
    return true;
  } else {
    return false;
  }
}

// every bot message will be tag `ignore == false` if this coversation completes
export function emptyCurrentSessionMessages(): boolean {
  const currentSession = useChatStore.getState().currentSession();
  const messages = currentSession.messages;
  let result = true;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    if (message.role === "assistant" && !message.ignore) {
      result = false;
      break;
    }
  }

  return result;
}

// rules:
// 1. any `openai` model can be switched
// 2. it can be switched if no bot message
export function canSwitchModel(provider: string): boolean {
  if (provider === "openai") {
    return true;
  }

  return emptyCurrentSessionMessages();
}

interface Model {
  name: string;
  provider: ProviderName;
  ctxlen: number;
}

interface ChatProvider {
  name: ProviderName;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    summaryModel: Model;
  };
  models: Model[];

  chat: () => void;
  usage: () => void;
}

export class ClientApi {
  public llm: LLMApi;

  constructor(provider?: ProviderName) {
    if (provider && provider === "chatGPT") {
      this.llm = new ChatGPTChatApi();
      return;
    }

    this.llm = new ChatGPTApi();
  }

  config() {}

  prompts() {}

  masks() {}

  async share(messages: ChatMessage[], avatarUrl: string | null = null) {
    const msgs = messages
      .map((m) => ({
        from: m.role === "user" ? "human" : "gpt",
        value: m.content,
      }))
      .concat([
        {
          from: "human",
          value:
            "Share from [ChatGPT Next Web]: https://github.com/Yidadaa/ChatGPT-Next-Web",
        },
      ]);
    // 敬告二开开发者们，为了开源大模型的发展，请不要修改上述消息，此消息用于后续数据清洗使用
    // Please do not modify this message

    console.log("[Share]", msgs);
    const clientConfig = getClientConfig();
    const proxyUrl = "/sharegpt";
    const rawUrl = "https://sharegpt.com/api/conversations";
    const shareUrl = clientConfig?.isApp ? rawUrl : proxyUrl;
    const res = await fetch(shareUrl, {
      body: JSON.stringify({
        avatarUrl,
        items: msgs,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const resJson = await res.json();
    console.log("[Share]", resJson);
    if (resJson.id) {
      return `https://shareg.pt/${resJson.id}`;
    }
  }
}

export const api = new ClientApi();
export const chatGPTApi = new ClientApi("chatGPT");

export function getHeaders() {
  const accessStore = useAccessStore.getState();
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  };

  const session = sessionStorage.getItem(sessionKey);
  if (!!session) {
    headers[sessionKey] = session;
  }

  return headers;

  const makeBearer = (token: string) => `Bearer ${token.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  // use user's api key first
  if (validString(accessStore.token)) {
    headers.Authorization = makeBearer(accessStore.token);
  } else if (
    accessStore.enabledAccessControl() &&
    validString(accessStore.accessCode)
  ) {
    headers.Authorization = makeBearer(
      ACCESS_CODE_PREFIX + accessStore.accessCode,
    );
  }

  return headers;
}
