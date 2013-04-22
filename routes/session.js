/*
 * 分享路由
 */

var model = require("../models/session");

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
/**
 * 管理者查看反馈结果页面
 * by 剑平
 */
exports.feedback = function(req, res,http){
    res.render('session/feedback',{
        title: '查看反馈结果'
    })
}