import { AxiosHeaders } from "axios"

export interface HttpOption {
  url: string;
  data?: any;
  headers?: AxiosHeaders;
}

export enum Status {
  SUCCESS = "success",
  FAILURE = "failure",
}

export const sessionKey = "X-SessionId"

export interface Response<T = any> {
  status: Status;
  data?: T;
  message: string;
}

export interface SignUpReq {
  username: string;
  email: string;
  password: string;
  invitationCode: string;
  code: string;
}

export interface SignUpRsp { }

export interface SignInReq {
  username: string;
  password: string;
  code: string;
}

export interface SignInRsp {
  username: string;
  email: string;
  token: string;
}

export type CodeReqType = 'signup' | 'reset'

export interface CodeReq {
  type: CodeReqType;
  username: string;
  email?: string;
  code: string;
}

export interface CodeRsp {}

export interface ResetReq {
  username: string;
  password: string;
  code: string;
}

export interface ResetRsp { }

export interface Model {
  id: number;
  displayName: string;
  modelName: string;
  provider: string;
  inputCoins: number;
  outputCoins: number;
  activated: boolean;
  comment: string;
  createAt: number;
};

export interface PingRsp {
  sessionId: string;
  models: Model[];
}