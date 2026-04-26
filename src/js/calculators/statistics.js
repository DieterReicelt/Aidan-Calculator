import { CONFIG } from "../config.js";

export class StatisticsCalculator {
  constructor() {
    this.inputEl = document.getElementById("stats-input");
    this.graphTypeSelect = document.getElementById("stats-graph-type");
    this.resultsEl = document.getElementById("stats-results");
    this.lessonEl = document.getElementById("stats-lesson");
    this.canvas = document.getElementById("stats-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
  }

  keypadType(key) {
    if (!this.inputEl) return;
    if (key === "AC") {
      this.clear();
      return;
    }
    if (key === "B") this.inputEl.value = this.inputEl.value.slice(0, -1);
    else this.inputEl.value += key;
    this.calculate();
  }

  calculate() {
    if (!this.inputEl || !this.resultsEl || !this.canvas || !this.ctx) return;

    const input = this.inputEl.value;
    const graphType = this.graphTypeSelect?.value || "bar";
    const nums = input.split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

    if (nums.length === 0) {
      this.resultsEl.innerHTML = "";
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    const rawNums = [...nums];
    nums.sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const median = nums.length % 2 === 0 ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2 : nums[Math.floor(nums.length / 2)];
    const range = nums[nums.length - 1] - nums[0];

    this.resultsEl.innerHTML = `
      <strong>Count:</strong> ${nums.length} &nbsp; <strong>Sum:</strong> ${sum}<br>
      <strong>Mean (Avg):</strong> ${mean.toFixed(2)} &nbsp; <strong>Median:</strong> ${median}<br>
      <strong>Min / Max:</strong> ${nums[0]} / ${nums[nums.length - 1]} &nbsp; <strong>Range:</strong> ${range}
    `;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Chart Constants
    const padL = CONFIG.CANVAS.STATS.PADDING.LEFT;
    const padR = CONFIG.CANVAS.STATS.PADDING.RIGHT;
    const padT = CONFIG.CANVAS.STATS.PADDING.TOP;
    const padB = CONFIG.CANVAS.STATS.PADDING.BOTTOM;
    const chartW = CONFIG.CANVAS.STATS.WIDTH - padL - padR;
    const chartH = CONFIG.CANVAS.STATS.HEIGHT - padT - padB;
    const maxVal = Math.max(...rawNums, 1);
    const colors = CONFIG.COLORS.CHART;

    if (graphType !== "pie") {
      // Draw Axes for Bar/Line
      this.ctx.strokeStyle = "#333";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(padL, padT);
      this.ctx.lineTo(padL, this.canvas.height - padB);
      this.ctx.lineTo(this.canvas.width - padR, this.canvas.height - padB);
      this.ctx.stroke();

      // Y-Axis Ticks
      this.ctx.fillStyle = "#666";
      this.ctx.font = "10px sans-serif";
      this.ctx.textAlign = "right";
      const yTicks = 4;
      for (let i = 0; i <= yTicks; i++) {
        const val = (maxVal / yTicks) * i;
        const y = this.canvas.height - padB - (val / maxVal) * chartH;
        this.ctx.fillText(val.toFixed(1), padL - 5, y + 3);
        this.ctx.beginPath();
        this.ctx.moveTo(padL - 3, y);
        this.ctx.lineTo(padL, y);
        this.ctx.stroke();
      }
    }

    if (graphType === "bar") {
      const barWidth = (chartW / rawNums.length) - 4;
      rawNums.forEach((n, i) => {
        const h = (n / maxVal) * chartH;
        const x = padL + i * (barWidth + 4) + 2;
        const y = this.canvas.height - padB - h;
        this.ctx.fillStyle = colors[i % colors.length];
        this.ctx.fillRect(x, y, barWidth, h);
        this.ctx.fillStyle = "#333";
        this.ctx.font = "bold 10px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(n, x + barWidth / 2, y - 5);
        this.ctx.fillStyle = "#888";
        this.ctx.font = "10px sans-serif";
        this.ctx.fillText(i + 1, x + barWidth / 2, this.canvas.height - 10);
      });
    } else if (graphType === "line") {
      const step = chartW / (rawNums.length > 1 ? rawNums.length - 1 : 1);
      this.ctx.strokeStyle = "#0055aa";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      rawNums.forEach((n, i) => {
        const x = padL + i * (rawNums.length > 1 ? step : chartW / 2);
        const y = this.canvas.height - padB - (n / maxVal) * chartH;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();
      rawNums.forEach((n, i) => {
        const x = padL + i * (rawNums.length > 1 ? step : chartW / 2);
        const y = this.canvas.height - padB - (n / maxVal) * chartH;
        this.ctx.fillStyle = "#b22222";
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = "#333";
        this.ctx.font = "bold 10px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(n, x, y - 10);
        this.ctx.fillStyle = "#888";
        this.ctx.font = "10px sans-serif";
        this.ctx.fillText(i + 1, x, this.canvas.height - 10);
      });
    } else if (graphType === "pie") {
      let total = rawNums.reduce((a, b) => a + b, 0);
      let currentAngle = -0.5 * Math.PI;
      const centerX = 120, centerY = 75, radius = 60;

      rawNums.forEach((n, i) => {
        const sliceAngle = (n / total) * 2 * Math.PI;
        this.ctx.fillStyle = colors[i % colors.length];
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        this.ctx.closePath();
        this.ctx.fill();

        // Labels inside slices if large enough
        if (sliceAngle > 0.15) {
          const labelAngle = currentAngle + sliceAngle / 2;
          const lx = centerX + Math.cos(labelAngle) * (radius * 0.7);
          const ly = centerY + Math.sin(labelAngle) * (radius * 0.7);
          this.ctx.fillStyle = "white";
          this.ctx.font = "bold 9px sans-serif";
          this.ctx.textAlign = "center";
          this.ctx.fillText(Math.round(n / total * 100) + "%", lx, ly);
        }
        currentAngle += sliceAngle;
      });

      // Legend
      this.resultsEl.innerHTML += `<div style="margin-top:10px; display:grid; grid-template-columns: 1fr 1fr; gap:5px;">` +
        rawNums.map((n, i) => `<div style="font-size:0.75rem; display:flex; align-items:center;"><span style="display:inline-block; width:10px; height:10px; background:${colors[i % colors.length]}; margin-right:5px;"></span> #${i + 1}: <strong>${n}</strong></div>`).join("") +
        `</div>`;
    }

    if (this.lessonEl) {
      this.lessonEl.innerHTML = `<div class="lesson-title">Stats breakdown</div>1. Sorted list: [${nums.join(", ")}]<br>2. Mean = ${sum}/${nums.length} = ${mean.toFixed(2)}`;
      this.lessonEl.classList.add("visible");
    }
  }

  clear() {
    if (this.inputEl) this.inputEl.value = "";
    if (this.resultsEl) this.resultsEl.innerHTML = "";
    if (this.lessonEl) {
      this.lessonEl.innerHTML = "";
      this.lessonEl.classList.remove("visible");
    }
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  savePDF() {
    if (!this.inputEl?.value.trim()) {
      alert("Please enter some data first!");
      return;
    }
    document.body.classList.add("print-stats-only");
    window.print();
    document.body.classList.remove("print-stats-only");
  }
}