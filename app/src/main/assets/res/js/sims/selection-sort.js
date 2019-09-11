const initsimSelectionSort = () => {
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
                ALG.selectionsort.reset(inputArr);
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
            initsimSelectionSort();
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
                app = ALG.selectionsort.app;
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

            ALG.selectionsort.gObjs = objs;

            var result = algSelectionSort(arr, objs);

            ALG.selectionsort.steps = result.g;
            ALG.selectionsort.resultArr = result.a;

            if (arg === undefined || arg === 0) {
                setTimeout(function () {
                    $(".simcont").css({ opacity: 1 });
                    addSimCtrler({
                        play: ALG.selectionsort.play,
                        pause: ALG.selectionsort.pause,
                        reset: ALG.selectionsort.reset,
                        backward: ALG.selectionsort.backward,
                        forward: ALG.selectionsort.forward,
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
                name: "selectionsort",
                n: arr,
                g: JSON.stringify(objs)
            }, data => {
                ALG.selectionsort.steps = data.g;
                ALG.selectionsort.resultArr = data.a;
                
            });*/

            const labelMin = new PIXI.Text(`Min`, {
                fontFamily: 'Arial', 
                fontSize: w / 36,
                fontWeight: 600,
                fill: 0x000000, 
                align: 'left',
                wordWrap: true,
                wordWrapWidth: _w,
                lineHeight: _h
            });

            const labelArrow = new PIXI.Text(`▲`, {
                fontFamily: 'Arial', 
                fontSize: w / 24,
                fontWeight: 600,
                fill: 0xff0000, 
                align: 'left',
                wordWrap: true,
                wordWrapWidth: _w,
                lineHeight: _h
            });

            labelMin.x = 0;
            labelMin.y = 0;
            labelArrow.x = 0;
            labelArrow.y = 0;

            ALG.current = "selectionsort";
            ALG.currentTitle = "선택 정렬";
            ALG.selectionsort.labelMin = labelMin;
            ALG.selectionsort.labelArrow = labelArrow;
            ALG.selectionsort.app = app;
            ALG.selectionsort.array = arr;
            ALG.selectionsort.num = _origInputData;
            ALG.selectionsort.length = arr.length;
            ALG.selectionsort.stepCount = 0;
            ALG.selectionsort.playing = false;

            return app;
        },
        play: animTime => {
            var _animTime = animTime;
            if (animTime === undefined || animTime < 0) _animTime = 1000;
            ALG.selectionsort.playing = true;
            playContinueousToggle = true;
            ALG.selectionsort.forward(_animTime);
            interval = setInterval(() => {
                if (!ALG.selectionsort.forward(_animTime)) {
                    clearInterval(interval);
                    playContinueousToggle = false;
                    ALG.selectionsort.playing = false;
                }
            }, _animTime / 2 + 25);
        },
        pause: () => {
            if(pauseToggle) {
                ALG.selectionsort.playing = false;
                playContinueousToggle = false;
            }
            else {
                var c = setInterval(() => {
                    if(pauseToggle) {
                        ALG.selectionsort.playing = false;
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
            ALG.selectionsort.playing = true;
            ALG.selectionsort.backward(_animTime);
            interval = setInterval(() => {
                if (!ALG.selectionsort.backward(_animTime)) {
                    clearInterval(interval);
                    ALG.selectionsort.playing = false;
                }
            }, _animTime + 24);
            StepProgs.progress('reset');
        },
        reset: arr => {
            var _arr = arr;
            var _app = ALG.selectionsort.app;

            if (arr === undefined || arr.length < 1) _arr = ALG.selectionsort.num;
            //$(".simcont > canvas").css({ opacity: 0 });

            if (interval != null) {
                clearInterval(interval);
            }

            completeDestroyElems(_app.stage);

            ALG.selectionsort.makes(_arr, 1);
            StepProgs.progress('reset');
        },
        forward: animTime => {
            if (ALG.selectionsort.stepCount >= ALG.selectionsort.steps.length) {
                console.warn("단계의 끝입니다.");
                return false;
            }

            var _animTime = animTime / 2;
            if (animTime === undefined || animTime < 0) _animTime = 1000 / 2;

            var w = ALG.selectionsort.app.screen.width;
            var h = ALG.selectionsort.app.screen.height;
            var _currstep = ALG.selectionsort.steps[ALG.selectionsort.stepCount];
            var _currArr = ALG.selectionsort.resultArr[ALG.selectionsort.stepCount];

            ALG.selectionsort.playing = true;
            pauseToggle = false;

            switch(_currstep.action) {
                case 'select':
                    ALG.selectionsort.labelMin.x = _currstep.min.bar.x + w / 128;
                    ALG.selectionsort.labelMin.y = _currstep.min.bar.y - w / 28;
                    ALG.selectionsort.labelArrow.x = _currstep.data.bar.x + w / 96;
                    ALG.selectionsort.labelArrow.y = _currstep.data.txt.y + w / 18;
                    ALG.selectionsort.app.stage.addChild(ALG.selectionsort.labelMin);
                    ALG.selectionsort.app.stage.addChild(ALG.selectionsort.labelArrow);
                    pauseToggle = true;
                    if(!playContinueousToggle) ALG.selectionsort.playing = false;
                    break;

                case 'move':
                    var labelArrow = ALG.selectionsort.labelArrow;
                    var toX = _currstep.data.bar.x + w / 96;
                    var toY = _currstep.data.txt.y + w / 18;
                    var coords = {x: 0, y: 0};
                    var tweenMove = new TWEEN.Tween(coords);

                    coords.x = labelArrow.x;
                    coords.y = labelArrow.y;
                    
                    tweenMove.to({x: toX, y: toY}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        labelArrow.x = coords.x;
                        labelArrow.y = coords.y;
                    })
                    .onComplete(function () {
                        ALG.selectionsort.labelMin.x = _currstep.min.bar.x + w / 128;
                        ALG.selectionsort.labelMin.y = _currstep.min.bar.y - w / 28;
                        pauseToggle = true;
                        if(!playContinueousToggle) ALG.selectionsort.playing = false;
                    });
                    tweenMove.start();
                    break;
                
                case 'swap':
                    ALG.selectionsort.app.stage.removeChild(ALG.selectionsort.labelMin);
                    ALG.selectionsort.app.stage.removeChild(ALG.selectionsort.labelArrow);

                    var coordsFromBar = {x: 0, y: 0};
                    var coordsToBar = {x: 0, y: 0};
                    var coordsFromTxt = {x: 0, y: 0};
                    var coordsToTxt = {x: 0, y: 0};

                    var barFrom = _currstep.from.bar;
                    var barTo = _currstep.to.bar;
                    var txtFrom = _currstep.from.txt;
                    var txtTo = _currstep.to.txt;
                    var txtFx = _currstep.from.txt.x - (barFrom.x - barTo.x);
                    var txtTx = _currstep.to.txt.x + (barFrom.x - barTo.x);

                    coordsFromBar.x = _currstep.from.bar.x;
                    coordsFromBar.y = _currstep.from.bar.y;
                    coordsToBar.x = _currstep.to.bar.x;
                    coordsToBar.y = _currstep.to.bar.y;
                    coordsFromTxt.x = _currstep.from.txt.x;
                    coordsFromTxt.y = _currstep.from.txt.y;
                    coordsToTxt.x = _currstep.to.txt.x;
                    coordsToTxt.y = _currstep.to.txt.y;

                    var tweenFromBar = new TWEEN.Tween(coordsFromBar);
                    var tweenToBar = new TWEEN.Tween(coordsToBar);
                    var tweenFromTxt = new TWEEN.Tween(coordsFromTxt);
                    var tweenToTxt = new TWEEN.Tween(coordsToTxt);

                    tweenFromBar.to({x: barTo.x, y: barFrom.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        barFrom.x = coordsFromBar.x;
                        barFrom.y = coordsFromBar.y;
                    })
                    .onComplete(function () {
                    });
                    tweenFromBar.start();

                    tweenToBar.to({x: barFrom.x, y: barTo.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        barTo.x = coordsToBar.x;
                        barTo.y = coordsToBar.y;
                    })
                    .onComplete(function () {
                        pauseToggle = true;
                        if(!playContinueousToggle) ALG.selectionsort.playing = false;
                    });
                    tweenToBar.start();

                    tweenFromTxt.to({x: txtFx, y: txtFrom.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        txtFrom.x = coordsFromTxt.x;
                    })
                    .onComplete(function () {
                    });
                    tweenFromTxt.start();

                    tweenToTxt.to({x: txtTx, y: txtFrom.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        txtTo.x = coordsToTxt.x;
                    })
                    .onComplete(function () {
                    });
                    tweenToTxt.start();
                    break;

                default:
                    console.error('unknown animation action!');
                    break;
            }
            ALG.selectionsort.stepCount++;
            StepProgs.progress('increment');
            return true;
        },
        backward: animTime => {
            if (ALG.selectionsort.stepCount > 0) ALG.selectionsort.stepCount--;
            else {
                console.warn("단계의 시작입니다.");
                return false;
            }

            var _animTime = animTime / 2;
            if (animTime === undefined || animTime < 0) _animTime = 1000 / 2;

            var w = ALG.selectionsort.app.screen.width;
            var h = ALG.selectionsort.app.screen.height;
            var _currstep = ALG.selectionsort.steps[ALG.selectionsort.stepCount];
            var _currArr = ALG.selectionsort.resultArr[ALG.selectionsort.stepCount];

            ALG.selectionsort.playing = true;
            pauseToggle = false;

            switch(_currstep.action) {
                case 'select':
                    ALG.selectionsort.app.stage.removeChild(ALG.selectionsort.labelMin);
                    ALG.selectionsort.app.stage.removeChild(ALG.selectionsort.labelArrow);
                    pauseToggle = true;
                    if(!playContinueousToggle) ALG.selectionsort.playing = false;
                    break;

                case 'move':
                    var labelArrow = ALG.selectionsort.labelArrow;
                    var toX = _currstep.prev.bar.x + w / 96;
                    var toY = _currstep.prev.txt.y + w / 18;
                    var coords = {x: 0, y: 0};
                    var tweenMove = new TWEEN.Tween(coords);

                    coords.x = labelArrow.x;
                    coords.y = labelArrow.y;
                    
                    tweenMove.to({x: toX, y: toY}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        labelArrow.x = coords.x;
                        labelArrow.y = coords.y;
                    })
                    .onComplete(function () {
                        ALG.selectionsort.labelMin.x = _currstep.minPrev.bar.x + w / 128;
                        ALG.selectionsort.labelMin.y = _currstep.minPrev.bar.y - w / 28;
                        pauseToggle = true;
                        if(!playContinueousToggle) ALG.selectionsort.playing = false;
                    });
                    tweenMove.start();
                    break;
                
                case 'swap':
                    var coordsFromBar = {x: 0, y: 0};
                    var coordsToBar = {x: 0, y: 0};
                    var coordsFromTxt = {x: 0, y: 0};
                    var coordsToTxt = {x: 0, y: 0};

                    var barFrom = _currstep.from.bar;
                    var barTo = _currstep.to.bar;
                    var txtFrom = _currstep.from.txt;
                    var txtTo = _currstep.to.txt;
                    var txtFx = _currstep.from.txt.x - (barFrom.x - barTo.x);
                    var txtTx = _currstep.to.txt.x + (barFrom.x - barTo.x);

                    coordsFromBar.x = _currstep.from.bar.x;
                    coordsFromBar.y = _currstep.from.bar.y;
                    coordsToBar.x = _currstep.to.bar.x;
                    coordsToBar.y = _currstep.to.bar.y;
                    coordsFromTxt.x = _currstep.from.txt.x;
                    coordsFromTxt.y = _currstep.from.txt.y;
                    coordsToTxt.x = _currstep.to.txt.x;
                    coordsToTxt.y = _currstep.to.txt.y;

                    var tweenFromBar = new TWEEN.Tween(coordsFromBar);
                    var tweenToBar = new TWEEN.Tween(coordsToBar);
                    var tweenFromTxt = new TWEEN.Tween(coordsFromTxt);
                    var tweenToTxt = new TWEEN.Tween(coordsToTxt);

                    tweenFromBar.to({x: barTo.x, y: barFrom.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        barFrom.x = coordsFromBar.x;
                        barFrom.y = coordsFromBar.y;
                    })
                    .onComplete(function () {
                    });
                    tweenFromBar.start();

                    tweenToBar.to({x: barFrom.x, y: barTo.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        barTo.x = coordsToBar.x;
                        barTo.y = coordsToBar.y;
                    })
                    .onComplete(function () {
                        pauseToggle = true;
                        if(!playContinueousToggle) ALG.selectionsort.playing = false;
                    });
                    tweenToBar.start();

                    tweenFromTxt.to({x: txtFx, y: txtFrom.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        txtFrom.x = coordsFromTxt.x;
                    })
                    .onComplete(function () {
                    });
                    tweenFromTxt.start();

                    tweenToTxt.to({x: txtTx, y: txtFrom.y}, _animTime / 1.2)
                    .easing(animEasing)
                    .onUpdate(function () {
                        txtTo.x = coordsToTxt.x;
                    })
                    .onComplete(function () {
                        ALG.selectionsort.labelMin.x = _currstep.min.bar.x + w / 128;
                        ALG.selectionsort.labelMin.y = _currstep.min.bar.y - w / 28;
                        ALG.selectionsort.labelArrow.x = _currstep.prev.bar.x + w / 96;
                        ALG.selectionsort.labelArrow.y = _currstep.prev.txt.y + w / 18;
                        ALG.selectionsort.app.stage.addChild(ALG.selectionsort.labelMin);
                        ALG.selectionsort.app.stage.addChild(ALG.selectionsort.labelArrow);
                    });
                    tweenToTxt.start();
                    break;

                default:
                    console.error('unknown animation action!');
                    break;
            }
            StepProgs.progress('decrement');
            return true;
        }
    }

    ALG.selectionsort = sets;
}