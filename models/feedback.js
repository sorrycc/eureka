var db = require("../db");
//反馈统计集合
var COUNT_COLLECTION = "feedback_count";
//分享集合
var SESSION_COLLECTION = "session";
/**
 * 保存反馈星数统计
 * @param req
 * @param res
 * @return {boolean}
 */
exports.saveCount = function(req, res,render) {
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

    /**
     * 保存或更新数据完成后执行的方法
     * @param err
     * @param res
     * @private
     */
    function _complete(err,res){
        if(render){
            render();
        }else{
            if (err) {
                res.send('{"status":0,"message":"'+err+'"}');
            }
            else {
                res.send('{"status":1}');
            }
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
            console.log('partyId',partyId);
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
    self.sessions(req, res,function(sessions){
        var newSessions = [];
        db.get({
            collection: COUNT_COLLECTION,
            query: _query,
            complete: function(err, counts) {
                if (err) {
                    res.send("error");
                }
                else {
                    for(var i = 0;i<sessions.length;i++){
                        sessions[i].count = 0;
                        if(req.id != sessions[i].id){
                            for(var j = 0;j<counts.length;j++){
                                if(sessions[i].id === counts[j].session_id){
                                    sessions[i].count = counts[j].count;
                                }
                            }
                        }
                        if(sessions[i].id !=req.id) newSessions.push(sessions[i]);
                    }
                    render(newSessions);
                }
            }
        });

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
/**
 * 获取反馈推送起始时间
 * @param req
 * @param res
 * @return {boolean}
 */
exports.getStartFeedbackTime = function(req,res){
    var sessionId = req.params.sessionId;
    if(!sessionId){
         res.send('{"status":-2}');
         return false;
    }
    this.getSession(sessionId,res,function(session){
         var status = Number(session[0].state) || 1;
         var time = Number(session[0].start_feedback_time) || -1;
         res.send('{"status":'+status+',"start_feedback_time":'+time+'}');
    })
}

exports.getCount = function(sessionId,render){
    if(!sessionId){
        console.log('缺少session-id');
        return false;
    }
    db.get({
        query: {session_id:sessionId},
        collection: COUNT_COLLECTION,
        complete:function(err, docs){
            render(docs);
        }
    });
}
/**
 * 关闭反馈
 * @param sessionId
 */
exports.closeFeedback = function(sessionId,render){
    db.post({
        query: {id:sessionId},
        collection: SESSION_COLLECTION,
        doc: {
            state: 2
        },
        options: {
            multi: true
        },
        complete: function(err) {
            if(render)render(err);
        }
    });
}
exports.updateStatus = function(sessionId,status,render){
    db.post({
        query: {id:sessionId},
        collection: SESSION_COLLECTION,
        doc: {
            state: status
        },
        options: {
            multi: true
        },
        complete: function(err) {
            if(render)render(err);
        }
    });
}