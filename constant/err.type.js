module.exports = {
    ParameterCartError: {
        data: {
            code: "10002",
            message: "参数错误",
            data: ''
        }
    },
    isDataSlectError: {
        data: {
            code: '10005',
            message: '数据查询失败',
            data: ''
        }
    },
    isUserRepeat: {
        data: {
            code: "10002",
            message: "用户账户已存在",
            data: ""
        }
    },
    isUserHaveNull: {
        data: {
            code: "10001",
            message: "用户账户输入用户名或密码有空值",
            data: ""
        }
    },
    passwordFormatisincorrect: {
        data: {
            code: "10007",
            message: "密码格式不正确",
            data: ""
        }
    },
    userRegisterError: {
        data: {
            code: '10003',
            message: '服务器的土豆服务器or土豆mysql出现异常，或者不小心大了一堆符号',
            data: ''
        }
    },

    TokenExpiredError: {
        data: {
            code: '10007',
            message: 'token过期',
            data: ''
        }
    },

    JsonWebTokenError: {
        data: {
            code: '10008',
            message: 'token无效',
            data: ''
        }
    },

    NotBeforeError: {
        data: {
            code: '10009',
            message: 'token还未激活',
            data: ''
        }
    },
    isUserNotExist: {
        data: {
            code: '10010',
            message: '用户账户不存在',
            data: ''
        }
    },
    isPasswordError: {
        data: {
            code: '10011',
            message: '密码错误',
            data: ''
        }
    },
    createQuestionError: {
        data: {
            code: '10012',
            message: '创建问题失败',
            data: ''
        }
    },
    PermissionsError: {
        data: {
            code: '10013',
            message: '没有权限',
            data: ''
        }
    },
    NOtFoundPermError: {
        data: {
            code: '10014',
            message: '没有定义该权限',
            data: ''
        }
    },
    isQuestionNotExist: {
        data: {
            code: '10015',
            message: '存在实际参数缺失，不存在',
            data: ''
        }
    },
    isUserNameNotExist: {
        data: {
            code: '10010',
            message: '用户名字错误',
            data: ''
        }
    },
    isExtnameERROR: {
        data: {
            code: '10016',
            message: '文件扩展名错误,只支持docx的文档',
            data: ''
        }
    },
    updateQuestionError: {
        data: {
            code: '10017',
            message: '更新问题失败',
            data: ''
        }
    },
    deleteQuestionError: {
        data: {
            code: '10018',
            message: '删除问题失败',
            data: ''
        }
    },
    isAllError: {
        data: {
            code: '10019',
            message: '怎么张表都有一个用户',
            data: ''
        }
    },
    isQuestionLIstError: {
        data: {
            code: '10020',
            message: '问题列表获取失败',
            data: ''
        }
    },
    isGetTotalError: {
        data: {
            code: '10021',
            message: '获取总数失败',
            data: ''
        }
    },
    isUserError: {
        data: {
            code: '10022',
            message: '非本用户操作即将拦截',
            data: ''
        }
    }
}