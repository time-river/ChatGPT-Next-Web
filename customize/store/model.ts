"user client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Model, ModelSetting } from "../api/types";
import { CheatpptStoreKey } from "./constant";
import { useUser } from "./user";

export interface ModelStore {
  current: number;
  models: Model[];

  refresh: (data: ModelSetting) => void;
  setCurrent: (_: number) => void;
};

export const useModels = create<ModelStore>()(
  persist(
    (set, get) => ({
      current: -1,
      models: [],

      refresh: (data: ModelSetting) => {
        const models = data.models;

        useUser.getState().setValid(models.length > 0);
        set(() => ({current: data.current, models: data.models}));
      },
      setCurrent: (idx: number) => {
        if (idx < 0 || idx > get().models.length) {
          return;
        }

        set(() => ({current: idx}));
      },
    }),
    {
      name: CheatpptStoreKey.Models,
      version: 1,
    }
  )
);