
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: 'Express'});
};

exports.login = function(req, res){
    res.json(req.user);
};

exports.sessionList = function(req, res){
  res.render('./session/list', { docTitle: '我的分享会', headAdd: true});
};


// 剑平贱人，速删！
exports.sprite = {
    render: function(req, res) {
        res.render("sprite", {
            docTitle: "sprite"
        });
    }
};
