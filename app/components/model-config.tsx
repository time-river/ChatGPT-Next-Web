import * as React from "react";
import Locale from "../locales";
import { InputRange } from "./input-range";

import { List, ListItem, Select } from "./ui-lib";
import { useModels } from "@/customize/store/model";
import { ModalConfigValidator, ModelConfig } from "@/customize/store/config";

export function ModelConfigList(props: {
  modelConfig: ModelConfig;
  updateConfig: (updater: (config: ModelConfig) => void) => void;
}) {
  const { getState } = useModels;
  const models = getState().models;
  const [current, setCurrent] = React.useState(getState().current);
  const [showConfig, setShowConfig] = React.useState(models[current].isChatGPT);

  return (
    <>
      <ListItem title={Locale.Settings.Model}>
        <Select
          value={current}
          onChange={(e) => {
            const idx = Number(e.currentTarget.value);
            const model = models[idx];

            setCurrent(idx);
            setShowConfig(model.isChatGPT);
            getState().setCurrent(idx);

            props.updateConfig(
              (config) =>
                (config.model = ModalConfigValidator.model(
                  Number(e.currentTarget.value),
                )),
            );
          }}
        >
          {models.map((v) => (
            <option value={v.id} key={v.id}>
              {v.displayName}
            </option>
          ))}
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
