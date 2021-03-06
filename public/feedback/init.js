/**
 * @fileoverview 初始化统计反馈逻辑（管理者界面）
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,Uri,ajax,Count,CountImage,sessionList) {
    var $ = Node.all;
    return function(){
        var sessionId = Number($('#J_SessionId').val());
        var partyId = Number($('#J_PartyId').val());
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
            if(sessionId == Number(data.sessionId)){
                var starNum = data.score;
                //触发统计
                count.count(starNum);
                isExistFeedback = true;
            }
        });

        function showStars(){
            var href= 'http://'+new Uri(window.location.href).getHostname();
            ajax.get(href+'/user',function(data){
                var parties = data.parties;
                if(parties && parties.length > 0 && S.inArray(partyId,parties)){
                    ajax.post(href+'/feedback/close',{sessionId:Number($('#J_SessionId').val())},function(data){
                        var num = count.get('value');
                        //星数
                        var starNum = count.get('average');
                        countImage.show(function(){
                            countImage.set('num',starNum);
                        })
                    },'json')
                }
            },'json')
        }

        /**
         * 定时判断是否已经可以开始统计
         */
        /*var timer = S.later(function(){
            ajax.get('http://'+new Uri(window.location.href).getHostname()+'/feedback/get_start_feedback_time/'+2,function(data){
                var time = Number(data.start_feedback_time);
                //反馈已经统计结束
                if(Number(data.status) >1 && time>0){
                    var now = S.now();
                    var t = now - time;
                    //超过二分钟
                    var isExceed = t >= 2*60*1000;
                    if(isExceed){
                        showStars();
                        //清理定时轮询
                        clearInterval(timer);
                    }
                }
            },'json');
        },500);*/

        sessionList();

        $('.J_CloseFeedback').on('click',function(){
            if(Number($('#J_Status').val()) === 2) return false;
            showStars();
        })

    }
}, {requires : ['node','uri','ajax','./star-count','./count-image','./session-list']});