import { db } from '../common/db.js'
import { type IContext, type IModNameReq } from '../types/http.js'

export default async (ctx: IContext) => {
  const { uid, newName } = ctx.request.body as IModNameReq

  db.modName(uid, newName)
}
