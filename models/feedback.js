var db = require("../db");

exports.put = function(req, res,success) {
    //分享id
    var sessionId = req.body.session_id;
    if(!sessionId){
        res.send('{"status":0,"message":"缺少sessionId"}');
        return false;
    }
    //星数统计
    var count = req.body.count;
    if(!count){
        res.send('{"status":0,"message":"缺少count"}');
        return false;
    }
	db.put({
        collection: "feedback_count",
        doc: {
            session_id:sessionId,
            count:count
        },
        complete: function(err, doc) {
            if (err) {
                res.send('{"status":0,"message":"'+err+'"}');
            }
            else {
                success && success.call(self,doc);
            }
        }
    });
}

exports.get = function(req, res, render) {
    var _query = {
      id: req.params.id
    };
    console.log(_query);

    db.get({
        collection: "session",
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
	var _query = {"title": "小分享"};

	db.post({
	    collection: "session",
	    doc: {
	        title: "大分享",
	        description: "懒懒交流会的一个分享",
	        speakers: ["7nian"],
	        order: 1,
	        from: new Date(),
	        to: new Date(),
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