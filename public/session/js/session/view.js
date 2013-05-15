/*
 * @name: form.js
 * @description: create,edit session
 * @author: dev2geek@163.com
 * @date: 2013-05-08
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("session/view", function(S) {
    var View = function(cfg) {
        if (!(this instanceof View)) return new View(cfg);

        cfg = S.isObject(cfg) ? cfg : {};

        this.sessionId = cfg.sid || "";
        this.partyId = cfg.pid || "";
        this.btn = cfg.btn ? S.one(cfg.btn) : null;

        this._init();
    };

    S.augment(View, {
        _init: function() {
            if ((this.sessionId === "") || (this.partyId === "") || !this.btn) {
                return;
            }

            this.btn.on("click", function(e){
                location.href = "/session/"+this.sessionId+"/edit";
            }, this);

        }
    });

    return View;
}, {
    requires: ["node"]
});
