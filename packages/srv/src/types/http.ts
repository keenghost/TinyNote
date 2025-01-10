import { type Context } from 'koa'
import { type IUnit } from './common.js'
import { type EMOD_TYPE } from './enum.js'

export interface IContext<TResBody = Record<string, any>> extends Context {
  body: TResBody
}

export interface IAddReq {
  type: number
  name: string
  pid: number
  ntype: number
}

export interface ICopyReq {
  uid: number
  newPid: number
}

export interface IDelReq {
  uid: number
}

export interface IListRes {
  v: number
  units: {
    unit: IUnit
    mtype: EMOD_TYPE
  }[]
}

export interface ILoginReq {
  username: string
  password: string
}

export interface IModNameReq {
  uid: number
  newName: string
}

export interface IModNotesReq {
  units: { uid: number; newNote: string; notev: number }[]
}

export interface IMoveReq {
  uid: number
  newPid: number
}

export interface IProfileRes {
  webDBPass: string
  webDBPassSign: string
}
