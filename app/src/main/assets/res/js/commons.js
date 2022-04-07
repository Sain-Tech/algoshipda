// 시뮬레이터 전용 전역변수
var ALG = {};
// 시뮬 컨트롤러
var Ctrler;
// 컨트롤러 프로그래스 바
var StepProgs;

// 컬러 셋 모음
const colorset = [
  0xf4511e, 0xfb8c00, 0xffb300, 0xfdd835, 0xc0ca33, 0x7cb342, 0x43a047,
  0x00897b, 0x00acc1, 0x039be5, 0x1e88e5, 0x3949ab, 0x5e35b1, 0x8e24aa,
  0xd81b60, 0xe53935,
];

// 시뮬레이터 컨테이너 초기화 함수들
const initSim = {
  // 그래픽 렌더링 모드 기본 타입
  type: "WebGL",

  // 픽시 정보 콘솔 띄우는 함수
  test: () => {
    // 기본 타입 WebGL을 지원하지 않을 경우 모드는 canvas
    if (!PIXI.utils.isWebGLSupported()) initSim.type = "canvas";
    //
    PIXI.utils.sayHello(initSim.type);
  },
  load: (rc, fcompleted) => {
    var setup = () => console.log("Loading resources complete!");
    PIXI.loader.add(rc).load(fcompleted);
  },
  make: (opt) => new PIXI.Application(opt),
  set: (app) => {
    app.renderer.backgroundColor = 0xffffff;
    app.renderer.autoResize = true;
  },
  append: (elm, obj) => document.querySelector(elm).appendChild(obj.view),
};

const simSprite = {
  txture: (e) => PIXI.loader.resources[e].texture,
  sprite: (txture) => new PIXI.Sprite(txture),
  lSprite: (e) => new PIXI.Sprite(PIXI.loader.resources[e].texture),
  addStage: (app, sprite) => app.stage.addChild(sprite),
  removeStage: (app, sprite) => app.stage.removeChild(sprite),
  removeAnddestroy: (app, sprite) => {
    app.stage.removeChild(sprite);
    sprite.destroy();
  },
};

const completeDestroyElems = (stage) => {
  while (1) {
    var elems = undefined;
    for (var i = 0; i < stage.children.length; i++) {
      console.log(stage.children[i]);
      if (stage.children[i] != undefined || stage.children[i] != null)
        elems = stage.children[i];
      stage.children[i].destroy();
    }
    if (elems === undefined || elems === null) break;
  }
  stage.removeChildren();
};

const addSimCtrler = (fs, totalSteps, headerElms) => {
  var upperCtrl = `
        <div id="ctrl_upper" class="ui inverted segment controller">
            <h3 class="ui header title" style="margin-right: auto; margin-bottom: 0">${ALG.currentTitle}</h3>
            ${headerElms}
        </div>
    `;

  var progress = `<div class="ui top attached tiny progress success" data-value="1" data-total="8" id="example5">
        <div class="bar">
            <div class="progress"></div>
        </div>
    </div>`;

  var lowerCtrl = `
        <div id="ctrl_lower" class="ui inverted segment controller">
            ${progress}
            <div style="display: flex">
                <div class="column">
                    <button id="ctrl_prev" class="ui inverted icon basic button ctrlel" type="button">
                        <i class="step backward arrow icon"></i>
                    </button>
                    <button id="ctrl_play" class="ui inverted icon basic button ctrlel" type="button">
                        <i class="play icon"></i>
                    </button>
                    <button id="ctrl_next" class="ui inverted icon basic button ctrlel" type="button">
                        <i class="step forward arrow icon"></i>
                    </button>
                    <button id="ctrl_rewind" class="ui inverted icon basic button ctrlel" type="button">
                        <i class="undo icon"></i>
                    </button>
                </div>

                <div class="column" style="margin-left: 10px; margin-right: auto">
                    <div class="label-progstep" style="margin-top: 8px">from / to</div>
                </div>

                <div class="column" style="margin-left: auto">
                    <div id="select_animtime" class="ui dropdown ctrlel">
                        <input type="hidden" name="animtime">
                        <i class="dropdown icon"></i>
                        <div class="default text">속도</div>
                        <div class="menu">
                            <div class="item" data-value="0">없음</div>
                            <div class="item" data-value="2000">느리게</div>
                            <div class="item" data-value="1000">보통</div>
                            <div class="item" data-value="500">빠르게</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

  $(".simcont").prepend(upperCtrl);
  $(".simcont").append(lowerCtrl);

  var animTime = 1000;

  $("#ctrl_play").click(() => {
    if ($("#ctrl_play > i").hasClass("play")) {
      fs.play(animTime);
    } else if ($("#ctrl_play > i").hasClass("pause")) {
      if (ALG[ALG.current].playing) $("#ctrl_play").addClass("disabled");
      $("#ctrl_play > i").removeClass("pause");
      $("#ctrl_play > i").addClass("play");
      $("#ctrl_play").addClass("ctrlel");
      fs.pause();
    }
  });
  $("#ctrl_rewind").click(() => {
    fs.reset(ALG[ALG.current].num);
  });
  $("#ctrl_prev").click(() => {
    fs.backward(animTime);
  });
  $("#ctrl_next").click(() => {
    fs.forward(animTime);
  });

  Ctrler = $(".controller");

  makeDropDown("#select_animtime", {
    onChange: function (value, text, $choice) {
      animTime = value;
    },
  });

  $(".ui.button").click(function () {
    $(".ui.button").blur();
  });

  $(".ui.progress")
    .progress({
      duration: 250,
      total: totalSteps,
      label: "none",
      onChange: function (percent, value, total) {
        $(".label-progstep").html(`${value} / ${total}`);
      },
    })
    .progress("reset");

  StepProgs = $(".ui.progress");
};

const makeDropDown = (
  elm,
  opt = {
    /**
     * @param transition  드롭다운 애니메이션 타입
     */
    transition: "scale",
    /**
     * @param value 선택 값
     * @param text 선택 메뉴 이름
     * @param $choice 선택 메뉴 jQuery 객체
     */
    onChange: (value, text, $choice) => {},
  }
) => {
  var menu = $(elm + " > .menu");
  if (opt.transition === undefined || opt.transition === null)
    opt.transition = "scale";
  menu.addClass("transition").addClass("hidden");

  $(document).click(function (e) {
    if (
      (e.target.parentElement === $(elm)[0] || e.target === $(elm)[0]) &&
      menu.hasClass("hidden") &&
      !menu.hasClass("animating")
    ) {
      menu.attr(
        "class",
        `menu transition visible animating ${opt.transition} in`
      );
      setTimeout(function () {
        menu.attr("class", "menu transition visible");
      }, 250);
    } else if (menu.hasClass("visible") && !menu.hasClass("animating")) {
      menu.attr(
        "class",
        `menu transition visible animating ${opt.transition} out`
      );
      setTimeout(function () {
        menu.attr("class", "menu transition hidden");
      }, 250);
    }
  });

  menu.click(function (e) {
    var value = parseInt(e.target.attributes["data-value"].value);
    var text = e.target.innerHTML;
    var $choice = $(e.target);

    $(menu).children().removeClass("active").removeClass("selected");
    $choice.addClass("active selected");
    $(elm + " > .default.text").html(text);

    opt.onChange(value, text, $choice);
  });
};

const shuffleRandom = (n) => {
  var ar = new Array();
  var temp;
  var rnum;

  //전달받은 매개변수 n만큼 배열 생성 ( 1~n )
  for (var i = 1; i <= n; i++) {
    ar.push(i);
  }

  //값을 서로 섞기
  for (var i = 0; i < ar.length; i++) {
    rnum = Math.floor(Math.random() * n); //난수발생
    temp = ar[i];
    ar[i] = ar[rnum];
    ar[rnum] = temp;
  }

  return ar;
};

const execAlgorithms = (js, args, callback) => {
  var w;
  if (window.Worker) {
    w = new Worker(js);
    w.postMessage(args);
    w.onmessage = function (e) {
      //alert(e.data);
      console.log(e.data);
      w.terminate();
      w = undefined;
      callback(e.data);
    };
  } else {
    alert("Web worker를 지원하지 않는 브라우저 입니다!");
  }
};

var isPlayingToggle = false;

// Setup the animation loop.
const animate = (t) => {
  requestAnimationFrame(animate);
  TWEEN.update(t);
  if (ALG[ALG.current] === undefined) return;
  if (!ALG[ALG.current].playing) {
    if (Ctrler != undefined && !isPlayingToggle) {
      isPlayingToggle = true;
      console.log("Controller is enabled.");
      //$('#ctrl_play').attr('disabled', true);
      $("#ctrl_play > i").removeClass("pause");
      $("#ctrl_play > i").addClass("play");
      $("#ctrl_play").addClass("ctrlel");
      Ctrler.find(".ctrlel").removeClass("disabled");
    }
  } else {
    if (Ctrler != undefined && isPlayingToggle) {
      isPlayingToggle = false;
      console.log("Controller is disabled.");
      $("#ctrl_play > i").removeClass("play");
      $("#ctrl_play > i").addClass("pause");
      $("#ctrl_play").removeClass("ctrlel");
      Ctrler.find(".ctrlel").addClass("disabled");
    }
  }
};
requestAnimationFrame(animate);

var glW, glH, glResz;
var reW, reH;
var resizeId;
glResz = false;

function resize() {
  var app = ALG[Object.keys(ALG)[0]].app;
  var appstage = app.stage;
  var appsize = [app.renderer.width, app.renderer.height];
  var appratio = appsize[0] / appsize[1];

  if (window.innerWidth / window.innerHeight >= appratio) {
    var w = (window.innerWidth - 48) * appratio;
    var h = window.innerHeight - 48;
  } else {
    var w = window.innerWidth - 48;
    var h = (window.innerWidth - 48) / appratio;
  }
  if (!glResz) {
    glResz = true;
    glW = w;
    glH = h;
  }
  //console.log(w/glW);
  app.view.style.width = w + "px";
  app.view.style.height = h + "px";
  reW = w;
  reH = h;
}
window.onresize = function (event) {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 100);
  //resize();
};

function doneResizing() {
  //whatever we want to do
  setTimeout(function () {}, 50);
}

(function () {
  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow =
      window.onpagehide =
      window.onfocus =
      window.onblur =
        onchange;

  function onchange(evt) {
    var v = "visible",
      h = "hidden",
      evtMap = {
        focus: v,
        focusin: v,
        pageshow: v,
        blur: h,
        focusout: h,
        pagehide: h,
      };

    evt = evt || window.event;
    if (evt.type in evtMap) document.body.className = evtMap[evt.type];
    else document.body.className = this[hidden] ? "hidden" : "visible";

    console.log(this[hidden]);

    if (this[hidden]) {
      ALG[ALG.current].pause();
    } else {
      Ctrler.attr("disabled", false);
    }
  }
})();
