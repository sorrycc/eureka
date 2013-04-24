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

exports.new = function(req, res){
  res.render('session/session_form', { 
    docTitle: '创建分享',
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
};

exports.create = function(req, res){
  model.put(req, res, render);

  function render(doc) {
    // var _from = new Date(doc.from),
    //   _to = new Date(doc.to);
  
    // var _fromStr = _from.getHours() + ":" + _from.getMinutes(),
    //   _toStr = _to.getHours()  + ":" + _to.getMinutes();

    console.log(doc);

    res.render('session/session_display', { 
      success: '1',
      msg: '',
      id: doc.id,
      docTitle: '分享已创建',
      title: doc.title,
      description: doc.description,
      speakers: doc.speakers,
      from: doc.from,
      to: doc.to
    });  
  }  
};

exports.edit = function(req, res){
  model.get(req, res, render);

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
        title: '查询分享' }
      );  
  } 
};

exports.del = function(req, res){
  model.del(req, res, render);

  function render(numAffected) {
    res.render('session/session_del', {
      docTitle: '删除分享',
      num: numAffected,
      success: '1',
      msg: ''
    });
  } 
};



exports.update = function(req, res){
  model.post(req, res, render);

  function render(numAffected) {
    res.render('session/update', {
      title: '更新分享',
      num: numAffected
    });
  } 
};

exports.detail = {
  render: function(req, res){
    res.render('session/detail', { 
        title: '分享详情',
        headAdd: true,
        id: req.params.id || ""
      }); 
  }
};



exports.list = {
  render: function(req, res){
    res.render('session/list', { 
        title: '分享列表',
        headAdd: true,
            id: req.params.id || ""
      }); 
  },
  get: function(req, res) {
            var id,
                query = {};

            if (id = req.params.id) {
                query.id = id;
                console.log("party id:"+id)
            }

            db.get({
                query: query,
                collection: "party",
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }
                    // 模拟数据
                    // if(docs[0].sessions === []){
                        docs[0].sessions =[{
                            id: "1",
                            from: "13:00",
                            to: "14:00",
                            title: "分享一"
                        },
                        {
                            id: "2",
                            from: "14:00",
                            to: "15:00",
                            title: "分享二"
                        }]
                    // }

                    res.json({
                        success: true,
                        party: docs
                    });
                }
            });
        }
};

/**
 * 管理者查看反馈结果页面
 * by 剑平
 */
exports.feedback = function(req, res,http){
    res.render('session/feedback',{
        title: '查看反馈结果'
    })
}
