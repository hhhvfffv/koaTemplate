module.exports = {
    ParameterCartError: {
        code: "10002",
        message: "参数错误",
        reslut: ''
    },
    isDataSlectError: {
        code: '10005',
        message: '数据查询失败',
        result: ''
    },
    isUserRepeat: {
        code: "10002",
        message: "用户账户已存在",
        result: ""
    },
    isUserHaveNull: {
        code: "10001",
        message: "用户账户输入用户名或密码有空值",
        result: ""
    },
    passwordFormatisincorrect: {
        code: "10007",
        message: "密码格式不正确",
        result: ""
    },
    userRegisterError: {
        code: '10003',
        message: '服务器的土豆服务器or土豆mysql出现异常，或者不小心大了一堆符号',
        result: ''
    },

    TokenExpiredError: {
        code: '10007',
        message: 'token过期',
        result: ''
    },

    JsonWebTokenError: {
        code: '10008',
        message: 'token无效',
        result: ''
    },

    NotBeforeError: {
        code: '10009',
        message: 'token还未激活',
        result: ''
    },
    isUserNotExist: {
        code: '10010',
        message: '用户账户不存在',
        result: ''
    },
    isPasswordError: {
        code: '10011',
        message: '密码错误',
        result: ''
    },
    createQuestionError: {
        code: '10012',
        message: '创建问题失败',
        result: ''
    }
}