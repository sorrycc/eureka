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

exports.create = function(req, res){
  model.put(req, res, render);

  function render(doc) {
  	res.render('session/create', { 
  		session: doc.title,
  		title: '创建分享' }
  	);	
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
		res.render('session/del', {
			title: '更新分享',
			num: numAffected
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
