import { db } from '../common/db'
import { type IAddReq, type IContext } from '../types/http'

export default async (ctx: IContext) => {
  const { type, name, pid, ntype } = ctx.request.body as IAddReq

  db.add({ type, name, pid, ntype })
}
