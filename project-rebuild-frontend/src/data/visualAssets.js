export const EP1_VISUAL_ASSETS = Object.freeze({
  buildings: Object.freeze({
    bus_station: Object.freeze({
      frame: 'bus_station',
      label: '버스정류장',
      source: '/assets/ep1/building-art-pack-generated.png',
    }),
    youth_center: Object.freeze({
      frame: 'youth_center',
      label: '청년센터',
      source: '/assets/ep1/building-art-pack-generated.png',
    }),
    small_park: Object.freeze({
      frame: 'small_park',
      label: '작은 공원',
      source: '/assets/ep1/building-art-pack-generated.png',
    }),
  }),
  atlas: Object.freeze({
    key: 'ep1-buildings',
    image: '/assets/ep1/building-art-pack-generated.png',
    data: '/assets/ep1/building-art-pack.json',
  }),
});

export function getEp1VisualAsset(buildingId) {
  return EP1_VISUAL_ASSETS.buildings[buildingId] ?? null;
}
