"use client";

import { ErrorBoundary } from "../components/error";

import SignIn from "./components/SignIn";

export default async function App() {
  return (
    <>
      <ErrorBoundary>
        <SignIn />
      </ErrorBoundary>
    </>
  );
}
