var db = require("../db");

exports.put = function(req, res, render) {

    console.log(req.query);

    db.put({
        collection: "session",
        doc: {
	        title: "小分享",
	        description: "懒懒交流会的一个分享",
	        speakers: ["7nian"],
	        order: 1,
	        from: new Date(),
	        to: new Date(),
	        state: 0, 
	        feedbacks: [],
	        _deleted: false
        },
        complete: function(err, doc) {
            if (err) {
                res.send("error");
            }
            else {
                render(doc);
            }
        }
    });
}

exports.get = function(req, res, render) {
    var _query = {
            title: req.query.title
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