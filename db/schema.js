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
    party: {
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
        listener: {
            "type": Array
        }
    },

    session: {
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
    },

    feedback: {
        share: {
            "type": ObjectId
        },
        created: {
            "type": Date,
        },
        score: {
            "type": Number
        },
        content: {
        }
        creator: {
            "type": ObjectId
        }
    },

    // 人员
    people: {
        nick: {
            "type": String,
            "required": true
        },
        name: {
            "type": String,
            "required": true
        }
    },

    tag: {
        name: {
            "type": String
        }
    },

    entityTag: {
        tagId:{
            "type": ObjectId
        },
        relativeId: {
            "type": ObjectId
        }
    }

};
