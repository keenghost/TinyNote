import { db } from '../common/db'
import { type IContext, type ICopyReq } from '../types/http'

export default async (ctx: IContext) => {
  const { uid, newPid } = ctx.request.body as ICopyReq

  db.copy(uid, newPid)
}
