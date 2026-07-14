# AORR 상태 머신 설계

이 문서는 개인 프로페셔널 웹사이트와 Games 탭의 지렁이 게임을 GitHub Pages용 정적 웹사이트로 구현하기 위한 실행 가능한 AORR 상태 머신이다.

전제:

- 최종 산출물은 HTML, CSS, JavaScript만으로 동작하는 정적 사이트다.
- 루트 디렉토리에는 최소 `index.html`, `styles.css`, `script.js`, 그리고 게임 구현에 필요한 JavaScript 파일 또는 `script.js` 내부 게임 코드가 존재해야 한다.
- 배포는 GitHub Pages를 목표로 한다.
- 이름, 소개, 경력, 프로젝트 등 개인 콘텐츠가 확정되지 않으면 `[사람 확인 필요]`로 표시한다.
- Step 1에 `[게임 추가 기능:]`이 명시되어 있지 않아, 추가 게임 기능은 반영하지 않았다. 만약 나중에 발견되면 해당 요구사항을 `지렁이 게임 핵심 로직`, `게임 UI 및 점수`, `모바일 터치 조작` 루프에 추가한다.

## 1. Target

### 프로페셔널 웹사이트 개발 목표

- 개인의 전문성, 경력, 프로젝트, 연락처를 보여주는 정적 포트폴리오 웹사이트를 만든다.
- 모바일과 데스크톱에서 읽기 쉽고, 네비게이션이 자연스럽고, Games 탭이 분명히 보이게 한다.
- 시각적으로는 “프로페셔널”한 인상을 유지하되, 과도한 인터랙션보다 명확성과 가독성을 우선한다.

### GitHub Pages 배포 목표

- 저장소를 GitHub Pages에서 바로 서빙 가능한 정적 구조로 정리한다.
- 상대 경로, 정적 자산 경로, SPA 전용 서버 기능 없이 동작하게 한다.
- 페이지 로드 후 브라우저 콘솔 에러 없이 동작해야 한다.

### 입력 자료

- 기존 저장소 파일 구조
- 사용자 개인 소개 자료: 이름, 직함, 소개 문구, 경력, 프로젝트, 연락처, 링크
- 참고 디자인 또는 레퍼런스 사이트: [사람 확인 필요]
- 게임 요구사항: 지렁이 게임의 조작 방식, 충돌 규칙, 점수 방식, 난이도, 시작/재시작 규칙
- GitHub Pages 제약과 로컬 검증 결과

### 필수 페이지와 섹션

- Home 또는 About hero 섹션
- 소개 또는 프로필 섹션
- 경력 또는 경험 섹션
- 프로젝트 섹션
- Contact 섹션
- Games 탭 또는 Games 섹션
- 필요 시 footer, social links, download/resume link

### Games 탭 및 지렁이 게임 요구사항

- 상단 내비게이션에 `Games` 탭이 있어야 한다.
- Games 탭은 키보드와 모바일 터치 모두로 지렁이 게임을 조작할 수 있어야 한다.
- 지렁이 게임은 정적 HTML/CSS/JS만으로 동작해야 한다.
- 최소 요구사항:
  - 시작 또는 재시작 가능
  - 방향 전환
  - 먹이 생성
  - 점수 표시
  - 게임오버 처리
  - 충돌 판정
  - 모바일 조작
- 상세 규칙이 없으므로 아래는 기본 가정이다:
  - 벽 충돌 시 게임오버
  - 자신의 몸 충돌 시 게임오버
  - 먹이를 먹으면 점수가 증가하고 길이가 늘어난다
  - 한 번의 입력으로 180도 반전은 금지한다
  - 모바일은 스와이프 또는 방향 버튼 중 하나를 사용한다
  - 조작 방식 우선순위는 화면에서 가장 명확한 방식으로 선택한다

### 데스크톱 및 모바일 완료 기준

- 데스크톱:
  - 1280px 이상에서 레이아웃이 무너지지 않는다
  - 내비게이션과 섹션이 한눈에 읽힌다
  - Games 탭이 접근 가능하고 키보드 조작이 된다
- 모바일:
  - 360px 폭에서도 수평 스크롤 없이 읽힌다
  - 내비게이션이 접히거나 재배치된다
  - 게임 화면과 조작 UI가 터치로 작동한다
- 공통:
  - 브라우저 콘솔 에러가 없다
  - 로컬 서버와 GitHub Pages 둘 다에서 동일한 핵심 기능이 작동한다

## 2. Act

### 한 번의 개발 루프에서 수행할 최소 작업

- 정확히 하나의 실패 원인만 고친다.
- 하나의 루프는 기능 추가, 구조 개선, 혹은 검증 보강 중 하나에만 집중한다.
- 기존에 통과한 기능을 깨지 않도록 회귀 테스트를 포함한다.

### 수정 가능한 파일 범위

- 원칙적으로 한 루프에서는 관련된 최소 파일만 수정한다.
- 예시:
  - 구조 문제면 `index.html`
  - 반응형 문제면 `styles.css`
  - 게임 입력/로직 문제면 `script.js` 또는 별도 게임 JS 파일
- 불필요한 파일 동시 수정은 피한다.

### 생성할 수 있는 파일

- `index.html`
- `styles.css`
- `script.js`
- 필요 시 `game.js`, `snake.js`, `ui.js` 같은 분리 파일
- 필요 시 정적 이미지나 아이콘 파일

### 실행 가능한 로컬 검증 명령어

- 파일 존재 확인: `Get-ChildItem`
- HTML/CSS/JS 오류 확인: 브라우저 콘솔, 린트 도구 사용 가능 시 린트
- 로컬 서버 실행: `python -m http.server 8000` 또는 동등한 정적 서버
- 접속 확인: `http://localhost:8000`
- GitHub Pages 호환성 확인: 상대 경로, 정적 자산, SPA 미사용 여부 점검

## 3. Observe

### 관찰 항목

- 파일 생성 여부
- HTML 오류
- CSS 반응형 오류
- JavaScript 오류
- 로컬 웹서버 응답
- 브라우저 콘솔 오류
- 데스크톱 화면
- 모바일 화면
- 키보드 게임 조작
- 터치 게임 조작
- GitHub Pages 호환성

### 관찰 방법

- 파일은 실제 존재 여부로 확인한다.
- HTML, CSS, JavaScript는 브라우저 렌더링과 콘솔 메시지로 확인한다.
- 데스크톱과 모바일은 폭을 바꿔가며 확인한다.
- 게임은 직접 플레이 가능한지 확인한다.

## 4. Reason

실패 원인 분류 기준은 다음과 같다.

- `HTML_STRUCTURE`: 태그 구조, 시맨틱, 링크/탭 구조 문제
- `CSS_RESPONSIVE`: 레이아웃, 브레이크포인트, 모바일 표시 문제
- `JAVASCRIPT`: 스크립트 에러, DOM 연결, 이벤트 바인딩 문제
- `GAME_LOGIC`: 이동, 충돌, 점수, 상태 전환 규칙 문제
- `GAME_CONTROL`: 키보드, 터치, 버튼 입력 처리 문제
- `CONTENT`: 이름, 소개, 경력, 프로젝트 등 콘텐츠 불명확 또는 부재
- `TEST`: 검증 방법 부족, 재현 불가, 체크 항목 누락
- `ENVIRONMENT`: 로컬 서버, 브라우저, 경로, 실행 환경 문제
- `GITHUB_PERMISSION`: GitHub 인증, 저장소 접근, Pages 설정 권한 문제
- `DEPLOYMENT`: 배포 생성, Pages 서빙, 배포 후 동작 문제
- `UNKNOWN`: 위 분류로 판단 불가

판단 규칙:

- 가장 직접적인 1차 원인을 선택한다.
- 한 번에 복수 원인이 보여도, 현재 루프에서 해결할 수 있는 최소 원인을 먼저 잡는다.
- 코드와 무관한 입력 누락은 `CONTENT`로 분류한다.
- 브라우저나 서버가 원인처럼 보이지만 재현이 불명확하면 `ENVIRONMENT`로 둔다.

## 5. Repeat

- 실패 원인 하나만 수정한다.
- 관련된 최소 파일만 수정한다.
- 수정 후 동일한 Verifier를 다시 실행한다.
- 이미 통과한 기능에는 회귀 테스트를 포함한다.
- 한 루프에서 여러 실패 원인을 동시에 고치지 않는다.

## 6. Stop

다음 중 하나면 정지한다.

- 전체 테스트가 통과한 경우
- 최대 Retry에 도달한 경우
- 동일한 오류 fingerprint가 2회 반복된 경우
- 개인정보나 콘텐츠 확인이 필요한 경우
- GitHub 인증 또는 배포 권한 문제가 발생한 경우

## 7. Human-in-the-loop

다음 상황에서는 `[사람 확인 필요]`로 멈춘다.

- 이름, 소개, 경력, 프로젝트 등 개인 콘텐츠가 불명확한 경우
- 기존 콘텐츠 삭제가 필요한 경우
- 외부 분석 도구나 외부 서비스를 추가해야 하는 경우
- GitHub 저장소 설정을 변경해야 하는 경우
- 요구사항이 충돌하는 경우

## AORR 상태 정의

- `READY`: 다음 루프를 시작할 준비가 됨
- `ACTING`: 파일 수정 또는 구현 중
- `VERIFYING`: 로컬 검증 또는 브라우저 확인 중
- `RETRYING`: 하나의 실패 원인을 수정한 뒤 재검증 대기 또는 재시도 중
- `PASSED`: 현재 루프의 완료 조건을 만족함
- `DEPLOY_READY`: 배포 전 검증이 모두 끝난 상태
- `DEPLOYING`: 배포 수행 중
- `DEPLOYED`: GitHub Pages 배포가 완료됨
- `BLOCKED`: 환경 또는 권한 문제로 진행 불가
- `HITL_REQUIRED`: 사람 확인 없이는 다음 단계로 갈 수 없음

## 루프별 AORR 설계

| 단계 | 상태 | 입력 | Act | Observe | 출력 | 테스트 기준 | 다음 상태 |
|---|---|---|---|---|---|---|---|
| 저장소 및 기존 파일 확인 | READY | 현재 루트 파일, 원격 repo, 기존 README/안내 문서 | 파일 목록과 현재 구조를 읽고, 정적 사이트에 필요한 파일이 무엇인지 확인한다 | 루트에 어떤 파일이 있는지, GitHub Pages에 적합한지 본다 | 현 상태 기준선과 누락 파일 목록 | 루트 파일 구조가 파악되고, 초기 제약이 정리됨 | PASSED |
| 정적 사이트 기본 구조 | READY | 기준선, 사이트 섹션 요구사항, 정적 HTML 제약 | `index.html` 뼈대를 만들고, 헤더/메인/푸터 구조를 잡는다 | HTML 시맨틱, 링크 연결, 스크립트/스타일 참조를 확인한다 | 기본 셸 HTML | 브라우저에서 빈 페이지가 아니라 구조가 보임 | PASSED |
| 프로페셔널 콘텐츠 영역 | READY | [사람 확인 필요] 이름, 소개, 경력, 프로젝트, 연락처 | hero, about, experience, projects, contact를 배치한다 | 콘텐츠가 비어 있지 않은지, 정보 우선순위가 맞는지 본다 | 정적 콘텐츠 섹션 | 핵심 자기소개가 읽히고 섹션 간 흐름이 자연스러움 | HITL_REQUIRED |
| 반응형 내비게이션 | READY | 기본 셸, 메뉴 항목, 모바일 요구사항 | 데스크톱/모바일 모두에서 동작하는 nav를 만든다 | 좁은 화면에서 메뉴가 깨지는지 확인한다 | 반응형 내비게이션 | 360px에서 수평 스크롤 없이 메뉴를 읽을 수 있음 | PASSED |
| Games 탭 | READY | nav 구조, Games 섹션/페이지 선택 | Games 탭을 만들고 게임 영역으로 이동 가능하게 한다 | 탭 포커스, 클릭, 앵커/섹션 이동을 확인한다 | 게임 진입점 | Games 탭이 키보드와 마우스로 접근 가능 | PASSED |
| 지렁이 게임 핵심 로직 | READY | 게임 캔버스/보드, 규칙, 초기 상태 | 이동, 먹이, 충돌, 점수, 게임오버, 재시작을 구현한다 | 게임 한 판이 끝까지 진행되는지 본다 | 플레이 가능한 게임 코어 | 먹이 획득과 충돌이 정상 작동 | PASSED |
| 키보드 조작 | READY | 게임 코어, 방향 입력 설계 | 방향키 또는 WASD를 연결한다 | 입력 지연, 180도 반전 차단, 포커스 상태를 본다 | 키보드 조작 가능 게임 | 키보드만으로 안정적으로 플레이 가능 | PASSED |
| 모바일 터치 조작 | READY | 게임 코어, 모바일 화면, 조작 방식 선택 | 스와이프 또는 버튼형 터치를 연결한다 | 터치 오작동, 조작 가독성, 한 손 사용성을 본다 | 모바일 조작 UI | 모바일에서 한 판을 플레이할 수 있음 | PASSED |
| 게임 UI 및 점수 | READY | 게임 코어, 조작 UI | 점수, 상태 메시지, 시작/재시작 UI를 만든다 | 점수 갱신과 상태 텍스트를 확인한다 | 읽기 쉬운 게임 UI | 점수와 상태가 즉시 이해됨 | PASSED |
| 접근성과 반응형 검증 | READY | 완성된 페이지와 게임 | 키보드 접근성, 대비, 폰트 크기, 반응형 브레이크포인트를 점검한다 | 데스크톱/모바일/콘솔 에러를 확인한다 | 검증 결과와 수정 목록 | 주요 브라우저와 폭에서 기능이 유지됨 | PASSED |
| GitHub Pages 호환성 검증 | READY | 정적 파일, 상대 경로, 배포 제약 | Pages 환경에서 깨질 요소가 없는지 점검한다 | 절대 경로, 서버 의존성, SPA 전용 라우팅 여부를 확인한다 | Pages 호환 체크 결과 | GitHub Pages에서 직접 서빙 가능 | DEPLOY_READY |
| 배포 | DEPLOY_READY | Pages 호환 결과, GitHub 인증 상태 | GitHub Pages 배포를 수행한다 | 배포 URL 응답과 렌더링을 확인한다 | 배포 완료 상태 | 공개 URL에서 사이트와 게임이 동작 | DEPLOYED |

## 루프별 세부 설계

### 1) 저장소 및 기존 파일 확인

- 입력: 현재 폴더 구조, 기존 파일, 원격 저장소 정보
- Act: 루트 파일과 README를 읽고, 정적 사이트 구축에 필요한 최소 파일을 식별한다
- Observe: 루트에 무엇이 있고 무엇이 비어 있는지 확인한다
- 출력: 기준선 문서, 누락 파일 목록
- 테스트 기준: 저장소의 출발점이 명확해야 한다
- 다음 상태: `PASSED`

### 2) 정적 사이트 기본 구조

- 입력: 사이트 목적, 필수 섹션 목록
- Act: `index.html`, `styles.css`, `script.js`의 연결 구조를 만든다
- Observe: HTML 구조가 시맨틱하고 닫힘 태그가 정상인지 본다
- 출력: 기본 셸
- 테스트 기준: 새로고침 시 빈 화면이 아니라 기본 골격이 보임
- 다음 상태: `PASSED`

### 3) 프로페셔널 콘텐츠 영역

- 입력: 개인 콘텐츠, 경력 정보, 프로젝트 자료
- Act: 소개, 경력, 프로젝트, 연락처를 배치한다
- Observe: 콘텐츠가 중복되거나 빠지지 않았는지 본다
- 출력: 포트폴리오 본문
- 테스트 기준: 방문자가 10초 안에 “누구인지, 무엇을 하는지” 이해 가능
- 다음 상태: `HITL_REQUIRED` 또는 `PASSED`

### 4) 반응형 내비게이션

- 입력: 메뉴 항목, 모바일 제약
- Act: 상단 nav, 모바일 메뉴 표시 방식, 앵커 이동을 만든다
- Observe: 좁은 화면에서 줄바꿈과 겹침이 없는지 본다
- 출력: 반응형 nav
- 테스트 기준: 360px와 데스크톱 폭 모두에서 메뉴가 읽힘
- 다음 상태: `PASSED`

### 5) Games 탭

- 입력: nav 구조, 게임 영역
- Act: Games 탭을 연결하고 게임 섹션 또는 전용 섹션으로 이동시킨다
- Observe: 포커스 이동과 클릭 이동이 정상인지 본다
- 출력: Games 진입점
- 테스트 기준: 탭이 확실히 보이고 이동이 가능함
- 다음 상태: `PASSED`

### 6) 지렁이 게임 핵심 로직

- 입력: 게임 규칙, 보드 크기, 시작 상태
- Act: 게임 루프, 먹이 생성, 충돌 처리, 점수 계산을 구현한다
- Observe: 자동 진행 중 충돌과 점수 증가가 정상인지 본다
- 출력: 기본 플레이 가능 게임
- 테스트 기준: 한 판을 끝까지 플레이할 수 있음
- 다음 상태: `PASSED`

### 7) 키보드 조작

- 입력: 게임 코어, 입력 이벤트
- Act: 방향키 또는 WASD 입력을 게임 상태에 연결한다
- Observe: 빠른 연타, 반전 금지, 포커스 상태를 본다
- 출력: 키보드 조작 가능 게임
- 테스트 기준: 키보드만으로 재시작과 이동이 가능
- 다음 상태: `PASSED`

### 8) 모바일 터치 조작

- 입력: 게임 코어, 모바일 레이아웃
- Act: 스와이프 또는 버튼형 입력을 연결한다
- Observe: 터치 인식률, 오작동, UI 가독성을 본다
- 출력: 모바일 조작 가능 게임
- 테스트 기준: 손가락 조작으로 한 판 진행 가능
- 다음 상태: `PASSED`

### 9) 게임 UI 및 점수

- 입력: 게임 상태, 점수 규칙
- Act: 점수, 게임오버, 재시작, 상태 안내를 화면에 표시한다
- Observe: 점수 갱신 시 즉시 반영되는지 본다
- 출력: 완성형 게임 UI
- 테스트 기준: 사용자가 현재 상태를 즉시 이해함
- 다음 상태: `PASSED`

### 10) 접근성과 반응형 검증

- 입력: 완성 페이지, 조작 흐름
- Act: 키보드 이동, 대비, 폰트 크기, 모바일 폭을 점검한다
- Observe: 브라우저 콘솔, 레이아웃 깨짐, 스크롤 이상을 본다
- 출력: 수정 목록 또는 통과 결과
- 테스트 기준: 주요 화면 폭과 입력 방식에서 문제 없음
- 다음 상태: `PASSED`

### 11) GitHub Pages 호환성 검증

- 입력: 최종 정적 파일, 링크, 경로
- Act: Pages에서 막히는 요소가 없는지 확인한다
- Observe: 절대 경로, 서버 의존 기능, 빌드 전용 파일 참조를 본다
- 출력: 배포 가능성 판단
- 테스트 기준: 정적 서빙만으로 동작 가능
- 다음 상태: `DEPLOY_READY`

### 12) 배포

- 입력: 배포 가능 상태, GitHub 권한
- Act: GitHub Pages로 배포한다
- Observe: 공개 URL의 실제 렌더링과 게임 동작을 확인한다
- 출력: 배포 URL
- 테스트 기준: 공개 URL에서 동일하게 동작
- 다음 상태: `DEPLOYED`

## 상태 전이 규칙

- `READY -> ACTING`: 루프를 시작할 때
- `ACTING -> VERIFYING`: 최소 작업을 끝낸 뒤
- `VERIFYING -> PASSED`: 검증이 통과했을 때
- `VERIFYING -> RETRYING`: 실패 원인이 명확하고 수정 가능할 때
- `RETRYING -> ACTING`: 하나의 원인만 수정한 뒤
- `PASSED -> READY`: 다음 루프로 이동할 때
- `PASSED -> DEPLOY_READY`: 전체 구현과 검증이 끝났을 때
- `DEPLOY_READY -> DEPLOYING`: 배포를 시작할 때
- `DEPLOYING -> DEPLOYED`: 배포와 공개 확인이 끝났을 때
- `ANY -> BLOCKED`: 환경, 권한, 인증 문제로 진행 불가할 때
- `ANY -> HITL_REQUIRED`: 개인 콘텐츠 또는 요구사항 확인이 필요할 때

## 운영 노트

- 첫 루프는 항상 `저장소 및 기존 파일 확인`이다.
- 개인 콘텐츠가 비어 있으면 다음 구현 루프로 넘어가기 전에 `[사람 확인 필요]`를 남긴다.
- 게임 구현은 UI보다 먼저 코어 로직을 안정화한다.
- 모바일 조작은 키보드 조작이 통과한 뒤 추가한다.
- 배포는 코드와 검증이 모두 끝난 뒤 마지막에 수행한다.

## Self-Correcting TDD Loop

This section defines the verifier-first loop for the GitHub Pages static site in this repository.

Verified local toolchain:

- `rg` is available for file and text discovery.
- `git` is available.
- `py.exe` is available and returns `Python 3.7.2`.
- `claude.exe` is installed at `C:\Users\minam\.local\bin\claude.exe`.
- `claude auth status` reports `loggedIn: true` with first-party auth.
- `claude --help` exposes `--print`, `--model`, `auth status`, `doctor`, and `--chrome`.
- `node`, `npm`, and `npx` were not detected in PATH during this check.
- `python.exe` and `python3.exe` resolve to WindowsApps stubs, so they should not be treated as a reliable server runtime.

Claude model availability note:

- Local debug logs in `C:\Users\minam\.claude\debug\...` show `model=claude-sonnet-5 modelSupported=true`.
- That is the best available evidence in this environment that Sonnet 5 is supported.
- Use `claude-sonnet-5` as the primary independent verifier model.
- If a later CLI run rejects that model, classify it as `ENVIRONMENT` or `GITHUB_PERMISSION` only after confirming it is not an auth/config issue.

### Verifier stack

1. Filesystem verifier: `rg --files`, `Test-Path`, `Get-ChildItem`
2. Static path verifier: `rg -n` for HTML/CSS/JS references and absolute-path checks
3. Local server verifier: `py -3 -m http.server 8000`
4. HTTP verifier: `Invoke-WebRequest http://localhost:8000/index.html`
5. Claude independent verifier: `claude --print --model claude-sonnet-5 --add-dir .`
6. Browser verifier: `claude --chrome` only if Chrome integration is available in the local environment

### Core loop

| State | Purpose | Primary verifier | Pass signal | Typical failure classes |
|---|---|---|---|---|
| `READY` | Collect the current baseline and choose the smallest next test | `rg --files`, `Test-Path index.html`, `Get-Content AORR.md` | Required files and current structure are known | `TEST`, `ENVIRONMENT` |
| `ACTING` | Make the minimum change that addresses one hypothesis | Edit only the smallest relevant file set | The targeted change is applied | `HTML_STRUCTURE`, `CSS_RESPONSIVE`, `JAVASCRIPT`, `GAME_LOGIC`, `GAME_CONTROL`, `CONTENT` |
| `VERIFYING` | Run the same verifier that failed before, plus one regression check | `py -3 -m http.server 8000`, `Invoke-WebRequest`, browser or Claude review | The previously failing check now passes | Same as the original cause |
| `RETRYING` | Fix exactly one cause from the latest failure log | Same verifier as the failing step | One cause has been addressed without regressions | Same as the original cause |
| `PASSED` | All checks for the current loop are green | Full loop verifier bundle | No failures remain for this loop | None |
| `DEPLOY_READY` | The site is ready for GitHub Pages packaging and publish checks | `rg -n` path scan, static href/src scan, local server smoke, Claude review | No GitHub Pages blockers remain | `HTML_STRUCTURE`, `CSS_RESPONSIVE`, `JAVASCRIPT`, `DEPLOYMENT`, `GITHUB_PERMISSION` |
| `DEPLOYING` | Publish to GitHub Pages | GitHub Pages publish workflow | Live URL responds | `GITHUB_PERMISSION`, `DEPLOYMENT` |
| `DEPLOYED` | Confirm the live site behaves like local | Live URL smoke check | Pages renders and game loads | `DEPLOYMENT`, `ENVIRONMENT` |
| `BLOCKED` | Stop because the environment or permission is not solvable in code | Any verifier that returns auth, path, or runtime failure | No code change can reasonably fix it | `ENVIRONMENT`, `GITHUB_PERMISSION` |
| `HITL_REQUIRED` | Stop and ask a person for missing content or a conflicting decision | Content review or requirement review | Human decision is provided | `CONTENT`, `UNKNOWN` |

### Loop units

#### 1. Repository and baseline check

- Input: current root files, `AORR.md`, repository root.
- Act: confirm whether `index.html`, `styles.css`, and `script.js` already exist.
- Observe: use `rg --files`, `Test-Path`, and `Get-ChildItem` to confirm the root state.
- Output: baseline note and missing-file list.
- Test criteria: the project root state is known before any editing.
- Next state: `READY` -> `ACTING` only when a concrete missing-file or structure task is selected.

#### 2. HTML structure check

- Input: `index.html`.
- Act: verify the document root, `title`, `meta viewport`, semantic sections, nav, Games area, and image `alt` attributes.
- Observe: scan for broken or missing markup and internal links.
- Output: HTML failure log or pass result.
- Test criteria:
  - root `index.html` exists
  - `<!doctype html>`, `<html>`, `<head>`, `<body>` exist
  - `title` and `meta name="viewport"` exist
  - `nav`, `main`, `section`, and Games content exist
  - internal links resolve
- Failure class mapping: `HTML_STRUCTURE`, `CONTENT`, or `TEST`.

#### 3. CSS responsive check

- Input: `styles.css` and the rendered page.
- Act: verify desktop, tablet, and mobile behavior, especially nav and Games UI.
- Observe: use browser viewport checks and look for horizontal scroll, overflow, and hidden controls.
- Output: responsive pass/fail log.
- Test criteria:
  - no horizontal scroll at ~375px
  - tablet layout at ~768px is readable
  - desktop layout at ~1440px is stable
  - nav and Games UI adapt without overlap
- Failure class mapping: `CSS_RESPONSIVE`.

#### 4. JavaScript runtime check

- Input: `script.js` and any game JS files.
- Act: verify syntax, DOM lookups, event binding, and page-load behavior.
- Observe: use browser console and page load smoke tests.
- Output: JS failure log with file and line references.
- Test criteria:
  - no syntax errors
  - no null DOM references on load
  - no duplicate listeners on re-entry
  - no console errors on initial render
- Failure class mapping: `JAVASCRIPT`.

#### 5. Snake game check

- Input: game canvas/board, score UI, controls.
- Act: verify start, pause, restart, score gain, food spawn, wall/body collision, and input handling.
- Observe: play the game directly in browser.
- Output: game behavior log.
- Test criteria:
  - game starts and can restart
  - score increases when food is eaten
  - wall or self collision ends the game
  - arrow keys or WASD work
  - mobile buttons or touch work
  - immediate reverse direction is blocked
  - reopening the Games tab does not create duplicate runs
- Failure class mapping: `GAME_LOGIC` or `GAME_CONTROL`.

#### 6. Local server check

- Input: static files in the project root.
- Act: serve the site locally with a real static server.
- Observe: verify HTTP response and asset loading.
- Output: local URL smoke result.
- Test criteria:
  - `py -3 -m http.server 8000` starts successfully
  - `http://localhost:8000/index.html` returns HTTP 200
  - `styles.css` and `script.js` also respond successfully
- Failure class mapping: `ENVIRONMENT` if Python is unavailable, otherwise `TEST`.

#### 7. Browser viewport check

- Input: local site URL.
- Act: inspect the rendered page at mobile, tablet, and desktop widths.
- Observe: use browser tooling or Claude Chrome integration if available.
- Output: viewport-specific smoke log.
- Test criteria:
  - ~375px mobile
  - ~768px tablet
  - ~1440px desktop
- Failure class mapping: `CSS_RESPONSIVE`, `JAVASCRIPT`, or `GAME_CONTROL`.

#### 8. GitHub Pages compatibility check

- Input: final static files.
- Act: confirm the site uses root `index.html`, static relative paths, no backend API, no file-system dependency, and no server-only features.
- Observe: scan for absolute local paths, `file://`, backend endpoints, and dynamic routing assumptions.
- Output: Pages readiness note.
- Test criteria:
  - root `index.html`
  - relative asset paths
  - no backend or filesystem dependency
  - no SPA-only routing requirement
- Failure class mapping: `HTML_STRUCTURE`, `JAVASCRIPT`, `ENVIRONMENT`, or `DEPLOYMENT`.

### Failure log schema

Every failed verification must record:

- execution command
- exit code
- failed check item
- core error message
- related file and line number when available
- browser console message when available
- error fingerprint

Recommended fingerprint format:

- `CATEGORY | file:line | error-substring | verifier-name`

### Retry policy

- One retry may fix only one root cause.
- Change only the minimum related files.
- Do not delete tests or weaken acceptance criteria.
- Do not rewrite the whole site just to satisfy one failing check.
- Do not use a different framework or architecture unless the user explicitly requests it.
- After each retry, rerun the exact same failing verifier first, then the narrowest regression check that protects already-passed behavior.
- Stop retrying the same issue after 3 attempts.
- Stop immediately if the same error fingerprint appears twice.
- If the failure is environment or permission related, do not try to solve it by editing code.

### Claude verifier prompt pattern

Use Claude as a second-opinion verifier after each change set:

```powershell
& "$env:USERPROFILE\.local\bin\claude.exe" --print --model claude-sonnet-5 --add-dir . "Review only the changed files for HTML structure, CSS responsiveness, JavaScript runtime safety, and snake-game behavior. Return failures with file:line, category, and a short fingerprint."
```

Use this only as a verifier. Do not let it replace the deterministic checks above.

### Minimal modification rule

- In one retry, change only the file(s) that correspond to the single classified root cause.
- Preserve all previously passing behavior.
- Prefer a surgical fix over a broad rewrite.
- If a change would likely affect an already-passing area, add a regression verifier before editing.

### Stop conditions for the TDD loop

- all verifiers for the current loop pass
- maximum retries reached
- the same fingerprint repeats twice
- missing personal content requires a human answer
- GitHub auth or deployment permission is blocked
- the environment lacks a required tool and no local fallback exists
