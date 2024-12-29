import { db } from '../common/db'
import { type IContext, type IDelReq } from '../types/http'

export default async (ctx: IContext) => {
  const { uid } = ctx.request.body as IDelReq

  db.del(uid)
}
