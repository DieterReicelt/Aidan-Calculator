export class Parser {
  static tokenize(str) {
    const tokens = [];
    const regex = /\d+\.\d+|\d+|[a-z]+|\+|\-|\*|\/|\^|\(|\)|\,|\pi|e|tau|phi/g;
    let m;
    while ((m = regex.exec(str)) !== null) {
      tokens.push(m[0]);
    }
    const normalized = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const prev = normalized[normalized.length - 1];
      const isUnaryMinus = token === '-' && (
        i === 0 ||
        prev === '(' ||
        prev === ',' ||
        ['+', '-', '*', '/', '^'].includes(prev)
      );
      if (isUnaryMinus) normalized.push('u-');
      else normalized.push(token);
    }
    return normalized;
  }

  static shuntingYard(tokens) {
    return this.shuntingYardDetailed(tokens).postfix;
  }

  static shuntingYardDetailed(tokens) {
    const outputQueue = [];
    const operatorStack = [];
    const steps = [];
    const operators = {
      'u-': { prec: 5, assoc: 'R' },
      '^': { prec: 4, assoc: 'R' },
      '*': { prec: 3, assoc: 'L' },
      '/': { prec: 3, assoc: 'L' },
      '+': { prec: 2, assoc: 'L' },
      '-': { prec: 2, assoc: 'L' }
    };
    const functions = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'fact'];
    const pushStep = (token) => {
      steps.push({
        token,
        operatorStack: [...operatorStack],
        outputQueue: [...outputQueue]
      });
    };

    tokens.forEach(token => {
      if (!isNaN(token)) {
        outputQueue.push(token);
        pushStep(token);
      } else if (['pi', 'e', 'tau', 'phi'].includes(token)) {
        outputQueue.push(token);
        pushStep(token);
      } else if (functions.includes(token)) {
        operatorStack.push(token);
        pushStep(token);
      } else if (token === '(') {
        operatorStack.push(token);
        pushStep(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop());
          pushStep('pop');
        }
        if (operatorStack.length === 0) throw new Error("Mismatched parentheses");
        operatorStack.pop();
        pushStep(')');
        if (operatorStack.length > 0 && functions.includes(operatorStack[operatorStack.length - 1])) {
          outputQueue.push(operatorStack.pop());
          pushStep('func-pop');
        }
      } else if (operators[token]) {
        const o1 = token;
        while (operatorStack.length > 0) {
          const o2 = operatorStack[operatorStack.length - 1];
          if (!operators[o2]) break;
          if ((operators[o1].assoc === 'L' && operators[o1].prec <= operators[o2].prec) ||
              (operators[o1].assoc === 'R' && operators[o1].prec < operators[o2].prec)) {
            outputQueue.push(operatorStack.pop());
            pushStep('pop');
          } else {
            break;
          }
        }
        operatorStack.push(o1);
        pushStep(token);
      }
    });

    while (operatorStack.length > 0) {
      const op = operatorStack.pop();
      if (op === '(' || op === ')') throw new Error("Mismatched parentheses");
      outputQueue.push(op);
      pushStep('drain');
    }
    return { postfix: outputQueue, steps };
  }
}