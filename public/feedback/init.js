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
        //监听用户的反馈提交
        socket.on('jianping', function (data) {
            var starNum = data.score;
            //触发统计
            count.count(starNum);
        });

        var socketStatus = io.connect(host);
        //管理员推送反馈许可
        socketStatus.on('isValid',function(sessionId){
            S.io.get('http://'+new Uri(window.location.href).getHostname()+'/feedback/get_start_feedback_time/'+sessionId,function(data){
                var time = data.start_feedback_time;
                if(data.status >=1 && time>0){
                    var now = S.now();
                    var t = now - time;
                    var isExceed = t >= 2*60*1000;
                    if(isExceed){
                        var num = count.get('value');
                        var people = count.get('time');
                        //星数
                        var starNum = self.get('average');
                        countImage.show(function(){
                            countImage.set('num',starNum);
                        })
                        saveCount(num,people);
                    }
                }
            },'json');
        })
    }
}, {requires : ['node','uri','./star-count','./count-image','./save-count']});