/**
 * @fileoverview 保存统计数据
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node, io) {
    var EMPTY = '';
    var $ = Node.all;
    return function saveCount(count){
        var sessionId = Number($('#J_SessionId').val());
        var partyId = Number($('#J_PartyId').val());
        io.post('http://localhost/feedback/save_count',{count:count,sessionId:sessionId,partyId:partyId},function(data){
            if(!data.status){
                S.log(data.msg);
            }
        },'json');
    }
}, {requires : ['node','ajax']});