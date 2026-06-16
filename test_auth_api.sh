#!/bin/bash

# Tetris Auth API 테스트 스크립트

API_URL="http://localhost:8000"

echo "=== Tetris Auth API 테스트 ==="
echo ""

# 1. 헬스 체크
echo "1. 헬스 체크"
curl -s "${API_URL}/health" | python3 -m json.tool
echo ""

# 2. 회원가입
echo "2. 회원가입"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test$(date +%s)@example.com\",
    \"username\": \"테스트유저$(date +%s)\",
    \"password\": \"password123\"
  }")

echo "$REGISTER_RESPONSE" | python3 -m json.tool
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
echo ""

if [ -z "$TOKEN" ]; then
  echo "토큰을 받지 못했습니다. 회원가입 실패."
  exit 1
fi

echo "받은 토큰: $TOKEN"
echo ""

# 3. 현재 사용자 정보
echo "3. 현재 사용자 정보"
curl -s "${API_URL}/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 4. 게임 시작
echo "4. 게임 시작"
SESSION_ID="test_session_$(date +%s)"
curl -s -X POST "${API_URL}/api/game/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"session_id\": \"${SESSION_ID}\"
  }" | python3 -m json.tool
echo ""

# 5. 게임 종료 및 점수 저장
echo "5. 게임 종료 및 점수 저장"
curl -s -X POST "${API_URL}/api/game/finish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"session_id\": \"${SESSION_ID}\",
    \"score\": 5000,
    \"level\": 5,
    \"lines_cleared\": 42,
    \"duration\": 300
  }" | python3 -m json.tool
echo ""

# 6. 전체 최고 점수
echo "6. 전체 최고 점수"
curl -s "${API_URL}/api/leaderboard/top-score" | python3 -m json.tool
echo ""

# 7. 리더보드 조회
echo "7. 리더보드 조회 (상위 5개)"
curl -s "${API_URL}/api/leaderboard?limit=5" | python3 -m json.tool
echo ""

# 8. 사용자 통계
echo "8. 사용자 통계"
curl -s "${API_URL}/api/user/stats" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 9. 사용자 게임 기록
echo "9. 사용자 게임 기록"
curl -s "${API_URL}/api/user/history?limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 10. 전체 통계
echo "10. 전체 통계"
curl -s "${API_URL}/api/stats" | python3 -m json.tool
echo ""

echo "=== 테스트 완료 ==="
