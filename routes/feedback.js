/*
 * @name: feedback.js
 * @description: 分享反馈
 */

var model = require("../models/feedback");
var db = require("../db");
/**
 * 管理者查看反馈结果页面
 */
exports.result = function(req, res,http){
    res.render('feedback/result',{
        title: '查看反馈结果'
    })
}
/**
 * 保存反馈结果
 * @param req
 * @param res
 */
exports.save_count = function(req, res){
    model.put(req, res);
    res.end('{"test":1}');
    // res.redirect('back',{emailHasExists:'true'}));
}
