import { db } from '../common/db.js'
import { type IContext, type IMoveReq } from '../types/http.js'

export default async (ctx: IContext) => {
  const { uid, newPid } = ctx.request.body as IMoveReq

  db.modPid(uid, newPid)
}
