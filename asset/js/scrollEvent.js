document.addEventListener("DOMContentLoaded", function(){
  gsap.registerPlugin(ScrollTrigger);

  // load event
  const winT = $(window).scrollTop();
  const aboutTop = $("#event").offset().top - (window.innerHeight / 2);
  const productTop = $("#product").offset().top -10;
  const cultureTop = $("#culture").offset().top -10;
  const greetingTop = $("#greeting").offset().top -10;
  const eventTop = $("#event").offset().top - window.innerHeight;

  // greeting offset top
  const jakeTop = $("#jakeKnapp").offset().top - 320;
  const chrisTop = $("#chrisNesladek").offset().top - 320;
  const jamesTop = $("#james").offset().top - 320;
  const sunkwanTop = $("#sunkwan").offset().top - 320;
  const mogiTop = $("#mogi").offset().top - 320;
  const miliTop = $("#miliKang").offset().top - 320;
  
  // quick
  const clientH = document.documentElement.clientHeight;
  const htmlH = document.documentElement.offsetHeight;
  const percent = Math.round(winT / (htmlH - clientH) * 100);
  const cir = document.querySelector(".gauge");

  gsap.to(cir,{
    strokeDashoffset: percent < 14 ? 100 - percent : 100 - (percent * 0.9)
  });

  gsap.to(cir,{
    strokeDashoffset: 100 - (percent * 0.9)
  });
  // quick

  // main scroll open 보이기, 감추기
  if (winT > 10) {    
    gsap.to(".scrollOpen", {
      opacity: 0,
      visibility: "hidden",
      duration: 0.5,
      zIndex: -1,
    });
  } else {
    gsap.to(".scrollOpen", {
      opacity: 1,
      visibility: "visible",
      duration: 0.5,
      zIndex: 2,
    });
  }
  // main scroll open 보이기, 감추기

  var quickCircleBtnChange = function(changeImage) {
    if($(".quickCir .quickImg img").attr("src") !== changeImage) {
      $(".quickCir .quickImg img").attr("src", changeImage);
    }
  }

  // header black, green 일때 quick 버튼 svg stroke, img교체
  if ($("#header").hasClass("black")) {
    $(".quickCir circle").css({
      stroke: "white",
    });
    $(".quickHoverText").css({
      color: "white",
    });
    quickCircleBtnChange("../asset/images/common/more_arr_w.svg");
  } else if ($("#header").hasClass("green")) {
    $(".quickCir circle").css({
      stroke: "white",
    });
    $(".quickHoverText").css({
      color: "white",
    });
    quickCircleBtnChange("../asset/images/common/more_arr_w.svg");
  } else {
    $(".quickCir circle").css({
      stroke: "black",
    });
    $(".quickHoverText").css({
      color: "black",
    });
    quickCircleBtnChange("../asset/images/common/more_arr.svg");
  }
  // header black, green 일때 quick 버튼 svg stroke, img교체


  // scrollTop에 class 부여  
  if (winT >= aboutTop) {
    $(".quickMenuItem a").removeClass("active");
    $("#aboutBtn").addClass("active");
  }
  if(winT >= productTop) {
    $(".quickMenuItem a").removeClass("active");
    $("#productBtn").addClass("active");
  }
  if(winT >= cultureTop) {
    $(".quickMenuItem a").removeClass("active");
    $("#cultureBtn").addClass("active");
  }
  if(winT >= greetingTop) {
    $(".quickMenuItem a").removeClass("active");
    $("#greetingBtn").addClass("active");
  }
  if(winT >= eventTop) {
    $(".quickMenuItem a").removeClass("active");
    $("#eventBtn").addClass("active");
  }
  if(winT <= aboutTop){
    $(".quickMenuItem a").removeClass("active");
  }

  // greeting scroll
  if (winT >= jakeTop) {
    $(".grtItem").removeClass("active");
    $(".jakeItem").addClass("active");
  }
  if(winT >= chrisTop) {
    $(".grtItem").removeClass("active");
    $(".chrisItem").addClass("active");
  }
  if(winT >= jamesTop) {
    $(".grtItem").removeClass("active");
    $(".jamesItem").addClass("active");
  }
  if(winT >= sunkwanTop) {
    $(".grtItem").removeClass("active");
    $(".sunkwanItem").addClass("active");
  }
  if(winT >= mogiTop) {
    $(".grtItem").removeClass("active");
    $(".mogiItem").addClass("active");
  }
  if(winT >= miliTop) {
    $(".grtItem").removeClass("active");
    $(".miliItem").addClass("active");
  }
  if(winT <= jakeTop){
    $(".grtItem").removeClass("active");
    $(".jakeItem").addClass("active");
  }


  // scroll event
  document.addEventListener('scroll', function() {
    const s_winT = window.scrollY;
    const s_aboutTop = $("#about").offset().top - (window.innerHeight / 2);
    const s_productTop = $("#product").offset().top;
    const s_cultureTop = $("#culture").offset().top;
    const s_greetingTop = $("#greeting").offset().top;
    const s_eventTop = $("#event").offset().top - window.innerHeight;
    
    // greeting offset top
    const s_jakeTop = $("#jakeKnapp").offset().top - 320;
    const s_chrisTop = $("#chrisNesladek").offset().top - 320;
    const s_jamesTop = $("#james").offset().top - 320;
    const s_sunkwanTop = $("#sunkwan").offset().top - 320;
    const s_mogiTop = $("#mogi").offset().top - 320;
    const s_miliTop = $("#miliKang").offset().top - 320;

    if (s_winT > 10) {
      gsap.to(".scrollOpen", {
        opacity: 0,
        visibility: "hidden",
        duration: 0.5,
        zIndex: -1,
      });
    } else {
      gsap.to(".scrollOpen", {
        opacity: 1,
        visibility: "visible",
        duration: 0.5,
        zIndex: 2,
      });
    }

    // quick
    const s_clientH = document.documentElement.clientHeight;
    const s_htmlH = document.documentElement.offsetHeight;
    const s_percent = Math.round(s_winT / (s_htmlH - s_clientH) * 100);
    const s_cir = document.querySelector(".gauge");

    gsap.to(s_cir,{
      strokeDashoffset: s_percent < 14 ? 100 - s_percent : 100 - (s_percent * 0.9)
    });
    // quick

    // header black, green 일때 quick 버튼 svg stroke, img교체
    if ($("#header").hasClass("black")) {
      $(".quickCir circle").css({
        stroke: "white",
      });
      $(".quickHoverText").css({
        color: "white",
      });
      quickCircleBtnChange("../asset/images/common/more_arr_w.svg");
    } else if ($("#header").hasClass("green")) {
      $(".quickCir circle").css({
        stroke: "white",
      });
      $(".quickHoverText").css({
        color: "white",
      });
      quickCircleBtnChange("../asset/images/common/more_arr_w.svg");
    } else {
      $(".quickCir circle").css({
        stroke: "black",
      });
      $(".quickHoverText").css({
        color: "black",
      });
      quickCircleBtnChange("../asset/images/common/more_arr.svg");
    }    
    // header black, green 일때 quick 버튼 svg stroke, img교체

    // scrollTop에 class 부여  
    if (s_winT >= s_aboutTop) {
      $(".quickMenuItem a").removeClass("active");
      $("#aboutBtn").addClass("active");
    }
    if(s_winT >= s_productTop) {
      $(".quickMenuItem a").removeClass("active");
      $("#productBtn").addClass("active");
    }
    if(s_winT >= s_cultureTop) {
      $(".quickMenuItem a").removeClass("active");
      $("#cultureBtn").addClass("active");
    }
    if(s_winT >= s_greetingTop) {
      $(".quickMenuItem a").removeClass("active");
      $("#greetingBtn").addClass("active");
    }
    if(s_winT >= s_eventTop) {
      $(".quickMenuItem a").removeClass("active");
      $("#eventBtn").addClass("active");
    }
    if(s_winT <= s_aboutTop) {
      $(".quickMenuItem a").removeClass("active");
    }

    // greeting scroll
    if (s_winT >= s_jakeTop) {
      $(".grtItem").removeClass("active");
      $(".jakeItem").addClass("active");
    }
    if(s_winT >= s_chrisTop) {
      $(".grtItem").removeClass("active");
      $(".chrisItem").addClass("active");
    }
    if(s_winT >= s_jamesTop) {
      $(".grtItem").removeClass("active");
      $(".jamesItem").addClass("active");
    }
    if(s_winT >= s_sunkwanTop) {
      $(".grtItem").removeClass("active");
      $(".sunkwanItem").addClass("active");
    }
    if(s_winT >= s_mogiTop) {
      $(".grtItem").removeClass("active");
      $(".mogiItem").addClass("active");
    }
    if(s_winT >= s_miliTop) {
      $(".grtItem").removeClass("active");
      $(".miliItem").addClass("active");
    }
    if(s_winT <= s_jakeTop){
      $(".grtItem").removeClass("active");
      $(".jakeItem").addClass("active");
    }
  });
  // scroll event  

});