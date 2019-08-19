const testfunc = function () {
    console.log("testtest");
}

const initsimHanoi = () => {
    var interval;
    var animEasing = TWEEN.Easing.Cubic.InOut;
    var playContinueousToggle = false;
    var pauseToggle = true;

    const sets = {
        destroy: app => {
            if (interval != null) {
                clearInterval(interval);
            }

            completeDestroyElems(app.stage);

            $('#ctrl_upper').detach();
            $('#ctrl_lower').detach();
            $(app.renderer.view).detach();
            app.destroy();
            initsimHanoi();
        },
        makes: (num, arg) => {
            if (!num) return new Error("수행 값을 지정하지 않았습니다.");
            else if (!$.isNumeric(parseInt(num))) return new Error("값은 숫자여야 합니다.");
            else if (parseInt(num) < 1) return new Error("값은 1 이상이어야 합니다.");

            num = parseInt(num);

            var colorMap = shuffleRandom(16);
            var app = undefined;
            var w = undefined;
            var h = undefined;

            if (arg === undefined || arg === 0) {
                app = initSim.make({
                    width: window.innerWidth,
                    height: window.innerWidth / 2.612,
                    backgroundColor: 0xffffff,
                    antialias: true,
                    resolution: 1
                });
                initSim.set(app);
                initSim.append(".simcont", app);
                app.renderer.resize(app.renderer.view.parentElement.clientWidth - 32, app.renderer.view.parentElement.clientHeight);
            }
            else {
                app = ALG.hanoi.app;
            }

            w = app.screen.width;
            h = app.screen.height;

            var pole = [
                {
                    x: w / 3 / 2 - w / 108,
                    y: h - (w / 24 + (w / 36 * 10)),
                    w: w / 54,
                    h: w / 24 + (w / 36 * 10)
                },
                {
                    x: w / 2 - w / 108,
                    y: h - (w / 24 + (w / 36 * 10)),
                    w: w / 54,
                    h: w / 24 + (w / 36 * 10)
                },
                {
                    x: w - w / 3 / 2 - w / 108,
                    y: h - (w / 24 + (w / 36 * 10)),
                    w: w / 54,
                    h: w / 24 + (w / 36 * 10)
                }
            ];

            var polStack0 = [];
            var polStack1 = [];
            var polStack2 = [];

            const g = new PIXI.Graphics();

            g.beginFill(0x000000);
            g.drawRoundedRect(0, h - w / 36, w, w / 36, w / 108);
            g.endFill();

            for (var i = 0; i < pole.length; i++) {
                g.beginFill(0x000000);
                g.drawRoundedRect(pole[i].x, pole[i].y, pole[i].w, pole[i].h, w / 108);
                g.endFill();
            }

            app.stage.addChild(g);

            var disc = [];

            for (var i = num - 1; i >= 0; i--) {
                var width = (w / 16) + (w / 48 * i);
                var height = w / 36;
                var x = pole[0].x - w / 46 - ((w / 96 * i));
                var y = (h - w / 18) - (w / 36 * (num - 1 - i));
                var disc = new PIXI.Graphics();
                disc.beginFill(colorset[colorMap.pop() - 1]);
                disc.drawRoundedRect(x, 0, width, height, w / 64);
                disc.endFill();
                polStack0.push(disc);
                app.stage.addChild(disc);
                disc.y = y;
            }

            execAlgorithms("res/js/assets/algorithms.js", {
                name: "hanoi",
                n: num
            }, data => {
                ALG.hanoi.steps = data;
                if (arg === undefined || arg === 0) {
                    setTimeout(function () {
                        $(".simcont").css({ opacity: 1 });
                        addSimCtrler({
                            play: ALG.hanoi.play,
                            pause: ALG.hanoi.pause,
                            reset: ALG.hanoi.reset,
                            backward: ALG.hanoi.backward,
                            forward: ALG.hanoi.forward,
                        }, data.length);
                    }, 333);
                }
                else {
                    StepProgs.progress({
                        duration: 250,
                        total: data.length,
                        label: 'none',
                        onChange: function (percent, value, total) {
                            $('.label-progstep').html(`${value} / ${total}`)
                        }
                    }).progress('reset');
                }
            });

            ALG.current = "hanoi";
            ALG.currentTitle = "하노이 탑";
            ALG.hanoi.app = app;
            ALG.hanoi.backg = g;
            ALG.hanoi.num = num;
            ALG.hanoi.stepCount = 0;
            ALG.hanoi.polStack0 = polStack0;
            ALG.hanoi.polStack1 = polStack1;
            ALG.hanoi.polStack2 = polStack2;
            ALG.hanoi.defY = polStack0[0].y;
            ALG.hanoi.extrudeY = h - (w / 8 + (w / 36 * 10));
            ALG.hanoi.playing = false;

            return app;
        },
        play: animTime => {
            var _animTime = animTime;
            if (animTime === undefined || animTime < 0) _animTime = 1000;
            ALG.hanoi.playing = true;
            playContinueousToggle = true;
            ALG.hanoi.forward(_animTime);
            interval = setInterval(() => {
                if (!ALG.hanoi.forward(_animTime)) {
                    clearInterval(interval);
                    playContinueousToggle = false;
                    ALG.hanoi.playing = false;
                }
            }, _animTime + 100);
        },
        pause: () => {
            if(pauseToggle) {
                ALG.hanoi.playing = false;
                playContinueousToggle = false;
            }
            else {
                var c = setInterval(() => {
                    if(pauseToggle) {
                        ALG.hanoi.playing = false;
                        playContinueousToggle = false;
                        clearInterval(c);
                    }
                }, 25);
            }
            
            if (interval != null) {
                clearInterval(interval);
            }
        },
        rewind: () => {
            var _animTime = 0;
            ALG.hanoi.playing = true;
            ALG.hanoi.backward(_animTime);
            interval = setInterval(() => {
                if (!ALG.hanoi.backward(_animTime)) {
                    clearInterval(interval);
                    ALG.hanoi.playing = false;
                }
            }, _animTime + 24);
            StepProgs.progress('reset');
        },
        reset: num => {
            var _num = num;
            var _app = ALG.hanoi.app;

            if (num === undefined || num < 1) _num = ALG.hanoi.num;
            //$(".simcont > canvas").css({ opacity: 0 });

            if (interval != null) {
                clearInterval(interval);
            }

            completeDestroyElems(_app.stage);

            ALG.hanoi.makes(_num, 1);
            StepProgs.progress('reset');
        },
        forward: animTime => {
            if (ALG.hanoi.stepCount >= ALG.hanoi.steps.length) {
                console.warn("단계의 끝입니다.");
                return false;
            }

            var _animTime = animTime;
            if (animTime === undefined || animTime < 0) _animTime = 1000;

            var coords = { x: 0, y: 0 };
            var w = ALG.hanoi.app.screen.width;
            var h = ALG.hanoi.app.screen.height;
            var _currstep = ALG.hanoi.steps[ALG.hanoi.stepCount];
            var currpol, nextpol;
            var currdisc;
            var defY, upX, upY, moveX, moveY, downX, downY;
            defY = ALG.hanoi.defY;
            upY = ALG.hanoi.extrudeY;

            switch (_currstep.from) {
                case "A":
                    currpol = ALG.hanoi.polStack0;
                    currdisc = currpol.pop();
                    coords.x = 0;

                    if (_currstep.to == "B") {
                        nextpol = ALG.hanoi.polStack1;
                        moveX = w / 2 - w / 6;
                    }
                    else if (_currstep.to == "C") {
                        nextpol = ALG.hanoi.polStack2;
                        moveX = w - w / 3 / 2 - w / 6;
                    }
                    else {

                    }
                    break;

                case "B":
                    currpol = ALG.hanoi.polStack1;
                    currdisc = currpol.pop();
                    coords.x = w / 2 - w / 6;

                    if (_currstep.to == "A") {
                        nextpol = ALG.hanoi.polStack0;
                        moveX = 0;
                    }
                    else if (_currstep.to == "C") {
                        nextpol = ALG.hanoi.polStack2;
                        moveX = w - w / 3 / 2 - w / 6;
                    }
                    else {

                    }
                    break;

                case "C":
                    currpol = ALG.hanoi.polStack2;
                    currdisc = currpol.pop();
                    coords.x = w - w / 3 / 2 - w / 6;

                    if (_currstep.to == "A") {
                        nextpol = ALG.hanoi.polStack0;
                        moveX = 0;
                    }
                    else if (_currstep.to == "B") {
                        nextpol = ALG.hanoi.polStack1;
                        moveX = w / 2 - w / 6;
                    }
                    else {

                    }
                    break;

                default:
                    console.error("Error occurred while animating");
                    break;
            }

            coords.y = currdisc.y;

            var tweenUp = new TWEEN.Tween(coords);
            var tweenMove = new TWEEN.Tween(coords);
            var tweenDown = new TWEEN.Tween(coords);

            ALG.hanoi.playing = true;
            pauseToggle = false;
            tweenUp.to({ x: coords.x, y: upY }, _animTime / 10 * 2)
                .easing(animEasing)
                .onUpdate(function () {
                    currdisc.x = coords.x;
                    currdisc.y = coords.y;
                });

            tweenMove.to({ x: moveX, y: upY }, _animTime / 10 * 6)
                .easing(animEasing)
                .onUpdate(function () {
                    currdisc.x = coords.x;
                    currdisc.y = coords.y;
                });

            tweenDown.to({ x: moveX, y: defY - nextpol.length * w / 36 }, _animTime / 10 * 2)
                .easing(animEasing)
                .onUpdate(function () {
                    currdisc.x = coords.x;
                    currdisc.y = coords.y;
                })
                .onComplete(function () {
                    nextpol.push(currdisc);
                    pauseToggle = true;
                    if(!playContinueousToggle) ALG.hanoi.playing = false;
                    ALG.hanoi.stepCount++;
                });

            tweenUp.chain(tweenMove);
            tweenMove.chain(tweenDown);
            tweenUp.start();
            StepProgs.progress('increment');

            return true;
        },
        backward: animTime => {
            if (ALG.hanoi.stepCount > 0) ALG.hanoi.stepCount--;
            else {
                console.warn("단계의 시작입니다.");
                return false;
            }

            var _animTime = animTime;
            if (animTime === undefined || animTime < 0) _animTime = 1000;

            var coords = { x: 0, y: 0 };
            var w = ALG.hanoi.app.screen.width;
            var h = ALG.hanoi.app.screen.height;
            var _currstep = ALG.hanoi.steps[ALG.hanoi.stepCount];
            var currpol, nextpol;
            var currdisc;
            var defY, upX, upY, moveX, moveY, downX, downY;
            defY = ALG.hanoi.defY;
            upY = ALG.hanoi.extrudeY;

            switch (_currstep.to) {
                case "A":
                    currpol = ALG.hanoi.polStack0;
                    currdisc = currpol.pop();
                    coords.x = 0;

                    if (_currstep.from == "B") {
                        nextpol = ALG.hanoi.polStack1;
                        moveX = w / 2 - w / 6;
                    }
                    else if (_currstep.from == "C") {
                        nextpol = ALG.hanoi.polStack2;
                        moveX = w - w / 3 / 2 - w / 6;
                    }
                    else {

                    }
                    break;

                case "B":
                    currpol = ALG.hanoi.polStack1;
                    currdisc = currpol.pop();
                    coords.x = w / 2 - w / 6;

                    if (_currstep.from == "A") {
                        nextpol = ALG.hanoi.polStack0;
                        moveX = 0;
                    }
                    else if (_currstep.from == "C") {
                        nextpol = ALG.hanoi.polStack2;
                        moveX = w - w / 3 / 2 - w / 6;
                    }
                    else {

                    }
                    break;

                case "C":
                    currpol = ALG.hanoi.polStack2;
                    currdisc = currpol.pop();
                    coords.x = w - w / 3 / 2 - w / 6;

                    if (_currstep.from == "A") {
                        nextpol = ALG.hanoi.polStack0;
                        moveX = 0;
                    }
                    else if (_currstep.from == "B") {
                        nextpol = ALG.hanoi.polStack1;
                        moveX = w / 2 - w / 6;
                    }
                    else {

                    }
                    break;

                default:
                    console.error("Error occurred while animating");
                    break;
            }

            coords.y = currdisc.y;

            var tweenUp = new TWEEN.Tween(coords);
            var tweenMove = new TWEEN.Tween(coords);
            var tweenDown = new TWEEN.Tween(coords);

            ALG.hanoi.playing = true;
            pauseToggle = false;
            tweenUp.to({ x: coords.x, y: upY }, _animTime / 10 * 2)
                .easing(animEasing)
                .onUpdate(function () {
                    currdisc.x = coords.x;
                    currdisc.y = coords.y;
                });

            tweenMove.to({ x: moveX, y: upY }, _animTime / 10 * 6)
                .easing(animEasing)
                .onUpdate(function () {
                    currdisc.x = coords.x;
                    currdisc.y = coords.y;
                });

            tweenDown.to({ x: moveX, y: defY - nextpol.length * w / 36 }, _animTime / 10 * 2)
                .easing(animEasing)
                .onUpdate(function () {
                    currdisc.x = coords.x;
                    currdisc.y = coords.y;
                })
                .onComplete(function () {
                    nextpol.push(currdisc);
                    pauseToggle = true;
                    if(!playContinueousToggle) ALG.hanoi.playing = false;
                    //ALG.hanoi.stepCount--;
                });

            tweenUp.chain(tweenMove);
            tweenMove.chain(tweenDown);
            tweenUp.start();
            StepProgs.progress('decrement');

            return true;
        }
    };

    ALG.hanoi = sets;
}