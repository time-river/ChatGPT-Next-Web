"use client";

import { useEffect, useState } from "react";

import { ErrorBoundary } from "../components/error";
import SignUp from "./components/SignUp";

export default function App() {
  const [jsLoaded, setJsLoaded] = useState(false);

  useEffect(() => {
    setJsLoaded(true);
  }, []);

  return <ErrorBoundary>{jsLoaded && <SignUp />}</ErrorBoundary>;
}
