/*
 * @name: list.js
 * @description: 
 * @author: wondger@gmail.com, shuier.zd@taobao.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("party/list", function(S, Ajax, XTemplate, DragSwitch, Cookie) {
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
            if (!this.el || !this.partyTpl || !this.sessionTpl) return;

            this.id = this.el.attr("data-id");

            this.el.html("");
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

                elParty.parent('.party-item').attr('id', "J_Party" + doc.id);

                if (!doc.sessions.length) return;

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
                        var scrollView = new iScroll("J_Party" + doc.id);


                    }
                });
            });
        },

        setReviewStatus: function(){
            var str = Cookie.get("remainCount");
            if(!str) return;
            var remainList = JSON.parse(Cookie.get("remainCount"));
            if(!remainList || !remainList.length) return;
            remainList.map(function(id){
                D.get('#J_Feedback' + id).style.display = "block"
            });
        },

        bind: function() {

            S.one(document).delegate("click", ".party-del", function(evt) {
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

                        el.parent().parent(".mainCard").remove();
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

            var self = this;
            self.partyTapHoldEvt();
            self.sessionTapHoldEvt();
            self.bindListSwitch();
            self.bindCodeRotate();
        },



        // 绑定列表间切换
        bindListSwitch: function(){
          var DS = new DragSwitch ("#J_PartyList", {
            senDistance: 3,
            binds: [
              null,
              {
                moveEls       : ["#J_PartyList"],
                maxDistance   : -D.viewportWidth(),
                validDistance : -D.viewportWidth()/2,
                passCallback  : function(ev){
                  //$(ev.self.originalEl).addClass @dragSwitchConfig.rightClass
                  //$(ev.self.originalEl)[0].style.webkitTransform = ""
                },
                failCallback  : null,
                checkvalid    : function(ev){
                  //return $(ev.self.originalEl).css("-webkit-transform") is "none"
                  return true
                }
              },
              null,
              {
                moveEls       : ["#J_PartyList"],
                maxDistance   : 1,
                validDistance : D.viewportWidth()/2,
                passCallback  : function(ev){
                           //$(ev.self.originalEl).addClass @dragSwitchConfig.leftClass
                  $(ev.self.originalEl)[0].style.webkitTransform = ""
                },
                failCallback  : null,
                checkvalid    : function(ev){
                 //return $(ev.self.originalEl).css("-webkit-transform") is "none"
                 return true
                }
              }
            ]
          });
          var count = $('.mainCard').length,
              currentIndex = 0,
              nextIndex = null;

          function next(){
            if(currentIndex == count - 1) return
            currentIndex++
            $("#J_PartyList").css('-webkit-transform', "translateX(-" + currentIndex + "00%)")
            if(currentIndex == count - 1) {
              DS.config.binds[1].maxDistance = -1
              DS.config.binds[3].maxDistance = D.viewportWidth()
            }
            else {
              DS.config.binds[1].maxDistance = -D.viewportWidth()
            }
          }
          function prev(){
            if(currentIndex == 0) return
            currentIndex--
            $("#J_PartyList").css('transform', "translate(" + currentIndex + "00% 0)")
            if(currentIndex == 0) {
              DS.config.binds[3].maxDistance = 1
              DS.config.binds[1].maxDistance = -D.viewportWidth()
            }
            else {
              DS.config.binds[3].maxDistance = D.viewportWidth()
            }
          }

          DS.on("dragRightEnd", function(ev){
            if(DS.config.binds[3].passed) {
              prev()
            }
          })

          DS.on("dragLeftEnd", function(ev){
            if(DS.config.binds[1].passed) {
              next()
            }
          })
        },

        /**
        *  绑定二维码旋转效果
        */
        bindCodeRotate: function(){
            

            E.on('.J_Rotate','tap', function(e){
                var t = e.currentTarget,
                    p = D.parent(t,'.flip-container');

                D.toggleClass(p, 'rotate');

            });

            E.on('.view-qrcode', 'tap', function (e) {
                var $e = jQuery(this).parents('.flip3d')

                // lazy generate qrcode
                if (!$e.data("generated")) {
                    $e.data("generated", true);

                    var $qrcode = $e.find(".qrcode");
                    $qrcode.qrcode({
                        //render  : "table",
                        text  : $qrcode.data("url")
                    });
                }
            });
        },


         /**
         * party taphold效果
         */
        partyTapHoldEvt: function(){
             E.on('.J_PartyOpts','tapHold', function(e){

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

            function tapHandler(t){
                window.location.href = D.attr(t, 'data-url');
            }

            function tapHoldHandler(t){

                var sessionOpts = D.get('.session-opts', t);

                // first hide all session opts
                D.css('.session-opts', 'visibility', 'hidden');

                // then show current session opts
                D.css(sessionOpts, 'visibility', 'visible');
            }

            var isTapHold = false;


           E.delegate('.session-list-box','touchstart touchend', '.J_SessionOpts', function(e){     
                var t = e.currentTarget;

                if(e.type == 'touchstart'){
                    tapTimer = setTimeout(function(){
                        isTapHold = true;
                        tapHoldHandler(t);
                    },1000);
                }else{
                    clearTimeout(tapTimer);
                    if(!isTapHold){
                        tapHandler(t);
                    }
                    isTapHold = false;
                }
 
            });
        }


    });

    return List;

}, {
    requires: ["ajax", "xtemplate", "widget/dragswitch", "cookie"]
});
