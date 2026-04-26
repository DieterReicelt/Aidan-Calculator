import { Parser } from '../core/parser.js';
import { Evaluator } from '../core/evaluator.js';
import { StorageManager } from '../utils/storage.js';
import { ErrorHandler } from '../utils/errors.js';
import { CONFIG } from '../config.js';

export class ScientificCalculator {
  constructor() {
    this.expr = "";
    this.history = StorageManager.getItem(CONFIG.STORAGE_KEYS.HISTORY, []);
    this.ans = 0;
    this.memory = 0;
    
    this.exprEl = document.getElementById('sci-expr');
    this.resEl = document.getElementById('sci-res');
    this.historyEl = document.getElementById('sci-history');
    
    this.updateDisplay();
    this.updateHistoryUI();
  }

  insertChar(c) {
    this.expr += c;
    this.updateDisplay();
  }

  insertConst(name) {
    const constants = {
      'pi': 'pi',
      'e': 'e',
      'tau': 'tau',
      'phi': 'phi'
    };
    this.expr += constants[name] || '';
    this.updateDisplay();
  }

  insertAns() {
    this.expr += String(this.ans);
    this.updateDisplay();
  }

  clear() {
    this.expr = "";
    this.updateDisplay();
    if (this.resEl) this.resEl.textContent = "0";
  }

  backspace() {
    this.expr = this.expr.slice(0, -1);
    this.updateDisplay();
  }

  calculate() {
    if (!this.expr) return;
    try {
      const tokens = Parser.tokenize(this.expr);
      const postfix = Parser.shuntingYard(tokens);
      let res = Evaluator.evaluateRPN(postfix);
      
      if (!isFinite(res)) throw new Error("Result is not finite");
      
      res = parseFloat(res.toFixed(CONFIG.DISPLAY.DECIMAL_PLACES));
      this.ans = res;
      
      this.addHistory(this.expr, res);
      
      if (this.resEl) this.resEl.textContent = res;
      if (this.exprEl) this.exprEl.textContent = this.expr + " =";
      
      this.expr = String(res);
    } catch (e) {
      if (this.resEl) this.resEl.textContent = ErrorHandler.handle(e, 'ScientificCalculator');
    }
  }

  addHistory(e, r) {
    this.history.unshift({ e, r });
    if (this.history.length > CONFIG.DISPLAY.MAX_HISTORY_ITEMS) {
      this.history.pop();
    }
    StorageManager.setItem(CONFIG.STORAGE_KEYS.HISTORY, this.history);
    this.updateHistoryUI();
  }

  updateDisplay() {
    if (this.exprEl) {
      this.exprEl.textContent = this.expr
        .replace(/pi/g, 'π')
        .replace(/tau/g, 'τ')
        .replace(/phi/g, 'φ')
        .replace(/\*\*/g, '^');
    }
    
    const lastToken = this.expr.split(/[\+\-\*\/\(]/).pop();
    if (this.resEl) {
      this.resEl.textContent = (lastToken && !isNaN(lastToken)) ? lastToken : "0";
    }
  }

  updateHistoryUI() {
    if (!this.historyEl) return;
    this.historyEl.innerHTML = this.history
      .map(i => `<div class="history-item">${i.e} = <strong>${i.r}</strong></div>`)
      .join('');
  }

  clearHistory() {
    this.history = [];
    StorageManager.removeItem(CONFIG.STORAGE_KEYS.HISTORY);
    this.updateHistoryUI();
  }
}