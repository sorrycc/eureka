/*
 * @name: party.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */

var moment = require("moment");
var db = require("../db");

module.exports = {
    create: {
        render: function(req, res) {
            res.render("party_form", {
                title: "创建分享会",
                id: "",
                partyTitle: "",
                time: "",
                location: ""
            });
        },
        post: function(req, res) {
            req.cookies.nick = "棪木";
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
            res.render("party", {
                title: "分享会",
                id: req.params.id || ""
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
    },
    edit: {
        render: function(req, res) {
            db.get({
                query: {
                    id: req.params.id
                },
                collection: "party",
                complete: function(err, docs) {
                    if (err) {
                        res.send(err.message);
                        return;
                    }

                    if (!docs.length) {
                        res.send("can not find this party.");
                        return;
                    }

                    var doc = docs[0];

                    res.render("party_form", {
                        title: "编辑分享会",
                        id: doc.id,
                        partyTitle: doc.title,
                        time: moment(doc.time).format("YYYY-MM-DD"),
                        location: doc.location
                    });
                }
            });
        },
        post: function(req, res) {
            var id = req.params.id;

            if (!id) {
                res.json({
                    success: false,
                    message: "no id param"
                });
                return;
            }

            req.body.id = id;

            db.post({
                query: {
                    id: id
                },
                doc: req.body,
                collection: "party",
                complete: function(err, numAffected) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    res.json({
                        success: true,
                        id: id
                    });
                }
            });
        }
    },
    sprite: {
        render: function(req, res) {
            console.log(req);
            res.render("sprite", {
                title: "sprite"
            });
        }
    },
    del: function(req, res, next) {
        var id = req.params.id;
        
        if (!id) {
            res.json({
                "success": false,
                "message": "Param error"
            });
        }

        db.del({
            collection: "party",
            query: {
                id: id
            },
            complete: function(err, numAffected) {
                if (err) {
                    res.json({
                        success: false,
                        message: err.message
                    });
                    return;
                }

                res.json({
                    success: true,
                    numAffected: numAffected
                });
            }
        });
    }
};
