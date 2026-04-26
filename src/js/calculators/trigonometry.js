import { MathEngine } from '../core/math-engine.js';

export class TrigonometryCalculator {
  constructor() {
    this.angleInput = document.getElementById('trig-angle');
    this.unitSelect = document.getElementById('trig-unit');
    this.resSin = document.getElementById('t-res-sin');
    this.resCos = document.getElementById('t-res-cos');
    this.resTan = document.getElementById('t-res-tan');
    
    this.point = document.getElementById('trig-point');
    this.lineHyp = document.getElementById('trig-line-hyp');
    this.lineCos = document.getElementById('trig-line-cos');
    this.lineSin = document.getElementById('trig-line-sin');
    
    this.coordX = document.getElementById('coord-x');
    this.coordY = document.getElementById('coord-y');
    this.coordR = document.getElementById('coord-r');
    this.coordTheta = document.getElementById('coord-theta');
    
    this.init();
  }

  init() {
    this.updateTrig();
    
    window.addEventListener('tab-switched', (e) => {
      if (e.detail.name === 'trig') this.updateTrig();
    });
  }

  updateTrig() {
    const angleVal = parseFloat(this.angleInput?.value) || 0;
    const unit = this.unitSelect?.value || 'deg';
    
    // Set engine mode temporarily for calculation
    const oldMode = MathEngine.getAngleMode();
    MathEngine.setAngleMode(unit);
    
    const s = MathEngine.sin(angleVal);
    const c = MathEngine.cos(angleVal);
    const t = MathEngine.tan(angleVal);
    
    MathEngine.setAngleMode(oldMode);
    
    const rad = unit === 'deg' ? angleVal * Math.PI / 180 : angleVal;

    // Update Results
    if (this.resSin) this.resSin.textContent = s.toFixed(4);
    if (this.resCos) this.resCos.textContent = c.toFixed(4);
    if (this.resTan) {
      this.resTan.textContent = Math.abs(t) > 1e10 ? "∞" : t.toFixed(4);
    }

    // Update SVG (Radius is 50 in the SVG)
    const px = c * 50;
    const py = -s * 50; // SVG y is inverted
    
    if (this.point) {
      this.point.setAttribute('cx', px);
      this.point.setAttribute('cy', py);
    }
    if (this.lineHyp) {
      this.lineHyp.setAttribute('x2', px);
      this.lineHyp.setAttribute('y2', py);
    }
    if (this.lineCos) {
      this.lineCos.setAttribute('x2', px);
    }
    if (this.lineSin) {
      this.lineSin.setAttribute('x1', px);
      this.lineSin.setAttribute('y1', 0);
      this.lineSin.setAttribute('x2', px);
      this.lineSin.setAttribute('y2', py);
    }
  }

  rectToPolar() {
    const x = parseFloat(this.coordX?.value) || 0;
    const y = parseFloat(this.coordY?.value) || 0;
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x) * 180 / Math.PI;
    
    if (this.coordR) this.coordR.value = r.toFixed(2);
    if (this.coordTheta) this.coordTheta.value = theta.toFixed(2);
  }

  polarToRect() {
    const r = parseFloat(this.coordR?.value) || 0;
    const theta = parseFloat(this.coordTheta?.value) || 0;
    const x = r * Math.cos(theta * Math.PI / 180);
    const y = r * Math.sin(theta * Math.PI / 180);
    
    if (this.coordX) this.coordX.value = x.toFixed(2);
    if (this.coordY) this.coordY.value = y.toFixed(2);
  }
}