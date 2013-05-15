/*
 * @name: form.js
 * @description: create,edit session
 * @author: dev2geek@163.com
 * @date: 2013-05-08
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("session/view", function(S, Node, Cookie) {
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
                location.href = "/session/"+this.sessionId+"/edit?partyId="+this.partyId;
            }, this);

            var remainList = Cookie.get("remainList");
            if(!remainList) return;
            remainList = JSON.parse(remainList);
            if(remainList.indexOf(this.sessionId) >= 0) {
              Node.all('#J_FeedbackBtn').removeAttr("disabled")
            }

        }
    });

    return View;
}, {
    requires: ["node", "cookie"]
});
