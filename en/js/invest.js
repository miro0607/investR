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
    var _y = $(this).scrollTop();       // 스크롤 위치1
    var _haslnb = $(".lnb").size() > 0 ? true : false;  //lnb가 있는지 여부(있는경우 true, 없는경우 false)
    if (_haslnb) {  //lnb가 있는 경우 스크롤 시 lnb에 on효과 주기
        var _length = $(".wrap div.content-box").length; // wrap div내부에 있는 div 개수

        //wrap div내부에 있는 div 갯수 만큼 반복
        for(var i=0 ; i < _length ; ++i) {
            var _position = $(".wrap div.content-box").eq(i).position(); // wrap div내부에 있는 div의 위치값
            var _height = $(".wrap div.content-box").eq(i).height();     // wrap div내부에 있는 div의 height값

            // 스크롤 위치가 현재 보고있는 컨텐츠를 발견
           if( _y < (_position.top + _height)) {
               // 최종 활성화 되었던 네비가 지금 활성화해야하는 네비와 다르다면
               if(!$(".lnb ul li").eq(i).hasClass("on")) {
                   // 기존에 nav에 있던 클래스는 삭제
                   $(".lnb ul li").removeClass("on");
               }
               // nav에 on클래스 추가
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
    var _menus = $("div.lnb").children("li");  //LNB 최상위 메뉴 전체
    _menus.removeClass("on"); //LNB 최상위 메뉴 전체 on 클래스 제거

    var _submenus = $("div.lnb ul li");  //subMenu 전체
    _submenus.removeClass("on");  //subMenu 전체 on 클래스 제거

    var _parents = $(this).parents("div.lnb ul li");
    $(_parents[0]).parent().addClass("on");  //현재 클릭한 subMenu의 최상위 메뉴 on 클래스 추가
    $(this).addClass("on");  //현재 클릭한 subMenu on 클래스 추가
  });
}

//team 페이지에서 쓰이는 함수들
function invest_team() {}
invest_team.emp_info = [];
invest_team.getTeamInfo = function() {
  //직원정보 json데이터 가져와 직원정보 html 그리기
  var _url = "./json/emp_info.json";
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
        e.preventDefault() || e.stopPropagation();  //클릭시 a 태그 기본 이벤트 실행 방지
        var _empno = $(this).closest("figure").attr("empno");       //선택한 사람의 empno ex)1, 2, 3...
        var _teamcode = $(this).closest("div.content-box").prop("id");  //선택한 사람의 팀코드 ex)team01, team02...
        invest_team.openPop(_teamcode, _empno); //팝업 처리
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
    _target = $("div#"+i);      //타겟 div select ex) div#team01
    if (_target.size() > 0) {   //타겟 div가 존재하는 경우만 처리
      $("div.content ul.list_team", _target).empty(); //타겟 div내에 ul.list_team 내용 비우기
      if(this["member"].length > 0) {
        $.each(this["member"], function(n,val){   //json데이터 갯수만큼 loop
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
      $("div.content div.cont_header h2", _target).empty().html(this.displayname);      //팀명 세팅
      $("div.lnb a[href='#"+ i +"']").empty().html(this.displayname);     //lnb에 팀명 세팅
    }
  });
}

//직원정보 상세 팝업 오픈
invest_team.openPop = function(_teamcode, _empno) {
  var _empinfo = invest_team.emp_info[_teamcode]["member"][_empno]; // 가져온 json Data에서 해당 사번의 정보 get
  var _popup = $("div#popup");                                    // popup div select
  $("div.img_box img", _popup).attr("src", _empinfo.imgsrc);      // 사진 경로 세팅
  $("p.p_name", _popup).empty().html(_empinfo.name);              // 성명 세팅
  $("p.p_post", _popup).empty().html(_empinfo.post);              // 직급/직책 세팅
  $("p.p_cmt", _popup).empty().html(_empinfo.comment);            // 설명 세팅
  _popup.show();                                                  // 팝업 div show
}
