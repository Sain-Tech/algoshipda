const initsimInsertionSort = () => {
    var interval;
    var animEasing = TWEEN.Easing.Cubic.InOut;
    var playContinueousToggle = false;
    var pauseToggle = true;
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
                if(num > 1) $(this).parent().detach();
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
            if(num > 1) $(this).parent().detach();
        });

        var inputArr = [1];

        $('.dlg').click(function(e) {
            var target = e.target;
            // console.log(target);

            if($(target).hasClass("dlg") || $(target).attr('id') === "action_cancel" || $(target).attr('id') === "dlg_close_default" || $(target).parent().attr('id') === "dlg_close_default") {
                console.log("dialog close");

                setTimeout(function() {
                    $('#select_container').empty();
                    for(var i = 0; i < inputArr.length; i++) {
                        $('#select_container').append(`+"`" + selectElm + "`"+`);
                        var selects = $('.dlg-content > .main > #select_container > .column > select');
                        selects.eq(i).val(inputArr[i]);
                    }
                    $('.actions-select.del').click(function() {
                        var num = $('.dlg-content > .main > #select_container > .column > select').length;
                        if(num > 1) $(this).parent().detach();
                    });
                }, 333);

                inputDialog.hide();
            }

            else if($(target).attr('id') === "action_ok") {
                console.log("dialog ok");
                var arr = [];
                var selects = $('.dlg-content > .main > #select_container > .column > select');
                for(var i = 0; i < selects.length; i++) {
                    arr.push(parseInt(selects.eq(i).val()));
                }
                inputArr = arr;
                console.log(inputArr);
                inputDialog.hide();
            }
        });

        const inputDialog = {
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
                var _h = w / 16 + (arr[i] - 1) * w / 64;
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
                bar.drawRoundedRect(_x, _y, _w, _h, _r);
                bar.endFill();
                txt.x = arr[i] < 10 ? _x + _w / 3.18 : _x + _w / 8;
                txt.y = h - w / 3.29;
                objs.push({bar: bar, txt: txt});
                app.stage.addChild(bar);
                app.stage.addChild(txt);
            }

            execAlgorithms("res/js/assets/algorithms.js", {
                name: "insertionsort",
                n: arr
            }, data => {
                ALG.insertionsort.steps = data;
                if (arg === undefined || arg === 0) {
                    setTimeout(function () {
                        $(".simcont").css({ opacity: 1 });
                        addSimCtrler({
                            play: ALG.insertionsort.play,
                            pause: ALG.insertionsort.pause,
                            reset: ALG.insertionsort.reset,
                            backward: ALG.insertionsort.backward,
                            forward: ALG.insertionsort.forward,
                        }, data.length, ctrlHeaderElms);
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

            ALG.current = "insertionsort";
            ALG.currentTitle = "삽입 정렬";
            ALG.insertionsort.app = app;
            ALG.insertionsort.array = arr;
            ALG.insertionsort.num = arr.length;
            ALG.insertionsort.stepCount = 0;
            ALG.insertionsort.gObjs = objs;
            ALG.insertionsort.playing = false;

            $('.simcont').css({opacity: 1});

            return app;
        },
        play: animTime => {},
        pause: () => {},
        rewind: () => {},
        reset: arr => {},
        forward: animTime => {},
        backward: animTime => {}
    }

    ALG.insertionsort = sets;
}