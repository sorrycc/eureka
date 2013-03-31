/*
 * @name: index.js
 * @description: database api
 * @author: wondger@gmail.com
 * @date: 2013-03-27
 * @param: 
 * @todo: 
 * @changelog: 
 */
var mongoose = require("mongoose"),
    _ = require("underscore"),
    schema = require("./schema"),
    DB_NAME = "eureka";

mongoose.connect("mongodb://localhost/" + DB_NAME);

module.exports = {
    // create
    put: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var doc = _.isObject(opt.doc) ? opt.doc : null,
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!doc || !collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var mod = new (mongoose.model(collection, schema[collection], collection))(doc);

       doc._deleted = false;

       mod.save(function(err, doc) {
           complete(err, doc);
       });
    },
    // update
    post: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var query = _.isObject(opt.query) ? opt.query : {},
           options = _.isObject(opt.options) ? opt.options : null,
           doc = _.isObject(opt.doc) ? opt.doc : null,
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!doc || !collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var mod = mongoose.model(collection, schema[collection], collection);

       query._deleted = doc._deleted = false;

       mod.update(query, doc, options, function(err, numAffected) {
           complete(err, numAffected);
       });
    },
    // delete
    del: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var query = _.isObject(opt.query) ? opt.query : {},
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!query || !collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       query._deleted = false;

       this.post({
           query: query,
           collection: collection,
           options: {
               multi: true
           },
           doc: {
               _deleted: true
           },
           complete: complete
       });
    },
    // read
    get: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var query = _.isObject(opt.query) ? opt.query : {},
           options = _.isObject(opt.options) ? opt.options : null,
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var mod = mongoose.model(collection, schema[collection], collection);

       // set _deleted true
       query._deleted = false;

       mod.find(query, null, options, function(err, docs) {
           complete(err, docs);
       });
    }
};
