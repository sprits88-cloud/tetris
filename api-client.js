// Tetris Game API Client with Authentication

const API_BASE_URL = window.location.origin;

class TetrisAPI {
  constructor() {
    this.sessionId = null;
    this.gameStartTime = null;
    this.token = localStorage.getItem('access_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // 인증 관련 메서드
  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // 회원가입
  async register(email, username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '회원가입에 실패했습니다.');
      }

      this.setAuth(data.access_token, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('회원가입 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // 로그인
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '로그인에 실패했습니다.');
      }

      this.setAuth(data.access_token, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('로그인 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // 로그아웃
  logout() {
    this.clearAuth();
    window.location.href = '/game';
  }

  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const user = await response.json();
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      this.clearAuth();
      return null;
    }
  }

  // 게임 세션 시작
  async startGame() {
    if (!this.token) {
      throw new Error('로그인이 필요합니다.');
    }

    this.sessionId = this.generateSessionId();
    this.gameStartTime = new Date();

    try {
      const response = await fetch(`${API_BASE_URL}/api/game/start`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          session_id: this.sessionId
        })
      });

      const data = await response.json();
      console.log('게임 시작:', data);
      return data;
    } catch (error) {
      console.error('게임 시작 실패:', error);
      return null;
    }
  }

  // 게임 종료 및 점수 저장
  async finishGame(score, level, linesCleared) {
    if (!this.sessionId || !this.gameStartTime || !this.token) {
      console.error('세션 정보가 없거나 로그인이 필요합니다.');
      return null;
    }

    const now = new Date();
    const duration = Math.floor((now - this.gameStartTime) / 1000);

    const gameData = {
      session_id: this.sessionId,
      score: score,
      level: level,
      lines_cleared: linesCleared,
      duration: duration
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/game/finish`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(gameData)
      });

      const data = await response.json();
      console.log('게임 종료:', data);
      return data;
    } catch (error) {
      console.error('게임 종료 실패:', error);
      return null;
    }
  }

  // 리더보드 조회
  async getLeaderboard(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('리더보드 조회 실패:', error);
      return [];
    }
  }

  // 전체 최고 점수 조회
  async getTopScore() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard/top-score`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('최고 점수 조회 실패:', error);
      return null;
    }
  }

  // 사용자 통계 조회
  async getUserStats() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('사용자 통계 조회 실패:', error);
      return null;
    }
  }

  // 사용자 게임 기록 조회
  async getUserHistory(limit = 20) {
    if (!this.token) {
      return [];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/history?limit=${limit}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('사용자 기록 조회 실패:', error);
      return [];
    }
  }

  // 전체 통계 조회
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('통계 조회 실패:', error);
      return null;
    }
  }

  // 세션 ID 생성
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 현재 세션 정보 가져오기
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      gameStartTime: this.gameStartTime,
      user: this.user
    };
  }
}

// 전역 API 클라이언트 인스턴스
const tetrisAPI = new TetrisAPI();
