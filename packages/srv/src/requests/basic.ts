import type { IContext, IEmptyRes } from '../types/http'

export default async (ctx: IContext<IEmptyRes>) => {
  ctx.body = 'OK'
}
