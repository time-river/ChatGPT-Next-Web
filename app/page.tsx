import { Analytics } from "@vercel/analytics/react";

import AuthGuard from "./layout/AuthGuard";
import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    <AuthGuard>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </AuthGuard>
  );
}
