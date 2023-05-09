"use client";

import { useEffect, useState } from "react";

import { ErrorBoundary } from "../components/error";
import SignIn from "./components/SignIn";

// begin to render until all of components has been loaded to prevent deadloop
export default function App() {
  const [jsLoaded, setJsLoaded] = useState(false);

  useEffect(() => {
    setJsLoaded(true);
  }, []);

  return <ErrorBoundary>{jsLoaded && <SignIn />}</ErrorBoundary>;
}
