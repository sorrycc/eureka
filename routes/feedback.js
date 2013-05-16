
var db = require("../db");
var model = require("../models/feedback");

function getTopic(id, callback) {
  db.get({
    query: {
      id: parseInt(id)
    },
    collection: "session",
    complete: callback
  })
}

// 观众反馈页面
exports.make = function(req, res){
  var renderObj = {}
  renderObj.docTitle = "反馈进行时";
  getTopic(req.params.id, render);

  function render(err, docs){
    if(err || !(topic = docs[0])) {
      renderObj.type = "1";
      renderObj.responseString = "无此主题，或暂时还不能反馈哦"
    }
    else {
      renderObj.type            = "0";
      renderObj.responseString  = ""
      renderObj.title           = topic.title
      renderObj.speakers        = topic.speakers
      renderObj.score           = 3
      renderObj.advise          = ""
      renderObj.id              = req.params.id
    }
    res.render('feedback/make', renderObj)
  }
}

// 观众提交
exports.post = function(req, res) {
  var renderObj = {};
  var topic = null;
  getTopic(req.params.id, putData);

  function putData(err, docs) {
    topic = docs[0];
    var dataObj = {};
    for(var key in req.params) {
      if(req.params.hasOwnProperty(key) && key != 'id') {
        dataObj[key] = req.params[key]
      }
    }

    // 暂时用分享的id 代替作者 id
    dataObj.creator = req.user.ObjectId

    db.put({
      doc       : dataObj,
      collection: "feedback",
      complete  : addFeedbackToTopic
    })

    function addFeedbackToTopic(err, doc){
      console.log(doc);

      if(!doc) {
        console.log(err);
        return;
      }

      topic.feedbacks.push(doc.id);
      db.post({
        query   : {id: req.params.id},
        doc     : topic,
        complete: render
      })

      // 删除未评论 Cookie
      var remainCount = parseInt(req.cookies['remainCount']),
          remainList = JSON.parse(req.cookies['remainList']);
      var index = remainList.indexOf(parseInt(req.params.id));
      if(index >= 0) {
        remainList.splice(index, 1)
      }
      res.cookies['remainCount'] = remainList.length;
      res.cookies['remainList'] = JSON.parse(remainList);
    }
  }

  function render(err, numAffected) {
    renderObj.docTitle = "提交成功"
    renderObj.type = "1"
    renderObj.responseString = "你的反馈已经成功提交啦！"
    res.render('feedback/make', renderObj)
  }
}
/**
 * 管理者查看反馈结果页面
 */
exports.result = function(req, res){
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    var partyId = cookies['partyid'];
    if(!partyId){

    }else{
        var sessionId = req.params.sessionId;
        //获取sessionId
        model.getSession(sessionId,res,function(result){
            var data = result[0];
            req.id = data.id;
            req.partyId = partyId;
            model.getcounts(req,res,function(sessions){
                data.docTitle = '《' + data.title + '》的反馈结果';
                data.sessions = sessions;
                data.partyId = req.params.partyId;
                data.sessionId = req.params.sessionId;
                res.render('feedback/result',data);
            })
        })
    }
}
/**
 * 保存反馈结果
 * @param req
 * @param res
 */
exports.save_count = function(req, res){
    model.saveCount(req, res);
}
