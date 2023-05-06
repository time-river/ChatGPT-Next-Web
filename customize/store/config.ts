import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheatpptStoreKey } from "./constant";
import { useModels } from "./model";

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

const DEFAULT_MODEL_CONFIG = {
  model: "gpt-3.5-turbo", // it's name is abandoned, reserve it just for compatibility
  temperature: 0.5,
  max_tokens: 2000,
  presence_penalty: 0,
  sendMemory: true,
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
};

export const DEFAULT_CONFIG = {
  submitKey: SubmitKey.CtrlEnter as SubmitKey,
  avatar: "1f603",
  fontSize: 14,
  theme: Theme.Auto as Theme,
  tightBorder: true,
  sendPreviewBubble: true,
  sidebarWidth: 300,

  disablePromptHint: false,

  dontShowMaskSplashScreen: false, // dont show splash screen when create chat

  modelConfig: DEFAULT_MODEL_CONFIG, // only used in OpenAI API mode
};

export type ModelConfig = typeof DEFAULT_MODEL_CONFIG;
export type ChatConfig = typeof DEFAULT_CONFIG;
export type ModelType = string;

export type ChatConfigStore = ChatConfig & {
  reset: () => void;
  update: (updater: (config: ChatConfig) => void) => void;
};

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

export function limitModel(idx: number) {
  const { getState } = useModels;
  const models = getState().models;

  return models.some((m) => m.id === idx && m.hasConfig)
    ? models[idx].name
    : DEFAULT_MODEL_CONFIG.model;
}

export const ModalConfigValidator = {
  model(x: number):string {
    return limitModel(x);
  },
  max_tokens(x: number) {
    return limitNumber(x, 0, 32000, 2000);
  },
  presence_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  temperature(x: number) {
    return limitNumber(x, 0, 1, 1);
  },
};

export const useAppConfig = create<ChatConfigStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,

      reset() {
        set(() => ({ ...DEFAULT_CONFIG }));
      },

      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
    }),
    {
      name: CheatpptStoreKey.Config,
      version: 2,
      migrate(persistedState, version) {
        if (version === 2) return persistedState as any;

        const state = persistedState as ChatConfig;
        state.modelConfig.sendMemory = true;
        state.modelConfig.historyMessageCount = 4;
        state.modelConfig.compressMessageLengthThreshold = 1000;
        state.dontShowMaskSplashScreen = false;

        return state;
      },
    },
  ),
);
