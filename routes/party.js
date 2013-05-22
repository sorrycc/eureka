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
            res.render("party/form", {
                docTitle: "创建分享会",
                id: "",
                backUrl: "/party",
                partyTitle: "",
                time: "",
                location: "",
                hasAddIcon: false
            });
        },
        post: function(req, res) {

            if (!req.user || !req.user._id) {
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
                        root: req.user._id,
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
            res.render("party/list", {
                docTitle : "我的分享会",
                id: req.params.id || "",
                hasAddIcon: true,
                backUrl: req.params.id ? "/party" : ""
            });
        },
        get: function(req, res) {
            var id,
                query = {},
                options = {},
                isadmin = true;

            var host = req.get('host');

            if (id = req.params.id) {
                query.id = id;

                isadmin = false;
                req.user.parties.forEach(function(pid) {
                    isadmin = isadmin || pid === parseInt(id, 10);
                });
            }

            if (!id && !req.user.parties.length) {
                options.limit = 1;
                isadmin = false;
            }
            else if (!id) {
                query.root = req.user._id;
            }

            db.get({
                query: query,
                collection: "party",
                options: options,
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    docs.forEach(function(doc, index){
                        docs[index] = {
                            _id: doc._id
                            , id: doc.id
                            , root: doc.root
                            , title: doc.title
                            , time: doc.time
                            , location: doc.location
                            , admins: doc.admins
                            , sessions: doc.sessions
                            , listeners: doc.listeners
                            , formatTime: moment(doc.time).format("YYYY-MM-DD")
                            , isadmin: isadmin
                            , host: host
                        };
                    });

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
                    id: req.params.id,
                    root: req.user._id
                },
                collection: "party",
                complete: function(err, docs) {
                    if (err) {
                        res.redirect("/404");
                        return;
                    }

                    if (!docs.length) {
                        res.redirect("/404");
                        return;
                    }

                    var doc = docs[0];

                    res.render("party/form", {
                        docTitle: "编辑分享会",
                        id: doc.id,
                        backUrl: "/party/" + req.params.id,
                        partyTitle: doc.title,
                        time: moment(doc.time).format("YYYY-MM-DD"),
                        location: doc.location,
                        hasAddIcon: false
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
                    id: id,
                    root: req.user._id
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

                    if (!numAffected) {
                        res.json({
                            success: false,
                            message: "party not exist"
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
                id: id,
                root: req.user._id
            },
            complete: function(err, numAffected) {
                if (err) {
                    res.json({
                        success: false,
                        message: err.message
                    });
                    return;
                }

                if (!numAffected) {
                    res.json({
                        success: false,
                        message: "party not exist"
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
