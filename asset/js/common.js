//const e = require('express');

// 시퀀스 이미지 분기를 위한 다국어 체크
let currentLang = location.pathname.substring(1, 3);
// const currentLangList = ['kr','jp','en'];

let magnetizeEventBindCount = 0;

// green, black function
function headerColorChange(baseColor, fontColor) {
  $("#header").removeClass().addClass(baseColor);
  $(".quickCir circle").css({
    stroke: fontColor,
  });
  $(".quickHoverText").css({
    color: fontColor,
  });
  $(".quickCir .quickImg img").attr("src", `../asset/images/common/more_arr${fontColor.indexOf("white") > -1 ? "_w" : ""}.svg`);
}
// green, black function

// 언어별 시퀀스 처리
const bookOpenImages = [];
const bookOpen = { frame: 0 };
const openSqCount = 46;
// const openSqCount = `${currentLang === "en" ? 54 : 54}`;

const bookCloseImages = [];
const bookClose = { frame: 0 };
const closeSqCount = `${currentLang === "ko" ? 59 : 50}`;

const pay_images = [];
const pay_book = { frame: 0 };
const paySqCount = 113;

function getCurrentFrame(index, directory, filename, langChange, format) {
  if (currentLang === "en" && filename === "bookopen") {
    return `../asset/images/sequence/${directory}/ko/${filename}_${index.toString().padStart(5, "0")}.${format}`;
  } else {
    return `../asset/images/sequence/${directory}${langChange ? "/" + currentLang : ""}/${filename}_${index.toString().padStart(5, "0")}.${format}`;
  }
}

function handleMultiSequence(targetArray, maxCount, directory, filename, langChange, format) {
  targetArray.length = 0;
  for (let i = 0; i < maxCount; i++) {
    let img = new Image();
    img.src = getCurrentFrame(i, directory, filename, langChange, format);
    targetArray.push(img);
  }
}

let viewItemLength = 0;
let viewArr = [];
let nowViewProduct = 0;
let viewPaddingLeft = 0;

let totalWidth = 0;
const messageAddPercent = 90; // 응원메시지 추가 로딩할 사이드 스크롤 퍼센트

// event 메시지 슽라이더
function messageAutoScroll() {
  let maxMessageWidth = 0;
  eventWords.map((val, key, arr) => {
    if (key === 0) {
      totalWidth = eventWords[arr.length - 1].clientWidth;
      maxMessageWidth = totalWidth;
    } else if (val.previousElementSibling) {
      let width = val.previousElementSibling.clientWidth;
      maxMessageWidth = Math.max(maxMessageWidth, width);
      totalWidth = totalWidth + width;
      // console.log('autoscroll', totalWidth, width);
    }
    gsap.set(val, {
      x: totalWidth,
    });
  });
  $(".messageItems").css("transform", `translateX(-${maxMessageWidth}px)`);

  let eventTl = gsap.timeline();
  eventTl.to(".messageItems p", {
    duration: (totalWidth * 5) / 600,
    ease: "none",
    x: `-=${totalWidth}`,
    modifiers: {
      x: gsap.utils.unitize((x) => (parseFloat(x) < 0 ? totalWidth + parseFloat(x) : parseFloat(x))),
    },
    repeat: -1,
  });

  // let progresTl = gsap.timeline()
  // progresTl.to( "#progressEnd", {
  //   duration: 5,
  //   ease: "none",
  //   x: "99.9%",
  //   repeat: -1
  // });
}

// load event
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.refresh();

  // 운영체제 체크
  let uanaVigatorOs = navigator.userAgent;

  if (uanaVigatorOs.includes("Macintosh")) {
    $('div[id$="Layer"] .layerContainer').css("transition", "none");
  }

  // 언어설정 세팅 - 로컬 스토리지에서 저장된 언어셋 불러오기
  // if(localStorage.getItem('line-ground-lang') !== null) {
  //   currentLang = localStorage.getItem('line-ground-lang');
  // }
  // if(currentLang === 'ja')
  //   currentLang = 'jp';
  // else if(!currentLangList.includes(currentLang))
  //   currentLang = 'kr';

  viewItemLength = $(".viewAllList .viewAllItem").length; // item 갯수

  viewPaddingLeft = Number($(".viewAllList").css("padding-left").replace(/px/gi, ""));
  let viewMarginTarget = $(".viewAllItem").width() / 2;
  let viewMargin = viewPaddingLeft - viewMarginTarget;
  $(".viewAllItem").css("margin-right", viewMargin);
  $(".viewAllItem")
    .eq(viewItemLength - 1)
    .css("margin-right", 0);

  viewArr = [];
  nowViewProduct = 0;
  let resizeLeft = viewPaddingLeft - $(".viewAllItem").eq(0).offset().left;

  for (let i = 0; i < viewItemLength; i++) {
    if (i > 0) {
      viewArr[i] =
        viewArr[i - 1] +
        $(".viewAllList > div")
          .eq(i - 1)
          .width() +
        viewMargin;
    } else {
      viewArr[i] = viewPaddingLeft;
    }
  }

  // view all product
  $(window).on("resize", function () {
    viewPaddingLeft = Number($(".viewAllList").css("padding-left").replace(/px/gi, ""));

    viewMarginTarget = $(".viewAllItem").width() / 2;
    viewMargin = viewPaddingLeft - viewMarginTarget;
    $(".viewAllItem").css("margin-right", viewMargin);

    // resize 때 재계산
    resizeLeft = viewPaddingLeft - $(".viewAllItem").eq(0).offset().left;

    viewArr = [];
    for (let i = 0; i < viewItemLength; i++) {
      if (i > 0) {
        viewArr[i] =
          viewArr[i - 1] +
          $(".viewAllList > div")
            .eq(i - 1)
            .width() +
          viewMargin;
      } else {
        viewArr[i] = viewPaddingLeft;
      }
    }

    $(".viewAllList").animate(
      {
        left: viewPaddingLeft - viewArr[nowViewProduct],
      },
      100
    );

    if (targetId != "") {
      setTimeout(() => {
        let preWidth = 0;
        let preTotalWidth = 0;
        $("#" + targetId + "Layer .columns").each((index, element) => {
          if (index > 0) {
            $(element).css("left", `${preTotalWidth - preWidth}px`);
          }
          preTotalWidth += Math.ceil($(element).find("p").height() / $(element).height()) * ($(element).width() + Number($(element).css("column-gap").replace(/px/gi, "")));
          preWidth += $(element).width() + Number($(element).css("column-gap").replace(/px/gi, ""));
        });

        $("#" + targetId + "Layer .layerGrid").css("width", preTotalWidth + 50 + "px");
      }, 500);
    }
  });

  var rememberHeaderClass = "";
  var rememberHeaderColor = "";

  const viewAllPrjBtn = document.querySelectorAll(".viewPrjAll");
  viewAllPrjBtn.forEach(
    function (e) {
      e.addEventListener("click", (e) => viewAllPrjShow(e));
    },
    { passive: false }
  );

  let lethargy = new Lethargy(5, 5, 0.05);
  let chk = true;

  let viewWheelEvent = function (e, plusPage) {
    let w_delta = 0;
    e.preventDefault();

    if (lethargy.check(e) !== false) {
      if (chk) {
        // 휠 일정시간동안 막기
        chk = false;
        setTimeout(function () {
          chk = true;
        }, 500);

        // 휠 방향 감지(아래: 120, 위: -120)
        if(Math.abs(e.originalEvent.wheelDeltaX) < Math.abs(e.originalEvent.wheelDeltaY)) {
          w_delta = e.originalEvent.wheelDeltaY / 120;
        } else {
          w_delta = e.originalEvent.wheelDeltaX / 120;
        }

        if ((w_delta < 0 && viewItemLength > 0) || plusPage === "1") {
          if (nowViewProduct < 29) {
            // 휠 아래로
            $(".viewAllList")
              .stop()
              .animate(
                {
                  left: viewPaddingLeft - viewArr[++nowViewProduct],
                },
                500
              );
          }
        } else {
          nowViewProduct = --nowViewProduct < 0 ? 0 : nowViewProduct;
          // 휠 위로
          $(".viewAllList")
            .stop()
            .animate(
              {
                left: viewPaddingLeft - viewArr[nowViewProduct],
              },
              500
            );
        }

        if (nowViewProduct > 0) {
          $(".viewScroll").css("opacity", 0);
        } else {
          $(".viewScroll").css("opacity", 1);
        }

        $(".viewAllList > div").removeClass("active");
        $(".viewCursor").css("display", "none");
        $(".viewAllList > div").eq(nowViewProduct).addClass("active");
        $(".viewPagingBtn a").removeClass("active");
        $(".viewPagingBtn a").eq(nowViewProduct).addClass("active");
        $(".viewThumb").off("mousemove");
        if ($(".viewAllList > div.active").find(".viewThumb").length > 0 && magnetizeEventBindCount < 1) {
          magnetizeEventBindCount++;
          $(document).on("mousemove", function (e) {
            magnetize($(".viewAllList > div.active").find(".viewThumb")[0], e, true);
          });
        }

        // $(".viewAllList > div .viewAllPrjInner").off("mouseleave");
        // $(".viewAllList > div .viewAllPrjInner").off("mousemove");
        // $(".viewAllList > div.active .viewMouseEvent").on("mouseleave", (e) => imgMouseLeave(e));
        // $(".viewAllList > div.active .viewMouseEvent").on("mousemove", (e) => ViewMouseMoveEvent(e));
      }
    }
  };

  const viewAllPrjShow = function (e) {
    e.preventDefault();

    if ($(".viewPrj a").hasClass("on")) {
      $(".viewPrj a").removeClass("on");

      $("#logo").css({
        opacity: 1,
        visibility: "visible",
        zIndex: "100",
      });

      layerView = false;

      if (rememberHeaderColor == "rgb(255, 255, 255)") {
        rememberHeaderColor = "white";
      } else {
        rememberHeaderColor = "black";
      }

      headerColorChange(rememberHeaderClass, rememberHeaderColor);

      $("body").css("overflow", "auto");
      const viewAllHide = gsap.timeline();
      viewAllHide
        .to(".headWrap", {
          zIndex: "10",
        })
        .to(
          "#viewAll",
          {
            bottom: "100%",
          },
          "-=0.5"
        )
        .then(function () {
          gsap.set(".viewPaging", {
            display: "none",
          });
        });

      let viewAllItemLengthHide = gsap.utils.toArray(".viewAllItem .viewAllPrjInner");
      let viewAllPagingLengthHide = gsap.utils.toArray(".viewPagingBox .viewPagingBtn");

      viewAllItemLengthHide.forEach((element, index) => {
        gsap.set(element, {
          transform: "translateX(100%)",
          opacity: 0,
        });
      });

      viewAllPagingLengthHide.forEach((element, index) => {
        gsap.set(element, {
          height: "0",
          opacity: 0,
        });
      });

      nowViewProduct = 0;

      $(".viewAllList > div").removeClass("active");
      $(".viewAllList > div").eq(0).addClass("active");
      $(".viewPagingBox a").removeClass("active");
      $(".viewPagingBox a").eq(0).addClass("active");
    } else {
      $(".viewAllList").animate(
        {
          left: 0,
        },
        0
      );

      if (nowViewProduct > 0) {
        $(".viewScroll").css("opacity", 0);
      } else {
        $(".viewScroll").css("opacity", 1);
      }

      const viewAllShow = gsap.timeline();
      viewAllShow
        .to(".headWrap", {
          zIndex: "10000",
        })
        .to(
          "#viewAll",
          {
            bottom: "0",
          },
          "-=0.5"
        )
        .from(".viewScroll", {
          opacity: 0,
          left: "10rem",
          width: 0,
        })
        .to(
          ".viewPaging",
          {
            display: "block",
          },
          "-=0.5"
        );

      let viewAllItemLength = gsap.utils.toArray(".viewAllItem .viewAllPrjInner");
      let viewAllPagingLength = gsap.utils.toArray(".viewPagingBox .viewPagingBtn");
      setTimeout(() => {
        viewAllItemLength.forEach((element, index) => {
          gsap.to(element, {
            transform: "translateX(0)",
            opacity: 1,
            delay: index / 20,
            ease: Back.easeOut.config(1),
            duration: 1,
          });
        });

        viewAllPagingLength.forEach((element, index) => {
          gsap.to(element, {
            height: "auto",
            opacity: 1,
            delay: index / 20,
          });
        });
      }, 700);

      rememberHeaderClass = $("#header").attr("class");
      rememberHeaderColor = $(".quickCir circle").css("stroke");

      $(".viewPrj a").addClass("on");
      $(".headWrap").css({ zIndex: "10000" });

      $("#logo").css({
        opacity: 0,
        visibility: "hidden",
        zIndex: "-1",
      });

      headerColorChange("black", "white");
      $("body").css("overflow", "hidden");

      // $(".viewAllList > div.active .viewMouseEvent").on("mousemove", (e) => ViewMouseMoveEvent(e));
      // $(".viewAllList > div.active .viewMouseEvent").on("mouseleave", (e) => imgMouseLeave(e));

      $(".viewAllList")
        .off()
        .on("DOMMouseScroll mousewheel onwheel onmousewheel wheel", (e) => viewWheelEvent(e));

      // paging click
      $(".viewPagingBtn a").click(function () {
        const viewPagingIdx = $(this).parent().index();
        $(".viewAllList > div").removeClass("active");
        $(".viewAllList > div").eq(viewPagingIdx).addClass("active");

        $(".viewPagingBtn a").removeClass("active");
        $(this).addClass("active");

        $(".viewAllList").animate(
          {
            left: -(Number(viewArr[viewPagingIdx]) - viewPaddingLeft),
          },
          300
        );

        nowViewProduct = viewPagingIdx;

        if (nowViewProduct > 0) {
          $(".viewScroll").css("opacity", 0);
        } else {
          $(".viewScroll").css("opacity", 1);
        }

        // $(".viewAllList > div .viewAllPrjInner").off("mousemove");
        // $(".viewAllList > div .viewAllPrjInner").off("mouseleave");
        // $(".viewAllList > div.active .viewMouseEvent").on("mousemove", (e) => ViewMouseMoveEvent(e));
        // $(".viewAllList > div.active .viewMouseEvent").on("mouseleave", (e) => imgMouseLeave(e));
        if ($(".viewAllList > div.active").find(".viewThumb").length > 0 && magnetizeEventBindCount < 1) {
          magnetizeEventBindCount++;
          $(document).on("mousemove", function (e) {
            magnetize($(".viewAllList > div.active").find(".viewThumb")[0], e, true);
          });
        }
      });
    }
  };

  // view paging
  $(".viewPagingBtn a").on("mouseenter", function () {
    $(".viewPagingBtn a").addClass("hover");
  });

  $(".viewPagingBtn a").on("mouseleave", function () {
    $(".viewPagingBtn a").removeClass("hover");
  });
  // view paging

  // view click

  // view all product

  // 한번 로딩하는 인터랙션 제어
  let introSkip = sessionStorage.getItem("line-ground-intro");
  const media = document.querySelector(".mainMedia video");

  const intro = gsap.timeline();
  const header = gsap.timeline();

  sessionStorage.setItem("line-ground-intro", "Y");

  if (introSkip === null || introSkip !== "Y") {
    // 로딩 인트로 헤더 타임라인

    intro.to("#loading", {
      visibility: "visible",
      duration: 0.5,
    }).to("#intro", {
      zIndex: 100,
      delay: 1.5,
    }).to(".introBg", {
      transform: "translateY(0)",
    }).to(".introTextBox", {
      opacity: 1,
    }, "-=0.5").to("#loading", {
      zIndex: -1,
      opacity: 0,
      visibility: "hidden",
    }).to(".introDesc", {
      transform: "translateY(0)",
      margin: "3.6rem 0 0",
      opacity: 1,
      height: "6.4rem",
    });

    header.to("#logo", {
      zIndex: 100,
      visibility: "visible",
      delay: 4,
    }).to(".introLogo", {
      opacity: 0,
    }).to("#logo", {
      top: "3.6rem",
      transform: "translate(-50%, 0)",
      ease: CustomEase.create(
        "custom",
        "M0,0 C0,0 0.03208,0.00134 0.05,0.00616 0.0729,0.01231 0.09027,0.01696 0.11,0.02956 0.15261,0.05678 0.18354,0.07805 0.22,0.11474 0.27143,0.1665 0.30143,0.20403 0.345,0.26604 0.45608,0.42414 0.50914,0.52278 0.62,0.68406 0.66567,0.7505 0.69445,0.78734 0.745,0.84796 0.76927,0.87706 0.78668,0.89307 0.815,0.9179 0.8363,0.93658 0.85108,0.94765 0.875,0.96194 0.89623,0.97463 0.91192,0.98259 0.935,0.98961 0.95799,0.99661 1,1 1,1 "
      ),
    }).to("#logo a", {
      fontSize: "2.8rem",
      letterSpacing: "-0.01em",
    }, "-=0.5").to(".introDesc", {
      transform: "translateY(-20px)",
      opacity: 0,
    }, "-=0.5").to("#intro", {
      zIndex: -1,
      opacity: 0,
      display: "none",
    }, "-=0.5").to(".headWrap", {
      position: "fixed",
    }, "-=0.5").to("#logo", {
      position: "absolute",
    }, "-=0.5").to(".mainMedia video", {
      opacity: 1,
      onComplete: mediaPlay,
    }, "-=0.5").to(".headCont", {
      opacity: 1,
      transform: "translateY(0)",
    }, "+=2.5").to("#quick", {
      opacity: 1,
      transform: "translateX(0)",
    }, "-=0.5").to(".scrollBox lottie-player", {
      opacity: 1,
    }).from(
      ".mainSequence",
      {
        opacity: 0,
      },
      "-=0.5"
    ).to(".mainMedia", {
      zIndex: "-1",
      display: "none",
    }, "-=0.4").set(".mainMedia", {
      opacity: 0,
    }).to("body", {
      overflow: "auto",
    });
    // 로딩 인트로 헤더 타임라인

    // 미디어 재생
    function mediaPlay(tween) {
      media.play();
    }
    sessionStorage.setItem("line-ground-intro", "Y");
  } else {
    let reloadTl = gsap.timeline();
    $(window).scrollTop(0);
    $("#loading").hide();
    $("#intro").hide();

    // 미디어 재생
    function mediaPlay(tween) {
      media.play();
    }

    media.load();

    gsap.set("body", {
      overflow: "hidden",
    });
    gsap.set("#intro", {
      zIndex: 100,
      display: "block",
      opacity: 1,
      visibility: "visible",
    });
    gsap.set(".introBg", {
      transform: "translateY(0)",
    });
    gsap.set(".introTextBox", {
      opacity: 0,
    });
    gsap.set(".introLogo", {
      opacity: 0,
    });
    gsap.set(".introDesc", {
      opacity: 0,
      height: 0,
      transform: "translateY(10px)",
      margin: 0,
    });
    gsap.set(".headWrap", {
      position: "",
    });
    gsap.set("#logo", {
      position: "fixed",
      zIndex: -1,
      visibility: "hidden",
      top: "calc(50% - 5rem)",
      transform: "translate(-50%, -50%)",
    });
    gsap.set("#logo a", {
      fontSize: "14rem",
      letterSpacing: "-0.03em",
    });
    gsap.set("#quick", {
      opacity: 0,
      transform: "translateX(20px)",
    });
    gsap.set(".scrollBox lottie-player", {
      opacity: 0,
    });
    gsap.set(".mainMedia", {
      opacity: 1,
      display: "block",
      zIndex: "2",
    });
    gsap.set(".mainSequence", {
      opacity: 0,
    });

    reloadTl
      .to(".introTextBox", {
        opacity: 1,
      })
      .to(".introLogo", {
        opacity: 1,
      })
      .to(".introDesc", {
        transform: "translateY(0)",
        margin: "3.6rem 0 0",
        opacity: 1,
        height: "6.4rem",
      })
      .to(
        "#logo",
        {
          zIndex: 100,
          visibility: "visible",
        },
        "+=1"
      )
      .to(".introLogo", {
        opacity: 0,
      })
      .to("#logo", {
        top: "3.6rem",
        transform: "translate(-50%, 0)",
        ease: CustomEase.create(
          "custom",
          "M0,0 C0,0 0.03208,0.00134 0.05,0.00616 0.0729,0.01231 0.09027,0.01696 0.11,0.02956 0.15261,0.05678 0.18354,0.07805 0.22,0.11474 0.27143,0.1665 0.30143,0.20403 0.345,0.26604 0.45608,0.42414 0.50914,0.52278 0.62,0.68406 0.66567,0.7505 0.69445,0.78734 0.745,0.84796 0.76927,0.87706 0.78668,0.89307 0.815,0.9179 0.8363,0.93658 0.85108,0.94765 0.875,0.96194 0.89623,0.97463 0.91192,0.98259 0.935,0.98961 0.95799,0.99661 1,1 1,1 "
        ),
      })
      .to(
        "#logo a",
        {
          fontSize: "2.8rem",
          letterSpacing: "-0.01em",
        },
        "-=0.5"
      )
      .to(
        ".introDesc",
        {
          transform: "translateY(-20px)",
          opacity: 0,
        },
        "-=0.5"
      )
      .to(
        "#intro",
        {
          zIndex: -1,
          opacity: 0,
          display: "none",
        },
        "-=0.5"
      )
      .to(
        ".headWrap",
        {
          position: "fixed",
        },
        "-=0.5"
      )
      .to(
        "#logo",
        {
          position: "absolute",
        },
        "-=0.5"
      )
      .to(
        ".mainMedia video",
        {
          opacity: 1,
          onComplete: mediaPlay,
        },
        "-=0.5"
      )
      .to(
        ".headCont",
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        "+=2.5"
      )
      .to(
        "#quick",
        {
          opacity: 1,
          transform: "translateX(0)",
        },
        "-=0.5"
      )
      .to(
        ".scrollBox lottie-player",
        {
          opacity: 1,
        },
        "-=0.5"
      )
      .to(
        ".mainSequence",
        {
          opacity: 1,
        },
        "-=0.5"
      )
      .to(
        ".mainMedia",
        {
          zIndex: "-1",
          display: "none",
        },
        "-=0.4"
      ).set(
        ".mainMedia",
        {
          opacity: 0
        }
      )
      .to(
        "body",
        {
          overflow: "auto",
          // onComplete: function () {
          //   $("#logo a").on("click", logoClickEvent);
          // },
        },
      );
  }

  // 한번 로딩하는 인터랙션 제어

  // 북오픈 시퀀스
  const bookOpenSq = document.querySelector("#bookSq");
  const bookOpenContext = bookOpenSq.getContext("2d");

  handleMultiSequence(bookOpenImages, openSqCount, "book", "bookopen", true, "jpg");

  bookOpenSq.width = 1920;
  bookOpenSq.height = 1080;

  gsap.to(bookOpen, {
    frame: openSqCount - 1,
    snap: "frame",
    scrollTrigger: {
      trigger: ".mainSequence",
      start: "5% top",
      end: "95% bottom",
      scrub: true,
      onLeave: function () {
        $(".mainSequence").css({
          visibility: "hidden",
          zIndex: -1,
        });
      },
      onEnterBack: function () {
        $(".mainSequence").css({
          visibility: "visible",
          zIndex: 1,
        });
      },
    },
    onUpdate: bookOpenRender,
  });

  bookOpenImages[0].onload = bookOpenRender;

  function bookOpenRender() {
    bookOpenContext.clearRect(0, 0, bookOpenSq.width, bookOpenSq.height);
    bookOpenContext.drawImage(bookOpenImages[bookOpen.frame], 0, 0, bookOpenImages[bookOpen.frame].width, bookOpenImages[bookOpen.frame].height, 0, 0, bookOpenSq.width, bookOpenSq.height);
  }
  // 북오픈 시퀀스

  // 시퀀스

  // click event

  // book page btn click
  $(".quickBox a").click(function () {
    const quickTl = gsap.timeline();

    quickTl.to(".quickBox a", {
      transform: "scale(0)",
      duration: 0.5,
    });
    quickTl.to(
      ".quickMenuClose",
      {
        transform: "scale(1)",
      },
      "-=0.5"
    );
    quickTl.to(
      "#quickMenu",
      {
        right: 0,
        duration: 0.5,
      },
      "-=0.5"
    );
    quickTl.to("body", {
      overflow: "hidden",
    });
  });

  $(".quickMenuClose").click(function () {
    const quickCloseTl = gsap.timeline();

    quickCloseTl.to(".quickMenuClose", {
      transform: "scale(0)",
      duration: 0.5,
    });
    quickCloseTl.to(
      ".quickBox a",
      {
        transform: "scale(1)",
      },
      "-=0.5"
    );
    quickCloseTl.to(
      "#quickMenu",
      {
        right: "-100%",
      },
      "-=0.5"
    );
    quickCloseTl.to("body", {
      overflow: "auto",
    });
  });

  // quickMenu btn click
  $(".quickMenuItem a").click(function () {
    let quickMenuAttr = $(this).attr("data-item");
    let targetOffsetTop = $(quickMenuAttr).offset().top;

    const quickMenuTl = gsap.timeline();

    if (quickMenuAttr == "#about") {
      targetOffsetTop = $(".mainSequence").offset().top + $(".mainSequence").height() / 2;
    }

    if (quickMenuAttr == "#product") {
      targetOffsetTop = targetOffsetTop - window.innerHeight / 2 + $(".proScrollText").height() / 2;
    }

    if (quickMenuAttr == "#culture") {
      let paddingValue = parseFloat($(".culTitle").css("padding-left"));
      paddingValue -= parseFloat($(".headWrap").css("padding-left")) /2;
      let cultureWidth = parseFloat($('#culture .pin-spacer').css('padding-bottom'));
      targetOffsetTop = targetOffsetTop + (window.innerWidth+paddingValue)*cultureWidth/(cultureWidth-window.innerWidth);
    }

    if (quickMenuAttr == "#greeting") {
      gsap.set(".grtCont", {
        transform: "translateY(0)",
      });
      targetOffsetTop = $("#jakeKnapp").offset().top + 1;
    }

    if (quickMenuAttr == "#event") {
      if($("body").hasClass("krBody")){
        targetOffsetTop = $("#endGrt").offset().top + 50;
      } else {
        targetOffsetTop = $("#event").offset().top + 50;
      }
    }

    $("body, html").stop().animate(
      {
        scrollTop: targetOffsetTop,
      },
      0
    );

    quickMenuTl
      .to(".quickMenuClose", {
        transform: "scale(0)",
        duration: 0.5,
        delay: 0.4,
      })
      .to(
        ".quickBox a",
        {
          transform: "scale(1)",
        },
        "-=0.5"
      )
      .to(
        "#quickMenu",
        {
          right: "-100%",
        },
        "-=0.5"
      )
      .to("body", {
        overflow: "auto",
      });
  });
  // quickMenu btn click

  // about intro
  const aboutIntro = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "-5% bottom",
      end: "top bottom",
      onEnter: function () {
        $(".aboutIntroText h2 b").css({
          top: 0,
          transition: "top 0.3s",
        });

        $(".aboutIntroText p").css({
          opacity: 1,
          transform: "translateY(0)",
          transition: "opacity 0.3s, transfrom 0.3s",
          transitionDelay: "0.1s"
        });

        $(".aboutIntroText span").css({
          opacity: 1,
          transform: "translateY(0)",
          transition: "opacity 0.3s, transfrom 0.3s",
          transitionDelay: "0.15s"
        });

        $(".mask").css({
          visibility: "visible",
        });
      },
      onLeaveBack: function () {
        $(".aboutIntroText h2 b").css({
          top: "100%",
          transition: "top 0.3s",
        });

        $(".aboutIntroText p").css({
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 0.3s, transfrom 0.3s",
        });

        $(".aboutIntroText span").css({
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 0.3s, transfrom 0.3s",
        });

        $(".mask").css({
          visibility: "hidden",
        });
      },
    },
  });

  gsap.to(".mask span", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
      endTrigger: ".aboutInfo",
      end: "top center",
      scrub: 1,
      onEnter: function () {
        headerColorChange("green", "white");
      },
      onLeaveBack: function () {
        headerColorChange("", "black");
      },
    },
    transform: "scale(1, 1)",
  });

  gsap.to(".aboutGreenMask", {
    scrollTrigger: {
      trigger: ".aboutIntro",
      start: "center 10%",
      end: "center 10%",
      scrub: true,
      onEnter: function(){
        gsap.set(".mask", {
          visibility: "hidden"
        });
      },
      onEnterBack: function(){
        gsap.set(".mask", {
          visibility: "visible"
        });
      },
    },
    visibility: "hidden",
  });

  gsap.to(".overlay", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 40%",
      endTrigger: ".aboutInfo",
      end: "top 20%",
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
    clipPath: "circle(100% at center)",
    visibility: "visible",
  });

  // about info
  gsap.to(".aboutInfoInner", {
    scrollTrigger: {
      trigger: ".aboutIntro",
      start: "top bottom",
      end: "10% 30%",
      scrub: 0.5,
    },
    opacity: 1,
    transform: "translate(0, -50%) scale(1,1)",
    visibility: "visible",
  });

  gsap.to(".aboutIntro", {
    scrollTrigger: {
      trigger: ".aboutIntro",
      start: "top bottom",
      end: "top bottom",
      scrub: true,
    },
    visibility: "hidden"
  });

  gsap.to(".aboutInfoArea", {
    scrollTrigger: {
      trigger: ".aboutIntro",
      start: "bottom center",
      endTrigger: ".aboutInfo",
      end: "50% 20%",
      scrub: 0.5,
    },
    opacity: 0,
    marginTop: "-30px",
  });

  gsap.to(".aboutInfoInner", {
    scrollTrigger: {
      trigger: ".aboutInfo",
      start: "50% 20%",
      end: "50% 20%",
      scrub: true,
    },
    position: "relative",
  });
  
  const tl = gsap.timeline();

  tl.to(".overlay", {
    scrollTrigger: {
      trigger: ".aboutInfo",
      start: "10% 20%",
      endTrigger: ".aboutEnd",
      end: "30% center",
      scrub: 0.5,
      onEnter: function () {
        headerColorChange("", "black");
      },
      onLeaveBack: function () {
        headerColorChange("green", "white");
      },
    },
    width: "32rem",
    height: "68rem",
    borderRadius: "5rem",
  });
  tl.to(".overlayLine", {
    scrollTrigger: {
      trigger: ".aboutEnd",
      start: "15% center",
      end: "25% center",
      scrub: 0.5,
    },
    opacity: 1,
  });
  tl.to(".overlayLine img", {
    scrollTrigger: {
      trigger: ".aboutEnd",
      start: "30% center",
      end: "40% center",
      scrub: 0.5,
    },
    opacity: 1,
    transform: "scale(1,1)",
  });

  // about End
  gsap.to("#header", {
    scrollTrigger: {
      trigger: ".aboutEndArea",
      start: "top top",
      end: "top top",
      onEnter: function () {
        headerColorChange("black", "white");
      },
      onEnterBack: function () {
        headerColorChange("", "black");
      },
    },
  });

  let aboutEndTextTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".aboutEndArea",
      start: "top center",
      endTrigger: ".aboutEnbInner",
      end: "40% center",
      scrub: 0.5,
    },
  });

  aboutEndTextTl.from(".aboutEndText h3 b", {
      opacity: 0,
      transform: "translateX(50px)",
    }).from(".aboutEndText h3 span", {
        opacity: 0,
        transform: "translateX(-50px)",
      }, "-=0.5").from(".aboutEndText p", {
        opacity: 0,
        transform: "translateY(50px)",
      }, "-=0.5");

  let aboutEndImgTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".aboutEnbInner",
      start: "top center",
      end: "bottom center",
      scrub: 0.5,
    },
  });
  aboutEndImgTl.fromTo(".endImg_01", {
        transform: "translateY(300px)",
      }, {
        transform: "translateY(-300px)",
      }).fromTo(".endImg_02", {
        transform: "translateY(300px)",
      }, {
        transform: "translateY(-300px)",
      }, "-=0.45").fromTo(".endImg_03", {
        transform: "translateY(300px)",
      }, {
        transform: "translateY(-300px)",
      }, "-=0.5").fromTo(".endImg_04", {
        transform: "translateY(300px)",
      }, {
        transform: "translateY(-300px)",
      }, "-=0.45").fromTo(".endImg_05", {
        transform: "translateY(300px)",
      }, {
        transform: "translateY(-300px)",
      }, "-=0.5");

  gsap.to(".overlay", {
    scrollTrigger: {
      trigger: ".aboutEndArea",
      start: "100px top",
      end: "100px top",
      onEnter: function () {
        $(".overlay").css({
          position: "absolute",
        });
      },
      onEnterBack: function () {
        $(".overlay").css({
          position: "fixed",
        });
      },
    },
  });

  // product text scrollX
  gsap.to(".proScrollText li p b", {
    scrollTrigger: {
      trigger: ".proScrollText",
      start: "top bottom",
      endTrigger: ".scText_03",
      end: "bottom center",
      scrub: 0.5,
    },
    transform: "translate(0,0)",
  });

  // hover event
  const hoverE = document.querySelectorAll(".hoverEv");
  hoverE.forEach((element) => {
    element.addEventListener("mouseenter", titleMouseEnter);
    element.addEventListener("mouseleave", titleMouseLeave);
  });

  const listHover = document.querySelectorAll(".listHover");
  listHover.forEach((element) => {
    element.addEventListener("mouseenter", titleMouseEnterActive);
    element.addEventListener("mouseleave", titleMouseLeave);
  });

  function titleMouseEnter(e) {
    const titleTarget = e.currentTarget;
    const aniTarget = titleTarget.querySelectorAll(".hoverBar");

    aniTarget.forEach((element) => {
      gsap
        .to(element, {
          right: "100%",
          duration: 0.5,
        })
        .then(function () {
          gsap.set(element, {
            right: "-100%",
          });
        });
    });
  }

  function titleMouseLeave(e) {
    const titleTarget = e.currentTarget;
    const aniTarget = titleTarget.querySelectorAll(".titleHover h4 b i");

    aniTarget.forEach((element) => {
      gsap.set(element, {
        right: "-100%",
      });
    });
  }

  function titleMouseEnterActive(e) {
    const titleTarget = e.currentTarget;
    const aniTarget = titleTarget.querySelectorAll(".hoverBar");
    if (titleTarget.parentElement.classList.contains("active")) {
      aniTarget.forEach((element) => {
        gsap
          .to(element, {
            right: "100%",
            duration: 0.5,
          })
          .then(function () {
            gsap.set(element, {
              right: "-100%",
            });
          });
      });
    }
  }

  // hover event

  // product 순차적 진행 에니메이션

  // ** payment

  // linepay Sequence
  const linepaySq = document.querySelector("#paySq");
  const linepayContext = paySq.getContext("2d");

  handleMultiSequence(pay_images, paySqCount, "linepay", "linepay", false, "png");

  linepaySq.width = 1920;
  linepaySq.height = 1080;

  gsap.to(pay_book, {
    frame: paySqCount - 1,
    snap: "frame",
    scrollTrigger: {
      trigger: ".paySequence",
      start: "top 208px",
      end: "bottom 80%",
      scrub: 0.5,
    },

    onUpdate: payRender,
  });

  pay_images[0].onload = payRender;

  function payRender() {
    linepayContext.clearRect(0, 0, linepaySq.width, linepaySq.height);
    linepayContext.drawImage(pay_images[pay_book.frame], 0, 0, pay_images[pay_book.frame].width, pay_images[pay_book.frame].height, 0, 0, linepaySq.width, linepaySq.height);
  }
  // linepay Sequence

  const linePayTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".paySequence",
      start: "top 100px",
      end: "bottom 208px",
      scrub: 0.5,
    },
  });

  linePayTl
    .to(".payTitle h4 b span", {
      opacity: 1,
      transform: "translateY(0)",
      duration: 1,
    })
    .to(
      ".payTitle p",
      {
        opacity: 1,
        transform: "translateY(0)",
        duration: 1,
      },
      "-=0.7"
    )
    .to(
      ".payDesc",
      {
        opacity: 1,
        transform: "translateY(0)",
        duration: 1,
      },
      "-=0.8"
    );
  // ** payment

  // ** lineMan

  gsap.to(".viewTitle h4 b span", {
    scrollTrigger: {
      trigger: ".viewArea",
      start: "top 80%",
      end: "10% 80%",
      scrub: 1,
    },
    opacity: 1,
    transform: "translateY(0)",
    duration: 1,
  });

  gsap.to(".viewDesc", {
    scrollTrigger: {
      trigger: ".imgBox",
      start: "bottom 90%",
      end: "bottom 90%",
      onEnter: function () {
        $(".viewDesc p").css({
          transform: "translateY(0)",
          opacity: 1,
          transition: "all 1s",
        });

        $(".viewDesc sub").css({
          transform: "translateY(0)",
          opacity: 0.8,
          transition: "all 1s",
        });
      },
      onEnterBack: function () {
        $(".viewDesc p").css({
          transform: "translateY(50px)",
          opacity: 0,
          transition: "all 0.5s",
        });

        $(".viewDesc sub").css({
          transform: "translateY(50px)",
          opacity: 0,
          transition: "all 0.5s",
        });
      },
    },
  });
  // ** lineMan

  // ** call
  gsap.to(".call .callTitle h4 b span", {
    scrollTrigger: {
      trigger: ".callTitle",
      start: "top 90%",
      end: "10% 90%",
      scrub: 1,
    },
    opacity: 1,
    transform: "translateY(0)",
  });

  gsap.to(".callDesc", {
    scrollTrigger: {
      trigger: ".callDesc",
      start: "top 90%",
      end: "top 90%",
      scrub: 1,
    },
    transform: "translateY(0)",
    opacity: 1,
  });
  // ** call

  // ** care
  gsap.to(".careTitle p b", {
    scrollTrigger: {
      trigger: ".careImg",
      start: "bottom 95%",
      end: "bottom 85%",
      scrub: 1,
    },
    opacity: 1,
    transform: "translateY(0)",
  });

  gsap.to(".careDesc", {
    scrollTrigger: {
      trigger: ".careDesc",
      start: "top bottom",
      end: "top bottom",
      scrub: true,
      onEnter: function () {
        $(".careDesc").addClass("on");
      },
      onEnterBack: function () {
        $(".careDesc").removeClass("on");
      },
    },
  });
  // ** care

  // ** seed
  gsap.from(".seedTextBox", {
    scrollTrigger: {
      trigger: ".seedSqCont lottie-player",
      start: "bottom 80%",
      end: "bottom 80%",
      scrub: 1,
    },
    transform: "translateY(20px)",
    opacity: 0,
  });
  // ** seed

  // ** sticker
  gsap.to(".stickerTitle h4 b span", {
    scrollTrigger: {
      trigger: ".stickerTitle h4",
      start: "top 85%",
      end: "top 75%",
      scrub: 1,
    },
    opacity: 1,
    transform: "translateY(0)",
  });

  gsap.to(".stickerDesc p", {
    scrollTrigger: {
      trigger: ".stickerDesc p",
      start: "top 90%",
      end: "top 90%",
      scrub: 1,
    },
    opacity: 1,
    transform: "translateY(0)",
  });

  gsap.to(".stickerDesc span", {
    scrollTrigger: {
      trigger: ".stickerDesc p",
      start: "top 90%",
      end: "top 90%",
      scrub: 1,
    },
    opacity: 1,
    transform: "translateY(0)",
  });
  // ** sticker

  // ** circle
  const circle = gsap.timeline({
    ease: false,
    scrollTrigger: {
      trigger: ".stickerRight",
      start: "440px top",
      endTrigger: "#culture",
      end: "bottom 20%",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  circle
    .to(".circle", {
      top: "50%",
      left: "50%",
      position: "fixed",
      transform: "translate(-50%, -50%) scale(1.1)",
    })
    .to(".circle", {
      transform: "translate(-50%, -50%) scale(5)",
      backgroundColor: "#e9eaed",
    });
  // ** circle

  gsap.to("#header", {
    ease: false,
    scrollTrigger: {
      trigger: "#culture",
      start: "top top",
      end: "top top",
      scrub: true,
      onEnter: function () {
        headerColorChange("", "black");
      },
      onEnterBack: function () {
        headerColorChange("black", "white");
      },
      invalidateOnRefresh: true,
    },
  });

  // product 순차적 진행 에니메이션

  //  ** mouse move pointer **
  let magnet = document.querySelectorAll(".magnetize");

  magnet.forEach(function (elem) {
    $(document).on("mousemove", function (e) {
      magnetize(elem, e, false);
    });
  });

  function magnetize(el, e, allListCheck) {
    if (allListCheck && $(".viewAllList > div.active").find(".viewThumb").length == 0) {
      return false;
    }

    let mX = e.pageX;
    let mY = e.pageY;
    const item = $(el);

    let customDist = 0;
    if (item.attr("data-dist") == "width") {
      customDist = item.width() || 120;
    } else {
      customDist = item.height() || 120;
    }

    const centerX = item.offset().left + item.width() / 2;
    const centerY = item.offset().top + item.height() / 2;

    let deltaX = Math.floor(centerX - mX) * -0.05;
    let deltaY = Math.floor(centerY - mY) * -0.05;

    let distance = calculateDistance(item, mX, mY);

    if (distance < customDist) {
      gsap.to(item, 1, { y: deltaY, x: deltaX, scale: 1.01 });
      item.addClass("magnet");
    } else {
      gsap.to(item, 1, { y: 0, x: 0, scale: 1 });
      item.removeClass("magnet");
    }
  }

  function calculateDistance(elem, mouseX, mouseY) {
    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left + elem.width() / 2), 2) + Math.pow(mouseY - (elem.offset().top + elem.height() / 2), 2)));
  }

  const mouseMoveEvent = function (e) {
    if (layerView) return;
    let mouseCursor = document.querySelector(".viewCursor");
    mouseCursor.style.top = e.pageY - 42 + "px";
    mouseCursor.style.left = e.pageX + 28 + "px";
    mouseCursor.style.display = "flex";
  };

  const mousemoveLeave = function (e) {
    if (layerView) return;
    let mouseCursor = document.querySelector(".viewCursor");

    mouseCursor.style.display = "none";
  };

  const ViewMouseMoveEvent = function (e) {
    if (layerView) return;

    let mouseCursor = document.querySelector(".viewCursor");
    mouseCursor.style.top = e.pageY - 42 + "px";
    mouseCursor.style.left = e.pageX + 28 + "px";
    mouseCursor.style.display = "flex";
  };

  const imgMouseLeave = function (e) {
    if (layerView) return;
    let mouseCursor = document.querySelector(".viewCursor");

    mouseCursor.style.display = "none";
    // e.currentTarget.querySelector(".viewThumb").style.transform = "rotateX(0) rotateY(0) rotateZ(0)"
  };

  let layerView = false;
  let targetMaxWidth = 0;

  // 관성 체크

  // layer wheel
  document.addEventListener("mousewheel", function (e) {
      if (layerView) {
        e.preventDefault();
        // view all product

        // layer Popup
        if ($("#" + targetId + "Layer").hasClass("deTextPopup")) {
          return false;
        } else {
          let targetName = document.querySelector("#" + targetId + "Layer .layerContainer");
          let targetInner = targetName.querySelectorAll(".layerInner");
          let tagetCloseImg = targetName.parentNode.querySelector(".layerClose");
          let proceeding = targetName.parentNode.querySelector(".proceeding");
          targetMaxWidth = Number($(`#${targetId}Layer .layerHead`).css("padding-right").replace(/px/gi, ""));

          targetInner.forEach((element) => {
            if (!element.classList.contains("layerGrid")) {
              targetMaxWidth += element.clientWidth;
            } else if (element.classList.contains("layerGrid")) {
              let layerColumn = element.querySelectorAll(".columns");
              let layerColumnLength = element.querySelectorAll(".columns").length;

              for (let j = 0; j < layerColumnLength; j++) {
                targetMaxWidth += Math.ceil($(layerColumn[j]).find("p").height() / $(layerColumn[j]).height()) * ($(layerColumn[j]).width() + Number($(layerColumn[j]).css("column-gap").replace(/px/gi, "")));
              }
            }
          });

          let movePx = Number(targetName.style.left.replace(/px/gi, "")) + (e.deltaY + e.deltaX) * -1;
          if (movePx > 0) {
            movePx = 0;
          } else if (movePx <= (targetMaxWidth - window.innerWidth) * -1) {
            movePx = (targetMaxWidth - window.innerWidth) * -1;
          }

          targetName.style.left = movePx + "px";

          proceeding.style.width = (Number(targetName.style.left.replace(/px/gi, "")) / (targetMaxWidth - window.innerWidth)) * -100 + "%";

          // close bg change
          if (Number(targetName.style.left.replace(/px/gi, "")) < -(targetName.querySelector(".layerMain").clientWidth + targetName.querySelector(".layerImgArea").clientWidth - window.innerWidth)) {
            tagetCloseImg.classList.add("on");
          } else {
            tagetCloseImg.classList.remove("on");
          }
        }
      }
    },
    { passive: false }
  );

  let targetId = "";

  const viewClick = function (e) {
    e.preventDefault();

    layerView = true;
    // const imgW = $("#" + targetId + "Layer .layerImgBox img").width();
    // $("#" + targetId + "Layer .layerImgArea").css("width", imgW + "px");

    targetId = e.currentTarget.getAttribute("data-item");
    let closeTargetName = document.querySelector("#" + targetId + "Layer .layerContainer");
    let closeImg = closeTargetName.parentNode.querySelector(".layerClose");
    $("#" + targetId + "Layer .layerBtnBox").hide();
    $("#" + targetId + "Layer .layerHeadText p:eq(0)").hide();
    $("#" + targetId + "Layer .layerHeadText span").hide();
    $(".viewCursor").css("display", "none");
    document.querySelector("#" + targetId + "Layer .layerContainer").style.left = "0";

    gsap.set(".proceeding", {
      width: 0,
    });

    const viewClickTl = gsap.timeline();
    viewClickTl
      .to("#" + targetId + "Layer", {
        opacity: "1",
        visibility: "visible",
      })
      .to(
        "#" + targetId + "Layer .layerWrap",
        {
          transform: "translate(0, 0)",
        },
        "-=0.5"
      )
      .from("#" + targetId + "Layer .layerImgBox", {
        top: "50%",
        left: "0",
        transform: "translate(-75%, -50%) scale(0.5)",
        duration: 0.5,
        opacity: 0,
        ease: false,
      })
      .from(
        "#" + targetId + "Layer .layerHead",
        {
          transform: "translate(0, -120px)",
        },
        "-=0.4"
      )
      .from(
        "#" + targetId + "Layer .layerProgress",
        {
          opacity: "0",
        },
        "-=0.3"
      )
      .from(
        "#" + targetId + "Layer .layerMainSubTitle",
        {
          opacity: "0",
          transform: "translate(50px, 0)",
        },
        "-=0.5"
      )
      .from(
        "#" + targetId + "Layer .layerMainTitle",
        {
          opacity: "0",
          transform: "translate(50px, 0)",
        },
        "-=0.3"
      )
      .from(
        "#" + targetId + "Layer .layerMainDesc",
        {
          opacity: "0",
          transform: "translate(50px, 0)",
        },
        "-=0.5"
      )
      .from(
        "#" + targetId + "Layer .layerGrid",
        {
          opacity: "0",
          transform: "translate(50px, 0)",
        },
        "-=0.3"
      );

    // close bg change
    if (Number(closeTargetName.style.left.replace(/px/gi, "")) < -(closeTargetName.querySelector(".layerMain").clientWidth + closeTargetName.querySelector(".layerImgArea").clientWidth - window.innerWidth)) {
      closeImg.classList.add("on");
    } else {
      closeImg.classList.remove("on");
    }

    let preWidth = 0;
    let preTotalWidth = 0;
    $("#" + targetId + "Layer .columns").each((index, element) => {
      if (index > 0) {
        $(element).css("left", `${preTotalWidth - preWidth}px`);
      }
      preTotalWidth += Math.ceil($(element).find("p").height() / $(element).height()) * ($(element).width() + Number($(element).css("column-gap").replace(/px/gi, "")));
      preWidth += $(element).width() + Number($(element).css("column-gap").replace(/px/gi, ""));
    });

    $("#" + targetId + "Layer .layerGrid").css("width", preTotalWidth + 50 + "px");
  };

  const viewClose = function (e) {
    layerView = false;
    e.stopPropagation();
    e.preventDefault();

    if ($("#" + targetId + "Layer").hasClass("deTextPopup")) {
      let close = gsap.timeline();

      close
        .to("#" + targetId + "Layer", {
          opacity: 0,
        })
        .set("#" + targetId + "Layer", {
          visibility: "hidden",
        })
        .set("#" + targetId + "Layer .layerWrap .layerTextBtnBox", {
          opacity: "0",
          transform: "translateX(50px)",
        })
        .set("#" + targetId + "Layer .layerWrap .layerTextBox p", {
          opacity: "0",
          transform: "translateX(50px)",
        })
        .set("#" + targetId + "Layer .layerWrap .layerTextBox b", {
          opacity: "0",
          transform: "translateX(50px)",
        })
        .set("#" + targetId + "Layer .layerWrap .layerHead", {
          transform: "translateY(-100%)",
          opacity: "0",
        })
        .set("#" + targetId + "Layer .layerWrap", {
          opacity: "0",
          visibility: "hidden",
        })
        .set("#" + targetId + "Layer", {
          opacity: 0,
          visibility: "hidden",
        });
    } else {
      let viewCloseTl = gsap.timeline();
      viewCloseTl
        .to("#" + targetId + "Layer", {
          opacity: 0,
        })
        .set("#" + targetId + "Layer .layerContainer", {
          left: 0,
        })
        .set("#" + targetId + "Layer .layerWrap", {
          transform: "translate(100%, 0)",
        })
        .set("#" + targetId + "Layer", {
          visibility: "hidden",
        })
        .set("#" + targetId + "Layer .layerProgress .proceeding", {
          width: "0%",
        });
    }
  };

  const viewAllClick = function (e) {
    e.preventDefault();

    layerView = true;

    targetId = e.currentTarget.getAttribute("data-item");
    $(".viewCursor").css("display", "none");

    if ($("#" + targetId + "Layer").hasClass("deTextPopup")) {
      gsap.set("#" + targetId + "Layer", {
        visibility: "hidden",
      });
      gsap.set("#" + targetId + "Layer .layerWrap .layerTextBtnBox", {
        opacity: "0",
        transform: "translateX(50px)",
      });
      gsap.set("#" + targetId + "Layer .layerWrap .layerTextBox p", {
        opacity: "0",
        transform: "translateX(50px)",
      });
      gsap.set("#" + targetId + "Layer .layerWrap .layerTextBox b", {
        opacity: "0",
        transform: "translateX(50px)",
      });
      gsap.set("#" + targetId + "Layer .layerWrap .layerHead", {
        transform: "translateY(-100%)",
        opacity: "0",
      });
      gsap.set("#" + targetId + "Layer .layerWrap", {
        opacity: "0",
        visibility: "hidden",
        x: 0,
      });

      const show = gsap.timeline();
      show
        .to("#" + targetId + "Layer", {
          opacity: "1",
          visibility: "visible",
        })
        .to(
          "#" + targetId + "Layer .layerWrap",
          {
            opacity: "1",
            visibility: "visible",
          },
          "-=0.5"
        )
        .to("#" + targetId + "Layer .layerWrap .layerHead", {
          transform: "translateY(0)",
          opacity: 1,
        })
        .to(
          "#" + targetId + "Layer .layerWrap .layerTextBox b",
          {
            transform: "translateX(0)",
            opacity: 1,
          },
          "-=0.3"
        )
        .to(
          "#" + targetId + "Layer .layerWrap .layerTextBox p",
          {
            transform: "translateX(0)",
            opacity: 1,
          },
          "-=0.3"
        )
        .to(
          "#" + targetId + "Layer .layerWrap .layerTextBtnBox",
          {
            transform: "translateX(0)",
            opacity: 1,
          },
          "-=0.3"
        );
    } else {
      let closeTargetName = document.querySelector("#" + targetId + "Layer .layerContainer");
      let closeImg = closeTargetName.parentNode.querySelector(".layerClose");
      // const imgW = $("#" + targetId + "Layer .layerImgBox img").width();
      // $("#" + targetId + "Layer .layerImgArea").css("width", imgW + "px");
      $("#" + targetId + "Layer .layerBtnBox").show();
      $("#" + targetId + "Layer .layerHeadText p:eq(0)").show();
      $("#" + targetId + "Layer .layerHeadText span").show();
      document.querySelector("#" + targetId + "Layer .layerContainer").style.left = "0";

      gsap.set("#" + targetId + "Layer .layerProgress .proceeding", {
        width: "0%",
      });

      const viewClickTl = gsap.timeline();
      viewClickTl
        .to("#" + targetId + "Layer", {
          opacity: "1",
          visibility: "visible",
        })
        .to(
          "#" + targetId + "Layer .layerWrap",
          {
            transform: "translate(0, 0)",
          },
          "-=0.5"
        )
        .from("#" + targetId + "Layer .layerImgBox", {
          top: "50%",
          left: "0",
          transform: "translate(-75%, -50%) scale(0.5)",
          duration: 0.5,
          opacity: 0,
          ease: false,
        })
        .from(
          "#" + targetId + "Layer .layerHead",
          {
            transform: "translate(0, -120px)",
          },
          "-=0.4"
        )
        .from(
          "#" + targetId + "Layer .layerProgress",
          {
            opacity: "0",
          },
          "-=0.3"
        )
        .from(
          "#" + targetId + "Layer .layerMainSubTitle",
          {
            opacity: "0",
            transform: "translate(50px, 0)",
          },
          "-=0.5"
        )
        .from(
          "#" + targetId + "Layer .layerMainTitle",
          {
            opacity: "0",
            transform: "translate(50px, 0)",
          },
          "-=0.3"
        )
        .from(
          "#" + targetId + "Layer .layerMainDesc",
          {
            opacity: "0",
            transform: "translate(50px, 0)",
          },
          "-=0.5"
        )
        .from(
          "#" + targetId + "Layer .layerGrid",
          {
            opacity: "0",
            transform: "translate(50px, 0)",
          },
          "-=0.3"
        );

      // close bg change
      if (Number(closeTargetName.style.left.replace(/px/gi, "")) < -(closeTargetName.querySelector(".layerMain").clientWidth + closeTargetName.querySelector(".layerImgArea").clientWidth - window.innerWidth)) {
        closeImg.classList.add("on");
      } else {
        closeImg.classList.remove("on");
      }

      let preWidth = 0;
      let preTotalWidth = 0;

      $("#" + targetId + "Layer .columns").each((index, element) => {
        if (index > 0) {
          $(element).css("left", `${preTotalWidth - preWidth}px`);
        }
        preTotalWidth += Math.ceil($(element).find("p").height() / $(element).height()) * ($(element).width() + Number($(element).css("column-gap").replace(/px/gi, "")));
        preWidth += $(element).width() + Number($(element).css("column-gap").replace(/px/gi, ""));
      });

      $("#" + targetId + "Layer .layerGrid").css("width", preTotalWidth + 50 + "px");
    }

    let nextBackGroundNumber = Number($("#" + targetId + "Layer").attr("data-index-number")) + 1;
  };

  // next btn click
  let canNextClick = true;
  const viewNext = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!canNextClick) return false;

    canNextClick = false;
    let target = e.currentTarget;
    let parents = $(target).closest(".layerPopup");
    let nextItem = parents.next().attr("data-item");
    let nextTarget = parents.next();
    let bgNumber = parents.next().attr("data-index-number");

    if (nextTarget.hasClass("deTextPopup")) {
      layerView = false;

      gsap.set(nextTarget, {
        opacity: 1,
        visibility: "visible",
        x: "100%",
      });

      gsap.set(nextTarget.find(".layerWrap .layerTextBtnBox"), {
        opacity: "0",
        transform: "translateX(50px)",
      });
      gsap.set(nextTarget.find(".layerWrap .layerTextBox p"), {
        opacity: "0",
        transform: "translateX(50px)",
      });
      gsap.set(nextTarget.find(".layerWrap .layerTextBox b"), {
        opacity: "0",
        transform: "translateX(50px)",
      });
      gsap.set(nextTarget.find(".layerWrap .layerHead"), {
        transform: "translateY(-100%)",
        opacity: "0",
      });
      gsap.set(nextTarget.find(".layerWrap"), {
        opacity: "1",
        visibility: "visible",
        x: "0",
      });

      targetId = nextItem;

      const nextTl = gsap.timeline();
      nextTl.to(parents, {
          x: "-100%",
          duration: 0.5,
        }).to(
          ".detailBg",
          {
            left: "-50%",
            duration: 3,
          },
          "-=2"
        ).to(
          nextTarget,
          {
            x: "0",
          },
          "-=1.2"
        ).set(
          parents.find(".layerContainer"),
          {
            opacity: 1,
          },
          "-=0.5"
        ).to(
          $(nextTarget).find(".layerHead"),
          {
            transform: "translateY(0)",
            opacity: 1,
          },
          "-=0.8"
        ).to(
          $(nextTarget).find(".layerTextBox b"),
          {
            transform: "translateX(0)",
            opacity: 1,
          },
          "-=0.6"
        ).to(
          $(nextTarget).find(".layerTextBox p"),
          {
            transform: "translateX(0)",
            opacity: 1,
          },
          "-=0.6"
        ).to(
          $(nextTarget).find(".layerTextBtnBox"),
          {
            transform: "translateX(0)",
            opacity: 1,
          },
          "-=0.6"
        ).set(
          parents,
          {
            x: "0",
            opacity: 0,
            visibility: "hidden",
          },
          "-=0.5"
        )
        .set(
          parents.find(".layerWrap"),
          {
            x: "100%",
          },
          "-=0.5"
        ).set(
          $(".detailBg"),
          {
            left: "100%",
          }
        );
    } else {
      if (bgNumber == undefined) {
        bgNumber = 31;
        layerView = false;
        targetId = "enjoy";

        gsap.set($("#" + targetId + "Layer"), {
          opacity: 1,
          visibility: "visible",
          x: "100%",
        });
        gsap.set("#" + targetId + "Layer .layerWrap .layerTextBtnBox", {
          opacity: "0",
          transform: "translateX(50px)",
        });
        gsap.set("#" + targetId + "Layer .layerWrap .layerTextBox p", {
          opacity: "0",
          transform: "translateX(50px)",
        });
        gsap.set("#" + targetId + "Layer .layerWrap .layerTextBox b", {
          opacity: "0",
          transform: "translateX(50px)",
        });
        gsap.set("#" + targetId + "Layer .layerWrap .layerHead", {
          transform: "translateY(-100%)",
          opacity: "0",
        });
        gsap.set("#" + targetId + "Layer .layerWrap", {
          opacity: "1",
          visibility: "visible",
          x: "0",
        });

        const nextTl = gsap.timeline();
        nextTl
          .to(parents, {
            x: "-100%",
            duration: 0.5,
          })
          .to(
            ".detailBg",
            {
              left: "-50%",
              duration: 3,
            },
            "-=2"
          )
          .to(
            $("#" + targetId + "Layer"),
            {
              x: "0",
            },
            "-=1.2"
          ).to(
            $("#" + targetId + "Layer .layerHead"),
            {
              transform: "translateY(0)",
              opacity: 1,
            },
            "-=0.8"
          )
          .to(
            $("#" + targetId + "Layer .layerTextBox b"),
            {
              transform: "translateX(0)",
              opacity: 1,
            },
            "-=0.6"
          )
          .to(
            $("#" + targetId + "Layer .layerTextBox p"),
            {
              transform: "translateX(0)",
              opacity: 1,
            },
            "-=0.6"
          )
          .to(
            $("#" + targetId + "Layer .layerTextBtnBox"),
            {
              transform: "translateX(0)",
              opacity: 1,
            },
            "-=0.6"
          )
          .set(parents, {
            x: "0",
            opacity: 0,
            visibility: "hidden",
          })
          .set(parents.find(".layerWrap"), {
            x: "100%",
          })
          .set(parents.find(".layerContainer"), {
            left: 0,
          })
          .set(".detailBg", {
            left: "100%",
          });
      } else {
        layerView = true;

        targetId = nextItem;

        const nextTl = gsap.timeline();
        let closeTargetName = document.querySelector("#" + targetId + "Layer .layerContainer");
        let closeImg = closeTargetName.parentNode.querySelector(".layerClose");
        document.querySelector("#" + targetId + "Layer .layerContainer").style.left = "0";
        $("#" + targetId + "Layer .layerBtnBox").show();
        $("#" + targetId + "Layer .layerHeadText p:eq(0)").show();
        $("#" + targetId + "Layer .layerHeadText span").show();

        // close bg change
        if (Number(closeTargetName.style.left.replace(/px/gi, "")) < -(closeTargetName.querySelector(".layerMain").clientWidth + closeTargetName.querySelector(".layerImgArea").clientWidth - window.innerWidth)) {
          closeImg.classList.add("on");
        } else {
          closeImg.classList.remove("on");
        }

        gsap.set(nextTarget, {
          opacity: 1,
          visibility: "visible",
        });

        nextTl
          .to(parents, {
            x: "-100%",
            duration: 0.5,
          })
          .to(
            ".detailBg",
            {
              left: "-50%",
              duration: 3,
            },
            "-=2"
          )
          .to(
            $(nextTarget).find(".layerWrap"),
            {
              x: 0,
            },
            "-=1.2"
          ).from(
            $(nextTarget).find(".layerImgBox"),
            {
              opacity: "0",
              transform: "translate(50px, 0)",
            },
            "-=0.8"
          )
          .from(
            $(nextTarget).find(".layerHead"),
            {
              transform: "translate(0, -120px)",
            },
            "-=0.8"
          )
          .from(
            $(nextTarget).find(".layerProgress"),
            {
              opacity: "0",
            },
            "-=0.7"
          )
          .from(
            $(nextTarget).find(".layerMainSubTitle"),
            {
              opacity: "0",
              transform: "translate(50px, 0)",
            },
            "-=0.7"
          )
          .from(
            $(nextTarget).find(".layerMainTitle"),
            {
              opacity: "0",
              transform: "translate(50px, 0)",
            },
            "-=0.6"
          )
          .from(
            $(nextTarget).find(".layerMainDesc"),
            {
              opacity: "0",
              transform: "translate(50px, 0)",
            },
            "-=0.6"
          )
          .from(
            "#" + targetId + "Layer .layerGrid",
            {
              opacity: "0",
              transform: "translate(50px, 0)",
            },
            "-=0.6"
          )
          .from(
            "#" + targetId + "Layer .layerBtnBox",
            {
              opacity: "0",
              transform: "translate(50px, 0)",
            },
            "-=0.6"
          )
          .set(parents, {
            x: "0",
            opacity: 0,
            visibility: "hidden",
          })
          .set(parents.find(".layerContainer"), {
            left: 0,
          })
          .set(parents.find(".layerWrap"), {
            x: "100%",
          })
          .set(".detailBg", {
            left: "100%",
          });
      }
    }

    clearTimeout(window.nextClickTimeout);
    window.nextClickTimeout = setTimeout(() => {
      canNextClick = true;
    }, 2000);

    preWidth = 0;
    preTotalWidth = 0;
    $("#" + targetId + "Layer .columns").each((index, element) => {
      if (index > 0) {
        $(element).css("left", `${preTotalWidth - preWidth}px`);
      }
      preTotalWidth += Math.ceil($(element).find("p").height() / $(element).height()) * ($(element).width() + Number($(element).css("column-gap").replace(/px/gi, "")));
      preWidth += $(element).width() + Number($(element).css("column-gap").replace(/px/gi, ""));
    });

    $("#" + targetId + "Layer .layerGrid").css("width", preTotalWidth + 50 + "px");

    // paging 이동 및 리스트 이동
    if (bgNumber - 1 == 30) {
      $(".viewAllList > div").removeClass("active");
      $(".viewAllList > div").eq(0).addClass("active");

      $(".viewPagingBtn a").removeClass("active");
      $(".viewPagingBtn a").eq(0).addClass("active");

      $(".viewAllList").animate(
        {
          left: -(Number(viewArr[0]) - viewPaddingLeft),
        },
        300
      );

      nowViewProduct = 0;
      if (nowViewProduct > 0) {
        $(".viewScroll").css("opacity", 0);
      } else {
        $(".viewScroll").css("opacity", 1);
      }
    } else {
      $(".viewAllList > div").removeClass("active");
      $(".viewAllList > div")
        .eq(bgNumber - 1)
        .addClass("active");

      $(".viewPagingBtn a").removeClass("active");
      $(".viewPagingBtn a")
        .eq(bgNumber - 1)
        .addClass("active");

      $(".viewAllList").animate(
        {
          left: -(Number(viewArr[bgNumber - 1]) - viewPaddingLeft),
        },
        300
      );

      nowViewProduct = bgNumber - 1;

      if (nowViewProduct > 0) {
        $(".viewScroll").css("opacity", 0);
      } else {
        $(".viewScroll").css("opacity", 1);
      }
    }
  };
  // next btn click

  $(document).on("click", ".viewAllList > div.active > div", function (e) {
    viewAllClick(e);
  });

  $(document).on("click", ".viewAllList > div.active + div > div", function (e) {
    viewWheelEvent(e, "1");
  });

  $(document).on("click", ".viewAllList > div.viewAllItem:not('.active'):not(div.viewAllItem.active + div) > div", function (e) {
    viewWheelEvent(e, "2");
  });

  const viewNextBtn = document.querySelectorAll(".layerBtn");
  viewNextBtn.forEach(function (elem) {
    elem.addEventListener("click", (e) => viewNext(e));
  });

  const popupShowEvent = document.querySelectorAll(".popupShow");
  popupShowEvent.forEach(function (elem) {
    elem.addEventListener("click", (e) => viewClick(e));
  });

  // layerPopup event
  const popupClose = document.querySelectorAll(".layerClose");
  popupClose.forEach(function (elem) {
    elem.addEventListener("click", (e) => viewClose(e));
  });
  // layerPopup event

  // all view
  $(".allViewBtn").on("mouseenter", function () {
    $(".allText").css({
      "animation-play-state": "paused",
    });
  });
  $(".allViewBtn").on("mouseleave", function () {
    $(".allText").css({
      "animation-play-state": "running",
    });
  });

  // culture
  const sections = gsap.utils.toArray(".culCont");
  let maxWidth = 0;

  const getMaxWidth = () => {
    maxWidth = 0;
    sections.forEach((div) => {
      maxWidth += div.offsetWidth;
    });
  };

  getMaxWidth();
  ScrollTrigger.addEventListener("refreshInit", getMaxWidth);

  let scrollLeft = 0;

  gsap.to(sections, {
    x: () => `-${maxWidth - window.innerWidth}`,
    ease: "none",
    scrollTrigger: {
      trigger: ".culArea",
      pin: true,
      scrub: true,
      start: "top top",
      end: () => `+=${maxWidth}`,
      invalidateOnRefresh: true,
      onUpdate: function () {
        const nullF = document.querySelector(".nullF").clientWidth;
        const scrollWidth = maxWidth;
        scrollLeft = document.querySelector(".culCont").style.transform.replace(/.*\(/gi, "").split("px,")[0];
        const progressWidth = ((Math.abs(scrollLeft) - nullF) / Number(scrollWidth - (nullF + nullF + nullF))) * 100;

        $(".progressbar span").css({
          width: progressWidth + "%",
        });
      },
    },
  });

  // culture 순차적으로 등장
  gsap.from(sections[1].querySelector(".culTitle"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top -=" + sections[0].clientWidth * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[1].querySelector(".culTitle").clientWidth,
      scrub: 2,
    },
    transform: "translateX(100px)",
  });

  gsap.from(sections[1].querySelector(".culImg"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + sections[1].querySelector(".culTitle").clientWidth * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[1].querySelector(".culImg").clientWidth,
      scrub: 2,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[1].querySelector(".positionText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].querySelector(".culTitle").clientWidth + sections[1].querySelector(".culImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[1].querySelector(".culInfo").clientWidth,
      scrub: 1,
    },
    // opacity: 0,
    transform: "translateX(100px)",
  });

  gsap.from(sections[1].querySelector(".culText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].querySelector(".culTitle").clientWidth + sections[1].querySelector(".culImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[1].querySelector(".culInfo").clientWidth,
      scrub: 1,
    },
    // opacity: 0,
    transform: "translateX(200px)",
  });

  gsap.from(sections[2].querySelector(".talkImg"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + sections[1].clientWidth * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[2].querySelector(".talkImg").clientWidth,
      scrub: 2,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[2].querySelector(".talkPosition"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].querySelector(".talkImg").clientWidth / 1.5) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[2].querySelector(".talkImg").clientWidth,
      scrub: 1,
    },
    transform: "translateX(100px)",
  });

  gsap.from(sections[2].querySelector(".talkText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].querySelector(".talkImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[2].querySelector(".talkImg").clientWidth,
      scrub: 1,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[3].querySelector(".playPosition"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[3].querySelector(".playPosition").clientWidth,
      scrub: 1,
    },
    transform: "translateX(100px)",
  });

  gsap.from(sections[3].querySelector(".playText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].querySelector(".playPosition").clientWidth / 2) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[3].querySelector(".playText").clientWidth,
      scrub: 1,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[3].querySelector(".palyImg"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].querySelector(".playText").clientWidth + sections[3].querySelector(".palyImg").clientWidth / 2) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[3].querySelector(".palyImg").clientWidth,
      scrub: 2,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[4].querySelector(".castImg"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[4].querySelector(".castImg").clientWidth,
      scrub: 2,
    },
    transform: "translate(200px, -50%)",
  });

  gsap.from(sections[4].querySelector(".castPosition"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].querySelector(".castImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[4].querySelector(".castPosition").clientWidth,
      scrub: 1,
    },
    transform: "translate(200px, -50%)",
  });

  gsap.from(sections[4].querySelector(".castText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].querySelector(".castImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[4].querySelector(".castText").clientWidth,
      scrub: 1,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[5].querySelector(".ideaImg"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[5].querySelector(".ideaImg").clientWidth,
      scrub: 2,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[5].querySelector(".ideaPosition"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () =>
        "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].clientWidth + sections[5].querySelector(".ideaImg").clientWidth / 1.1) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[5].querySelector(".ideaPosition").clientWidth,
      scrub: 1,
    },
    transform: "translateX(100px)",
  });

  gsap.from(sections[5].querySelector(".ideaText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].clientWidth + sections[5].querySelector(".ideaImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[5].querySelector(".ideaText").clientWidth,
      scrub: 1,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[6].querySelector(".ideaPrjImg"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].clientWidth + sections[5].clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[6].querySelector(".ideaPrjImg").clientWidth,
      scrub: 2,
    },
    transform: "translateX(200px)",
  });

  gsap.from(sections[6].querySelector(".ideaPrjPosition"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () =>
        "top top-=" +
        (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].clientWidth + sections[5].clientWidth + sections[6].querySelector(".ideaPrjImg").clientWidth / 1.75) *
        (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[6].querySelector(".ideaPrjPosition").clientWidth,
      scrub: 1,
    },
    transform: "translateX(100px)",
  });

  gsap.from(sections[6].querySelector(".ideaPrjText"), {
    scrollTrigger: {
      trigger: "#culture",
      start: () =>
        "top top-=" +
        (sections[1].clientWidth + sections[2].clientWidth + sections[3].clientWidth + sections[4].clientWidth + sections[5].clientWidth + sections[6].querySelector(".ideaPrjImg").clientWidth) * (maxWidth / (maxWidth - window.innerWidth)),
      end: () => "+=" + sections[6].querySelector(".ideaPrjText").clientWidth,
      scrub: 1,
    },
    transform: "translateX(200px)",
  });

  gsap.to(".progressbar", {
    scrollTrigger: {
      trigger: "#culture",
      start: () => "top top-=" + (document.querySelector(".nullF").offsetLeft + document.querySelector(".nullF").clientWidth + document.querySelector(".progressbar").clientWidth),
      end: () => "top top-=" + (document.querySelector(".nullF").offsetLeft + document.querySelector(".nullF").clientWidth + document.querySelector(".progressbar").clientWidth),
      scrub: 1,
      invalidateOnRefresh: true,
    },
    opacity: 1,
    visibility: "visible",
  });

  // culture

  // greeting
  gsap.from("#greeting", {
    scrollTrigger: {
      trigger: ".grtArea",
      start: $(".grtArea").css("padding-top") + " top",
      end: $(".grtArea").css("padding-top") + " top",
      scrub: true,
    },
    opacity: 0,
    zIndex: -1,
  });

  gsap.from(".grtItem a b", {
    scrollTrigger: {
      trigger: ".grtArea",
      start: $(".grtArea").css("padding-top") + " top",
      end: "+=100px top",
      scrub: 1.5,
    },
    transform: "translateY(100%)",
  });

  gsap.from(".grtCont", {
    scrollTrigger: {
      trigger: ".grtArea",
      start: $(".grtArea").css("padding-top") + " top",
      end: "+=100px top",
      scrub: 1.5,
    },
    transform: "translateY(5%)",
  });

  const grtH = $(".grtCont").height();
  $(".grtNameList").css({
    height: grtH + "px",
  });

  $(window).resize(function () {
    const re_grtH = $(".grtCont").height();
    $(".grtNameList").css({
      height: re_grtH + "px",
    });
  });

  $(".grtItem a").click(function () {
    const thisAttr = $(this).attr("data-item");
    const thisOffset = $(thisAttr).offset().top + 2;

    $(".grtItem a").parent().removeClass("active");
    $(this).parent().addClass("active");

    $("html, body").animate(
      {
        scrollTop: thisOffset,
      },
      300
    );
  });

  gsap.to("#greeting", {
    scrollTrigger: {
      trigger: ".grtArea",
      start: $(".grtArea").css("padding-top") + " top",
      end: $(".grtArea").css("padding-top") + " top",
      onEnter: function () {
        headerColorChange("black", "white");
      },
      onEnterBack: function () {
        headerColorChange("", "black");
      },
    },
  });

  gsap.to("#endGrt", {
    scrollTrigger: {
      trigger: ".endGrt",
      start: "top top",
      end: "top top",
      onEnter: function () {
        headerColorChange("", "black");
      },
      onEnterBack: function () {
        headerColorChange("black", "white");
      },
    },
  });

  // 북클로즈 시퀀스
  const bookCloseSq = document.querySelector("#endBook");
  const bookCloseContext = bookCloseSq.getContext("2d");

  handleMultiSequence(bookCloseImages, closeSqCount, "end", "bookclose", true, `${currentLang === 'ko' ? 'jpg' : 'png'}`);

  bookCloseSq.width = 1920;
  bookCloseSq.height = 1080;

  gsap.to(bookClose, {
    frame: closeSqCount - 1,
    snap: "frame",
    scrollTrigger: {
      trigger: ".endSequence",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
    onUpdate: bookCloseRender,
  });

  bookCloseImages[0].onload = bookCloseRender;

  function bookCloseRender() {
    bookCloseContext.clearRect(0, 0, bookCloseSq.width, bookCloseSq.height);
    bookCloseContext.drawImage(bookCloseImages[bookClose.frame], 0, 0, bookCloseImages[bookClose.frame].width, bookCloseImages[bookClose.frame].height, 0, 0, bookCloseSq.width, bookCloseSq.height);
  }
  // 북클로즈 시퀀스

  if($("body").hasClass("enBody")){
    // EN Epilogue    
    gsap.to(".epilogue", {
      scrollTrigger: {
        trigger: ".endSequence",
        start: "top top",
        end: "top top",
        scrub: true,
        onEnter: function(){
          headerColorChange("", "black");
        },
        onEnterBack: function(){
          headerColorChange("black", "white");
        }
      },
      opacity: 1,
      visibility: "visible"
    })
    gsap.from(".epilogueBox", {
      scrollTrigger: {
        trigger: ".endSequence",
        start: "5% top",
        end: "80% bottom",
        scrub: 1,
      },
      left: "-20%",
      opacity: 0,
    }, "-=0.5");
    // EN Epilogue
  }

  if($("body").hasClass("jpBody")){
    // EN Epilogue    
    gsap.to(".epilogue", {
      scrollTrigger: {
        trigger: ".endSequence",
        start: "top top",
        end: "top top",
        scrub: true,
        onEnter: function(){
          headerColorChange("", "black");
        },
        onEnterBack: function(){
          headerColorChange("black", "white");
        }
      },
      opacity: 1,
      visibility: "visible"
    })
    gsap.from(".epilogueBox", {
      scrollTrigger: {
        trigger: ".endSequence",
        start: "5% top",
        end: "80% bottom",
        scrub: 1,
      },
      left: "-20%",
      opacity: 0,
    }, "-=0.5");
    // EN Epilogue
  }

  gsap.to(".endSq", {
    scrollTrigger: {
      trigger: "#event",
      start: "top top",
      end: "top top",
      scrub: 0.3,
    },
    opacity: 1,
    visibility: "visible"
  });

  gsap.to(".eventCont ", {
    scrollTrigger: {
      trigger: ".eventCont",
      start: "top bottom",
      end: "top bottom",
      scrub: 0.5,
    },
    opacity: 1,
    visibility: "visible",
  });

  gsap.to(".messageCont ", {
    scrollTrigger: {
      trigger: ".eventCont",
      start: "top 60%",
      end: "top 10%",
      scrub: 0.5,
    },
    opacity: 1,
    transform: "translateY(0)",
  });

  gsap.to(".messagesBtn .backImg ", {
    scrollTrigger: {
      trigger: ".eventCont",
      start: "10% 60%",
      end: "top 10%",
      scrub: 0.5,
    },
    height: $(".messagesBtn .backImg").height() * 2,
  });

  gsap.to(".messagesBtn .applyTxt span", {
    scrollTrigger: {
      trigger: ".eventCont",
      start: "10% 60%",
      end: "top 10%",
      scrub: 0.5,
    },
    rotation: "360deg",
  });

  gsap.to(".messageTextBox", {
    scrollTrigger: {
      trigger: ".endSequence",
      start: "85% bottom",
      end: "95% bottom",
      scrub: true,
    },
    opacity: 1,
    visibility: "visible",
  });

  gsap.to("#footer", {
    scrollTrigger: {
      trigger: "#event",
      start: "85% bottom",
      end: "95% bottom",
      scrub: 0.5,
    },
    transform: "translateY(0)",
    opacity: 1,
    visibility: "visible",
  });

  // event
  // 코멘트 배열
  // let totalWidth = 0;
  // let eventWords = gsap.utils.toArray(".messageItems .msgItem");

  // 이벤트 메시지 슬라이드
  // setTimeout(messageAutoScroll, 500);

  gsap.set("#progressEnd", {
    opacity: 0,
  });

  // 새로고침 리로드 방지
  if (location.href.includes("#")) {
    location.href = `#${location.href.split("#")[1]}`;
  }

  $(".messageProgress").on("mouseenter", function () {
    $("#progressEnd").css({
      opacity: 1,
      transition: "opacity 0.3s",
    });
  });

  $(".messageProgress").on("mouseleave", function () {
    $("#progressEnd").css({
      opacity: 0,
      transition: "opacity 0.3s",
    });
  });

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 카운팅 수
  //  totalEventCount = messageList.filter(d => d.lang.replace(/ko/gi,'kr') == userLang).length;

  $(".messageProgress").on("click", function (e) {
    $("body").css("overflow", "hidden");
    $(".eventPopupInner").animate(
      {
        scrollTop: 0,
      },
      0
    );

    const msgShowTl = gsap.timeline();

    msgShowTl
      .to("#eventPopup", {
        opacity: 1,
        visibility: "visible",
      })
      .to(
        ".eventPopupArea",
        {
          right: 0,
        },
        "-=0.5"
      )
      .to(".msgNumText .msgCount", {
        opacity: 1,
        visibility: "visible",
        textContent: totalEventCount,
        ease: "power1.in",
        snap: { textContent: 1 },
        stagger: {
          each: 1.0,
          onUpdate: function () {
            this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
          },
        },
      })
      .to(".msgNumText > b", {
        opacity: 1,
        visibility: "visible",
        transform: "translateY(0)",
      })
      .to(
        ".eventPopupMsgNum",
        {
          top: "9rem",
          transform: "translateY(0)",
        },
        "+=0.5"
      )
      .to(
        ".msgNumText .msgCount",
        {
          fontSize: "8rem",
        },
        "-=0.5"
      )
      .to(
        ".eventPopupInner",
        {
          opacity: 1,
          visibility: "visible",
          transform: "translateY(0)",
        },
        "-=0.2"
      )
      .to(
        ".eventProgress",
        {
          top: "0",
        },
        "-=0.8"
      )
      .to(
        ".eventProgress .proAniBar",
        {
          top: "-100%",
          duration: 1,
        },
        "-=0.5"
      );

    const clickTargetT = $(".eventPopupInner").scrollTop();
    let clickboxTotHeight = 0;
    $(".eventPopupBox").each((index, element) => {
      clickboxTotHeight += $(element).height() + Number($(element).css("margin-top").replace(/px/gi, ""));
    });

    let clickmsgH = $(".eventPopupInner").height();
    let clickpercent = (clickTargetT / (clickboxTotHeight - clickmsgH)) * 100;

    $(".eventProgress span").css("height", `${clickpercent}%`);
  });

  $(".eventCloseBtn").on("click", function (e) {
    $("body").css("overflow", "auto");

    gsap.to(".eventPopupArea", {
      right: "-100%",
    });

    gsap
      .to("#eventPopup", {
        opacity: 0,
      })
      .then(function () {
        gsap.set("#eventPopup", {
          visibility: "hidden",
        });

        gsap.set(".msgNumText .msgCount", {
          opacity: 0,
          visibility: "hidden",
          textContent: 0,
        });

        gsap.set(".msgNumText > b", {
          opacity: 0,
          visibility: "hidden",
          transform: "translateY(20px)",
        });

        gsap.set(".eventPopupMsgNum", {
          top: "calc(50% - 3.4rem)",
          left: "0",
          transform: "translateY(-50%)",
        });

        gsap.set(".msgNumText .msgCount", {
          fontSize: "18rem",
        });

        gsap.set(".eventPopupInner", {
          opacity: 0,
          visibility: "hidden",
          transform: "translateY(50px)",
        });

        gsap.set(".eventProgress", {
          top: "100%",
        });

        gsap.set(".eventProgress .proAniBar", {
          top: "0",
        });
      });
  });

  $(".eventPopupInner").on("scroll", function (e) {
    const targetT = e.currentTarget.scrollTop;
    let boxTotHeight = 0;
    $(".eventPopupBox").each((index, element) => {
      // boxTotHeight += $(element).height() + Number($(element).css("margin-top").replace(/px/gi, ""));
      boxTotHeight += $(element).height() + parseFloat($(element).css("margin-bottom"));
    });

    let msgH = e.currentTarget.offsetHeight;
    let percent = (targetT / (boxTotHeight - msgH)) * 100;

    $(".eventProgress span").css("height", `${percent}%`);
    if (percent > messageAddPercent) {
      //
      handleAllMessages();
    }
  });
});
