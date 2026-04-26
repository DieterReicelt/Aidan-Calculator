export class FactorsCalculator {
  constructor() {
    this.input = document.getElementById('fact-input');
    this.treeEl = document.getElementById('fact-tree');
    this.lessonEl = document.getElementById('fact-lesson');
  }

  keypadType(key) {
    if (key === 'AC') {
      this.clear();
      return;
    }
    if (this.input) {
      if (key === 'B') this.input.value = this.input.value.slice(0, -1);
      else this.input.value += key;
    }
    this.drawTree();
  }

  getFactors(val) {
    if (val < 2) return "";
    for (let i = 2; i <= Math.sqrt(val); i++) {
      if (val % i === 0) {
        return `<div style="display:flex; flex-direction:column; align-items:center; border-top:1px solid #ccc; margin-top:10px; padding-top:5px;">
          <div style="font-weight:bold; font-size:1.2rem;">${val}</div>
          <div style="display:flex; gap:40px; margin-top:10px;">
            <div style="color:#b22222;">${i}</div>
            <div>${this.getFactors(val / i) || `<span style="color:#b22222;">${val / i}</span>`}</div>
          </div>
        </div>`;
      }
    }
    return "";
  }

  drawTree() {
    const n = parseInt(this.input?.value);
    if (isNaN(n) || n < 2) {
      if (this.treeEl) this.treeEl.innerHTML = "";
      return;
    }
    
    const result = this.getFactors(n);
    if (this.treeEl) {
      this.treeEl.innerHTML = result || `<div style="font-size:1.5rem; color:#b22222;">${n} is a PRIME number</div>`;
    }
    
    let primes = [];
    let temp = n;
    for (let i = 2; i <= temp; i++) {
      while (temp % i === 0) { primes.push(i); temp /= i; }
    }
    if (this.lessonEl) {
      this.lessonEl.innerHTML = `<div class="lesson-title">Prime Factorization</div>${n} = ${primes.join(' × ')}`;
      this.lessonEl.classList.add('visible');
    }
  }

  clear() {
    if (this.input) this.input.value = "";
    if (this.treeEl) this.treeEl.innerHTML = "";
    if (this.lessonEl) {
      this.lessonEl.innerHTML = "";
      this.lessonEl.classList.remove('visible');
    }
  }
}