class TimeConversion {
    /**
    * 转换时间为东八区格式：
    * - 若输入已是东八区时间（转换后与原始值一致），直接返回原始值
    * - 若无法转换（无效格式/非时间），返回原始值
    * - 其他情况返回转换后的东八区时间
    * @param {string|Date} time - 待转换的时间（任意格式/时区）
    * @param {Object} [options] - 可选配置
    * @param {string} [options.format="YYYY-MM-DD HH:mm:ss"] - 输出格式
    * @returns {string|Date} 原始值（无需/不能转换）或转换后的值（需要转换）
    */
    formatToChinaTime(time, options = {}) {
        const originalTime = time; // 缓存原始值，用于后续对比

        // 非字符串/Date类型直接返回原始值（如数字、布尔等）
        if (typeof time !== 'string' && !(time instanceof Date)) {
            return originalTime;
        }

        try {
            // 转换为Date对象（兼容字符串和Date）
            let date;
            if (time instanceof Date) {
                date = time;
            } else {
                // 尝试解析字符串（支持任意时区）
                const parsed = new Date(time);
                if (isNaN(parsed.getTime())) {
                    // 无法解析的字符串，返回原始值
                    return originalTime;
                }
                date = parsed;
            }

            // 校验日期有效性
            if (isNaN(date.getTime())) {
                return originalTime;
            }

            // 转换为东八区时间并格式化
            const formatted = date.toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(/\//g, '-'); // 统一替换为"-"格式

            // 按格式处理转换后的值
            const { format = 'YYYY-MM-DD HH:mm:ss' } = options;
            let convertedTime;
            if (format === 'YYYY-MM-DD') {
                convertedTime = formatted.split(' ')[0];
            } else if (format === 'HH:mm:ss') {
                convertedTime = formatted.split(' ')[1];
            } else {
                convertedTime = formatted;
            }

            // 关键判断：若转换后的值与原始字符串一致（已是东八区），返回原始值
            if (typeof originalTime === 'string' && convertedTime === originalTime) {
                return originalTime;
            }

            // 转换后有变化，返回转换值
            return convertedTime;

        } catch (error) {
            // 任何异常情况（如类型错误）都返回原始值
            console.warn(`时间转换跳过（异常）: ${error.message}`);
            return originalTime;
        }
    }

    /**
     * - 第一层就必须访问到createAt和updateAt字段
     * - 转换res的时间格式，并返回res东八区
     * - 能有嵌套可以判断数组
     * @param {*} res 
     * @returns 
     */
    resTime(res) {
        try {
            const timeClass = new TimeConversion();
            // 用箭头函数绑定this（确保指向当前类实例）
            const handleItem = (item) => {
                // 容错：如果item没有对应字段，不报错
                if (item && (item.createdAt || item.updatedAt)) {
                    item.createdAt = timeClass.formatToChinaTime(item.createdAt);
                    item.updatedAt = timeClass.formatToChinaTime(item.updatedAt);
                }

                // 递归处理子对象
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const value = item[key];
                        if (typeof value === 'object' && value !== null) {
                            handleItem(value);
                        }
                    }
                }

                return item;
            };

            if (Array.isArray(res)) {
                // 数组循环处理，跳过非对象元素
                return res.map(item => {
                    // 只处理对象类型的元素
                    if (item && typeof item === 'object') {
                        return handleItem(item);
                    }
                    return item; // 非对象元素直接返回
                });
            } else if (res && typeof res === 'object') {
                // 单个对象处理
                return handleItem(res);
            }

            // 非对象/数组直接返回
            return res;

        } catch (error) {
            console.log(error);
            console.log("数据库返回时转换东八时区时报错");
        }
    }
}

module.exports = new TimeConversion();
