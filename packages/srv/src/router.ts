import koaRouter from 'koa-router'
import last from './middlewares/last'
import needLogin from './middlewares/need-login'
import needNewestV from './middlewares/need-newest-v'
import needPassSign from './middlewares/need-pass-sign'
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

router.use(last)

router.post('/api/add', needLogin, needNewestV, needPassSign, reqAdd)
router.post('/api/copy', needLogin, needNewestV, needPassSign, reqCopy)
router.post('/api/del', needLogin, needNewestV, needPassSign, reqDel)
router.post('/api/list', needLogin, needPassSign, reqList)
router.post('/api/login', reqLogin)
router.post('/api/logout', reqLogout)
router.post('/api/mod-name', needLogin, needNewestV, needPassSign, reqModName)
router.post('/api/mod-note', needLogin, needNewestV, needPassSign, reqModNote)
router.post('/api/move', needLogin, needNewestV, needPassSign, reqMove)
router.post('/api/profile', needLogin, reqProfile)
router.post('/api/status', needLogin, reqStatus)

export default router
