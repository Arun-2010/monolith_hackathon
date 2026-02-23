const TOKEN_NAMES = [
  'SafeMoon', 'ElonDoge', 'ShibaRocket', 'MetaVerse Inu', 'CryptoGem',
  'MoonShot', 'DiamondHands', 'YieldFarm Pro', 'DeFi Swap', 'ChainLink Ultra',
  'SolanaMax', 'AvalancheX', 'PolygonPro', 'ArbitrumGo', 'OptimismPlus',
  'UniSwapV4', 'PancakeMax', 'CurveDAO', 'AaveVault', 'CompoundMax',
  'BabyDoge', 'FlokiX', 'PepeCoin', 'WojackToken', 'RektCoin',
  'RugPull Finance', 'HoneypotDAO', 'PumpNDump', 'ScamSwap', 'FakeYield',
];

const RISK_REASONS = {
  high: [
    'Unverified smart contract source code',
    'Top 5 wallets hold 85%+ of supply',
    'Liquidity pool is under $10,000',
    'No social media presence found',
    'Contract has hidden mint function',
    'Deployer wallet linked to known rug pulls',
    'Honeypot pattern detected in transfer function',
    'No audit from recognized firms',
  ],
  medium: [
    'Limited trading history (<30 days)',
    'Moderate holder concentration (top 10 hold 40%)',
    'Social accounts created recently',
    'Low but present liquidity ($10k-$100k)',
    'Team is pseudonymous',
    'Whitepaper lacks technical depth',
  ],
  low: [
    'Verified contract on block explorer',
    'Active community with 10k+ members',
    'Audited by CertiK / Hacken',
    'Healthy liquidity distribution',
    'Team is publicly doxxed',
    'Listed on major exchanges',
  ],
};

export interface AnalysisResult {
  riskScore: number;
  category: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  confidence: number;
  reasons: string[];
  tokenName: string;
  symbol: string;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function analyzeToken(tokenName?: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      const name = tokenName || TOKEN_NAMES[Math.floor(Math.random() * TOKEN_NAMES.length)];
      const symbol = name.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase();
      
      const riskScore = Math.floor(Math.random() * 100);
      let category: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
      let reasons: string[];
      
      if (riskScore >= 70) {
        category = 'SCAM';
        reasons = pickRandom(RISK_REASONS.high, 3 + Math.floor(Math.random() * 2));
      } else if (riskScore >= 35) {
        category = 'SUSPICIOUS';
        reasons = [
          ...pickRandom(RISK_REASONS.medium, 2),
          ...pickRandom(RISK_REASONS.high, 1),
        ];
      } else {
        category = 'SAFE';
        reasons = pickRandom(RISK_REASONS.low, 3);
      }
      
      resolve({
        riskScore,
        category,
        confidence: 65 + Math.floor(Math.random() * 30),
        reasons,
        tokenName: name,
        symbol,
      });
    }, delay);
  });
}

export function generateRandomToken() {
  const name = TOKEN_NAMES[Math.floor(Math.random() * TOKEN_NAMES.length)];
  const symbol = name.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase();
  const hue = Math.floor(Math.random() * 360);
  return { name, symbol, hue, id: `${Date.now()}-${Math.random().toString(36).substring(7)}` };
}

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'NeonSlayer', level: 42, xp: 4200, captures: 312, accuracy: 94 },
  { rank: 2, name: 'CryptoPhantom', level: 38, xp: 3800, captures: 287, accuracy: 91 },
  { rank: 3, name: 'BlockHunterX', level: 35, xp: 3500, captures: 265, accuracy: 88 },
  { rank: 4, name: 'DeFiNinja', level: 31, xp: 3100, captures: 231, accuracy: 86 },
  { rank: 5, name: 'ChainWarden', level: 28, xp: 2800, captures: 198, accuracy: 84 },
  { rank: 6, name: 'RugDetector', level: 25, xp: 2500, captures: 175, accuracy: 82 },
  { rank: 7, name: 'ScamSheriff', level: 22, xp: 2200, captures: 152, accuracy: 80 },
  { rank: 8, name: 'TokenGuard', level: 19, xp: 1900, captures: 134, accuracy: 78 },
  { rank: 9, name: 'Web3Sentinel', level: 16, xp: 1600, captures: 112, accuracy: 75 },
  { rank: 10, name: 'CyberHawk', level: 13, xp: 1300, captures: 89, accuracy: 72 },
];
