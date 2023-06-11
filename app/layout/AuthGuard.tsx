import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/customize/store/user";
import { fetchPing } from "@/customize/api/user/user";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export default function AuthGuard({
  children,
}: {
  children: any; // set `any` to prevent `<AuthGuard>` lint warning in `/chat` page
}) {
  const router: AppRouterInstance = useRouter();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(() => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (ignore.current) {
      return;
    }

    ignore.current = true;
    const isAuthenticated = useUser.getState().isSignIn();

    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting");
      router.replace("/signin");
    } else {
      fetchPing();
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.
  return children;
}
