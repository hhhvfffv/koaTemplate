const Router = require('koa-router');
const { upload, parse } = require('../controller/upload.controller')
const { havePermissions, getUserTokenInfo } = require('../middleWare/auth.middleWare')

const router = new Router({ prefix: '/upload' });

router.post('/file', getUserTokenInfo, havePermissions(1), upload);
router.post('/word/parse', getUserTokenInfo, havePermissions(1), parse)

module.exports = router;