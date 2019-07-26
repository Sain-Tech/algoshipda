var ALG = {};

const colorset = [
    0xf4511e,
    0xfb8c00,
    0xffb300,
    0xfdd835,
    0xc0ca33,
    0x7cb342,
    0x43a047,
    0x00897b,
    0x00acc1,
    0x039be5,
    0x1e88e5,
    0x3949ab,
    0x5e35b1,
    0x8e24aa,
    0xd81b60,
    0xe53935
];

const initSim = {
    type: "WebGL",
    test: () => {
        if (!PIXI.utils.isWebGLSupported()) initSim.type = "canvas";
        PIXI.utils.sayHello(initSim.type);
    },
    load: (rc, fcompleted) => {
        var setup = () => console.log("Loading resources complete!");
        PIXI.loader.add(rc).load(fcompleted);
    },
    make: opt => new PIXI.Application(opt),
    set: app => {
        app.renderer.backgroundColor = 0xffffff;
        app.renderer.autoResize = true;
    },
    append: (elm, obj) => document.querySelector(elm).appendChild(obj.view)
}

const simSprite = {
    txture: e => PIXI.loader.resources[e].texture,
    sprite: txture => new PIXI.Sprite(txture),
    lSprite: e => new PIXI.Sprite(PIXI.loader.resources[e].texture),
    addStage: (app, sprite) => app.stage.addChild(sprite),
    removeStage: (app, sprite) => app.stage.removeChild(sprite),
    removeAnddestroy: (app, sprite) => {
        app.stage.removeChild(sprite);
        sprite.destroy();
    }
}

const addSimCtrler = (fs) => {
    var controller = `<div>
        <button id="ctrl_play" type="button">재생</button>
        <button id="ctrl_rewind" type="button">되감기</button>
        <button id="ctrl_prev" type="button">이전</button>
        <button id="ctrl_next" type="button">다음</button>
    </div>`;
    $(".simcont").append(controller);

    $("#ctrl_play").click(() => {
        fs.play(1000);
    });
    $("#ctrl_rewind").click(fs.rewind);
    $("#ctrl_prev").click(fs.prev);
    $("#ctrl_next").click(fs.next);
}

const shuffleRandom = n => {
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
}

const execAlgorithms = (js, args) => {
    var w;
    if(window.Worker){
            w = new Worker(js);
            w.postMessage(args)
            w.onmessage = function(e) {
                //alert(e.data);
                console.log(e.data);
                w.terminate();
                w = undefined;
                ALG[args.name].steps = e.data;
            };
    }
    else{
        alert('Web worker를 지원하지 않는 브라우저 입니다!');
    }
}

// Setup the animation loop.
const animate = t => {
    requestAnimationFrame(animate);
    TWEEN.update(t);
}
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
    if(!glResz) {
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
window.onresize = function(event) {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 100);
    //resize();
};

function doneResizing(){
    //whatever we want to do
    setTimeout(function () {
    }, 50);
}