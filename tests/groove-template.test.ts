import { test, expect } from 'bun:test';
import {
  GROOVE_ROWS,
  GROOVE_STEPS,
  GROOVE_TEMPLATES,
  isValidGrooveTemplate,
  grooveNames,
  applyGrooveTemplate
} from '../src/domain/groove-template.ts';

test('four curated groove templates are valid 4x16', () => {
  expect(GROOVE_TEMPLATES.length).toBe(4);

  for (const template of GROOVE_TEMPLATES) {
    expect(isValidGrooveTemplate(template)).toBe(true);
  }
});

test('grooveNames lists all templates', () => {
  const names = grooveNames();

  expect(names.length).toBe(4);
  expect(names).toContain('Backbeat');
  expect(names).toContain('Half-Time');
});

test('isValidGrooveTemplate rejects malformed templates', () => {
  expect(isValidGrooveTemplate(null as unknown as never)).toBe(false);
  expect(isValidGrooveTemplate({ name: '', accents: [] })).toBe(false);
  expect(isValidGrooveTemplate({ name: 'x', accents: [[true]] } as never)).toBe(false);
});

test('applyGrooveTemplate replace overwrites accents', () => {
  const current = [
    new Array(16).fill(true),
    new Array(16).fill(true),
    new Array(16).fill(true),
    new Array(16).fill(true)
  ];
  const template = GROOVE_TEMPLATES[1];
  const result = applyGrooveTemplate(current, template, 'replace');

  expect(result).toEqual(template.accents);
});

test('applyGrooveTemplate or unions accents', () => {
  const current = [
    new Array(16).fill(true),
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false)
  ];
  const template = GROOVE_TEMPLATES[0];
  const result = applyGrooveTemplate(current, template, 'or');

  expect(result[0].every(function (c) { return c === true; })).toBe(true);
});

test('applyGrooveTemplate and intersects accents', () => {
  const current = [
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false)
  ];
  const template = GROOVE_TEMPLATES[0];
  const result = applyGrooveTemplate(current, template, 'and');

  expect(result[0].every(function (c) { return c === false; })).toBe(true);
});

test('applyGrooveTemplate guards invalid templates', () => {
  const current = [[true], [false], [true], [false]];
  const result = applyGrooveTemplate(current, { name: 'bad', accents: [] }, 'replace');

  expect(result).toEqual(current);
});
