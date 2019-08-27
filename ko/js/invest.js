// JavaScript Document
$(document).ready(function() {
  invest.init();
});
function invest() {};
invest.init = function(){
  //team 페이지인 경우
  if(window.location.href.indexOf("team.html") > -1) {
    invest_team.getTeamInfo();
  }
  invest.eventBind();
}
invest.eventBind = function() {

  //푸터 패밀리사이트 토글
  $("footer div.footer_family div.link_item span.family_icon").off("click").on("click", function(){
      $("footer div.family_wrap").toggle();
  });

  //스크롤 이동 시 이벤트
  $(window).on("scroll", function (event) {
    var _y = $(this).scrollTop();
    var _haslnb = $(".lnb").size() > 0 ? true : false;
    if (_haslnb) {
        var _length = $(".wrap div.content-box").length;

        //wrap div내부에 있는 div 갯수 만큼 반복
        for(var i=0 ; i < _length ; ++i) {
            var _position = $(".wrap div.content-box").eq(i).position();
            var _height = $(".wrap div.content-box").eq(i).height();

            // 스크롤 위치가 현재 보고있는 컨텐츠를 발견
           if( _y < (_position.top + _height)) {
               if(!$(".lnb ul li").eq(i).hasClass("on")) {
                   $(".lnb ul li").removeClass("on");
               }
               $(".lnb ul li").eq(i).addClass("on");
               break;
           }
        }
    }

    //메인 스크롤시 헤더 칼라변경
    if (_y > 100) {
      $(".bg-main header").removeClass("nav-trans").addClass("nav-color");
    }
    else {
      $(".bg-main header").removeClass("nav-color").addClass("nav-trans");
    }
  });

  //앵커이동시 부드럽게 이동
  $(".scroll").click(function(event){
      event.preventDefault();
      $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
  });

  //LNB 서브메뉴 클릭 시
  $("div.lnb ul li").on("click", function(e){
    e.stopPropagation() || e.preventDefault();
    var _menus = $("div.lnb").children("li");
    _menus.removeClass("on");

    var _submenus = $("div.lnb ul li");
    _submenus.removeClass("on");

    var _parents = $(this).parents("div.lnb ul li");
    $(_parents[0]).parent().addClass("on");
    $(this).addClass("on");
  });
}

//team 페이지에서 쓰이는 함수들
function invest_team() {}
invest_team.emp_info = [];
invest_team.getTeamInfo = function() {
  //직원정보 json데이터 가져와 직원정보 html 그리기
  var _url = "/ko/json/emp_info.json";
  $.ajax({
    url : _url
    ,async : true
    ,datatype : "json"
    ,cache : false
    ,success : function(data, status, xhr){
      //invest.emp_info 변수에 가져온 json데이터 세팅
      invest_team.emp_info = data;
      //직원정보 그리기
      invest_team.draw_emp_info();

      //팝업 이벤트 세팅
      //popup open
      $(".pop_open").click(function(e){
        e.preventDefault() || e.stopPropagation();
        var _empno = $(this).closest("figure").attr("empno");
        var _teamcode = $(this).closest("div.content-box").prop("id");
        invest_team.openPop(_teamcode, _empno);
          $("html body").css('overflow','hidden');
      });
      //popup close
      $(".pop_close").click(function(){
        $("#popup").hide();
        $("html body").css('overflow','auto');
      });
    }
    ,error : function(xhr, status, err) {
      console.log("ajax error : " + xhr);
    }
  });
}

//가져온 json데이터로 부터 직원정보 넣기
invest_team.draw_emp_info = function() {
  var _target;
  var _h = "";
  $.each(invest_team.emp_info, function(i,v) {
    _target = $("div#"+i);
    if (_target.size() > 0) {
      $("div.content ul.list_team", _target).empty();
      if(this["member"].length > 0) {
        $.each(this["member"], function(n,val){
          _h = '<li>';
          _h +=   '<figure role="empinfo" empno="'+ val.empno +'">';
          _h +=     '<span>';
          _h +=       '<a href="#" class="pop_open">';
          _h +=         '<img class="emp_photo" src="'+ val.imgsrc +'" alt="" />';
          _h +=       '</a>'
          _h +=     '</span>';
          _h +=     '<figurecaption>';
          _h +=       '<p class="name">'+ val.name +'</p>';
          _h +=       '<p class="post">' + val.post + '</p>';
          _h +=     '</figurecaption>';
          _h +=   '</figure>';
          _h += "</li>";
          $("div.content ul.list_team", _target).append($(_h));
        });
      }
      $("div.content div.cont_header h2", _target).empty().html(this.displayname.toUpperCase());
      $("div.lnb a[href='#"+ i +"']").empty().html(this.displayname.toUpperCase());
    }
  });
}

//직원정보 상세 팝업 오픈
invest_team.openPop = function(_teamcode, _empno) {
  var _empinfo = invest_team.emp_info[_teamcode]["member"][_empno];
  var _popup = $("div#popup");
  $("div.img_box img", _popup).attr("src", _empinfo.imgsrc);
  $("p.p_name", _popup).empty().html(_empinfo.name);
  $("p.p_post", _popup).empty().html(_empinfo.post);
  $("p.p_cmt", _popup).empty().html(_empinfo.comment);
  _popup.show();
}
