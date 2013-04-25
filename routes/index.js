
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: 'Express'});
};

exports.sessionList = function(req, res){
  res.render('./session/list', { docTitle: '我的分享会', headAdd: true});
};