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
    var Create = function(cfg) {
        if (!(this instanceof Create)) return new Create(cfg);

        cfg = S.isObject(cfg) ? cfg : {};

        this.form = cfg.form ? S.one(cfg.form) : null;

        this._init();
    };

    S.augment(Create, {
        _init: function() {
            if (!this.form) return;
        }
    });

    return Create;
}, {
    requires: ["node"]
});
