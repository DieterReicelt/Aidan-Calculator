import { CONFIG } from '../config.js';

export class GrapherCalculator {
  constructor() {
    this.canvas = document.getElementById('graph-canvas');
    this.presetSelect = document.getElementById('graph-preset');
    this.sliderA = document.getElementById('graph-a');
    this.sliderB = document.getElementById('graph-b');
    this.sliderC = document.getElementById('graph-c');
    this.valA = document.getElementById('val-a');
    this.valB = document.getElementById('val-b');
    this.valC = document.getElementById('val-c');
    
    this.init();
  }

  init() {
    if (this.canvas) {
      this.render();
    }
    
    window.addEventListener('tab-switched', (e) => {
      if (e.detail.name === 'graph') this.render();
    });
  }

  render() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    const a = parseFloat(this.sliderA?.value || 1);
    const b = parseFloat(this.sliderB?.value || 0);
    const c = parseFloat(this.sliderC?.value || 0);
    const preset = this.presetSelect?.value || 'linear';
    
    if (this.valA) this.valA.textContent = a;
    if (this.valB) this.valB.textContent = b;
    if (this.valC) this.valC.textContent = c;

    // Clear and draw grid
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const scale = CONFIG.CANVAS.GRAPH.SCALE;

    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    for(let x=0; x<this.canvas.width; x+=scale) { ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); }
    for(let y=0; y<this.canvas.height; y+=scale) { ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y); }
    ctx.stroke();

    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(this.canvas.width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, this.canvas.height);
    ctx.stroke();

    // Draw function
    ctx.strokeStyle = '#b22222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < this.canvas.width; px++) {
      const x = (px - centerX) / scale;
      let y;
      if (preset === 'linear') y = a * x + b;
      else if (preset === 'quad') y = a * x * x + b * x + c;
      else if (preset === 'sin') y = a * Math.sin(b * x + c);

      const py = centerY - (y * scale);
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
}