import koa from 'koa'
import koaBodyParser from 'koa-bodyparser'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import router from './router.js'

const app = new koa()

app.on('error', () => {})

app.use(koaBodyParser())
app.use(router.routes())
app.use(
  koaMount(
    '/assets',
    koaStatic(path.resolve('public/assets'), { maxAge: 30 * 24 * 60 * 60 * 1000 })
  )
)
app.use(async ctx => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream(path.resolve('public/index.html'))
})

const httpServer = http.createServer(app.callback())

httpServer.listen(7777, () => {
  console.log('http listening on port', 7777)
})
