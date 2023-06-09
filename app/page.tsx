"use client";

import React from "react";
import { fetchPing } from "@/customize/api/user/user";

import { Analytics } from "@vercel/analytics/react";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

// only use this stylesheet in home page, it will break others display
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";

export default function App() {
  React.useEffect(() => {
    // request session when opening chat
    fetchPing();
  }, []);

  return (
    <>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
