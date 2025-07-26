const { createQuestion } = require('../service/questionBank.service')
const { createQuestionError } = require('../constant/err.type')

class QuestionBankController {
    /**
     * 创建题库，会解析用户信息
     * 会更具用户信息来判断是不是一次添加多个
     * @param {*} ctx 
     */
    async create(ctx) {
        //操作者
        console.log("操作者：", ctx.state.user);
        //请求参数
        let topicName, applyType, qType, topicDetail
        let question_arr = []
        let data = ctx.request.body

        //是数组返回false 不是 就返回{ topicName, applyType, qType, topicDetail }
        let is = !Array.isArray(data) && ({ topicName, applyType, qType, topicDetail } = data)
        //操作人
        const createid = ctx.state.user.id;

        //是数组就循环创建题库
        if (!is) {
            for (let i = 0; i < data.length; i++) {
                let res = await createQuestion(data[i].topicName, data[i].applyType, data[i].qType, createid, data[i].topicDetail)
                question_arr.push(res)
            }
        }

        try {
            //返回数据
            ctx.body = {
                code: "0",
                message: "添加题库成功",
                result: {
                    is: is,
                    //更具是不是一次添加多个来判断返回什么
                    question: is ? await createQuestion(topicName, applyType, qType, createid, topicDetail) : question_arr
                }
            }
        } catch (error) {
            console.log(error);

            return ctx.app.emit('error', createQuestionError, ctx)
        }
    }
}

module.exports = new QuestionBankController()