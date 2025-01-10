import { db } from '../common/db.js'
import { type IAddReq, type IContext } from '../types/http.js'

export default async (ctx: IContext) => {
  const { type, name, pid, ntype } = ctx.request.body as IAddReq

  db.add({ type, name, pid, ntype })
}
