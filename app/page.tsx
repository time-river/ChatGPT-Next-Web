"use client";

import AuthGuard from "./layout/AuthGuard";

import { Analytics } from "@vercel/analytics/react";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

// only use this stylesheet in chat page, it will break others display
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";

export default function App() {
  return (
    <AuthGuard>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </AuthGuard>
  );
}
