import { AxiosHeaders } from "axios"

export interface HttpOption {
  url: string,
  data?: any,
  headers?: AxiosHeaders,
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
  invitationCode: string,
  code: string,
}

export interface SignUpRsp { }

export interface SignInReq {
  username: string,
  password: string,
  code: string,
}

export interface Model {
  id: number,
  modelName: string,
  displayName: string,

  isChatGPT: boolean,
};

export interface ModelSetting {
  default: number,
  models: Model[],
};

export interface SignInRsp {
  username: string,
  email: string,
  token: string,

  modelSetting: ModelSetting,
}

export type CodeReqType = 'signup' | 'reset'

export interface CodeReq {
  type: CodeReqType,
  username: string,
  email?: string,
  code: string,
}

export interface CodeRsp {}

export interface ResetReq {
  username: string,
  password: string,
  code: string,
}

export interface ResetRsp { }

