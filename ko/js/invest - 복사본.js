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

  //팝업 떴을때 비활성
  //popup open
  $(".pop_open").click(function(){
    var _empno = $(this).closest("figure").attr("empno"); //선택한 사람의 empno 구하기
    invest.openPop(_empno); //팝업 처리
    $('html body').css('overflow-y', 'hidden');
  });
  //popup close
  $(".pop_close").click(function(){
    $("#popup").hide();
    $("html body").css('overflow-y','auto');
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

  //직원정보 json데이터 가져오기
  var _url = "./json/emp_info.json";
  $.ajax({
    url : _url
    ,async : true
    ,datatype : "json"
    ,cache : false
    ,success : function(data, status, xhr){
      //데이터를 가져와 empno별로 배열 구성
      $.each(data, function(i,v){
        invest.emp_info[parseInt(this.empno)] = this;
      });
      //직원정보 세팅
      invest.draw_emp_info();
    }
    ,error : function(xhr, status, err) {
      console.log("ajax error : " + xhr);
    }
  });
}

//가져온 json데이터로 부터 직원정보 넣기
invest.draw_emp_info = function() {
  var _figure = $("figure[role='empinfo']");      //직원정보 figure 전체 select
  var _info;
  $.each(_figure,function(i,v){
    var _photo = $(this).find("img.emp_photo");     // 사진 img태그
    var _name = $(this).find("p.name");             // 성명 p태그
    var _post = $(this).find("p.post");             // 직급/직책 p태그
    _info = invest.emp_info[$(this).attr("empno")]; // 가져온 json Data에서 해당 사번의 정보 get
    _photo.attr("src", _info.imgsrc);               // 사진 경로 세팅
    _name.empty().html(_info.name);                 // 성명 세팅
    _post.empty().html(_info.post);                 // 직급/직책 세팅
  });
}

//직원정보 상세 팝업 오픈
invest.openPop = function(_empno) {
  var _empinfo = invest.emp_info[_empno];                     // 가져온 json Data에서 해당 사번의 정보 get
  var _popup = $("div#popup");                                // popup div select
  $("div.img_box img", _popup).attr("src", _empinfo.imgsrc);  // 사진 경로 세팅
  $("p.p_name", _popup).empty().html(_empinfo.name);          // 성명 세팅
  $("p.p_post", _popup).empty().html(_empinfo.post);          // 직급/직책 세팅
  $("p.p_cmt", _popup).empty().html(_empinfo.comment);        // 설명 세팅
  _popup.show();                                              // 팝업 div show
}
