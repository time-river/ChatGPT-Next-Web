"use client";

import * as React from "react";
import Locale from "../locales";
import { ListItem } from "./ui-lib";
import { useChatStore } from "../store";

import { useModels } from "@/customize/store/model";
import {
  ModalConfigValidator,
  ModelConfig,
  useAppConfig,
} from "@/customize/store/config";
import "./model-selection.model.scss";

export function ModelSelection() {
  const session = useChatStore().currentSession();
  const models = useModels().models;
  const [current, setCurrent] = React.useState(session.mask.modelId);

  /* don't show selection if the talk has began */
  if (session.messages.length > 1) {
    return <></>;
  }

  /* allow the former return */
  function modelSelectionOnChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = Number(e.currentTarget.value);

    setCurrent(idx);
    /* only update the current session */
    const model = models[idx];

    useChatStore.getState().updateCurrentSession((session) => {
      session.mask.modelId = idx;
      session.mask.hasModelConfig = model.hasConfig;

      if (model.hasConfig) {
        session.mask.modelConfig.model = model.name;
      }
    });
  }

  return (
    <>
      <div className="selection-header">
        <ListItem title={Locale.Settings.Model}>
          <select
            className="selection-option"
            value={current}
            onChange={modelSelectionOnChange}
          >
            {models.map((v) => (
              <option value={v.id} key={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </ListItem>
      </div>
    </>
  );
}
