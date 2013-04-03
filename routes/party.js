/*
 * @name: party.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */

var db = require("../db");

module.exports = {
    create: {
        get: function(req, res) {
            res.render("party_create", {
                title: "创建分享会"
            });
        },
        post: function(req, res) {
            if (!req.cookies.nick) {
                res.json({
                    success: false,
                    message: "Login Error"
                });
                return;
            }

            if (!req.body.title || !req.body.time || !req.body.location) {
                res.json({
                    success: false,
                    message: "Param Error"
                });
                return;
            }

            try {
                db.put({
                    collection: "party",
                    doc: {
                        root: req.cookies.nick,
                        title: req.body.title,
                        time: Date(req.body.time),
                        location: req.body.location,
                    },
                    complete: function(err, doc) {
                        if (err) {
                            res.json({
                                success: false,
                                message: err.message
                            });
                        }

                        else {
                            res.json({
                                success: true,
                                _id: doc._id,
                                url: doc.url || "/party/" + doc.id
                            });
                        }
                    }
                });
            }
            catch (err) {
                res.json({
                    success: false,
                    message: err.message,
                });
            }
        }
    },
    list: {
        render: function(req, res) {
            res.render("party_list", {
                title: "分享会列表"
            });
        },
        get: function(req, res) {
            var id,
                query = {};

            if (id = req.params.id) {
                query.id = id;
            }

            db.get({
                query: query,
                collection: "party",
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    res.json({
                        success: true,
                        docs: docs
                    });
                }
            });
        }
    }
};
