/*
 * @name: form.js
 * @description: create,edit party
 * @author: wondger@gmail.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("party/form", function(S) {
    var Create = function(cfg) {
        if (!(this instanceof Create)) return new Create(cfg);

        cfg = S.isObject(cfg) ? cfg : {};

        this.form = cfg.form ? S.one(cfg.form) : null;

        this._init();
    };

    S.augment(Create, {
        _init: function() {
            if (!this.form) return;

            this.id = id = S.unparam(S.io.serialize(this.form)).id;
            this.url = id ? "/api/party/edit/" + id : "/api/party/create"

            this.form.on("submit", function(e){
                var form = this.form[0],
                    title = form.elements["title"],
                    time = form.elements["time"],
                    location = form.elements["location"],
                    emptyFields = [];

                e.halt();

                if (!S.trim(title.value)) emptyFields.push("名称");
                if (!S.trim(time.value)) emptyFields.push("时间");
                if (!S.trim(location.value)) emptyFields.push("地点");

                if (emptyFields.length) {
                    alert("请输入分享会" + emptyFields.join("，"));
                    return;
                }

                if (!S.trim(time.value).match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
                    alert("请输入正确的时间！如：2012-12-12");
                    return;
                }

                this._submit();
            }, this);
        },
        _submit: function() {
            var self = this;
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

                    if (self.id) {
                        alert("编辑成功！");
                        window.top.location.href = "/party/" + self.id;
                    }
                    else {
                        window.top.location.href = d.url;
                    }
                }
            });
        }
    });

    return Create;
}, {
    requires: ["node", "ajax"]
});
