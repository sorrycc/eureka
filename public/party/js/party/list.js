/*
 * @name: list.js
 * @description: 
 * @author: wondger@gmail.com, shuier.zd@taobao.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("party/list", function(S, Ajax, XTemplate, DragList, Cookie) {
    var D = S.DOM, E = S.Event;
    var List = function(opt) {
        if (!(this instanceof List)) return new List(opt);

        this.el = opt.el && S.one(opt.el);
        this.partyTpl = S.isString(opt.partyTpl) && opt.partyTpl;
        this.sessionTpl = S.isString(opt.sessionTpl) && opt.sessionTpl;

        this.parties = [];

        this._init();
    };

    S.augment(List, {
        _init: function() {
            if (!this.el || !this.tpl) return;

            this.id = this.el.attr("data-id");

            this.el.html("");
        },
        render: function() {
            var self = this;

            S.io({
                url: "/api/party" + (self.id ? "/" + self.id : ""),
                cache: false,
                type: "get",
                dataType: "json",
                complete: function(d) {
                    if (!d || !d.success) {
                        alert(d && d.message || "数据请求失败！");
                        return;
                    }

                    self.parties = d.docs;

                    self.el.append(new XTemplate(self.partyTpl).render(d));

                    self.renderSession(0);

                    self.bind();

                    self.setReviewStatus();
                }
            });
        },
        renderSession: function(startPartyIndex) {
            var parties = [],
                count = 0;

            while (this.parties[startPartyIndex] && count++ < 5) {
                parties.push(this.parties[startPartyIndex++]);
            }

            var self = this;

            S.each(parties, function(doc, index){

                var elParty = S.one("#J_Party" + doc.id + "Session");

                if (!elParty || S.trim(elParty.html())) return;

                S.io({
                    url: "/api/session/list",
                    data: {
                        ids: doc.sessions.join(",")
                    },
                    cache: false,
                    dataType: "json",
                    complete: function(d) {
                        if (!d || !d.success) {
                            //alert(d && d.message || "数据请求失败！");
                            return;
                        }

                        doc.sessions = d.docs;

                        elParty.append(new XTemplate(self.sessionTpl).render(doc));
                    }
                });
            });
        },

        setReviewStatus: function(){
            var str = Cookie.get("remainCount");
            if(!str) return;
            var remainList = JSON.parse(Cookie.get("remainCount"));
            remainList.map(function(id){
                D.get('#J_Feedback' + id).style.display = "block"
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

            E.on(document, 'click tap tapHold', function(e){
                if(!D.parent(e.target, '.J_PartyOpts') && !D.parent(e.target, '.party-opts')){
                    D.css('.party-opts', 'visibility', 'hidden');
                }
                if(!D.parent(e.target, '.J_SessionOpts') && !D.parent(e.target, '.session-opts')){
                    D.css('.session-opts', 'visibility', 'hidden');
                }
            });

            E.delegate('body', 'tap', '.icon-push', function(ev){
              var id = D.attr(ev.target, 'data-id');
              socket.emit('setValid', id)
            })
//
//            E.on(document, 'click tap tapHold', function(e){
//                if(!D.parent(e.target, '.J_PartyOpts') && !D.parent(e.target, '.party-opts')){
//                    D.css('.party-opts', 'visibility', 'hidden');
//                }
//                if(!D.parent(e.target, '.J_SessionOpts') && !D.parent(e.target, '.session-opts')){
//                    D.css('.session-opts', 'visibility', 'hidden');
//                }
//            });

            var self = this;
            self.partyTapHoldEvt();
            self.sessionTapHoldEvt();
            self.viewOriginalCodeEvt();
        },

         /**
         * party taphold效果
         */
        partyTapHoldEvt: function(){

             E.on('.J_PartyOpts','dblclick tapHold', function(e){

                var t = e.currentTarget,
                    partyOpts = D.get('.party-opts', t);

                D.css(partyOpts, 'visibility', 'visible');
            });
        
        },

        /**
         * session taphold 效果
         */
        sessionTapHoldEvt: function(){


//
//          var dragList = new DragList(".party-item", {
//            enableScrollView  : true,
//            enableDragSwitch  : false,
//            enableTapHold     : true,
//          })


           E.delegate('.session-list','dblclick tapHold', '.J_SessionOpts', function(e){
                var t = e.currentTarget,
                    sessionOpts = D.get('.session-opts', t);

                // first hide all session opts
                D.css('.session-opts', 'visibility', 'hidden');

                // then show current session opts
                D.css(sessionOpts, 'visibility', 'visible');
            });

        },

        /**
         * 查看二维码原图
         * 通过动画transform实现Y轴上的旋转
         */
        viewOriginalCodeEvt: function(){
            E.on('.view-qrcode','click', function (e) {
                var $e = jQuery(this).parent();

                // flip
                $e.toggleClass("flip3d-flipped");

                // lazy generate qrcode
                if (!$e.data("generated")) {
                    $e.data("generated", true);

                    var $qrcode = $e.find(".qrcode");
                    $qrcode.qrcode({
                        //render	: "table",
                        text	: $qrcode.data("url")
                    });
                }
            });

        }

    });

    return List;

}, {
    requires: ["ajax", "xtemplate", "widget/draglist", "cookie"]
});
