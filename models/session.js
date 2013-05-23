

var db = require("../db");

exports.put = function(req, res, render) {
	db.put({
        collection: "session",
        doc: {
	        title: req.body.title,
	        description: req.body.desc,
	        speakers: req.body.speakers.replace(",", ","),
	        from: req.body.from,
	        to: req.body.to,
            party_id:req.body.partyId,
	        state: 0, 
	        feedbacks: [],
	        _deleted: false
        },
        complete: function(err, doc) {
            if (err) {
                console.log(err);
                res.send("session insert error");
            }
            else {
                var session = doc;
                db.get({
                    query: {
                       id: req.body.partyId
                    },
                    collection: "party",
                    complete: function(err, docs) {
                        if (err) {
                            res.send("query party error, partyId:" + req.body.partyId);
                        }
                        else {
                            docs[0].sessions.push(session.id);
                            db.post({
                                query:{
                                    id: req.body.partyId
                                },
                                collection: "party",
                                doc: {
                                    sessions: docs[0].sessions
                                },
                                complete: function(err, doc) {
                                    if (err) {
                                        //console.log("2============"+doc);
                                        res.send("update party sessions error, message:"+ err.message);
                                    }
                                    else {
                                        render();
                                    }
                                }
                            });
                        }
                        
                    }
                });
                
            }
        }
    });
};

exports.get = function(req, res, render) {
    var _query = {
      id: req.params.id
    };

    function checkFeedbacked(docs, data){
        var d = docs[0];
        docs[0] = {
            title: d.title,
            description: d.description,
            speakers: d.speakers,
            from: d.from,
            to: d.to,
            _id: d._id,
            _deleted: d._deleted,
            onfeedback: d.onfeedback,
            party_id: d.party_id,
            feedbacks: d.feedbacks,
            start_feedback_time: d.start_feedback_time,
            state: d.state,
            id: d.id,
            feedbacked: d.state === 1 ? !!data : false
        };
        render(docs);
    }

    db.get({
        collection: "session",
        query: _query,
        complete: function(err, docs) {
            if (err) {
                res.send("error");
            }
            else {
                db.get({
                    collection: "feedback",
                    query: {
                        creator: req.user._id,
                        seesion: docs._id
                    },
                    complete: function(data){
                        checkFeedbacked(docs, data);
                    }
                });

                //render(docs);
            }
        }
    });
};

exports.del = function(req, res, render) {
	var _query = {
    id: req.params.id
  };

	db.del({
        query: _query,
	    collection: "session",
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

exports.post = function(req, res, render) {
	var _query = {
    id : req.params.id
  };

	db.post({
	    query: _query,
        collection: "session",
	    doc: {
        title: req.body.title,
        description: req.body.desc,
        speakers: req.body.speakers.replace(",", ","),
        from: req.body.from,
        to: req.body.to,
        state: 0, 
        feedbacks: [],
        _deleted: false
      },
	    options: {
	        multi: true
	    },
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
exports.updateStartFeedbackTime=function(req, res, render){
    var _query = {
        id : req.params.id
    };
    //当前时间戳
    var time = Date.parse(new Date());
    db.post({
        query: _query,
        collection: "session",
        doc: {
            start_feedback_time: time,
            state: 1
        },
        options: {
            multi: true
        },
        complete: function(err, numAffected) {
            if (err) {
                console.log(err.message);
                res.send('{"status":0,"message":"'+err.message+'"}');
                return;
            } else {
                res.send('{"status":1,"time":'+time+'}');
                render(numAffected);
            }
        }
    });
}
