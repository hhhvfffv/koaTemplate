const { ParameterCartError } = require("../../constant/err.type");

class ParameterExpand {
    /**
     * 传入规则，可为数组，对参数进行验证
     * query: query,params 只能是这两个字符串，分别代表query和params验证
     * @param {Object} rules 验证规则
     * @param {String} query query,params 只能是这两个字符串，分别代表query和params验证
     * @param {*} rules 
     * @returns 
     */
    FieldValidation(rules, query) {
        //判断rules是不是Object类型
        if (!(rules instanceof Object)) return console.log("在字段验证时必须传入对象，里面是验证规则");
        return async (ctx, next) => {
            try {
                let params;
                !(query) && (params = ctx.request.body)
                if (query) {
                    switch (query) {
                        case "query": {
                            params = ctx.request.query
                            break;
                        }
                        case "params": {
                            params = ctx.params
                            break;
                        }
                    }
                }

                if (Array.isArray(params)) {
                    // 如果是数组，对每个元素进行验证
                    for (let i = 0; i < params.length; i++) {
                        ctx.verifyParams(rules, params[i]);
                    }
                } else {
                    // 如果不是数组，直接验证
                    ctx.verifyParams(rules, params);
                }
            } catch (error) {
                ParameterCartError.data.data = error
                return ctx.app.emit('error_s', ParameterCartError, ctx)
            }
            await next()
        }
    }
}

module.exports = new ParameterExpand()