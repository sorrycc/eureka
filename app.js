
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    //, user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , nobuc = require('./auth/nobuc')
    , user = require('./auth/user')
    , session = require('./routes/session');

var party = require('./routes/party');
var feedback = require('./routes/feedback');


var stylus = require('stylus')
    , nib = require('nib');

var app = express();

app.locals = {
    pretty: true
};

app.configure(function(){
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser("eureka1367047474"));
    app.use(express.methodOverride());


    if (app.get("port") === 80) {
        // auth
        app.use(nobuc(/.*/, {
            hostname: "login-test.alibaba-inc.com",
            appname: "eureka"
        }));

        app.use(user());
    }
    else {
        // req.user

        app.use(function(req, res, next){
            req.user = {
                _id: "testid",
                name: "testid@taobao.com",
                nick: "test"
            };
            next();
        });
    }

    app.use(stylus.middleware({
        src: __dirname + '/public'
        , compile: function(str, path) {
            return stylus(str)
                .set('filename', path)
                .set('compress', true)
                .use(nib())
                .import('nib');
        }
    }));

    //app.use(express.directory(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(app.router);
});

// NODE_ENV=development node app
app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);

// 棪木
//app.get('/login', function(req, res) {
//});

// 棪木
app.get('/party/create', function(req, res) {
    party.create.render(req, res);
});

app.get('/party/feedback', function(req, res) {
    party.feedback.render(req, res);
});

app.get('/sprite', function(req, res) {
    routes.sprite.render(req, res);
});

// party
/*
 * api/...为数据接口路由
 * 其他为页面模版渲染路由
 */
// 棪木
app.post('/api/party/create', function(req, res) {
    party.create.post(req, res);
});

// 棪木
app.get('/party/edit/:id', function(req, res) {
    party.edit.render(req, res);
});
// 棪木
app.get('/party', function(req, res) {
    party.list.render(req, res);
});
// 棪木
app.get('/party/:id', function(req, res) {
    party.list.render(req, res);
});
// 棪木
app.get('/api/party', function(req, res) {
    party.list.get(req, res);
});

// 棪木
app.get('/api/party/:id', function(req, res) {
    party.list.get(req, res);
});
// 棪木
app.post('/api/party/edit/:id', function(req, res) {
    party.edit.post(req, res);
});
// 棪木
app.post('/api/party/del/:id', function(req, res) {
    party.del(req, res);
});

// session
// 七念
// someone's
// app.get('/session/create', session.new);
// app.post('/session/create', session.create);
// //app.get('/session/get', session.get);
// app.get('/session/edit/:id', session.edit);
// app.get('/session/update/:id', session.update);
// app.post('/session/del/:id', session.del);
// app.get('/session/detail/:id', function(req, res) {
//     session.detail.render(req, res);
// });

// 7n's
app.get('/session/create', session.new);
app.post('/session/create', session.create);
app.get('/session/:id', session.detail);
app.get('/session/:id/edit', session.edit);
app.post('/session/:id/edit', session.update);
app.del('/session/:id', session.del);

// 水儿
// get sessions by party id
app.get('/api/session/list', function(req, res) {
    session.list.get(req, res);
});


// feedback
// 筱谷
app.get('/feedback/make/:id', feedback.make);
app.post('/feedback/make/:id', feedback.post);
app.get('/feedback/list', function(req, res) {
});
//剑平
app.get('/feedback/result/:partyId/:sessionId', feedback.result);
app.post('/feedback/save_count', feedback.save_count);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    //监听听众的打分数据
    socket.on('feedback', function (data) {
        //demo data
        //TODO:
        var data = {sessionId:1,userId:33,starNum:3,feedbackContent:"PPT不够华丽"};
        //将数据推送给管理者界面显示统计结果
        socket.emit('feedbackCount', data);
    });
    socket.on('setValid', function(data){
      // data 是 session id
      socket.broadcast.emit('isvalid', data);
    });
    //监听推送分享管理员推送
    socket.on('push_feedback',function(data){
        //demo data
        //state:-1未推送，0正在推送，1推送完成
        var data = {sessionId:1,state:1,people:5,count:10};
        if(data.state === 1){
            socket.emit('push_close',data);
        }else if(data.state === 0){
            socket.emit('push_open',data);
        }
    })
});
