/*
 * 分享路由
 */

var model = require("../models/session");

exports.create = function(req, res){
  res.render('session/create', { 
	title: '创建分享' }
  );	
};

exports._create = function(req, res){
  model.put(req, res, render);

  function render(doc) {
  	console.log("-------------");
  	var _from = new Date(doc.from),
  		_to = new Date(doc.to);
  
    var _fromStr = _from.getHours() + ":" + _from.getMinutes(),
    	_toStr = _to.getHours()  + ":" + _to.getMinutes();

  	res.render('session/get', { 
  		session: doc.title,
  		description: doc.desc,
  		speakers: doc.speakers,
  		from: _fromStr,
  		to: _toStr,
  		title: '分享已创建' }
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