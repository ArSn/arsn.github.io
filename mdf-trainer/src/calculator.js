/**
 * Calculator for Pot Odds and MDF (Minimum Defense Frequency)
 * For Omaha Pot Limit Poker
 */

/**
 * Calculate pot odds as a percentage
 * Pot Odds = (Amount to Call) / (Pot after you call)
 *
 * @param {number} pot - Current pot size
 * @param {number} bet - Bet amount
 * @returns {number} Pot odds as percentage (0-100)
 */
function calculatePotOdds(pot, bet) {
  if (bet <= 0) return 0;
  const potAfterCall = pot + bet + bet; // pot + opponent's bet + your call
  const potOdds = (bet / potAfterCall) * 100;
  return Math.round(potOdds * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate pot odds as ratio (e.g., "2.5:1")
 *
 * @param {number} pot - Current pot size
 * @param {number} bet - Bet amount
 * @returns {string} Pot odds as ratio
 */
function calculatePotOddsRatio(pot, bet) {
  if (bet <= 0) return "0:1";
  const potAfterCall = pot + bet + bet;
  const ratio = (potAfterCall - bet) / bet;
  return `${Math.round(ratio * 10) / 10}:1`;
}

/**
 * Calculate MDF (Minimum Defense Frequency)
 * MDF = 1 - (Bet / (Pot + Bet))
 * This is the minimum % of your range you need to defend to prevent opponent from auto-profiting
 *
 * @param {number} pot - Current pot size
 * @param {number} bet - Bet amount
 * @returns {number} MDF as percentage (0-100)
 */
function calculateMDF(pot, bet) {
  if (bet <= 0) return 100;
  const mdf = (1 - (bet / (pot + bet))) * 100;
  return Math.round(mdf * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate bet size as percentage of pot
 *
 * @param {number} pot - Current pot size
 * @param {number} bet - Bet amount
 * @returns {number} Bet size as percentage of pot
 */
function calculateBetSizePercentage(pot, bet) {
  if (pot <= 0) return 0;
  return Math.round((bet / pot) * 100);
}

/**
 * Calculate bet amount from pot and percentage
 *
 * @param {number} pot - Current pot size
 * @param {number} percentage - Bet size percentage (e.g., 33, 50, 75, 100)
 * @returns {number} Bet amount
 */
function calculateBetAmount(pot, percentage) {
  return Math.round((pot * percentage / 100) * 100) / 100;
}

module.exports = {
  calculatePotOdds,
  calculatePotOddsRatio,
  calculateMDF,
  calculateBetSizePercentage,
  calculateBetAmount
};
