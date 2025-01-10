import { db } from '../common/db.js'
import { type IContext, type ICopyReq } from '../types/http.js'

export default async (ctx: IContext) => {
  const { uid, newPid } = ctx.request.body as ICopyReq

  db.copy(uid, newPid)
}
