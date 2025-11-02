/**
 * MDF & Pot Odds Trainer - Browser Application
 * For Omaha Pot Limit
 */

// Calculator functions (duplicated for browser)
function calculatePotOdds(pot, bet) {
  if (bet <= 0) return 0;
  const potAfterCall = pot + bet + bet;
  const potOdds = (bet / potAfterCall) * 100;
  return Math.round(potOdds * 100) / 100;
}

function calculateMDF(pot, bet) {
  if (bet <= 0) return 100;
  const mdf = (1 - (bet / (pot + bet))) * 100;
  return Math.round(mdf * 100) / 100;
}

function calculateBetAmount(pot, percentage) {
  return Math.round((pot * percentage / 100) * 100) / 100;
}

// Question generation
const STANDARD_BET_SIZES = [33, 50, 75, 100];
const OCCASIONAL_BET_SIZES = [20, 66];
const TYPICAL_MIN_POT = 4.5;
const MAX_POT = 400;

function generateRandomPot(min = TYPICAL_MIN_POT, max = MAX_POT) {
  const pot = Math.random() * (max - min) + min;
  return Math.round(pot * 2) / 2;
}

function generateRandomBetSize(includeOccasional = true) {
  const sizes = includeOccasional
    ? [...STANDARD_BET_SIZES, ...OCCASIONAL_BET_SIZES]
    : STANDARD_BET_SIZES;
  const weights = includeOccasional
    ? [3, 4, 4, 3, 1, 1]
    : [3, 4, 4, 3];

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

function generateQuestion(type, options = {}) {
  const {
    minPot = TYPICAL_MIN_POT,
    maxPot = MAX_POT,
    betSizePercentage = null,
  } = options;

  const pot = generateRandomPot(minPot, maxPot);
  const betSize = betSizePercentage || generateRandomBetSize();
  const bet = calculateBetAmount(pot, betSize);

  if (type === 'pot-odds') {
    return {
      type: 'pot-odds',
      pot: Math.round(pot * 100) / 100,
      bet: Math.round(bet * 100) / 100,
      betSizePercentage: betSize,
      answer: calculatePotOdds(pot, bet)
    };
  } else {
    return {
      type: 'mdf',
      pot: Math.round(pot * 100) / 100,
      bet: Math.round(bet * 100) / 100,
      betSizePercentage: betSize,
      answer: calculateMDF(pot, bet)
    };
  }
}

function checkAnswer(userAnswer, correctAnswer, tolerance = 0.5) {
  return Math.abs(userAnswer - correctAnswer) <= tolerance;
}

// Application State
let currentQuestion = null;
let stats = {
  potOdds: { correct: 0, total: 0 },
  mdf: { correct: 0, total: 0 }
};

// Load stats from localStorage
function loadStats() {
  const saved = localStorage.getItem('mdf-trainer-stats');
  if (saved) {
    stats = JSON.parse(saved);
  }
}

function saveStats() {
  localStorage.setItem('mdf-trainer-stats', JSON.stringify(stats));
}

function resetStats() {
  stats = {
    potOdds: { correct: 0, total: 0 },
    mdf: { correct: 0, total: 0 }
  };
  saveStats();
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const potOddsPercent = stats.potOdds.total > 0
    ? Math.round((stats.potOdds.correct / stats.potOdds.total) * 100)
    : 0;
  const mdfPercent = stats.mdf.total > 0
    ? Math.round((stats.mdf.correct / stats.mdf.total) * 100)
    : 0;

  document.getElementById('pot-odds-stats').textContent =
    `${stats.potOdds.correct}/${stats.potOdds.total} (${potOddsPercent}%)`;
  document.getElementById('mdf-stats').textContent =
    `${stats.mdf.correct}/${stats.mdf.total} (${mdfPercent}%)`;
}

// Settings
let settings = {
  minPot: TYPICAL_MIN_POT,
  maxPot: MAX_POT,
  betSizes: [...STANDARD_BET_SIZES]
};

function loadSettings() {
  const saved = localStorage.getItem('mdf-trainer-settings');
  if (saved) {
    settings = JSON.parse(saved);
  }
  // Update UI
  document.getElementById('min-pot').value = settings.minPot;
  document.getElementById('max-pot').value = settings.maxPot;
}

function saveSettings() {
  settings.minPot = parseFloat(document.getElementById('min-pot').value);
  settings.maxPot = parseFloat(document.getElementById('max-pot').value);
  localStorage.setItem('mdf-trainer-settings', JSON.stringify(settings));
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settings-panel');
  settingsPanel.classList.toggle('hidden');
}

// Question handling
function newQuestion() {
  const questionType = document.querySelector('input[name="question-type"]:checked').value;

  if (questionType === 'random') {
    currentQuestion = generateQuestion(
      Math.random() < 0.5 ? 'pot-odds' : 'mdf',
      { minPot: settings.minPot, maxPot: settings.maxPot }
    );
  } else {
    currentQuestion = generateQuestion(
      questionType,
      { minPot: settings.minPot, maxPot: settings.maxPot }
    );
  }

  displayQuestion();
  document.getElementById('answer-input').value = '';
  document.getElementById('answer-input').focus();
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
}

function displayQuestion() {
  const { pot, bet, betSizePercentage, type } = currentQuestion;

  document.getElementById('pot-value').textContent = pot.toFixed(2);
  document.getElementById('bet-value').textContent = bet.toFixed(2);
  document.getElementById('bet-percentage').textContent = `${betSizePercentage}%`;

  const questionLabel = type === 'pot-odds'
    ? 'What are your pot odds? (in %)'
    : 'What is your MDF? (in %)';

  document.getElementById('question-label').textContent = questionLabel;
}

function submitAnswer() {
  const userAnswer = parseFloat(document.getElementById('answer-input').value);

  if (isNaN(userAnswer)) {
    document.getElementById('feedback').textContent = 'Please enter a valid number';
    document.getElementById('feedback').className = 'feedback error';
    return;
  }

  const isCorrect = checkAnswer(userAnswer, currentQuestion.answer);
  const feedback = document.getElementById('feedback');

  if (isCorrect) {
    feedback.textContent = `Correct! The answer is ${currentQuestion.answer}%`;
    feedback.className = 'feedback correct';

    // Update stats
    if (currentQuestion.type === 'pot-odds') {
      stats.potOdds.correct++;
      stats.potOdds.total++;
    } else {
      stats.mdf.correct++;
      stats.mdf.total++;
    }
  } else {
    feedback.textContent = `Wrong! The correct answer is ${currentQuestion.answer}%. You answered ${userAnswer}%`;
    feedback.className = 'feedback wrong';

    // Update stats
    if (currentQuestion.type === 'pot-odds') {
      stats.potOdds.total++;
    } else {
      stats.mdf.total++;
    }
  }

  saveStats();
  updateStatsDisplay();

  // Auto-advance after 1.5 seconds
  setTimeout(() => {
    newQuestion();
  }, 1500);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadSettings();
  updateStatsDisplay();
  newQuestion();

  document.getElementById('new-question-btn').addEventListener('click', newQuestion);
  document.getElementById('submit-btn').addEventListener('click', submitAnswer);
  document.getElementById('reset-stats-btn').addEventListener('click', resetStats);
  document.getElementById('settings-btn').addEventListener('click', toggleSettings);
  document.getElementById('save-settings-btn').addEventListener('click', () => {
    saveSettings();
    toggleSettings();
  });

  // Enter key to submit
  document.getElementById('answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  });

  // Apply settings on change
  document.getElementById('min-pot').addEventListener('change', saveSettings);
  document.getElementById('max-pot').addEventListener('change', saveSettings);
});
