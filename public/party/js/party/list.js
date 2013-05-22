/*
 * @name: list.js
 * @description: 
 * @author: wondger@gmail.com, shuier.zd@taobao.com
 * @date: 2013-04-03
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("party/list", function (S, UA, Ajax, XTemplate, Uri, DragSwitch, Cookie) {
    var D = S.DOM, E = S.Event;
    //host
    var host = 'http://' + new Uri(window.location.href).getHostname();
    var prefix = (function () {
        if (UA.webkit) return "-webkit-";
        else if (UA.firefox) return "-moz-";
        else if (UA.opera) return "-o-";
        else if (UA.ie) return "-ms-";
        else return "";
    })();


    var List = function (opt) {
        if (!(this instanceof List)) return new List(opt);

        this.el = opt.el && S.one(opt.el);
        this.partyTpl = S.isString(opt.partyTpl) && opt.partyTpl;
        this.sessionTpl = S.isString(opt.sessionTpl) && opt.sessionTpl;

        this.parties = [];

        this._init();
    };

    S.augment(List, {
        _init: function () {
            if (!this.el || !this.partyTpl || !this.sessionTpl) return;

            this.id = this.el.attr("data-id");

            this.el.html("");
        },
        render: function () {
            var self = this;

            S.io({
                url: "/api/party" + (self.id ? "/" + self.id : ""),
                type: "get",
                dataType: "json",
                complete: function (d) {
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
        renderSession: function (startPartyIndex) {
            var parties = [],
                count = 0;

            while (this.parties[startPartyIndex] && count++ < 5) {
                parties.push(this.parties[startPartyIndex++]);
            }

            var self = this;

            S.each(parties, function (doc, index) {


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
                    complete: function (d) {
                        if (!d || !d.success) {
                            //alert(d && d.message || "数据请求失败！");
                            return;
                        }

                        // bugfix for xtemplate
                        // @see: https://github.com/kissyteam/kissy/issues/356
                        S.each(d.docs, function (session, index) {
                            session.pid = doc.id;
                            session.isadmin  = doc.isadmin;
                        });

                        doc.sessions = d.docs;

                        elParty.append(new XTemplate(self.sessionTpl).render(doc));

                        var scrollView = new iScroll("J_Party" + doc.id);
                    }
                });
            });
        },

        setReviewStatus: function () {
            var str = Cookie.get("remainCount");
            if (!str) return;
            var remainList = JSON.parse(Cookie.get("remainCount"));
            if (!remainList || !remainList.length) return;
            remainList.map(function (id) {
                D.get('#J_Feedback' + id).style.display = "block";
            });
        },

        bind: function () {
            var self = this;

            E.delegate(document, "click", ".party-del", function (evt) {
                var el = S.all(evt.currentTarget),
                    url = el.attr("href");

                evt.halt();

                if (!url) return;

                if (!confirm("确定要删除该分享会吗？")) return;

                S.io({
                    url: url,
                    type: "post",
                    dataType: "json",
                    complete: function (d) {
                        if (!d || !d.success) {
                            alert("抱歉，删除失败！");
                            return;
                        }

                        if (self.id) {
                            window.location.assign("/party");
                            return;
                        }

                        el.parent().parent(".mainCard").remove();
                    }
                });
            });

            E.on(document, 'click tap', function (e) {
                if (!D.parent(e.target, '.J_PartyOpts') && !D.parent(e.target, '.party-opts')) {
                    D.removeClass('.party-info', 'hover')
                }
                if (!D.parent(e.target, '.J_SessionOpts') && !D.parent(e.target, '.session-opts')) {
                    D.removeClass('.session-info', 'hover');
                }
            });

            

            E.delegate('body', 'tap', '.icon-push', function (ev) {
                //session id
                var id = D.attr(ev.target, 'data-id');
                //记录推送时间
                S.io.post(host + '/session/start_feedback_time/' + id, function (data) {
                    S.log('推送时间为：' + data.time);
                }, 'json');
                socket.emit('setValid', id);
            });

            var self = this;
            self.partyTapHoldEvt();
            self.sessionTapHoldEvt();
            self.bindListSwitch();
            self.bindCodeRotate();
        },


        // 绑定列表间切换
        bindListSwitch: function () {
            var self = this;

            var DS = new DragSwitch("#J_PartyList", {
                senDistance: 3,
                binds: [
                    null,
                    {
                        moveEls: ["#J_PartyList"],
                        maxDistance: $('.mainCard').length > 1 ? -D.viewportWidth() : -1,
                        validDistance: -D.viewportWidth() / 2,
                        passCallback: function (ev) {
                            //$(ev.self.originalEl)[0].style.webkitTransform = ""
                        },
                        failCallback: null,
                        checkvalid: function (ev) {
                            //return $(ev.self.originalEl).css("-webkit-transform") is "none"
                            return true;
                        }
                    },
                    null,
                    {
                        moveEls: ["#J_PartyList"],
                        maxDistance: 1,
                        validDistance: D.viewportWidth() / 2,
                        passCallback: function (ev) {
                            //$(ev.self.originalEl)[0].style.webkitTransform = ""
                        },
                        failCallback: null,
                        checkvalid: function (ev) {
                            //return $(ev.self.originalEl).css("-webkit-transform") is "none"
                            return true;
                        }
                    }
                ]
            });
            var count = $('.mainCard').length;
            if(!count) return;
            var currentIndex = 0,
                nextIndex = null,
                cardWidth = $('.mainCard')[0].offsetWidth,
                offsetWidth = D.viewportWidth() - cardWidth;
            $($('.mainCard')[0]).addClass("current-card");
            $($('.mainCard')[0]).addClass("fst-card");

            function next() {
                if (currentIndex == count - 1) return;
                currentIndex++;
                $('.mainCard').removeClass("current-card");
                $($('.mainCard')[currentIndex]).addClass("current-card");
                $("#J_PartyList").css(prefix + 'transform', "translateX(-" + (currentIndex * cardWidth) + "px)");
                if (currentIndex == count - 1) {
                    DS.config.binds[1].maxDistance = -1;
                    DS.config.binds[3].maxDistance = D.viewportWidth();
                }
                else {
                    DS.config.binds[1].maxDistance = -D.viewportWidth();
                    DS.config.binds[3].maxDistance = D.viewportWidth();
                }

                self.renderSession(currentIndex);
            }

            function prev() {
                if (currentIndex == 0) return;
                currentIndex--;
                $('.mainCard').removeClass("current-card");
                $($('.mainCard')[currentIndex]).addClass("current-card");
                $("#J_PartyList").css(prefix + 'transform', "translateX(-" + (currentIndex * cardWidth) + "px)");
                if (currentIndex == 0) {
                    DS.config.binds[3].maxDistance = 1;
                    DS.config.binds[1].maxDistance = -D.viewportWidth();
                }
                else {
                    DS.config.binds[3].maxDistance = D.viewportWidth();
                    DS.config.binds[1].maxDistance = -D.viewportWidth();
                }

                self.renderSession(currentIndex);
            }

            DS.on("dragRightEnd", function (ev) {
                if (DS.config.binds[3].passed) {
                    prev();
                }
            });

            DS.on("dragLeftEnd", function (ev) {
                if (DS.config.binds[1].passed) {
                    next();
                }
            });
        },

        /**
         *  绑定二维码旋转效果
         */
        bindCodeRotate: function () {


            E.on('.J_Rotate', 'tap', function (e) {
                var t = e.currentTarget,
                    p = D.parent(t, '.flip-container');

                D.toggleClass(p, 'rotate');

            });

            E.on('.view-qrcode', 'tap', function (e) {
                var $e = jQuery(this).parents('.flip3d');

                // lazy generate qrcode
                if (!$e.data("generated")) {
                    $e.data("generated", true);

                    var $qrcode = $e.find(".qrcode");
                    $qrcode.qrcode({
                        //render  : "table",
                        text: $qrcode.data("url")
                    });
                }
            });
        },


        /**
         * party taphold效果
         */
        partyTapHoldEvt: function () {
            E.on('.J_PartyOpts', 'tapHold', function (e) {

                var t = e.currentTarget,
                    partyInfo = D.parent(t, '.party-info');

                D.addClass(partyInfo, 'hover')
            });

        },

        /**
         * session taphold 效果
         */
        sessionTapHoldEvt: function () {

            function tapHandler(t) {
                window.location.href = D.attr(t, 'data-url');
            }

            function tapHoldHandler(t) {

                var sessionInfo = D.parent(t ,'.session-info');

                // first hide all session opts
                D.removeClass('.session-info', 'hover');

                // then show current session opts
                D.addClass(sessionInfo, 'hover');
            }

            var isTapHold = false;
            var touchIsMove = 0;
            var tapTimer;
            E.delegate('.session-list-box', 'touchmove', '.J_SessionOpts', function () {
                touchIsMove++;
            });


            E.delegate('.session-list-box', 'touchstart mousedown', '.J_SessionOpts', function (e) {
                var t = e.currentTarget;
                touchIsMove = 0;
                // E.delegate('.session-list-box', "click", ".J_SessionOpts", function(e){
                //     e.halt();
                // });
                tapTimer = setTimeout(function () {
                    isTapHold = true;
                    tapHoldHandler(t);
                }, 1000);

            });

            E.delegate('.session-list-box', 'touchend mouseup', '.J_SessionOpts', function (e) {
                var t = e.currentTarget;
                clearTimeout(tapTimer);
                if (!isTapHold && touchIsMove < 3) {
                    tapHandler(t);
                }
                isTapHold = false;
            });


            // E.delegate('.session-list-box', "click", ".J_SessionOpts", function(e){
            //     if(touchIsMove) 
            //         e.halt();
            //     else
            //         var t = e.currentTarget;
            //         tapHandler(t);
            // });
        }


    });

    return List;

}, {
    requires: ["ua", "ajax", "xtemplate", "uri", "widget/dragswitch", "cookie"]
});
