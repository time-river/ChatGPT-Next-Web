"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SubmitHandle, PasswdProps } from "./types";

import { t } from "@/customize/helper";
import globalConfig from "@/global.config";
import { ResetReq, ResetRsp, Response } from "@/customize/api/user/types";
import { fetchReset } from "@/customize/api/user/user";

const PasswdForm = (props: PasswdProps, ref: React.Ref<SubmitHandle>) => {
  const [passwdFocus, setPasswdFocus] = React.useState(false);
  const [rePasswdFocus, setRePasswdFocus] = React.useState(false);
  const [passwdText, setPasswdText] = React.useState("");
  const [passwdHelperText, setPasswdHelperText] = React.useState("");
  const [rePasswdText, setRepasswdText] = React.useState("");
  const [rePasswdHelperText, setRePasswdHelperText] = React.useState("");
  const [rePasswdError, setRePasswdError] = React.useState(false);

  const passwdPattern = globalConfig.user.passwdPattern;

  function handlePasswdFocus() {
    setPasswdFocus(true);
    setRePasswdFocus(false);
  }

  function handleRePasswdFocus() {
    setPasswdFocus(false);
    setRePasswdFocus(true);
  }

  function passwdOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const pattern = new RegExp(passwdPattern);
    const target = event.target as HTMLInputElement;
    const data = target.value;

    if (pattern.test(data)) {
      setPasswdHelperText("");
      setPasswdText(data);
      if (data !== rePasswdText) {
        setRePasswdError(true);
        setRePasswdHelperText(t("PasswdNotMatch"));
      } else {
        setRePasswdError(false);
        setRePasswdHelperText("");
      }
      setRePasswdError(data !== rePasswdText);
    } else {
      setPasswdText("");
      setRePasswdError(data !== rePasswdText);
      setPasswdHelperText(t("PasswdHelper"));
    }
  }

  function rePasswdChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const data = target.value;

    if (passwdText !== data) {
      setRepasswdText(data);
      setRePasswdError(true);
      setRePasswdHelperText(t("PasswdNotMatch"));
    } else {
      setRePasswdHelperText("");
      setRePasswdError(false);
      setRepasswdText(data);
    }
  }

  React.useImperativeHandle(ref, () => ({
    submitCheck: (): boolean => {
      if (passwdText === "") {
        handlePasswdFocus();
        return false;
      } else if (passwdText !== rePasswdText) {
        handleRePasswdFocus();
        return false;
      }

      return true;
    },
    submit: () => {
      if (!props.username || !props.code) {
        props.onFailure(t("UnknowError"));
        return;
      }

      const data: ResetReq = {
        username: props.username as string,
        code: props.code as string,
        password: passwdText,
      };

      fetchReset(
        data,
        (response: Response<ResetRsp>) => {
          props.onSuccess(response.message);
        },
        (error: any) => {
          props.onFailure(error.toString());
        },
      );
    },
  }));

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t("ChangePasswd")}
      </Typography>
      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="passwd"
          label={t("Passwd")}
          type="password"
          name="passwd"
          focused={passwdFocus}
          onFocus={handlePasswdFocus}
          onChange={passwdOnChange}
          inputProps={{ pattern: passwdPattern }}
          helperText={passwdHelperText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="reenteredpasswd"
          label={t("ReenteredPasswd")}
          type="password"
          id="reenteredpasswd"
          focused={rePasswdFocus}
          onFocus={handleRePasswdFocus}
          onChange={rePasswdChange}
          helperText={rePasswdHelperText}
          error={rePasswdError}
        />
      </Box>
    </React.Fragment>
  );
};

export default React.forwardRef(PasswdForm);
