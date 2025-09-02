const Router = require('koa-router');
const { getUserTokenInfo, havePermissions } = require('../middleWare/auth.middleWare')
const { FieldValidation } = require('../ruterExpand/parameter.ruterExpand')
const { SINGLE_MULTIPLE, ROLES, APP_TYPE } = require('../../constant/Permissions');

const router = new Router({ prefix: '/task' });
router.post('/create', getUserTokenInfo, havePermissions(ROLES.TEACHER), FieldValidation({

}))

module.exports = router
