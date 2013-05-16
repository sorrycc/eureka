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
            if ((this.sessionId === "") || (this.partyId === "") ) {
                return;
            }

            if(this.btn)
              this.btn.on("click", function(e){
                  location.href = "/session/"+this.sessionId+"/edit";
              }, this);

            var remainList = Cookie.get("remainList");
            if(!remainList) return;
            remainList = JSON.parse(remainList);
            _this = this
            if(remainList.indexOf(this.sessionId) >= 0) {
              Node.all('#J_FeedbackBtn').removeAttr("disabled")
              Node.all('#J_FeedbackBtn').on("click", function(){
                location.href = "/feedback/make/" + _this.sessionId
              })
            }

        }
    });

    return View;
}, {
    requires: ["node", "cookie"]
});