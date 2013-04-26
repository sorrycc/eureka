/*
 * @name: feedback.js
 * @description: 分享反馈
 */

var model = require("../models/feedback");
var db = require("../db");
exports.make = function(req, res){
    res.render('feedback/make', {
        docTitle     : "反馈进行时",
        headAdd   : false
    })
}
/**
 * 管理者查看反馈结果页面
 */
exports.result = function(req, res){
    res.render('feedback/result',{
        docTitle: '查看反馈结果'
    })
}
/**
 * 保存反馈结果
 * @param req
 * @param res
 */
exports.save_count = function(req, res){
    model.put(req, res,function(result){
        res.end('{"status":1}');
    });
}