# 테트리스 게임

브라우저에서 바로 실행 가능한 간단한 테트리스 웹 애플리케이션입니다.

## 기능

- ✅ 7가지 테트리스 블록 (I, O, T, S, Z, L, J)
- ✅ 블록 이동 및 회전
- ✅ 자동 낙하
- ✅ 라인 클리어 및 점수 시스템
- ✅ 다음 블록 미리보기
- ✅ 게임 오버 감지

## 실행 방법

### 방법 1: 직접 열기
`index.html` 파일을 브라우저에서 더블클릭하거나 드래그하여 실행

### 방법 2: 로컬 서버 (권장)
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

그 후 브라우저에서 `http://localhost:8000` 접속

## 조작법

- **← →** : 블록 좌우 이동
- **↑** : 블록 회전
- **↓** : 빠른 하강

## 점수 계산

- 1줄 클리어: 100점
- 2줄 클리어: 300점
- 3줄 클리어: 500점
- 4줄 클리어: 800점

## 파일 구조

```
tetris/
├── index.html    # HTML 구조
├── style.css     # 스타일링
├── tetris.js     # 게임 로직
└── README.md     # 이 파일
```

## 기술 스택

- HTML5 Canvas
- CSS3
- Vanilla JavaScript (ES6+)
