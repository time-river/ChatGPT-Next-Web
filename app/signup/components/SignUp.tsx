"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

// https://mui.com/material-ui/guides/minimizing-bundle-size/
import Avatar from "@mui/material/Avatar";
import { AlertColor } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import ReCAPTCHA from "react-google-recaptcha";

import Copyright from "@/customize/components/Copyright";
import Alert from "@/customize/components/Alert";
import { t } from "@/customize/helper";
import globalCfg from "@/global.config";
import { fetchCode, fetchSignUp } from "@/customize/api/user/user";
import {
  CodeReq,
  CodeRsp,
  Response,
  SignUpReq,
  SignUpRsp,
  Status,
} from "@/customize/api/user/types";

const theme = createTheme();
const captchaRef = React.createRef<ReCAPTCHA>();

export default function SignUp() {
  const router = useRouter();

  const [seconds, setSeconds] = React.useState(-1);
  const [canSend, setCanSend] = React.useState(true);
  const [sended, setSended] = React.useState(false);
  const [sendText, setSendText] = React.useState(t("Verify"));
  const [open, setOpen] = React.useState(false);
  const [tipStatus, setTipStatus] = React.useState(false);
  const [tipText, setTipText] = React.useState<string | null>("");
  const [tipType, setTipType] = React.useState<AlertColor>("success");
  const [registered, setRegistered] = React.useState(false);

  const [usernameText, setUsernameText] = React.useState("");
  const [usernameHelperText, setUsernameHelperText] = React.useState<
    string | null
  >("");
  const [emailText, setEmailText] = React.useState("");
  const [emailHelperText, setEmailHelperText] = React.useState<string | null>(
    "",
  );
  const [passwdText, setPasswdText] = React.useState("");
  const [passwdHelperText, setPasswdHelperText] = React.useState<string | null>(
    "",
  );
  const [reenteredPasswdText, setReenteredPasswdText] = React.useState("");
  const [reenteredPasswdError, setReenteredPasswdError] = React.useState(false);
  const [reenteredPasswdHelperText, setReenteredPasswdHelperText] =
    React.useState<string | null>("");

  const usenamePattern = globalCfg.user.usenamePattern;
  const emailPattern = globalCfg.user.emailPattern;
  const passwdPattern = globalCfg.user.passwdPattern;

  const SITE_KEY = globalCfg.recaptchaKey;
  const RESEND_TIME = 120;
  const TIPES_TIME = 5000;

  let submited = false;

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

  const handleOpen = () => {
    if (usernameText === "" || emailText === "") {
      return;
    }

    // reset captcah every challenge
    captchaRef.current?.reset();
    setOpen(true);
  };

  const handleTipClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setTipStatus(false);
  };

  const handleRequestCode = (value: string | null) => {
    if (value == null) {
      setTipType("error");
      setTipText(t("UnknowError"));
      setOpen(false);
      setTipStatus(true);
      return;
    }

    setCanSend(false);

    const data: CodeReq = {
      type: "signup",
      username: usernameText,
      email: emailText,
      code: value,
    };

    fetchCode(
      data,
      (response: Response<CodeRsp>) => {
        setSeconds(RESEND_TIME);
        setTipType("success");
        setSended(true);
        setTipText(response.message);

        setTimeout(() => {
          setOpen(false);
          setTipStatus(true);
        }, 1000);
      },
      (error: any) => {
        setSeconds(10);
        setTipType("error");
        setSended(false);
        setTipText(error.toString());

        setTimeout(() => {
          setOpen(false);
          setTipStatus(true);
        }, 1000);
      },
    );
  };

  const usernameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pattern = new RegExp(usenamePattern);
    const target = event.target as HTMLInputElement;
    const data = target.value;

    if (pattern.test(data)) {
      setUsernameHelperText("");
      setUsernameText(data);
    } else {
      setUsernameText("");
      setUsernameHelperText(t("UsernameHelper"));
    }
  };

  const emailOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pattern = new RegExp(emailPattern);
    const target = event.target as HTMLInputElement;
    const data = target.value;

    if (pattern.test(data)) {
      setEmailHelperText("");
      setEmailText(data);
    } else {
      setEmailText("");
      setEmailHelperText(t("EmailHelper"));
    }
  };

  const passwdOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pattern = new RegExp(passwdPattern);
    const target = event.target as HTMLInputElement;
    const data = target.value;

    if (pattern.test(data)) {
      setPasswdHelperText("");
      setPasswdText(data);
      if (data !== reenteredPasswdText) {
        setReenteredPasswdError(true);
        setReenteredPasswdHelperText(t("PasswdNotMatch"));
      } else {
        setReenteredPasswdError(false);
        setReenteredPasswdHelperText("");
      }
      setReenteredPasswdError(data !== reenteredPasswdText);
    } else {
      setPasswdText("");
      setReenteredPasswdError(data !== reenteredPasswdText);
      setPasswdHelperText(t("PasswdHelper"));
    }
  };

  const reenteredPasswdOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const target = event.target as HTMLInputElement;
    const data = target.value;

    if (passwdText !== data) {
      setReenteredPasswdText(data);
      setReenteredPasswdError(true);
      setReenteredPasswdHelperText(t("PasswdNotMatch"));
    } else {
      setReenteredPasswdHelperText("");
      setReenteredPasswdError(false);
      setReenteredPasswdText(data);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* disable trigger by verification code button */
    if (!submited) {
      return;
    } else if (passwdText === "" || passwdText !== reenteredPasswdText) {
      return;
    }

    setRegistered(true);

    const rawData = new FormData(event.currentTarget);
    // form container has ensured the following can't be empty except `invitationCode`
    const inv = rawData.get("invitationCode");
    const code = rawData.get("code");
    const data: SignUpReq = {
      username: usernameText,
      email: emailText,
      password: passwdText,
      invitationCode: inv ? (inv as string) : "",
      code: code ? (code as string) : "",
    };

    fetchSignUp(
      data,
      (response: Response<SignUpRsp>) => {
        setTipText(response.message);
        setTipType("success");
        setTipStatus(true);

        setTimeout(() => {
          // have force refreshed recaptcha to avoid empty element
          // it's safe to not reload page here
          router.push("/signin");
        }, 1500);
      },
      (error: any) => {
        setTipText(error.toString());
        setTipType("error");
        setTipStatus(true);
        setRegistered(false);
      },
    );
  };

  const codeOnError = () => {
    setTipType("error");
    setTipText(t("UnknowError"));
    setTipStatus(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={tipStatus}
          onClose={handleTipClose}
          autoHideDuration={TIPES_TIME}
        >
          <Alert severity={tipType} sx={{ width: "100%" }}>
            {tipText}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("SignUp")}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label={t("Username")}
                  name="username"
                  onChange={usernameOnChange}
                  inputProps={{ pattern: usenamePattern }}
                  helperText={usernameHelperText}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("Email")}
                  name="email"
                  onChange={emailOnChange}
                  inputProps={{ pattern: emailPattern }}
                  helperText={emailHelperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={sended}
                  fullWidth
                  name="password"
                  label={t("Passwd")}
                  type="password"
                  id="password"
                  onChange={passwdOnChange}
                  inputProps={{ pattern: passwdPattern }}
                  helperText={passwdHelperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={sended}
                  fullWidth
                  name="reenteredPassword"
                  label={t("ReenteredPasswd")}
                  type="password"
                  id="reenteredPassword"
                  helperText={reenteredPasswdHelperText}
                  onChange={reenteredPasswdOnChange}
                  error={reenteredPasswdError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={false}
                  fullWidth
                  name="invitationCode"
                  label={t("InvitationCode")}
                  id="invitationCode"
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  required={sended}
                  fullWidth
                  id="code"
                  label={t("VerificationCode")}
                  name="code"
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
            <Button
              id="signup"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                submited = true;
              }}
              disabled={registered}
            >
              {t("SignUp")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  {t("SignInIfReg")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
