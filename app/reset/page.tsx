"use client";

import { ErrorBoundary } from "../components/error";
import Reset from "./components";

// Notice: `async`, only component are allowed here, can't implement componment here
// likes the following, otherwise app will crash
export default async function App() {
  return (
    <ErrorBoundary>
      <Reset />
    </ErrorBoundary>
  );
}
