const { Pul_fin_del_up } = require('../../service/public.service')
const { Op } = require('sequelize');
const QuestionsBank = require('../../model/questionBank.model');
const { isQuestionNotExist } = require('../../constant/err.type');


class QuestionBankMiddleware {
    /**
     * 查询题目id，是否存在
     */
    async findQuestionId(ctx, next) {
        const { ids } = ctx.request.body;
        try {
            /**
             * 调用公共服务方法Pul_fin_del_up
             */
            const res = await Pul_fin_del_up({
                a: { surface: QuestionsBank, method: "findAll", excludeArray: ["updatedAt", "createdAt"] },
                is: false,
                method_where: { id: { [Op.in]: ids } }
            })

            // 如果查询结果长度小于ids长度，返回错误
            if (res.length < ids.length) {
                return ctx.app.emit('error_s', isQuestionNotExist, ctx);
            }

            await next()

        } catch (error) {
            console.log(error);

        }
    }
}

module.exports = new QuestionBankMiddleware();