import { describe, it, expect, beforeEach } from 'vitest';
import { MathEngine } from '../../../src/js/core/math-engine.js';

describe('MathEngine', () => {
  beforeEach(() => {
    MathEngine.setAngleMode('deg');
  });

  describe('factorial', () => {
    it('should calculate factorial of 0', () => {
      expect(MathEngine.factorial(0)).toBe(1);
    });

    it('should calculate factorial of 5', () => {
      expect(MathEngine.factorial(5)).toBe(120);
    });

    it('should throw error for negative numbers', () => {
      expect(() => MathEngine.factorial(-1)).toThrow();
    });

    it('should throw error for non-integers', () => {
      expect(() => MathEngine.factorial(3.5)).toThrow();
    });
  });

  describe('isPrime', () => {
    it('should identify prime numbers', () => {
      expect(MathEngine.isPrime(2)).toBe(true);
      expect(MathEngine.isPrime(7)).toBe(true);
      expect(MathEngine.isPrime(13)).toBe(true);
    });

    it('should identify non-prime numbers', () => {
      expect(MathEngine.isPrime(1)).toBe(false);
      expect(MathEngine.isPrime(4)).toBe(false);
      expect(MathEngine.isPrime(9)).toBe(false);
    });
  });

  describe('trigonometric functions', () => {
    it('should calculate sin in degrees', () => {
      MathEngine.setAngleMode('deg');
      expect(MathEngine.sin(0)).toBeCloseTo(0);
      expect(MathEngine.sin(90)).toBeCloseTo(1);
    });

    it('should calculate sin in radians', () => {
      MathEngine.setAngleMode('rad');
      expect(MathEngine.sin(0)).toBeCloseTo(0);
      expect(MathEngine.sin(Math.PI / 2)).toBeCloseTo(1);
    });
  });
});