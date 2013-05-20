/**
 * @fileoverview 初始化统计反馈逻辑（管理者界面）
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,Uri,Count,CountImage,saveCount,sessionList) {
    var $ = Node.all;
    return function(){
        var $count = $('.J_StarCount');
        var count = new Count('.J_StarCount',{
            value:Number($count.text()),
            time:Number($count.attr('data-time'))
        });

        var countImage = new CountImage('.J_Stars');

        if(count.get('value') > 0 && count.get('time') > 0){
            var starNum = count.get('average');
            countImage.show(function(){
                countImage.set('num',starNum);
            })
        }

        var host = 'http://'+new Uri(window.location.href).getHostname();
        var socket = io.connect(host+'/stars');
        //存在听众反馈
        var isExistFeedback = false;
        //监听用户的反馈提交
        socket.on('jianping', function (data) {
            var starNum = data.score;
            //触发统计
            count.count(starNum);
            isExistFeedback = true;
        });

        /**
         * 定时判断是否已经可以开始统计
         */
        var timer = setInterval(function(){
            S.io.get('http://'+new Uri(window.location.href).getHostname()+'/feedback/get_start_feedback_time/'+2,function(data){
                var time = Number(data.start_feedback_time);
                //反馈已经统计结束
                if(data.status >1 && time>0){
                    var now = S.now();
                    var t = now - time;
                    //超过二分钟
                    var isExceed = t >= 2*60*1000;
                    if(isExceed){
                        var num = count.get('value');
                        var people = count.get('time');
                        //星数
                        var starNum = count.get('average');
                        if(starNum>0){
                            countImage.show(function(){
                                countImage.set('num',starNum);
                            })
                        }
                        //存在用户反馈，更新下统计数据
                        if(isExistFeedback){
                            saveCount(num,people);
                        }
                        //清理定时轮询
                        clearInterval(timer);
                    }
                }
            },'json');
        },500);

        sessionList();
    }
}, {requires : ['node','uri','./star-count','./count-image','./save-count','./session-list']});