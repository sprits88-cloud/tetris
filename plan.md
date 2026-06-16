# 테트리스 웹 애플리케이션 MVP 구현 계획

## Context

사용자는 브라우저에서 바로 실행 가능한 간단한 테트리스 웹 애플리케이션을 요청했습니다. 고급 기능은 제외하고 **최소한의 핵심 기능만 포함한 MVP 버전**이 필요합니다.

현재 디렉토리(`/home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris`)는 비어있으며, 처음부터 구현해야 합니다.

## 최소 기능 요구사항

### 포함할 기능 (MVP)
- ✅ 7가지 테트리스 블록 (I, O, T, S, Z, L, J)
- ✅ 블록 이동 (좌/우 방향키, 아래 방향키로 빠른 하강)
- ✅ 블록 회전 (스페이스바 또는 위 방향키)
- ✅ 자동 낙하
- ✅ 라인 클리어 (한 줄이 완성되면 제거)
- ✅ 점수 표기 (라인 클리어 시 점수 증가)
- ✅ 다음 블록 미리보기
- ✅ 게임 오버 감지
- ✅ 간단한 시작/재시작 버튼

### 제외할 고급 기능
- ❌ Hold 기능 (블록 보관)
- ❌ Ghost piece (착지 위치 미리보기)
- ❌ 레벨/난이도 시스템
- ❌ 사운드 효과
- ❌ 복잡한 애니메이션
- ❌ 터치 컨트롤 (데스크톱 키보드만)
- ❌ 하이스코어 저장
- ❌ 다국어 지원 (한국어만)

## 파일 구조

```
tetris/
├── index.html          # 메인 HTML (게임 보드 + UI 마크업만)
├── style.css           # 모든 스타일링
├── tetris.js           # 모든 게임 로직 및 이벤트 처리
└── README.md           # 실행 방법 안내
```

**3개의 분리된 파일**:
- **index.html**: 구조만 (Canvas, 버튼, 텍스트 요소)
- **style.css**: 모든 CSS (레이아웃, 색상, 폰트)
- **tetris.js**: 모든 JavaScript (게임 로직, 렌더링, 이벤트)

## 구현 상세

### 1. index.html (구조만)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>테트리스 게임</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>🎮 테트리스 게임</h1>
    <div class="game-area">
      <canvas id="gameBoard"></canvas>
      <div class="sidebar">
        <div class="score-panel">
          <h2>점수</h2>
          <div id="score">0</div>
        </div>
        <div class="next-panel">
          <h2>다음 블록</h2>
          <canvas id="nextPiece"></canvas>
        </div>
        <button id="startBtn">시작</button>
        <div class="controls">
          <h3>조작법</h3>
          <p>← → : 이동</p>
          <p>↑ : 회전</p>
          <p>↓ : 빠른 하강</p>
        </div>
      </div>
    </div>
  </div>
  <script src="tetris.js"></script>
</body>
</html>
```
- **순수 HTML만** - 스타일 인라인 없음, 스크립트 태그 없음 (외부 링크만)
- Canvas 2개: 메인 게임 보드 + 다음 블록 미리보기
- 버튼, 점수 표시, 조작법 안내

### 2. style.css (모든 스타일)
```css
/* 전역 스타일 */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { 
  font-family: 'Malgun Gothic', sans-serif;
  background: #1a1a2e;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 컨테이너 */
.container { text-align: center; }
h1 { margin-bottom: 20px; }

/* 게임 영역 레이아웃 */
.game-area {
  display: flex;
  gap: 30px;
  justify-content: center;
}

/* Canvas 스타일 */
#gameBoard {
  border: 3px solid #0f3460;
  background: #16213e;
  box-shadow: 0 0 20px rgba(94, 240, 246, 0.3);
}

/* 사이드바 */
.sidebar { 
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}
/* ... (나머지 스타일) */
```
- **모든 CSS를 이 파일에** - 레이아웃, 색상, 폰트, 애니메이션
- 다크 테마 (#1a1a2e 배경)
- Flexbox 레이아웃
- 버튼, Canvas 테두리 스타일

### 3. tetris.js (모든 JavaScript 로직)

#### 주요 상수 및 데이터
```javascript
// 게임 설정
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 20
const DROP_INTERVAL = 1000 // 1초마다 자동 낙하

// 테트로미노 모양 정의 (7가지)
const TETROMINOS = {
  I: [[1,1,1,1]], // 막대
  O: [[1,1],[1,1]], // 정사각형
  T: [[0,1,0],[1,1,1]], // T자
  S: [[0,1,1],[1,1,0]], // S자
  Z: [[1,1,0],[0,1,1]], // Z자
  L: [[1,0,0],[1,1,1]], // L자
  J: [[0,0,1],[1,1,1]] // J자 (역L)
}

// 색상 매핑
const COLORS = {
  I: '#00f0f0', O: '#f0f000', T: '#a000f0',
  S: '#00f000', Z: '#f00000', L: '#f0a000', J: '#0000f0'
}
```

#### 핵심 클래스/함수

1. **게임 상태 관리**
   - `gameBoard` - 20x10 2차원 배열 (0=빈칸, 1-7=고정된 블록)
   - `currentPiece` - 현재 떨어지는 블록 {type, x, y, shape}
   - `nextPiece` - 다음 블록
   - `score` - 현재 점수
   - `gameOver` - 게임 종료 여부

2. **초기화 함수**
   - `init()` - 게임 초기화, 보드 리셋, 첫 블록 생성
   - `randomPiece()` - 랜덤 블록 생성

3. **블록 제어**
   - `moveLeft()` / `moveRight()` - 좌우 이동
   - `moveDown()` - 아래로 이동 (충돌 시 고정)
   - `rotate()` - 시계방향 90도 회전
   - `drop()` - 즉시 바닥까지 떨어뜨리기 (선택사항)

4. **충돌 감지**
   - `isCollision(piece, offsetX, offsetY)` - 블록이 벽/바닥/다른 블록과 충돌 여부 확인

5. **블록 고정 및 라인 클리어**
   - `lockPiece()` - 현재 블록을 게임 보드에 고정
   - `clearLines()` - 완성된 라인 제거 및 점수 계산
   - 점수 계산: 1줄=100점, 2줄=300점, 3줄=500점, 4줄=800점

6. **렌더링**
   - `draw()` - Canvas에 게임 보드 + 현재 블록 그리기
   - `drawNextPiece()` - 다음 블록 미리보기 그리기

7. **게임 루프**
   - `setInterval(() => moveDown(), DROP_INTERVAL)` - 1초마다 자동 낙하
   - 키보드 이벤트 리스너 (좌우 이동, 회전, 빠른 하강)

8. **게임 오버**
   - `checkGameOver()` - 새 블록이 생성 위치에 이미 블록이 있으면 게임 오버
   - 게임 오버 시 "게임 오버" 메시지 표시 및 재시작 버튼 활성화

## 키보드 조작

- **←** (왼쪽 화살표): 블록 왼쪽 이동
- **→** (오른쪽 화살표): 블록 오른쪽 이동
- **↓** (아래 화살표): 블록 빠른 하강
- **↑** (위 화살표) 또는 **스페이스바**: 블록 회전

## UI 레이아웃

```
┌─────────────────────────────────────┐
│           🎮 테트리스 게임           │
├─────────────────┬───────────────────┤
│                 │  점수: 0          │
│   게임 보드     │  ┌─────────┐     │
│   (Canvas)      │  │ 다음블록│     │
│   200x400px     │  └─────────┘     │
│                 │  [시작/재시작]    │
│                 │  조작법:          │
│                 │  ← → ↓ ↑         │
└─────────────────┴───────────────────┘
```

## 구현 순서

### 1단계: 파일 생성 및 기본 구조 (30분)
- **index.html** 작성: HTML 구조만 (Canvas, 버튼, div 요소)
- **style.css** 작성: 모든 CSS 스타일 (레이아웃, 색상, 폰트)
- **tetris.js** 시작: 상수 정의, 테트로미노 모양/색상

### 2단계: 렌더링 (30분)
- Canvas 초기화
- 빈 게임 보드 그리기 (격자)
- 테스트용 블록 1개 그리기

### 3단계: 블록 이동 및 충돌 감지 (1시간)
- 키보드 입력 처리
- `moveLeft()`, `moveRight()`, `moveDown()` 구현
- `isCollision()` 충돌 감지 구현
- 블록이 벽/바닥에 닿으면 멈추기

### 4단계: 회전 및 블록 고정 (45분)
- `rotate()` 회전 로직 (행렬 90도 회전)
- `lockPiece()` 블록 고정
- 새 블록 자동 생성

### 5단계: 라인 클리어 및 점수 (30분)
- `clearLines()` 완성된 줄 제거
- 점수 계산 및 UI 업데이트

### 6단계: 게임 루프 및 게임 오버 (30분)
- 자동 낙하 타이머
- 게임 오버 조건 체크
- 재시작 기능

### 7단계: 다음 블록 미리보기 및 마무리 (30분)
- 다음 블록 미리보기 Canvas
- README.md 작성
- 최종 테스트 및 버그 수정

**총 예상 시간: 4-5시간**

## 검증 방법

### 수동 테스트
1. `index.html`을 브라우저에서 열기
2. 시작 버튼 클릭
3. 블록 이동/회전 테스트
4. 라인 클리어 확인 (한 줄 완성 시 제거되는지)
5. 점수가 올라가는지 확인
6. 게임 오버 조건 확인 (블록이 맨 위까지 쌓이면)
7. 재시작 버튼 테스트

### 체크리스트
- [ ] 7가지 블록이 모두 랜덤하게 나타나는가?
- [ ] 좌우 방향키로 이동이 잘 되는가?
- [ ] 회전이 자연스럽게 작동하는가?
- [ ] 블록이 벽을 통과하지 않는가?
- [ ] 블록끼리 충돌이 정상적으로 감지되는가?
- [ ] 라인이 완성되면 제거되는가?
- [ ] 점수가 정확하게 계산되는가?
- [ ] 게임 오버가 정상적으로 작동하는가?
- [ ] 재시작 버튼이 게임을 초기화하는가?

## 브라우저 실행 방법

### 방법 1: 직접 열기
```bash
# 파일 탐색기에서 index.html을 더블클릭
# 또는 브라우저에 index.html 드래그
```

### 방법 2: 로컬 서버 (권장)
```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx 사용)
npx serve

# PHP
php -S localhost:8000
```

그 후 브라우저에서 `http://localhost:8000` 접속

## 주요 파일 위치

- `/home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris/index.html`
- `/home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris/style.css`
- `/home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris/tetris.js`

## 코드 작성 원칙

1. **간결성 우선** - 복잡한 추상화 없이 직관적인 코드
2. **주석 최소화** - 코드 자체가 설명이 되도록
3. **단일 파일 JS** - 모듈화 없이 한 파일에 모든 로직
4. **바닐라 JS** - 라이브러리/프레임워크 없음
5. **고정 크기** - 반응형 불필요, 단순한 레이아웃

이 계획은 **3-5시간 내에 구현 가능한 MVP**로 설계되었으며, 브라우저에서 바로 실행할 수 있는 완전히 독립적인 웹 애플리케이션입니다.
