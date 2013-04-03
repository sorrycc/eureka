/*
 * @name: create.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("party/create", function(S) {
    var Create = function(cfg) {
        if (!(this instanceof Create)) return new Create(cfg);

        cfg = S.isObject(cfg) ? cfg : {};

        this.form = cfg.form ? S.one(cfg.form) : null;
        this.url = S.isString(cfg.url) ? cfg.url : "";

        this._init();
    };

    S.augment(Create, {
        _init: function() {
            if (!this.form || !this.url) return;

            this.form.on("submit", function(e){
                e.halt();

                this._submit();
            }, this);
        },
        _submit: function() {
            S.io({
                url: this.url,
                type: "post",
                form: this.form[0],
                complete: function(d) {
                    if (!d) {
                        alert("出错了，请重试！");
                        return;
                    }

                    if (!d.success) {
                        alert(d.message || "出错了，请重试！");
                        return;
                    }

                    window.top.location.href = d.url;
                }
            });
        }
    });

    return Create;
}, {
    requires: ["node", "ajax"]
});
