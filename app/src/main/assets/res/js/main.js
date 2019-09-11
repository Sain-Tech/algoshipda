// 문서가 로드되었을때 실행할 코드들...
$(document).ready(function () {
    init();
    ALG.hanoi.makes(5);
});

// 시뮬레이터 초기화 함수
var init = () => {
    // PIXI 버전 및 모드 콘솔에 띄우기
    initSim.test();
    initsimHanoi();
}

const simTest = function (e) {
    const selection = parseInt($(e.target).attr('data-value'));
    console.log(selection);
    ALG[ALG.current].destroy(ALG[ALG.current].app);
    console.log(parseInt($(e.target).attr('data-value')));

    switch (selection) {
        case 0:
            initsimHanoi();
            ALG.hanoi.makes(5);
            break;

        case 1:
            initsimSelectionSort();
            var arr = [];
            for (var i = 0; i < 8; i++) {
                var randNum = Math.floor(Math.random() * 15) + 1;
                arr.push(randNum);
            }
            console.log(ALG.selectionsort.makes(arr));
            break;

        case 2:
            initsimInsertionSort();
            var arr = [];
            for (var i = 0; i < 8; i++) {
                var randNum = Math.floor(Math.random() * 15) + 1;
                arr.push(randNum);
            }
            console.log(ALG.insertionsort.makes(arr));
            break;

        default:
            alert("Unknown action!");
            break;
    }
}

$(document).on('click', '.link', simTest);