// =========================================================================
// Blackjack Master Trainer PWA - Core Engine
// =========================================================================

// --- 1. Sound Engine (Muted / Purely Silent by User Preference) ---
class SoundEngine {
  constructor() {
    this.enabled = false;
  }
  init() {}
  playFlip() {}
  playCorrect() {}
  playWrong() {}
  playTap() {}
}

const audio = new SoundEngine();

function triggerHaptic(type = 'light') {
  if (!navigator.vibrate) return;
  if (type === 'light') navigator.vibrate(12);
  else if (type === 'success') navigator.vibrate([15, 40, 20]);
  else if (type === 'error') navigator.vibrate([40, 60, 40]);
}

// --- 2. Deck & Hi-Lo Engine ---
const SUITS = [
  { symbol: 'S', name: 'Spade', color: 'black', icon: '♠' },
  { symbol: 'H', name: 'Heart', color: 'red', icon: '♥' },
  { symbol: 'D', name: 'Diamond', color: 'red', icon: '♦' },
  { symbol: 'C', name: 'Club', color: 'black', icon: '♣' }
];

const RANKS = [
  { symbol: 'A',  val: 1 },
  { symbol: '2',  val: 2 },
  { symbol: '3',  val: 3 },
  { symbol: '4',  val: 4 },
  { symbol: '5',  val: 5 },
  { symbol: '6',  val: 6 },
  { symbol: '7',  val: 7 },
  { symbol: '8',  val: 8 },
  { symbol: '9',  val: 9 },
  { symbol: '10', val: 10 },
  { symbol: 'J',  val: 10 },
  { symbol: 'Q',  val: 10 },
  { symbol: 'K',  val: 10 }
];

function getHiLo(val) {
  if (val >= 2 && val <= 6) return 1;
  if (val >= 7 && val <= 9) return 0;
  return -1; // 10, J, Q, K, A
}

function createDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({
        symbol: r.symbol,
        val: r.val,
        suit: s.symbol,
        suitName: s.name,
        suitIcon: s.icon,
        color: s.color,
        hilo: getHiLo(r.val),
        label: `${r.symbol}${s.symbol}`
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// --- 3. Strategy Matrices (S17 & S17s) ---
const STRATEGY_S17S = {
  hard: {
    "17+": { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "S", "8": "S", "9": "S", "10": "S", "A": "S" },
    "16":  { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "H", "8": "H", "9": "SU", "10": "SU", "A": "SU" },
    "15":  { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "H", "8": "H", "9": "H", "10": "SU", "A": "H" },
    "14":  { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "13":  { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "12":  { "2": "H", "3": "H", "4": "S", "5": "S", "6": "S", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "11":  { "2": "D", "3": "D", "4": "D", "5": "D", "6": "D", "7": "D", "8": "D", "9": "D", "10": "D", "A": "D" },
    "10":  { "2": "D", "3": "D", "4": "D", "5": "D", "6": "D", "7": "D", "8": "D", "9": "D", "10": "H", "A": "H" },
    "9":   { "2": "H", "3": "D", "4": "D", "5": "D", "6": "D", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "8-":  { "2": "H", "3": "H", "4": "H", "5": "H", "6": "H", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" }
  },
  soft: {
    "A,9": { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "S", "8": "S", "9": "S", "10": "S", "A": "S" },
    "A,8": { "2": "S", "3": "S", "4": "S", "5": "S", "6": "D", "7": "S", "8": "S", "9": "S", "10": "S", "A": "S" },
    "A,7": { "2": "D", "3": "D", "4": "D", "5": "D", "6": "D", "7": "S", "8": "S", "9": "H", "10": "H", "A": "H" },
    "A,6": { "2": "H", "3": "H", "4": "H", "5": "D", "6": "D", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "A,5": { "2": "H", "3": "H", "4": "H", "5": "D", "6": "D", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "A,4": { "2": "H", "3": "H", "4": "H", "5": "D", "6": "D", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "A,3": { "2": "H", "3": "H", "4": "H", "5": "D", "6": "D", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "A,2": { "2": "H", "3": "H", "4": "H", "5": "D", "6": "D", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" }
  },
  pairs: {
    "A,A":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "P", "8": "P", "9": "P", "10": "P", "A": "P" },
    "10,10": { "2": "S", "3": "S", "4": "S", "5": "S", "6": "S", "7": "S", "8": "S", "9": "S", "10": "S", "A": "S" },
    "9,9":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "S", "8": "P", "9": "P", "10": "S", "A": "S" },
    "8,8":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "P", "8": "P", "9": "P", "10": "P", "A": "P" },
    "7,7":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "P", "8": "H", "9": "H", "10": "H", "A": "H" },
    "6,6":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "5,5":   { "2": "D", "3": "D", "4": "D", "5": "D", "6": "D", "7": "D", "8": "D", "9": "D", "10": "H", "A": "H" },
    "4,4":   { "2": "H", "3": "H", "4": "H", "5": "P", "6": "P", "7": "H", "8": "H", "9": "H", "10": "H", "A": "H" },
    "3,3":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "P", "8": "H", "9": "H", "10": "H", "A": "H" },
    "2,2":   { "2": "P", "3": "P", "4": "P", "5": "P", "6": "P", "7": "P", "8": "H", "9": "H", "10": "H", "A": "H" }
  }
};

const STRATEGY_S17 = JSON.parse(JSON.stringify(STRATEGY_S17S));
// S17 無投降版本：16 vs 9,10,A 與 15 vs 10 均為要牌 Hit
STRATEGY_S17.hard["16"]["9"] = "H";
STRATEGY_S17.hard["16"]["10"] = "H";
STRATEGY_S17.hard["16"]["A"] = "H";
STRATEGY_S17.hard["15"]["10"] = "H";

// 判斷基本策略動作
function getStandardAction(pCard1, pCard2, dealerUp, ruleMode = 's17s') {
  const table = (ruleMode === 's17s') ? STRATEGY_S17S : STRATEGY_S17;
  const dKey = dealerUp.symbol === 'A' ? 'A' : (dealerUp.val === 10 ? '10' : String(dealerUp.val));

  // 1. 對子判斷
  const isPair = (pCard1.symbol === pCard2.symbol) || (pCard1.val === 10 && pCard2.val === 10);
  if (isPair) {
    let pKey = '';
    if (pCard1.symbol === 'A') pKey = 'A,A';
    else if (pCard1.val === 10) pKey = '10,10';
    else pKey = `${pCard1.symbol},${pCard1.symbol}`;

    const act = table.pairs[pKey]?.[dKey];
    if (act) {
      return { action: act, category: 'pairs', key: pKey, isPair: true, isSoft: false, total: pCard1.val + pCard2.val };
    }
  }

  // 2. 軟牌判斷
  const hasAce = (pCard1.symbol === 'A' || pCard2.symbol === 'A');
  if (hasAce && !isPair) {
    const nonAce = pCard1.symbol === 'A' ? pCard2 : pCard1;
    const sKey = `A,${nonAce.val === 10 ? 9 : nonAce.val}`;
    const act = table.soft[sKey]?.[dKey];
    if (act) {
      return { action: act, category: 'soft', key: sKey, isPair: false, isSoft: true, total: 11 + nonAce.val };
    }
  }

  // 3. 硬牌判斷
  const total = pCard1.val + pCard2.val;
  let hKey = '8-';
  if (total >= 17) hKey = '17+';
  else if (total >= 9 && total <= 16) hKey = String(total);
  else hKey = '8-';

  const act = table.hard[hKey]?.[dKey] || 'H';
  return { action: act, category: 'hard', key: hKey, isPair: false, isSoft: false, total };
}

function getStrategyTip(evalRes, dealerUp) {
  if (evalRes.action === 'SU') {
    return '口訣：【16 見 9/10/A 投降、15 見 10 投降】，及時止損輸一半 (Surrender)！';
  }
  if (evalRes.category === 'pairs') {
    if (evalRes.key === 'A,A') return '口訣：【AA 永遠分牌】，拼兩把 21 點！';
    if (evalRes.key === '8,8') return '口訣：【88 永遠分牌】，拆掉最弱的 16 點！';
    if (evalRes.key === '10,10') return '口訣：【10,10 永遠停牌】，絕不拆散 20 點！';
    if (evalRes.key === '9,9') return '口訣：【99 見 7 / 10 / A 停牌】，其餘莊家弱牌 2~6, 8, 9 果斷分牌！';
    if (evalRes.key === '7,7') return '口訣：【77 見莊 2~7 分牌】，面對 8~A 強牌要牌！';
    if (evalRes.key === '6,6') return '口訣：【66 見莊 2~6 分牌】，面對 7~A 強牌要牌！';
    if (evalRes.key === '5,5') return '口訣：【55 視為硬10點】，面對莊 2~9 加倍，絕不分牌！';
    if (evalRes.key === '4,4') return '口訣：【44 僅見莊 5、6 分牌】，其餘莊家牌面一律要牌！';
    if (evalRes.key === '3,3' || evalRes.key === '2,2') return '口訣：【22、33 見莊 2~7 分牌】，面對 8~A 要牌！';
  }
  if (evalRes.category === 'soft') {
    if (evalRes.key === 'A,9' || evalRes.key === 'A,8') return '軟 19~20 點通常直接停牌 (僅 A,8 見莊 6 加倍)。';
    if (evalRes.key === 'A,7') return '口訣：軟 18 見莊 2~6 加倍，7/8 停牌，9/10/A 必須要牌！';
    if (['A,2','A,3','A,4','A,5','A,6'].includes(evalRes.key)) return '口訣：【A,2 ~ A,6 看到莊家 5、6 點才加倍】，其餘一律要牌 (Hit)！';
  }
  if (evalRes.category === 'hard') {
    if (evalRes.key === '17+') return '口訣：【硬 17 點以上一律停牌 (Stand)】，切勿冒爆牌風險！';
    if (evalRes.key === '16' && evalRes.action === 'H') return '口訣：硬 16 見 7/8 要牌，若無投降見 9/10/A 亦要牌；有投降則見 9/10/A 投降！';
    if (evalRes.key === '15' && evalRes.action === 'H') return '口訣：硬 15 見 7/8/9/A 要牌；有投降則見 10 投降！';
    if (evalRes.key === '11') return '口訣：【硬 11 點無腦加倍 (D)】，進攻最佳時機！';
    if (evalRes.key === '10') return '口訣：硬 10 點見莊 2~9 加倍，遇 10/A 要牌！';
    if (evalRes.key === '9') return '口訣：硬 9 點見莊 3~6 加倍，遇 2 或 7~A 要牌！';
    if (evalRes.key === '12') return '口訣：硬 12 見莊 4/5/6 停牌，遇 2/3 及 7~A 要牌！';
    if (['13','14','15','16'].includes(evalRes.key)) return '口訣：硬 13~16 見莊 2~6 弱牌停牌等莊爆，見 7~A 強牌進攻要牌或投降！';
    if (evalRes.key === '8-') return '口訣：【硬 5~8 點一律要牌 (Hit)】，持續補牌增加點數！';
  }
  return '戰術建議：面對莊家 2~6 弱牌盡可能加倍或防守停牌，面對 7~A 強牌積極補牌或棄牌止損。';
}

// =========================================================================
// Hi-Lo 真數 (True Count) 指數偏差決策引擎 (Illustrious 18 & Fab 4)
// =========================================================================
function getStrategyWithTC(type, key, dealerUp, ruleMode, trueCount) {
  const table = (ruleMode === 's17s') ? STRATEGY_S17S : STRATEGY_S17;
  const baseAction = table[type]?.[key]?.[dealerUp] || 'H';
  let finalAction = baseAction;
  let isDeviation = false;
  let devReason = '';

  const tc = parseInt(trueCount, 10) || 0;

  // 1. 硬牌指數偏差 (Hard Totals)
  if (type === 'hard') {
    if (key === '16') {
      if (dealerUp === '10') {
        if (ruleMode === 's17') {
          // S17: 基本 H，TC >= 0 停牌 (Stand)
          if (tc >= 0) {
            finalAction = 'S';
            if (baseAction !== 'S') {
              isDeviation = true;
              devReason = 'Illustrious 18: TC ≥ 0 停牌 (Stand)';
            }
          }
        } else {
          // S17s: 基本 SU (投降)。若某些情況下無法投降或純算牌偏差
          if (tc >= 0 && baseAction === 'H') {
            finalAction = 'S';
            isDeviation = true;
            devReason = 'Illustrious 18: TC ≥ 0 停牌 (Stand)';
          }
        }
      } else if (dealerUp === '9') {
        if (ruleMode === 's17') {
          // S17: 基本 H，TC >= +5 停牌 (Stand)
          if (tc >= 5) {
            finalAction = 'S';
            isDeviation = true;
            devReason = 'Illustrious 18: TC ≥ +5 停牌 (Stand)';
          }
        }
      } else if (dealerUp === 'A') {
        if (ruleMode === 's17' && tc >= 3) {
          finalAction = 'S';
          isDeviation = true;
          devReason = '高階偏差: TC ≥ +3 停牌 (Stand)';
        }
      }
    } else if (key === '15') {
      if (dealerUp === '10') {
        if (ruleMode === 's17') {
          // S17: 基本 H，TC >= +4 停牌 (Stand)
          if (tc >= 4) {
            finalAction = 'S';
            isDeviation = true;
            devReason = 'Illustrious 18: TC ≥ +4 停牌 (Stand)';
          }
        }
      } else if (dealerUp === '9') {
        if (ruleMode === 's17s') {
          // Fab 4: 15 vs 9 在 TC >= +2 時投降 (Surrender)
          if (tc >= 2) {
            finalAction = 'SU';
            if (baseAction !== 'SU') {
              isDeviation = true;
              devReason = 'Fab 4: TC ≥ +2 投降 (Surrender)';
            }
          }
        }
      }
    } else if (key === '14') {
      if (dealerUp === '10' && ruleMode === 's17s') {
        // Fab 4: 14 vs 10 在 TC >= +3 時投降 (Surrender)
        if (tc >= 3) {
          finalAction = 'SU';
          if (baseAction !== 'SU') {
            isDeviation = true;
            devReason = 'Fab 4: TC ≥ +3 投降 (Surrender)';
          }
        }
      }
    } else if (key === '13') {
      if (dealerUp === '2') {
        // 13 vs 2: 基本 S，TC < -1 時要牌 (Hit)
        if (tc < -1) {
          finalAction = 'H';
          isDeviation = true;
          devReason = 'Illustrious 18: TC < -1 要牌 (Hit)';
        }
      } else if (dealerUp === '3') {
        // 13 vs 3: 基本 S，TC < -2 時要牌 (Hit)
        if (tc < -2) {
          finalAction = 'H';
          isDeviation = true;
          devReason = 'Illustrious 18: TC < -2 要牌 (Hit)';
        }
      }
    } else if (key === '12') {
      if (dealerUp === '2') {
        // 12 vs 2: 基本 H，TC >= +3 時停牌 (Stand)
        if (tc >= 3) {
          finalAction = 'S';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +3 停牌 (Stand)';
        }
      } else if (dealerUp === '3') {
        // 12 vs 3: 基本 H，TC >= +2 時停牌 (Stand)
        if (tc >= 2) {
          finalAction = 'S';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +2 停牌 (Stand)';
        }
      } else if (dealerUp === '4') {
        // 12 vs 4: 基本 S，TC < 0 時要牌 (Hit)
        if (tc < 0) {
          finalAction = 'H';
          isDeviation = true;
          devReason = 'Illustrious 18: TC < 0 要牌 (Hit)';
        }
      } else if (dealerUp === '5') {
        // 12 vs 5: 基本 S，TC < -2 時要牌 (Hit)
        if (tc < -2) {
          finalAction = 'H';
          isDeviation = true;
          devReason = 'Illustrious 18: TC < -2 要牌 (Hit)';
        }
      } else if (dealerUp === '6') {
        // 12 vs 6: 基本 S，TC < -1 時要牌 (Hit)
        if (tc < -1) {
          finalAction = 'H';
          isDeviation = true;
          devReason = 'Illustrious 18: TC < -1 要牌 (Hit)';
        }
      }
    } else if (key === '11') {
      if (dealerUp === 'A' && baseAction === 'H') {
        // 11 vs A: TC >= +1 加倍 (Double)
        if (tc >= 1) {
          finalAction = 'D';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +1 加倍 (Double)';
        }
      }
    } else if (key === '10') {
      if (dealerUp === '10') {
        // 10 vs 10: 基本 H，TC >= +4 加倍 (Double)
        if (tc >= 4) {
          finalAction = 'D';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +4 加倍 (Double)';
        }
      } else if (dealerUp === 'A') {
        // 10 vs A: 基本 H，TC >= +4 加倍 (Double)
        if (tc >= 4) {
          finalAction = 'D';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +4 加倍 (Double)';
        }
      }
    } else if (key === '9') {
      if (dealerUp === '2') {
        // 9 vs 2: 基本 H，TC >= +1 加倍 (Double)
        if (tc >= 1) {
          finalAction = 'D';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +1 加倍 (Double)';
        }
      } else if (dealerUp === '7') {
        // 9 vs 7: 基本 H，TC >= +3 加倍 (Double)
        if (tc >= 3) {
          finalAction = 'D';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +3 加倍 (Double)';
        }
      }
    }
  } else if (type === 'pairs') {
    if (key === '10,10') {
      if (dealerUp === '5') {
        // 10,10 vs 5: 基本 S，TC >= +5 分牌 (Split)
        if (tc >= 5) {
          finalAction = 'P';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +5 分牌 (Split)';
        }
      } else if (dealerUp === '6') {
        // 10,10 vs 6: 基本 S，TC >= +4 分牌 (Split)
        if (tc >= 4) {
          finalAction = 'P';
          isDeviation = true;
          devReason = 'Illustrious 18: TC ≥ +4 分牌 (Split)';
        }
      }
    }
  }

  return {
    action: finalAction,
    baseAction: baseAction,
    isDeviation: isDeviation,
    devReason: devReason
  };
}

function getHandDeviationsGuide(type, key, ruleMode) {
  const guide = [];
  if (type === 'hard') {
    if (key === '16') {
      if (ruleMode === 's17') {
        guide.push('• 對莊 10：<strong>TC ≥ 0</strong> 時，由要牌改為<strong>停牌 (Stand)</strong>【Illustrious 18 第 2 名】');
        guide.push('• 對莊 9：<strong>TC ≥ +5</strong> 時，由要牌改為<strong>停牌 (Stand)</strong>');
      } else {
        guide.push('• 對莊 10：S17s 優先投降 (SU)；若賭場禁投降，<strong>TC ≥ 0</strong> 時改為<strong>停牌 (Stand)</strong>');
        guide.push('• 對莊 9：S17s 基本策略已優先投降 (SU)');
      }
    } else if (key === '15') {
      if (ruleMode === 's17') {
        guide.push('• 對莊 10：<strong>TC ≥ +4</strong> 時，由要牌改為<strong>停牌 (Stand)</strong>【Illustrious 18 第 3 名】');
      } else {
        guide.push('• 對莊 10：S17s 優先投降 (SU)；若禁投降，<strong>TC ≥ +4</strong> 時改為<strong>停牌 (Stand)</strong>');
        guide.push('• 對莊 9：<strong>TC ≥ +2</strong> 時，由要牌改為<strong>投降 (Surrender)</strong>【Fab 4 核心偏差】');
      }
    } else if (key === '14') {
      if (ruleMode === 's17s') {
        guide.push('• 對莊 10：<strong>TC ≥ +3</strong> 時，由要牌改為<strong>投降 (Surrender)</strong>【Fab 4 核心偏差】');
      }
    } else if (key === '13') {
      guide.push('• 對莊 2：<strong>TC < -1</strong> 時，由停牌改為<strong>要牌 (Hit)</strong>（負數大牌少，積極補牌）');
      guide.push('• 對莊 3：<strong>TC < -2</strong> 時，由停牌改為<strong>要牌 (Hit)</strong>');
    } else if (key === '12') {
      guide.push('• 對莊 3：<strong>TC ≥ +2</strong> 時，由要牌改為<strong>停牌 (Stand)</strong>【Illustrious 18 第 7 名】');
      guide.push('• 對莊 2：<strong>TC ≥ +3</strong> 時，由要牌改為<strong>停牌 (Stand)</strong>【Illustrious 18 第 8 名】');
      guide.push('• 對莊 4：<strong>TC < 0</strong> 時，由停牌改為<strong>要牌 (Hit)</strong>');
      guide.push('• 對莊 5：<strong>TC < -2</strong> 時，由停牌改為<strong>要牌 (Hit)</strong>');
      guide.push('• 對莊 6：<strong>TC < -1</strong> 時，由停牌改為<strong>要牌 (Hit)</strong>');
    } else if (key === '11') {
      guide.push('• 對莊 A：<strong>TC ≥ +1</strong> 時，堅決<strong>加倍下注 (Double)</strong>');
    } else if (key === '10') {
      guide.push('• 對莊 10：<strong>TC ≥ +4</strong> 時，由要牌改為<strong>加倍下注 (Double)</strong>【Illustrious 18 第 6 名】');
      guide.push('• 對莊 A：<strong>TC ≥ +4</strong> 時，由要牌改為<strong>加倍下注 (Double)</strong>');
    } else if (key === '9') {
      guide.push('• 對莊 2：<strong>TC ≥ +1</strong> 時，由要牌改為<strong>加倍下注 (Double)</strong>【Illustrious 18 第 10 名】');
      guide.push('• 對莊 7：<strong>TC ≥ +3</strong> 時，由要牌改為<strong>加倍下注 (Double)</strong>【Illustrious 18 第 12 名】');
    }
  } else if (type === 'pairs') {
    if (key === '10,10') {
      guide.push('• 對莊 6：<strong>TC ≥ +4</strong> 時，由停牌改為<strong>破天荒分牌 (Split)</strong>【Illustrious 18 第 5 名】');
      guide.push('• 對莊 5：<strong>TC ≥ +5</strong> 時，由停牌改為<strong>破天荒分牌 (Split)</strong>【Illustrious 18 第 4 名】');
    }
  }
  return guide;
}

// --- 4. Card HTML Rendering Engine ---
function createCardElement(card, style = 'realistic') {
  const cardEl = document.createElement('div');
  const isRed = (card.suit === 'H' || card.suit === 'D');
  const colorClass = isRed ? 'card-red' : 'card-black';

  if (style === 'stealth') {
    cardEl.className = `poker-card stealth-card ${colorClass}`;
    cardEl.innerHTML = `<span class="stealth-label">[ ${card.symbol}${card.suit} ]</span>`;
    return cardEl;
  }

  cardEl.className = `poker-card ${colorClass}`;
  cardEl.innerHTML = `
    <div class="card-corner top-left">
      <span class="card-rank">${card.symbol}</span>
      <span class="card-suit-pip">${card.suitIcon}</span>
    </div>
    <div class="card-center">
      <span class="card-center-icon">${card.suitIcon}</span>
    </div>
    <div class="card-corner bottom-right">
      <span class="card-rank">${card.symbol}</span>
      <span class="card-suit-pip">${card.suitIcon}</span>
    </div>
  `;
  return cardEl;
}

// --- 5. Application State & Controllers ---
const CAT_NAMES = {
  all: '全方位混題',
  hard: '硬牌專訓',
  soft: '軟牌專訓',
  pairs: '對子分牌',
  surrender: '投降專訓'
};

const LOOKUP_OPTIONS = {
  hard: [
    { key: '17+', label: '硬牌 17 ~ 20 點' },
    { key: '16',  label: '硬牌 16 點' },
    { key: '15',  label: '硬牌 15 點' },
    { key: '14',  label: '硬牌 14 點' },
    { key: '13',  label: '硬牌 13 點' },
    { key: '12',  label: '硬牌 12 點' },
    { key: '11',  label: '硬牌 11 點' },
    { key: '10',  label: '硬牌 10 點' },
    { key: '9',   label: '硬牌 9 點' },
    { key: '8-',  label: '硬牌 5 ~ 8 點' }
  ],
  soft: [
    { key: 'A,9', label: '軟 20 點 (A,9)' },
    { key: 'A,8', label: '軟 19 點 (A,8)' },
    { key: 'A,7', label: '軟 18 點 (A,7)' },
    { key: 'A,6', label: '軟 17 點 (A,6)' },
    { key: 'A,5', label: '軟 16 點 (A,5)' },
    { key: 'A,4', label: '軟 15 點 (A,4)' },
    { key: 'A,3', label: '軟 14 點 (A,3)' },
    { key: 'A,2', label: '軟 13 點 (A,2)' }
  ],
  pairs: [
    { key: 'A,A',   label: 'A,A (對 A)' },
    { key: '10,10', label: '10,10 (對 10 / J / Q / K)' },
    { key: '9,9',   label: '9,9 (對 9)' },
    { key: '8,8',   label: '8,8 (對 8)' },
    { key: '7,7',   label: '7,7 (對 7)' },
    { key: '6,6',   label: '6,6 (對 6)' },
    { key: '5,5',   label: '5,5 (對 5)' },
    { key: '4,4',   label: '4,4 (對 4)' },
    { key: '3,3',   label: '3,3 (對 3)' },
    { key: '2,2',   label: '2,2 (對 2)' }
  ]
};

const App = {
  activeTab: 'home-view',
  cardStyle: localStorage.getItem('bj_card_style') || 'realistic', // 'realistic' | 'stealth'

  // Strategy Lookup State
  lookup: {
    type: 'hard', // 'hard' | 'soft' | 'pairs'
    key: '16',
    trueCount: 0
  },

  // Mode 1 State (Speed 52-cards)
  m1: {
    deck: [],
    hiddenCard: null,
    currentIndex: 0,
    startTime: 0,
    timerId: null,
    runningCount: 0,
    userRC: 0,
    isFinished: false
  },

  // Mode 2 State (Auto Rhythm)
  m2: {
    deck: [],
    runningCount: 0,
    userRC: 0,
    currentIndex: 0,
    targetCount: 20,
    speed: 1200,
    timerId: null,
    isPlaying: false
  },

  // Mode 3 State (Cancellation Pair)
  m3: {
    deck: [],
    currentPair: null,
    qIndex: 1,
    totalQ: 10,
    correctCount: 0,
    startTime: 0
  },

  // Mode 4 State (True Count)
  m4: {
    rc: 0,
    decks: 2,
    expectedTC: 0,
    userTC: 0,
    qCount: 0,
    correctCount: 0
  },

  // Mode 5 State (Basic Strategy Flashcards)
  m5: {
    ruleMode: localStorage.getItem('bj_rule_mode') || 's17s', // 's17s' | 's17'
    category: 'all', // 'all' | 'hard' | 'soft' | 'pairs' | 'surrender'
    dealerCard: null,
    pCard1: null,
    pCard2: null,
    evalRes: null,
    streak: 0,
    maxStreak: parseInt(localStorage.getItem('bj_max_streak') || '0', 10),
    totalQ: 0,
    correctCount: 0,
    mistakes: JSON.parse(localStorage.getItem('bj_mistakes') || '[]'),
    waitingNext: false,
    canAdvance: false
  },

  init() {
    this.bindNavigation();
    this.bindHomeCards();
    this.bindSteppers();
    this.initMode5();
    this.initStrategyLookup();
    this.initSettingsView();
    this.updateStatsDisplay();
    this.updateHomeDisplay();
    this.switchTab('home-view');

    // Register Service Worker for offline PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  },

  bindNavigation() {
    // Top-left Blackjack Pro click -> Return to Home
    const headerHomeBtn = document.getElementById('btn-header-home');
    if (headerHomeBtn) {
      headerHomeBtn.addEventListener('click', () => {
        triggerHaptic('light');
        this.switchTab('home-view');
      });
    }
  },

  bindHomeCards() {
    // 1. 基本策略訓練手風琴 Toggle
    const btnToggleM5 = document.getElementById('btn-toggle-mode5');
    const m5Sublist = document.getElementById('home-m5-sublist');
    const m5Arrow = document.getElementById('mode5-accordion-arrow');

    if (btnToggleM5 && m5Sublist) {
      btnToggleM5.addEventListener('click', () => {
        triggerHaptic('light');
        const isHidden = m5Sublist.classList.toggle('hidden');
        if (m5Arrow) m5Arrow.textContent = isHidden ? '▾' : '▴';
      });
    }

    // 基本策略子項目點擊直達
    const subRows = document.querySelectorAll('#home-m5-sublist .sub-item-row');
    subRows.forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHaptic('light');
        this.m5.category = row.dataset.cat || 'all';
        this.switchTab('mode5');
      });
    });

    // 2. Hi-Lo 算牌訓練手風琴 Toggle
    const btnToggleHilo = document.getElementById('btn-toggle-hilo');
    const hiloSublist = document.getElementById('home-hilo-sublist');
    const hiloArrow = document.getElementById('hilo-accordion-arrow');

    if (btnToggleHilo && hiloSublist) {
      btnToggleHilo.addEventListener('click', () => {
        triggerHaptic('light');
        const isHidden = hiloSublist.classList.toggle('hidden');
        if (hiloArrow) hiloArrow.textContent = isHidden ? '▾' : '▴';
      });
    }

    // Hi-Lo 算牌訓練子項目點擊直達
    const hiloRows = document.querySelectorAll('#home-hilo-sublist .sub-item-row');
    hiloRows.forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHaptic('light');
        const target = row.dataset.target;
        if (target) this.switchTab(target);
      });
    });

    // 3. 基本策略查詢 (獨立頁面入口)
    const cardLookup = document.getElementById('card-lookup-entry');
    if (cardLookup) {
      cardLookup.addEventListener('click', () => {
        triggerHaptic('light');
        this.switchTab('lookup-view');
      });
    }

    // 獨立查詢頁面中的規則切換按鈕
    const lookupRuleBtn = document.getElementById('btn-lookup-rule-toggle');
    if (lookupRuleBtn) {
      lookupRuleBtn.addEventListener('click', () => {
        triggerHaptic('light');
        this.m5.ruleMode = (this.m5.ruleMode === 's17s') ? 's17' : 's17s';
        localStorage.setItem('bj_rule_mode', this.m5.ruleMode);
        this.updateHomeDisplay();
        this.updateLookupView();
      });
    }

    // 策略速查：手牌類型按鈕 (硬牌 / 軟牌 / 對子)
    const typePills = document.querySelectorAll('#lookup-type-pills .lookup-type-btn');
    typePills.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHaptic('light');
        typePills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.lookup.type = btn.dataset.type || 'hard';
        this.populateLookupSelect();
        this.runStrategyLookup();
      });
    });

    // 策略速查：牌面總合下拉改變
    const valueSelect = document.getElementById('lookup-value-select');
    if (valueSelect) {
      valueSelect.addEventListener('change', () => {
        triggerHaptic('light');
        this.lookup.key = valueSelect.value;
        this.runStrategyLookup();
      });
    }

    // 策略速查：真數調整 (Stepper - / +，範圍限制 -2 ~ 5)
    const tcMinus = document.getElementById('lookup-tc-minus');
    const tcPlus = document.getElementById('lookup-tc-plus');
    if (tcMinus) {
      tcMinus.addEventListener('click', () => {
        triggerHaptic('light');
        if (this.lookup.trueCount > -2) {
          this.lookup.trueCount--;
          this.updateLookupTCUI();
          this.runStrategyLookup();
        }
      });
    }
    if (tcPlus) {
      tcPlus.addEventListener('click', () => {
        triggerHaptic('light');
        if (this.lookup.trueCount < 5) {
          this.lookup.trueCount++;
          this.updateLookupTCUI();
          this.runStrategyLookup();
        }
      });
    }


    // 4. 弱點手牌回顧 (獨立頁面入口)
    const cardWeakspots = document.getElementById('card-weakspots-entry');
    if (cardWeakspots) {
      cardWeakspots.addEventListener('click', () => {
        triggerHaptic('light');
        this.switchTab('weakspots-view');
      });
    }

    // 5. 其他設定 (獨立頁面入口)
    const cardSettings = document.getElementById('card-settings-entry');
    if (cardSettings) {
      cardSettings.addEventListener('click', () => {
        triggerHaptic('light');
        this.switchTab('settings-view');
      });
    }

    // 清空弱點紀錄
    const clearWeakBtn = document.getElementById('btn-clear-weakspots');
    if (clearWeakBtn) {
      clearWeakBtn.addEventListener('click', () => {
        triggerHaptic('light');
        this.m5.mistakes = [];
        localStorage.removeItem('bj_mistakes');
        this.renderWeakSpotsList();
        this.updateHomeDisplay();
        this.updateStatsDisplay();
      });
    }

    // 頂部導航列風格切換按鈕
    const headerStyleBtn = document.getElementById('btn-header-style-toggle');
    if (headerStyleBtn) {
      headerStyleBtn.addEventListener('click', () => {
        triggerHaptic('light');
        this.cardStyle = (this.cardStyle === 'realistic') ? 'stealth' : 'realistic';
        localStorage.setItem('bj_card_style', this.cardStyle);
        this.updateHomeDisplay();
        this.updateSettingsDisplay();
        if (this.activeTab === 'mode5') this.renderMode5Cards();
        else if (this.activeTab === 'mode3') this.renderMode3Pair();
      });
    }
  },

  bindSteppers() {
    // Mode 1 Stepper
    const m1Minus = document.getElementById('m1-btn-minus');
    const m1Plus = document.getElementById('m1-btn-plus');
    const m1Submit = document.getElementById('m1-btn-submit');
    if (m1Minus) {
      m1Minus.addEventListener('click', () => {
        triggerHaptic('light');
        this.m1.userRC--;
        this.updateM1Stepper();
      });
    }
    if (m1Plus) {
      m1Plus.addEventListener('click', () => {
        triggerHaptic('light');
        this.m1.userRC++;
        this.updateM1Stepper();
      });
    }
    if (m1Submit) {
      m1Submit.addEventListener('click', () => {
        triggerHaptic('light');
        this.evaluateMode1Result(this.m1.userRC);
      });
    }

    // Mode 2 Stepper
    const m2Minus = document.getElementById('m2-btn-minus');
    const m2Plus = document.getElementById('m2-btn-plus');
    const m2Submit = document.getElementById('m2-btn-submit');
    if (m2Minus) {
      m2Minus.addEventListener('click', () => {
        triggerHaptic('light');
        this.m2.userRC--;
        this.updateM2Stepper();
      });
    }
    if (m2Plus) {
      m2Plus.addEventListener('click', () => {
        triggerHaptic('light');
        this.m2.userRC++;
        this.updateM2Stepper();
      });
    }
    if (m2Submit) {
      m2Submit.addEventListener('click', () => {
        triggerHaptic('light');
        this.evaluateMode2Result(this.m2.userRC);
      });
    }

    // Mode 4 Stepper
    const m4Minus = document.getElementById('m4-btn-minus');
    const m4Plus = document.getElementById('m4-btn-plus');
    const m4Submit = document.getElementById('m4-btn-submit');
    if (m4Minus) {
      m4Minus.addEventListener('click', () => {
        triggerHaptic('light');
        this.m4.userTC--;
        this.updateM4Stepper();
      });
    }
    if (m4Plus) {
      m4Plus.addEventListener('click', () => {
        triggerHaptic('light');
        this.m4.userTC++;
        this.updateM4Stepper();
      });
    }
    if (m4Submit) {
      m4Submit.addEventListener('click', () => {
        triggerHaptic('light');
        this.evaluateMode4Answer(this.m4.userTC);
      });
    }
  },

  updateM1Stepper() {
    const el = document.getElementById('m1-stepper-val');
    if (el) el.textContent = (this.m1.userRC > 0 ? `+${this.m1.userRC}` : `${this.m1.userRC}`);
  },

  updateM2Stepper() {
    const el = document.getElementById('m2-stepper-val');
    if (el) el.textContent = (this.m2.userRC > 0 ? `+${this.m2.userRC}` : `${this.m2.userRC}`);
  },

  updateM4Stepper() {
    const el = document.getElementById('m4-stepper-val');
    if (el) el.textContent = (this.m4.userTC > 0 ? `+${this.m4.userTC}` : `${this.m4.userTC}`);
  },

  switchTab(targetId) {
    this.activeTab = targetId;

    // Show only active mode view
    document.querySelectorAll('.mode-view').forEach(v => {
      v.classList.toggle('active', v.id === targetId);
    });

    const backArrow = document.getElementById('header-back-arrow');
    const headerSubtitle = document.getElementById('header-subtitle');

    if (targetId === 'home-view') {
      if (backArrow) backArrow.classList.add('hidden');
      if (headerSubtitle) headerSubtitle.textContent = 'Home Menu';
      this.updateHomeDisplay();
    } else {
      if (backArrow) backArrow.classList.remove('hidden');
      if (headerSubtitle) headerSubtitle.textContent = '‹ 點擊回首頁';

      if (targetId === 'mode1') this.resetMode1();
      else if (targetId === 'mode2') this.resetMode2();
      else if (targetId === 'mode3') this.resetMode3();
      else if (targetId === 'mode4') this.nextMode4Question();
      else if (targetId === 'mode5') {
        this.updateMode5Badge();
        this.nextMode5Question();
      } else if (targetId === 'lookup-view') {
        this.updateLookupView();
      } else if (targetId === 'weakspots-view') {
        this.renderWeakSpotsList();
      } else if (targetId === 'settings-view') {
        this.updateSettingsDisplay();
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateHomeDisplay() {
    const headerStyleBtn = document.getElementById('btn-header-style-toggle');
    if (headerStyleBtn) {
      headerStyleBtn.textContent = (this.cardStyle === 'realistic') ? '牌面風格' : '純英文';
    }

    const countEl = document.getElementById('weakspots-count');
    if (countEl) {
      countEl.textContent = this.m5.mistakes.length;
    }

    const homeSettingsDesc = document.getElementById('home-settings-desc');
    if (homeSettingsDesc) {
      const ruleText = (this.m5.ruleMode === 's17s') ? 'S17s (含投降)' : 'S17 (無投降)';
      const styleText = (this.cardStyle === 'realistic') ? '實體紙牌' : '低調純英文';
      homeSettingsDesc.textContent = `${ruleText} · ${styleText}`;
    }

    // 同步更新策略查詢頁面的規則顯示與結果
    this.updateLookupView();
  },

  // =========================================================================
  // 其他設定頁面 (Settings Engine)
  // =========================================================================
  initSettingsView() {
    // 規則切換按鈕 (S17s / S17)
    const ruleBtns = document.querySelectorAll('.settings-options-grid [data-rule]');
    ruleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHaptic('light');
        this.m5.ruleMode = btn.dataset.rule;
        localStorage.setItem('bj_rule_mode', this.m5.ruleMode);
        this.updateHomeDisplay();
        this.updateLookupView();
        this.updateSettingsDisplay();
      });
    });

    // 風格切換按鈕 (Realistic / Stealth)
    const styleBtns = document.querySelectorAll('.settings-options-grid [data-style]');
    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHaptic('light');
        this.cardStyle = btn.dataset.style;
        localStorage.setItem('bj_card_style', this.cardStyle);
        this.updateHomeDisplay();
        this.updateSettingsDisplay();
        if (this.activeTab === 'mode5') this.renderMode5Cards();
        else if (this.activeTab === 'mode3') this.renderMode3Pair();
      });
    });

    // 重設最高連對紀錄
    const resetStreaksBtn = document.getElementById('btn-reset-streaks');
    if (resetStreaksBtn) {
      resetStreaksBtn.addEventListener('click', () => {
        triggerHaptic('light');
        this.m5.streak = 0;
        this.m5.maxStreak = 0;
        localStorage.removeItem('bj_max_streak');
        this.updateStatsDisplay();
        alert('最高連對紀錄已重設為 0！');
      });
    }

    this.updateSettingsDisplay();
  },

  updateSettingsDisplay() {
    // 1. 更新規則按鈕 active 樣式
    document.querySelectorAll('[data-rule]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.rule === this.m5.ruleMode);
    });

    // 2. 更新風格按鈕 active 樣式
    document.querySelectorAll('[data-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.style === this.cardStyle);
    });

    // 3. 更新即時預覽牌面
    const previewSlot = document.getElementById('settings-preview-slot');
    if (previewSlot) {
      previewSlot.innerHTML = '';
      const sampleCard1 = { symbol: '10', val: 10, suit: 'S', suitName: 'Spade', suitIcon: '♠', color: 'black' };
      const sampleCard2 = { symbol: 'A', val: 1, suit: 'H', suitName: 'Heart', suitIcon: '♥', color: 'red' };
      previewSlot.appendChild(createCardElement(sampleCard1, this.cardStyle));
      previewSlot.appendChild(createCardElement(sampleCard2, this.cardStyle));
    }
  },

  updateLookupView() {
    const lookupBadge = document.getElementById('lookup-rule-badge');
    if (lookupBadge) {
      lookupBadge.textContent = (this.m5.ruleMode === 's17s') ? 'S17s 規則 (含投降)' : 'S17 規則 (無投降)';
    }

    const pageBadge = document.getElementById('lookup-page-badge');
    if (pageBadge) {
      pageBadge.textContent = (this.m5.ruleMode === 's17s') ? '● 基本策略查詢 · S17s' : '● 基本策略查詢 · S17';
    }

    const ruleBtn = document.getElementById('btn-lookup-rule-toggle');
    if (ruleBtn) {
      ruleBtn.textContent = (this.m5.ruleMode === 's17s') ? 'S17s (含投降)' : 'S17 (無投降)';
    }

    this.updateLookupTCUI();
    this.runStrategyLookup();
  },

  // =========================================================================
  // 基本策略速查功能 (Strategy Lookup Engine with True Count Deviations)
  // =========================================================================
  initStrategyLookup() {
    this.populateLookupSelect();
    this.updateLookupTCUI();
    this.runStrategyLookup();
  },

  updateLookupTCUI() {
    const tcValEl = document.getElementById('lookup-tc-val');
    const tcBadge = document.getElementById('lookup-result-tc-badge');
    const tcMinus = document.getElementById('lookup-tc-minus');
    const tcPlus = document.getElementById('lookup-tc-plus');

    const tc = this.lookup.trueCount;
    const tcStr = (tc > 0 ? `+${tc}` : `${tc}`);

    if (tcValEl) {
      tcValEl.textContent = tcStr;
      if (tc > 0) tcValEl.style.color = 'var(--gold-primary)';
      else if (tc < 0) tcValEl.style.color = '#721913';
      else tcValEl.style.color = 'var(--text-main)';
    }

    if (tcBadge) {
      tcBadge.textContent = `TC: ${tcStr}`;
    }

    if (tcMinus) tcMinus.disabled = (tc <= -2);
    if (tcPlus) tcPlus.disabled = (tc >= 5);
  },

  populateLookupSelect() {
    const valueSelect = document.getElementById('lookup-value-select');
    if (!valueSelect) return;
    const options = LOOKUP_OPTIONS[this.lookup.type] || LOOKUP_OPTIONS.hard;
    valueSelect.innerHTML = options.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join('');

    // 若原先 key 存在於新選項中則保留，否則預設第一個
    const match = options.find(o => o.key === this.lookup.key);
    if (match) {
      valueSelect.value = this.lookup.key;
    } else {
      this.lookup.key = options[0].key;
      valueSelect.value = this.lookup.key;
    }
  },

  runStrategyLookup() {
    const table = (this.m5.ruleMode === 's17s') ? STRATEGY_S17S : STRATEGY_S17;
    const type = this.lookup.type;
    const key = this.lookup.key;
    const tc = this.lookup.trueCount;

    const options = LOOKUP_OPTIONS[type] || LOOKUP_OPTIONS.hard;
    const optObj = options.find(o => o.key === key) || options[0];

    const handTitleEl = document.getElementById('lookup-result-hand-title');
    if (handTitleEl) handTitleEl.textContent = optObj.label;

    const ruleBadge = document.getElementById('lookup-rule-badge');
    if (ruleBadge) {
      ruleBadge.textContent = (this.m5.ruleMode === 's17s') ? 'S17s 規則 (含投降)' : 'S17 規則 (無投降)';
    }

    const tcBadge = document.getElementById('lookup-result-tc-badge');
    if (tcBadge) {
      const tcStr = (tc > 0 ? `+${tc}` : `${tc}`);
      tcBadge.textContent = `TC: ${tcStr}`;
    }

    const weakGrid = document.getElementById('lookup-grid-weak');
    const strongGrid = document.getElementById('lookup-grid-strong');
    const tipBox = document.getElementById('lookup-tip-box');

    const actionTextMap = {
      'H': '要牌 (H)',
      'S': '停牌 (S)',
      'D': '加倍 (D)',
      'P': '分牌 (P)',
      'SU': '投降 (SU)'
    };

    let hasAnyDeviation = false;
    const activeDeviations = [];

    const renderCell = (dVal) => {
      const res = getStrategyWithTC(type, key, dVal, this.m5.ruleMode, tc);
      if (res.isDeviation) {
        hasAnyDeviation = true;
        activeDeviations.push(`• 莊家 <strong>[ ${dVal} ]</strong>：${res.devReason}（標準基本策略原為 ${actionTextMap[res.baseAction] || res.baseAction}）`);
      }

      const actClass = `act-${res.action}`;
      const devClass = res.isDeviation ? 'is-deviation' : '';
      const devBadgeHtml = res.isDeviation ? `<span class="deviation-badge">⚡原${res.baseAction}</span>` : '';

      return `
        <div class="dealer-cell ${devClass}">
          <span class="dealer-cell-up">${dVal}</span>
          <span class="dealer-cell-act ${actClass}">${actionTextMap[res.action] || res.action}</span>
          ${devBadgeHtml}
        </div>
      `;
    };

    if (weakGrid) {
      const weakDealers = ['2', '3', '4', '5', '6'];
      weakGrid.innerHTML = weakDealers.map(renderCell).join('');
    }

    if (strongGrid) {
      const strongDealers = ['7', '8', '9', '10', 'A'];
      strongGrid.innerHTML = strongDealers.map(renderCell).join('');
    }

    if (tcBadge) {
      tcBadge.classList.toggle('has-deviation', hasAnyDeviation);
    }

    if (tipBox) {
      const sampleDealer = { symbol: '10', val: 10 };
      const evalRes = { action: table[type]?.[key]?.['10'] || 'H', category: type, key: key };
      const baseTip = getStrategyTip(evalRes, sampleDealer) || '戰術建議：面對莊家 2~6 弱牌盡可能加倍或防守停牌，面對 7~A 強牌積極補牌或棄牌止損。';
      
      const tcStr = (tc > 0 ? `+${tc}` : `${tc}`);
      const devGuide = getHandDeviationsGuide(type, key, this.m5.ruleMode);

      let tipHtml = '';

      // 1. 若當前 TC 觸發偏差，置頂醒目警示
      if (hasAnyDeviation) {
        tipHtml += `
          <div class="tc-deviation-alert">
            ⚡ <strong>當前 TC = ${tcStr} 已觸發算牌打牌偏差 (Index Deviation)：</strong><br>
            ${activeDeviations.join('<br>')}
          </div>
        `;
      }

      // 2. 若 TC >= +3，展示保險特權提醒
      if (tc >= 3) {
        tipHtml += `
          <div class="tc-insurance-alert">
            🛡️ <strong>Illustrious 18 第 1 名保險偏差：</strong>當前 TC = ${tcStr} (≥ +3)，若莊家明牌為 A，<strong>購買保險 (Insurance) 具備 +2.3% 正期望值</strong>！
          </div>
        `;
      }

      // 3. 基本策略戰術解說
      tipHtml += `<div><strong>【基本戰術】</strong>${baseTip}</div>`;

      // 4. 此手牌的真數偏差速查表
      if (devGuide.length > 0) {
        tipHtml += `
          <div style="margin-top: 4px; padding-top: 6px; border-top: 1px dashed rgba(180, 130, 90, 0.25);">
            <div style="font-size: 0.76rem; font-weight: 800; color: var(--accent-latte); margin-bottom: 3px;">
              ★ 此手牌真數偏差閾值 (Illustrious 18 / Fab 4)：
            </div>
            ${devGuide.map(g => `<div style="font-size: 0.74rem; line-height: 1.4;">${g}</div>`).join('')}
          </div>
        `;
      } else {
        tipHtml += `
          <div style="margin-top: 4px; font-size: 0.74rem; color: var(--text-dim);">
            ★ 此手牌在所有真數下均嚴格遵循標準基本策略，無需因真數變動出牌。
          </div>
        `;
      }

      tipBox.innerHTML = tipHtml;
    }
  },

  updateMode5Badge() {
    const badge = document.getElementById('m5-cat-title');
    if (badge) {
      const ruleStr = (this.m5.ruleMode === 's17s') ? 'S17s' : 'S17';
      const catStr = CAT_NAMES[this.m5.category] || '全方位混題';
      badge.textContent = `● ${ruleStr} 基本策略 · ${catStr}`;
    }
  },

  updateStatsDisplay() {
    const maxEl = document.getElementById('m5-max-streak');
    if (maxEl) maxEl.textContent = this.m5.maxStreak;
    const countEl = document.getElementById('weakspots-count');
    if (countEl) countEl.textContent = this.m5.mistakes.length;
  },

  // =========================================================================
  // MODE 5: S17/S17s 基本策略盲測訓練
  // =========================================================================
  initMode5() {
    // 綁定五大動作按鈕 (Hit, Stand, Double, Split, Surrender)
    const actBtns = document.querySelectorAll('.action-btn');
    actBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.m5.waitingNext) {
          // 若已有結果顯示，點擊按鈕亦作為點擊螢幕繼續下一題
          return;
        }
        e.stopPropagation();
        const action = btn.dataset.action;
        this.handleMode5Answer(action);
      });
    });

    // 點擊螢幕任一處進入下一題測試
    const mode5View = document.getElementById('mode5');
    if (mode5View) {
      mode5View.addEventListener('click', (e) => {
        if (e.target.closest('#btn-header-home')) {
          return;
        }
        if (this.m5.waitingNext && this.m5.canAdvance) {
          this.m5.waitingNext = false;
          this.m5.canAdvance = false;
          this.nextMode5Question();
        }
      });
    }
  },

  nextMode5Question() {
    this.m5.waitingNext = false;
    this.m5.canAdvance = false;
    const feedbackEl = document.getElementById('m5-feedback');
    if (feedbackEl) {
      feedbackEl.className = 'feedback-box hidden';
      feedbackEl.innerHTML = '';
    }
    const tableFelt = document.getElementById('m5-table-felt');
    if (tableFelt) {
      tableFelt.classList.remove('is-correct', 'is-wrong');
    }

    // 產生手牌情境
    const scenario = this.generateMode5Scenario(this.m5.category);
    this.m5.dealerCard = scenario.dealerCard;
    this.m5.pCard1 = scenario.pCard1;
    this.m5.pCard2 = scenario.pCard2;
    this.m5.evalRes = getStandardAction(this.m5.pCard1, this.m5.pCard2, this.m5.dealerCard, this.m5.ruleMode);

    this.renderMode5Cards();
  },

  generateMode5Scenario(cat = 'all') {
    const deck = createDeck();
    let dealerCard = deck.pop();
    let pCard1, pCard2;

    if (cat === 'pairs') {
      const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
      pCard1 = { symbol: rank.symbol, val: rank.val, suit: 'S', suitName: 'Spade', suitIcon: '♠', color: 'black', hilo: getHiLo(rank.val), label: `${rank.symbol}S` };
      pCard2 = { symbol: rank.symbol, val: rank.val, suit: 'H', suitName: 'Heart', suitIcon: '♥', color: 'red', hilo: getHiLo(rank.val), label: `${rank.symbol}H` };
    } else if (cat === 'soft') {
      pCard1 = { symbol: 'A', val: 1, suit: 'S', suitName: 'Spade', suitIcon: '♠', color: 'black', hilo: -1, label: 'AS' };
      const nonAce = RANKS.filter(r => r.symbol !== 'A')[Math.floor(Math.random() * 9)];
      pCard2 = { symbol: nonAce.symbol, val: nonAce.val, suit: 'D', suitName: 'Diamond', suitIcon: '♦', color: 'red', hilo: getHiLo(nonAce.val), label: `${nonAce.symbol}D` };
    } else if (cat === 'surrender') {
      const is16 = Math.random() < 0.5;
      if (is16) {
        pCard1 = { symbol: '10', val: 10, suit: 'S', suitName: 'Spade', suitIcon: '♠', color: 'black', hilo: -1, label: '10S' };
        pCard2 = { symbol: '6', val: 6, suit: 'H', suitName: 'Heart', suitIcon: '♥', color: 'red', hilo: 1, label: '6H' };
      } else {
        pCard1 = { symbol: '10', val: 10, suit: 'S', suitName: 'Spade', suitIcon: '♠', color: 'black', hilo: -1, label: '10S' };
        pCard2 = { symbol: '5', val: 5, suit: 'H', suitName: 'Heart', suitIcon: '♥', color: 'red', hilo: 1, label: '5H' };
      }
      if (Math.random() < 0.7) {
        const up = ['9', '10', 'J', 'Q', 'K', 'A'][Math.floor(Math.random() * 6)];
        const val = up === 'A' ? 1 : 10;
        dealerCard = { symbol: up, val, suit: 'D', suitName: 'Diamond', suitIcon: '♦', color: 'red', hilo: getHiLo(val), label: `${up}D` };
      }
    } else if (cat === 'hard') {
      while (true) {
        const c1 = deck.pop();
        const c2 = deck.pop();
        if (c1.symbol !== 'A' && c2.symbol !== 'A' && c1.symbol !== c2.symbol) {
          pCard1 = c1;
          pCard2 = c2;
          break;
        }
      }
    } else {
      const r = Math.random();
      if (r < 0.30) return this.generateMode5Scenario('pairs');
      if (r < 0.65) return this.generateMode5Scenario('soft');
      return this.generateMode5Scenario('hard');
    }

    return { dealerCard, pCard1, pCard2 };
  },

  renderMode5Cards() {
    const dealerContainer = document.getElementById('m5-dealer-slot');
    const playerContainer = document.getElementById('m5-player-slots');
    if (!dealerContainer || !playerContainer || !this.m5.dealerCard) return;

    dealerContainer.innerHTML = '';
    playerContainer.innerHTML = '';

    dealerContainer.appendChild(createCardElement(this.m5.dealerCard, this.cardStyle));
    playerContainer.appendChild(createCardElement(this.m5.pCard1, this.cardStyle));
    playerContainer.appendChild(createCardElement(this.m5.pCard2, this.cardStyle));
  },

  handleMode5Answer(userAction) {
    if (this.m5.waitingNext) return;
    this.m5.totalQ++;

    const expected = this.m5.evalRes.action;
    const isCorrect = (userAction === expected);
    const feedbackEl = document.getElementById('m5-feedback');
    const tableFelt = document.getElementById('m5-table-felt');
    const tip = getStrategyTip(this.m5.evalRes, this.m5.dealerCard);

    const actionNames = {
      'H': '要牌 (Hit)',
      'S': '停牌 (Stand)',
      'D': '加倍 (Double)',
      'P': '分牌 (Split)',
      'SU': '投降 (Surrender)'
    };

    if (isCorrect) {
      audio.playCorrect();
      triggerHaptic('success');
      this.m5.correctCount++;
      this.m5.streak++;
      if (this.m5.streak > this.m5.maxStreak) {
        this.m5.maxStreak = this.m5.streak;
        localStorage.setItem('bj_max_streak', this.m5.maxStreak);
      }

      if (tableFelt) {
        tableFelt.classList.remove('is-wrong');
        tableFelt.classList.add('is-correct');
      }

      feedbackEl.className = 'feedback-box correct';
      feedbackEl.innerHTML = `
        <div class="feedback-title">✓ 完全正確！【${actionNames[expected]}】</div>
        ${tip ? `<div class="feedback-tip">${tip}</div>` : ''}
        <div class="feedback-continue-hint">點擊螢幕任一處繼續 ›</div>
      `;

      this.m5.waitingNext = true;
      this.m5.canAdvance = false;
      setTimeout(() => { this.m5.canAdvance = true; }, 120);
    } else {
      audio.playWrong();
      triggerHaptic('error');
      this.m5.streak = 0;

      if (tableFelt) {
        tableFelt.classList.remove('is-correct');
        tableFelt.classList.add('is-wrong');
      }

      // 記錄弱點
      this.m5.mistakes.unshift({
        dealer: this.m5.dealerCard.label,
        hand: `${this.m5.pCard1.label} ${this.m5.pCard2.label}`,
        userAct: actionNames[userAction] || userAction,
        correctAct: actionNames[expected] || expected,
        tip,
        time: new Date().toLocaleTimeString()
      });
      if (this.m5.mistakes.length > 30) this.m5.mistakes.pop();
      localStorage.setItem('bj_mistakes', JSON.stringify(this.m5.mistakes));

      feedbackEl.className = 'feedback-box wrong';
      feedbackEl.innerHTML = `
        <div class="feedback-title">✕ 決策失誤！應為：<strong>${actionNames[expected]}</strong></div>
        <div class="feedback-desc">你的選擇: ${actionNames[userAction] || userAction}</div>
        ${tip ? `<div class="feedback-tip">${tip}</div>` : ''}
        <div class="feedback-continue-hint">點擊螢幕任一處繼續 ›</div>
      `;

      this.m5.waitingNext = true;
      this.m5.canAdvance = false;
      setTimeout(() => { this.m5.canAdvance = true; }, 120);
    }

    // 更新計分板
    document.getElementById('m5-streak').textContent = this.m5.streak;
    document.getElementById('m5-max-streak').textContent = this.m5.maxStreak;
    const acc = ((this.m5.correctCount / this.m5.totalQ) * 100).toFixed(0);
    document.getElementById('m5-accuracy').textContent = `${acc}%`;
    this.updateStatsDisplay();
  },

  renderWeakSpotsList() {
    const listEl = document.getElementById('weakspots-list');
    if (!listEl) return;
    if (this.m5.mistakes.length === 0) {
      listEl.innerHTML = `<div class="empty-state">目前無失誤紀錄，請繼續保持！</div>`;
      return;
    }
    listEl.innerHTML = this.m5.mistakes.map(m => `
      <div class="weakspot-item">
        <div class="weakspot-header">
          <span>莊 [${m.dealer}] vs 手牌 [${m.hand}]</span>
          <span class="weakspot-time">${m.time}</span>
        </div>
        <div class="weakspot-body">
          <span class="user-act">你的選擇: ${m.userAct}</span> ➔ 
          <span class="correct-act">應為: ${m.correctAct}</span>
        </div>
        ${m.tip ? `<div class="weakspot-tip">${m.tip}</div>` : ''}
      </div>
    `).join('');
  },

  // =========================================================================
  // MODE 1: 52張衝刺翻牌測速 (52-Card Speed Drill)
  // =========================================================================
  resetMode1() {
    clearInterval(this.m1.timerId);
    this.m1.deck = createDeck();
    this.m1.hiddenCard = this.m1.deck.pop(); // 扣下第 52 張
    this.m1.currentIndex = 0;
    this.m1.runningCount = 0;
    this.m1.startTime = 0;
    this.m1.isFinished = false;

    document.getElementById('m1-card-slot').innerHTML = `
      <div class="start-card-placeholder">
        <div class="placeholder-icon">●</div>
        <div class="placeholder-text">點擊此處或按按鈕開始衝刺</div>
      </div>
    `;
    document.getElementById('m1-counter').textContent = `0 / 51`;
    document.getElementById('m1-timer').textContent = `0.0s`;
    document.getElementById('m1-action-area').classList.remove('hidden');
    document.getElementById('m1-quiz-area').classList.add('hidden');
    document.getElementById('m1-result-area').classList.add('hidden');

    const flipArea = document.getElementById('m1-flip-stage');
    flipArea.onclick = () => this.handleMode1Flip();
  },

  handleMode1Flip() {
    audio.init();
    if (this.m1.isFinished) return;

    if (this.m1.currentIndex === 0) {
      this.m1.startTime = Date.now();
      this.m1.timerId = setInterval(() => {
        const sec = ((Date.now() - this.m1.startTime) / 1000).toFixed(1);
        document.getElementById('m1-timer').textContent = `${sec}s`;
      }, 100);
    }

    if (this.m1.currentIndex < this.m1.deck.length) {
      const card = this.m1.deck[this.m1.currentIndex];
      this.m1.runningCount += card.hilo;
      this.m1.currentIndex++;

      audio.playFlip();
      triggerHaptic('light');

      const slot = document.getElementById('m1-card-slot');
      slot.innerHTML = '';
      slot.appendChild(createCardElement(card, this.cardStyle));

      document.getElementById('m1-counter').textContent = `${this.m1.currentIndex} / 51`;

      if (this.m1.currentIndex === 51) {
        clearInterval(this.m1.timerId);
        this.m1.isFinished = true;
        this.showMode1Quiz();
      }
    }
  },

  showMode1Quiz() {
    this.m1.isFinished = true;
    clearInterval(this.m1.timerId);
    const elapsedSec = ((Date.now() - this.m1.startTime) / 1000).toFixed(2);
    document.getElementById('m1-action-area').classList.add('hidden');
    document.getElementById('m1-quiz-area').classList.remove('hidden');
    document.getElementById('m1-final-time').textContent = `${elapsedSec} 秒`;

    this.m1.userRC = 0;
    this.updateM1Stepper();
  },

  evaluateMode1Result(userRC) {
    audio.init();
    const actualRC = this.m1.runningCount;
    const isCorrect = (userRC === actualRC);
    const elapsedSec = parseFloat(document.getElementById('m1-final-time').textContent);

    if (isCorrect) audio.playCorrect();
    else audio.playWrong();

    document.getElementById('m1-quiz-area').classList.add('hidden');
    document.getElementById('m1-result-area').classList.remove('hidden');

    let tier = '';
    if (elapsedSec < 20) tier = '頂尖傳奇 (MIT職業隊水準)';
    else if (elapsedSec < 30) tier = '優秀職業級 (賭場實戰游刃有餘)';
    else if (elapsedSec < 45) tier = '良好合格 (可多練習抵消法)';
    else tier = '初學階段 (建議持續練習)';

    document.getElementById('m1-res-status').textContent = isCorrect ? '✓ 計算完全正確' : '✕ 計算有誤';
    document.getElementById('m1-res-status').className = isCorrect ? 'res-title correct' : 'res-title wrong';
    document.getElementById('m1-res-user-rc').textContent = (userRC > 0 ? `+${userRC}` : userRC);
    document.getElementById('m1-res-actual-rc').textContent = (actualRC > 0 ? `+${actualRC}` : actualRC);
    document.getElementById('m1-res-tier').textContent = tier;

    // 展示最後一張暗牌
    const hiddenSlot = document.getElementById('m1-hidden-slot');
    hiddenSlot.innerHTML = '';
    hiddenSlot.appendChild(createCardElement(this.m1.hiddenCard, this.cardStyle));
    document.getElementById('m1-hidden-info').textContent = `
      暗牌為 [${this.m1.hiddenCard.symbol}${this.m1.hiddenCard.suit}]，Hi-Lo 值是 ${this.m1.hiddenCard.hilo >= 0 ? '+' : ''}${this.m1.hiddenCard.hilo}。
      (整副牌 52 張總和必為 0，因此暗牌 Hi-Lo 剛好就是 -RC)
    `;

    document.getElementById('btn-m1-restart').onclick = () => this.resetMode1();
  },

  // =========================================================================
  // MODE 2: 自動節奏定時翻牌 (Auto Rhythm Drill)
  // =========================================================================
  resetMode2() {
    clearInterval(this.m2.timerId);
    this.m2.isPlaying = false;
    this.m2.deck = createDeck();
    this.m2.runningCount = 0;
    this.m2.currentIndex = 0;
    this.m2.targetCount = Math.floor(Math.random() * 12) + 15; // 15~26 張

    document.getElementById('m2-card-slot').innerHTML = `
      <div class="start-card-placeholder">
        <div class="placeholder-icon">●</div>
        <div class="placeholder-text">選擇速度後按「開始自動翻牌」</div>
      </div>
    `;
    document.getElementById('m2-status').textContent = `準備就緒`;
    document.getElementById('btn-m2-start').textContent = `開始自動翻牌 ›`;
    document.getElementById('btn-m2-start').classList.remove('hidden');
    document.getElementById('m2-quiz-area').classList.add('hidden');
    document.getElementById('m2-result-area').classList.add('hidden');

    // 速度選擇按鈕
    const speedPills = document.querySelectorAll('#m2-speeds .pill');
    speedPills.forEach(p => {
      p.onclick = () => {
        audio.init();
        audio.playTap();
        speedPills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        this.m2.speed = parseInt(p.dataset.speed, 10);
      };
    });

    document.getElementById('btn-m2-start').onclick = () => this.startMode2();
  },

  startMode2() {
    audio.init();
    this.m2.isPlaying = true;
    document.getElementById('btn-m2-start').classList.add('hidden');
    document.getElementById('m2-status').textContent = `翻牌中... 專注記憶流水數`;

    this.m2.timerId = setInterval(() => {
      if (this.m2.currentIndex < this.m2.targetCount) {
        const card = this.m2.deck[this.m2.currentIndex];
        this.m2.runningCount += card.hilo;
        this.m2.currentIndex++;

        audio.playFlip();
        triggerHaptic('light');

        const slot = document.getElementById('m2-card-slot');
        slot.innerHTML = '';
        slot.appendChild(createCardElement(card, this.cardStyle));
        document.getElementById('m2-status').textContent = `第 ${this.m2.currentIndex} 張...`;
      } else {
        clearInterval(this.m2.timerId);
        this.showMode2Quiz();
      }
    }, this.m2.speed);
  },

  showMode2Quiz() {
    document.getElementById('m2-status').textContent = `翻牌停止，請輸入最終流水數`;
    document.getElementById('m2-quiz-area').classList.remove('hidden');

    this.m2.userRC = 0;
    this.updateM2Stepper();
  },

  evaluateMode2Result(userRC) {
    audio.init();
    const actualRC = this.m2.runningCount;
    const isCorrect = (userRC === actualRC);

    if (isCorrect) audio.playCorrect();
    else audio.playWrong();

    document.getElementById('m2-quiz-area').classList.add('hidden');
    document.getElementById('m2-result-area').classList.remove('hidden');

    document.getElementById('m2-res-status').textContent = isCorrect ? '✓ 計算完全正確' : '✕ 計算失誤';
    document.getElementById('m2-res-status').className = isCorrect ? 'res-title correct' : 'res-title wrong';
    document.getElementById('m2-res-user-rc').textContent = (userRC > 0 ? `+${userRC}` : userRC);
    document.getElementById('m2-res-actual-rc').textContent = (actualRC > 0 ? `+${actualRC}` : actualRC);
    document.getElementById('m2-res-count').textContent = `${this.m2.targetCount} 張`;

    document.getElementById('btn-m2-restart').onclick = () => this.resetMode2();
  },

  // =========================================================================
  // MODE 3: 成對視覺抵消練習 (Cancellation Drill)
  // =========================================================================
  resetMode3() {
    this.m3.deck = createDeck();
    this.m3.qIndex = 1;
    this.m3.correctCount = 0;
    this.m3.startTime = Date.now();

    document.getElementById('m3-quiz-card').classList.remove('hidden');
    document.getElementById('m3-result-card').classList.add('hidden');

    // 綁定 -2 到 +2 按鈕
    const btns = document.querySelectorAll('.cancel-btn');
    btns.forEach(btn => {
      btn.onclick = () => {
        audio.init();
        const val = parseInt(btn.dataset.val, 10);
        this.handleMode3Answer(val);
      };
    });

    this.nextMode3Pair();
  },

  nextMode3Pair() {
    if (this.m3.deck.length < 2) this.m3.deck = createDeck();
    const c1 = this.m3.deck.pop();
    const c2 = this.m3.deck.pop();
    this.m3.currentPair = { c1, c2, net: c1.hilo + c2.hilo };

    document.getElementById('m3-q-num').textContent = `第 ${this.m3.qIndex} / 10 題`;
    this.renderMode3Pair();
  },

  renderMode3Pair() {
    const slot1 = document.getElementById('m3-card-slot1');
    const slot2 = document.getElementById('m3-card-slot2');
    if (!slot1 || !slot2 || !this.m3.currentPair) return;

    slot1.innerHTML = '';
    slot2.innerHTML = '';
    slot1.appendChild(createCardElement(this.m3.currentPair.c1, this.cardStyle));
    slot2.appendChild(createCardElement(this.m3.currentPair.c2, this.cardStyle));
  },

  handleMode3Answer(userVal) {
    const isCorrect = (userVal === this.m3.currentPair.net);
    const feedback = document.getElementById('m3-feedback');

    if (isCorrect) {
      audio.playCorrect();
      triggerHaptic('success');
      this.m3.correctCount++;
      feedback.textContent = `✓ 正確！淨值為 ${this.m3.currentPair.net >= 0 ? '+' : ''}${this.m3.currentPair.net}`;
      feedback.className = 'quick-feedback correct';
    } else {
      audio.playWrong();
      triggerHaptic('error');
      feedback.textContent = `✕ 錯誤，正確淨值是 ${this.m3.currentPair.net >= 0 ? '+' : ''}${this.m3.currentPair.net}`;
      feedback.className = 'quick-feedback wrong';
    }

    if (this.m3.qIndex < 10) {
      this.m3.qIndex++;
      setTimeout(() => {
        feedback.textContent = '';
        this.nextMode3Pair();
      }, 500);
    } else {
      setTimeout(() => this.finishMode3(), 500);
    }
  },

  finishMode3() {
    const sec = ((Date.now() - this.m3.startTime) / 1000).toFixed(1);
    document.getElementById('m3-quiz-card').classList.add('hidden');
    document.getElementById('m3-result-card').classList.remove('hidden');

    document.getElementById('m3-res-score').textContent = `${this.m3.correctCount} / 10`;
    document.getElementById('m3-res-time').textContent = `${sec} 秒 (平均 ${(sec / 10).toFixed(1)}s/題)`;

    document.getElementById('btn-m3-restart').onclick = () => this.resetMode3();
  },

  // =========================================================================
  // MODE 4: 真數換算心算速測 (True Count Drill)
  // =========================================================================
  nextMode4Question() {
    const rcList = [-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
    const deckList = [1, 1.5, 2, 2.5, 3, 4, 5];

    this.m4.rc = rcList[Math.floor(Math.random() * rcList.length)];
    this.m4.decks = deckList[Math.floor(Math.random() * deckList.length)];
    this.m4.expectedTC = Math.trunc(this.m4.rc / this.m4.decks);

    document.getElementById('m4-rc-val').textContent = (this.m4.rc > 0 ? `+${this.m4.rc}` : this.m4.rc);
    document.getElementById('m4-decks-val').textContent = `${this.m4.decks} 副牌`;
    const feedback = document.getElementById('m4-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'quick-feedback';
    }

    this.m4.userTC = 0;
    this.updateM4Stepper();
  },

  evaluateMode4Answer(userTC) {
    const isCorrect = (userTC === this.m4.expectedTC);
    const feedback = document.getElementById('m4-feedback');

    if (isCorrect) {
      audio.playCorrect();
      triggerHaptic('success');
      feedback.textContent = `✓ 正確！TC = ${this.m4.rc} ÷ ${this.m4.decks} = ${this.m4.expectedTC >= 0 ? '+' : ''}${this.m4.expectedTC}`;
      feedback.className = 'quick-feedback correct';
      setTimeout(() => this.nextMode4Question(), 700);
    } else {
      audio.playWrong();
      triggerHaptic('error');
      feedback.textContent = `✕ 計算未吻合，應為：${this.m4.rc} ÷ ${this.m4.decks} = ${this.m4.expectedTC >= 0 ? '+' : ''}${this.m4.expectedTC}`;
      feedback.className = 'quick-feedback wrong';
      setTimeout(() => this.nextMode4Question(), 1300);
    }
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
