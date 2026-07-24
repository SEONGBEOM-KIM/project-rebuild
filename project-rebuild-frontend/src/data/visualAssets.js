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
  exploration: Object.freeze({
    school: Object.freeze({
      textureKey: 'ep1-exploration-school',
      source: '/assets/ep1/exploration-school.png',
    }),
    market: Object.freeze({
      textureKey: 'ep1-exploration-market',
      source: '/assets/ep1/exploration-market.png',
    }),
    bus_stop: Object.freeze({
      textureKey: 'ep1-exploration-bus-stop',
      source: '/assets/ep1/exploration-bus-stop.png',
    }),
    clinic: Object.freeze({
      textureKey: 'ep1-exploration-clinic',
      source: '/assets/ep1/exploration-clinic.png',
    }),
    empty_houses: Object.freeze({
      textureKey: 'ep1-exploration-empty-houses',
      source: '/assets/ep1/exploration-empty-houses.png',
    }),
  }),
  atlas: Object.freeze({
    key: 'ep1-buildings',
    image: '/assets/ep1/building-art-pack.png',
    data: '/assets/ep1/building-art-pack.json',
  }),
});

export const TITLE_VISUAL_ASSETS = Object.freeze({
  background: Object.freeze({
    textureKey: 'title-main-background',
    source: '/assets/title/main-background.png',
  }),
});

export function getEp1VisualAsset(buildingId) {
  return EP1_VISUAL_ASSETS.buildings[buildingId] ?? null;
}

export function getEp1ExplorationVisual(placeId) {
  return EP1_VISUAL_ASSETS.exploration[placeId] ?? null;
}
