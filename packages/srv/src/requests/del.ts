import { db } from '../common/db.js'
import { type IContext, type IDelReq } from '../types/http.js'

export default async (ctx: IContext) => {
  const { uid } = ctx.request.body as IDelReq

  db.del(uid)
}
