"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Copyright from "@/customize/components/Copyright";
import Alert from "@/customize/components/Alert";
import { t } from "@/customize/helper";
import { SubmitHandle } from "./types";
import PasswdForm from "./Passwd";
import VerificationForm from "./Verification";

const theme = createTheme();
const codeRef = React.createRef<SubmitHandle>();
const resetRef = React.createRef<SubmitHandle>();

export default function Reset() {
  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [tipStatus, setTipStatus] = React.useState<boolean>(false);
  const [tipText, setTipText] = React.useState<string>("");
  const [tipType, setTipType] = React.useState<AlertColor>("success");
  const [buttonDisable, setButtonDisable] = React.useState(false);
  const [username, setUsername] = React.useState<string>("");
  const [code, setCode] = React.useState<string>("");

  const TIPES_TIME = 5000;
  const STEPS = [t("Verification"), t("PasswdReset")];

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <VerificationForm
            ref={codeRef}
            setTipType={setTipType}
            setTipStatus={setTipStatus}
            setTipText={setTipText}
            setUsername={setUsername}
            setCode={setCode}
          />
        );
      case 1:
        return (
          <PasswdForm
            ref={resetRef}
            setTipType={setTipType}
            setTipStatus={setTipStatus}
            setTipText={setTipText}
            code={code}
            username={username}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (!codeRef.current?.submitCheck()) {
        return;
      }

      if (!codeRef.current?.submit()) {
        return;
      }

      setActiveStep(activeStep + 1);
    } else {
      if (!resetRef.current?.submitCheck()) {
        return;
      }

      setButtonDisable(true);
      if (!resetRef.current?.submit()) {
        return;
      }

      setInterval(() => {
        router.push("/signin");
      }, 1500);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={tipStatus}
        onClose={handleTipClose}
        autoHideDuration={TIPES_TIME}
      >
        <Alert id="alert" severity={tipType} sx={{ width: "100%" }}>
          {tipText}
        </Alert>
      </Snackbar>

      <Container
        component="main"
        maxWidth="xs"
        sx={{ mb: 4, marginTop: "10%" }}
      >
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            {t("ResetPasswd")}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Grid container>
              <Grid item xs sx={{ mt: 4 }}>
                {activeStep === 0 && (
                  <Link href="/signup" variant="body2">
                    {t("SignUpIfNon")}
                  </Link>
                )}
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                  disabled={buttonDisable}
                >
                  {activeStep === STEPS.length - 1 ? t("Confirm") : t("Next")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Copyright />
      </Container>
    </ThemeProvider>
  );
}