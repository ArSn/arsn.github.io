# MDF & Pot Odds Trainer for Omaha Pot Limit

An interactive trainer for practicing Pot Odds and MDF (Minimum Defense Frequency) calculations for Omaha Pot Limit Poker.

## Features

- **Pot Odds Training**: Calculate pot odds for different bet sizes
- **MDF Training**: Calculate the Minimum Defense Frequency against different sizings
- **Random Mode**: Mix both question types for varied training
- **Results Tracking**: Track your accuracy for both categories
- **Custom Settings**: Adjust pot sizes (Min/Max)
- **Standard Bet Sizes**: 33%, 50%, 75%, 100% (most common) + 20%, 66% (less common)
- **Auto-Advance**: Automatically advances to next question after correct/incorrect answer
- **LocalStorage**: Your stats and settings are saved locally

## Installation

```bash
npm install
```

## Running Tests

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

For coverage:

```bash
npm run test:coverage
```

## Starting the App

Simply open the file `public/index.html` in your browser.

Alternatively, use a local server:

```bash
# With Node.js (http-server)
npx http-server public -p 8000
```

Then open: http://localhost:8000

## Usage

1. **Choose Question Type**: Random, Pot Odds Only, or MDF Only
2. **Pot and Bet are displayed**: e.g., Pot: 45, Bet: 22.5 (50%)
3. **Enter your answer**: Enter your calculation in % (e.g., 25 for 25%)
4. **Submit or press Enter**: Immediate feedback on correct/incorrect
5. **Auto-Advance**: After 1.5 seconds, automatically moves to the next question

### Settings

- **Min Pot**: Minimum pot size (default: 4.5)
- **Max Pot**: Maximum pot size (default: 400)
- **Reset Stats**: Reset all stats

### Tolerance

The system accepts answers with a tolerance of ±0.5%. This means:
- Correct answer: 33.33%
- Accepted: 32.83% - 33.83%

## Formulas

### Pot Odds
```
Pot Odds = (Bet / (Pot + 2 × Bet)) × 100
```

**Example**: Pot: 100, Bet: 50 (50% pot)
- Pot Odds = 50 / (100 + 50 + 50) × 100 = 25%

### MDF (Minimum Defense Frequency)
```
MDF = (1 - (Bet / (Pot + Bet))) × 100
```

**Example**: Pot: 100, Bet: 50 (50% pot)
- MDF = (1 - 50/150) × 100 = 66.67%

## Quick Reference

| Bet Size | MDF    | Pot Odds |
|----------|--------|----------|
| 33%      | 75%    | 20%      |
| 50%      | 67%    | 25%      |
| 75%      | 57%    | 30%      |
| 100%     | 50%    | 33%      |

## Project Structure

```
mdf-trainer/
├── src/
│   ├── calculator.js           # Pot Odds & MDF calculations
│   ├── calculator.test.js      # Tests for calculator
│   ├── questionGenerator.js    # Question generator
│   └── questionGenerator.test.js # Tests for generator
├── public/
│   ├── index.html             # HTML UI
│   ├── styles.css             # Styling
│   └── app.js                 # Browser app logic
├── package.json
├── jest.config.js
└── README.md
```

## Pot Size Ranges

- **Min Pot**: 2.5 (Limp-Scenario: SB limps, BB checks)
- **Typical Min Pot**: 4.5 (Minraise: 2 + 0.5 + 1 + 1)
- **Max Pot**: 400 (Deepstack: 200bb each)

## Bet Sizings

**Standard** (common):
- 33% pot
- 50% pot
- 75% pot
- 100% pot

**Occasional** (less common):
- 20% pot (small SPR situations)
- 66% pot

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

Uses localStorage for persistent stats and settings.

## Future Features (Optional)

- Customizable bet sizes
- Position-based scenarios (IP vs OOP)
- Streak tracking (longest winning streak)
- Time-based challenges
- Export stats as CSV
