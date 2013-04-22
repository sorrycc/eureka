/**
 * @fileoverview 反馈星数统计器
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node, Base) {
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
            self.set('fontSize',parseInt($target.css('fontSize')));
        },
        change:function(num){
            if(!num) return false;
            var self = this;
            var $target = self.get('target');
            if(!$target.length) return false;
            var fontSize = self.get('fontSize');
            fontSize += num;
            $target.stop().animate({"fontSize":fontSize},0.1,'easeNone');
            self.set('fontSize',fontSize);

        }
    }, {ATTRS : /** @lends CountImage*/{
        target:{
            value:EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        fontSize:{value:0}
    }});
    return CountImage;
}, {requires : ['node','base']});