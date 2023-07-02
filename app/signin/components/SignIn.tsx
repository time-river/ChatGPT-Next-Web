"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

// https://mui.com/material-ui/guides/minimizing-bundle-size/
import Avatar from "@mui/material/Avatar";
import { AlertColor } from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";

import Locale from "../../locales";
import Copyright from "../../components/Copyright";
import Alert from "../../components/Alert";
import globalCfg from "@/global.config";
import { fetchSignIn } from "@/customize/api/user/user";
import { Response, SignInReq, SignInRsp } from "@/customize/api/user/types";
import { useUser } from "@/customize/store/user";

const theme = createTheme();

export default function SignIn() {
  const router = useRouter();

  const captchaRef = React.useRef<TurnstileInstance>();
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaDone, setCaptchaDone] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState("");

  const [logined, setLogined] = React.useState(false);
  const [tipStatus, setTipStatus] = React.useState(false);
  const [tipText, setTipText] = React.useState<string | null>("");
  const [tipType, setTipType] = React.useState<AlertColor>("success");

  const SITE_KEY = globalCfg.captchaKey;
  const TIPES_TIME = 5000;

  const handleTipClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setTipStatus(false);
  };

  const captchaOnSuccess = (value: string) => {
    setCaptchaDone(true);
    setCaptchaToken(value);
    setTipStatus(false);
  };

  const captchaOnBeforeInteractive = () => {
    setShowCaptcha(true);
  };

  const captchaOnExpire = () => {
    setCaptchaDone(false);
    captchaRef.current?.reset();
    setShowCaptcha(true);
  };

  const requestSignIn = (data: SignInReq) => {
    setLogined(true);

    fetchSignIn(
      data,
      (response: Response<SignInRsp>) => {
        if (!response.data) {
          new Error(Locale.User.ServerError);
        }

        const data: SignInRsp = response.data!;

        useUser.getState().signIn({ ...data });
        setTipType("success");
        setTipText(response.message);

        setTimeout(() => {
          setTipStatus(true);

          // simulate a mouse click
          // force refresh page to avoid broken css style
          router.back();
        }, 1000);
      },
      (error: any) => {
        setTipType("error");
        setTipText(error.toString());

        setTimeout(() => {
          setTipStatus(true);
          setLogined(false);
        }, 1000);
      },
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const rawData = new FormData(event.currentTarget);
    const username = rawData.get("username");
    const passwd = rawData.get("password");

    if (
      username === null ||
      passwd === null ||
      username === "" ||
      passwd === ""
    ) {
      return;
    }

    if (!captchaDone) {
      // need challenge
      setShowCaptcha(true);
      captchaRef.current?.execute();
      setTipType("error");
      setTipText(Locale.User.InputChallenge);
      setTipStatus(true);
      return;
    }

    const data: SignInReq = {
      username: username as string,
      password: passwd as string,
      code: captchaToken,
    };
    requestSignIn(data);
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
            {Locale.User.SignIn}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={Locale.User.Username}
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={Locale.User.Passwd}
              type="password"
              id="password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={Locale.User.Remember}
            />

            <Turnstile
              style={{ display: showCaptcha ? "block" : "none" }}
              ref={captchaRef}
              siteKey={SITE_KEY}
              onBeforeInteractive={captchaOnBeforeInteractive}
              onSuccess={captchaOnSuccess}
              onExpire={captchaOnExpire}
              options={{ appearance: "always" }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={logined}
            >
              {Locale.User.SignIn}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset" variant="body2">
                  {Locale.User.ForgetPasswd}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {Locale.User.SignUpIfNon}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
