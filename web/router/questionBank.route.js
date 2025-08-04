const Router = require('koa-router');
const { getUserTokenInfo, havePermissions } = require('../middleWare/auth.middleWare')
const { FieldValidation } = require('../ruterExpand/parameter.ruterExpand')
const { SINGLE_MULTIPLE, ROLES, APP_TYPE } = require('../../constant/Permissions');
const { findQuestionId } = require('../middleWare/questionBank.middleWare')
const { create, remove, update, list, count } = require('../controller/questionBank.controller')

const router = new Router({ prefix: '/question' });

/**
 * 参数 ：topicName, applyType, qType(number), topicDetail
 * 功能：创建题库
 */
router.post('/create', FieldValidation({
    topicName: { type: 'string', required: true, min: "1" },
    applyType: { type: 'enum', values: APP_TYPE, required: true },
    qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },
    answer: { type: 'string', required: true, min: 1 },
    topicDetail: { type: 'array', required: true, min: 1 },
}),
    getUserTokenInfo, havePermissions(ROLES.TEACHER), create)

/**
 * 参数 ：ids:[]
 * 功能：删除题库 
 */
router.delete('/delete',
    FieldValidation({ ids: { type: 'array', required: true, min: 1 } }),
    getUserTokenInfo,
    havePermissions(ROLES.TEACHER),
    findQuestionId,
    remove
)

/**
 * 参数 ：ids:[]
 * 修改题库
 */
router.put('/update',
    FieldValidation({
        id: { type: 'number', required: true },
        topicName: { type: 'string', required: true, min: "1" },
        applyType: { type: 'enum', values: APP_TYPE, required: true },
        qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },
        answer: { type: 'string', required: true, min: 1 },
        topicDetail: { type: 'array', required: true, min: 1 },
    }),
    getUserTokenInfo,
    havePermissions(ROLES.TEACHER),
    update
)

/**
 * 查询  ：pageNumber, pageSize
 */
router.get('/list', FieldValidation(
    {
        pageNum: { type: 'string', required: true, min: 1 },
        pageSize: { type: 'string', required: true, min: 1 }
    }, 'query'), getUserTokenInfo, havePermissions(ROLES.TEACHER), list)

/**
 * 总数
 */
router.get('/count', getUserTokenInfo, havePermissions(ROLES.TEACHER), count)
module.exports = router
