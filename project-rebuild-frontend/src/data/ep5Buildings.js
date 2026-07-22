export const ep5Buildings = [
  {
    id: 'transit_exchange', name: '환승·보행 거점', description: '대중교통과 보행 동선을 연결해 물류·통근 혼잡을 낮추는 시설', placementHint: '도로와 인접한 중심지에 배치 가능', footprint: { width: 2, height: 2 }, cost: 190, color: 0xfacc15, allowedZones: ['center'], requiresAdjacentType: 'road', balanceNote: '교통과 오염을 낮추고 주민 이동 만족도를 높입니다.', balanceSummary: '교통↓ 오염↓ 만족도↑', effect: { traffic: -5, pollution: -1, satisfaction: 8, budget: -190 },
  },
  {
    id: 'green_buffer_park', name: '녹지 완충 공원', description: '산업·도로 주변의 오염과 소음을 줄이고 주민 휴식 공간을 만드는 시설', placementHint: '숲 또는 외곽 빈 땅에 배치 가능', footprint: { width: 2, height: 2 }, cost: 160, color: 0x4ade80, allowedZones: ['forest', 'outskirts'], balanceNote: '환경과 만족도를 높이고 오염 부담을 낮춥니다.', balanceSummary: '환경↑ 오염↓ 만족도↑', effect: { environment: 10, pollution: -5, satisfaction: 7, budget: -160 },
  },
  {
    id: 'community_benefit_center', name: '지역 상생 센터', description: '지역 일자리·생활 지원·공공 서비스를 연결해 성장 혜택을 넓히는 시설', placementHint: '중심지 빈 땅에 배치 가능', footprint: { width: 2, height: 2 }, cost: 180, color: 0xa78bfa, allowedZones: ['center'], balanceNote: '주민 만족과 지역 경제 연결을 높여 성장 혜택의 격차를 완화합니다.', balanceSummary: '만족도↑ 경제↑ 생활 기반↑', effect: { satisfaction: 11, economy: 8, population: 30, budget: -180 },
  },
  {
    id: 'clean_logistics_station', name: '친환경 물류 정류장', description: '공동 배송과 저공해 운송을 연결해 산업 물류의 환경 부담을 낮추는 시설', placementHint: '도로와 인접한 외곽 빈 땅에 배치 가능', footprint: { width: 2, height: 2 }, cost: 210, color: 0x60a5fa, allowedZones: ['outskirts'], requiresAdjacentType: 'road', balanceNote: '경제 연결을 유지하면서 교통·오염 부담을 함께 줄입니다.', balanceSummary: '경제↑ 교통↓ 오염↓', effect: { economy: 10, traffic: -3, pollution: -3, budget: -210 },
  },
];
