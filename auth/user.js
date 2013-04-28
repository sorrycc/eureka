/*
 * @name: index.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-27
 * @param: 
 * @todo: 
 * @changelog: 
 */
var nobuc = require("./nobuc"),
    db = require("../db");

module.exports = exports = function(filter, options) {
    return function(req, res, next) {
        if (!req._user || !req._user.loginName) {
            next();
            return;
        }

        db.get({
            query: {name: req._user.loginName},
            collection: "people",
            complete: function(err, docs) {
                if (err || !docs) {
                    res.send(err ? err.message : "DB error.");
                    return;
                }

                if (docs.length) {
                    req.user = {
                        _id: docs[0]._id,
                        name: docs[0].name,
                        nick: docs[0].nick
                    };

                    next();
                }
                else {
                    db.put({
                        doc: {
                            name: req._user.loginName,
                            nick: req._user.nickNameCn || req._user.loginName
                        },
                        collection: "people",
                        complete: function(err, doc) {
                            if (err) {
                                res.send(err ? err.message : "DB error.");
                                return;
                            }

                            req.user = {
                                _id: doc._id,
                                name: doc.name,
                                nick: doc.nick
                            };

                            next();
                        }
                    });
                }
            }
        });
    }
};
