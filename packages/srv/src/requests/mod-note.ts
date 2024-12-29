import { db } from '../common/db'
import { type IContext, type IModNotesReq } from '../types/http'

export default async (ctx: IContext) => {
  const { units } = ctx.request.body as IModNotesReq

  db.modNotes(units)
}
