const initsimInsertionSort = () => {
    var interval;
    var animEasing = TWEEN.Easing.Cubic.InOut;
    var playContinueousToggle = false;
    var pauseToggle = true;
    var inputDialog;
    var selectElm = `
    <div class="column">
        <i class="times circle icon dlg-close actions-select del"></i>
        <select class="dlg-select">
            <option value="1" selected>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
        </select>
    </div>`;
    var modal = `
    <div class="dlg transparent">
        <div class="dlg-content">
            <i id="dlg_close_default" class="times circle icon dlg-close"></i>

            <div class="header">데이터 입력</div>

            <div class="ui grid attached segment main">
                <div id="select_container" class="two column row">
                    ${selectElm}
                    ${selectElm}
                    ${selectElm}
                    ${selectElm}
                    ${selectElm}
                    ${selectElm}
                    ${selectElm}
                    ${selectElm}
                </div>

                <div class="action-divider"></div>

                <div class="two column row">
                    <div class="column">
                        <button class="actions-dlg add" type="button">
                            <i class="plus circle icon"></i>
                            추가
                        </button>
                    </div>
                    <div class="column">
                        <button class="actions-dlg random" type="button">
                            <i class="question circle icon"></i>
                            랜덤 값
                        </button>
                    </div>
                </div>
            </div>

            <div class="action-divider"></div>
            <div class="ui two bottom attached buttons">
                <div id="action_ok" class="ui button">확인</div>
                <div id="action_cancel" class="ui button">취소</div>
            </div>
        </div>
    </div>`;

    var ctrlHeaderElms = `
    <div class="btn-sim-setup" style="margin-left: auto">
        <i class="edit icon"></i>
    </div>

    <script>
        $(document.body).prepend(`+"`" + modal + "`"+`);

        $('.actions-dlg.add').click(function() {
            var num = $('.dlg-content > .main > #select_container > .column > select').length;
            if(num < 10) $('#select_container').append(`+"`" + selectElm + "`"+`);
            $('.actions-select.del').click(function() {
                var num = $('.dlg-content > .main > #select_container > .column > select').length;
                if(num > 2) $(this).parent().detach();
            });
        });

        $('.actions-dlg.random').click(function() {
            console.log('randomized...');
            var selects = $('.dlg-content > .main > #select_container > .column > select');
            for(var i = 0; i < selects.length; i++) {
                var randNum = Math.floor(Math.random() * 15) + 1;
                selects.eq(i).val(randNum);
            }
        });

        $('.actions-select.del').click(function() {
            var num = $('.dlg-content > .main > #select_container > .column > select').length;
            if(num > 2) $(this).parent().detach();
        });

        var inputArr = [1, 2];
        $('.dlg-content > .main > #select_container > .column > select')[1].value = 2;

        $('.dlg').click(function(e) {
            var target = e.target;

            if($(target).hasClass("dlg") || $(target).attr('id') === "action_cancel" || $(target).attr('id') === "dlg_close_default" || $(target).parent().attr('id') === "dlg_close_default") {
                setTimeout(function() {
                    $('#select_container').empty();
                    for(var i = 0; i < inputArr.length; i++) {
                        $('#select_container').append(`+"`" + selectElm + "`"+`);
                        var selects = $('.dlg-content > .main > #select_container > .column > select');
                        selects.eq(i).val(inputArr[i]);
                    }
                    $('.actions-select.del').click(function() {
                        var num = $('.dlg-content > .main > #select_container > .column > select').length;
                        if(num > 2) $(this).parent().detach();
                    });
                }, 333);

                inputDialog.hide();
            }

            else if($(target).attr('id') === "action_ok") {
                var arr = [];
                var selects = $('.dlg-content > .main > #select_container > .column > select');
                for(var i = 0; i < selects.length; i++) {
                    arr.push(parseInt(selects.eq(i).val()));
                }
                inputArr = arr;
                ALG.insertionsort.reset(inputArr);
                inputDialog.hide();
            }
        });

        inputDialog = {
            opened: false,
            show: function() {
                if(inputDialog.opened) return;
                inputDialog.opened = true;
                $('.dlg').css({display:'block'});
                setTimeout(function() {
                    $('.dlg').css({opacity:1});
                    setTimeout(function() {
                        $('.dlg-content').css({opacity:1, transform:'scale(1)'});
                    }, 192);
                }, 84)
            },
            hide: function() {
                if(!inputDialog.opened) return;
                inputDialog.opened = false;
                $('.dlg-content').css({opacity:0});
                setTimeout(function() {
                    $('.dlg-content').css({transform:'scale(1.1)'});
                    $('.dlg').css({opacity:0});
                    setTimeout(function() {
                        $('.dlg').css({display:'none'});
                    }, 133.3);
                }, 200)
            }
        }

        $('.btn-sim-setup').click(function() {
            inputDialog.show();
        });
    </script>`;
    
    const sets = {
        destroy: app => {
            if (interval != null) {
                clearInterval(interval);
            }

            completeDestroyElems(app.stage);

            $('.dlg').detach();
            $('#ctrl_upper').detach();
            $('#ctrl_lower').detach();
            $(app.renderer.view).detach();
            app.destroy();
            initsimInsertionSort();
        },
        makes: (arr, arg) => {
            if (!arr) return new Error("수행 값을 지정하지 않았습니다.");
            else if (!$.isArray(arr)) return new Error("값은 배열이어야 합니다.");
            else if (arr.length < 1) return new Error("배열 크기는 최소 1 이상이어야 합니다.");
        
            var colorMap = shuffleRandom(16);
            var app = undefined;
            var w = undefined;
            var h = undefined;

            var _origInputData = arr.slice();

            if (arg === undefined || arg === 0) {
                app = initSim.make({
                    width: window.innerWidth,
                    height: window.innerWidth / 1.5,
                    backgroundColor: 0xffffff,
                    antialias: true,
                    resolution: devicePixelRatio <= 1 ? devicePixelRatio * 1.5 : devicePixelRatio
                });
                initSim.set(app);
                initSim.append(".simcont", app);
            }
            else {
                app = ALG.insertionsort.app;
            }

            w = app.screen.width;
            h = app.screen.height;

            var objs = [];

            for(var i = 0; i < arr.length; i++) {
                var hCenter = w / 2;
                var dataLen = arr.length;

                var _w = w / 16;
                var _h = w / 16 + (arr[i] - 1) * w / 80;
                var _spce = w / 36;
                var _startPoint = hCenter - (parseFloat(dataLen / 2) * (_w + _spce)) + _spce / 2;
                var _x = _startPoint + i * (_w + _spce);
                var _y = h - _h - w / 4;
                var _r = w / 96;

                const bar = new PIXI.Graphics();
                const txt = new PIXI.Text(`${arr[i]}`, {
                    fontFamily: 'Arial', 
                    fontSize: w / 24,
                    fontWeight: 600,
                    fill: 0xffffff, 
                    align: 'left',
                    wordWrap: true,
                    wordWrapWidth: _w,
                    lineHeight: _h
                });

                bar.beginFill(colorset[colorMap.pop() - 1]);
                bar.drawRoundedRect(0, 0, _w, _h, _r);
                bar.endFill();
                objs.push({bar: bar, txt: txt});
                app.stage.addChild(bar);
                app.stage.addChild(txt);
                bar.x = _x;
                bar.y = _y;
                txt.x = arr[i] < 10 ? _x + _w / 3.18 : _x + _w / 8;
                txt.y = h - w / 3.29;
            }

            ALG.insertionsort.gObjs = objs;

            var result = algInsertionSort(arr, objs);

            ALG.insertionsort.steps = result.g;
            ALG.insertionsort.resultArr = result.a;

            if (arg === undefined || arg === 0) {
                setTimeout(function () {
                    $(".simcont").css({ opacity: 1 });
                    addSimCtrler({
                        play: ALG.insertionsort.play,
                        pause: ALG.insertionsort.pause,
                        reset: ALG.insertionsort.reset,
                        backward: ALG.insertionsort.backward,
                        forward: ALG.insertionsort.forward,
                    }, result.a.length, ctrlHeaderElms);
                    
                    // init select on input dialog
                    var selects = $('.dlg-content > .main > #select_container > .column > select');
                    for(var i = 0; i < selects.length; i++) {
                        selects[i].value = _origInputData[i];
                    }
                }, 333);
            }
            else {
                StepProgs.progress({
                    duration: 250,
                    total: result.a.length,
                    label: 'none',
                    onChange: function (percent, value, total) {
                        $('.label-progstep').html(`${value} / ${total}`)
                    }
                }).progress('reset');
            }

            setTimeout(function () {
                inputArr = _origInputData;
            }, 333);

            /*execAlgorithms("res/js/assets/algorithms.js", {
                name: "insertionsort",
                n: arr,
                g: JSON.stringify(objs)
            }, data => {
                ALG.insertionsort.steps = data.g;
                ALG.insertionsort.resultArr = data.a;
                
            });*/

            ALG.current = "insertionsort";
            ALG.currentTitle = "삽입 정렬";
            ALG.insertionsort.app = app;
            ALG.insertionsort.array = arr;
            ALG.insertionsort.num = _origInputData;
            ALG.insertionsort.length = arr.length;
            ALG.insertionsort.stepCount = 0;
            ALG.insertionsort.playing = false;

            return app;
        },
        play: animTime => {
            var _animTime = animTime / 2;
            if (animTime === undefined || animTime < 0) _animTime = 1000 / 2;
            ALG.insertionsort.playing = true;
            playContinueousToggle = true;
            ALG.insertionsort.forward(_animTime);
            interval = setInterval(() => {
                if (!ALG.insertionsort.forward(_animTime)) {
                    clearInterval(interval);
                    playContinueousToggle = false;
                    ALG.insertionsort.playing = false;
                }
            }, _animTime + 25);
        },
        pause: () => {
            if(pauseToggle) {
                ALG.insertionsort.playing = false;
                playContinueousToggle = false;
            }
            else {
                var c = setInterval(() => {
                    if(pauseToggle) {
                        ALG.insertionsort.playing = false;
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
            ALG.insertionsort.playing = true;
            ALG.insertionsort.backward(_animTime);
            interval = setInterval(() => {
                if (!ALG.insertionsort.backward(_animTime)) {
                    clearInterval(interval);
                    ALG.insertionsort.playing = false;
                }
            }, _animTime + 24);
            StepProgs.progress('reset');
        },
        reset: arr => {
            var _arr = arr;
            var _app = ALG.insertionsort.app;

            if (arr === undefined || arr.length < 1) _arr = ALG.insertionsort.num;
            //$(".simcont > canvas").css({ opacity: 0 });

            if (interval != null) {
                clearInterval(interval);
            }

            completeDestroyElems(_app.stage);

            ALG.insertionsort.makes(_arr, 1);
            StepProgs.progress('reset');
        },
        forward: animTime => {
            if (ALG.insertionsort.stepCount >= ALG.insertionsort.steps.length) {
                console.warn("단계의 끝입니다.");
                return false;
            }

            var _animTime = animTime;
            if (animTime === undefined || animTime < 0) _animTime = 1000 / 2;

            var w = ALG.insertionsort.app.screen.width;
            var h = ALG.insertionsort.app.screen.height;
            var _currstep = ALG.insertionsort.steps[ALG.insertionsort.stepCount];
            var _currArr = ALG.insertionsort.resultArr[ALG.insertionsort.stepCount];

            ALG.insertionsort.playing = true;
            pauseToggle = false;

            var coords = [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }];
            var tweens = [new TWEEN.Tween(coords[0]),new TWEEN.Tween(coords[1])
                ,new TWEEN.Tween(coords[2]),new TWEEN.Tween(coords[3])];

            let toBarX, toBarY, toTxtX, toTxtY, toBar2X, toBar2Y, toTxt2X, toTxt2Y = undefined;
            coords[0].x = _currstep.from.bar.x;
            coords[0].y = _currstep.from.bar.y;
            coords[1].x = _currstep.from.txt.x;
            coords[1].y = _currstep.from.txt.y;
            coords[2].x = _currstep.to.bar.x;
            coords[2].y = _currstep.to.bar.y;
            coords[3].x = _currstep.to.txt.x;
            coords[3].y = _currstep.to.txt.y;

            var origBarH = w / 16 + (_currArr.from - 1) * w / 80;
            var origBarY = h - origBarH - w / 4;
            var origTxtY = h - w / 3.29;

            switch(_currstep.action) {
                case 'extract':
                    toBarX = _currstep.from.bar.x;
                    toBarY = h - _currstep.from.bar.height;
                    toTxtX = _currstep.from.txt.x;
                    toTxtY = _currstep.from.txt.y + (toBarY - coords[0].y);
                    break;

                case 'swap':
                    toBarX = _currstep.to.bar.x;
                    toBarY = _currstep.from.bar.y;
                    toTxtX = _currstep.from.txt.x - (coords[0].x - toBarX);
                    toTxtY = _currstep.from.txt.y;

                    toBar2X = _currstep.from.bar.x;
                    toBar2Y = _currstep.to.bar.y;
                    toTxt2X = _currstep.to.txt.x + (toBar2X - coords[2].x);
                    toTxt2Y = _currstep.to.txt.y;
                    break;
                
                case 'insert':
                    toBarX = _currstep.from.bar.x;
                    toBarY = origBarY;
                    toTxtX = _currstep.from.txt.x;
                    toTxtY = origTxtY;
                    break;

                default:
                    console.error('unknown animation action!');
                    break;
            }

            if(toBar2X != undefined && toBar2Y != undefined 
                && toTxt2X != undefined && toTxt2Y != undefined) {
                
                tweens[2].to({x: toBar2X, y: toBar2Y}, _animTime / 1.2)
                .easing(animEasing)
                .onUpdate(function () {
                    _currstep.to.bar.x = coords[2].x;
                    _currstep.to.bar.y = coords[2].y;
                });
                tweens[2].start();
    
                tweens[3].to({x: toTxt2X, y: toTxt2Y}, _animTime / 1.2)
                .easing(animEasing)
                .onUpdate(function () {
                    _currstep.to.txt.x = coords[3].x;
                    _currstep.to.txt.y = coords[3].y;
                });
                tweens[3].start();
            }
            
            tweens[0].to({x: toBarX, y: toBarY}, _animTime / 1.2)
            .easing(animEasing)
            .onUpdate(function () {
                _currstep.from.bar.x = coords[0].x;
                _currstep.from.bar.y = coords[0].y;
            });
            tweens[0].start();

            tweens[1].to({x: toTxtX, y: toTxtY}, _animTime / 1.2)
            .easing(animEasing)
            .onUpdate(function () {
                _currstep.from.txt.x = coords[1].x;
                _currstep.from.txt.y = coords[1].y;
            })
            .onComplete(function () {
                pauseToggle = true;
                if(!playContinueousToggle) ALG.insertionsort.playing = false;
                ALG.insertionsort.stepCount++;
            });
            tweens[1].start();
            StepProgs.progress('increment');
            
            return true;
        },
        backward: animTime => {
            if (ALG.insertionsort.stepCount > 0) ALG.insertionsort.stepCount--;
            else {
                console.warn("단계의 시작입니다.");
                return false;
            }

            var _animTime = animTime;
            if (animTime === undefined || animTime < 0) _animTime = 1000 / 2;

            var w = ALG.insertionsort.app.screen.width;
            var h = ALG.insertionsort.app.screen.height;
            var _currstep = ALG.insertionsort.steps[ALG.insertionsort.stepCount];
            var _currArr = ALG.insertionsort.resultArr[ALG.insertionsort.stepCount];

            ALG.insertionsort.playing = true;
            pauseToggle = false;

            var coords = [{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 },{ x: 0, y: 0 }];
            var tweens = [new TWEEN.Tween(coords[0]),new TWEEN.Tween(coords[1])
                ,new TWEEN.Tween(coords[2]),new TWEEN.Tween(coords[3])];

            let toBarX, toBarY, toTxtX, toTxtY, toBar2X, toBar2Y, toTxt2X, toTxt2Y = undefined;
            coords[0].x = _currstep.from.bar.x;
            coords[0].y = _currstep.from.bar.y;
            coords[1].x = _currstep.from.txt.x;
            coords[1].y = _currstep.from.txt.y;
            coords[2].x = _currstep.to.bar.x;
            coords[2].y = _currstep.to.bar.y;
            coords[3].x = _currstep.to.txt.x;
            coords[3].y = _currstep.to.txt.y;

            var origBarH = w / 16 + (_currArr.from - 1) * w / 80;
            var origBarY = h - origBarH - w / 4;
            var origTxtY = h - w / 3.29;

            switch(_currstep.action) {
                case 'extract':
                    toBarX = _currstep.from.bar.x;
                    toBarY = origBarY;
                    toTxtX = _currstep.from.txt.x;
                    toTxtY = origTxtY;
                    break;

                case 'swap':
                    toBarX = _currstep.to.bar.x;
                    toBarY = _currstep.from.bar.y;
                    toTxtX = _currstep.from.txt.x - (coords[0].x - toBarX);
                    toTxtY = _currstep.from.txt.y;

                    toBar2X = _currstep.from.bar.x;
                    toBar2Y = _currstep.to.bar.y;
                    toTxt2X = _currstep.to.txt.x + (toBar2X - coords[2].x);
                    toTxt2Y = _currstep.to.txt.y;
                    break;
                
                case 'insert':
                    toBarX = _currstep.from.bar.x;
                    toBarY = h - _currstep.from.bar.height;
                    toTxtX = _currstep.from.txt.x;
                    toTxtY = _currstep.from.txt.y + (toBarY - coords[0].y);
                    break;

                default:
                    console.error('unknown animation action!');
                    break;
            }

            if(toBar2X != undefined && toBar2Y != undefined 
                && toTxt2X != undefined && toTxt2Y != undefined) {
                
                tweens[2].to({x: toBar2X, y: toBar2Y}, _animTime / 2.5)
                .easing(animEasing)
                .onUpdate(function () {
                    _currstep.to.bar.x = coords[2].x;
                    _currstep.to.bar.y = coords[2].y;
                });
                tweens[2].start();
    
                tweens[3].to({x: toTxt2X, y: toTxt2Y}, _animTime / 2.5)
                .easing(animEasing)
                .onUpdate(function () {
                    _currstep.to.txt.x = coords[3].x;
                    _currstep.to.txt.y = coords[3].y;
                });
                tweens[3].start();
            }
            
            tweens[0].to({x: toBarX, y: toBarY}, _animTime / 2.5)
            .easing(animEasing)
            .onUpdate(function () {
                _currstep.from.bar.x = coords[0].x;
                _currstep.from.bar.y = coords[0].y;
            });
            tweens[0].start();

            tweens[1].to({x: toTxtX, y: toTxtY}, _animTime / 2.5)
            .easing(animEasing)
            .onUpdate(function () {
                _currstep.from.txt.x = coords[1].x;
                _currstep.from.txt.y = coords[1].y;
            })
            .onComplete(function () {
                pauseToggle = true;
                if(!playContinueousToggle) ALG.insertionsort.playing = false;
            });
            tweens[1].start();
            StepProgs.progress('decrement');
            
            return true;
        }
    }

    ALG.insertionsort = sets;
}