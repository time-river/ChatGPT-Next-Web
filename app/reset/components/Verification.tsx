"use client";

import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ReCAPTCHA from "react-google-recaptcha";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";

import { t } from "@/customize/helper";
import globalCfg from "@/global.config";
import { SubmitHandle, VerificationProps } from "./types";
import { fetchCode } from "@/customize/api/user";
import { CodeReq, CodeRsp, Response } from "@/customize/api/types";

const captchaRef = React.createRef<ReCAPTCHA>();

const VerificationForm = (
  props: VerificationProps,
  ref: React.Ref<SubmitHandle>,
) => {
  const [seconds, setSeconds] = React.useState(-1);
  const [sended, setSended] = React.useState(false);
  const [canSend, setCanSend] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [sendText, setSendText] = React.useState(t("Verify"));
  const [usernameFocus, setUsernameFocus] = React.useState(false);
  const [codeFocus, setCodeFocus] = React.useState(false);

  const SITE_KEY = globalCfg.recaptchaKey;
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

  const handleOpen = () => {
    const usernameElem: HTMLInputElement = document.getElementById(
      "username",
    ) as HTMLInputElement;
    const username = usernameElem.value.trim();

    if (username === "") {
      return;
    }

    // reset captcah every challenge
    captchaRef.current?.reset();
    setOpen(true);
  };

  const codeOnError = () => {
    props.setTipType("error");
    props.setTipText(t("UnknowError"));
    props.setTipStatus(true);
  };

  const handleRequestCode = (value: string | null) => {
    if (value == null) {
      props.setTipType("error");
      props.setTipText(t("UnknowError"));
      setOpen(false);
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
      code: value,
    };

    fetchCode(
      data,
      (response: Response<CodeRsp>) => {
        setSeconds(RESEND_TIME);
        props.setTipText(response.message);
        props.setTipType("success");
        setSended(true);

        setTimeout(() => {
          setOpen(false);
          props.setTipStatus(true);
        }, 1000);
      },
      (error: any) => {
        setSeconds(10);
        props.setTipType("error");
        setSended(false);
        props.setTipText(error.toString());

        setTimeout(() => {
          setOpen(false);
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
            onClick={handleOpen}
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
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
            onClick={() => {
              setOpen(false);
            }}
          >
            <ReCAPTCHA
              style={{ display: "inline-block" }}
              sitekey={SITE_KEY}
              onChange={handleRequestCode}
              type="image"
              theme="light"
              ref={captchaRef}
              onErrored={codeOnError}
            />
          </Backdrop>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default React.forwardRef(VerificationForm);
