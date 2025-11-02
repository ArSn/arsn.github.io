const {
  generatePotOddsQuestion,
  generateMDFQuestion,
  generateRandomQuestion,
  checkAnswer,
  STANDARD_BET_SIZES,
  MIN_POT,
  MAX_POT,
  TYPICAL_MIN_POT
} = require('./questionGenerator');

describe('Question Generator', () => {
  describe('generatePotOddsQuestion', () => {
    test('generates valid pot odds question with default options', () => {
      const question = generatePotOddsQuestion();

      expect(question.type).toBe('pot-odds');
      expect(question.pot).toBeGreaterThanOrEqual(TYPICAL_MIN_POT);
      expect(question.pot).toBeLessThanOrEqual(MAX_POT);
      expect(question.bet).toBeGreaterThan(0);
      expect(question.answer).toBeGreaterThan(0);
      expect(question.answer).toBeLessThan(100);
      expect(question.question).toContain('pot odds');
    });

    test('generates question with custom pot range', () => {
      const question = generatePotOddsQuestion({
        minPot: 10,
        maxPot: 50
      });

      expect(question.pot).toBeGreaterThanOrEqual(10);
      expect(question.pot).toBeLessThanOrEqual(50);
    });

    test('generates question with specific bet size', () => {
      const question = generatePotOddsQuestion({
        betSizePercentage: 50
      });

      expect(question.betSizePercentage).toBe(50);
      expect(Math.abs(question.bet / question.pot - 0.5)).toBeLessThan(0.01);
    });

    test('generates multiple different questions', () => {
      const questions = Array.from({ length: 10 }, () => generatePotOddsQuestion());
      const uniquePots = new Set(questions.map(q => q.pot));
      const uniqueBets = new Set(questions.map(q => q.bet));

      // Should have some variety
      expect(uniquePots.size).toBeGreaterThan(5);
      expect(uniqueBets.size).toBeGreaterThan(5);
    });
  });

  describe('generateMDFQuestion', () => {
    test('generates valid MDF question with default options', () => {
      const question = generateMDFQuestion();

      expect(question.type).toBe('mdf');
      expect(question.pot).toBeGreaterThanOrEqual(TYPICAL_MIN_POT);
      expect(question.pot).toBeLessThanOrEqual(MAX_POT);
      expect(question.bet).toBeGreaterThan(0);
      expect(question.answer).toBeGreaterThan(0);
      expect(question.answer).toBeLessThanOrEqual(100);
      expect(question.question).toContain('MDF');
    });

    test('generates question with custom pot range', () => {
      const question = generateMDFQuestion({
        minPot: 20,
        maxPot: 100
      });

      expect(question.pot).toBeGreaterThanOrEqual(20);
      expect(question.pot).toBeLessThanOrEqual(100);
    });

    test('generates question with specific bet size', () => {
      const question = generateMDFQuestion({
        betSizePercentage: 75
      });

      expect(question.betSizePercentage).toBe(75);
      expect(Math.abs(question.bet / question.pot - 0.75)).toBeLessThan(0.01);
    });

    test('MDF is higher for smaller bets', () => {
      const smallBet = generateMDFQuestion({ betSizePercentage: 33 });
      const largeBet = generateMDFQuestion({ betSizePercentage: 100 });

      // Smaller bets require higher MDF
      expect(smallBet.answer).toBeGreaterThan(largeBet.answer);
    });
  });

  describe('generateRandomQuestion', () => {
    test('generates both types of questions', () => {
      const questions = Array.from({ length: 20 }, () => generateRandomQuestion());
      const potOddsQuestions = questions.filter(q => q.type === 'pot-odds');
      const mdfQuestions = questions.filter(q => q.type === 'mdf');

      // Should have a mix of both (with some randomness tolerance)
      expect(potOddsQuestions.length).toBeGreaterThan(0);
      expect(mdfQuestions.length).toBeGreaterThan(0);
    });

    test('respects custom options', () => {
      const question = generateRandomQuestion({
        minPot: 50,
        maxPot: 100,
        betSizePercentage: 50
      });

      expect(question.pot).toBeGreaterThanOrEqual(50);
      expect(question.pot).toBeLessThanOrEqual(100);
      expect(question.betSizePercentage).toBe(50);
    });
  });

  describe('checkAnswer', () => {
    test('accepts exact answer', () => {
      expect(checkAnswer(25, 25)).toBe(true);
      expect(checkAnswer(33.33, 33.33)).toBe(true);
      expect(checkAnswer(66.67, 66.67)).toBe(true);
    });

    test('accepts answer within tolerance', () => {
      expect(checkAnswer(25, 25.4)).toBe(true);
      expect(checkAnswer(25, 24.6)).toBe(true);
      expect(checkAnswer(33.33, 33.5)).toBe(true);
    });

    test('rejects answer outside tolerance', () => {
      expect(checkAnswer(25, 26)).toBe(false);
      expect(checkAnswer(25, 24)).toBe(false);
      expect(checkAnswer(33.33, 34)).toBe(false);
    });

    test('respects custom tolerance', () => {
      expect(checkAnswer(25, 26, 1.0)).toBe(true);
      expect(checkAnswer(25, 26.5, 1.0)).toBe(false);
    });

    test('handles edge cases', () => {
      expect(checkAnswer(0, 0)).toBe(true);
      expect(checkAnswer(100, 100)).toBe(true);
      expect(checkAnswer(0, 0.4)).toBe(true);
      expect(checkAnswer(0, 0.6)).toBe(false);
    });
  });

  describe('Bet size distribution', () => {
    test('generates standard bet sizes most frequently', () => {
      const questions = Array.from({ length: 100 }, () => generatePotOddsQuestion());
      const betSizes = questions.map(q => q.betSizePercentage);

      const standardCount = betSizes.filter(size => STANDARD_BET_SIZES.includes(size)).length;

      // Most questions should use standard sizes
      expect(standardCount).toBeGreaterThan(70);
    });

    test('excludes occasional sizes when specified', () => {
      const questions = Array.from({ length: 50 }, () =>
        generatePotOddsQuestion({ includeOccasionalSizes: false })
      );
      const betSizes = questions.map(q => q.betSizePercentage);

      // Should only have standard sizes
      betSizes.forEach(size => {
        expect(STANDARD_BET_SIZES).toContain(size);
      });
    });
  });

  describe('Answer consistency', () => {
    test('pot odds answer matches manual calculation', () => {
      const question = generatePotOddsQuestion({ betSizePercentage: 50 });
      const { pot, bet, answer } = question;

      const expectedOdds = (bet / (pot + bet + bet)) * 100;
      expect(Math.abs(answer - expectedOdds)).toBeLessThan(0.1);
    });

    test('MDF answer matches manual calculation', () => {
      const question = generateMDFQuestion({ betSizePercentage: 75 });
      const { pot, bet, answer } = question;

      const expectedMDF = (1 - (bet / (pot + bet))) * 100;
      expect(Math.abs(answer - expectedMDF)).toBeLessThan(0.1);
    });
  });
});
