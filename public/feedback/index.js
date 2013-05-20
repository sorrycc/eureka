KISSY.use("event, node", function(S, Event, Node){

  S.ready(function(){
    var $ = S.all;

    $(".score").delegate("click", "span", function(ev){
      var all = $(".score").all('span')
      all.removeClass('icon-star-solid');
      all.addClass("icon-star-hollow");
      var index = $(ev.target).index()
      for(var i = 0; i < index; i++) {
        $(all[i]).addClass('icon-star-solid')
        $(all[i]).removeClass('icon-star-hollow')
      }
      $('#J_Score').val(index)
    })

  })

})
