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

import ReCAPTCHA from "react-google-recaptcha";

import Copyright from "@/customize/components/Copyright";
import Alert from "@/customize/components/Alert";
import { t } from "@/customize/helper";
import globalCfg from "@/global.config";

const theme = createTheme();
const captchaRef = React.createRef<ReCAPTCHA>();

export default function SignIn() {
  const router = useRouter();

  const [logined, setLogined] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [tipStatus, setTipStatus] = React.useState(false);
  const [tipText, setTipText] = React.useState<string | null>("");
  const [tipType, setTipType] = React.useState<AlertColor>("success");

  const SITE_KEY = globalCfg.recaptchaKey;
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

  const requestSignIn = (value: string | null) => {
    setLogined(true);
    console.log(value);

    setTimeout(() => {
      setTipType("success");
      setTipText(t("SignInOk"));
      setOpen(false);
      setTipStatus(true);

      // simulate a mouse click
      // force refresh page to avoid broken css style
      window.location.href = "/";
    }, 1000);
  };

  // speed up home page loading
  React.useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const passwd = data.get("password");

    if (username === "" || passwd === "") {
      return;
    }

    console.log("1234");
    //captchaRef.current?.reset();
    setOpen(true);
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
            {t("SignIn")}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t("Username")}
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("Passwd")}
              type="password"
              id="password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("Remember")}
            />
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={() => {
                setOpen(false);
              }}
            >
              <ReCAPTCHA
                style={{ display: "inline-block" }}
                sitekey={SITE_KEY}
                onChange={requestSignIn}
                type="image"
                theme="light"
                ref={captchaRef}
                onErrored={codeOnError}
              />
            </Backdrop>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={logined}
            >
              {t("SignIn")}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset" variant="body2">
                  {t("ForgetPasswd")}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {t("SignUpIfNon")}
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
