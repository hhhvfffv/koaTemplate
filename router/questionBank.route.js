const Router = require('koa-router');
const { getUserTokenInfo } = require('../middleWare/auth.middleWare')
const { create } = require('../controller/questionBank.controller')
const { FieldValidation } = require('../ruterExpand/parameter.ruterExpand')
const { SINGLE_MULTIPLE, APP_TYPE } = require('../constant/Permissions');

const router = new Router({ prefix: '/question' });

/**
 * 参数 ：topicName, applyType, qType(number), topicDetail
 * 功能：创建题库
 */
router.post('/create', getUserTokenInfo, FieldValidation({
    topicName: { type: 'string', required: true, min: "1" },
    applyType: { type: 'enum', values: APP_TYPE, required: true },
    qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },
    topicDetail: { type: 'object', required: true, min: 1 },
}), create)

module.exports = router
