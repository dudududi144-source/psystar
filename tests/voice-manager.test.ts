import { test, expect } from 'bun:test';
import { VoiceManager } from '../src/engine/voice-manager.ts';

test('voice manager allocates free slots first', () => {
  const vm = new VoiceManager(2);

  expect(vm.allocate(0)).toBe(0);
  expect(vm.allocate(1)).toBe(1);
  expect(vm.activeCount()).toBe(2);
});

test('voice manager steals oldest when full', () => {
  const vm = new VoiceManager(2);

  vm.allocate(0);
  vm.allocate(1);
  const stolen = vm.allocate(2);

  expect(stolen).toBe(0);
  expect(vm.activeCount()).toBe(2);
});

test('voice manager releases and counts correctly', () => {
  const vm = new VoiceManager(3);

  vm.allocate(0);
  vm.allocate(1);
  vm.release(0);

  expect(vm.activeCount()).toBe(1);

  vm.releaseAll();
  expect(vm.activeCount()).toBe(0);
  expect(vm.capacityOf()).toBe(3);
});
