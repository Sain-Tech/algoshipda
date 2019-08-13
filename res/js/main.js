// 문서가 로드되었을때 실행할 코드들...
$(document).ready(function () {
    init();
    console.log(ALG.hanoi.makes(3));
});

// 시뮬레이터 초기화 함수
var init = () => {
    // PIXI 버전 및 모드 콘솔에 띄우기
    initSim.test();
    initsimHanoi();
}