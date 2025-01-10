import koaRouter from 'koa-router'
import error from './middlewares/error'
import needLogin from './middlewares/need-login'
import needNewestV from './middlewares/need-newest-v'
import needPassSign from './middlewares/need-pass-sign'
import pre from './middlewares/pre'
import reqAdd from './requests/add'
import reqCopy from './requests/copy'
import reqDel from './requests/del'
import reqList from './requests/list'
import reqLogin from './requests/login'
import reqLogout from './requests/logout'
import reqModName from './requests/mod-name'
import reqModNote from './requests/mod-note'
import reqMove from './requests/move'
import reqProfile from './requests/profile'
import reqStatus from './requests/status'

const router = new koaRouter()

router.use(error)

router.post('/api/add', pre, needLogin, needNewestV, needPassSign, reqAdd)
router.post('/api/copy', pre, needLogin, needNewestV, needPassSign, reqCopy)
router.post('/api/del', pre, needLogin, needNewestV, needPassSign, reqDel)
router.post('/api/list', pre, needLogin, needPassSign, reqList)
router.post('/api/login', pre, reqLogin)
router.post('/api/logout', pre, reqLogout)
router.post('/api/mod-name', pre, needLogin, needNewestV, needPassSign, reqModName)
router.post('/api/mod-note', pre, needLogin, needNewestV, needPassSign, reqModNote)
router.post('/api/move', pre, needLogin, needNewestV, needPassSign, reqMove)
router.post('/api/profile', pre, needLogin, reqProfile)
router.post('/api/status', pre, needLogin, reqStatus)

export default router
