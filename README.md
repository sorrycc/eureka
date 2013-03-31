eureka
======

他兴奋地跳出澡盆，连衣服都顾不得穿上就跑了出去，大声喊着“尤里卡！尤里卡！”


## 开发说明

### 搭建开发环境：

    clone 后进入项目目录，执行 npm install安全依赖模块

### 说明：

    1. public目录为静态文件目录，HTML文件、CSS文件、JS文件可放于该目录下
    2. 配置了stylus的middleware，会自动compile .styl文件，不需要在本地做任何操作。如请求 /css/style.css，服务端会自动compile public/css/style.styl文件

