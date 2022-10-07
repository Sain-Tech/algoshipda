# [토이프로젝트] 알고싶다

- 알고리즘을 공부하다가 입력값을 직접 커스터마이징 하면서 그래픽으로 보여주면 좋겠다고 판단해서 간단히 만들어본 앱입니다.   
- 하노이탑, 선택정렬, 삽입정렬까지 구현해봤습니다.   
- 일반 브라우저와 안드로이드 웹앱으로도 빌드하여 실행 가능하도록 프로젝트를 구성하였습니다.   
> [서비스 링크로 이동](https://algoshipda.vercel.app/)

![image](https://user-images.githubusercontent.com/5365310/162261553-e6adb7d1-4dc7-4841-97df-7b128c220be0.png)

## 실행 방법?

```sh
### 프로젝트 가져오기 ###
$ git init
$ git remote add origin https://github.com/Sain-Tech/algoshipda.git
$ git pull origin master

## 브라우저 실행
app/src/main/assets/index.html 열기
```

## 프로젝트 구조

```sh
app - 기본 안드로이드 앱 프로젝트
  src - 소스파일
  main - 안드로이드 프로젝트 소스
    assets - 웹 소스코드
      res - 소스
        cs - 스타일 파일
        img - 이미지 파일
        js - 자바스크립트
          assets
            Tween.min.js - PixiJS 트윈 애니메이션 라이브러리
            algorithms.js - 알고리즘 핵심 모듈
            jquery-3.4.1.min.js
            layout-debugger
            pixi.min.js - PixiJS (현재는 CDN 으로 최신 버전 불러오도록 수정함)
          sims - 그래픽 시뮬레이션 모듈
            hanoi.js - 하노이탑
            insertion-sort.js - 삽입정렬
            selection-sort.js - 선택정렬
          common.js
          main.js
        uilib - Semantic-UI 라이브러리
      index.html - 인덱스 메인
    java/com/example/webex - 안드로이드 웹 앱 메인 코드
      MainActivity.java - 앱 메인 액티비티
    res - 안드로이드 앱 리소스
    AndroidMainifest.xml - 안드로이드 앱 매니페스트
```
