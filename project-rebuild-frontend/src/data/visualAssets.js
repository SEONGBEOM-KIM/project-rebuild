export const EP1_VISUAL_ASSETS = Object.freeze({
  buildings: Object.freeze({
    bus_station: Object.freeze({
      frame: 'bus_station',
      label: '버스정류장',
      textureKey: 'ep1-building-bus-station',
      source: '/assets/ep1/bus-station.png',
    }),
    youth_center: Object.freeze({
      frame: 'youth_center',
      label: '청년센터',
      textureKey: 'ep1-building-youth-center',
      source: '/assets/ep1/youth-center.png',
    }),
    small_park: Object.freeze({
      frame: 'small_park',
      label: '작은 공원',
      textureKey: 'ep1-building-small-park',
      source: '/assets/ep1/small-park.png',
    }),
  }),
  atlas: Object.freeze({
    key: 'ep1-buildings',
    image: '/assets/ep1/building-art-pack.png',
    data: '/assets/ep1/building-art-pack.json',
  }),
});

export function getEp1VisualAsset(buildingId) {
  return EP1_VISUAL_ASSETS.buildings[buildingId] ?? null;
}
