const QuestionsBank = require('../../model/questionBank.model');

class QuestionBankService {
    /**
     * 创建一条题  一共5个参数 按顺序 不按名字
     */
    async createQuestion(topicName, applyType, qType, create_phone, topicDetail, answer) {
        try {
            const res = await QuestionsBank.create({
                topicName,
                applyType,
                qType,
                create_phone,
                topicDetail,
                answer
            });
            return res;
        } catch (error) {
            console.log(error);
            console.log('创建题目失败');
        }
    }


}

module.exports = new QuestionBankService();