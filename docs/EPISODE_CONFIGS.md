# Episode Placement Configs

에피소드별 시설 배치 규칙은 Scene에 직접 하드코딩하지 않고 config/profile로 교체한다.
현재 기본 화면은 `ep2_population_recovery`를 사용하며, `ep2_environment_focus`는 구조 검증용 alternate config다.

## 핵심 파일

- `project-rebuild-frontend/src/data/episodePlacementConfigs.js`
  - 에피소드/전략별 배치 설정
  - `map`, `buildings`, `requiredPlacements`, `stateKeys`, `evaluationProfileId`를 가진다.
- `project-rebuild-frontend/src/data/evaluationRules.js`
  - 평가 프로필 registry
  - `issueThresholds`, `resultThresholds`, `scoreRules`, `reactionThresholds`를 가진다.
- `project-rebuild-frontend/src/systems/PlacementContextManager.js`
  - registry/progress/strategy/learningData에서 active placement config와 evaluation profile을 해석한다.

## 새 에피소드/전략 config 추가 순서

1. 필요한 시설 목록을 `src/data/buildings.js` 또는 별도 data 파일로 준비한다.
2. 필요한 지도 데이터를 `src/data/mapData.js` 또는 별도 data 파일로 준비한다.
3. 필요하면 `src/data/evaluationRules.js`에 새 evaluation profile ID를 추가한다.
4. `src/data/episodePlacementConfigs.js`에 새 placement config ID를 추가한다.
5. 전략에서 해당 config를 쓰게 하려면 `src/data/episodeContent.js`의 strategy에 `placementConfigId`를 연결한다.
6. `npm --prefix project-rebuild-frontend run verify`로 smoke/build를 통과시킨다.

## config 필드 의미

```js
{
  id: 'ep2_environment_focus',
  episodeId: 'ep2',
  title: '푸른군 환경 균형 배치 실험',
  map: mapData,
  buildings,
  requiredPlacements: 2,
  evaluationProfileId: ENVIRONMENT_EVALUATION_PROFILE_ID,
  stateKeys: ['environment', 'pollution', 'budget'],
}
```

- `requiredPlacements`: 결과 확인 가능 조건. 배치 화면 버튼 판정에 직접 사용된다.
- `stateKeys`: 배치 상태바, 최근 변화, 배치 기록, 결과 비교, 엔딩/리포트 상태 요약에 사용된다.
- `evaluationProfileId`: 결과 점수, 판단 기준, 주의 신호, 주민 반응, 엔딩/저장/리포트 이슈 기준에 사용된다.

## 유지해야 할 원칙

- Scene에서 `getPlacementConfig()`와 `getEvaluationProfile()`를 반복해서 직접 조합하지 않는다.
  - 배치 초기화 자체가 필요한 `PlacementScene`은 예외다.
  - 결과/회고/엔딩/저장/리포트 경로는 `PlacementContextManager`를 사용한다.
- 새 config를 추가하면 최소한 다음 테스트를 보강한다.
  - config registry 조회
  - context 해석
  - `requiredPlacements` 판정
  - 저장/API/복원 메타 보존
- 실제 에피소드 내용이 확정되기 전에는 alternate config를 기본 UI 경로에 노출하지 않는다.
