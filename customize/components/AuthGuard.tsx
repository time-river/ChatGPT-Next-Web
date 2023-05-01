"use client";

import * as React from 'react';

const whitePaths = new Set([
  "/signin",
  "/signup",
  "/reset",
])

class AuthGuard extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  isLogin(): boolean {
    return false
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