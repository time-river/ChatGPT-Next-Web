"user client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Model, ModelSetting } from "../api/user/types";
import { CheatpptStoreKey } from "./constant";
import { useUser } from "./user";

export interface ModelStore {
  default: number;
  models: Model[];

  refresh: (data: ModelSetting) => void;
  setDefault: (_: number) => void;
  getModelById: (_: number) => Model;
};

export const useModels = create<ModelStore>()(
  persist(
    (set, get) => ({
      default: -1,
      models: [],

      refresh: (data: ModelSetting) => {
        const models = data.models;

        useUser.getState().setValid(models.length > 0);
        set(() => ({default: data.default, models: data.models}));
      },
      setDefault: (idx: number) => {
        if (idx < 0 || idx > get().models.length) {
          return;
        }

        set(() => ({default: idx}));
      },
      getModelById: (id: number): Model => {
        const models = get().models;

        for (let i = 0; i < models.length; i++) {
          if (models[i].id === id) {
            return models[i];
          }
        }

        return models[get().default];
      }
    }),
    {
      name: CheatpptStoreKey.Models,
      version: 1,
    }
  )
);