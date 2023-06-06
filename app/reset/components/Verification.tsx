"use client";

import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";

import { t } from "@/customize/helper";
import globalCfg from "@/global.config";
import { SubmitHandle, VerificationProps } from "./types";
import { fetchCode } from "@/customize/api/user/user";
import { CodeReq, CodeRsp, Response } from "@/customize/api/user/types";

const VerificationForm = (
  props: VerificationProps,
  ref: React.Ref<SubmitHandle>,
) => {
  const captchaRef = React.useRef<TurnstileInstance>();
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaDone, setCaptchaDone] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState("");

  const [seconds, setSeconds] = React.useState(-1);
  const [sended, setSended] = React.useState(false);
  const [canSend, setCanSend] = React.useState(true);
  const [sendText, setSendText] = React.useState(t("Verify"));
  const [usernameFocus, setUsernameFocus] = React.useState(false);
  const [codeFocus, setCodeFocus] = React.useState(false);

  const SITE_KEY = globalCfg.captchaKey;
  const RESEND_TIME = 120;

  React.useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds == 0) {
      setCanSend(true);
      setSendText(t("Reverify"));
    }
    return () => clearInterval(intervalId);
  }, [seconds]);

  const captchaOnSuccess = (value: string) => {
    setCaptchaDone(true);
    setCaptchaToken(value);
    props.setTipStatus(false);
  };

  const captchaOnBeforeInteractive = () => {
    setShowCaptcha(true);
  };

  const captchaOnExpire = () => {
    setCaptchaDone(false);
    captchaRef.current?.reset();
    setShowCaptcha(true);
  };

  const handleUsernameFocus = () => {
    setUsernameFocus(true);
    setCodeFocus(false);
  };

  const handleCodeFocus = () => {
    setUsernameFocus(false);
    setCodeFocus(true);
  };

  function submitCheck(): boolean {
    const usernameElem = document.getElementById(
      "username",
    ) as HTMLInputElement;
    const codeElem = document.getElementById("code") as HTMLInputElement;
    const username = usernameElem.value.trim();
    const code = codeElem.value.trim();

    if (username === "") {
      handleUsernameFocus();
      return false;
    } else if (code === "") {
      handleCodeFocus();
      return false;
    } else {
      return true;
    }
  }

  React.useImperativeHandle(ref, () => ({
    submitCheck: submitCheck,

    submit: (): boolean => {
      // have checked submmit data
      const usernameElem = document.getElementById(
        "username",
      ) as HTMLInputElement;
      const codeElem = document.getElementById("code") as HTMLInputElement;
      const username = usernameElem.value.trim();
      const code = codeElem.value.trim();

      if (props.setUsername != null && props.setCode != null) {
        props.setUsername(username);
        props.setCode(code);
        return true;
      } else {
        props.setTipType("error");
        props.setTipText(t("UnknowError"));
        props.setTipStatus(true);
        return false;
      }
    },
  }));

  const handleRequestCode = () => {
    if (!captchaDone) {
      setShowCaptcha(true);
      captchaRef.current?.execute();
      props.setTipType("error");
      props.setTipText(t("InputChallenge"));
      props.setTipStatus(true);
      return;
    }

    setCanSend(false);

    const usernameElem: HTMLInputElement = document.getElementById(
      "username",
    ) as HTMLInputElement;
    const username = usernameElem.value.trim();

    const data: CodeReq = {
      type: "reset",
      username: username,
      code: captchaToken,
    };

    fetchCode(
      data,
      (response: Response<CodeRsp>) => {
        setSeconds(RESEND_TIME);
        props.setTipText(response.message);
        props.setTipType("success");
        setSended(true);

        setTimeout(() => {
          props.setTipStatus(true);
        }, 1000);
      },
      (error: any) => {
        setSeconds(10);
        props.setTipType("error");
        setSended(false);
        props.setTipText(error.toString());

        setTimeout(() => {
          props.setTipStatus(true);
        }, 1000);
      },
    );
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t("InputUsername")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="username"
            label={t("Username")}
            name="username"
            focused={usernameFocus}
            onFocus={handleUsernameFocus}
            defaultValue={props.defaultUsername}
          />
        </Grid>

        <Grid item xs={9}>
          <TextField
            required={sended}
            fullWidth
            id="code"
            label={t("VerificationCode")}
            name="code"
            focused={codeFocus}
            onFocus={handleCodeFocus}
            defaultValue={props.defaultCode}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            id="verification"
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            onClick={handleRequestCode}
            sx={{
              mt: 0,
              mb: 0,
              minHeight: "70%",
              maxHeight: "70%",
              top: "15%",
            }}
            disabled={!canSend}
          >
            <small>{seconds <= 0 ? `${sendText}` : `${seconds}s`}</small>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Turnstile
            style={{ display: showCaptcha ? "block" : "none" }}
            ref={captchaRef}
            siteKey={SITE_KEY}
            onBeforeInteractive={captchaOnBeforeInteractive}
            onSuccess={captchaOnSuccess}
            onExpire={captchaOnExpire}
            options={{ appearance: "always" }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default React.forwardRef(VerificationForm);
