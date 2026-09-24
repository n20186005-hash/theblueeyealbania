// Server-side weather data layer for The Blue Eye (Syri i Kaltër), Albania.
//
// Data is fetched from Open-Meteo (open-meteo.com), a free, key-less weather
// API suitable for non-profit and public-interest projects. This module runs
// only on the server (inside a Server Component) so the upstream request and any
// caching stay server-side; visitors never see API keys or provider wording in
// the UI. The weather itself is rendered as plain, visitor-facing advice.

import { siteConfig } from '@/config/site';

export type CurrentWeather = {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  precipitation_probability: number;
  weather_code: number;
  wind_speed_10m: number;
};

export type DailyForecast = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
};

export type WeatherPayload = {
  current: CurrentWeather;
  daily: DailyForecast;
};

const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast' +
  `?latitude=${siteConfig.coordinates.latitude}` +
  `&longitude=${siteConfig.coordinates.longitude}` +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset' +
  `&timezone=${encodeURIComponent(siteConfig.timezone)}` +
  '&forecast_days=7';

// Revalidate at most every 10 minutes so the figures stay fresh without
// hammering the upstream API. On runtimes that don't honour the cache, the
// fetch simply runs per request — still harmless.
export async function getWeather(): Promise<WeatherPayload | null> {
  try {
    const res = await fetch(ENDPOINT, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const json = (await res.json()) as Partial<WeatherPayload>;
    if (!json?.current || !json?.daily) return null;
    return json as WeatherPayload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Actionable advice engine
//
// The Blue Eye is an inland karst spring in a wooded valley ~30 min from the
// Sarandë coast: a ~1.5–2 km forest trail, no swimming, ~10°C water. The
// advice below is tuned to that reality (forest path, valley/stream, nearby
// coast) and is driven entirely by the forecast — never by a fabricated
// official alert; derived "risk" lines come from the live conditions.
// ---------------------------------------------------------------------------

export type AdviceBlock = {
  outfit: string[];
  plan: string[];
  items: string[];
  risk: string[];
};

type CodeGroup = 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm' | 'other';

function codeGroup(code: number): CodeGroup {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) return 'drizzle';
  if (
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82
  )
    return 'rain';
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return 'snow';
  if (code === 95 || code === 96 || code === 99) return 'storm';
  return 'other';
}

// Convert wind speed (km/h) to the Beaufort scale for the thresholds used below.
function kmToBeaufort(kmh: number): number {
  const upper = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];
  for (let i = 0; i < upper.length; i++) if (kmh <= upper[i]) return i;
  return 12;
}

// Localized advice copy keyed by condition. Each value is a human, non-technical
// phrase a visitor can act on. Keys map to the four advice groups in buildAdvice.
const TEXT: Record<string, Record<string, string>> = {
  en: {
    'label.outfit': 'What to wear',
    'label.plan': 'Plan for your visit',
    'label.items': 'Things to bring',
    'label.risk': 'Caution',
    'rainProbHigh.plan': 'High chance of rain — bring rain gear and favour sheltered stops.',
    'rainProbHigh.items': 'Umbrella or raincoat',
    'drizzle.outfit': 'Trails get slippery — wear shoes with grip.',
    'drizzle.plan': 'Open-air spots are less enjoyable; keep an indoor backup in mind.',
    'drizzle.items': 'Folding umbrella',
    'heavyRain.risk': 'Heavy rain — avoid valleys, low ground and the stream banks.',
    'heavyRain.plan': 'Not ideal for long outdoor stays; the forest trail turns muddy.',
    'heavyRain.items': 'Raincoat; skip long umbrellas when it is windy',
    'storm.risk': 'Thunderstorms — no climbing, no streamside, no sheltering under trees.',
    'storm.plan': 'Water and open-air activities are likely closed.',
    'snow.plan': 'Snow is possible — the trail may be icy, so walk carefully.',
    'hot.outfit': 'Light, breathable clothing',
    'hot.plan': 'Avoid midday and shorten time outdoors.',
    'hot.items': 'Sun protection, plenty of water and something to cool off',
    'uv.outfit': 'Wear a sun hat and shield yourself from the sun.',
    'uv.items': 'Sunscreen, sunglasses and a sun hat',
    'tempDiff.outfit': 'Big day-to-night swing — pack a layer you can add or remove.',
    'cold.outfit': 'Cold — dress warmly.',
    'cold.items': 'Warm jacket and a scarf',
    'wind56.outfit': 'Breezy — secure your hat and skip flowy dresses.',
    'wind56.plan': 'On the forest trail watch for falling branches; coastal boats may pause.',
    'wind7.risk': 'Strong wind — keep clear of billboards, coastal rocks and tall trees.',
    'wind7.plan': 'Open-water activities are likely closed.',
    'clear.plan': 'Fine weather — great for the outdoors and sunrise or sunset.',
    'clear.items': "Don't forget sun protection",
    'cloudy.plan': 'Soft light — excellent for photos and longer walks.',
    'fog.risk': 'Poor visibility — ferries and flights may be delayed; not good for views.',
    'fog.items': 'A face mask',
  },
  sq: {
    'label.outfit': 'Çfarë të vish',
    'label.plan': 'Planifikimi i vizitës',
    'label.items': 'Gjëra për të marrë',
    'label.risk': 'Kujdes',
    'rainProbHigh.plan': 'Ka shumë gjasa shiu — merrni gjëra kundër shiut dhe zgjidhni ndalesa më të mbrojtura.',
    'rainProbHigh.items': 'Çadër ose mantel shiu',
    'drizzle.outfit': 'Shtigjet bëhen rrëshqitëse — vishni këpucë me kapje.',
    'drizzle.plan': 'Vendet e hapura janë më pak të kënaqshme; mbajini një alternativë të mbyllur.',
    'drizzle.items': 'Çadër e palosshme',
    'heavyRain.risk': 'Shi i fortë — shmangni luginat, tokën e ulët dhe brigjet e përroit.',
    'heavyRain.plan': "Nuk është ideale për qëndrime të gjata jashtë; shtegu pyjor bëhet baltë.",
    'heavyRain.items': 'Mantel shiu; shmangni çadrat e gjata kur ka erë',
    'storm.risk': 'Stuhi me rrufe — mos ngjisni, mos qëndroni pranë përoit ose nën pemë.',
    'storm.plan': 'Aktivitetet ujore dhe të hapura ka gjasa të jenë të mbyllura.',
    'snow.plan': 'Mund të bjerë borë — shtegu mund të jetë i akullt, ecni me kujdes.',
    'hot.outfit': 'Veshje të lehta e transmetuese',
    'hot.plan': 'Shmangni mesditën dhe shkurtoni kohën jashtë.',
    'hot.items': 'Mbrojtje nga dielli, ujë të mjaftueshëm dhe diçka për freskim',
    'uv.outfit': 'Vishni kapelë dhe mbroni nga dielli.',
    'uv.items': 'Krem dielli, syze dielli dhe kapelë',
    'tempDiff.outfit': 'Ndryshim i madh ditë–natë — merrni një shtresë për të veshur ose hequr.',
    'cold.outfit': 'Ftohtë — vishni ngrohtë.',
    'cold.items': 'Xhaketë e ngrohtë dhe shall',
    'wind56.outfit': 'Erë — siguroni kapelën dhe shmangni fustanat e gjerë.',
    'wind56.plan': 'Në shtegun pyjor kujdes nga degët që bien; varkat bregdetare mund të ndalen.',
    'wind7.risk': 'Erë e fortë — largohuni nga reklamat, shkëmbinjtë bregdetarë dhe pemët e larta.',
    'wind7.plan': 'Aktivitetet ujore jashtë ka gjasa të jenë të mbyllura.',
    'clear.plan': 'Mot i mirë — i shkëlqyer për jashtë dhe lindje ose perëndim dielli.',
    'clear.items': 'Mos harroni mbrojtjen nga dielli',
    'cloudy.plan': 'Dritë e butë — e shkëlqyer për foto dhe ecje të gjata.',
    'fog.risk': 'Pamje e dobët — tragetonët dhe fluturimet mund të vonohen; jo e mira për pamje.',
    'fog.items': 'Maskë fytyre',
  },
  zh: {
    'label.outfit': '出行穿搭',
    'label.plan': '游玩安排',
    'label.items': '随身物品',
    'label.risk': '风险提醒',
    'rainProbHigh.plan': '降雨概率较高，请备好雨具并优先安排有遮蔽的停留点。',
    'rainProbHigh.items': '雨伞或雨衣',
    'drizzle.outfit': '步道易湿滑，请穿防滑鞋。',
    'drizzle.plan': '露天体验较差，预留室内备选。',
    'drizzle.items': '折叠伞',
    'heavyRain.risk': '降雨较强，避开山谷、低洼与溪边。',
    'heavyRain.plan': '不宜长时间户外，林间步道易泥泞。',
    'heavyRain.items': '雨衣；风大时不建议长柄伞',
    'storm.risk': '谨防雷电，勿登山、勿靠近溪谷水域、勿在树下避雨。',
    'storm.plan': '水上与露天项目大概率关闭。',
    'snow.plan': '可能有雪，步道或结冰，请小心慢行。',
    'hot.outfit': '轻薄透气衣物',
    'hot.plan': '避开正午，缩短户外时间。',
    'hot.items': '防晒、充足饮用水与防暑用品',
    'uv.outfit': '注意防晒，戴遮阳帽。',
    'uv.items': '防晒霜、墨镜与遮阳帽',
    'tempDiff.outfit': '昼夜温差大，备一件外套方便增减。',
    'cold.outfit': '气温偏低，做好防寒。',
    'cold.items': '厚外套与围巾',
    'wind56.outfit': '风较大，系好帽带、避免穿宽松长裙。',
    'wind56.plan': '林间步道注意避让摇落树枝；沿海游船可能停航。',
    'wind7.risk': '大风天气，远离广告牌、海边礁石与高耸树木。',
    'wind7.plan': '户外水上项目大概率关闭。',
    'clear.plan': '天气晴好，适合户外与看日出日落。',
    'clear.items': '记得防晒',
    'cloudy.plan': '光线柔和，很适合拍照与长时间户外。',
    'fog.risk': '能见度差，轮渡航班易延误，不适合观景。',
    'fog.items': '口罩',
  },
};

export function adviceLabels(locale: string): {
  outfit: string;
  plan: string;
  items: string;
  risk: string;
} {
  const L = TEXT[locale] ? locale : 'en';
  return {
    outfit: TEXT[L]['label.outfit'] ?? TEXT.en['label.outfit'],
    plan: TEXT[L]['label.plan'] ?? TEXT.en['label.plan'],
    items: TEXT[L]['label.items'] ?? TEXT.en['label.items'],
    risk: TEXT[L]['label.risk'] ?? TEXT.en['label.risk'],
  };
}

export function buildAdvice(d: WeatherPayload, locale: string): AdviceBlock {
  const L = TEXT[locale] ? locale : 'en';
  const get = (k: string) => TEXT[L][k] ?? TEXT.en[k] ?? '';

  const code = d.current.weather_code;
  const g = codeGroup(code);
  const maxT = d.daily.temperature_2m_max[0];
  const minT = d.daily.temperature_2m_min[0];
  const diff = maxT - minT;
  const prob = d.current.precipitation_probability;
  const uv = d.daily.uv_index_max?.[0] ?? 0;
  const w = kmToBeaufort(d.current.wind_speed_10m);

  const keys: AdviceBlock = { outfit: [], plan: [], items: [], risk: [] };

  // --- Precipitation ---
  if (g === 'storm') {
    keys.risk.push('storm.risk');
    keys.plan.push('storm.plan');
  } else if (g === 'rain') {
    keys.risk.push('heavyRain.risk');
    keys.plan.push('heavyRain.plan');
    keys.items.push('heavyRain.items');
  } else if (g === 'drizzle') {
    keys.outfit.push('drizzle.outfit');
    keys.plan.push('drizzle.plan');
    keys.items.push('drizzle.items');
  } else if (g === 'snow') {
    keys.plan.push('snow.plan');
  } else if (prob >= 60) {
    keys.plan.push('rainProbHigh.plan');
    keys.items.push('rainProbHigh.items');
  }

  // --- Sky state (when not in a wet/storm group) ---
  if (g === 'fog') {
    keys.risk.push('fog.risk');
    keys.items.push('fog.items');
  } else if (g === 'clear') {
    keys.plan.push('clear.plan');
    keys.items.push('clear.items');
  } else if (g === 'cloudy') {
    keys.plan.push('cloudy.plan');
  }

  // --- Heat & UV ---
  if (maxT >= 32) {
    keys.outfit.push('hot.outfit');
    keys.plan.push('hot.plan');
    keys.items.push('hot.items');
  }
  if (uv >= 5) {
    keys.outfit.push('uv.outfit');
    keys.items.push('uv.items');
  }
  if (diff > 8) {
    keys.outfit.push('tempDiff.outfit');
  }
  if (maxT <= 10) {
    keys.outfit.push('cold.outfit');
    keys.items.push('cold.items');
  }

  // --- Wind ---
  if (w >= 7) {
    keys.risk.push('wind7.risk');
    keys.plan.push('wind7.plan');
  } else if (w >= 5) {
    keys.outfit.push('wind56.outfit');
    keys.plan.push('wind56.plan');
  }

  return {
    outfit: keys.outfit.map(get),
    plan: keys.plan.map(get),
    items: keys.items.map(get),
    risk: keys.risk.map(get),
  };
}
