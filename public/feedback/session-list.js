/**
 * @fileoverview 保存统计数据
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,LayerAnim) {
    var EMPTY = '';
    var $ = Node.all;
    return function(){
        var $list = $('.J_SessionList');
        var $lis = $list.children('li');
        if(!$lis.length) return false;
        var config = [];
        $lis.show();
        $lis.each(function($li,i){
            // 动画配置参数
            config[i] =
            {
                node: $li[0],
                from:
                {
                    opacity: 0,
                    width:0
                },
                delay: i * 0.2,
                easing: "Back.easeOut",
                duration: 0.5
            };

        })
        // 创建并播放动画
        var anim = new LayerAnim(config);
        anim.run();
    }
}, {requires : ['node','gallery/layer-anim/1.0/']});