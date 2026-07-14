README_FOR_CODEX.md

프로젝트 개요

프로젝트명: 균형 있게 성장하는 지역을 위하여 - 프로젝트 리빌드 (Project Rebuild)

본 프로젝트는 초등학교 5~6학년 사회과 교육과정을 기반으로 제작하는 교육용 시뮬레이션 게임이다.

학습자는 인구 감소와 지역 소멸 위기에 처한 가상의 지역을 발전시키는 지역 회복 프로젝트 담당자가 된다.

학생은 다양한 정책을 선택하고 시설을 배치하며 인구 증가, 경제 성장, 환경 보전, 주민 만족도 향상 사이의 균형을 고민하게 된다.

게임의 최종 목표는 단순한 경제 성장이나 인구 증가가 아니라 지속 가능한 지역 발전을 달성하는 것이다.

⸻

교육 목표

대응 교육과정

6사02-02

지역별 인구 분포의 특징을 이해하고 지역이 겪는 문제를 탐색하며 해결 방안을 모색한다.

6사11-02

경제 성장이 우리 생활에 미치는 영향을 파악하고 경제 성장 과정에서 발생하는 문제의 해결 방안을 탐색한다.

⸻

기술 스택

프론트엔드

- Vite
- Phaser3
- JavaScript (TypeScript 사용하지 않음)
- Isometric Tile Map 방식

백엔드 (추후 구현)

- Python
- Django
- Django REST Framework

데이터베이스 (추후 구현)

- SQLite

⸻

개발 원칙

이 프로젝트는 일반 웹사이트가 아니라 게임 형태의 교육용 소프트웨어를 목표로 한다.

따라서:

- 페이지 이동 방식 사용 금지
- SPA 구조 사용 금지
- Scene 기반 게임 구조 사용
- Phaser Scene 전환 사용
- 모든 화면은 게임 내부 UI처럼 보이도록 구현

⸻

게임 구조

Scene 구조

BootScene

↓

TitleScene

↓

StoryScene

↓

SelectionScene

↓

PlacementScene

↓

ResultScene

↓

EndingScene

⸻

핵심 게임 루프

문제 상황 제시

↓

정보 탐색

↓

정책 선택

↓

시설 배치

↓

결과 시뮬레이션

↓

문제 발생

↓

해결 정책 선택

↓

최종 평가

↓

엔딩

⸻

게임 상태(State)

{
population: 1000,
economy: 50,
environment: 80,
satisfaction: 60,
budget: 1000,
traffic: 10,
pollution: 10
}

모든 정책과 시설은 상태값에 영향을 준다.

⸻

에피소드 구조

EP1. 지역 위기

- 인구 감소
- 고령화
- 상권 붕괴
- 지역 탐색
- 인구 데이터 분석

EP2. 인구 유입 전략

- 청년 지원
- 주거 정책
- 교통 개선

EP3. 경제 성장

- 공장 유치
- 산업 개발
- 일자리 증가

EP4. 부작용 발생

- 환경 오염
- 교통 혼잡
- 주민 불만

EP5. 문제 해결

- 환경 정책
- 복지 정책
- 도시 계획

EP6. 지속 가능성 평가

- 최종 평가
- 엔딩 분기

⸻

지도 시스템

맵 방식

- Isometric Tile Map 사용
- 마름모 형태의 타일 구조 사용

카메라

반드시 지원

- 마우스 드래그 이동
- 마우스 휠 확대
- 마우스 휠 축소

건물 배치

건물 선택 시:

- 설치 가능 지역 → 초록색
- 설치 불가 지역 → 빨간색
- 반투명 프리뷰 표시

클릭 시:

- 건물 설치
- 설치 효과 재생

⸻

건물 크기

소형

- 2x2

중형

- 2x3

대형

- 3x3

⸻

1차 개발 목표 (Vertical Slice)

현재는 전체 게임을 구현하지 않는다.

다음 기능만 구현한다.

목표

TitleScene

↓

StoryScene

↓

PlacementScene

↓

ResultScene

동작 확인

⸻

필수 기능

TitleScene

- 게임 제목 표시
- 시작 버튼

StoryScene

- 캐릭터 이미지
- 대화창
- 다음 버튼

PlacementScene

- Isometric 맵 표시
- 카메라 이동
- 카메라 확대/축소
- 건물 프리뷰
- 건물 배치

ResultScene

- 상태값 변화 표시
- 다음 버튼

⸻

현재 구현하지 말 것

다음 기능은 추후 구현한다.

- 로그인
- 회원가입
- Django API
- 저장 기능
- 데이터베이스
- 엔딩 분기
- 모든 에피소드
- 사운드
- 최적화

⸻

코드 작성 규칙

- Scene 단위로 파일 분리
- 기능별 시스템 분리
- 하드코딩 최소화
- 재사용 가능한 클래스 구조 사용
- Phaser 공식 권장 구조 사용

⸻

프로젝트 폴더 구조

project-rebuild-frontend/
src/
├─ scenes/
│ ├─ BootScene.js
│ ├─ TitleScene.js
│ ├─ StoryScene.js
│ ├─ SelectionScene.js
│ ├─ PlacementScene.js
│ ├─ ResultScene.js
│ └─ EndingScene.js
│
├─ systems/
│ ├─ GameState.js
│ ├─ PlacementSystem.js
│ ├─ CameraController.js
│ └─ EffectManager.js
│
├─ ui/
│ ├─ DialogueBox.js
│ ├─ StatusBar.js
│ ├─ PolicyCard.js
│ └─ ResultPanel.js
│
├─ data/
│ ├─ episodes.js
│ ├─ buildings.js
│ ├─ policies.js
│ └─ mapData.js
│
└─ main.js

⸻

# 향후 배포 계획

현재 단계에서는 로컬 환경에서 개발한다.

향후 배포는 다음 기술을 사용할 가능성이 있다.

- Frontend: Cloudflare Pages
- Backend: Django API
- Database: Supabase PostgreSQL 또는 별도 PostgreSQL

따라서 코드는 특정 호스팅 환경에 종속되지 않도록 작성한다.
