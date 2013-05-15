/*
 * @name: form.js
 * @description: create,edit session
 * @author: dev2geek@163.com
 * @date: 2013-05-08
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("session/form", function(S) {
    var Form = function(cfg) {
        if (!(this instanceof Form)) return new Form(cfg);

        cfg = S.isObject(cfg) ? cfg : {};

        this._init();
    };

    S.augment(Form, {
        _init: function() {
            
        }
    });

    return Form;
}, {
    requires: ["node"]
});
