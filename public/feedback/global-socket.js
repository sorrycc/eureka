/**
 * User: xiaogu
 * Date: 13-5-15
 * Time: 下午8:34
 * Description:
 */

KISSY.use("node, cookie", function(S, Node, Cookie){
  var socket = io.connect('http://localhost:3000').
      S = KISSY,
      $ = S.all;

  socket.on('isValid', function(data){
    var count = parseInt(Cookie.get('remainCount')),
        remainList = JSON.parse(Cookie.get('remainList'));
    remainList.push(data);
    Cookie.set('remainList', JSON.stringify(remainList));
    Cookie.set('remainCount', remainList.length)
    makeNotice(remainList, remainList.length)
  })


  function makeNotice(remainList, len) {
    var url = '';
    var partyId = Cookie.get('partyid');
    if(len == 1) {
      url = '/party/' + remainList[0];
    }
    else if (partyId){
      url = '/party' + partyId
    }
    else {
      url = '/party'
    }

    $('J_ReviewNotice').one('a').attr('href', url);
    $('J_ReviewNotice').show();
  }
})
