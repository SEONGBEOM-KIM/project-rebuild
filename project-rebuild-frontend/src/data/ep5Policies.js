import { ep5Buildings } from './ep5Buildings.js';

const names = (ids) => ids.map((id) => ep5Buildings.find((building) => building.id === id)?.name ?? id);

export const ep5Policies = [
  { id: 'mobility_green_network', name: '이동·녹지 연결 계획', tagline: '혼잡을 줄이고 생활권을 잇기', description: '대중교통·보행·녹지를 함께 연결해 이동 부담을 먼저 낮춥니다.', focus: ['교통', '환경', '생활 접근성'], recommendedBuildingIds: ['transit_exchange', 'green_buffer_park', 'community_benefit_center'], note: 'EP5 균형안: 교통을 우선 해결하면서 환경과 생활 혜택을 함께 관리합니다.', color: 0xfacc15 },
  { id: 'clean_growth_guardrails', name: '친환경 성장 기준', tagline: '성장을 지키며 오염 낮추기', description: '녹지 완충과 친환경 물류 기준으로 오염을 먼저 낮춥니다.', focus: ['환경', '교통', '지역 일자리'], recommendedBuildingIds: ['green_buffer_park', 'clean_logistics_station', 'community_benefit_center'], note: 'EP5 균형안: 환경을 우선 해결하면서 이동과 생활 혜택을 함께 관리합니다.', color: 0x4ade80 },
  { id: 'inclusive_local_benefits', name: '생활 혜택 공유 계획', tagline: '성장 효과를 주민 생활로 연결하기', description: '상생 센터와 이동·환경 시설을 조합해 주민이 체감하는 혜택을 넓힙니다.', focus: ['생활 혜택', '교통', '환경'], recommendedBuildingIds: ['community_benefit_center', 'transit_exchange', 'green_buffer_park'], note: 'EP5 균형안: 생활 혜택을 우선 해결하면서 교통과 환경을 함께 관리합니다.', color: 0xa78bfa },
].map((policy) => ({ ...policy, recommendedBuildings: names(policy.recommendedBuildingIds) }));

export function getEp5Policy(policyId) {
  return ep5Policies.find((policy) => policy.id === policyId) ?? null;
}
