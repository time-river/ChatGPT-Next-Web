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

    console.debug("switch model to: ", model);

    useChatStore.getState().updateCurrentSession((session) => {
      session.mask.modelId = idx;
      session.mask.isChatGPT = model.isChatGPT;

      session.mask.modelConfig.model = model.modelName;
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
            {models.map((v, idx) => (
              <option value={idx} key={v.id}>
                {v.displayName}
              </option>
            ))}
          </select>
        </ListItem>
      </div>
    </>
  );
}
