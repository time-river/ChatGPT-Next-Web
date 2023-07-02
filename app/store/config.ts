import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getClientConfig } from "../config/client";
import { DEFAULT_INPUT_TEMPLATE, StoreKey } from "../constant";

import { useModels } from "@/customize/store/model";
import { ProviderName } from "../client/api";

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

const _DEFAULT_CONFIG = {
  submitKey: SubmitKey.CtrlEnter as SubmitKey,
  avatar: "1f603",
  fontSize: 14,
  theme: Theme.Auto as Theme,
  tightBorder: !!getClientConfig()?.isApp,
  sendPreviewBubble: true,
  sidebarWidth: 300,

  disablePromptHint: false,

  dontShowMaskSplashScreen: false, // dont show splash screen when create chat

  modelConfig: {
    model: "gpt-3.5-turbo" as ModelType,
    temperature: 0.5,
    max_tokens: 2000,
    presence_penalty: 0,
    frequency_penalty: 0,
    sendMemory: false,
    historyMessageCount: 4,
    compressMessageLengthThreshold: 1000,
    template: DEFAULT_INPUT_TEMPLATE,

    idx: 0, // model array index
    displayName: "gpt-3.5-turbo",
    provider: "openai" as ProviderName, // type: ProviderName
  },
};

export type ChatConfig = typeof _DEFAULT_CONFIG;

export type ChatConfigStore = ChatConfig & {
  reset: () => void;
  update: (updater: (config: ChatConfig) => void) => void;
};

export type ModelConfig = ChatConfig["modelConfig"];

const ENABLE_GPT4 = true;

export const ALL_MODELS = [
  {
    name: "gpt-4",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-0314",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-0613",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k-0314",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k-0613",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
  {
    name: "qwen-v1", // 通义千问
    available: false,
  },
  {
    name: "ernie", // 文心一言
    available: false,
  },
  {
    name: "spark", // 讯飞星火
    available: false,
  },
  {
    name: "llama", // llama
    available: false,
  },
  {
    name: "chatglm", // chatglm-6b
    available: false,
  },
] as const;

export type ModelType = string;

export function limitNumber(
  x: number,
  min: number,
  max: number,
  defaultValue: number,
) {
  if (typeof x !== "number" || isNaN(x)) {
    return defaultValue;
  }

  return Math.min(max, Math.max(min, x));
}

export function limitModel(idx: number): string {
  const { getState } = useModels;
  const models = getState().models;

  return models[idx].displayName;
}

export const ModalConfigValidator = {
  model(x: number) {
    return limitModel(x) as ModelType;
  },
  max_tokens(x: number) {
    return limitNumber(x, 0, 32000, 2000);
  },
  presence_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  frequency_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  temperature(x: number) {
    return limitNumber(x, 0, 1, 1);
  },
};

export const useAppConfig = create<ChatConfigStore>()(
  persist(
    (set, get) => ({
      ..._DEFAULT_CONFIG,

      reset() {
        var config: ChatConfig = _DEFAULT_CONFIG;
        const modelStore = useModels.getState();
        const idx = modelStore.default;
        const model = modelStore.models[idx];

        config.modelConfig.model = model.modelName;
        config.modelConfig.idx = idx;
        config.modelConfig.displayName = model.displayName;
        config.modelConfig.provider = model.provider;

        set(() => ({ ...config }));
      },

      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
    }),
    {
      name: StoreKey.Config,
      version: 3.2,
      migrate(persistedState, version) {
        if (version === 3.2) return persistedState as any;

        const state = persistedState as ChatConfig;
        state.modelConfig.sendMemory = true;
        state.modelConfig.historyMessageCount = 4;
        state.modelConfig.compressMessageLengthThreshold = 1000;
        state.modelConfig.frequency_penalty = 0;
        state.modelConfig.template = DEFAULT_INPUT_TEMPLATE;
        state.dontShowMaskSplashScreen = false;

        return state;
      },
    },
  ),
);

export const DEFAULT_CONFIG = useAppConfig.getState().modelConfig;
