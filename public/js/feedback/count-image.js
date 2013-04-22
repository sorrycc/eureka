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
            self.set('margin',{left:parseInt($target.css('marginLeft')),top:parseInt($target.css('marginTop'))});
        },
        change:function(num){
            if(!num) return false;
            var self = this;
            var $target = self.get('target');
            if(!$target.length) return false;
            num = num * self.get('scale');
            var fontSize = self.get('fontSize');
            fontSize += num;
            var margin = self.get('margin');
            var marginLeft = margin.left - Math.round(num/2);
            var marginTop = margin.top - Math.round(num/2);
            //$target.stop().animate({"fontSize":fontSize,"marginLeft":marginLeft},1,'easeNone');
            $target.css({"fontSize":fontSize,"marginLeft":marginLeft});
            self.set('fontSize',fontSize);
            self.set('margin',{left:marginLeft,top:marginTop});

        }
    }, {ATTRS : /** @lends CountImage*/{
        target:{
            value:EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        fontSize:{value:0},
        margin:{value:{left:0,top:0}},
        scale:{value:0.4}
    }});
    return CountImage;
}, {requires : ['node','base']});