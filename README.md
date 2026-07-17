# Project Rebuild

초등학교 5~6학년 사회과 학습용 Phaser 기반 지역 회복 시뮬레이션 프로토타입입니다.

## 실행

루트 디렉터리에서 실행합니다.

```bash
npm run dev
```

브라우저에서 접속:

```text
http://127.0.0.1:5173/
```

## 검증

핵심 로직 smoke test:

```bash
npm test
```

빌드 확인:

```bash
npm run build
```

테스트와 빌드를 한 번에 확인:

```bash
npm run verify
```

성공 기준:

- `npm test`에서 `Smoke tests passed` 출력
- `npm run build`가 오류 없이 완료

## 현재 자동 테스트 범위

`project-rebuild-frontend/tests/smoke.test.js`에서 다음 로직을 확인합니다.

- 상태값 적용과 원본 상태 불변성
- 부작용/주의 신호 감지
- 학습 진행 기록 누적
- 배치 가능/불가능 판정
- 인접 조건 판정
- 점유 타일 차단
- 학습 데이터 JSON 가져오기/저장/삭제
- 깨진 저장 JSON을 안전하게 무시하는지 확인
- API payload 계약 예시와 mock 제출 검증
- Mock 제출 로그 최신 10개 제한과 깨진 로그 JSON 안전 처리
- Phaser Scene 등록/전환 대상 정합성
- EP1 메타데이터와 진행 단계 정합성
- 임시 맵 크기/타일 타입/zone/buildable 규칙 정합성
- 샘플 건물 3종의 비용/효과/footprint/인접 조건 정합성
- 회복 방향 정책과 추천 건물 ID/name 정합성
- Scene 파일이 직접 Phaser 오브젝트를 생성하지 않고 UI helper/renderer/system으로 위임하는 구조 경계

## 현재 수동 확인이 필요한 범위

아직 브라우저 E2E 자동화는 붙이지 않았으므로 다음은 수동 확인 대상입니다.

- Phaser Scene 전환
- 버튼 클릭 흐름
- 배치 프리뷰 표시
- 결과/마무리/교사용 요약 화면 표시
- JSON 복사/다운로드 브라우저 동작


## 문서

- `docs/API_CONTRACT.md`: 학습 기록 저장 API 계약 초안
- `docs/SCENE_FLOW.md`: Phaser Scene 순서와 전환 조건
- `docs/QA_CHECKLIST.md`: 브라우저 수동 QA 체크리스트
- `docs/EVALUATION_RULES.md`: 상태값/결과 평가/부작용 감지 기준
- `docs/EPISODE_CONFIGS.md`: 에피소드별 배치 config/evaluation profile 확장 가이드

## 화면 코드 구조 원칙

- `src/scenes/*Scene.js`: 화면 전환, registry 상태 갱신, 사용자 입력 흐름만 담당합니다.
- `src/systems/*ViewManager.js`: layout, style, 표시 문구, target scene 같은 순수 설정과 포맷팅만 담당합니다.
- `src/systems/*Renderer.js`, `src/ui/*`: Phaser 오브젝트 생성과 시각 요소 조립을 담당합니다.
- 새 화면이나 카드 UI를 추가할 때 Scene 안에서 `this.add.*`를 직접 호출하지 않습니다. 필요하면 renderer 또는 `ui` helper를 먼저 추가합니다.
- 이 구조 경계는 `npm test`의 `testSceneRenderingBoundaries`에서 자동 검증합니다.

## 브라우저 임시 저장 키

현재 실제 서버 저장 전 단계이므로 브라우저 `localStorage`를 사용합니다.

- `project-rebuild:learning-save:v1`: 학습 데이터 임시 저장
- `project-rebuild:mock-api-submissions:v1`: Mock API 제출 로그, 최신 10개 유지
