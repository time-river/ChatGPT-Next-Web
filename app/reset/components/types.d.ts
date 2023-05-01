"use client";

import * as React from "react";

import { AlertColor } from "@mui/material/Alert";

export type SubmitProps = {
  setTipType: React.Dispatch<React.SetStateAction<AlertColor>>;
  setTipStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setTipText: React.Dispatch<React.SetStateAction<string>>;
  username?: string;
  code?: string;
  setUsername?: React.Dispatch<React.SetStateAction<string>>;
  setCode?: React.Dispatch<React.SetStateAction<string>>;
};

export type SubmitHandle = {
  submitCheck: () => boolean;
  submit: () => boolean;
};
