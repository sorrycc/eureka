
var db = require("../db");

function getTopic(id, callback) {
  db.get({
    query: {
      id: parseInt(id)
    },
    collection: "session",
    complete: callback
  })
}

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
    dataObj.creator = topic.ObjectId
//    dataObj.score = 5
//    dataObj.advice = "haha"
//    dataObj.creator = "11"
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
    res.render('feedback/result',{
        docTitle: '查看反馈结果'
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