
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
var db = require("./db");


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
            hostname: app.get("env") === "development" ? "login-test.alibaba-inc.com" : "login.alibaba-inc.com",
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

    app.use(function(req, res, next){
        res.render("404", {
            docTitle: "404"
        });
    });
});

// NODE_ENV=development node app
app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/user', routes.user);

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

// 7n's
app.get('/session/create', session.new);
app.post('/session/create', session.create);
app.get('/session/:id', session.detail);
app.get('/session/:id/edit', session.edit);
app.post('/session/:id/edit', session.update);
app.del('/session/:id', session.del);
app.get('/session/del/:id', session.del);
//保存推送开始时间 by 剑平
app.post('/session/start_feedback_time/:id', session.startFeedbackTime);

// 水儿
// get sessions by party id
app.get('/api/session/list', function(req, res) {
    session.list.get(req, res);
});


// feedback
// 筱谷
app.get('/feedback/make/:id', feedback.make);
app.post('/feedback/make/:id', function(req, res){
  sendToJianPin(req);
  feedback.post(req, res);
});
app.get('/feedback/list', function(req, res) {
});
//剑平
app.get('/feedback/result/:sessionId', feedback.result);
app.post('/feedback/save_count', feedback.save_count);
app.post('/feedback/close', feedback.close);
app.post('/feedback/status', feedback.status);
app.get('/feedback/get_start_feedback_time/:sessionId', feedback.getStartFeedbackTime);
app.get('/error/404',function(req, res){
    res.render('404',{docTitle:'页面出错啦~'});
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    //管理员推送反馈许可
    socket.on('setValid', function(data){
        db.post({
            collection: 'session',
            query: {id: Number(data)},
            doc: {state:1},
            complete:function(err,docs){
                console.log(err);
            }
        });
      socket.broadcast.emit('isValid', data);
    });
});

var starSocket;

function sendToJianPin(req) {
  if(starSocket)
    starSocket.emit("jianping", {
      sessionId: req.params.id,
      score: req.body.score
    })
}

io.of('/stars').on("connection", function(star_socket){
  starSocket = star_socket;
})
