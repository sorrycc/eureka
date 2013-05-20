/**
 * @fileoverview 初始化统计反馈逻辑（管理者界面）
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,Uri,Count,CountImage,saveCount) {
    return function(){
        var count = new Count('.J_StarCount');
        var countImage = new CountImage('.J_Stars');
        var host = 'http://'+new Uri(window.location.href).getHostname();
        var socket = io.connect(host+'/stars');
        socket.on('jianping', function (data) {
            var starNum = data.score;
            //触发统计
            count.count(starNum);
        });
/*        S.later(function(){
            var sessionId = Number($('#J_SessionId').val());
            S.io.get('http://'+new Uri(window.location.href).getHostname()+'/feedback/get_status/'+sessionId,function(data){
                if(data.status == 1){
                    S.later(function(){
                        var num = count.get('value');
                        var people = count.get('time');
                        //星数
                        var starNum = self.get('average');
                        countImage.show(function(){
                            countImage.set('num',starNum);
                        })
                        saveCount(num,people);
                    },1000*120)
                }
            },'json');
        },200);*/
    }
}, {requires : ['node','uri','./star-count','./count-image','./save-count']});