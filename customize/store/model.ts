"user client";

import { useAppConfig } from "@/app/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Model, PingRsp } from "../api/user/types";
import { CheatpptStoreKey } from "./constant";

export interface ModelStore {
  default: number,
  models: Model[];

  refresh: (data: PingRsp) => void;
  getModelById: (_: number) => Model;
  validModel: (id: number, modelName: string) => boolean;
};

export const useModels = create<ModelStore>()(
  persist(
    (set, get) => ({
      default: -1,
      models: [],

      refresh: (data: PingRsp) => {
        set(() => ({
          models: data.models,
          default: data.defaultModel
        }));
      },
      getModelById: (id: number): Model => {
        const models = get().models;

        for (let i = 0; i < models.length; i++) {
          if (models[i].id === id) {
            return models[i];
          }
        }

        return models[get().default];
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