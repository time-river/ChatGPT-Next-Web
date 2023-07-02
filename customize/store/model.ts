"user client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Model } from "../api/user/types";
import { CheatpptStoreKey } from "./constant";

export interface ModelStore {
  models: Model[];

  refresh: (data: Model[]) => void;
  getModelById: (_: number) => Model;
  validModel: (id: number, modelName: string) => boolean;
};

export const useModels = create<ModelStore>()(
  persist(
    (set, get) => ({
      models: [],

      refresh: (models: Model[]) => {
        set(() => ({models}));
      },
      getModelById: (id: number): Model => {
        const models = get().models;

        for (let i = 0; i < models.length; i++) {
          if (models[i].id === id) {
            return models[i];
          }
        }

        return models[0];
      },
      validModel: (id: number, modelName: string): boolean => {
        const models = get().models;

        for (let i = 0; i < models.length; i++) {
          const model = models[i];

          if (model.id === id && model.modelName === modelName) {
            return true;
          }
        }
        return false
      },
    }),
    {
      name: CheatpptStoreKey.Models,
      version: 1,
    }
  )
);