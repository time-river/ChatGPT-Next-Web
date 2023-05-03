"use client";

import * as React from "react";

import { AlertColor } from "@mui/material/Alert";

export interface VerificationProps {
  setTipType: React.Dispatch<React.SetStateAction<AlertColor>>;
  setTipStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setTipText: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export interface PasswdProps {
  username: string;
  code: string;

  onSuccess: (_: string) => void;
  onFailure: (_: string) => void;
}

export type SubmitHandle = {
  submitCheck: () => boolean;
  submit: () => void | boolean;
};
