
/*
 * GET home page.
 */


exports.index = function(req, res){
    res.redirect("/party");
  /*
   *res.render('index', {
   *    docTitle: 'Express',
   *    title: "Express",
   *    hasAddIcon: false
   *});
   */
};

exports.login = function(req, res){
    res.json(req.user);
};

exports.sessionList = function(req, res){
  res.render('./session/list', { docTitle: '我的分享会', headAdd: true});
};
