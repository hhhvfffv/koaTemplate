







# /users/register注册用户接口

## post

参数：ctx.request.body 

必要参数: 

   user_name: { type: 'string', required: true, allowEmpty: false },

​    user_phone: { type: 'string', required: true, allowEmpty: false, format: /\d{11}/ },

​    password: { type: 'string', required: true, allowEmpty: false },

​    class_name: { type: 'enum', values: CLASS, required: true, },

​    roleName: { type: 'enum', values: Object.values(ROLES), required: false, default: ROLES.STUDENT }



# /users/login登录接口

## post

参数：ctx.request.body 

必要参数

​   user_name: { type: 'string', required: true, allowEmpty: false },

​    user_phone: { type: 'string', required: true, allowEmpty: false, format: /\d{11}/ },

​    password: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 }



# /users/password修改密码

## patch

参数：

必要参数

​    user_name: { type: 'string', required: true, allowEmpty: false },

​    password: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 },

​    newPassword: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 }





# /question/create新建题库

## post

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



# /question/delete删除题目

## delete

参数：ctx.request.body

ids:[]数组【必要值】不能存在查询不了的id



# /upload/file上传图片

## post

参数：ctx.request.body

file:图片





# ws://localhost:8569/ws   soket请求

建立连接后用send发送