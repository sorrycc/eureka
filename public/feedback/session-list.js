/**
 * @fileoverview 保存统计数据
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node, io,Uri,Cookie) {
    var EMPTY = '';
    var $ = Node.all;
    return function saveCount(count,people){
        if(!S.isNumber(count) || !S.isNumber(people)) return false;
        if(count <= 0 || people <= 0) return false;
        var sessionId = Number($('#J_SessionId').val());
        var partyId = Number(Cookie.get('partyid'));
        var url = 'http://'+new Uri(window.location.href).getHostname()+'/feedback/save_count';
        io.post(url,{count:count,people:people,sessionId:sessionId,partyId:partyId},function(data){
            if(!data.status){
                S.log(data.msg);
            }
        },'json');
    }
}, {requires : ['node','ajax','uri','cookie']});