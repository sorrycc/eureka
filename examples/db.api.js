/*
 * @name: db.api.js
 * @description: db module api examples
 * @author: wondger@gmail.com
 * @date: 2013-03-31
 * @param: 
 * @todo: 
 * @changelog: 
 */

var db = require("../db");

/*
 *db.put({
 *    collection: "tag",
 *    doc: {
 *        name: "test" + new Date().getTime()
 *    },
 *    complete: function(err, doc) {
 *        if (err) {
 *            console.log(err.message);
 *            return;
 *        }
 *
 *        console.log(doc);
 *    }
 *});
 */


/*
 *db.post({
 *    collection: "tag",
 *    doc: {
 *        name: new Date().getTime()
 *    },
 *    options: {
 *        //multi: true
 *    },
 *    complete: function(err, numAffected) {
 *        if (err) {
 *            console.log(err.message);
 *            return;
 *        }
 *
 *        console.log(numAffected);
 *    }
 *});
 */


/*
 *db.del({
 *    query: {
 *        name: "1364741673597"
 *    },
 *    collection: "tag",
 *    complete: function(err, numAffected) {
 *        if (err) {
 *            console.log(err.message);
 *            return;
 *        }
 *
 *        console.log(numAffected);
 *    }
 *});
 */


/*
 *db.get({
 *    collection: "tag",
 *    complete: function(err, docs) {
 *        console.log(docs);
 *    }
 *});
 */

exports.put = function(req, res) {

    console.log(req.query);

    db.put({
        collection: "tag",
        doc: {
            name: req.query.tag || "tag" + new Date().getTime()
        },
        complete: function(err, doc) {
            if (err) {
                res.send("error");
            }
            else {
                res.json(doc);
            }
        }
    });
}


exports.del = function(req, res) {

    console.log(req.query);

    db.del({
        collection: "tag",
        query: {
            name: req.query.tag
        },
        complete: function(err, numAffected) {
            if (err) {
                res.send("error");
            }
            else {
                res.json({num: numAffected});
            }
        }
    });
}
