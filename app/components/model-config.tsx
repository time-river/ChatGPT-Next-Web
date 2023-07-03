import {
  ALL_MODELS,
  ModalConfigValidator,
  ModelConfig,
  useAppConfig,
} from "../store";

import Locale from "../locales";
import { InputRange } from "./input-range";
import { ListItem, Select } from "./ui-lib";
import { useModels } from "@/customize/store/model";
import { useState } from "react";
import { emptyCurrentSessionMessages, needShowConfig } from "../client/api";
import { useLocation } from "react-router-dom";
import { Path } from "../constant";
import { Model } from "@/customize/api/user/types";

export function ModelConfigList(props: {
  modelConfig: ModelConfig;
  updateConfig: (updater: (config: ModelConfig) => void) => void;
}) {
  // modelConfig is from `useAppConfig`
  const models = useModels.getState().models;
  const show = needShowConfig(props.modelConfig.provider);
  const [showConfig, setShowConfig] = useState(show);
  const location = useLocation();
  const settingsPath = location.pathname === Path.Settings;
  let validModelsIdx = [props.modelConfig.idx]; // must include the current model

  // only home page need filter model, likes `nextModel()` in `nextModel()`.
  // it's home page.
  if (!settingsPath) {
    for (let i = 0; i < models.length; i++) {
      const elem = models[i];

      if (
        props.modelConfig.provider === "openai" &&
        elem.provider === props.modelConfig.provider
      ) {
        validModelsIdx.push(i);
      } else if (emptyCurrentSessionMessages()) {
        validModelsIdx.push(i);
      }
    }
  } else {
    validModelsIdx = Array.from(models.keys());
  }

  return (
    <>
      <ListItem title={Locale.Settings.Model}>
        <Select
          value={props.modelConfig.idx}
          onChange={(e) => {
            const idx = Number(e.currentTarget.value);
            const model = models[idx];

            setShowConfig(needShowConfig(model.provider));

            props.updateConfig((config) => {
              config.model = model.modelName;

              // customize members
              config.idx = idx;
              config.displayName = model.displayName;
              config.provider = model.provider;
            });
          }}
        >
          {models.map(
            (v, idx) =>
              validModelsIdx.includes(idx) && (
                <option value={idx} key={v.id}>
                  {v.displayName}
                </option>
              ),
          )}
        </Select>
      </ListItem>

      {showConfig && (
        <>
          <ListItem
            title={Locale.Settings.Temperature.Title}
            subTitle={Locale.Settings.Temperature.SubTitle}
          >
            <InputRange
              value={props.modelConfig.temperature?.toFixed(1)}
              min="0"
              max="1" // lets limit it to 0-1
              step="0.1"
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.temperature = ModalConfigValidator.temperature(
                      e.currentTarget.valueAsNumber,
                    )),
                );
              }}
            ></InputRange>
          </ListItem>
          <ListItem
            title={Locale.Settings.MaxTokens.Title}
            subTitle={Locale.Settings.MaxTokens.SubTitle}
          >
            <input
              type="number"
              min={100}
              max={32000}
              value={props.modelConfig.max_tokens}
              onChange={(e) =>
                props.updateConfig(
                  (config) =>
                    (config.max_tokens = ModalConfigValidator.max_tokens(
                      e.currentTarget.valueAsNumber,
                    )),
                )
              }
            ></input>
          </ListItem>
          <ListItem
            title={Locale.Settings.PresencePenalty.Title}
            subTitle={Locale.Settings.PresencePenalty.SubTitle}
          >
            <InputRange
              value={props.modelConfig.presence_penalty?.toFixed(1)}
              min="-2"
              max="2"
              step="0.1"
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.presence_penalty =
                      ModalConfigValidator.presence_penalty(
                        e.currentTarget.valueAsNumber,
                      )),
                );
              }}
            ></InputRange>
          </ListItem>

          <ListItem
            title={Locale.Settings.FrequencyPenalty.Title}
            subTitle={Locale.Settings.FrequencyPenalty.SubTitle}
          >
            <InputRange
              value={props.modelConfig.frequency_penalty?.toFixed(1)}
              min="-2"
              max="2"
              step="0.1"
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.frequency_penalty =
                      ModalConfigValidator.frequency_penalty(
                        e.currentTarget.valueAsNumber,
                      )),
                );
              }}
            ></InputRange>
          </ListItem>

          <ListItem
            title={Locale.Settings.InputTemplate.Title}
            subTitle={Locale.Settings.InputTemplate.SubTitle}
          >
            <input
              type="text"
              value={props.modelConfig.template}
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.template = e.currentTarget.value),
                )
              }
            ></input>
          </ListItem>

          <ListItem
            title={Locale.Settings.HistoryCount.Title}
            subTitle={Locale.Settings.HistoryCount.SubTitle}
          >
            <InputRange
              title={props.modelConfig.historyMessageCount.toString()}
              value={props.modelConfig.historyMessageCount}
              min="0"
              max="32"
              step="1"
              onChange={(e) =>
                props.updateConfig(
                  (config) =>
                    (config.historyMessageCount = e.target.valueAsNumber),
                )
              }
            ></InputRange>
          </ListItem>

          <ListItem
            title={Locale.Settings.CompressThreshold.Title}
            subTitle={Locale.Settings.CompressThreshold.SubTitle}
          >
            <input
              type="number"
              min={500}
              max={4000}
              value={props.modelConfig.compressMessageLengthThreshold}
              onChange={(e) =>
                props.updateConfig(
                  (config) =>
                    (config.compressMessageLengthThreshold =
                      e.currentTarget.valueAsNumber),
                )
              }
            ></input>
          </ListItem>
          <ListItem title={Locale.Memory.Title} subTitle={Locale.Memory.Send}>
            <input
              type="checkbox"
              checked={props.modelConfig.sendMemory}
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.sendMemory = e.currentTarget.checked),
                )
              }
            ></input>
          </ListItem>
        </>
      )}
    </>
  );
}
