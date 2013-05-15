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
        if (/\.(?:js|css|gif|jpg|jpeg|png|swf)[^.]*$/.test(req.url)) {
            next();
            return;
        }

        // party id
        var pid = req.url.match(/party\/(?:(\d+)|eidt\/(\d+))/);

        if (pid && pid[1]) {
            res.cookie("partyid", pid[1]);
        }
        
        if (/\/party\/*$/.test(req.url)) {
            res.clearCookie("partyid");
        };

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
                    getParties(docs[0]);
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

                            getParties(doc);
                        }
                    });
                }
            }
        });

        function getParties(user) {
            db.get({
                collection: "party",
                query: {
                    root: user._id
                },
                complete: function(err, docs) {
                    var partyids = [];

                    if (!err && docs && docs.length) {
                        docs.forEach(function(doc){
                            partyids.push(doc.id);
                        });
                    }

                    req.user = {
                        _id: user._id,
                        name: user.name,
                        nick: user.nick,
                        parties: partyids
                    };

                    next();
                }
            });
        }
    }
};
