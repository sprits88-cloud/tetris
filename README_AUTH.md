# 🎮 테트리스 게임 - 완전한 백엔드 시스템

## 📋 개요

SQLite 데이터베이스와 JWT 인증을 사용하는 완전한 테트리스 게임 시스템입니다.

### 주요 기능

- ✅ **이메일 기반 회원가입/로그인**
- ✅ **JWT 토큰 인증**
- ✅ **SQLite 데이터베이스**
- ✅ **모든 게임 기록 저장**
- ✅ **전체 최고 점수 실시간 표시**
- ✅ **개인 통계 및 게임 히스토리**
- ✅ **리더보드 시스템**

## 🏗️ 시스템 아키텍처

```
tetris/
├── backend/
│   ├── main.py          # FastAPI 메인 애플리케이션
│   ├── database.py      # SQLAlchemy 데이터베이스 모델
│   └── auth.py          # JWT 인증 및 비밀번호 해싱
├── data/
│   └── tetris.db        # SQLite 데이터베이스 (자동 생성)
├── api-client.js        # 프론트엔드 API 클라이언트
├── tetris.js            # 게임 로직
├── game.html            # 게임 UI
└── style.css            # 스타일시트
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
pip install -r requirements.txt
```

### 2. 서버 실행

```bash
cd backend
python3 main.py
```

### 3. 브라우저 접속

```
http://localhost:8000/game
```

### 4. 회원가입 후 게임 플레이!

## 📊 데이터베이스 스키마

### Users 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 (자동 증가) |
| email | STRING | 이메일 (고유) |
| username | STRING | 사용자명 (고유) |
| password_hash | STRING | 해시된 비밀번호 |
| created_at | DATETIME | 가입 일시 |

### GameRecords 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 (자동 증가) |
| user_id | INTEGER | 사용자 ID (외래 키) |
| session_id | STRING | 게임 세션 ID (고유) |
| score | INTEGER | 점수 |
| level | INTEGER | 레벨 |
| lines_cleared | INTEGER | 클리어한 라인 수 |
| duration | INTEGER | 플레이 시간 (초) |
| started_at | DATETIME | 게임 시작 일시 |
| finished_at | DATETIME | 게임 종료 일시 |

## 🔐 API 엔드포인트

### 인증 API

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "플레이어1",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "플레이어1"
  }
}
```

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "플레이어1"
  }
}
```

#### 현재 사용자 정보
```http
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "username": "플레이어1",
  "created_at": "2026-06-16T12:00:00"
}
```

### 게임 API

#### 게임 시작
```http
POST /api/game/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_id": "session_1234567890"
}

Response:
{
  "success": true,
  "session_id": "session_1234567890",
  "user_id": 1,
  "username": "플레이어1",
  "message": "게임이 시작되었습니다."
}
```

#### 게임 종료 및 점수 저장
```http
POST /api/game/finish
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_id": "session_1234567890",
  "score": 5000,
  "level": 5,
  "lines_cleared": 42,
  "duration": 300
}

Response:
{
  "success": true,
  "message": "점수가 저장되었습니다.",
  "game_id": 1,
  "score": 5000,
  "is_personal_best": true,
  "is_global_best": false
}
```

### 통계 및 리더보드 API

#### 전체 최고 점수
```http
GET /api/leaderboard/top-score

Response:
{
  "has_record": true,
  "username": "플레이어1",
  "score": 8500,
  "level": 10,
  "lines_cleared": 120,
  "finished_at": "2026-06-16T15:30:00"
}
```

#### 리더보드
```http
GET /api/leaderboard?limit=10

Response:
[
  {
    "rank": 1,
    "username": "플레이어1",
    "email": "user@example.com",
    "score": 8500,
    "level": 10,
    "lines_cleared": 120,
    "finished_at": "2026-06-16T15:30:00"
  },
  ...
]
```

#### 사용자 통계
```http
GET /api/user/stats
Authorization: Bearer {token}

Response:
{
  "total_games": 25,
  "best_score": 8500,
  "total_score": 125000,
  "average_score": 5000.0,
  "total_lines_cleared": 1500
}
```

#### 사용자 게임 기록
```http
GET /api/user/history?limit=20
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "score": 5000,
    "level": 5,
    "lines_cleared": 42,
    "duration": 300,
    "finished_at": "2026-06-16T15:30:00"
  },
  ...
]
```

#### 전체 통계
```http
GET /api/stats

Response:
{
  "total_games": 150,
  "total_users": 25,
  "average_score": 3500.5,
  "highest_score": 8500,
  "total_lines_cleared": 5000
}
```

## 🎮 프론트엔드 기능

### 1. 인증 시스템
- 이메일 기반 회원가입
- 로그인/로그아웃
- JWT 토큰 자동 관리 (LocalStorage)
- 자동 인증 상태 확인

### 2. 게임 화면
- **전체 최고 점수 배너**: 화면 상단에 현재 최고 기록 실시간 표시
- **플레이어 정보**: 현재 로그인한 사용자명 표시
- **실시간 점수/레벨**: 게임 진행 중 업데이트
- **다음 블록 미리보기**

### 3. 통계 시스템
- **🏆 리더보드**: 전체 사용자 순위 (상위 10명)
- **📊 내 통계**: 개인 게임 통계 및 최근 기록

### 4. 게임 종료 시
- 자동으로 점수 저장
- 개인 최고 기록 여부 알림
- 전체 최고 기록 여부 알림

## 🔧 보안 기능

### 비밀번호 보안
- **bcrypt** 해싱 알고리즘 사용
- Salt 자동 생성
- 평문 비밀번호는 저장하지 않음

### JWT 토큰
- **HS256** 알고리즘
- 7일 만료 시간
- 토큰에는 이메일만 포함 (최소 정보 원칙)

### API 보안
- CORS 설정
- 인증 필수 엔드포인트 분리
- Bearer 토큰 인증

## 🧪 테스트

### API 테스트 스크립트 실행
```bash
./test_auth_api.sh
```

### 수동 테스트
```bash
# 회원가입
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"테스트유저","password":"password123"}'

# 로그인
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📦 요구사항

```
fastapi==0.115.6
uvicorn[standard]==0.34.0
python-multipart==0.0.20
sqlalchemy==2.0.36
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
email-validator==2.2.0
```

## 🎯 주요 기능 상세

### 1. 전체 최고 점수 실시간 표시
- 페이지 로드 시 자동으로 최고 점수 조회
- 화면 상단에 애니메이션 배너로 표시
- 트로피 아이콘과 함께 사용자명, 점수, 레벨 표시

### 2. 게임 기록 자동 저장
- 모든 게임이 종료될 때 자동으로 데이터베이스에 저장
- 세션 ID로 각 게임 고유 식별
- 플레이 시간, 점수, 레벨, 클리어 라인 수 기록

### 3. 개인화된 통계
- 총 게임 수
- 최고 점수
- 평균 점수
- 총 클리어 라인 수
- 최근 게임 기록 (최대 20개)

### 4. 리더보드 시스템
- 각 사용자의 최고 점수만 표시
- 금/은/동 메달 시각화 (1-3위)
- 실시간 순위 업데이트

## 🛠️ 커스터마이징

### JWT 시크릿 키 변경
`backend/auth.py`:
```python
SECRET_KEY = "your-super-secret-key-here"
```

### 토큰 만료 시간 변경
`backend/auth.py`:
```python
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30일
```

### 비밀번호 최소 길이 변경
`backend/main.py`:
```python
if len(user_data.password) < 8:  # 8자로 변경
    raise HTTPException(...)
```

## 🐛 문제 해결

### "이미 존재하는 이메일입니다" 오류
- 다른 이메일 주소 사용
- 또는 로그인 시도

### 토큰 만료
- 다시 로그인하여 새 토큰 발급

### 데이터베이스 초기화
```bash
rm data/tetris.db
# 서버 재시작 시 자동으로 새 DB 생성
```

### CORS 오류
- 백엔드와 프론트엔드가 같은 도메인에서 실행되는지 확인
- `backend/main.py`의 CORS 설정 확인

## 📊 데이터베이스 관리

### SQLite 데이터베이스 확인
```bash
sqlite3 data/tetris.db

# 사용자 목록 조회
SELECT * FROM users;

# 게임 기록 조회
SELECT * FROM game_records ORDER BY score DESC LIMIT 10;

# 사용자별 게임 수 조회
SELECT u.username, COUNT(*) as games
FROM users u
JOIN game_records gr ON u.id = gr.user_id
GROUP BY u.id;
```

## 🚀 배포 시 고려사항

1. **SECRET_KEY 변경**: 프로덕션 환경에서는 안전한 랜덤 키 사용
2. **HTTPS 사용**: JWT 토큰 보안을 위해 필수
3. **환경 변수**: 시크릿 키를 환경 변수로 관리
4. **데이터베이스 백업**: 정기적인 SQLite 파일 백업
5. **Rate Limiting**: API 남용 방지
6. **로그 관리**: 에러 로그 및 접근 로그 설정

## 📝 다음 단계

- [ ] 비밀번호 찾기 기능
- [ ] 이메일 인증
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 게임 리플레이 기능
- [ ] 친구 시스템
- [ ] 실시간 대결 모드
- [ ] 모바일 앱

## 📄 라이선스

MIT License

## 👨‍💻 개발자

sprits88

---

**즐거운 게임 되세요! 🎮✨**

더 자세한 API 문서: http://localhost:8000/docs
