import { config } from '@src/common/store'
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import {
  type IAddReq,
  type ICopyReq,
  type IDelReq,
  type IListRes,
  type IModNameReq,
  type IModNotesReq,
  type IMoveReq,
  type IProfileRes,
} from 'srv/types'

export type IHttpError = AxiosError

async function request<T, D = any>(inReqConfig: AxiosRequestConfig<D>) {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const searchParamsObject = Object.fromEntries(searchParams.entries())

    return await axios.request<T>({
      ...inReqConfig,
      headers: Object.assign(
        {
          'X-NEWEST-V': config.v,
          'X-PASS-SIGN': config.sign,
        },
        inReqConfig.headers
      ),
      params: Object.assign({}, inReqConfig.params, searchParamsObject),
    })
  } catch (inError) {
    const e = inError as AxiosError

    if (/\/api\//.test(e.request.responseURL)) {
      if (e.response?.status === 401) {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      if (e.response?.status === 400) {
        if (e.response.statusText === 'BAD_PASS_SIGN') {
          // TODO: show error message
        }
      }
    }

    e.status = e.response?.status || 400
    e.message = (e.response?.data as { errmsg: string })?.errmsg || e.message

    throw e
  }
}

export async function httpAdd(inBody: IAddReq) {
  const { data } = await request({
    url: '/api/add',
    method: 'POST',
    data: inBody,
  })

  return data
}

export async function httpCopy(inBody: ICopyReq) {
  const { data } = await request({
    url: '/api/copy',
    method: 'POST',
    data: inBody,
  })

  return data
}

export async function httpDel(inBody: IDelReq) {
  const { data } = await request({
    url: '/api/del',
    method: 'POST',
    data: inBody,
  })

  return data
}

export async function httpList() {
  const { data } = await request<IListRes>({
    url: '/api/list',
    method: 'POST',
  })

  return data
}

export async function httpLogin(username: string, password: string) {
  const { data } = await request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password,
    },
  })

  return data
}

export async function httpLogout() {
  const { data } = await request({
    url: '/api/logout',
    method: 'POST',
  })

  return data
}

export async function httpModName(inBody: IModNameReq) {
  const { data } = await request({
    url: '/api/mod-name',
    method: 'POST',
    data: inBody,
  })

  return data
}

export async function httpModNotes(inBody: IModNotesReq) {
  const { data } = await request({
    url: '/api/mod-note',
    method: 'POST',
    data: inBody,
  })

  return data
}

export async function httpMove(inBody: IMoveReq) {
  const { data } = await request({
    url: '/api/move',
    method: 'POST',
    data: inBody,
  })

  return data
}

export async function httpProfile() {
  const { data } = await request<IProfileRes>({
    url: '/api/profile',
    method: 'POST',
  })

  return data
}

export async function httpStatus() {
  const { data } = await request({
    url: '/api/status',
    method: 'POST',
  })

  return data
}
