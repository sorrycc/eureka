/**
 * User: xiaogu
 * Date: 13-5-15
 * Time: 下午8:34
 * Description:
 */
window.socket = io.connect('http://' + location.host);
//socket.join('room');

KISSY.use("node, cookie", function(S, Node, Cookie){
  var S = KISSY,
      $ = S.all;

    socket.on('isValid', function(data){
      console.log("on data", data);
      var count = Cookie.get('remainCount');
      var remainList;
      if(count) {
          count = parseInt(count);
          remainList = JSON.parse(Cookie.get('remainList'));
          remainList.map(function(item,key){
            if(!item) remainList.splice(key,1)
          })
      }
      else {
        count = 0;
        remainList = [];
      }
      if(remainList.indexOf(parseInt(data)) == -1)
        remainList.push(parseInt(data));
        Cookie.set('remainList', JSON.stringify(remainList));
        Cookie.set('remainCount', remainList.length)
      makeNotice(remainList, remainList.length)
    })

  function makeNotice(remainList, len) {
    var url = '';
    var partyId = Cookie.get('partyid');
    if(len == 1) {
      url = '/session/' + remainList[0];
    }
    else if (location.href.indexOf('/party') >= 0){
      location.reload()
      return
    }
    else if (partyId && partyId != "null"){
      url = '/party/' + partyId
    }
    else {
      url = '/party'
    }

    $('#J_ReviewNotice').attr('href', url);
    $('#J_ReviewNotice')[0].style.display = "block";
  }
})
