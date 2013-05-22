/*
 * @name: session.js
 * @description: 分享路由
 * @author: wondger@gmail.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */

var model = require("../models/session");
var db = require("../db");

var isRootFunc = function (plist, current) {
  var isRoot = false;

  for(var pid in plist) {
    if (plist[pid] == current) {
      isRoot = true;
      break;
    }
  }
  return isRoot;
};

// 渲染创建新分享页面
exports.new = function(req, res){
  var partyId,
    isRoot;
  
  if (req.cookies.partyid === undefined) {
    partyId = req.query.partyId;
    res.cookie("partyid", partyId);
  } else {
    isRoot = isRootFunc(req.user.parties, partyId);
    partyId = req.cookies.partyid;
  }

  if (partyId === undefined) {
    res.redirect("/party");
  } else {
    res.render('session/session_form', { 
      docTitle: '创建分享',
      hasAddIcon: false,
      partyId: partyId,
      backUrl: "/party/" + partyId,
      success: '1',
      msg: '',
      type: 1,
      id: '',
      title: '',
      description: '',
      speakers: '',
      from: '',
      to: ''
    });
  }  
};

// 提交创建新的分享
exports.create = function(req, res){
  model.put(req, res, render);

  function render() {
    // 创建完后重定向到对应的Party详细页面
    res.redirect("/party/" + req.body.partyId || "");
  }  
};

exports.edit = function(req, res){
  var partyId,
    sessionId = req.params.id,
    isRoot;

  if (req.cookies.partyid === undefined) {
    partyId = req.query.partyId;
    res.cookie("partyid", partyId);
  }  else {
    partyId = req.cookies.partyid;
  }

  if (partyId === undefined) {
    res.redirect("/party");
  } else {
    isRoot = isRootFunc(req.user.parties, partyId);
    model.get(req, res, render);  
  }

  function render(docs) {
    var _result;

    if (docs && docs.length) {
      _result = docs[0];
    } else {
      _result = {
        docTitle: '编辑分享',
        success: '0',
        err: '没有找到相应的分享'  
      }
    }

    res.render('session/session_form', { 
      docTitle: '编辑分享',
      success: '1',
      msg: '',
      type: 'edit',
      id: _result.id,
      backUrl: "/session/" + sessionId,
      partyId: req.query.partyId,
      title: _result.title,
      description: _result.description,
      speakers: _result.speakers,
      from: _result.from,
      to: _result.to,
      type: _result.type
    });

  } 
};

exports.get = function(req, res){
  model.get(req, res, render);

  function render(docs) {
    res.render('session/get', { 
        docs: docs,
        title: '查询分享' 
    });  
  } 
};

exports.del = function(req, res){
  var partyId,
    sessionId = req.params.id,
    isRoot;

  if (req.cookies.partyid === undefined) {
    partyId = req.query.partyId;
    res.cookie("partyid", partyId);
  }  else {
    partyId = req.cookies.partyid;
  }

  if (partyId === undefined) {
    res.redirect("/party");
  } else {
    isRoot = isRootFunc(req.user.parties, partyId);
    model.del(req, res, render);
  }

  function render(numAffected) {
    res.redirect("/party/" + partyId);
  } 
};

exports.update = function(req, res){
  var partyId;

  if (req.cookies.partyid === undefined) {
    partyId = req.query.partyId;
    res.cookie("partyid", partyId);
  }  else {
    partyId = req.cookies.partyid;
  }

  if (partyId === undefined) {
    res.redirect("/party");
  } else {
    model.post(req, res, render);
  }

  function render(numAffected) {
    res.redirect("/party/" + partyId);
  } 
};

exports.detail = function(req, res) {
  var partyId,
    isRoot;

  if (req.cookies.partyid === undefined) {
    partyId = req.query.partyId;
    res.cookie("partyid", partyId);
  }  else {
    partyId = req.cookies.partyid;
  }

  if (partyId === undefined) {
    res.redirect("/party");
  } else {
    isRoot = isRootFunc(req.user.parties, partyId);
    model.get(req, res, render);  
  }
  

  function render(docs){
    var doc = docs[0];

    if (doc !== undefined) {
      res.render('session/session_display', { 
        docTitle: '分享详情',
        backUrl: "/party/" + partyId,
        isRoot: isRoot,
        success: '1',
        msg: '',
        id: doc.id,
        partyId: partyId,
        title: doc.title,
        type: 'detail',
        description: doc.description,
        speakers: doc.speakers,
        feedbacked: doc.feedbacked,
        from: doc.from,
        to: doc.to    
      });   
    } else {
      res.render('session/session_msg', { 
        docTitle: '404',
        type: '404'
      });  
    }
    
 }   
  
};

exports.list = {
  render: function(req, res){
    res.render('session/list', { 
        docTitle: '分享会',
        hasAddIcon: true,
        id: req.params.id || ""
      }); 
  },
  get: function(req, res) {
    var ids,
        query = {},
        sessions = [],
        isError;

    if (ids = req.query.ids) {
      ids = ids.split(',');
      console.log("session ids:" + ids);
    }

    function checkFeedback(sessions, feedbacks){
      console.log(sessions, feedbacks)
      sessions.forEach(function(session, key){
        console.log(session.id)
        var feedbacked = feedbacks.some(function(feedback){
          // console.log(feedback.id, req.user._id, session._id);
          // console.log(feedback.session.equals(session._id));
          return feedback.session.equals(session._id) && feedback.creator.equals(req.user._id);
        });

        if(session.state == 1 && !feedbacked) {
           session.onfeedback = true;
        }
      });
      console.log(sessions);
      res.json({
        success: true,
        docs: sessions
      });
    }
    
    query.id = {
      $in: ids
    };

    db.get({
      collection: "session",
      query: query,
      complete: function(err, docs) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
          console.log("查询分享失败");
          return;
        }
        else {
          var list = [];
          docs.forEach(function(doc){
            list.push(doc._id);
          });

          db.get({
            collection: "feedback",
            query: {
              session: {$in:list}
            },
            complete: function(err, feedbacks){
              if(feedbacks)
                checkFeedback(docs, feedbacks);
            }
          });

        }
      }
    });

  }
};

/**
 * 保存推送开始时间
 * @author 剑平
 * @param req
 * @param res
 */
exports.startFeedbackTime = function(req, res){
    model.updateStartFeedbackTime(req, res,function(){});
}