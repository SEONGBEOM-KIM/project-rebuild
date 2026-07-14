# Project Rebuild Scene Flow

현재 프로토타입의 Phaser Scene 구성과 주요 전환 조건입니다. 새 화면을 추가할 때는 이 문서와 `project-rebuild-frontend/src/main.js` 등록 순서를 함께 갱신합니다.

## 에피소드 메타데이터

현재 EP1 기준값은 `project-rebuild-frontend/src/data/episodes.js`에 둡니다.

- 현재 에피소드: `CURRENT_EPISODE`
- 진행 단계: `EPISODE_STEPS`
- 탐색 필수 개수: `CURRENT_EPISODE.requiredExploredCount`
- 자료 카드/원인 퀴즈/탐색 단서/문제 정리: `project-rebuild-frontend/src/data/episodeContent.js`

Scene에서 에피소드 제목, 지역명, 진행 단계, 필수 탐색 개수를 하드코딩하지 않고 이 값을 우선 사용합니다.

## 등록 순서

`project-rebuild-frontend/src/main.js` 기준 등록 순서입니다.

1. `BootScene`
2. `TitleScene`
3. `SavedDataScene`
4. `StorageManagerScene`
5. `AuthScene`
6. `StoryScene`
7. `ExplorationScene`
8. `DataBriefingScene`
9. `CauseQuizScene`
10. `ProblemSummaryScene`
11. `SelectionScene`
12. `PlacementScene`
13. `ResultScene`
14. `SideEffectScene`
15. `ReflectionScene`
16. `EndingScene`
17. `LearningDataScene`
18. `ApiPayloadScene`
19. `ApiContractScene`
20. `MockSubmissionLogScene`
21. `TeacherReportScene`

## 기본 학습 흐름

```text
BootScene
  -> TitleScene
  -> AuthScene
  -> StoryScene
  -> ExplorationScene
  -> DataBriefingScene
  -> CauseQuizScene
  -> ProblemSummaryScene
  -> SelectionScene
  -> PlacementScene
  -> ResultScene
  -> SideEffectScene
  -> ReflectionScene
  -> EndingScene
```

## 주요 완료 조건

| Scene | 다음으로 진행 조건 | 기록/효과 |
| --- | --- | --- |
| `TitleScene` | `배치 연습 시작` 클릭 | 시작 화면 |
| `AuthScene` | UI-only 로그인/회원가입 진행 클릭 | 실제 인증 없음 |
| `StoryScene` | 짧은 스토리 진행 | EP1 도입 |
| `ExplorationScene` | 탐색 장소 3곳 이상 클릭 후 자료 확인 | `exploredPlaces` 기록 |
| `DataBriefingScene` | 자료 확인 후 원인 질문으로 이동 | `dataViewed: true` |
| `CauseQuizScene` | 답 선택 후 문제 정리로 이동 | `quizResult` 기록 |
| `ProblemSummaryScene` | 문제 정리 완료 | `problemSummaryCompleted: true` |
| `SelectionScene` | 회복 방향 1개 선택 | `selectedPolicy` 기록 |
| `PlacementScene` | 건물 3개 배치 후 결과 확인 | `placedBuildings`, 상태값 변화 기록 |
| `ResultScene` | 종합 결과 확인 후 부작용 확인 | 정책 정합성/상태 변화 요약 |
| `SideEffectScene` | 부작용/주의 신호 확인 | `IssueDetector` 결과 표시 |
| `ReflectionScene` | 다음 보완 우선순위 선택 | `reflectionChoice`, `completed: true` |
| `EndingScene` | 완료 화면 | 학습 기록/교사용/저장/API 화면 분기 |

## 선택/관리 흐름

```text
TitleScene
  -> SavedDataScene
  -> StorageManagerScene

SavedDataScene
  -> EndingScene       # 저장 데이터 이어보기
  -> TitleScene        # 뒤로

StorageManagerScene
  -> SavedDataScene    # 저장 데이터 관리
  -> TitleScene

EndingScene
  -> PlacementScene       # 배치 다시 조정
  -> TeacherReportScene   # 교사용 요약
  -> LearningDataScene    # 학습 데이터 보기
  -> BootScene            # 처음부터 다시

LearningDataScene
  -> ApiPayloadScene
  -> EndingScene

ApiPayloadScene
  -> ApiContractScene
  -> MockSubmissionLogScene
  -> LearningDataScene
  -> EndingScene

ApiContractScene
  -> ApiPayloadScene
  -> LearningDataScene
  -> EndingScene

MockSubmissionLogScene
  -> ApiPayloadScene
  -> EndingScene

TeacherReportScene
  -> EndingScene
  -> LearningDataScene
```

## 뒤로/재시도 흐름

- `ExplorationScene -> StoryScene`
- `DataBriefingScene -> ExplorationScene`
- `CauseQuizScene -> DataBriefingScene`
- `ProblemSummaryScene -> CauseQuizScene`
- `SelectionScene -> ExplorationScene`
- `ResultScene -> PlacementScene`
- `ResultScene -> BootScene`
- `SideEffectScene -> ResultScene`
- `ReflectionScene -> SideEffectScene`

## 현재 의도적으로 없는 것

- 실제 로그인/회원가입 API
- 실제 서버 저장 API 호출
- 에피소드 2 이상
- 고품질 아트/사운드 에셋
- 브라우저 E2E 자동화

## 변경 시 체크리스트

- `src/main.js`에 Scene 등록 여부 확인
- 새 버튼의 `scene.start(...)` 대상 오타 확인
- 학습 진행값이 필요한 Scene이면 `LearningProgress` 또는 registry 저장 확인
- `npm run verify` 통과 확인
- 수동으로 새 Scene 진입/뒤로가기/재시작 흐름 확인
