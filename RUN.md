# FastAPI Tetris Game - 실행 가이드

## 1. 필수 패키지 설치

먼저 pip를 설치합니다:
```bash
sudo apt update
sudo apt install python3-pip -y
```

그 다음 프로젝트 의존성을 설치합니다:
```bash
pip3 install -r requirements.txt
```

## 2. 서버 실행

### 방법 1: Python으로 직접 실행
```bash
python3 main.py
```

### 방법 2: uvicorn으로 실행 (개발 모드)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 방법 3: uvicorn으로 실행 (프로덕션 모드)
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 3. 접속

서버가 실행되면 다음 URL로 접속할 수 있습니다:

- **랜딩 페이지**: http://localhost:8000/
- **게임 페이지**: http://localhost:8000/game
- **API 문서**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 4. API 엔드포인트

- `GET /` - 랜딩 페이지
- `GET /game` - 테트리스 게임
- `GET /health` - 헬스체크
- `GET /landing.css` - 랜딩 페이지 스타일
- `GET /style.css` - 게임 스타일
- `GET /tetris.js` - 게임 로직

## 5. 포트 변경

다른 포트를 사용하려면:
```bash
uvicorn main:app --host 0.0.0.0 --port 원하는포트번호
```

## 6. 서버 중지

터미널에서 `Ctrl + C`를 누르면 서버가 중지됩니다.
