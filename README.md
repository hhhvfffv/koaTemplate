







# /users/register注册用户接口

## post

参数：ctx.request.body 

必要参数: 

   user_name: { type: 'string', required: true, allowEmpty: false },

​    user_phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3-9]\d{9}$/ },

​    password: { type: 'string', required: true, allowEmpty: false },

​    class_name: { type: 'enum', values: CLASS, required: true, },

​    roleName: { type: 'enum', values: Object.values(ROLES), required: false, default: ROLES.STUDENT }



### 返回形式

~~~
{
    "data": {
        "code": "0",
        "success": "注册成功",
        "data": {
            "id": 4,
            "user_name": "鱼鱼",
            "user_phone": "17771002925",
            "password": "$2b$10$JP/3LNdFt1RDnzhY4I4mBudIQ1Hc4HuCULfp4EkZixRFi5KRNIw6q",
            "class_name": "一班",
            "roleName": 1,
            "updatedAt": "2025-08-04 15:07:30",
            "createdAt": "2025-08-04 15:07:30"
        }
    }
}
~~~





# /users/login登录接口

## post

参数：ctx.request.body 

必要参数

​  ser_name: { type: 'string', required: true, allowEmpty: false },

​    user_phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3-9]\d{9}$/ },

​    password: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 }

### 返回形式

token有效期一条

~~~
{
    "data": {
        "code": "0",
        "success": "登录成功",
        "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcl9waG9uZSI6IjE3NzgxMDAyOTI1IiwidXNlcl9uYW1lIjoi6bG86bG8Iiwicm9sZU5hbWUiOjEsImNsYXNzX25hbWUiOiLkuIDnj60iLCJpYXQiOjE3NTQyOTEzMDAsImV4cCI6MTc1NDM3NzcwMH0.tUZNxIQmQ7bGySkq5DHSBlZXZuRjFPJ-12IuVnBSQPE",
            "res": {
                "id": 2,
                "user_phone": "17781002925",
                "user_name": "鱼鱼",
                "roleName": 1,
                "class_name": "一班"
            }
        }
    }
}
~~~







# /users/password修改密码

## patch

参数：

必要参数

​  ser_phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3-9]\d{9}$/ },

​    password: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 },

​    newPassword: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 }

### 返回形式

~~~
{
    "data": {
        "code": "0",
        "success": "修改密码成功",
        "data": {}
    }
}
~~~





# /question/create新建题库

## post

topicName：题干

applyType：应用类型

qType：题目类型 单选 多选 判断（字符串）

answer：题目答案（字符串）

topicDetail：题目细节（题干、选项、答案）



## 单题创建

参数：ctx.request.body   

类型：对象  

### 必要值：topicName, applyType, qType(number), topicDetail,answer    5个

topicName: { type: 'string', required: true, min: "1" },
    applyType: { type: 'enum', values: APP_TYPE, required: true },
    qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },
    answer: { type: 'string', required: true, min: 1 },
    topicDetail: { type: 'array', required: true, min: 1 },



## 多题创建

参数：ctx.request.body   

类型：数组包含对象

### 必要值：topicName, applyType, qType(number), topicDetail answer   5个【每个对象的必要值】

topicName: { type: 'string', required: true, min: "1" },
    applyType: { type: 'enum', values: APP_TYPE, required: true },
    qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },
    answer: { type: 'string', required: true, min: 1 },
    topicDetail: { type: 'array', required: true, min: 1 },





### 返回形式

以题目为标准，题目不能重复

~~~
{
    "data": {
        "code": "0",
        "success": "添加题库了",
        "data": {
            "question": [
                {
                    "id": 16,
                    "topicName": "2222",
                    "applyType": "操作",
                    "qType": "多选",
                    "create_phone": "17781042925",
                    "topicDetail": [
                        {
                            "255": 12
                        }
                    ],
                    "answer": "A",
                    "updatedAt": "2025-08-04T07:04:53.945Z",
                    "createdAt": "2025-08-04T07:04:53.945Z"
                },
                null//已经存在
            ]
        }
    }
}
~~~















# /question/delete删除题目

## delete

参数：ctx.request.body

ids:[]数组【必要值】不能存在查询不了的id

### 返回形式

~~~
{
    "data": {
        "code": "0",
        "success": "删除2条",
        "data": 2
    }
}
~~~



# /question/update更新字段

## put

### topicName, applyType, qType(number), topicDetail,answer    5个

topicName: { type: 'string', required: true, min: "1" },

​    applyType: { type: 'enum', values: APP_TYPE, required: true },

​    qType: { type: 'enum', values: Object.values(SINGLE_MULTIPLE), required: true },

​    answer: { type: 'string', required: true, min: 1 },

​    topicDetail: { type: 'array', required: true, min: 1 },

### 返回形式

~~~
{
    "data": {
        "code": "0",
        "success": "更新2条",
        "data": [
            [
                1//更新成功
            ],
            [
                0//代表没有这条数据或者，数据一样不需要更新
            ]
        ]
    }
}
~~~





# /question/list分页查询

## get

参数：ctx.request.query

pageNum,pageSize

   pageNum: { type: 'string', required: true, min: 1 },

​        pageSize: { type: 'string', required: true, min: 1 }

### 返回形式

~~~
{
    "data": {
        "code": "0",
        "success": "获取题库题目列表成功",
        "data": {
            "pageNum": "1",
            "pageSize": "10",
            "total": 7,
            "list": [
                {
                    "id": 1,
                    "topicName": "6576458v821834",
                    "applyType": "操作",
                    "qType": "多选",
                    "create_phone": "17781042925",
                    "answer": "A",
                    "topicDetail": [
                        {
                            "255": 12
                        }
                    ],
                    "createdAt": "2025-08-04 10:27:52",
                    "updatedAt": "2025-08-04 10:27:52",
                    "ai_teacher": {
                        "id": 1,
                        "user_phone": "17781042925",
                        "user_name": "鱼鱼",
                        "roleName": 1,
                        "class_name": "一班"
                    }
                },
            ]
        }
    }
}
~~~



# /question/count获取总数

## get

直接请求

### 返回形式：

~~~
{

    "data": {

        "code": "0",

        "success": "获取题库题目总数成功",

        "data": {

            "total": 7

        }

    }

}

~~~





# /upload/file上传图片

## post

参数：ctx.request.body

file:图片





# ws://localhost:8569/ws   soket请求

建立连接后用send发送



# /word/parse word文档解析

## post

必须是 .docx的文档