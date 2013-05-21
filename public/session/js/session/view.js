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

            var _speakers = S.one(".J_Speakers"),
                _html = _speakers.html(),
                _speakerArray = _html.split(",");

            _speakers.html("");
            S.each(_speakerArray, function(el){
                var _text = S.trim(el);

                if (_text !== "") {
                    _speakers.append("<span class='session-speaker'>"+ _text +"</span>");
                }
            });

            var _this = this;
            Node.all('#J_FeedbackBtn').on("click", function(ev){
              if(Node.all(ev.target).hasAttr("disabled")) return;
              location.href = "/feedback/make/" + _this.sessionId
            })

        }
    });

    return View;
}, {
    requires: ["node", "cookie"]
});
