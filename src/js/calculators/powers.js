export class PowersCalculator {
  constructor() {
    this.baseInput = document.getElementById('pow-base');
    this.expInput = document.getElementById('pow-exp');
    this.visualResEl = document.getElementById('pow-visual-res');
    this.lessonEl = document.getElementById('pow-lesson');
    this.activeInput = null;
  }

  setActiveInput(el) {
    this.activeInput = el;
  }

  keypadType(key) {
    if (key === 'AC') {
      this.clear();
      return;
    }
    if (!this.activeInput) this.activeInput = this.baseInput;
    if (key === 'B') this.activeInput.value = this.activeInput.value.slice(0, -1);
    else this.activeInput.value += key;
    this.calculate();
  }

  calculate() {
    const baseStr = this.baseInput?.value;
    const expStr = this.expInput?.value;
    const base = parseFloat(baseStr);
    const exp = parseInt(expStr);
    
    if (baseStr === "" || expStr === "" || isNaN(base) || isNaN(exp)) {
      if (baseStr === "" && expStr === "") {
        if (this.visualResEl) this.visualResEl.innerHTML = "Enter values above";
        if (this.lessonEl) {
          this.lessonEl.innerHTML = "";
          this.lessonEl.classList.remove('visible');
        }
      }
      return;
    }

    const res = Math.pow(base, exp);
    if (this.visualResEl) {
      this.visualResEl.innerHTML = `${base}<sup>${exp}</sup> = <span style="color:#b22222;">${res}</span>`;
    }

    let breakdown = "";
    if (exp === 0) {
      breakdown = "Any non-zero number to the power of 0 is always 1.";
    } else if (exp < 0) {
      breakdown = `A negative exponent means reciprocal: 1 / (${base}<sup>${Math.abs(exp)}</sup>)`;
    } else if (exp > 100) {
      breakdown = `Result is very large. In expanded form, this is ${base} multiplied by itself ${exp} times.`;
    } else {
      let parts = [];
      for (let i = 0; i < exp; i++) parts.push(base);
      breakdown = `<strong>Expanded Form:</strong><br>${parts.join(' × ')} = ${res}`;
    }

    if (this.lessonEl) {
      this.lessonEl.innerHTML = `<div class="lesson-title">Power Breakdown</div>${breakdown}`;
      this.lessonEl.classList.add('visible');
    }
  }

  clear() {
    if (this.baseInput) this.baseInput.value = "";
    if (this.expInput) this.expInput.value = "";
    if (this.visualResEl) this.visualResEl.innerHTML = "Enter values above";
    if (this.lessonEl) {
      this.lessonEl.innerHTML = "";
      this.lessonEl.classList.remove('visible');
    }
  }
}