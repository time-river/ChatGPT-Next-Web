"use client;"

import axios, { type AxiosResponse, Method, AxiosHeaders } from 'axios';

import globalConfig from '@/global.config';
import { useUser } from '../store/user';
import { HttpOption, Response, Status } from "./types";

const request = axios.create({
    baseURL: globalConfig.apiBaseURL,
})

const whitePaths = [
  "/api/v1/user/signin",
  "/api/v1/user/signup",
  "/api/v1/user/reset",
]

request.interceptors.request.use(
  (config) => {
    const regex = new RegExp(/^(https?:\/\/[^/]+)?(\/[^?#]*)/)
    const url = config.url ?? ""
    const match = regex.exec(url)
    const pathname = match ? match[2] : ""

    // api url must be start with `/api`
    if (pathname.startsWith("/api") && !(pathname in whitePaths)) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      const { getState } = useUser
      const token = getState().token
  
      config.headers.Authorization = `Bearer ${token}`
    }

    console.debug(config.data)

    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)
  
request.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200) {
      console.debug(response.data)
      return response
  }

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

async function http<T = any>(
  method: Method, options: HttpOption
): Promise<Response<T>> {

  const onfulfilled = (response: AxiosResponse<Response<T>>): Promise<Response<T>> => {
    if (response.data.status === Status.SUCCESS) {
      return Promise.resolve(response.data)
    }

    return Promise.reject(response.data.message)
  }

  const onrejected = (error: Response<Error>): Promise<Response<T>> => {
    return Promise.reject(error.toString())
  }

  return await request.request({method, ...options})
                .then(onfulfilled, onrejected)
}

export async function post<T = any>(options: HttpOption): Promise<Response<T>> {
  return await http<T>("POST", options)
}

export async function get<T = any>(options: HttpOption): Promise<Response<T>> {
  return await http<T>("GET", options)
}