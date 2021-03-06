eureka
======

他兴奋地跳出澡盆，连衣服都顾不得穿上就跑了出去，大声喊着“尤里卡！尤里卡！”


## 开发说明

### 搭建开发环境：

clone 后进入项目目录，执行 npm install 安装依赖模块

### 说明：

1. public目录为静态文件目录，HTML文件、CSS文件、JS文件可放于该目录下
2. 配置了stylus的middleware，会自动compile .styl文件，不需要在本地做任何操作。如请求 /css/style.css，服务端会自动compile public/css/style.styl文件

### 数据库接口：

db module在mongoose基础上做了一层简单封装，提供增（put），删（del）、查（get），改（post）操作

所有操作只能在 *party*， *session*， *feedback*， *people*， *tag*， *entityTag* 6个collection（相当于表）中进行

#### db module API

[examples](https://github.com/wondger/eureka/blob/master/examples/db.api.js)

##### put

```
db.put({
    doc: Object, // 必需，新增的一条数据记录
    collection: String, // 必需，party || session || feedback || people || tag || entityTag
    complete: Function // callback，默认传入err、doc参数
})
```

##### post

```
db.post({
    query: Object, // 查询条件
    doc: Object, // 必需，更新数据对象
    collection: String, // 必需，party || session || feedback || people || tag || entityTag
    options: Object, // http://mongoosejs.com/docs/api.html#model_Model.update
    complete: Function // callback，默认传入err、numAffected参数
})
```

##### del

```
db.del({
    query: Object, // 查询条件
    collection: String, // 必需，party || session || feedback || people || tag || entityTag
    complete: Function // callback，默认传入err、numAffected参数
})
```

##### get

```
db.get({
    query: Object, // 查询条件
    collection: String, // 必需，party || session || feedback || people || tag || entityTag
    options: Object, // http://mongoosejs.com/docs/api.html#model_Model.find
    complete: Function // callback，默认传入err、docs参数
})
```

### 用户权限认证：

#### 环境配置

* 应用使用80端口启动
* 绑定eureka.taobao.net 到本地
* 绑定10.20.159.92 login-test.alibaba-inc.com

#### 用户信息获取

所有页面强制登录，** req.user ** 保存已登录用户数据（包括_id, name, nick, parties）

参见 */user*

## 部署

eureka默认使用80端口部署，当使用80端口启动应用会使用buc做权限认证；

如果使用非80端口部署，当前登录用户使用mock数据。

### 部署环境

默认部署为development环境，development环境调用buc的测试环境接口；如需部署生产环境请带上 **NODE_ENV=product** 参数：

```
sudo NODE_ENV=product node app.js
// forever
sudo NODE_ENV=product forever start app.js
```
