import { db } from '../common/db'
import { type IContext, type IListRes } from '../types/http'

export default async (ctx: IContext<IListRes>) => {
  const inV = parseInt((ctx.headers['x-newest-v'] as string) || '0', 10)

  const { v, units } = db.getNewest(inV)

  ctx.body = { v, units }
}
