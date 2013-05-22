
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
  var renderObj = {};
  var topic = {};
  renderObj.docTitle = "反馈进行时";
  getTopic(req.params.id, render);

  function render(err, docs){
    if(err || !(topic = docs[0])) {
      renderObj.type = "1";
      renderObj.id = req.params.id;
      renderObj.responseString = "无此主题，或暂时还不能反馈哦";
      res.render('feedback/make', renderObj);
    }
    else {
      db.get({
        query: {
          session: topic._id,
          creator: req.user._id
        },
        collection: "feedback",
        complete: real_render
      });
    }
  }

  function real_render(err, docs) {
    if(err || (feedback = docs[0])) {
      renderObj.type = "1";
      renderObj.id = req.params.id;
      renderObj.responseString = "不能重复反馈哦！";
    }
    else {
      renderObj.type            = "0";
      renderObj.responseString  = "";
      renderObj.title           = topic.title;
      renderObj.speakers        = topic.speakers;
      renderObj.score           = 3;
      renderObj.advise          = "";
      renderObj.id              = req.params.id;
      renderObj.backUrl         = "/party/" + topic.id;
    }
    res.render('feedback/make', renderObj); 
  }
}

// 观众提交
exports.post = function(req, res) {
  var renderObj = {};
  var topic = null;
  var sessionId =req.params.id;
  //星数
  var score = 0;
  var partyId;
  getTopic(sessionId, putData);

  function putData(err, docs) {
    topic = docs[0];
    partyId = topic.party_id;
    var dataObj = {};
    for(var key in req.body) {
      if(req.body.hasOwnProperty(key) && key != 'id') {
        dataObj[key] = req.body[key];
      }
    }

    dataObj.creator = req.user._id;
    dataObj.session = topic._id;
    score =  Number(dataObj.score);
    console.log("DDDDD", dataObj);

    db.put({
      doc       : dataObj,
      collection: "feedback",
      complete  : addFeedbackToTopic
    });

    function addFeedbackToTopic(err, doc){
      if(!doc) {
        console.log(err);
        return;
      }

      topic.feedbacks.push(doc.id);
      topic.status = 1;
      topic.backUrl = "/party/" + topic.id;
      db.post({
        query   : {id: req.params.id},
        doc     : topic,
        complete: saveStars
      })
    }
  }

    /**
     * 保存星数
      */
  function saveStars(){
        model.getCount(sessionId,function(feedBackCount){
            var count;
            var people;
            if(feedBackCount.length){
                count = Number(feedBackCount[0].count);
                people = Number(feedBackCount[0].people);
                count += score;
                people +=1;
            }else{
                count = score;
                people = 1;
            }
            model.saveCount({body:{sessionId:sessionId,partyId:partyId,count:count,people:people}},{},function(){
                render();
            })
        })
  }

  function render(err, numAffected) {

    // 删除未评论 Cookie
    var remainCount_str = req.cookies['remainCount'],
        remainList_str  = req.cookies['remainList'];
    var remainCount = remainCount_str ? parseInt(remainCount_str) : 0,
        remainList = remainList_str ? JSON.parse(remainList_str) : [];

    var index = remainList.indexOf(parseInt(req.params.id));
    if(index >= 0) {
      remainList.splice(index, 1)
    }
    res.cookie('remainCount', remainList.length, {path: '/'});
    res.cookie('remainList', JSON.stringify(remainList), {path: '/'});

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
    var partyId = Number(cookies['partyid']);
    if(!partyId){

    }else{
        var sessionId = req.params.sessionId;
        //获取sessionId
        model.getSession(sessionId,res,function(result){
            var data = result[0];
            req.id = data.id;
            req.partyId = partyId;
            data.count = 0;
            data.people = 0;

            model.getCount(sessionId,function(result){
                if(result.length){
                    //得分
                    data.count = result[0].count;
                    //次数
                    data.people = result[0].people;
                }
                model.getcounts(req,res,function(sessions){
                    data.docTitle = '《' + data.title + '》的反馈结果';
                    data.sessions = sessions;
                    data.partyId = req.params.partyId;
                    data.sessionId = req.params.sessionId;
                    res.render('feedback/result',data);
                })
            });
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
exports.close = function(req, res){
    var sessionId = req.body.sessionId;
    model.closeFeedback(sessionId,function(err){
        if(err){
            res.send('{"status":0}');
        }else{
            res.send('{"status":1}');
        }
    })
}
exports.getStartFeedbackTime = function(req,res){
    model.getStartFeedbackTime(req, res);
}
