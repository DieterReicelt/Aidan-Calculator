export class CalculatorError extends Error {
  constructor(message, code, userMessage) {
    super(message);
    this.name = 'CalculatorError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

export const ERROR_CODES = {
  DIVISION_BY_ZERO: 'DIV_ZERO',
  INVALID_INPUT: 'INVALID_INPUT',
  DOMAIN_ERROR: 'DOMAIN_ERROR',
  SYNTAX_ERROR: 'SYNTAX_ERROR',
  OVERFLOW: 'OVERFLOW'
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.DIVISION_BY_ZERO]: 'Cannot divide by zero',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [ERROR_CODES.DOMAIN_ERROR]: 'Input outside valid range',
  [ERROR_CODES.SYNTAX_ERROR]: 'Expression syntax error',
  [ERROR_CODES.OVERFLOW]: 'Result too large to display'
};

export class ErrorHandler {
  static handle(error, context = '') {
    console.error(`[${context}]`, error);
    
    if (error instanceof CalculatorError) {
      return error.userMessage || ERROR_MESSAGES[error.code];
    }
    
    if (error.message && error.message.includes('Mismatched parentheses')) {
      return ERROR_MESSAGES[ERROR_CODES.SYNTAX_ERROR] + ': Mismatched parentheses';
    }
    
    return 'An unexpected error occurred';
  }

  static createDivisionByZeroError() {
    return new CalculatorError(
      'Division by zero attempted',
      ERROR_CODES.DIVISION_BY_ZERO,
      'Cannot divide by zero. Please check your expression.'
    );
  }
}