/**
 * Demo Script - Shows how the trainer works
 */

const {
  calculatePotOdds,
  calculateMDF,
  calculateBetAmount
} = require('./src/calculator');

const {
  generatePotOddsQuestion,
  generateMDFQuestion,
  generateRandomQuestion
} = require('./src/questionGenerator');

console.log('=== MDF & Pot Odds Trainer Demo ===\n');

// Example 1: Calculate Pot Odds
console.log('Example 1: Pot Odds Calculation');
console.log('Pot: 100, Bet: 50 (50% pot)');
console.log(`Pot Odds: ${calculatePotOdds(100, 50)}%`);
console.log('(You need to call 50 to win 200 total)\n');

// Example 2: Calculate MDF
console.log('Example 2: MDF Calculation');
console.log('Pot: 100, Bet: 75 (75% pot)');
console.log(`MDF: ${calculateMDF(100, 75)}%`);
console.log('(You need to defend at least 57.14% of your range)\n');

// Example 3: Standard bet sizes
console.log('Example 3: Common Bet Sizes & Results');
const pot = 100;
const sizes = [33, 50, 75, 100];

sizes.forEach(size => {
  const bet = calculateBetAmount(pot, size);
  const potOdds = calculatePotOdds(pot, bet);
  const mdf = calculateMDF(pot, bet);
  console.log(`${size}% pot (bet ${bet}): Pot Odds = ${potOdds}%, MDF = ${mdf}%`);
});
console.log();

// Example 4: Generate random questions
console.log('Example 4: Random Question Generation\n');

console.log('Pot Odds Question:');
const q1 = generatePotOddsQuestion();
console.log(`Pot: ${q1.pot}, Bet: ${q1.bet} (${q1.betSizePercentage}% pot)`);
console.log(`Answer: ${q1.answer}%\n`);

console.log('MDF Question:');
const q2 = generateMDFQuestion();
console.log(`Pot: ${q2.pot}, Bet: ${q2.bet} (${q2.betSizePercentage}% pot)`);
console.log(`Answer: ${q2.answer}%\n`);

// Example 5: Omaha PLO scenarios
console.log('Example 5: Real Omaha PLO Scenarios\n');

console.log('Scenario 1: Preflop minraise pot');
console.log('Pot: 4.5, Flop bet: 75% pot');
let plo_pot = 4.5;
let plo_bet = calculateBetAmount(plo_pot, 75);
console.log(`Bet: ${plo_bet}`);
console.log(`Pot Odds: ${calculatePotOdds(plo_pot, plo_bet)}%`);
console.log(`MDF: ${calculateMDF(plo_pot, plo_bet)}%\n`);

console.log('Scenario 2: Deep stack turn');
console.log('Pot: 200, Turn bet: 50% pot');
plo_pot = 200;
plo_bet = calculateBetAmount(plo_pot, 50);
console.log(`Bet: ${plo_bet}`);
console.log(`Pot Odds: ${calculatePotOdds(plo_pot, plo_bet)}%`);
console.log(`MDF: ${calculateMDF(plo_pot, plo_bet)}%\n`);

console.log('=== Open public/index.html in your browser to start training! ===');
