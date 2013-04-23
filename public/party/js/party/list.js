/*
 * @name: list.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("party/list", function(S, Ajax, XTemplate) {
    var List = function(opt) {
        if (!(this instanceof List)) return new List(opt);

        this.el = opt.el && S.one(opt.el);
        this.tpl = S.isString(opt.tpl) && opt.tpl;

        this._init();
    };

    S.augment(List, {
        _init: function() {
            if (!this.el || !this.tpl) return;

            this.id = this.el.attr("data-id");
        },
        render: function() {
            var self = this;

            S.io({
                url: "/api/party" + (self.id ? "/" + self.id : ""),
                type: "get",
                dataType: "json",
                complete: function(d) {
                    if (!d || !d.success) {
                        alert(d && d.message || "数据请求失败！");
                        return;
                    }

                    self.el.html(new XTemplate(self.tpl).render(d));

                    self.bind();
                }
            });
        },
        bind: function() {
            S.one(document).delegate("click", ".session-del", function(evt) {
                var el = S.all(evt.currentTarget),
                    url = el.attr("href");

                evt.halt();

                if (!url) return;

                if (!confirm("确定要删除该分享会吗？")) return;

                S.io({
                    url: url,
                    type: "post",
                    dataType: "json",
                    complete: function(d) {
                        if (!d || !d.success) {
                            alert("抱歉，删除失败！");
                            return;
                        }

                        el.parent().parent(".party-item").remove();
                    }
                });
            });
        }
    });

    return List;

}, {
    requires: ["ajax", "xtemplate"]
});
