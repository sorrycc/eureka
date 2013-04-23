/*
 * @name: session/list.js
 * @description: 
 * @author: shuier.zd@taobao.com
 * @date: 2013-04-17
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("session/list", function(S, Ajax, XTemplate) {
    var D = S.DOM, E = S.Event;
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
            this.bind();
        },
        render: function() {
            var self = this;

            S.io({
                url: "/api/session/list" + (self.id ? "/" + self.id : ""),
                type: "get",
                dataType: "json",
                complete: function(d) {
                    if (!d || !d.success) {
                        alert(d && d.message || "数据请求失败！");
                        return;
                    }

                    var partyInfo = (d.party)[0]
                    var date = new Date(partyInfo.time);
                    partyInfo.time = date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日'

                    self.el.html(new XTemplate(self.tpl).render(partyInfo));

                    self.bind();
                }
            });
        },
        bind: function() {
            var self = this;
            self.partyTapHoldEvt();
            self.sessionTapHoldEvt();
            self.add();
            self.update();
            self.del();
        },
        /**
         * party taphold效果
         */
        partyTapHoldEvt: function(){
            
             E.on('.J_PartyOpts','click tapHold', function(e){
                var t = e.currentTarget,
                    partyOpts = D.get('.party-opts', t);
                D.css(partyOpts, 'visibility', 'visible');

                E.on(document, 'click', function(e){
                    if(!t.contains(e.target) && !partyOpts.contains(e.target) )
                        D.css(partyOpts, 'visibility', 'hidden');
                });
            });   
        
        },

        /**
         * session taphold 效果
         */
        sessionTapHoldEvt: function(){
            
               E.delegate('#session-list','click tapHold', '.J_SessionOpts', function(e){
                    var t = e.currentTarget,
                        sessionOpts = D.get('.session-opts', t);
                    D.css(sessionOpts, 'visibility', 'visible');

                    E.on(document, 'click', function(e){
                        if(!t.contains(e.target) && !sessionOpts.contains(e.target) )
                            D.css(sessionOpts, 'visibility', 'hidden');
                    });
                }); 
            
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
