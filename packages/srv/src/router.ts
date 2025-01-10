import koaRouter from 'koa-router'
import error from './middlewares/error.js'
import needLogin from './middlewares/need-login.js'
import needNewestV from './middlewares/need-newest-v.js'
import needPassSign from './middlewares/need-pass-sign.js'
import pre from './middlewares/pre.js'
import reqAdd from './requests/add.js'
import reqCopy from './requests/copy.js'
import reqDel from './requests/del.js'
import reqList from './requests/list.js'
import reqLogin from './requests/login.js'
import reqLogout from './requests/logout.js'
import reqModName from './requests/mod-name.js'
import reqModNote from './requests/mod-note.js'
import reqMove from './requests/move.js'
import reqProfile from './requests/profile.js'
import reqStatus from './requests/status.js'

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
