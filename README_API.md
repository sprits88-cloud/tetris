# 테트리스 게임 - FastAPI 백엔드 연동

## 📋 개요

이 프로젝트는 클래식 테트리스 게임을 FastAPI 백엔드와 연동하여 다음 기능을 제공합니다:

- 🎮 실시간 게임 플레이
- 💾 게임 세션 관리 (시작/일시정지/재개/종료)
- 🏆 리더보드 및 랭킹 시스템
- 📊 게임 통계 추적
- 👤 플레이어 점수 기록

## 🏗️ 아키텍처

```
tetris/
├── backend/
│   └── main.py              # FastAPI 백엔드 서버
├── data/                    # 데이터 저장 디렉토리
│   ├── scores.json         # 점수 기록
│   └── games.json          # 게임 세션
├── api-client.js           # 프론트엔드 API 클라이언트
├── tetris.js               # 게임 로직 (백엔드 연동)
├── game.html               # 게임 페이지 (UI 개선)
└── style.css               # 스타일 (모달 추가)
```

## 🚀 실행 방법

### 1. 백엔드 서버 시작

```bash
cd backend
python3 main.py
```

또는 uvicorn으로 실행:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 브라우저에서 접속

- **게임 플레이**: http://localhost:8000/game
- **랜딩 페이지**: http://localhost:8000/
- **API 문서**: http://localhost:8000/docs

## 📡 API 엔드포인트

### 게임 세션 관리

#### 게임 시작
```http
POST /api/game/start
Content-Type: application/json

{
  "session_id": "session_1234567890_abc123",
  "player_name": "플레이어1",
  "started_at": "2026-06-16T12:00:00Z",
  "status": "playing"
}
```

#### 게임 일시정지
```http
POST /api/game/pause/{session_id}
```

#### 게임 재개
```http
POST /api/game/resume/{session_id}
```

#### 게임 종료 및 점수 저장
```http
POST /api/game/finish
Content-Type: application/json

{
  "session_id": "session_1234567890_abc123",
  "player_name": "플레이어1",
  "score": 5000,
  "level": 5,
  "lines_cleared": 42,
  "duration": 300,
  "finished_at": "2026-06-16T12:05:00Z"
}
```

### 점수 및 통계

#### 리더보드 조회
```http
GET /api/leaderboard?limit=10
```

응답:
```json
[
  {
    "rank": 1,
    "player_name": "플레이어1",
    "score": 5000,
    "level": 5,
    "lines_cleared": 42,
    "finished_at": "2026-06-16T12:05:00Z"
  }
]
```

#### 플레이어 점수 기록 조회
```http
GET /api/scores/player/{player_name}?limit=10
```

#### 전체 통계
```http
GET /api/stats
```

응답:
```json
{
  "total_games": 150,
  "total_players": 25,
  "average_score": 2500.5,
  "highest_score": 8500,
  "total_lines_cleared": 3200
}
```

### 헬스 체크
```http
GET /health
```

## 🎮 프론트엔드 기능

### 1. 플레이어 이름 입력
- 게임 시작 전 플레이어 이름 입력 모달
- Enter 키로 빠른 시작

### 2. 게임 플레이
- 기존 테트리스 게임 로직 유지
- 백엔드와 자동 연동
- 게임 시작/종료 시 자동으로 데이터 저장

### 3. 리더보드
- 🏆 순위 버튼 클릭으로 리더보드 확인
- 상위 10명 플레이어 표시
- 금/은/동 메달 표시 (1-3위)
- 전체 게임 통계 표시

### 4. 조작법
- **←/→**: 좌우 이동
- **↑**: 블록 회전
- **↓**: 빠른 하강
- **스페이스바**: 블록 회전 (대체)

## 📦 데이터 저장

### scores.json 구조
```json
[
  {
    "session_id": "session_1234567890_abc123",
    "player_name": "플레이어1",
    "score": 5000,
    "level": 5,
    "lines_cleared": 42,
    "duration": 300,
    "finished_at": "2026-06-16T12:05:00Z"
  }
]
```

### games.json 구조
```json
[
  {
    "session_id": "session_1234567890_abc123",
    "player_name": "플레이어1",
    "started_at": "2026-06-16T12:00:00Z",
    "status": "finished"
  }
]
```

## 🔧 커스터마이징

### 포트 변경
`backend/main.py` 파일의 마지막 줄 수정:
```python
uvicorn.run(app, host="0.0.0.0", port=원하는포트)
```

### 리더보드 개수 변경
`tetris.js`의 `showLeaderboard()` 함수에서:
```javascript
const leaderboard = await tetrisAPI.getLeaderboard(20); // 20개로 변경
```

### API URL 변경
`api-client.js`의 `API_BASE_URL` 수정:
```javascript
const API_BASE_URL = 'http://your-api-server.com';
```

## 🛠️ 개발 환경

- Python 3.10+
- FastAPI 0.115.6
- Uvicorn 0.34.0
- HTML5 Canvas
- Vanilla JavaScript (ES6+)

## 📝 주요 변경사항

### 백엔드 (backend/main.py)
- ✅ RESTful API 설계
- ✅ 게임 세션 관리
- ✅ 점수 저장 및 조회
- ✅ 리더보드 시스템
- ✅ 통계 집계
- ✅ CORS 설정

### 프론트엔드
- ✅ API 클라이언트 모듈 (api-client.js)
- ✅ 플레이어 이름 입력 UI
- ✅ 리더보드 모달
- ✅ 자동 게임 세션 추적
- ✅ 게임 종료 시 자동 점수 저장

## 🎯 향후 개선 가능 사항

- [ ] 사용자 인증 시스템
- [ ] 게임 리플레이 기능
- [ ] 실시간 멀티플레이어
- [ ] WebSocket을 통한 실시간 리더보드 업데이트
- [ ] 게임 통계 차트 및 시각화
- [ ] 모바일 터치 컨트롤
- [ ] 난이도 설정
- [ ] 테마 커스터마이징

## 🐛 문제 해결

### 서버가 시작되지 않을 때
```bash
# 포트가 이미 사용 중인지 확인
lsof -i :8000

# 프로세스 종료
kill -9 <PID>
```

### 데이터가 저장되지 않을 때
- `data/` 디렉토리가 자동 생성되는지 확인
- 파일 권한 확인
- 브라우저 콘솔에서 API 요청 확인

### CORS 오류가 발생할 때
- `backend/main.py`의 CORS 설정 확인
- 프론트엔드와 백엔드가 같은 도메인에서 실행되는지 확인

## 📄 라이선스

MIT License

## 👨‍💻 개발자

sprits88

---

**즐거운 게임 되세요! 🎮✨**
