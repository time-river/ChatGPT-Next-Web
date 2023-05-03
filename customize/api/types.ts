export interface HttpOption {
  url: string,
  data?: any,
  headers?: any,
}

export enum Status {
  SUCCESS = "success",
  FAILURE = "failure",
}

export interface Response<T = any> {
  status: Status,
  data?: T,
  message: string,
}

export interface SignUpReq {
  username: string,
  email: string,
  password: string,
  invitation_code: string,
  code: string,
}

export interface SignUpRsp { }

export interface SignInReq {
  username: string,
  password: string,
  code: string,
}

export interface SignInRsp {
  username: string,
  email: string,
  token: string,
}

export type CodeReqType = 'signup' | 'reset'

export interface CodeReq {
  type: CodeReqType,
  username: string,
  email?: string,
  code: string,
}

export interface CodeRsp {
  code: string,
}

export interface ResetReq {
  username: string,
  password: string,
  code: string,
}

export interface ResetRsp { }