// ============================================================
// NUMEROLOGY CALCULATION ENGINE
// All reading data is sourced directly from the practitioner's
// own system — do not modify without consulting the numerologist.
// ============================================================

// Lo Shu Grid layout (fixed ancient arrangement)
export const LOSHU_GRID_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
] as const;

export const GRID_NUMBERS = [4, 9, 2, 3, 5, 7, 8, 1, 6];


// ─────────────────────────────────────────────────────────────
// PERSONALITY NUMBER DATA  (DOB digit-sum → single planet ruler)
// ─────────────────────────────────────────────────────────────
export interface PersonalityData {
  number: number;
  planet: string;
  title: string;
  generalTraits: string[];
  negativeTraits: string[];
  advice: string[];
}

export const PERSONALITY_DATA: Record<number, PersonalityData> = {
  1: {
    number: 1,
    planet: 'Sun (Surya)',
    title: 'The Leader',
    generalTraits: [
      'Natural leaders who inspire others effortlessly',
      'Kind and compassionate at heart',
      'Deeply patriotic and proud of their roots',
      'Spiritually inclined and religious',
      'Unstoppable — they do not tolerate suppression',
      'Have a unique, distinct identity',
      'Always moving forward — never stagnant',
      'Highly ambitious with a drive to succeed',
      'Love to lead, guide, and give direction',
    ],
    negativeTraits: [
      'Avoid taking help — pride gets in the way',
      'Can be stubborn to the point of self-harm',
      'Speaking harsh truths without tact creates enemies',
      'Struggle with anger — quick to flare up',
      'Too much discipline can come off as cold or rude',
    ],
    advice: [
      'Let go of ego to grow — accepting help is strength, not weakness',
      'Flexibility is not weakness; it is wisdom',
      'Control your anger before it controls your relationships',
      'Tone matters as much as truth — deliver it with care',
    ],
  },
  2: {
    number: 2,
    planet: 'Moon (Chandra)',
    title: 'The Nurturer',
    generalTraits: [
      'Deeply emotional and highly sensitive',
      'Naturally gentle, caring, and warm',
      'Always encouraging others, even at the cost of self',
      'Prefer to work behind the scenes and stay low-profile',
      'Overthinkers by nature, but thoughtful in action',
      'Avoid large crowds — prefer intimate settings',
      'Soft-hearted and deeply value peace and harmony',
      'When they choose someone, they give their whole heart',
    ],
    negativeTraits: [
      'Overthinking fuels anger and emotional distress',
      'Struggle to express feelings, which builds frustration',
      'Set high expectations of others — often leading to disappointment',
      'Can over-invest in friendships at the cost of family',
    ],
    advice: [
      'Learn to adapt and face reality as it is, not as you wish it to be',
      'Do not set unrealistic expectations from others',
      'Choose your close circle wisely',
      'Balance your investment in friendships with family responsibilities',
    ],
  },
  3: {
    number: 3,
    planet: 'Jupiter (Brahaspati)',
    title: 'The Advisor',
    generalTraits: [
      'Always in pursuit of knowledge; value wisdom over money',
      'Strong sense of right and wrong — a natural moral compass',
      'Approach every task with thoughtfulness and clear intent',
      'Excellent advisors — people naturally seek their counsel',
      'Naturally self-confident and self-assured',
      'Can be dominating and thrive in influential roles',
      'Committed to completing tasks thoroughly and correctly',
      'Social, friendly, and easy to be around',
      'Deep interest in occult sciences and the mystical',
    ],
    negativeTraits: [
      'Habit of arguing unnecessarily drains energy',
      'Can become overconfident and lose touch with reality',
      'Use strong logic to intimidate rather than guide',
      'Stubbornness creates conflict, especially at home',
    ],
    advice: [
      'Drop the habit of arguing — not every battle is worth fighting',
      'Stay grounded — overconfidence can undo all progress',
      'Use your logic to uplift, not to overpower',
      'Focus on one task at a time for better, lasting results',
      'Be open to listening, especially to those closest to you',
    ],
  },
  4: {
    number: 4,
    planet: 'Rahu',
    title: 'The Strategist',
    generalTraits: [
      'Naturally bold and fearless — built for challenges',
      'Mindful, strategic thinkers with a sharp edge',
      'Strong managers, organizers, and planners',
      'Born to lead — take charge naturally',
      'Have a natural talent for managing and growing money',
      'Hardworking with an active, ever-moving mind',
      'A playful streak balances their serious exterior',
      'Tend to be less emotional — can seem distant but are deeply aware',
      'Expert at controlling situations — bring calm to chaos',
    ],
    negativeTraits: [
      'Harsh truths delivered at the wrong time create lasting enemies',
      'Holding on to revenge drains peace and poisons progress',
      'Trying to manipulate others\' thinking lowers their own image',
      'Selfish tendencies can damage valuable relationships',
    ],
    advice: [
      'Timing and tone matter as much as content — choose them wisely',
      'Let go of grudges — revenge is the heaviest burden',
      'Relationships are two-way: if you expect support, offer it too',
      'Check selfish impulses; your success multiplies when others rise with you',
    ],
  },
  5: {
    number: 5,
    planet: 'Mercury (Budh)',
    title: 'The Explorer',
    generalTraits: [
      'The number of balance — a natural equalizer in any group',
      'Gets along with everyone — universally friendly and sociable',
      'Lively, carefree, and naturally entertaining',
      'Open to every experience — rarely say no',
      'Love to travel, learn, and constantly explore',
      'A true all-rounder — adaptable across fields',
      'Quick to act and quick to attract — especially romantically',
      'Romantic, curious, and always enthusiastic',
      'Always finds support when needed — people want to help them',
      'Free-spirited by nature — cannot be tied down for long',
      'Never genuinely bad-hearted, even if misunderstood at times',
    ],
    negativeTraits: [
      'Often seek to avoid hard work — prefer the easy path',
      'Stubbornness surfaces in unexpected moments',
      'Sharp and sometimes ruthless responses create unnecessary enemies',
      'Self-doubt quietly holds them back',
      'Can develop addictive tendencies if not mindful',
      'Romantic curiosity can become excessive',
    ],
    advice: [
      'Hard work is what separates a good life from a great one — embrace it',
      'Practice anger control — calm responses build more respect',
      'Let go of self-doubt; your versatility is a genuine gift',
      'Be mindful of addictive habits before they become hard to break',
    ],
  },
  6: {
    number: 6,
    planet: 'Venus (Shukra)',
    title: 'The Aesthete',
    generalTraits: [
      'Strong inclination toward beauty, art, and aesthetics',
      'Always well-groomed and stylishly presented',
      'Love modern, refined style — carry it well even on a budget',
      'Frequent travelers, always on the move',
      'Skilled at adapting — make the best of any situation',
      'Genuinely respect others\' emotions and value hospitality',
      'Find deep joy in family time and honest hard work',
      'Ethical and straightforward in their approach to life',
      'Naturally charming and drawn to the opposite sex',
    ],
    negativeTraits: [
      'When angry, cannot tolerate any form of opposition',
      'Laziness can surface and block consistent effort',
      'Money-minded nature can overshadow relationships',
      'Tend to gossip or chat excessively, even over trivial things',
      'Jealousy and vengeful feelings can simmer beneath the surface',
    ],
    advice: [
      'Don\'t fear slow progress — consistent effort leads to lasting success',
      'Control jealousy before it controls your relationships',
      'Let your love for beauty enrich family life, not replace it',
      'Channel your social energy into building, not gossiping',
    ],
  },
  7: {
    number: 7,
    planet: 'Ketu',
    title: 'The Seeker',
    generalTraits: [
      'Highly emotional and deeply driven by the heart',
      'Natural researchers and deep, analytical thinkers',
      'Loyal and dedicated — in work and in friendship',
      'Prefer doing things in their own unique way',
      'Philosophical and spiritually inclined — seekers of truth',
      'Drawn to science, tantra, and meditative practices',
      'Embrace simplicity in lifestyle despite their depth of mind',
      'Prone to being taken advantage of due to their deep trust',
    ],
    negativeTraits: [
      'Tendency to leave projects unfinished when interest fades',
      'High sensitivity makes them reactive to small things',
      'Can get so caught in intellectual pursuits that family is neglected',
    ],
    advice: [
      'Finish what you start — completion is where power lives',
      'Control sensitivity and impulsiveness; pause before reacting',
      'Prioritize home and family — they are your true anchor',
    ],
  },
  8: {
    number: 8,
    planet: 'Saturn (Shani)',
    title: 'The Resilient',
    generalTraits: [
      'Clean and honest heart with no hidden agenda',
      'Physically strong and mentally resilient — built for adversity',
      'Adapt well to different circumstances and environments',
      'Deeply religious or spiritually inclined — faith keeps them grounded',
      'Loyal and completely true to those close to them',
      'Stubborn nature — both a strength and a weakness',
      'Sharp sense of judgment — can read people and situations accurately',
      'Find genuine satisfaction in material stability and comfort',
    ],
    negativeTraits: [
      'Can neglect physical and mental health while chasing goals',
      'Prone to intoxication or addictive habits as an escape',
      'Can be perceived as cold, selfish, or emotionally unavailable',
      'Tendency to suppress emotion — love, desire, and vulnerability',
    ],
    advice: [
      'Prioritize your health — it is the true foundation of all success',
      'Steer clear of any intoxication; it clouds your remarkable clarity',
      'Awaken compassion — warmth will open doors that logic cannot',
      'Stay connected to your emotions — they are part of a full life',
    ],
  },
  9: {
    number: 9,
    planet: 'Mars (Mangal)',
    title: 'The Commander',
    generalTraits: [
      'The Commander in Chief — leads from the front with strength',
      'A natural social worker driven by purpose and service',
      'A true all-rounder — handles multiple roles with efficiency',
      'Prioritizes the greater good — sometimes at the cost of family balance',
      'Anger rises fast, but fades just as quickly',
      'Absolutely fearless — would rather fall than bow to injustice',
      'Unbreakable spirit — loses battles but never the will to fight',
      'Relentless work ethic — tireless and unstoppable',
      'Lives fully in the present with vigor and passion',
      'Early life may be challenging, but later years bring peace and respect',
    ],
    negativeTraits: [
      'Early career can be unsettled — shifting between paths',
      'Hasty decisions and impulsive action lead to avoidable mistakes',
      'Anger, when uncontrolled, damages personal and professional bonds',
      'A subtle need for showmanship can undermine authenticity',
      'Can neglect the relationship with a life partner while caring for others',
    ],
    advice: [
      'Practice patience and reflection before acting — think before you leap',
      'Anger management is the single most powerful investment you can make',
      'Let go of any need for performance — authenticity will take you further',
      'Balance giving to the world with nurturing what is closest to you',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// DESTINY NUMBER DATA  (name letter-sum)
// ─────────────────────────────────────────────────────────────
export interface DestinyData {
  number: number;
  planet: string;
  title: string;
  traits: string[];
}

export const DESTINY_DATA: Record<number, DestinyData> = {
  1: {
    number: 1,
    planet: 'Sun (Surya)',
    title: 'The Independent',
    traits: [
      'Often begin by relying on others but grow into strong, self-reliant leaders',
      'You learn your greatest lessons by standing independently',
      'Self-centered in a purposeful way — progressive, determined, and stubborn',
      'Your strong work ethic propels you to great success',
    ],
  },
  2: {
    number: 2,
    planet: 'Moon (Chandra)',
    title: 'The Supporter',
    traits: [
      'More satisfied as a key ally than as the one in the spotlight',
      'You want to do everything in peace — harmony is your natural state',
      'Proactive toward others\' needs — you sense what people require before they ask',
    ],
  },
  3: {
    number: 3,
    planet: 'Jupiter (Brahaspati)',
    title: 'The Teacher',
    traits: [
      'Naturally active and alert — always mentally engaged and curious',
      'You possess a rich bank of thoughts and ideas',
      'Sometimes struggle with motivation to act on all that you know',
      'Sharing knowledge brings you deep joy — you love guiding others',
      'Your clarity and communication make you a great teacher or mentor',
    ],
  },
  4: {
    number: 4,
    planet: 'Rahu',
    title: 'The Problem-Solver',
    traits: [
      'You work harder than most to achieve success — and your determination sees you through',
      'You value self-respect deeply and never compromise on your core principles',
      'Hardworking and adaptable — you course-correct quickly when needed',
      'You enjoy solving complex, layered problems — simple tasks rarely hold your interest',
    ],
  },
  5: {
    number: 5,
    planet: 'Mercury (Budh)',
    title: 'The Free Spirit',
    traits: [
      'Prefer working outside the family business — independence matters',
      'Get bored easily with routine — you need variety and movement',
      'Hold a strong belief in destiny — things happen for a reason',
      'Juggle multiple things at once with surprising ease',
      'Slow to focus but once locked in, you achieve success steadily',
    ],
  },
  6: {
    number: 6,
    planet: 'Venus (Shukra)',
    title: 'The Helper',
    traits: [
      'Always ready to support others — your first instinct is to help',
      'Help without being asked — you sense the need before it is expressed',
      'Take on others\' problems, sometimes at your own cost',
      'Known for fair, unbiased judgment — people trust your opinion',
    ],
  },
  7: {
    number: 7,
    planet: 'Ketu',
    title: 'The Spiritual Worker',
    traits: [
      'Often get taken advantage of, yet you continue helping colleagues and others',
      'Prefer working in unique, unconventional ways',
      'Naturally inclined toward spiritual, religious, or philosophical work',
    ],
  },
  8: {
    number: 8,
    planet: 'Saturn (Shani)',
    title: 'The Visionary',
    traits: [
      'Life often brings significant challenges — but you are built to overcome them',
      'You think big and dream of greater possibilities beyond the ordinary',
      'Once your vision is clear, you push yourself to absolute limits to make it real',
      'You do not just daydream — you take decisive, sustained action',
      'You have a natural skill in managing money and financial matters',
    ],
  },
  9: {
    number: 9,
    planet: 'Mars (Mangal)',
    title: 'The Humanitarian',
    traits: [
      'You have an inherent sense of sacrifice — others\' needs come naturally before your own',
      'Your belief in humanity drives you to support causes that help people',
      'You find deep fulfilment in social service and meaningful contribution',
      'Despite your generosity, you attract situations where others take advantage of your kindness',
      'You have a natural gift for writing — expressing thoughts through words flows easily',
      'Unfortunately, others may exploit your goodwill — discernment is key',
    ],
  },
  11: {
    number: 11,
    planet: 'Master Number',
    title: 'The Extremist',
    traits: [
      'You live in extremes — either at the very top or at the bottom, never in between',
      'Naturally caring and compassionate, always looking out for others',
      'Practicality is not your strongest trait — you rely on intuition over logic',
      'Your strong intuitive abilities allow you to make decisions that work in your favour, even when logic is unclear',
      'Success comes most powerfully when you collaborate — teamwork brings out your best',
    ],
  },
  22: {
    number: 22,
    planet: 'Master Number',
    title: 'The Master Builder',
    traits: [
      'You achieve success at every step — consistent progress is your natural rhythm',
      'You have a strong ability to transform dreams into reality through focused effort',
      'You prefer to build your own path — never relying on others for security or success',
      'Practical by nature — you do not follow traditions blindly; you seek what actually works',
      'Leadership qualities shine through — you guide others toward clear goals with confidence',
      'Mental pressure may arise early, but you possess the resilience to overcome any challenge',
    ],
  },
  33: {
    number: 33,
    planet: 'Master Number',
    title: 'The Master of Masters',
    traits: [
      'You possess the combined powerful qualities of Destiny Numbers 11 and 22',
      'You have an innate spirit of selfless service — you help without expecting anything in return',
      'Your focus is always on the greater good and making a lasting positive impact',
      'You are considered a master of masters — possessing profound wisdom and leadership ability',
      'You have the capacity to guide and inspire others, elevating those around you to their highest potential',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PLANES & YOGAS (active when all 3 numbers present in grid)
// ─────────────────────────────────────────────────────────────
export interface PlaneData {
  name: string;
  numbers: readonly number[];
  shortDesc: string;
  traits: string[];
}

export const PLANES: PlaneData[] = [
  {
    name: 'Intellectual Plane',
    numbers: [4, 9, 2],
    shortDesc: 'Genius-level intellect and sharp logic',
    traits: [
      'Far-sighted and highly intellectual',
      'Genius-level thinkers with remarkable depth',
      'Strong sense of superiority — they know their worth',
      'Logic-driven and practical in approach',
      'Exceptional memory — retain and recall with ease',
      'Honest, straightforward, and fair in all dealings',
    ],
  },
  {
    name: 'Emotional Plane',
    numbers: [3, 5, 7],
    shortDesc: 'Heart-led, calm, and spiritually inclined',
    traits: [
      'Heart-driven in actions and all major decisions',
      'Naturally calm and composed under pressure',
      'Kind-hearted with genuine, deep care for others',
      'Often inclined toward spirituality or profound faith',
    ],
  },
  {
    name: 'Practical Plane',
    numbers: [8, 1, 6],
    shortDesc: 'Highly practical, business-minded, results-focused',
    traits: [
      'Highly practical and logic-first in their thinking',
      'Strong business acumen — built for commerce',
      'Focused on financial growth and long-term security',
      'Driven by tangible results and measurable outcomes',
      'Logic is their primary tool in every situation',
    ],
  },
  {
    name: 'Thought Plane',
    numbers: [4, 3, 8],
    shortDesc: 'Creative visionaries who turn ideas into reality',
    traits: [
      'Creative thinkers with powerful, original ideas',
      'Excellent at planning and precise execution',
      'Natural visionaries — can see what others cannot',
      'Skilled at turning abstract concepts into real, tangible outcomes',
    ],
  },
  {
    name: 'Will Power Plane',
    numbers: [9, 5, 1],
    shortDesc: 'Unshakeable willpower and unstoppable determination',
    traits: [
      'Extraordinary willpower and iron-strong determination',
      'Stubborn in pursuit of goals — will not quit',
      'Diligent and persistent — effort is constant',
      'Enjoy debates and critical intellectual discussions',
      'Steadily and surely work toward goals, never giving up',
    ],
  },
  {
    name: 'Action Plane',
    numbers: [2, 7, 6],
    shortDesc: 'Athletic, energetic doers who turn plans into results',
    traits: [
      'Naturally athletic and high-energy — can excel in sports',
      'Excel at physical and hands-on tasks',
      'Turn plans into action quickly and efficiently',
      'Always driven to achieve something meaningful',
    ],
  },
  {
    name: 'Property Plane',
    numbers: [2, 5, 8],
    shortDesc: 'Strong willpower with a natural affinity for property & wealth',
    traits: [
      'Strong willpower — capable of accomplishing any task they set their mind to',
      'Like a duck — calm on the surface, but constantly moving and working beneath',
      'Strongly associated with property gains and smart investments',
      'Investing in real estate can bring significant and lasting financial returns',
    ],
  },
  {
    name: 'Mahayog',
    numbers: [4, 5, 6],
    shortDesc: 'A powerful combination capable of reaching great heights',
    traits: [
      'Creates a powerful Mahayog — a rare and fortunate formation',
      'Capable of achieving great heights in life',
      'Kind and deeply empathetic toward others',
      'Highly intuitive about people\'s emotions and unspoken needs',
      'Often shy in their early years but bloom into greatness',
      'Known for their decent, dignified, and gentlemanly nature',
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// CORE MATH FUNCTIONS
// ─────────────────────────────────────────────────────────────

/** Reduce to single digit, preserving master numbers 11, 22, 33 */
export function reduceNumber(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + parseInt(d), 0);
  }
  return n;
}

/** Sum all digits in a string of numbers */
export function digitSum(s: string | number): number {
  return String(s).replace(/\D/g, '').split('').reduce((a, d) => a + parseInt(d), 0);
}

/** Personality number = digit-sum of Date */
export function getPersonalityNumber(dob: string): number {
  return reduceNumber(parseInt(dob.split('/')[0]));
}

/** Destiny number = reduced digit-sum of full DOB */
export function getDestinyNumber(dob: string): number {
  return reduceNumber(digitSum(dob.replace(/\D/g, '')));
}

/** Build frequency map of digits 1–9 from DOB string */
export function buildLoshuFrequency(dob: string): Record<number, number> {
  const digits = dob.replace(/\D/g, '').split('').map(Number).filter(d => d >= 1 && d <= 9);
  const freq: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
  digits.forEach(d => { freq[d]++; });
  return freq;
}

/** Numbers absent from the DOB, accounting for personality and destiny numbers */
export function getMissingNumbers(freq: Record<number, number>, destinyNumber: number, personalityNumber: number): number[] {
  const enhancedFreq = { ...freq };
  enhancedFreq[personalityNumber] = (enhancedFreq[personalityNumber] ?? 0) + 1;
  enhancedFreq[destinyNumber] = (enhancedFreq[destinyNumber] ?? 0) + 1;

  return Object.entries(enhancedFreq)
    .filter(([, v]) => v === 0)
    .map(([k]) => parseInt(k));
}

/** Numbers appearing more than once, accounting for personality and destiny numbers */
export function getRepeatingNumbers(freq: Record<number, number>, destinyNumber: number, personalityNumber: number): Array<{ num: number; count: number }> {
  const enhancedFreq = { ...freq };
  enhancedFreq[personalityNumber] = (enhancedFreq[personalityNumber] ?? 0) + 1;
  enhancedFreq[destinyNumber] = (enhancedFreq[destinyNumber] ?? 0) + 1;

  return Object.entries(enhancedFreq)
    .filter(([, v]) => v > 1)
    .map(([k, v]) => ({ num: parseInt(k), count: v }));
}

/** Active planes — all 3 numbers must be present in DOB grid + personality & destiny numbers */
export function getActivePlanes(
  freq: Record<number, number>,
  personalityNumber: number,
  destinyNumber: number
): PlaneData[] {
  // Create enhanced frequency map including personality and destiny numbers
  const enhancedFreq = { ...freq };
  enhancedFreq[personalityNumber] = (enhancedFreq[personalityNumber] ?? 0) + 1;
  enhancedFreq[destinyNumber] = (enhancedFreq[destinyNumber] ?? 0) + 1;
  
  return PLANES.filter(p => p.numbers.every(n => (enhancedFreq[n] ?? 0) > 0));
}

// ─────────────────────────────────────────────────────────────
// RESULT TYPE
// ─────────────────────────────────────────────────────────────
export interface NumerologyResult {
  personalityNumber: number;
  destinyNumber: number;
  loshuFrequency: Record<number, number>;
  missingNumbers: number[];
  repeatingNumbers: Array<{ num: number; count: number }>;
  activePlanes: PlaneData[];
  personalityData: PersonalityData;
  destinyData: DestinyData;
}

// ─────────────────────────────────────────────────────────────
// MAIN CALCULATION  — call this everywhere
// ─────────────────────────────────────────────────────────────
export function calculateNumerology(fullName: string, dob: string): NumerologyResult {
  const personalityNumber = getPersonalityNumber(dob);
  const destinyNumber     = getDestinyNumber(dob);
  const loshuFrequency    = buildLoshuFrequency(dob);
  const missingNumbers    = getMissingNumbers(loshuFrequency, destinyNumber, personalityNumber);
  const repeatingNumbers  = getRepeatingNumbers(loshuFrequency, destinyNumber, personalityNumber);
  const activePlanes      = getActivePlanes(loshuFrequency, personalityNumber, destinyNumber);
  const personalityData   = PERSONALITY_DATA[personalityNumber] ?? PERSONALITY_DATA[9];
  const destinyData       = DESTINY_DATA[destinyNumber]         ?? DESTINY_DATA[9];

  return {
    personalityNumber,
    destinyNumber,
    loshuFrequency,
    missingNumbers,
    repeatingNumbers,
    activePlanes,
    personalityData,
    destinyData,
  };
}

// Legacy alias kept so existing imports don't break
export const PERSONALITY_DESCRIPTIONS: Record<number, string> = Object.fromEntries(
  Object.entries(PERSONALITY_DATA).map(([k, v]) => [k, `${v.title} — ${v.generalTraits[0]}`])
);
export const MISSING_NUMBER_MEANINGS: Record<number, string> = {
  1: 'Leadership & self-expression to develop',
  2: 'Sensitivity & partnership lessons',
  3: 'Communication & advisory skills to build',
  4: 'Strategic thinking & organisation gaps',
  5: 'Freedom, adaptability & balance lessons',
  6: 'Responsibility, beauty & nurturing to cultivate',
  7: 'Spiritual depth & research inclination to develop',
  8: 'Material confidence & resilience to strengthen',
  9: 'Compassion, service & completion lessons',
};
// Alias for old yoga references
export type { PlaneData as YogaData };
export { getActivePlanes as getActiveYogas };
