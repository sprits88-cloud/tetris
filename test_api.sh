#!/bin/bash

# Tetris API 테스트 스크립트

API_URL="http://localhost:8000"

echo "=== Tetris API 테스트 ==="
echo ""

# 1. 헬스 체크
echo "1. 헬스 체크"
curl -s "${API_URL}/health" | python3 -m json.tool
echo ""

# 2. 게임 시작
echo "2. 게임 시작"
SESSION_ID="test_session_$(date +%s)"
curl -s -X POST "${API_URL}/api/game/start" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"${SESSION_ID}\",
    \"player_name\": \"테스트플레이어\",
    \"started_at\": \"$(date -Iseconds)\",
    \"status\": \"playing\"
  }" | python3 -m json.tool
echo ""

# 3. 게임 일시정지
echo "3. 게임 일시정지"
curl -s -X POST "${API_URL}/api/game/pause/${SESSION_ID}" | python3 -m json.tool
echo ""

# 4. 게임 재개
echo "4. 게임 재개"
curl -s -X POST "${API_URL}/api/game/resume/${SESSION_ID}" | python3 -m json.tool
echo ""

# 5. 게임 종료 및 점수 저장
echo "5. 게임 종료 및 점수 저장"
curl -s -X POST "${API_URL}/api/game/finish" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"${SESSION_ID}\",
    \"player_name\": \"테스트플레이어\",
    \"score\": 5000,
    \"level\": 5,
    \"lines_cleared\": 42,
    \"duration\": 300,
    \"finished_at\": \"$(date -Iseconds)\"
  }" | python3 -m json.tool
echo ""

# 6. 리더보드 조회
echo "6. 리더보드 조회 (상위 5개)"
curl -s "${API_URL}/api/leaderboard?limit=5" | python3 -m json.tool
echo ""

# 7. 플레이어 점수 조회
echo "7. 플레이어 점수 조회"
curl -s "${API_URL}/api/scores/player/테스트플레이어" | python3 -m json.tool
echo ""

# 8. 전체 통계
echo "8. 전체 통계"
curl -s "${API_URL}/api/stats" | python3 -m json.tool
echo ""

echo "=== 테스트 완료 ==="
