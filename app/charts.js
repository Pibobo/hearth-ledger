// Hearth Ledger — hand-rolled SVG charts. No libraries, no network.
function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function fmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Donut of spending by category. slices: [{label, value, color}]
export function donutChart(slices, size = 220) {
  const svg = svgEl("svg", {
    viewBox: `0 0 ${size} ${size}`, width: size, height: size,
    role: "img", "aria-label": "Spending by category",
  });
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  let angle = -Math.PI / 2;
  for (const s of slices) {
    const frac = s.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const path = svgEl("path", {
      d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z`,
      fill: s.color, stroke: "#faf7f2", "stroke-width": 2,
    });
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `${s.label}: ${fmt(s.value)}`;
    path.appendChild(title);
    svg.appendChild(path);
  }
  const center = svgEl("text", {
    x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#1f2937",
  });
  center.textContent = fmt(total);
  const sub = svgEl("text", {
    x: cx, y: cy + 18, "text-anchor": "middle", "font-size": 11, fill: "#6b7280",
  });
  sub.textContent = "spent in November";
  svg.appendChild(center);
  svg.appendChild(sub);
  return svg;
}

// Grouped bars: income vs spending per month. rows: [{label, income, spending}]
export function barsChart(rows, width = 560, height = 240) {
  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`, width: "100%", height: height,
    style: "width:100%;height:auto",
    role: "img", "aria-label": "Income versus spending by month",
  });
  const padL = 44, padB = 28, padT = 14;
  const max = Math.max(...rows.flatMap((r) => [r.income, r.spending])) * 1.1;
  const innerW = width - padL - 8, innerH = height - padT - padB;
  const y = (v) => padT + innerH - (v / max) * innerH;
  for (let i = 0; i <= 4; i++) {
    const v = (max / 1.1 / 4) * i;
    const line = svgEl("line", {
      x1: padL, x2: width - 8, y1: y(v), y2: y(v),
      stroke: "#e5e0d8", "stroke-width": 1,
    });
    svg.appendChild(line);
    const lab = svgEl("text", {
      x: padL - 6, y: y(v) + 4, "text-anchor": "end", "font-size": 10, fill: "#6b7280",
    });
    lab.textContent = "$" + Math.round(v / 1000) + "k";
    svg.appendChild(lab);
  }
  const slot = innerW / rows.length;
  const bw = Math.min(26, slot * 0.32);
  rows.forEach((r, i) => {
    const cx = padL + slot * i + slot / 2;
    const b1 = svgEl("rect", {
      x: cx - bw - 2, y: y(r.income), width: bw, height: y(0) - y(r.income),
      rx: 3, fill: "#1a5c4a",
    });
    const t1 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    t1.textContent = `${r.label} income ${fmt(r.income)}`;
    b1.appendChild(t1);
    const b2 = svgEl("rect", {
      x: cx + 2, y: y(r.spending), width: bw, height: y(0) - y(r.spending),
      rx: 3, fill: "#d97706",
    });
    const t2 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    t2.textContent = `${r.label} spending ${fmt(r.spending)}`;
    b2.appendChild(t2);
    svg.appendChild(b1);
    svg.appendChild(b2);
    const lab = svgEl("text", {
      x: cx, y: height - 8, "text-anchor": "middle", "font-size": 11, fill: "#4b5563",
    });
    lab.textContent = r.label;
    svg.appendChild(lab);
  });
  return svg;
}

// Thin trend line of monthly spending. rows: [{label, spending}]
export function trendChart(rows, width = 560, height = 120) {
  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`, width: "100%", height: height,
    style: "width:100%;height:auto",
    role: "img", "aria-label": "Spending trend",
  });
  const padL = 40, padR = 10, padT = 12, padB = 24;
  const vals = rows.map((r) => r.spending);
  const min = Math.min(...vals) * 0.9, max = Math.max(...vals) * 1.05;
  const x = (i) => padL + ((width - padL - padR) * i) / (rows.length - 1);
  const y = (v) => padT + ((height - padT - padB) * (max - v)) / (max - min);
  const pts = rows.map((r, i) => `${x(i).toFixed(1)},${y(r.spending).toFixed(1)}`).join(" ");
  const area = svgEl("polygon", {
    points: `${padL},${y(min)} ${pts} ${x(rows.length - 1)},${y(min)}`,
    fill: "#1a5c4a", opacity: 0.08,
  });
  svg.appendChild(area);
  const line = svgEl("polyline", {
    points: pts, fill: "none", stroke: "#1a5c4a", "stroke-width": 2.5,
    "stroke-linejoin": "round", "stroke-linecap": "round",
  });
  svg.appendChild(line);
  rows.forEach((r, i) => {
    const dot = svgEl("circle", { cx: x(i), cy: y(r.spending), r: 3.5, fill: "#d97706", stroke: "#faf7f2", "stroke-width": 1.5 });
    const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
    t.textContent = `${r.label}: ${fmt(r.spending)}`;
    dot.appendChild(t);
    svg.appendChild(dot);
    const lab = svgEl("text", {
      x: x(i), y: height - 6, "text-anchor": "middle", "font-size": 11, fill: "#4b5563",
    });
    lab.textContent = r.label;
    svg.appendChild(lab);
  });
  return svg;
}
