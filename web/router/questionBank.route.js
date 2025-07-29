const Router = require('koa-router');
const { getUserTokenInfo, havePermissions } = require('../middleWare/auth.middleWare')
const { create } = require('../controller/questionBank.controller')
const { FieldValidation } = require('../ruterExpand/parameter.ruterExpand')
const { SINGLE_MULTIPLE, ROLES, APP_TYPE } = require('../../constant/Permissions');
const { findQuestionId } = require('../middleWare/questionBank.middleWare')
const { remove } = require('../controller/questionBank.controller')

const router = new Router({ prefix: '/question' });

/**
 * 参数 ：topicName, applyType, qType(number), topicDetail
 * 功能：创建题库
 */
router.post('/create', getUserTokenInfo, havePermissions(ROLES.TEACHER), FieldValidation({
    topicName: { type: 'string', required: true, min: "1" },
    applyType: { type: 'enum', values: APP_TYPE, required: true },
    qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },
    topicDetail: { type: 'object', required: true, min: 1 },
}), create)

/**
 * 参数 ：ids:[]
 * 功能：删除题库 
 */
router.delete('/delete',
    getUserTokenInfo,
    havePermissions(ROLES.TEACHER),
    FieldValidation({ ids: { type: 'array', required: true, min: 1 } }),
    findQuestionId,
    remove
)

module.exports = router
