/**
 * @fileoverview 反馈星数统计器
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node, Base,XTemplate) {
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
        _setPos:function(){
            var self = this;
            var target = self.get('target');
            var width = target.width();
            target.css('marginLeft',-width/2);
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
                var scoreCls = self.get('scoreCls');
                target.children('span').removeClass(scoreCls).each(function(item,i){
                    if(i<v){
                        item.addClass(scoreCls);
                    }
                });

            }
        },
        max:{
            value:5
        },
        tpl:{
            value:'{{#each max}}<span class="star">★</span>{{/each}}'
        },
        scoreCls:{
            value:'star-score'
        }
    }});
    return CountImage;
}, {requires : ['node','base','xtemplate']});