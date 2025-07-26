const QuestionsBank = require('../model/questionBank.model');

class QuestionBankService {
    /**
     * 创建一条题  一共5个参数 按顺序 不按名字
     */
    async createQuestion(topicName, applyType, qType, createid, topicDetail) {
        const res = await QuestionsBank.create({
            topicName,
            applyType,
            qType,
            createid,
            topicDetail
        });
        return res;
    }
}

module.exports = new QuestionBankService();