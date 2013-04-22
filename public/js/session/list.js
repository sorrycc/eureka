/*
 * @name: session/list.js
 * @description: 
 * @author: shuier.zd@taobao.com
 * @date: 2013-04-17
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("js/session/list", function(S, Ajax, XTemplate) {
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
                url: "/api/session" + (self.id ? "/" + self.id : ""),
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
            var self = this;
            self.tap();
            self.add();
            self.update();
            self.del();
        },


        /**
         * tap效果
         */
        tap: function(){

        },


        /**
         * 新增
         */
        add: function(){

        },

        /**
         * 编辑
         */
        update: function(){

        },

        /**
         * 删除
         */
        del: function(){
        
        }

        


    });

    return List;

}, {
    requires: ["ajax", "xtemplate"]
});
