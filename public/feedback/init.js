/**
 * @fileoverview 初始化统计反馈逻辑（管理者界面）
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,Uri,Count,CountImage,saveCount) {
    return function(){
        var count = new Count('.J_StarCount');
        var countImage = new CountImage('.J_CountImg');
        var host = 'http://'+new Uri(window.location.href).getHostname();
        count.on('afterValueChange',function(ev){
            var n = ev.newVal - ev.prevVal;
            countImage.change(n);
        })
        var socket = io.connect(host);
        socket.on('feedbackCount', function (data) {
            var starNum = data.num;
            //触发统计
            count.count(starNum);
        });
        //统计推送结束
        socket.on('push_close',function(data){
            var num = count.get('value');
            saveCount(num);
        })
    }
}, {requires : ['node','uri','./star-count','./count-image','./save-count']});