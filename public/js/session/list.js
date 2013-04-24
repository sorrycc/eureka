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

            this.id = this.el.attr('data-party-id');
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
            self.viewOriginalCodeEvt();
        },
        /**
         * party taphold效果
         */
        partyTapHoldEvt: function(){
            
             E.on('.J_PartyOpts','click tapHold', function(e){

                if(D.hasClass(e.target,'icon-code')) return;

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
         * 查看二维码原图
         * 通过动画transform实现Y轴上的旋转
         */
        viewOriginalCodeEvt: function(){
            var self = this,
                rotateEl = D.get('#session-list-page');
            E.on('#J_ViewOriginal', 'click', function(e){
                // hide session-list-wrap, and display code
                rotateYDIV(0, rotateEl);
            });
            E.on('#code','click', function(){
                rotateYDIV(180, rotateEl);
            })

        }

        


    });

    function rotateYDIV(ny, el)
    {
        var rotYINT;

        if(rotYINT)
            clearInterval(rotYINT);

        rotYINT = setInterval(function(){

            ny = ny + 1
            D.css(el, 'transform', 'rotateY(' + ny + 'deg)');
            D.css(el, 'webkitTransform', 'rotateY(' + ny + 'deg)');
            D.css(el, 'OTransform', 'rotateY(" + ny + "deg)');
            D.css(el, 'MozTransform', 'rotateY(" + ny + "deg)');
            // el.style.transform = 
            // el.style.webkitTransform = "rotateY(" + ny + "deg)"
            // el.style.OTransform = "rotateY(" + ny + "deg)"
            // el.style.MozTransform = "rotateY(" + ny + "deg)"
            if (ny == 180 || ny >= 360)
            {
            clearInterval(rotYINT)
            if (ny >= 360){ny = 0}
            }
            // hide session-list-wrap, and display code
            if(ny == 90){
                D.hide('#session-list-wrap')
                D.show('#code');
            }
            if(ny == 270){
                D.show('#session-list-wrap')
                D.hide('#code');
            }

        },10);
    }
    

    return List;

}, {
    requires: ["ajax", "xtemplate"]
});
