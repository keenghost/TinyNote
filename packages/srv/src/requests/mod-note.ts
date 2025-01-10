import { db } from '../common/db.js'
import { type IContext, type IModNotesReq } from '../types/http.js'

export default async (ctx: IContext) => {
  const { units } = ctx.request.body as IModNotesReq

  db.modNotes(units)
}
