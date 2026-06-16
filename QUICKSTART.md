# 🚀 빠른 시작 가이드

## 1분 안에 시작하기

### 1단계: 서버 실행
```bash
cd backend
python3 main.py
```

또는:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2단계: 브라우저 접속
```
http://localhost:8000/game
```

### 3단계: 플레이!
1. 이름을 입력하세요
2. "게임 시작" 버튼을 클릭하세요
3. 화살표 키로 플레이하세요!

---

## 🎮 조작법

| 키 | 동작 |
|---|---|
| ← | 왼쪽으로 이동 |
| → | 오른쪽으로 이동 |
| ↑ | 블록 회전 |
| ↓ | 빠른 하강 |
| Space | 블록 회전 (대체) |

---

## 🏆 리더보드 확인

게임 화면에서 "🏆 순위" 버튼을 클릭하세요!

---

## 📡 API 문서

자동 생성된 API 문서 확인:
```
http://localhost:8000/docs
```

---

## 🧪 API 테스트

```bash
./test_api.sh
```

---

## 📊 주요 기능

✅ **실시간 게임 플레이**
- 클래식 테트리스 게임
- 레벨 자동 상승
- 점수 계산

✅ **백엔드 연동**
- 게임 세션 자동 추적
- 점수 자동 저장
- 리더보드 실시간 업데이트

✅ **리더보드 시스템**
- 상위 10명 랭킹
- 금/은/동 메달 표시
- 전체 게임 통계

✅ **플레이어 관리**
- 플레이어 이름 입력
- 개인 점수 기록
- 게임 히스토리

---

## 🛠️ 필수 요구사항

- Python 3.10+
- pip (Python 패키지 매니저)
- 최신 웹 브라우저 (Chrome, Firefox, Safari, Edge)

---

## 📦 의존성 설치

```bash
pip install -r requirements.txt
```

---

## 🔧 설정

### 포트 변경
`backend/main.py`의 마지막 줄:
```python
uvicorn.run(app, host="0.0.0.0", port=8080)  # 8080으로 변경
```

### 리더보드 개수 변경
`tetris.js`의 `showLeaderboard()` 함수:
```javascript
const leaderboard = await tetrisAPI.getLeaderboard(20);  // 20개로 변경
```

---

## 🐛 문제 해결

### "포트가 이미 사용 중입니다" 오류
```bash
# 실행 중인 프로세스 확인
lsof -i :8000

# 프로세스 종료
kill -9 <PID>
```

### 점수가 저장되지 않음
1. 브라우저 콘솔(F12) 확인
2. `data/` 디렉토리 생성 확인
3. 서버 로그 확인

### CORS 오류
- 백엔드와 프론트엔드가 같은 포트에서 실행되는지 확인
- `backend/main.py`의 CORS 설정 확인

---

## 📚 더 자세한 정보

- **전체 문서**: `README_API.md`
- **배포 가이드**: `deploy.md`
- **API 참조**: http://localhost:8000/docs

---

**즐거운 게임 되세요! 🎮✨**

문의사항이나 버그 리포트는 GitHub Issues를 이용해주세요.
