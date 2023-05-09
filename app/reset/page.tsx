"use client";

import { useEffect, useState } from "react";

import { ErrorBoundary } from "../components/error";
import Reset from "./components";

export default function App() {
  const [jsLoaded, setJsLoaded] = useState(false);

  useEffect(() => {
    setJsLoaded(true);
  }, []);

  return <ErrorBoundary>{jsLoaded && <Reset />}</ErrorBoundary>;
}
