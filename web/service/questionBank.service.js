const QuestionsBank = require('../../model/questionBank.model');
const { resTime } = require('../../tool/Time.Conversion')

class QuestionBankService {
    /**
     * 创建一条题  一共5个参数 按顺序 不按名字
     */
    async createQuestion(topicName, applyType, qType, create_phone, topicDetail, answer) {
        try {
            let res = await QuestionsBank.create({
                topicName,
                applyType,
                qType,
                create_phone,
                topicDetail,
                answer
            });
            res = resTime(res)  //时区转换
            return res;
        } catch (error) {
            console.log(error);
            console.log('创建题目失败');
        }
    }


}

module.exports = new QuestionBankService();