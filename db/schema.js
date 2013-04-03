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
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
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
        location: {
            "type": String,
            "trim": true,
            "required": true
        },
        time: {
            "type": Date,
            "required": true
        },
        url: {
            "type": String
        },
        qrurl: {
            "type": String
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
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }, {
        versionKey: false
    }),

    // 分享
    session: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
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
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        },
    }, {
        versionKey: false
    }),

    // 反馈
    feedback: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
        // 创建时间
        created: {
            "type": Date,
        },
        // 分数
        score: {
            "type": Number
        },
        advise: {
            "type": String
        },
        creator: {
            "type": Schema.ObjectId
        },
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }, {
        versionKey: false
    }),

    // 人员
    people: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
        nick: {
            "type": String,
            "required": true
        },
        name: {
            "type": String,
            "required": true
        },
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }, {
        versionKey: false
    }),

    tag: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
        name: {
            "type": String
        },
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }, {
        versionKey: false
    }),

    entityTag: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
        tagId:{
            "type": Schema.ObjectId
        },
        relativeId: {
            "type": Schema.ObjectId
        },
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }, {
        versionKey: false
    })

};
