import { Analytics } from "@vercel/analytics/react";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

// only use this stylesheet in home page, it will break others display
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";

export default async function App() {
  return (
    <>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
