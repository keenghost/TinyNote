import crypto from 'node:crypto'
import { config } from '../common/config'
import { type IContext, type IProfileRes } from '../types/http'

const WEB_DB_PASS_SIGN = crypto
  .createHash('md5')
  .update(config.get('web_db_pass'))
  .digest('hex')

export default async (ctx: IContext<IProfileRes>) => {
  ctx.body = {
    webDBPass: config.get('web_db_pass'),
    webDBPassSign: WEB_DB_PASS_SIGN,
  }
}
