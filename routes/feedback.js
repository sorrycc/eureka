
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
      renderObj.pid = req.cookies.partyid;
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
      renderObj.pid = req.cookies.partyid;
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
      renderObj.backUrl         = "/party/" + req.cookies.partyid;
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
    if(Number(topic.state) !== 1){
        renderObj.docTitle = "提交失败";
        renderObj.type = "1";
        renderObj.pid = req.cookies.partyid;
        renderObj.responseString = "反馈" + topic.stat === 2 ? "已经关闭！" : "未开始！";
        res.render('feedback/make', renderObj)
        return false;
    }
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

    db.put({
      doc       : dataObj,
      collection: "feedback",
      complete  : addFeedbackToTopic
    });

    function addFeedbackToTopic(err, doc){
      if(!doc) {
        return;
      }

      topic.feedbacks.push(doc.id);
      topic.status = 1;
      topic.backUrl = "/party/" + req.cookies.partyid;
      db.post({
        collection: 'session',
        query   : {id: req.params.id},
        doc     : topic,
        complete: saveStars
      });
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
    renderObj.pid = req.cookies.partyid;
    renderObj.responseString = "你的反馈已经成功提交啦！"
    res.render('feedback/make', renderObj)
  }
}
/**
 * 管理者查看反馈结果页面
 */
exports.result = function(req, res){
    var sessionId = req.params.sessionId;
    if(!sessionId){
        res.render('404');
        return false;
    }
    //获取sessionId
    model.getSession(sessionId,res,function(result){
        var data = result[0];
        req.id = data.id;
        req.partyId = data.party_id;
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
                data.partyId = req.partyId;
                data.sessionId = req.params.sessionId;
                res.render('feedback/result',data);
            })
        });
    })
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
exports.status = function(req,res){
    var sessionId = Number(req.body.sessionId);
    var status = Number(req.body.status);
    model.updateStatus(sessionId,status,function(err){
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
