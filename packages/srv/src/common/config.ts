import fs from 'node:fs'
import path from 'node:path'
import { nanoid, toJSON } from './utils'

export interface IConfig {
  username: string
  password: string
  port: number
  token_secret: string
  web_db_pass: string
}

const configPath = path.resolve('runtime/config.json')
const configStr = fs.existsSync(configPath)
  ? fs.readFileSync(configPath, { encoding: 'utf-8' })
  : '{}'

class Config {
  #defaultConf: IConfig = {
    username: 'admin',
    password: 'admin',
    port: 7777,
    token_secret: '',
    web_db_pass: '',
  }
  #envConf: Partial<IConfig> = {
    username: process.env['WEB_USER'] || '',
    password: process.env['WEB_PASS'] || '',
    port: parseInt(process.env['WEB_PORT'] || '0', 10) || 0,
    token_secret: process.env['TOKEN_SECRET'] || '',
    web_db_pass: process.env['WEB_DB_PASS'] || '',
  }
  #userConf: Partial<IConfig> = toJSON<IConfig>(configStr)

  constructor() {
    if (!this.#userConf.token_secret && !this.#envConf.token_secret) {
      this.modify({ token_secret: nanoid(32) })
    }

    if (!this.#userConf.web_db_pass && !this.#envConf.web_db_pass) {
      this.modify({ web_db_pass: nanoid(32) })
    }
  }

  modify(inConf: Partial<IConfig>) {
    this.#userConf = Object.assign({}, this.#userConf, inConf)

    fs.writeFileSync(configPath, JSON.stringify(this.#userConf, void 0, 2), {
      encoding: 'utf-8',
    })
  }

  get<K extends keyof IConfig>(inKey: K): IConfig[K] {
    return this.#envConf[inKey] || this.#userConf[inKey] || this.#defaultConf[inKey]
  }
}

export const config = new Config()
