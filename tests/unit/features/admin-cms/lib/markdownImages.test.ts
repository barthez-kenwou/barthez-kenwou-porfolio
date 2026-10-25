import { describe, expect, it } from 'vitest';
import {
  headingMatchKey,
  syncMissingImagesFromSource,
  mirrorImageIntoSibling,
} from '@/features/admin-cms/lib/markdownImages';

describe('headingMatchKey', () => {
  it('matches numbered sections across locales', () => {
    expect(headingMatchKey('2.1 La vue d’ensemble')).toBe('n:2.1');
    expect(headingMatchKey('2.1 Overview')).toBe('n:2.1');
  });

  it('matches PART labels', () => {
    expect(headingMatchKey('Partie 1 — Fondations')).toBe('part:1');
    expect(headingMatchKey('PART 1: Foundations')).toBe('part:1');
  });
});

describe('syncMissingImagesFromSource', () => {
  it('places images under matching numbered headings instead of appending', () => {
    const source = `## 1. Intro FR

![a](https://cdn.example/a.webp)

Texte FR.

## 2. Suite FR

![b](https://cdn.example/b.webp)
`;
    const target = `## 1. Intro EN

Text EN.

## 2. Next EN

More EN.
`;
    const { next, added } = syncMissingImagesFromSource(source, target);
    expect(added).toBe(2);
    const idxA = next.indexOf('![a](https://cdn.example/a.webp)');
    const idxB = next.indexOf('![b](https://cdn.example/b.webp)');
    const idxH2 = next.indexOf('## 2. Next EN');
    expect(idxA).toBeGreaterThan(-1);
    expect(idxB).toBeGreaterThan(-1);
    expect(idxA).toBeLessThan(idxH2);
    expect(idxB).toBeGreaterThan(idxH2);
  });

  it('relocates images previously dumped at the end', () => {
    const source = `## 1. Intro FR

![a](https://cdn.example/a.webp)

Fin FR.
`;
    const target = `## 1. Intro EN

Text EN.

Thanks for reading.

![a](https://cdn.example/a.webp)
`;
    const { next, moved } = syncMissingImagesFromSource(source, target);
    expect(moved).toBe(1);
    const idxA = next.indexOf('![a](https://cdn.example/a.webp)');
    const idxThanks = next.indexOf('Thanks for reading');
    expect(idxA).toBeGreaterThan(-1);
    expect(idxA).toBeLessThan(idxThanks);
  });
});

describe('mirrorImageIntoSibling', () => {
  it('mirrors near the same section as the cursor', () => {
    const source = `## 2.1 Section FR

Paragraph under heading.
`;
    const cursor = source.indexOf('Paragraph');
    const target = `## 2.1 Section EN

English paragraph.

## 3. Other EN

Other.
`;
    const { next, added } = mirrorImageIntoSibling(source, cursor, target, {
      alt: 'Banner',
      url: 'https://cdn.example/banner.webp',
    });
    expect(added).toBe(1);
    const idxImg = next.indexOf('![Banner](https://cdn.example/banner.webp)');
    const idxOther = next.indexOf('## 3. Other EN');
    expect(idxImg).toBeGreaterThan(-1);
    expect(idxImg).toBeLessThan(idxOther);
  });
});
