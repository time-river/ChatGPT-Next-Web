"use client;"

import { get, post } from "./common"
import {
  Response, Status,
  ResetReq, ResetRsp,
  SignInReq, SignInRsp,
  SignUpReq, SignUpRsp,
  CodeReq, CodeRsp, PingRsp,
  sessionKey,
} from "./types"

enum ApiURL {
  signup = "/api/v1/user/signup",
  signin = "/api/v1/user/signin",
  code = "/api/v1/user/code",
  reset  = "/api/v1/user/reset",
  ping = "/api/v1/user/ping",
}

export function fetchSignUp(data: SignUpReq,
onfulfilled: (response: Response<SignUpRsp>) => void,
onrejected: (error: any) => void) {
  const options = {
    url: ApiURL.signup,
    data: data,
  }

  post<SignUpRsp>(options)
  .then(onfulfilled)
  .catch(onrejected)
}

export function fetchSignIn(data: SignInReq,
  onfulfilled: (response: Response<SignInRsp>) => void,
  onrejected: (error: any) => void) {
  const options = {
    url: ApiURL.signin,
    data: data,
  }

  post<SignInRsp>(options)
  .then(onfulfilled)
  .catch(onrejected)
}

export function fetchCode(data: CodeReq,
                      onfulfilled: (response: Response<CodeRsp>) => void,
                      onrejected: (error: any) => void) {
  const options = {
    url: ApiURL.code,
    data: data,
  }

  post<CodeRsp>(options)
    .then(onfulfilled)
    .catch(onrejected)
}

export function fetchReset(data: ResetReq,
  onfulfilled: (response: Response<ResetRsp>) => void,
  onrejected: (error: any) => void) {

  const options = {
    url: ApiURL.reset,
    data: data,
  }

  post<ResetRsp>(options)
    .then(onfulfilled)
    .catch(onrejected)
}

export function fetchPing() {
  const options = {
    url: ApiURL.ping,
  };

  get<PingRsp>(options)
    .then((response: Response<PingRsp>) => {
      const data = response.data;

      if (!data) {
        new Error("Server ERROR");
        return;
      }

      sessionStorage.setItem(sessionKey, data.sessionId)
    }).catch((error: any) => {
      console.log("PING ERROR: ", error);
    })
}
