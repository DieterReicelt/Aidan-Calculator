import { MathEngine } from './math-engine.js';
import { CONFIG } from '../config.js';

export class Evaluator {
  static evaluateRPN(postfix) {
    const stack = [];
    const constants = { 
      pi: CONFIG.MATH.PI, 
      e: CONFIG.MATH.E, 
      tau: CONFIG.MATH.TAU, 
      phi: CONFIG.MATH.PHI 
    };

    postfix.forEach(token => {
      if (!isNaN(token)) {
        stack.push(parseFloat(token));
      } else if (constants[token]) {
        stack.push(constants[token]);
      } else {
        const ops = {
          '+': (a, b) => a + b,
          '-': (a, b) => a - b,
          '*': (a, b) => a * b,
          '/': (a, b) => {
            if (b === 0) throw new Error("Cannot divide by 0");
            return a / b;
          },
          '^': (a, b) => Math.pow(a, b)
        };
        const funcs = {
          'sin': (a) => MathEngine.sin(a),
          'cos': (a) => MathEngine.cos(a),
          'tan': (a) => MathEngine.tan(a),
          'sqrt': (a) => {
            if (a < 0) throw new Error("sqrt needs non-negative");
            return Math.sqrt(a);
          },
          'log': (a) => {
            if (a <= 0) throw new Error("log needs value > 0");
            return Math.log10(a);
          },
          'ln': (a) => {
            if (a <= 0) throw new Error("ln needs value > 0");
            return Math.log(a);
          },
          'abs': (a) => Math.abs(a),
          'fact': (a) => MathEngine.factorial(a)
        };

        if (token === 'u-') {
          if (stack.length < 1) throw new Error("Unary operator missing operand");
          const a = stack.pop();
          if (!isFinite(a)) throw new Error("Invalid unary operand");
          stack.push(-a);
        } else if (ops[token]) {
          if (stack.length < 2) throw new Error("Operator missing operand");
          const b = stack.pop();
          const a = stack.pop();
          const value = ops[token](a, b);
          if (!isFinite(value)) throw new Error("Invalid arithmetic result");
          stack.push(value);
        } else if (funcs[token]) {
          if (stack.length < 1) throw new Error("Function missing operand");
          const a = stack.pop();
          const value = funcs[token](a);
          if (!isFinite(value)) throw new Error("Invalid function result");
          stack.push(value);
        } else {
          throw new Error("Unknown token");
        }
      }
    });
    if (stack.length !== 1 || !isFinite(stack[0])) throw new Error("Malformed expression");
    return stack[0];
  }
}