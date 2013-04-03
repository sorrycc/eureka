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