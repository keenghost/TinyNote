import type { Context } from 'koa'

export interface IContext<TResBody = Record<string, any>> extends Context {
  body: TResBody
}

export type IEmptyReq = object

export type IEmptyRes = 'OK'

export interface ILoginReq {
  username: string
  password: string
}
