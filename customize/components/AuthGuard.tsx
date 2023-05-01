"use client";

import * as React from 'react';
import { userStore } from '../user/store';

const whitePaths = new Set([
  "/signin",
  "/signup",
  "/reset",
])

class AuthGuard extends React.Component<any> {
  isLogin(): boolean {
    const { getState } = userStore

    return getState().isSignIn()
  }

  render() {
    let rv = this.props.children;

    // browser code
    if (typeof window != 'undefined') {
      if (!whitePaths.has(window.location.pathname) && !this.isLogin()) {
        window.location.href = "/signin"
        // return immediately to prevent page render
        rv = (<></>);
      } else if (whitePaths.has(window.location.pathname) && this.isLogin()) {
        window.location.href = "/"
        // return immediately to prevent page render
        rv = (<></>);
      }
    }

    return rv;
  }
}

export default AuthGuard;