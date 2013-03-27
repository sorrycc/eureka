/*
 * @name: schema.js
 * @description: database schema
 * @author: wondger@gmail.com
 * @date: 2013-03-27
 * @param: 
 * @todo: 
 * @changelog: 
 */

var Schema = require("mongoose").Schema;

module.exports = {
    // 分享会
    party: new Schema({
        creator: {
            "type": String,
            "required": true,
            "validate": /.+/
        },
        title: {
            "type": String,
            "trim": true,
            "required": true,
            "validate": /.+/
        },
        description: {
            "type": String,
            "trim": true
        },
        location: {
            "type": String,
            "trim": true
        },
        from: {
            "type": Date,
            "required": true
        },
        to: {
            "type": Date,
            "required": true
        },
        url: {
            "type": String,
            "required": true
        },
        qrurl: {
            "type": String,
            "required": true
        },
        state: {
            "type": Number,
            "enmu": [0, 1, 2, 3, 4, 5]
        },
        // 顺序存储
        sessions: {
            "type": Array
        },
        // 签到者
        listeners: {
            "type": Array
        },
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),

    // 分享
    session: new Schema({
        root: {
            "type": String,
            "required": true,
            "validate": /.+/
        },
        admins: {
            "type": Array
        },
        title: {
            "type": String,
            "trim": true,
            "required": true,
            "validate": /.+/
        },
        description: {
            "type": String,
            "trim": true
        },
        speakers: {
            "type": Array,
            "required": true
        },
        order: {
            "type": Number,
            "trim": true
        },
        from: {
            "type": Date,
            "required": true
        },
        to: {
            "type": Date,
            "required": true
        },
        state: {
            "type": Number,
            "enmu": [-1, 0, 1]
        },
        feedbacks: {
            "type": Array
        },
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        },
    }),

    // 反馈
    feedback: new Schema({
        // 创建时间
        created: {
            "type": Date,
        },
        // 分数
        score: {
            "type": Number
        },
        advise: {
        }
        creator: {
            "type": ObjectId
        },
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),

    // 人员
    people: new Schema({
        nick: {
            "type": String,
            "required": true
        },
        name: {
            "type": String,
            "required": true
        }
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),

    tag: new Schema({
        name: {
            "type": String
        },
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),

    entityTag: new Schema({
        tagId:{
            "type": ObjectId
        },
        relativeId: {
            "type": ObjectId
        }
    })

};
