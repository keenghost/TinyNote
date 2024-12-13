import koaRouter from 'koa-router'
import last from './middlewares/last'
import needLogin from './middlewares/need-login'
import reqBasic from './requests/basic'
import reqLogin from './requests/login'
import reqLogout from './requests/logout'

const router = new koaRouter()

router.use(last)

router.post('/api/basic', needLogin, reqBasic)
router.post('/api/login', reqLogin)
router.post('/api/logout', reqLogout)

export default router
