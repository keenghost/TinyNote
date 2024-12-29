import { db } from '../common/db'
import { type IContext, type IModNameReq } from '../types/http'

export default async (ctx: IContext) => {
  const { uid, newName } = ctx.request.body as IModNameReq

  db.modName(uid, newName)
}
