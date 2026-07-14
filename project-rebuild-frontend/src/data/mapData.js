const createTile = (type, buildable, zone = 'center') => ({ type, buildable, occupied: false, zone });

const width = 12;
const height = 10;

const tiles = Array.from({ length: height }, (_row, y) => Array.from({ length: width }, (_col, x) => {
  if (y === 0 || x === 0 || x === width - 1 || y === height - 1) {
    return createTile('forest', false, 'nature');
  }
  if (x === 5 && y > 1 && y < 8) {
    return createTile('road', false, 'traffic');
  }
  if (x > 8 && y < 4) {
    return createTile('river', false, 'nature');
  }
  return createTile('empty', true, y < 5 ? 'center' : 'outskirts');
}));

export const mapData = {
  width,
  height,
  tileWidth: 96,
  tileHeight: 48,
  tiles,
};
