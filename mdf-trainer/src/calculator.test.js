const {
  calculatePotOdds,
  calculatePotOddsRatio,
  calculateMDF,
  calculateBetSizePercentage,
  calculateBetAmount
} = require('./calculator');

describe('Calculator', () => {
  describe('calculatePotOdds', () => {
    test('calculates pot odds correctly for 50% pot bet', () => {
      const pot = 100;
      const bet = 50;
      // To call 50, pot after call = 100 + 50 + 50 = 200
      // Pot odds = 50/200 = 25%
      expect(calculatePotOdds(pot, bet)).toBe(25);
    });

    test('calculates pot odds correctly for 100% pot bet', () => {
      const pot = 100;
      const bet = 100;
      // To call 100, pot after call = 100 + 100 + 100 = 300
      // Pot odds = 100/300 = 33.33%
      expect(calculatePotOdds(pot, bet)).toBe(33.33);
    });

    test('calculates pot odds correctly for 33% pot bet', () => {
      const pot = 100;
      const bet = 33;
      // To call 33, pot after call = 100 + 33 + 33 = 166
      // Pot odds = 33/166 = 19.88%
      expect(calculatePotOdds(pot, bet)).toBe(19.88);
    });

    test('calculates pot odds correctly for 75% pot bet', () => {
      const pot = 100;
      const bet = 75;
      // To call 75, pot after call = 100 + 75 + 75 = 250
      // Pot odds = 75/250 = 30%
      expect(calculatePotOdds(pot, bet)).toBe(30);
    });

    test('handles small pot sizes', () => {
      const pot = 4.5;
      const bet = 2.25; // 50% pot
      const potOdds = calculatePotOdds(pot, bet);
      expect(potOdds).toBe(25);
    });

    test('returns 0 for zero bet', () => {
      expect(calculatePotOdds(100, 0)).toBe(0);
    });
  });

  describe('calculatePotOddsRatio', () => {
    test('calculates ratio correctly for 50% pot bet', () => {
      const pot = 100;
      const bet = 50;
      // Pot odds = 25% = getting 3:1
      expect(calculatePotOddsRatio(pot, bet)).toBe('3:1');
    });

    test('calculates ratio correctly for 100% pot bet', () => {
      const pot = 100;
      const bet = 100;
      // Getting 2:1
      expect(calculatePotOddsRatio(pot, bet)).toBe('2:1');
    });
  });

  describe('calculateMDF', () => {
    test('calculates MDF correctly for 50% pot bet', () => {
      const pot = 100;
      const bet = 50;
      // MDF = 1 - (50 / (100 + 50)) = 1 - 0.333... = 66.67%
      expect(calculateMDF(pot, bet)).toBe(66.67);
    });

    test('calculates MDF correctly for 100% pot bet', () => {
      const pot = 100;
      const bet = 100;
      // MDF = 1 - (100 / (100 + 100)) = 1 - 0.5 = 50%
      expect(calculateMDF(pot, bet)).toBe(50);
    });

    test('calculates MDF correctly for 33% pot bet', () => {
      const pot = 100;
      const bet = 33;
      // MDF = 1 - (33 / (100 + 33)) = 1 - 0.2481... = 75.19%
      expect(calculateMDF(pot, bet)).toBe(75.19);
    });

    test('calculates MDF correctly for 75% pot bet', () => {
      const pot = 100;
      const bet = 75;
      // MDF = 1 - (75 / (100 + 75)) = 1 - 0.4286 = 57.14%
      expect(calculateMDF(pot, bet)).toBe(57.14);
    });

    test('handles small pot sizes', () => {
      const pot = 4.5;
      const bet = 4.5; // 100% pot
      const mdf = calculateMDF(pot, bet);
      expect(mdf).toBe(50);
    });

    test('returns 100 for zero bet', () => {
      expect(calculateMDF(100, 0)).toBe(100);
    });
  });

  describe('calculateBetSizePercentage', () => {
    test('calculates bet size percentage correctly', () => {
      expect(calculateBetSizePercentage(100, 50)).toBe(50);
      expect(calculateBetSizePercentage(100, 33)).toBe(33);
      expect(calculateBetSizePercentage(100, 75)).toBe(75);
      expect(calculateBetSizePercentage(100, 100)).toBe(100);
    });

    test('handles non-standard bet sizes', () => {
      expect(calculateBetSizePercentage(100, 66)).toBe(66);
      expect(calculateBetSizePercentage(100, 20)).toBe(20);
    });

    test('returns 0 for zero pot', () => {
      expect(calculateBetSizePercentage(0, 50)).toBe(0);
    });
  });

  describe('calculateBetAmount', () => {
    test('calculates bet amount correctly', () => {
      expect(calculateBetAmount(100, 50)).toBe(50);
      expect(calculateBetAmount(100, 33)).toBe(33);
      expect(calculateBetAmount(100, 75)).toBe(75);
      expect(calculateBetAmount(100, 100)).toBe(100);
    });

    test('handles decimal pot sizes', () => {
      expect(calculateBetAmount(45.5, 50)).toBe(22.75);
      expect(calculateBetAmount(4.5, 100)).toBe(4.5);
    });
  });

  describe('Real-world scenarios', () => {
    test('Standard PLO scenario: 4.5 pot, 75% bet', () => {
      const pot = 4.5;
      const bet = calculateBetAmount(pot, 75);
      expect(bet).toBe(3.38);
      expect(calculatePotOdds(pot, bet)).toBe(30.02);
      expect(calculateMDF(pot, bet)).toBe(57.11);
    });

    test('Deep stack scenario: 200 pot, 50% bet', () => {
      const pot = 200;
      const bet = calculateBetAmount(pot, 50);
      expect(bet).toBe(100);
      expect(calculatePotOdds(pot, bet)).toBe(25);
      expect(calculateMDF(pot, bet)).toBe(66.67);
    });

    test('Small pot scenario: 2.5 pot, 100% bet', () => {
      const pot = 2.5;
      const bet = calculateBetAmount(pot, 100);
      expect(bet).toBe(2.5);
      expect(calculatePotOdds(pot, bet)).toBe(33.33);
      expect(calculateMDF(pot, bet)).toBe(50);
    });
  });
});
