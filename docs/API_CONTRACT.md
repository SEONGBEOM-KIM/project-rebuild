# Project Rebuild API Contract Draft

이 문서는 현재 Phaser 프로토타입의 학습 완료 데이터를 Django REST Framework 같은 백엔드로 넘기기 위한 초안입니다. 실제 인증, 반/학생 식별, 서버 저장 정책은 백엔드에서 확정합니다.

## Endpoint

```http
POST /api/learning-records/
Content-Type: application/json
```

## 프론트 책임

- EP1 학습 흐름 완료 후 학습 결과 payload를 만든다.
- 임시 저장 데이터와 동일한 학습 기록을 서버 저장용 snake_case 구조로 변환한다.
- `student_id`, `class_id`, `created_at`, `updated_at` 같은 신뢰 경계 밖 값은 직접 보내지 않는다.

## 백엔드 책임

- 로그인 사용자 또는 세션에서 학생/반 정보를 식별한다.
- `schema_version`별 payload를 검증한다.
- 저장 성공 시 서버 생성 ID와 타임스탬프를 반환한다.
- 유효하지 않은 입력은 필드별 검증 오류로 반환한다.

## Request Body v1

```json
{
  "schema_version": 1,
  "episode_id": 1,
  "completed": true,
  "learning_steps": {
    "explored_places": ["school", "market", "bus_stop"],
    "data_viewed": true,
    "quiz_result": {
      "question_id": "ep1_q1_population_decline_reason",
      "selected": "lack_jobs_services",
      "correct": true
    },
    "problem_summary_completed": true,
    "reflection_choice": {
      "id": "budget_balance",
      "title": "예산 균형 보완"
    }
  },
  "selected_policy": {
    "id": "green_recovery",
    "name": "녹색 회복 계획"
  },
  "selected_strategy": {
    "id": "balanced_growth",
    "title": "균형 성장",
    "state_focus": "환경 유지 만족도↑ 오염↓",
    "policy_id": "green_recovery",
    "placement_config_id": "ep2_population_recovery"
  },
  "placement_config": {
    "id": "ep2_population_recovery",
    "episode_id": "ep2",
    "title": "푸른군 인구 회복 배치 실험",
    "required_placements": 3,
    "state_keys": ["population", "economy", "environment", "satisfaction", "budget", "traffic", "pollution"],
    "evaluation_profile_id": "ep2_population_recovery_default"
  },
  "evaluation_profile": {
    "id": "ep2_population_recovery_default"
  },
  "placements": [
    {
      "order": 1,
      "building_id": "small_park",
      "building_name": "작은 공원",
      "position": { "x": 6, "y": 1 },
      "effect": { "environment": 12 }
    }
  ],
  "final_state": {
    "population": 1000,
    "economy": 50,
    "environment": 92,
    "satisfaction": 74,
    "budget": 860,
    "traffic": 10,
    "pollution": 6
  }
}
```

## 필드 규칙

| 필드 | 타입 | 규칙 |
| --- | --- | --- |
| `schema_version` | number | 현재 `1` 고정 |
| `episode_id` | number | 현재 EP1은 `1` |
| `completed` | boolean | 학습 완료 여부 |
| `learning_steps.explored_places` | string[] | 탐색 장소 ID 배열, 완료 저장 기준 3개 이상 |
| `learning_steps.data_viewed` | boolean | 자료 확인 완료 여부 |
| `learning_steps.quiz_result` | object \| null | 원인 질문 응답 기록 |
| `learning_steps.problem_summary_completed` | boolean | 문제 정리 완료 여부 |
| `learning_steps.reflection_choice` | object \| null | 마무리 생각 정리 선택 |
| `selected_policy` | object \| null | 회복 방향 선택 |
| `selected_strategy` | object \| null | EP2 전략 선택. `placement_config_id`로 사용할 배치 설정을 연결 |
| `placement_config` | object \| null | 실제 배치에 사용한 config 메타데이터. 지도/시설 원본 전체가 아니라 ID, 요구 배치 수, 상태 키만 전송 |
| `evaluation_profile` | object \| null | 결과 판정에 사용한 evaluation profile ID |
| `placements` | object[] | 배치 순서, 건물 ID/name, 좌표, 효과 delta |
| `final_state` | object | 최종 지역 상태값 |

## Success Response

```json
{
  "id": 123,
  "student_id": 45,
  "episode_id": 1,
  "completed": true,
  "created_at": "2026-07-12T10:00:00+09:00",
  "updated_at": "2026-07-12T10:00:00+09:00"
}
```

## Validation Error Response

```json
{
  "error": "validation_error",
  "fields": {
    "episode_id": ["This field is required."],
    "placements": ["At least one placement is required."]
  }
}
```

## 현재 프론트 구현 위치

- payload 생성: `project-rebuild-frontend/src/systems/LearningApiPayloadManager.js`
- mock 제출: `project-rebuild-frontend/src/systems/MockApiClient.js`
- 화면 미리보기: `project-rebuild-frontend/src/scenes/ApiPayloadScene.js`
- 계약 보기 화면: `project-rebuild-frontend/src/scenes/ApiContractScene.js`
- 계약 상수: `project-rebuild-frontend/src/data/apiContract.js`

## 에피소드 config 메타데이터

`placement_config`와 `evaluation_profile`은 서버가 같은 학습 결과를 어떤 배치 규칙과 평가 기준으로 해석해야 하는지 남기기 위한 메타데이터다. 실제 지도 타일/시설 전체 정의는 프론트 data registry 또는 서버 별도 마스터 데이터에서 관리하고, 학습 기록 payload에는 복원과 분석에 필요한 최소 ID/요약값만 포함한다.
