"use client";

import { useEffect, useState } from "react";

import Reset from "./components";

export default function App() {
  const [jsLoaded, setJsLoaded] = useState(false);

  useEffect(() => {
    setJsLoaded(true);
  }, []);

  return <>{jsLoaded && <Reset />}</>;
}
