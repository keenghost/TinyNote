import { db } from '../common/db'
import { type IContext, type IMoveReq } from '../types/http'

export default async (ctx: IContext) => {
  const { uid, newPid } = ctx.request.body as IMoveReq

  db.modPid(uid, newPid)
}
