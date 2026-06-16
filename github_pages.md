# GitHub Pages 배포 가이드

이 문서는 테트리스 게임을 GitHub Pages를 통해 무료로 배포하는 방법을 단계별로 설명합니다.

## 📋 목차

1. [사전 준비](#사전-준비)
2. [GitHub 리포지토리 생성](#github-리포지토리-생성)
3. [코드 업로드](#코드-업로드)
4. [GitHub Pages 활성화](#github-pages-활성화)
5. [배포 확인](#배포-확인)
6. [문제 해결](#문제-해결)

---

## 사전 준비

### 필요한 것
- GitHub 계정 (없으면 [github.com](https://github.com)에서 무료 가입)
- Git 설치 (확인: `git --version`)
- 테트리스 게임 파일들

### 현재 파일 구조
```
tetris/
├── index.html          # 랜딩 페이지
├── game.html           # 게임 페이지
├── landing.css         # 랜딩 페이지 스타일
├── style.css           # 게임 스타일
├── tetris.js           # 게임 로직
├── README.md           # 프로젝트 설명
├── deploy.md           # 배포 가이드
└── github_pages.md     # 이 문서
```

---

## GitHub 리포지토리 생성

### 1. GitHub 웹사이트에서 생성

1. [GitHub](https://github.com)에 로그인
2. 오른쪽 상단 `+` 버튼 클릭 → `New repository` 선택
3. 리포지토리 정보 입력:
   - **Repository name**: `tetris-game` (원하는 이름)
   - **Description**: "Classic Tetris game with Web Audio API"
   - **Public** 선택 (필수 - Private는 유료 계정 필요)
   - **Initialize this repository with:** 체크하지 않음
4. `Create repository` 클릭

### 2. 리포지토리 URL 복사

생성 후 표시되는 URL을 복사해두세요:
```
https://github.com/사용자명/tetris-game.git
```

---

## 코드 업로드

### 방법 1: 명령줄 (Git CLI)

#### 1단계: Git 초기화

```bash
# 테트리스 프로젝트 디렉토리로 이동
cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/sprits88-cloud/day01/tetris

# Git 저장소 초기화
git init

# Git 사용자 정보 설정 (처음 한 번만)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### 2단계: 파일 추가 및 커밋

```bash
# 모든 파일 스테이징
git add .

# 커밋 생성
git commit -m "Initial commit: Add Tetris game with 3D blocks and BGM"
```

#### 3단계: GitHub에 푸시

```bash
# 원격 저장소 연결
git remote add origin https://github.com/사용자명/tetris-game.git

# 기본 브랜치를 main으로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**인증 방법:**
- Username: GitHub 사용자명
- Password: Personal Access Token (PAT) 사용 필요
  - GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - `repo` 권한 선택

### 방법 2: GitHub 웹 인터페이스 (간단)

1. GitHub 리포지토리 페이지로 이동
2. `uploading an existing file` 클릭
3. 모든 파일을 드래그 앤 드롭
4. Commit message 입력
5. `Commit changes` 클릭

---

## GitHub Pages 활성화

### 1. Settings로 이동

1. GitHub 리포지토리 페이지에서 `Settings` 탭 클릭
2. 왼쪽 메뉴에서 `Pages` 클릭

### 2. Source 설정

- **Source**: Deploy from a branch
- **Branch**: `main` 선택
- **Folder**: `/ (root)` 선택
- `Save` 클릭

### 3. 배포 대기

- 첫 배포는 1-5분 정도 소요됩니다
- 페이지를 새로고침하면 배포 URL이 표시됩니다

---

## 배포 확인

### 접속 URL

배포 완료 후 다음 URL로 접속 가능합니다:

```
https://사용자명.github.io/tetris-game/
```

예시:
- 사용자명이 `sprits88`이고 리포지토리명이 `tetris-game`인 경우:
- `https://sprits88.github.io/tetris-game/`

### 페이지 구조

- **랜딩 페이지**: `https://사용자명.github.io/tetris-game/`
- **게임 페이지**: `https://사용자명.github.io/tetris-game/game.html`

### 배포 상태 확인

1. GitHub 리포지토리 페이지로 이동
2. `Actions` 탭 클릭
3. 최근 workflow 실행 상태 확인
   - ✅ 초록색 체크: 성공
   - ❌ 빨간색 X: 실패 (로그 확인)

---

## 코드 업데이트 및 재배포

### 수정 사항 반영하기

```bash
# 파일 수정 후

# 변경 사항 확인
git status

# 수정된 파일 스테이징
git add .

# 커밋
git commit -m "Update: 수정 내용 설명"

# GitHub에 푸시
git push origin main
```

**자동 재배포**: 푸시 후 1-2분 내에 자동으로 사이트가 업데이트됩니다.

---

## 문제 해결

### 1. 페이지가 404 Not Found를 표시하는 경우

**원인**: GitHub Pages가 아직 활성화되지 않았거나 배포 중

**해결책**:
- Settings → Pages에서 배포 상태 확인
- 5분 정도 기다린 후 다시 시도
- 브라우저 캐시 삭제 (Ctrl + Shift + Delete)

### 2. 리소스 파일(CSS, JS)이 로드되지 않는 경우

**원인**: 상대 경로 문제

**해결책**:
- 모든 파일이 같은 디렉토리에 있는지 확인
- HTML 파일의 경로가 올바른지 확인:
  ```html
  <link rel="stylesheet" href="style.css">
  <script src="tetris.js"></script>
  ```

### 3. 푸시가 거부되는 경우

**원인**: 인증 실패 또는 권한 부족

**해결책**:
```bash
# Personal Access Token 사용
git remote set-url origin https://토큰@github.com/사용자명/tetris-game.git

# 또는 SSH 사용
git remote set-url origin git@github.com:사용자명/tetris-game.git
```

### 4. 음악이 재생되지 않는 경우

**원인**: Web Audio API는 사용자 상호작용 필요

**해결책**:
- 이미 구현됨 (시작 버튼 클릭 시 재생)
- HTTPS로 접속 확인 (GitHub Pages는 자동으로 HTTPS 제공)

### 5. 배포는 성공했지만 페이지가 비어있는 경우

**원인**: `index.html`이 없거나 경로 문제

**해결책**:
- 루트 디렉토리에 `index.html` 파일이 있는지 확인
- 파일명이 정확한지 확인 (대소문자 구분)

---

## 커스텀 도메인 설정 (선택 사항)

### 1. 도메인 구매

예: `mytetris.com` 구매 (Namecheap, GoDaddy 등)

### 2. DNS 설정

도메인 제공업체에서 다음 레코드 추가:

```
Type: A
Host: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Type: CNAME
Host: www
Value: 사용자명.github.io
```

### 3. GitHub Pages 설정

1. Settings → Pages
2. Custom domain에 도메인 입력
3. `Enforce HTTPS` 체크
4. Save 클릭

DNS 전파는 최대 24시간 소요될 수 있습니다.

---

## 성능 최적화 팁

### 1. 파일 압축

```bash
# HTML, CSS, JS 파일 압축 도구 사용
# 예: online-compressor, minifier 등
```

### 2. 이미지 최적화

현재는 이미지가 없지만, 추가 시 WebP 포맷 사용 권장

### 3. 캐싱 활용

GitHub Pages는 자동으로 캐싱을 제공합니다.

---

## 추가 리소스

### 공식 문서
- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Git 기초](https://git-scm.com/book/ko/v2)

### 대안 배포 플랫폼
- **Netlify**: 드래그 앤 드롭으로 간편 배포
- **Vercel**: Next.js와 잘 통합되지만 정적 사이트도 지원
- **Cloudflare Pages**: 빠른 CDN과 무료 배포

### 관련 명령어 요약

```bash
# 상태 확인
git status

# 변경 사항 확인
git diff

# 로그 확인
git log --oneline

# 브랜치 확인
git branch

# 원격 저장소 확인
git remote -v

# 최신 코드 가져오기
git pull origin main
```

---

## 체크리스트

배포 전 확인사항:

- [ ] 모든 파일이 커밋되었는가?
- [ ] GitHub 리포지토리가 Public으로 설정되었는가?
- [ ] GitHub Pages가 활성화되었는가?
- [ ] index.html이 루트 디렉토리에 있는가?
- [ ] 모든 링크와 경로가 올바른가?
- [ ] 브라우저에서 정상 작동하는가?

---

## 요약

1. **GitHub 리포지토리 생성** → Public 설정
2. **코드 업로드** → `git push`
3. **GitHub Pages 활성화** → Settings → Pages → main 브랜치 선택
4. **배포 확인** → `https://사용자명.github.io/리포지토리명/`
5. **공유** → URL을 친구들과 공유!

**배포 완료 후 URL**: `https://사용자명.github.io/tetris-game/`

이제 전 세계 어디서나 당신의 테트리스 게임을 플레이할 수 있습니다! 🎮✨
