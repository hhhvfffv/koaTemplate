
const { resTime } = require('../tool/Time.Conversion')//引入时间转换工具
const Teacher = require('../model/teacher.model')//引入老师模型

class PublicService {
    /**
     * 【主要用于查询删除更新】
     * 1.a:{surface:表模型实例,Fields:更新时传入， method:调用的方法【字符串】, WhereOpj:查询条件【对象】, excludeArray:排除字段【数组可选】}
     * 2.is:是否关闭精确查询，true：关闭，false：开启
     * 3.method_where:自定义的查询条件【对象】 可以导入Op进行细化
     * @param {*} param0 
     * @param {*} param0 
     * @returns 
     */
    async Pul_fin_del_up({
        a: { surface, Fields, method, WhereOpj, excludeArray = [] },
        is = true,
        method_where }) {
        const where = {}
        // 动态循环加入条件
        for (const key in WhereOpj) {
            //hasOwnPropertytrue：如果对象自身包含该属性
            if (WhereOpj.hasOwnProperty(key)) {
                where[key] = WhereOpj[key];
            }
        }

        //查询
        let res;
        switch (method) {
            case 'update': {
                // 更新
                res = await surface[method](
                    Fields,
                    {
                        where: is ? where : method_where, //is为假的时候，使用自定义的小的查询条件注意要引入OP
                    })
                break
            }
            default: {
                res = await surface[method]({
                    attributes: {
                        exclude: excludeArray
                    },// 排除不需要的字段
                    where: is ? where : method_where, //is为假的时候，使用自定义的小的查询条件注意要引入OP
                })
                break
            }
        }

        // 处理结果
        switch (method) {
            case 'destroy': {
                return res
            }
            case 'update': {
                return res
            }
            default: {
                // 如果查询结果是数组，返回每个元素的dataValues，否则直接返回dataValues
                return Array.isArray(res) ? res.map(item => item.dataValues) : res.dataValues
            }
        }



    }

    /**
     * 查找符合条件的
     * surface:表实例  WhereOpj：条件对象
     * @param {*} param0 
     * @returns 
     */
    async Pul_findOne({ surface, WhereOpj }) {
        const where = {}
        // 动态循环加入条件
        for (const key in WhereOpj) {
            //hasOwnPropertytrue：如果对象自身包含该属性
            if (WhereOpj.hasOwnProperty(key)) {
                where[key] = WhereOpj[key];
            }
        }

        const res = await surface.findOne({
            where: where
        })
        return res ? res.dataValues : null

    }

    /**
     * 创建记录
     * 创建surface:表实例  WhereOpj：对象
     */
    async Pub_create({ surface, WhereOpj }) {
        const res = await surface.create(WhereOpj)

        //时间转换
        return await resTime(res.dataValues)

    }

    /**
     * 更新
     * 更新表内容  创建surface:表实例  WhereOpj：对象 
     * is:是否精确查询【fase就是开启默认ture】 精确查询对象{[OP.in]:...}
     */
    async Pub_update({ surface, id, WhereOpj, is = true, isWhere }) {
        const where = {}
        // 动态循环加入条件
        for (const key in WhereOpj) {
            //hasOwnPropertytrue：如果对象自身包含该属性
            if (WhereOpj.hasOwnProperty(key)) {
                where[key] = WhereOpj[key];
            }
        }


        const res = await surface.update(
            where, //更新内容
            {
                where: is ? { id } : isWhere
            }
        )

        return res[0] //返回更新的条数


    }

    /**
     * 分页查询
     * surface:表实例
     * pageNum:当前页码
     * pageSize:每页条数
     * exclude:关联模型排除字段  字符串数组
     * model:关联的模型
     * 分页查询
     */
    async Pub_findAndCountAll({ surface, pageNum, pageSize, exclude = [], model }) {
        const { rows, count } = await surface.findAndCountAll({
            limit: +pageSize,
            offset: (pageNum - 1) * pageSize,
            include: [
                {
                    model: model, // 关联的模型
                    // as: 'teacher', // 必须与关联定义时的as一致（如果定义了的话）
                    attributes: { exclude: exclude }, // 指定需要返回的Teacher字段（避免返回敏感信息）
                    // 可选：添加where条件过滤关联的Teacher（如只查状态正常的老师）
                    // where: { status: 1 }
                    // required: true,// 是否必须返回关联的Teacher，默认false
                    // 可选：排序（按创建时间倒序为例）
                    // order: [['createdAt', 'DESC']]
                }
            ],
        })
        for (let i = 0; i < rows.length; i++) {
            //时间转换
            rows[i] = await resTime(rows[i].dataValues) // 转换时间
        }
        return {
            pageNum,
            pageSize,
            total: count,
            list: rows,
        }
    }

    /**
     * 统计表条目
     * surface:表实例  whereObj：条件对象[可不传]
     */
    async Pub_count({ surface, whereObj = {} }) {
        let total = 0
        if (Object.keys(whereObj).length <= 0) {
            total = await surface.count()
        } else {
            total = await surface.count({
                where: whereObj
            })
        }
        return total
    }
}

module.exports = new PublicService()