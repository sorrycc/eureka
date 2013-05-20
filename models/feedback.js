var db = require("../db");
//反馈统计集合
var COUNT_COLLECTION = "feedback_count";
//分享集合
var SESSION_COLLECTION = "session";
//分享会集合
var PARTY_COLLECTION = "party";
/**
 * 保存反馈星数统计
 * @param req
 * @param res
 * @return {boolean}
 */
exports.saveCount = function(req, res) {
    //分享id
    var sessionId = req.body.sessionId;
    var partyId =  req.body.partyId;
    if(!sessionId){
        res.send('{"status":0,"message":"缺少sessionId"}');
        return false;
    }
    //星数统计
    var count = req.body.count;
    var people = req.body.people;
    if(!count){
        res.send('{"status":0,"message":"缺少count"}');
        return false;
    }
    var self = this;

    function _complete(err,res){
        if (err) {
            res.send('{"status":0,"message":"'+err+'"}');
        }
        else {
            res.send('{"status":1}');
        }
    }

    self.isExist(sessionId,function(result){
        if(result.length){
            db.post({
                collection: COUNT_COLLECTION,
                query: {session_id:sessionId},
                doc:{count:count,people:people},
                complete: function(err, docs) {
                    _complete(err, res);
                }
            });
        }else{
            db.put({
                collection: COUNT_COLLECTION,
                doc: {
                    session_id:sessionId,
                    party_id:partyId,
                    count:count,
                    people:people
                },
                complete: function(err, doc) {
                    _complete(err, res);
                }
            });
        }

    });
}
/**
 * 获取分享
 * @param req
 * @param res
 * @param render
 */
exports.getSession = function(sessionId, res, render) {
    var _query = {
      id: sessionId
    };
    db.get({
        collection: SESSION_COLLECTION,
        query: _query,
        complete: function(err, docs) {
            if (err) {
                res.send("error");
            }
            else {
                render(docs);
            }
        }
    });
}
exports.sessions = function(req, res, render){
    var _query = {
        party_id: req.partyId
    };
    db.get({
        collection: SESSION_COLLECTION,
        query: _query,
        complete: function(err, docs) {
            if (err) {
                res.send("error");
            }
            else {
                render(docs);
            }
        }
    });
}
exports.getcounts = function(req, res, render){
    var _query = {
        party_id: req.partyId
    };
    var self = this;
    db.get({
        collection: COUNT_COLLECTION,
        query: _query,
        complete: function(err, counts) {
            if (err) {
                res.send("error");
            }
            else {
                self.sessions(req, res,function(sessions){
                    for(var i = 0;i<sessions.length;i++){
                        if(req.id != sessions[i].id){
                            for(var j = 0;j<counts.length;j++){
                                if(sessions[i].id === counts[j].session_id){
                                    sessions[i].count = counts[j].count;
                                }
                            }
                        }
                    }
                    render(sessions);
                });
            }
        }
    });
}
/**
 * 删除统计
 * @param req
 * @param res
 * @param render
 */
exports.del = function(req, res, render) {
	var _query = {
    id: req.params.id
  };

	db.del({
	    query: _query,
	    collection: COUNT_COLLECTION,
	    complete: function(err, numAffected) {
	        if (err) {
	            console.log(err.message);
	            return;
	        } else {
	        	render(numAffected);
	        }
	    }
	});
}
/**
 * 是否已经存在反馈统计
 */
exports.isExist = function(session_id,render){
    if(!session_id) return false;
    db.get({
        query: {session_id:session_id},
        collection: COUNT_COLLECTION,
        complete:function(err, docs){
            console.log(docs);
            render(docs);
        }
    });
}
exports.getStatus = function(req,res){
    var sessionId = req.params.id;
    this.getSession(sessionId,function(session){
        var state = session.state;
        console.log(state);
        res.send('{"status":'+state+'}');
    })
}