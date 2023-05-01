"use client";

import { ErrorBoundary } from "../components/error";

import SignUp from "./components/SignUp";

export default async function App() {
  return (
    <>
      <ErrorBoundary>
        <SignUp />
      </ErrorBoundary>
    </>
  );
}
