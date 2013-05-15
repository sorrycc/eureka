/**
 * User: xiaogu
 * Date: 13-5-15
 * Time: 下午8:34
 * Description:
 */
window.socket = io.connect('http://localhost:3000')
  socket.on('isValid', function(data){
    console.log("on data", data);
  })

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
    if (location.href.indexOf('/party') >= 0){
      location.reload()
    }
    else if(len == 1) {
      url = '/party/' + remainList[0];
    }
    else if (partyId){
      url = '/party' + partyId
    }
    else {
      url = '/party'
    }

    $('#J_ReviewNotice').attr('href', url);
    $('#J_ReviewNotice')[0].style.display = "block";
  }
})
