# Project Rebuild Evaluation Rules

현재 결과 평가는 실제 정책 시뮬레이션이 아니라 EP1 UI/학습 흐름 검증용 임시 기준입니다. 숫자 기준은 `project-rebuild-frontend/src/data/evaluationRules.js`에 상수로 둡니다. 수업용 밸런싱이나 백엔드 저장 전에 기준 변경 이력을 이 문서에 남깁니다.

## 초기 상태값

`project-rebuild-frontend/src/systems/GameState.js` 기준입니다.

| key | 표시명 | 초기값 | 의미 |
| --- | --- | ---: | --- |
| `population` | 인구 | 1000 | 지역에 머무는 사람 수 |
| `economy` | 경제 | 50 | 지역 상권/일자리 활력 |
| `environment` | 환경 | 80 | 자연/생활 환경 상태 |
| `satisfaction` | 만족도 | 60 | 주민 체감 만족 |
| `budget` | 예산 | 1000 | 남은 정책 예산 |
| `traffic` | 교통 | 10 | 교통 불편 또는 혼잡 신호 |
| `pollution` | 오염 | 10 | 오염 부담 신호 |

## 건물 효과

`project-rebuild-frontend/src/data/buildings.js` 기준입니다.

| 건물 | 주요 효과 | 비용/예산 효과 | 배치 조건 |
| --- | --- | --- | --- |
| 청년센터 | 인구 +80, 경제 +10, 만족도 +12 | 예산 -180 | 중심지/외곽 빈 땅 |
| 버스정류장 | 인구 +40, 만족도 +10, 교통 -3 | 예산 -120 | 도로 인접 |
| 작은 공원 | 환경 +12, 만족도 +14, 오염 -4 | 예산 -140 | 숲 또는 강 인접 |

## 결과 화면 판단 기준

`project-rebuild-frontend/src/systems/EvaluationManager.js`의 `evaluateState()` 기준입니다.

균형 점수는 100점 만점이며 다음 5개 항목을 각 최대 20점으로 계산합니다.

| 항목 | 계산식 | 최대 |
| --- | --- | ---: |
| 인구 | `(population - 1000) / 10`, 0~20 사이로 제한 | 20 |
| 경제 | `(economy - 50) * 2`, 0~20 사이로 제한 | 20 |
| 환경 | `environment - 60`, 0~20 사이로 제한 | 20 |
| 만족도 | `satisfaction - 60`, 0~20 사이로 제한 | 20 |
| 예산 | `budget >= 500`이면 20, 아니면 `budget / 25`, 0 이상 | 20 |

### 평가 등급

| 조건 | 제목 | 의미 |
| --- | --- | --- |
| 서로 다른 건물 2종 이상 + 환경 70 이상 + 만족도 70 이상 + 점수 75 이상 | 균형 있는 회복 가능성이 보입니다 | 여러 지표를 함께 고려한 계획 |
| 점수 60 이상 | 지역 회복의 출발점이 마련되었습니다 | 일부 지표는 개선, 보완 필요 |
| 그 외 | 추가 조정이 필요한 계획입니다 | 한두 지표 편중 또는 전체 개선 부족 |

## 정책 방향 일치도

`EvaluationManager.calculatePolicyAlignment()` 기준입니다.

- 정책 데이터의 `recommendedBuildingIds`와 실제 배치한 `building.id`를 비교합니다.
- 건물 이름이 아니라 ID 기준입니다.

| 추천 건물 배치 수 | 메시지 |
| ---: | --- |
| 2개 이상 | 선택한 회복 방향과 시설 배치가 대체로 연결됨 |
| 1개 | 선택한 방향과 연결되는 시설이 일부 포함됨 |
| 0개 | 선택한 방향과 실제 배치가 다름 |

## 주의 신호/부작용 기준

`IssueDetector.detect()` 기준입니다.

| id | 발생 조건 | 화면 제목 | 의도 |
| --- | --- | --- | --- |
| `environment` | `environment < 60` 또는 `pollution >= 15` | 환경 주의 | 개발 효과와 환경 보전의 균형 확인 |
| `traffic` | `traffic >= 12` | 교통 불편 | 인구/시설 증가에 따른 이동 편의 확인 |
| `budget` | `budget < 500` | 예산 부족 | 비용 대비 효과와 다음 선택 여지 확인 |
| `satisfaction` | `satisfaction < 70` | 만족도 보완 | 주민 체감 개선 여부 확인 |

## 결과 화면 보조 판단 문구

`ResultScene.formatEvaluationRows()` 기준입니다.

| 항목 | 양호 기준 | 그 외 문구 |
| --- | --- | --- |
| 인구 변화 | `population >= 1100` | 아직 제한적 |
| 경제 수준 | `economy >= 60` | 추가 개선 필요 |
| 환경 상태 | `environment >= 70` | 주의 필요 |
| 주민 만족도 | `satisfaction >= 75` | 추가 개선 필요 |
| 예산 | `budget >= 500` | 주의 필요 |

## 선택 경향 문구

`EvaluationManager.getChoiceTrendMessage()` 기준입니다.

| 조건 | 문구 |
| --- | --- |
| 환경 증가 + 인구 증가 + 건물 2종 이상 | 생활·환경을 함께 고려했습니다 |
| 인구 증가 합계 > 120 또는 경제 증가 합계 > 20 | 인구·경제 회복을 강하게 선택했습니다 |
| 환경 증가 합계 > 15 또는 오염 감소 합계 < -5 | 환경 회복을 중시했습니다 |
| 그 외 | 아직 선택 경향이 뚜렷하지 않습니다 |

## 현재 한계

- 정책 선택 자체는 아직 상태값을 직접 바꾸지 않습니다.
- 시간 경과, 유지비, 주민 집단별 선호도, 장기 부작용은 없습니다.
- 건물 효과는 수업용 밸런싱 전 placeholder 수치입니다.
- 실제 정책 균형 판단보다는 “상태 변화 읽기”와 “선택 근거 말하기”를 위한 기준입니다.

## 변경 체크리스트

평가/상태값을 바꿀 때는 다음을 함께 갱신합니다.

- `src/data/buildings.js`
- `src/systems/GameState.js`
- `src/systems/IssueDetector.js`
- `src/scenes/ResultScene.js`
- `project-rebuild-frontend/tests/smoke.test.js`
- 이 문서
