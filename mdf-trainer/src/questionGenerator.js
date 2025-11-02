/**
 * Question Generator for Pot Odds and MDF Training
 * Generates random poker scenarios for practice
 */

const { calculatePotOdds, calculateMDF, calculateBetAmount } = require('./calculator');

// Standard bet sizings for PLO
const STANDARD_BET_SIZES = [20, 33, 50, 66, 75, 80, 100];

// Pot size ranges (in big blinds or currency units)
const MIN_POT = 2.5;  // Limp scenario: SB limps, BB checks (1 + 0.5 + 1)
const MAX_POT = 400;  // Deep stack scenario (200bb each)
const TYPICAL_MIN_POT = 4.5; // More typical: minraise (2 + 0.5 + 1 + 1)

/**
 * Generate a random pot size
 *
 * @param {number} min - Minimum pot size
 * @param {number} max - Maximum pot size
 * @returns {number} Random pot size
 */
function generateRandomPot(min = TYPICAL_MIN_POT, max = MAX_POT) {
  // Generate pot sizes that are more realistic (rounded numbers)
  const pot = Math.random() * (max - min) + min;
  // Round to nearest 0.5 for cleaner numbers
  return Math.round(pot * 2) / 2;
}

/**
 * Generate a random bet sizing
 *
 * @returns {number} Bet size percentage
 */
function generateRandomBetSize() {
  const sizes = STANDARD_BET_SIZES;

  // Weight standard sizes: 20, 33, 50, 66, 75, 80, 100
  // 33%, 50%, 75%, 100% are more common
  const weights = [1, 3, 4, 1, 4, 1, 3];

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < sizes.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return sizes[i];
    }
  }

  return sizes[0];
}

/**
 * Generate a Pot Odds question
 *
 * @param {Object} options - Generation options
 * @returns {Object} Question object with pot, bet, and answer
 */
function generatePotOddsQuestion(options = {}) {
  const {
    minPot = TYPICAL_MIN_POT,
    maxPot = MAX_POT,
    betSizePercentage = null
  } = options;

  const pot = generateRandomPot(minPot, maxPot);
  const betSize = betSizePercentage || generateRandomBetSize();
  const bet = calculateBetAmount(pot, betSize);

  const answer = calculatePotOdds(pot, bet);

  return {
    type: 'pot-odds',
    pot: Math.round(pot * 100) / 100,
    bet: Math.round(bet * 100) / 100,
    betSizePercentage: betSize,
    answer: answer,
    question: `Pot: ${pot}, Bet: ${bet} (${betSize}% pot). What are your pot odds?`
  };
}

/**
 * Generate an MDF question
 *
 * @param {Object} options - Generation options
 * @returns {Object} Question object with pot, bet, and answer
 */
function generateMDFQuestion(options = {}) {
  const {
    minPot = TYPICAL_MIN_POT,
    maxPot = MAX_POT,
    betSizePercentage = null
  } = options;

  const pot = generateRandomPot(minPot, maxPot);
  const betSize = betSizePercentage || generateRandomBetSize();
  const bet = calculateBetAmount(pot, betSize);

  const answer = calculateMDF(pot, bet);

  return {
    type: 'mdf',
    pot: Math.round(pot * 100) / 100,
    bet: Math.round(bet * 100) / 100,
    betSizePercentage: betSize,
    answer: answer,
    question: `Pot: ${pot}, Bet: ${bet} (${betSize}% pot). What is your MDF?`
  };
}

/**
 * Generate a random question (either Pot Odds or MDF)
 *
 * @param {Object} options - Generation options
 * @returns {Object} Question object
 */
function generateRandomQuestion(options = {}) {
  const questionType = Math.random() < 0.5 ? 'pot-odds' : 'mdf';

  if (questionType === 'pot-odds') {
    return generatePotOddsQuestion(options);
  } else {
    return generateMDFQuestion(options);
  }
}

/**
 * Check if an answer is correct (with tolerance for rounding)
 *
 * @param {number} userAnswer - User's answer
 * @param {number} correctAnswer - Correct answer
 * @param {number} tolerance - Acceptable difference (default 0.5%)
 * @returns {boolean} Whether the answer is correct
 */
function checkAnswer(userAnswer, correctAnswer, tolerance = 0.5) {
  return Math.abs(userAnswer - correctAnswer) <= tolerance;
}

module.exports = {
  generatePotOddsQuestion,
  generateMDFQuestion,
  generateRandomQuestion,
  checkAnswer,
  STANDARD_BET_SIZES,
  MIN_POT,
  MAX_POT,
  TYPICAL_MIN_POT
};
