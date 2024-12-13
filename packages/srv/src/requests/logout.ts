import type { IContext, IEmptyRes } from '../types/http'

export default async (ctx: IContext<IEmptyRes>) => {
  ctx.cookies.set('tinynote_token', null, {
    maxAge: 0,
  })

  ctx.body = 'OK'
}
