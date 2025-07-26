# /question/create新建题库

topicName：题干

applyType：应用类型

qType：题目类型0单选1多选

topicDetail：题目细节（题干、选项、答案）



## 单题创建

参数：ctx.request.body   

类型：对象  

必要值：topicName, applyType, qType(number), topicDetail    4个



## 多题创建

参数：ctx.request.body   

类型：数组包含对象

必要值：topicName, applyType, qType(number), topicDetail    4个【每个对象的必要值】



