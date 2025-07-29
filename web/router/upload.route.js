const Router = require('koa-router');
const { upload } = require('../controller/upload.controller')
const { havePermissions, getUserTokenInfo } = require('../middleWare/auth.middleWare')

const router = new Router({ prefix: '/upload' });

router.post('/file', getUserTokenInfo, havePermissions(1), upload);


module.exports = router;