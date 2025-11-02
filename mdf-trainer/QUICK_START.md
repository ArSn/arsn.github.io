# Quick Start

## Start Immediately

1. **Open Browser**: Open `public/index.html` in your browser
2. **Let's Go**: Questions are automatically generated, just enter your answers!

## Or with Local Server

```bash
# Installation
npm install

# Node.js http-server
npx http-server public -p 8000

# Then open browser: http://localhost:8000
```

## Run Tests

```bash
npm test          # All tests
npm run demo      # Demo script
```

## How does it work?

1. You see: **Pot: 45, Bet: 22.5 (50%)**
2. Question: "What are your pot odds?" or "What is your MDF?"
3. Your answer: e.g., `25` (for 25%)
4. Instant feedback: ✓ Correct or ✗ Wrong (with correct answer)
5. Auto-Advance: After 1.5s, next question appears

## Features

- ✓ Pot Odds Training
- ✓ MDF Training
- ✓ Random Mix Mode
- ✓ Stats Tracking (saved in browser)
- ✓ Custom Settings (Min/Max Pot)
- ✓ Standard PLO Bet Sizes (33%, 50%, 75%, 100%)
- ✓ Tolerance: ±0.5% is accepted
- ✓ Quick Reference with formulas

## The Most Important Formulas

**Pot Odds**:
```
(Bet / (Pot + 2×Bet)) × 100
```

**MDF**:
```
(1 - (Bet / (Pot + Bet))) × 100
```

## Quick Overview

| Bet Size | MDF  | Pot Odds |
|----------|------|----------|
| 33% pot  | 75%  | 20%      |
| 50% pot  | 67%  | 25%      |
| 75% pot  | 57%  | 30%      |
| 100% pot | 50%  | 33%      |

## Good luck with your training!
