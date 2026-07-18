export const DEFAULT_STATE_KEYS = [
  'population',
  'economy',
  'environment',
  'satisfaction',
  'budget',
  'traffic',
  'pollution',
];

export const STATE_LABELS = {
  population: '인구',
  economy: '경제',
  environment: '환경',
  satisfaction: '만족도',
  budget: '예산',
  traffic: '교통',
  pollution: '오염',
};

export const STATE_ICONS = {
  population: '👥',
  economy: '🏪',
  environment: '🌿',
  satisfaction: '😊',
  budget: '💰',
  traffic: '🚌',
  pollution: '☁️',
};

export function formatSignedValue(value) {
  return `${value > 0 ? '+' : ''}${value}`;
}

export function formatEffect(effect) {
  return Object.entries(effect)
    .map(([key, value]) => `${STATE_LABELS[key] ?? key} ${formatSignedValue(value)}`)
    .join(' / ');
}
