// JavaScript Document
$(document).ready(function() {
    invest.init();
});
function invest() {};
invest.emp_info = [];
invest.init = function(){
    invest.eventBind();
}
invest.eventBind = function() {
  //직원정보 json데이터 가져와 직원정보 html 그리기
  var _url = "./json/emp_info.json";
  $.ajax({
    url : _url
    ,async : true
    ,datatype : "json"
    ,cache : false
    ,success : function(data, status, xhr){
      //invest.emp_info 변수에 가져온 json데이터 세팅
      invest.emp_info = data;
      //직원정보 그리기
      invest.draw_emp_info();

      //팝업 이벤트 세팅
      //popup open
      $(".pop_open").click(function(){
        var _empno = $(this).closest("figure").attr("empno");       //선택한 사람의 empno ex)1, 2, 3...
        var _teamcode = $(this).closest("div.content-box").prop("id");  //선택한 사람의 팀코드 ex)team01, team02...
        invest.openPop(_teamcode, _empno); //팝업 처리
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

  //푸터 패밀리사이트 토글
  $("footer div.footer_family div.link_item span.family_icon").off("click").on("click", function(){
      $("footer div.family_wrap").toggle();
  });

  //메인 스크롤시 헤더 칼라변경
  $(window).on("scroll", function () {
      if ($(this).scrollTop() > 100) {
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
    var _menus = $("div.lnb").children("li");  //LNB 최상위 메뉴 전체
    _menus.removeClass("on"); //LNB 최상위 메뉴 전체 on 클래스 제거

    var _submenus = $("div.lnb ul li");  //subMenu 전체
    _submenus.removeClass("on");  //subMenu 전체 on 클래스 제거

    var _parents = $(this).parents("div.lnb ul li");
    $(_parents[0]).parent().addClass("on");  //현재 클릭한 subMenu의 최상위 메뉴 on 클래스 추가
    $(this).addClass("on");  //현재 클릭한 subMenu on 클래스 추가
  });
}

//가져온 json데이터로 부터 직원정보 넣기
invest.draw_emp_info = function() {
  var _target;
  var _h = "";
  $.each(invest.emp_info, function(i,v) {
    _target = $("div#"+i);      //타겟 div select ex) div#team01
    if (_target.size() > 0) {   //타겟 div가 존재하는 경우만 처리
      $("div.content ul.list_team", _target).empty(); //타겟 div내에 ul.list_team 내용 비우기
      $.each(this, function(n,val){   //json데이터 갯수만큼 loop
        _h = '<li>';
        _h +=   '<figure role="empinfo" empno="'+ val.empno +'">';  //empno 세팅
        _h +=     '<span>';
        _h +=       '<a href="#" class="pop_open">';
        _h +=         '<img class="emp_photo" src="'+ val.imgsrc +'" alt="" />';  //image 경로 세팅
        _h +=       '</a>'
        _h +=     '</span>';
        _h +=     '<figurecaption>';
        _h +=       '<p class="name">'+ val.name +'</p>';   //성명 세팅
        _h +=       '<p class="post">' + val.post + '</p>'; //직급/직책 세팅
        _h +=     '</figurecaption>';
        _h +=   '</figure>';
        _h += "</li>";
        $("div.content ul.list_team", _target).append($(_h)); //타겟 div내에 ul.list_team에 위에서 생성한 li요소 붙이기
      });
    }
  });
}

//직원정보 상세 팝업 오픈
invest.openPop = function(_teamcode, _empno) {
  var _empinfo = invest.emp_info[_teamcode][_empno];          // 가져온 json Data에서 해당 사번의 정보 get
  var _popup = $("div#popup");                                // popup div select
  $("div.img_box img", _popup).attr("src", _empinfo.imgsrc);  // 사진 경로 세팅
  $("p.p_name", _popup).empty().html(_empinfo.name);          // 성명 세팅
  $("p.p_post", _popup).empty().html(_empinfo.post);          // 직급/직책 세팅
  $("p.p_cmt", _popup).empty().html(_empinfo.comment);        // 설명 세팅
  _popup.show();                                              // 팝업 div show
}
