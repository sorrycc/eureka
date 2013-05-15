/**
 * @fileoverview 反馈星数统计器
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node, Base,XTemplate,LayerAnim) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name CountImage
     * @class 反馈星数统计器
     * @constructor
     * @extends Base
     */
    function CountImage(target,config) {
        var self = this;
        //调用父类构造函数
        CountImage.superclass.constructor.call(self, config);
        self.set('target',$(target));
        self._init();
    }
    S.extend(CountImage, Base, /** @lends CountImage.prototype*/{
        _init:function(){
            var self = this;
            var $target = self.get('target');
            if(!$target.length) return false;
            self._appendStars();
        },
        _appendStars:function(){
            var self = this;
            var max = self.get('max');
            if(!S.isNumber(max)) return false;
            var tpl = self.get('tpl');
            var target = self.get('target');
            var aMax = [];
            for(var i = 0;i<max;i++){
                aMax.push('');
            }

            var html = new XTemplate(tpl).render({max:aMax});
            target.html(html);
            self._setPos();
        },
        _addDom:function(target,max,tpl){
            var aMax = [];
            for(var i = 0;i<max;i++){
                aMax.push('');
            }
            var html = new XTemplate(tpl).render({max:aMax});
            target.html(html);
        },
        _setPos:function(){
            var self = this;
            var target = self.get('target');
            var width = target.width();
            target.css('marginLeft',-width/2);
        },
        show:function(callback){
            var self = this;
            var target = self.get('target');
            var spans = target.children('span');
            var config = [];
            spans.each(function($span,i){
                // 动画配置参数
                config[i] =
                {
                    node: $span[0],
                    from:
                    {
                        rotation: Math.random() * 2000,
                        opacity: 0
                    },
                    delay: i * 0.2,
                    duration: 0.5
                };

            })
            // 创建并播放动画
            var anim = new LayerAnim(config);
            anim.on('end',function(){
                callback && callback.call(self);
            })
            anim.run();
        },
        /**
         * 显示得到的星数
         */
        showScore:function(callback){
            var self = this;
            var target = self.get('target');
            target = target.children('.J_ScoreStars');
            var spans = target.children('span');
            var config = [];
            spans.each(function($span,i){
                // 动画配置参数
                config[i] =
                {
                    node: $span[0],
                    from:
                    {
                        scale: 4,
                        opacity: 0
                    },
                    delay: i * 0.1,
                    easing: "Bounce.easeOut",
                    duration: 1
                };

            })
            // 创建并播放动画
            var anim = new LayerAnim(config);
            anim.on('end',function(){
                callback && callback.call(self);
            })
            anim.run();
        }
    }, {ATTRS : /** @lends CountImage*/{
        target:{
            value:EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        /**
         * 星数
         */
        num:{
            value:0,
            setter:function(v){
                var self = this;
                var target = self.get('target');
                var $wrapper = target.children('.J_ScoreStars');
                var tpl = self.get('scoreTpl');
                self._addDom($wrapper,v,tpl);
                self.showScore();
            }
        },
        max:{
            value:5
        },
        tpl:{
            value:'{{#each max}}<span class="star">★</span>{{/each}}<div class="J_ScoreStars score-stars-wrapper"></div>'
        },
        scoreTpl:{
            value:'{{#each max}}<span class="star-score">★</span>{{/each}}'
        },
        scoreCls:{
            value:'star-score'
        }
    }});
    return CountImage;
}, {requires : ['node','base','xtemplate','gallery/layer-anim/1.0/']});