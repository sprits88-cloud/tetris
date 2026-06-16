# 테트리스 게임 실행 방법

이 문서는 테트리스 웹 애플리케이션을 로컬 및 배포 환경에서 실행하는 방법을 안내합니다.

## 로컬 실행

### 방법 1: 브라우저에서 직접 열기 (가장 간단)

1. 파일 탐색기에서 `index.html` 파일을 찾습니다
2. 파일을 더블클릭하거나 브라우저로 드래그합니다
3. 게임이 바로 실행됩니다

**장점**: 가장 빠르고 간단  
**단점**: 일부 브라우저에서 CORS 정책으로 인해 제한될 수 있음

---

### 방법 2: Python 내장 서버 (권장)

Python이 설치되어 있다면 가장 간단한 방법입니다.

```bash
# tetris 디렉토리로 이동
cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris

# Python 3로 HTTP 서버 시작
python3 -m http.server 8000
```

그 후 브라우저에서 접속:
```
http://localhost:8000
```

종료하려면 터미널에서 `Ctrl + C`

---

### 방법 3: Node.js serve 패키지

Node.js가 설치되어 있다면 npx를 사용할 수 있습니다.

```bash
# tetris 디렉토리로 이동
cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris

# serve 실행 (자동 설치 후 실행)
npx serve
```

기본적으로 `http://localhost:3000` 또는 다른 포트에서 실행됩니다.

---

### 방법 4: PHP 내장 서버

PHP가 설치되어 있다면 사용할 수 있습니다.

```bash
# tetris 디렉토리로 이동
cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris

# PHP 서버 시작
php -S localhost:8000
```

그 후 브라우저에서 접속:
```
http://localhost:8000
```

---

### 방법 5: VS Code Live Server 확장

VS Code를 사용 중이라면:

1. "Live Server" 확장 설치
2. `index.html` 파일을 오른쪽 클릭
3. "Open with Live Server" 선택
4. 자동으로 브라우저가 열립니다

---

## 온라인 배포

### GitHub Pages (무료, 추천)

1. **GitHub 리포지토리 생성**
   ```bash
   cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris
   git init
   git add .
   git commit -m "Add Tetris game"
   ```

2. **GitHub에 푸시**
   ```bash
   # GitHub에서 새 리포지토리 생성 후
   git remote add origin https://github.com/사용자명/tetris.git
   git branch -M main
   git push -u origin main
   ```

3. **GitHub Pages 활성화**
   - GitHub 리포지토리 페이지로 이동
   - Settings → Pages
   - Source: main 브랜치 선택
   - Save 클릭

4. **접속**
   - 5-10분 후 `https://사용자명.github.io/tetris/` 에서 접속 가능

---

### Netlify (무료, 드래그 앤 드롭)

1. [Netlify](https://www.netlify.com/)에 가입
2. "Add new site" → "Deploy manually" 선택
3. tetris 폴더를 드래그 앤 드롭
4. 자동으로 URL 생성 (예: `https://random-name-123.netlify.app`)
5. 원하면 커스텀 도메인 설정 가능

---

### Vercel (무료)

1. [Vercel](https://vercel.com/)에 가입
2. "New Project" 클릭
3. GitHub 리포지토리 연결 또는 파일 업로드
4. 자동 배포 및 URL 생성

---

## 테스트 체크리스트

배포 후 다음을 확인하세요:

- [ ] 페이지가 정상적으로 로드되는가?
- [ ] 시작 버튼이 작동하는가?
- [ ] 블록이 떨어지는가?
- [ ] 방향키로 이동/회전이 되는가?
- [ ] 라인이 클리어되는가?
- [ ] 점수가 올라가는가?
- [ ] 게임 오버가 정상적으로 작동하는가?
- [ ] 재시작 버튼이 작동하는가?

---

## 문제 해결

### 페이지가 열리지 않을 때

- 파일 경로가 올바른지 확인
- 브라우저 캐시 삭제 (Ctrl + Shift + Delete)
- 다른 브라우저에서 시도

### 키보드 입력이 작동하지 않을 때

- 페이지를 클릭하여 포커스 확인
- 브라우저 개발자 도구(F12)에서 에러 확인

### 블록이 보이지 않을 때

- 브라우저 콘솔에서 JavaScript 에러 확인
- Canvas가 제대로 렌더링되는지 확인

---

## 시스템 요구사항

- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- JavaScript 활성화
- HTML5 Canvas 지원

---

## 포트 변경

기본 포트(8000)가 사용 중이라면:

```bash
# Python - 다른 포트 사용
python3 -m http.server 3000

# PHP - 다른 포트 사용
php -S localhost:3000
```
