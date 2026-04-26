export class BaseConverterCalculator {
  constructor() {
    this.inputs = {
      dec: document.getElementById('base-dec'),
      bin: document.getElementById('base-bin'),
      hex: document.getElementById('base-hex'),
      oct: document.getElementById('base-oct')
    };
    this.explanationEl = document.getElementById('base-explanation');
  }

  syncBase(type) {
    const el = this.inputs[type];
    if (!el) return;
    
    let val;
    try {
      if (type === 'dec') val = parseInt(el.value, 10);
      else if (type === 'bin') val = parseInt(el.value, 2);
      else if (type === 'hex') val = parseInt(el.value, 16);
      else if (type === 'oct') val = parseInt(el.value, 8);
      
      if (isNaN(val)) return;
      
      if (type !== 'dec') this.inputs.dec.value = val.toString(10);
      if (type !== 'bin') this.inputs.bin.value = val.toString(2);
      if (type !== 'hex') this.inputs.hex.value = val.toString(16).toUpperCase();
      if (type !== 'oct') this.inputs.oct.value = val.toString(8);
      
      this.updateExplanation(val);
    } catch(e) {
      console.error('Base conversion error', e);
    }
  }

  updateExplanation(n) {
    if (!this.explanationEl) return;
    const bin = n.toString(2);
    let exp = n + " = ";
    for (let i = 0; i < bin.length; i++) {
      const bit = bin[bin.length - 1 - i];
      if (bit === '1') {
        exp += `(1 × 2<sup>${i}</sup>) + `;
      } else {
        exp += `(0 × 2<sup>${i}</sup>) + `;
      }
    }
    this.explanationEl.innerHTML = exp.slice(0, -3);
  }
}