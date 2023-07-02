import { v4 as uuidv4, parse as uuidParse } from "uuid";

import {
  ChatMessage,
  ChatSession,
  createMessage,
  useChatStore,
} from "@/app/store";
import { prettyObject } from "@/app/utils/format";
import { ChatControllerPool } from "../client/controller";
import {
  chatGPTApi,
  ConversationOptions,
  LLMConfig,
  RequestMessage,
} from "../client/api";

function getChatgptOptions(): ConversationOptions {
  const chatStore = useChatStore.getState();

  const session = chatStore.currentSession();
  const messages: ChatMessage[] = session.messages;
  const n = messages.length;
  const messageId = uuidv4();

  for (let i = n - 1; i >= 0; i -= 1) {
    // filter error msg and user msg
    if (messages[i].isError || messages[i].role !== "assistant") {
      continue;
    }

    if (messages[i].messageId) {
      return {
        messageId: messageId,
        conversationId: session.conversationId,
        parentMessageId: messages[i].messageId,
      };
    }
  }

  return { messageId: uuidv4() };
}

export async function requestChatStream(content: string) {
  const chatStore = useChatStore.getState();

  const conversationOptions = getChatgptOptions();
  const reqMsg: RequestMessage = {
    role: "user",
    content: content,
    messageId: conversationOptions.messageId,
  };

  const userMessage: ChatMessage = createMessage({
    ...reqMsg,
    parentMessageId: conversationOptions.parentMessageId,
  });

  const botMessage: ChatMessage = createMessage({
    role: "assistant",
    streaming: true,
    id: userMessage.id! + 1,
  });

  const sessionIndex = chatStore.currentSessionIndex;
  const currentSession = chatStore.currentSession();
  const messageIndex = currentSession.messages.length + 1;

  chatStore.updateCurrentSession((session) => {
    session.messages.push(userMessage);
    session.messages.push(botMessage);
  });

  const config: LLMConfig = {
    model: currentSession.mask.modelConfig.model,
  };

  // make request
  chatGPTApi.llm.chat({
    messages: [reqMsg],
    config: { ...config, stream: true },
    onUpdate(message, chunk: any) {
      const options = chunk as ConversationOptions;

      botMessage.streaming = true;
      if (message) {
        botMessage.content = message;
        botMessage.messageId = options.messageId;
        botMessage.parentMessageId = options.parentMessageId;
      }
      useChatStore.getState().updateCurrentSession((session) => {
        session.messages = session.messages.concat();
        session.conversationId = options.conversationId;
      });
    },
    onFinish(message) {
      botMessage.streaming = false;
      if (message) {
        botMessage.content = message;
        useChatStore.getState().onNewMessage(botMessage);
      }
      ChatControllerPool.remove(sessionIndex, botMessage.id ?? messageIndex);
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
      useChatStore.getState().updateCurrentSession((session) => {
        session.messages = session.messages.concat();
      });
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
