const { createQuestion } = require('../service/questionBank.service')
const { createQuestionError, deleteQuestionError, updateQuestionError, isGetTotalError, isQuestionLIstError } = require('../../constant/err.type')
const { Pul_fin_del_up, Pub_findAndCountAll, Pub_count } = require('../../service/public.service')
const QuestionsBank = require('../../model/questionBank.model')
const Teacher = require('../../model/teacher.model')
const { Op } = require('sequelize')


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
        let topicName, applyType, qType, topicDetail, answer
        let question_arr = []
        let data = ctx.request.body

        //是数组返回false 不是 就返回{ topicName, applyType, qType, topicDetail }
        let is = !Array.isArray(data) && ({ topicName, applyType, qType, topicDetail, answer } = data)
        //操作人
        const create_phone = ctx.state.user.user_phone;

        //是数组就循环创建题库
        if (!is) {
            for (let i = 0; i < data.length; i++) {
                let res = await createQuestion(data[i].topicName, data[i].applyType, data[i].qType, create_phone, data[i].topicDetail, data[i].answer)
                question_arr.push(res)
            }
        }

        try {
            //返回数据
            ctx.body = {
                data: {
                    code: "0",
                    success: "添加题库了",
                    data: {
                        //更具是不是一次添加多个来判断返回什么
                        question: is ? await createQuestion(topicName, applyType, qType, create_phone, topicDetail, answer) : question_arr
                    }
                }
            }
        } catch (error) {
            console.log(error);

            return ctx.app.emit('error_s', createQuestionError, ctx)
        }
    }

    /**
     * 删除题库的题目
     */
    async remove(ctx) {
        const { ids } = ctx.request.body;

        try {
            //删除题库题目
            const res = await Pul_fin_del_up({
                a: { surface: QuestionsBank, method: "destroy", excludeArray: ["updatedAt", "createdAt"] },
                is: false,
                method_where: { id: { [Op.in]: ids } }
            }
            )
            //返回数据
            ctx.body = {
                data: {
                    code: "0",
                    success: `删除${res}条`,
                    data: res
                }
            }
        } catch (error) {
            console.log(error);
            return ctx.app.emit('error_s', deleteQuestionError, ctx)
        }
    }

    /**
     * 更新题库题目
     */
    async update(ctx) {
        //操作者
        console.log("操作者：", ctx.state.user);
        //请求参数
        let topicName, applyType, qType, topicDetail, id, answer
        let question_arr = []
        let data = ctx.request.body

        //是数组返回false 不是 就返回{ id, topicName, applyType, qType, topicDetail }
        let is = !Array.isArray(data) && ({ id, topicName, applyType, qType, topicDetail, answer } = data)
        //操作人
        const create_phone = ctx.state.user.user_phone;


        try {
            let res
            if (!is) {
                //多个更新题库题目
                for (let i = 0; i < data.length; i++) {
                    res = await Pul_fin_del_up({
                        a: { surface: QuestionsBank, WhereOpj: { id: data[i].id }, method: "update", Fields: { topicName: data[i].topicName, applyType: data[i].applyType, create_phone, qType: data[i].qType, topicDetail: data[i].topicDetail, answer: data[i].answer } }
                    }
                    )
                    question_arr.push(res)
                }
            } else {
                //单个更新题库题目
                res = await Pul_fin_del_up({
                    a: { surface: QuestionsBank, WhereOpj: { id }, method: "update", Fields: { topicName, applyType, create_phone, qType, topicDetail, answer } }
                }
                )
            }



            //返回数据
            ctx.body = {
                data: {
                    code: "0",
                    success: is ? `更新${res}条` : `更新${question_arr.length}条`,
                    data: is ? res : question_arr
                }
            }
        } catch (error) {
            console.log(error);
            return ctx.app.emit('error_s', updateQuestionError, ctx)
        }
    }

    /**
     * 获取题库题目列表
     * 
     */
    async list(ctx) {
        //请求参数
        const { pageNum, pageSize, ...whereObj } = ctx.request.body
        try {
            //判断是否带where条件  false 就是添加where条件
            const is = (Object.keys(whereObj).length <= 0) ? true : false
            const res = await Pub_findAndCountAll({
                surface: QuestionsBank,
                pageNum,
                pageSize,
                exclude: ['updatedAt', 'createdAt', 'password'],
                model: Teacher,
                is,
                whereObj
            })

            ctx.body = {
                data: {
                    code: "0",
                    success: "获取题库题目列表成功",
                    data: res
                }
            }
        } catch (error) {
            console.error(error);
            ctx.app.emit('error_s', isQuestionLIstError, ctx)
        }
    }

    /**
     * 总数
     */
    async count(ctx) {
        try {
            //操作数据库
            const res = await Pub_count({ surface: QuestionsBank })
            ctx.body = {
                data: {
                    code: "0",
                    success: "获取题库题目总数成功",
                    data: { total: res }
                }
            }
        } catch (error) {
            console.error(error);
            ctx.app.emit('error_s', isGetTotalError, ctx)
        }
    }
}

module.exports = new QuestionBankController()