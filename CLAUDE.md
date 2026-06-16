# Tetris Game Project

## Project Overview

클래식 테트리스 게임을 FastAPI 백엔드와 SQLite 데이터베이스를 사용하여 구현한 풀스택 웹 애플리케이션입니다.

### Core Features
- 이메일 기반 회원가입/로그인 시스템
- JWT 토큰 인증
- SQLite 데이터베이스를 통한 영구 데이터 저장
- 모든 게임 플레이 자동 기록
- 전체 최고 점수 실시간 표시
- 리더보드 및 개인 통계 시스템

## Tech Stack

### Backend
- **FastAPI 0.115.6**: 웹 프레임워크
- **SQLAlchemy 2.0.36**: ORM (데이터베이스 관리)
- **SQLite**: 데이터베이스
- **Passlib (bcrypt)**: 비밀번호 해싱
- **python-jose**: JWT 토큰 생성/검증
- **email-validator**: 이메일 검증
- **Uvicorn**: ASGI 서버

### Frontend
- **HTML5 Canvas**: 게임 렌더링
- **Vanilla JavaScript (ES6+)**: 게임 로직 및 API 통신
- **CSS3**: 스타일링 및 애니메이션
- **LocalStorage**: JWT 토큰 저장

## Architecture

```
tetris/
├── backend/
│   ├── main.py          # FastAPI 애플리케이션 (API 엔드포인트)
│   ├── database.py      # SQLAlchemy 모델 (User, GameRecord)
│   └── auth.py          # JWT 인증 및 비밀번호 해싱
├── data/
│   └── tetris.db        # SQLite 데이터베이스 (자동 생성)
├── api-client.js        # 프론트엔드 API 클라이언트
├── tetris.js            # 게임 로직
├── game.html            # 게임 UI
├── style.css            # 스타일시트
└── requirements.txt     # Python 의존성
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Game Records Table
```sql
CREATE TABLE game_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id VARCHAR UNIQUE NOT NULL,
    score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    lines_cleared INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    started_at DATETIME NOT NULL,
    finished_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - 회원가입 (이메일, 사용자명, 비밀번호)
- `POST /api/auth/login` - 로그인 (JWT 토큰 반환)
- `GET /api/auth/me` - 현재 사용자 정보 (인증 필요)

### Game
- `POST /api/game/start` - 게임 시작 (인증 필요)
- `POST /api/game/finish` - 게임 종료 및 점수 저장 (인증 필요)

### Leaderboard & Statistics
- `GET /api/leaderboard/top-score` - 전체 최고 점수
- `GET /api/leaderboard?limit=N` - 리더보드 (상위 N명)
- `GET /api/user/stats` - 개인 통계 (인증 필요)
- `GET /api/user/history?limit=N` - 게임 히스토리 (인증 필요)
- `GET /api/stats` - 전체 통계

## Key Implementation Details

### Authentication Flow
1. 회원가입/로그인 시 JWT 토큰 발급 (7일 만료)
2. 토큰을 LocalStorage에 저장
3. 모든 API 요청에 `Authorization: Bearer {token}` 헤더 포함
4. 페이지 로드 시 저장된 토큰으로 자동 로그인 시도

### Password Security
- bcrypt 알고리즘으로 비밀번호 해싱
- Salt 자동 생성
- 평문 비밀번호는 저장하지 않음
- 최소 6자 이상 검증

### Game Session Management
1. 게임 시작 시 고유 session_id 생성
2. 게임 플레이 중 클라이언트에서 점수/레벨 추적
3. 게임 종료 시 자동으로 DB에 저장
4. 개인 최고 기록 및 전체 최고 기록 여부 확인

### Leaderboard Logic
- 각 사용자의 최고 점수만 리더보드에 표시
- SQL 서브쿼리를 사용하여 중복 제거
- 점수 기준 내림차순 정렬

### Top Score Display
- 페이지 로드 시 `/api/leaderboard/top-score` 호출
- 화면 상단 배너에 애니메이션과 함께 표시
- 트로피 아이콘 + 사용자명 + 점수 + 레벨 표시

## Game Mechanics

### Controls
- **←/→**: 좌우 이동
- **↑ / Space**: 회전
- **↓**: 빠른 하강

### Scoring
- 1줄: 100점
- 2줄: 300점
- 3줄: 500점
- 4줄 (테트리스): 800점

### Level Progression
- 10줄 클리어마다 레벨 업
- 레벨이 오를수록 낙하 속도 증가
- 최소 낙하 간격: 100ms

### Features
- 3D 블록 렌더링 (그라데이션, 하이라이트, 그림자)
- 다음 블록 미리보기
- 배경음악 (테트리스 멜로디)
- 음소거 기능

## Running the Application

### Installation
```bash
pip install -r requirements.txt
```

### Start Server
```bash
cd backend
python3 main.py
```

### Access
- Game: http://localhost:8000/game
- API Docs: http://localhost:8000/docs

## Testing

### API Test Script
```bash
./test_auth_api.sh
```

### Manual Testing
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"테스트","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Security Considerations

### Implemented
- ✅ bcrypt password hashing with automatic salt
- ✅ JWT tokens with expiration (7 days)
- ✅ Bearer token authentication
- ✅ CORS configuration
- ✅ SQLAlchemy ORM (SQL injection prevention)
- ✅ Email validation
- ✅ Password length validation (min 6 characters)

### Production Recommendations
- Use environment variables for SECRET_KEY
- Enable HTTPS
- Implement rate limiting
- Add email verification
- Set up proper logging
- Regular database backups

## Code Patterns

### Backend (FastAPI)
```python
# Dependency injection for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication dependency
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    # Verify JWT token and return user
    pass

# Protected endpoint
@app.get("/api/user/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    # Only authenticated users can access
    pass
```

### Frontend (JavaScript)
```javascript
// API client with automatic token management
class TetrisAPI {
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
    
    async finishGame(score, level, linesCleared) {
        const response = await fetch(`${API_BASE_URL}/api/game/finish`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ ... })
        });
        return await response.json();
    }
}
```

## Known Limitations

- Single-player only (no multiplayer)
- No password reset functionality
- No email verification
- No social login
- LocalStorage-based auth (not suitable for highly sensitive apps)
- SQLite (not recommended for high-concurrency production)

## Future Enhancements

- [ ] Password reset via email
- [ ] Email verification
- [ ] Social login (Google, GitHub)
- [ ] Real-time multiplayer
- [ ] Game replay system
- [ ] Friend system
- [ ] Achievements and badges
- [ ] Mobile app (React Native)
- [ ] PostgreSQL migration for production
- [ ] Redis for session management
- [ ] WebSocket for real-time leaderboard updates

## Development Notes

### Database Initialization
- Database and tables are created automatically on first run via SQLAlchemy
- `Base.metadata.create_all(bind=engine)` in `database.py`

### JWT Token Structure
```json
{
  "sub": "user@example.com",
  "exp": 1782203154
}
```

### LocalStorage Keys
- `access_token`: JWT token string
- `user`: JSON string of user object (id, email, username)

### Game Session Flow
```
User Login → Get JWT Token → Start Game → Generate Session ID
→ Play Game → Game Over → Save to DB (with session_id)
→ Check if Personal Best → Check if Global Best → Show Result
```

## Important Files

- `backend/main.py`: Main FastAPI application, all endpoints
- `backend/database.py`: SQLAlchemy models and database setup
- `backend/auth.py`: JWT and password hashing utilities
- `api-client.js`: Frontend API wrapper with authentication
- `tetris.js`: Game logic, rendering, and event handling
- `game.html`: UI structure including modals
- `style.css`: All styling including animations

## Contact

Developer: sprits88

## License

MIT License
