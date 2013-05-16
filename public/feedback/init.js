/**
 * @fileoverview 初始化统计反馈逻辑（管理者界面）
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,Uri,Count,CountImage,saveCount) {
    return function(){
        var count = new Count('.J_StarCount');
        var countImage = new CountImage('.J_Stars');
        var host = 'http://'+new Uri(window.location.href).getHostname()+'/stars';
        var socket = io.connect(host);
        socket.on('jianping', function (data) {
            alert(data.score);
            var starNum = data.score;
            //触发统计
            count.count(starNum);
        });
        //统计推送开始
        socket.on('push_open',function(data){
            //星数
            count.set('value',data.count);
            //统计的次数
            count.set('time',data.people);

            S.later(function(){
                var num = count.get('value');
                var people = count.get('time');
                //星数
                var starNum = self.get('average');
                countImage.show(function(){
                    countImage.set('num',starNum);
                })
                saveCount(num,people);
            },10000);
        })
    }
}, {requires : ['node','uri','./star-count','./count-image','./save-count']});