# Test Plan

## Automated tests

Run:

```bash
npm test
npm run build
```

`npm test` validates curriculum structure.
It also checks that every level has Picture Match data and default progress fields.

## Manual test checklist

### Core navigation
- [ ] Home screen loads.
- [ ] Start Quest opens map.
- [ ] First level is unlocked.
- [ ] Later levels are locked until stars are earned.
- [ ] Level menu opens.
- [ ] Back to map works.

### Game modes
For each level:
- [ ] Quiz works.
- [ ] Picture Match works.
- [ ] Memory works.
- [ ] Listen & Say works with fallback.
- [ ] Sentence Builder works.
- [ ] Stars are awarded.

### Progress
- [ ] Stars persist after refresh.
- [ ] Unlocked levels persist after refresh.
- [ ] Trophy room shows trophies.
- [ ] Reset progress works.

### Mobile
Test at 390 × 844 viewport:
- [ ] Buttons are large enough.
- [ ] Text is readable.
- [ ] No horizontal scroll.
- [ ] Memory cards are usable.
- [ ] Header score remains visible.

Also sanity-test at 360 × 740 viewport.

### Voice
- [ ] “Listen” button reads slowly.
- [ ] If speech recognition is supported, “I will say it” starts listening.
- [ ] If not supported, fallback still lets the child continue.

### Educational quality
- [ ] Text is A1-level.
- [ ] No long explanations.
- [ ] No harsh failure states.
- [ ] Croatian appears only as translation support.
