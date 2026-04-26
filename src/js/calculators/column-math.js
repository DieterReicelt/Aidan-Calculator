export class ColumnMathCalculator {
  constructor() {
    this.n1Input = document.getElementById('cm-n1');
    this.n2Input = document.getElementById('cm-n2');
    this.opSelect = document.getElementById('cm-op');
    this.gridEl = document.getElementById('cm-grid');
    this.lessonEl = document.getElementById('cm-lesson');
    this.placeholderEl = document.getElementById('cm-placeholder');
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
    if (!this.activeInput) this.activeInput = this.n1Input;
    if (key === 'B') this.activeInput.value = this.activeInput.value.slice(0, -1);
    else this.activeInput.value += key;
  }

  addCell(g, r, c, v, cls) {
    const el = document.createElement('div');
    el.className = 'cell ' + (cls || '');
    el.style.gridRow = r + 1;
    el.style.gridColumn = c + 1;
    el.textContent = v;
    g.appendChild(el);
  }

  solve() {
    const n1 = this.n1Input?.value, n2 = this.n2Input?.value, op = this.opSelect?.value;
    if (!n1 || !n2) return;
    
    if (this.gridEl) this.gridEl.innerHTML = "";
    if (this.lessonEl) {
      this.lessonEl.innerHTML = "";
      this.lessonEl.className = "lesson-box visible";
    }
    if (this.placeholderEl) this.placeholderEl.style.display = 'none';
    
    if (op === '/') { this.solveLongDivision(n1, n2); return; }
    if (op === '*') { this.solveLongMultiplication(n1, n2); return; }
    
    const s1 = n1.toString(), s2 = n2.toString(), len = Math.max(s1.length, s2.length), sc = 6;
    for (let i = 0; i < s1.length; i++) this.addCell(this.gridEl, 1, sc + len - s1.length + i, s1[i]);
    this.addCell(this.gridEl, 2, sc - 1, op);
    for (let i = 0; i < s2.length; i++) this.addCell(this.gridEl, 2, sc + len - s2.length + i, s2[i]);
    
    let ln = document.createElement('div');
    ln.className = 'sub-line';
    ln.style.gridRow = "3";
    ln.style.gridColumn = `${sc}/span ${len + 1}`;
    this.gridEl.appendChild(ln);
    
    let res = (op === '+' ? parseInt(n1) + parseInt(n2) : parseInt(n1) - parseInt(n2)), rs = res.toString();
    for (let i = 0; i < rs.length; i++) this.addCell(this.gridEl, 3, sc + len - rs.length + i, rs[i], 'cm-res');
    
    if (op === '+') {
      let c = 0;
      for (let i = 0; i < len; i++) {
        let d1 = parseInt(s1[s1.length - 1 - i] || 0), d2 = parseInt(s2[s2.length - 1 - i] || 0), sum = d1 + d2 + c;
        if (sum >= 10) { c = 1; this.addCell(this.gridEl, 0, sc + len - 1 - i, '1', 'cm-carry'); }
        else c = 0;
      }
    }
  }

  solveLongMultiplication(n1, n2) {
    const s1 = n1.toString(), s2 = n2.toString(), sc = 10, len = s1.length + s2.length;
    for (let i = 0; i < s1.length; i++) this.addCell(this.gridEl, 1, sc + len - s1.length + i, s1[i]);
    this.addCell(this.gridEl, 2, sc + len - s2.length - 1, '×');
    for (let i = 0; i < s2.length; i++) this.addCell(this.gridEl, 2, sc + len - s2.length + i, s2[i]);
    
    let row = 3;
    let ln = document.createElement('div');
    ln.className = 'sub-line';
    ln.style.gridRow = row;
    ln.style.gridColumn = `${sc}/span ${len + 2}`;
    this.gridEl.appendChild(ln);
    
    row++;
    for (let i = 0; i < s2.length; i++) {
      let digit = parseInt(s2[s2.length - 1 - i]), part = digit * parseInt(n1), ps = part.toString();
      for (let j = 0; j < ps.length; j++) this.addCell(this.gridEl, row, sc + len - ps.length - i + j, ps[j]);
      for (let j = 0; j < i; j++) this.addCell(this.gridEl, row, sc + len - i + j, '0', 'text-dim');
      row++;
    }
    
    if (s2.length > 1) {
      let ln2 = document.createElement('div');
      ln2.className = 'sub-line';
      ln2.style.gridRow = row;
      ln2.style.gridColumn = `${sc}/span ${len + 2}`;
      this.gridEl.appendChild(ln2);
      row++;
      let f = parseInt(n1) * parseInt(n2), fs = f.toString();
      for (let i = 0; i < fs.length; i++) this.addCell(this.gridEl, row, sc + len - fs.length + i, fs[i], 'cm-res');
    }
  }

  solveLongDivision(n1, n2) {
    let div = n1.toString(), sor = parseInt(n2), sc = n2.length + 1;
    if (!isFinite(sor) || sor === 0) {
      if (this.lessonEl) {
        this.lessonEl.innerHTML = "<div class='lesson-title'>Long Division</div>Cannot divide by 0.";
        this.lessonEl.className = "lesson-box visible";
      }
      return;
    }
    for (let i = 0; i < n2.length; i++) this.addCell(this.gridEl, 1, i, n2[i]);
    this.addCell(this.gridEl, 1, n2.length, '', 'ld-bracket-side');
    for (let i = 0; i < div.length; i++) this.addCell(this.gridEl, 1, sc + i, div[i], 'ld-bracket-top');
    
    let rem = 0, row = 2;
    for (let i = 0; i < div.length; i++) {
      rem = rem * 10 + parseInt(div[i]);
      let q = Math.floor(rem / sor);
      this.addCell(this.gridEl, 0, sc + i, q, 'ld-quotient');
      if (q > 0 || row > 2) {
        let mult = q * sor, ms = mult.toString();
        for (let j = 0; j < ms.length; j++) this.addCell(this.gridEl, row, sc + i - (ms.length - 1 - j), ms[j]);
        row++;
        let ln = document.createElement('div');
        ln.className = 'sub-line';
        ln.style.gridRow = row;
        ln.style.gridColumn = `${sc}/span ${div.length}`;
        this.gridEl.appendChild(ln);
        row++;
        rem -= mult;
        let rs = rem.toString();
        for (let j = 0; j < rs.length; j++) this.addCell(this.gridEl, row, sc + i - (rs.length - 1 - j), rs[j]);
        row++;
      }
    }
  }

  clear() {
    if (this.n1Input) this.n1Input.value = "";
    if (this.n2Input) this.n2Input.value = "";
    if (this.gridEl) this.gridEl.innerHTML = "";
    if (this.lessonEl) {
      this.lessonEl.innerHTML = "";
      this.lessonEl.classList.remove('visible');
    }
    if (this.placeholderEl) this.placeholderEl.style.display = 'block';
  }
}