

class PublicService {
    /**
     * 【主要用于查询删除更新】
     * 1.a:{surface:表模型实例, method:调用的方法【字符串】, WhereOpj:查询条件【对象】, excludeArray:排除字段【数组可选】}
     * 2.is:是否关闭精确查询，true：关闭，false：开启
     * 3.method_where:自定义的查询条件【对象】 可以导入Op进行细化
     * @param {*} param0 
     * @param {*} param0 
     * @returns 
     */
    async Pul_fin_del_up({ a: { surface, method, WhereOpj, excludeArray = [] }, is = true, method_where }) {
        const where = {}
        // 动态循环加入条件
        for (const key in WhereOpj) {
            //hasOwnPropertytrue：如果对象自身包含该属性
            if (WhereOpj.hasOwnProperty(key)) {
                where[key] = WhereOpj[key];
            }
        }

        //查询
        try {
            const res = await surface[method]({
                attributes: {
                    exclude: excludeArray
                },// 排除不需要的字段
                where: is ? where : method_where, //is为假的时候，使用自定义的小的查询条件注意要引入OP
            })

            // 处理结果
            switch (method) {
                case 'destroy': {
                    return res
                }
                default: {
                    // 如果查询结果是数组，返回每个元素的dataValues，否则直接返回dataValues
                    return Array.isArray(res) ? res.map(item => item.dataValues) : res.dataValues
                }
            }

        } catch (err) {
            console.error(err)
            console.error('查询错误');
        }

    }
}

module.exports = new PublicService()