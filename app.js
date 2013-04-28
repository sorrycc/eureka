
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
    // PORT=3000 node app
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser("eureka1367047474"));
    app.use(express.methodOverride());

    // auth
    app.use(nobuc(/.*/, {
        hostname: "login-test.alibaba-inc.com",
        appname: "eureka"
    }));

    app.use(user());

    app.use(app.router);

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
});

// NODE_ENV=development node app
app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);

// 棪木
app.get('/login', function(req, res) {
});

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
app.get('/session/create', session.new);
app.post('/session/create', session.create);
//app.get('/session/get', session.get);
app.get('/session/edit/:id', session.edit);
app.get('/session/update/:id', session.update);
app.post('/session/del/:id', session.del);
app.get('/session/detail/:id', function(req, res) {
    session.detail.render(req, res);
});

// 水儿
// render the session list belonging to the party with the id
app.get('/session/list/:id', function(req, res) {
    session.list.render(req, res);
});
app.get('/api/session/list/:id', function(req, res) {
    session.list.get(req, res);
});
// app.get(/session/(/d+), function(req, res) {
// });

// feedback
// 筱谷
app.get('/feedback/make/:id', feedback.make);
app.post('/feedback/make/:id', feedback.post);
app.get('/feedback/list', function(req, res) {
});
//剑平
app.get('/feedback/result', feedback.result);
app.post('/feedback/save_count', feedback.save_count);

var server = http.createServer(app);

io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    //监听听众的打分数据
    socket.on('feedback', function (data) {
        //demo data
        var data = {sessionId:1,userId:33,starNum:3,feedbackContent:"PPT不够华丽"};
        //将数据推送给管理者界面显示统计结果
        socket.emit('feedbackCount', data);
    });
});
