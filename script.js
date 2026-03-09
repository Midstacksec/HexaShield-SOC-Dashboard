
const state = {
  threats: [
    { id: 1, sev: 'critical', type: 'Força Bruta SSH', src: '192.168.3.47', time: Date.now() - 10000 },
    { id: 2, sev: 'high', type: 'Flood SYN — Varredura de Porta', src: '45.148.10.22', time: Date.now() - 120000 },
    { id: 3, sev: 'high', type: 'Amplificação de DNS', src: '203.0.113.91', time: Date.now() - 480000 },
    { id: 4, sev: 'medium', type: 'Autenticação Suspeita', src: '10.0.2.15', time: Date.now() - 840000 },
    { id: 5, sev: 'medium', type: 'Exfiltração de Dados', src: '10.0.1.88', time: Date.now() - 1260000 },
    { id: 6, sev: 'low', type: 'Certificado TLS Expirado', src: 'vpn.interno', time: Date.now() - 3600000 },
    { id: 7, sev: 'low', type: 'Falha 2FA — 3× Tentativas', src: '10.0.3.201', time: Date.now() - 7200000 },
  ],
  rules: [
    { id: 1, action: 'allow', proto: 'HTTPS', desc: 'Tráfego web público', port: '443' },
    { id: 2, action: 'deny', proto: 'SSH', desc: 'Bloquear força bruta', port: '22' },
    { id: 3, action: 'allow', proto: 'VPN', desc: 'IPSec site-a-site', port: '500' },
    { id: 4, action: 'block', proto: 'ICMP', desc: 'Bloquear ping flood', port: '—' },
    { id: 5, action: 'allow', proto: 'DNS', desc: 'Resolvedor interno', port: '53' },
    { id: 6, action: 'deny', proto: 'Telnet', desc: 'Protocolo obsoleto', port: '23' },
  ],
  vpns: [
    { id: 1, name: 'SP-HQ ↔ SC-Filial', detail: 'IPSec / AES-256', status: 'up', uptime: '99.9%' },
    { id: 2, name: 'Pool Usuários Remotos', detail: 'SSL-VPN · 48 conectados', status: 'up', uptime: '99.8%' },
    { id: 3, name: 'SP-DR ↔ Cloud GCP', detail: 'Anomalia de latência', status: 'warn', uptime: '97.1%' },
    { id: 4, name: 'Túnel B2B Parceiro', detail: 'IKEv2 / SHA-256', status: 'up', uptime: '100%' },
    { id: 5, name: 'Nó de Monitoramento', detail: 'Coletor Nagios', status: 'up', uptime: '99.9%' },
  ],
  origins: [
    { flag: '🇨🇳', country: 'China', count: 1847 },
    { flag: '🇷🇺', country: 'Rússia', count: 1203 },
    { flag: '🇺🇸', country: 'Estados Unidos', count: 741 },
    { flag: '🇧🇷', country: 'Brasil', count: 498 },
    { flag: '🇩🇪', country: 'Alemanha', count: 297 },
  ],
  packets: 84200,
  nextId: 100,
  soundOn: false,
  filterSev: 'all',
  theme: 'dark',
};

// ══════════════════════════════════════════
// Aqui eu determinei o tempo
// ══════════════════════════════════════════
function tick() {
  const n = new Date(), p = v => String(v).padStart(2, '0');
  document.getElementById('clock').textContent = `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`;
}
tick(); setInterval(tick, 1000);

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'agora mesmo';
  if (s < 3600) return Math.floor(s / 60) + 'min atrás';
  if (s < 86400) return Math.floor(s / 3600) + 'h atrás';
  return Math.floor(s / 86400) + 'd atrás';
}


function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.getElementById('theme-btn');
  btn.textContent = state.theme === 'dark' ? '🌙' : '☀️';
  btn.classList.add('active-ring');
  setTimeout(() => btn.classList.remove('active-ring'), 300);
  sndClick();
  drawChart(); drawMap();
}

// ══════════════════════════════════════════
// Aqui eu atribui som ao projeto
// ══════════════════════════════════════════
let audioCtx = null;
function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, dur, vol = 0.12, delay = 0) {
  if (!state.soundOn) return;
  try {
    const ac = getAC();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type; o.frequency.setValueAtTime(freq, ac.currentTime + delay);
    g.gain.setValueAtTime(0.001, ac.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
    o.start(ac.currentTime + delay); o.stop(ac.currentTime + delay + dur + 0.05);
  } catch (e) { }
}


function sndClick() {
  if (!state.soundOn) return;
  playTone(900, 'sine', 0.06, 0.06);
}
function sndHover() {
  if (!state.soundOn) return;
  playTone(700, 'sine', 0.04, 0.04);
}


function sndSuccess() {
  playTone(523, 'sine', 0.12, 0.1);
  playTone(659, 'sine', 0.12, 0.1, 0.1);
  playTone(784, 'sine', 0.15, 0.1, 0.2);
}


function sndDelete() {
  playTone(220, 'sawtooth', 0.1, 0.1);
  playTone(160, 'sawtooth', 0.12, 0.08, 0.08);
}


function sndToast() {
  playTone(523, 'sine', 0.2, 0.08);
}


function sndThreat(sev) {
  if (sev === 'critical') {
    playTone(880, 'sawtooth', 0.1, 0.12);
    playTone(660, 'sawtooth', 0.1, 0.12, 0.12);
    playTone(440, 'sawtooth', 0.15, 0.14, 0.24);
  } else if (sev === 'high') {
    playTone(660, 'square', 0.08, 0.1);
    playTone(550, 'square', 0.1, 0.1, 0.1);
  } else {
    playTone(440, 'sine', 0.12, 0.07);
  }
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  const btn = document.getElementById('sound-btn');
  btn.textContent = state.soundOn ? '🔔' : '🔕';
  btn.classList.toggle('muted', !state.soundOn);
  btn.classList.add('active-ring');
  setTimeout(() => btn.classList.remove('active-ring'), 300);
  if (state.soundOn) {
    try { getAC().resume(); } catch (e) { }
    sndSuccess();
    showToast('Alertas sonoros ativados.');
  } else {
    showToast('Alertas sonoros silenciados.');
  }
}


function bindHoverSounds(parent) {
  parent.querySelectorAll('button,select,input,.threat-item,.rule-item,.vpn-item,.origin-row').forEach(el => {
    if (!el.dataset.hoverBound) {
      el.dataset.hoverBound = '1';
      el.addEventListener('mouseenter', () => sndHover());
    }
  });
}

// ══════════════════════════════════════════
// Os Filtros e pesquisa
// ══════════════════════════════════════════
function setFilter(f) {
  state.filterSev = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === f));
  applyFilter();
}
function applyFilter() {
  const q = document.getElementById('threat-search').value.toLowerCase();
  const items = document.querySelectorAll('#threat-list .threat-item');
  let vis = 0;
  items.forEach(el => {
    const ok = (state.filterSev === 'all' || el.dataset.sev === state.filterSev) && (!q || el.textContent.toLowerCase().includes(q));
    el.classList.toggle('hidden', !ok);
    if (ok) vis++;
  });
  let nr = document.getElementById('no-results-msg');
  if (!vis) {
    if (!nr) { nr = document.createElement('div'); nr.id = 'no-results-msg'; nr.className = 'no-results'; nr.textContent = 'Nenhuma ameaça encontrada.'; document.getElementById('threat-list').appendChild(nr); }
  } else if (nr) nr.remove();
}


const sevLabel = { critical: 'Crítico', high: 'Alto', medium: 'Médio', low: 'Baixo' };
function renderThreats(newId = null) {
  const list = document.getElementById('threat-list');
  list.innerHTML = '';
  [...state.threats].reverse().forEach(t => {
    const el = document.createElement('div');
    el.className = 'threat-item' + (t.id === newId ? ' new-entry' : '');
    el.dataset.sev = t.sev; el.dataset.id = t.id;
    el.innerHTML = `
      <div class="threat-glyph g-${t.sev}"></div>
      <div class="threat-info">
        <div class="threat-type">${t.type}</div>
        <div class="threat-src">${t.src}</div>
      </div>
      <span class="threat-seal ts-${t.sev}">${sevLabel[t.sev]}</span>
      <span class="threat-time">${timeAgo(t.time)}</span>
      <button class="threat-del" onclick="sndDelete();deleteThreat(${t.id})" title="Remover">✕</button>`;
    list.appendChild(el);
  });
  bindHoverSounds(list);
  applyFilter();
  updateStats();
}
function deleteThreat(id) {
  state.threats = state.threats.filter(t => t.id !== id);
  renderThreats(); showToast('Ameaça removida do registro.'); sndToast();
}


const actionLabel = { allow: 'Permitir', deny: 'Negar', block: 'Bloquear' };
function renderRules(newId = null) {
  const list = document.getElementById('rules-list'); list.innerHTML = '';
  state.rules.forEach(r => {
    const el = document.createElement('div');
    el.className = 'rule-item' + (r.id === newId ? ' new-entry' : '');
    el.innerHTML = `<span class="rule-action ra-${r.action}">${actionLabel[r.action]}</span><span class="rule-proto">${r.proto}</span><span class="rule-desc">${r.desc}</span><span class="rule-port">${r.port}</span><button class="rule-del" onclick="sndDelete();deleteRule(${r.id})" title="Remover">✕</button>`;
    list.appendChild(el);
  });
  bindHoverSounds(list);
}
function deleteRule(id) { state.rules = state.rules.filter(r => r.id !== id); renderRules(); showToast('Regra revogada.'); sndToast(); }


function renderVPNs(newId = null) {
  const list = document.getElementById('vpn-list'); list.innerHTML = '';
  state.vpns.forEach(v => {
    const el = document.createElement('div');
    el.className = 'vpn-item' + (v.id === newId ? ' new-entry' : '');
    el.innerHTML = `<div class="vpn-rune vr-${v.status}"></div><span class="vpn-name">${v.name}</span><span class="vpn-detail">${v.detail}</span><span class="vpn-uptime${v.status === 'warn' ? ' warn-color' : ''}">${v.uptime}</span><button class="vpn-del" onclick="sndDelete();deleteVPN(${v.id})" title="Remover">✕</button>`;
    list.appendChild(el);
  });
  bindHoverSounds(list);
  updateStats();
}
function deleteVPN(id) { state.vpns = state.vpns.filter(v => v.id !== id); renderVPNs(); showToast('Túnel VPN desconectado.'); sndToast(); }


function renderOrigins() {
  const list = document.getElementById('origins-list');
  const sorted = [...state.origins].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;
  list.innerHTML = '';
  sorted.forEach(o => {
    const el = document.createElement('div'); el.className = 'origin-row';
    el.innerHTML = `<span class="origin-flag">${o.flag}</span><span class="origin-country">${o.country}</span><div class="origin-bar-wrap"><div class="origin-bar" style="width:${Math.round(o.count / max * 100)}%"></div></div><span class="origin-count">${o.count.toLocaleString()}</span>`;
    list.appendChild(el);
  });
  bindHoverSounds(list);
}


function updateStats(flash = false) {
  const tc = state.threats.length, crit = state.threats.filter(t => t.sev === 'critical').length;
  const vu = state.vpns.filter(v => v.status === 'up').length, vw = state.vpns.filter(v => v.status === 'warn').length;
  const eT = document.getElementById('stat-threats'), eV = document.getElementById('stat-vpn'), eP = document.getElementById('stat-packets');
  if (flash) { [eT, eV, eP].forEach(e => { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }); }
  eT.textContent = tc;
  document.getElementById('stat-threats-sub').innerHTML = crit > 0 ? `<em>${crit}</em> críticos ativos` : 'Nenhuma ameaça crítica';
  eV.textContent = state.vpns.length;
  document.getElementById('stat-vpn-sub').innerHTML = `<em>${vu}</em> ativos · ${vw} instáveis`;
  eP.textContent = state.packets > 1000000 ? (state.packets / 1000000).toFixed(1) + 'M' : (state.packets / 1000).toFixed(1) + 'K';
}

// ══════════════════════════════════════════
// O mapa
// ══════════════════════════════════════════
const mapCanvas = document.getElementById('worldMap');
const mctx = mapCanvas.getContext('2d');
let mapW = 0, mapH = 0;

function lonLatToXY(lon, lat, w, h) { return [(lon + 180) * (w / 360), (90 - lat) * (h / 180)]; }

const LAND = [];
(function () {
  const regions = [
    { lo: [-140, -60], la: [25, 70], d: 0.18 }, { lo: [-80, -35], la: [-55, 12], d: 0.18 },
    { lo: [-10, 40], la: [35, 70], d: 0.2 }, { lo: [-18, 50], la: [-35, 37], d: 0.16 },
    { lo: [25, 145], la: [5, 70], d: 0.14 }, { lo: [95, 145], la: [-10, 20], d: 0.12 },
    { lo: [114, 154], la: [-44, -10], d: 0.14 }, { lo: [-25, 2], la: [50, 66], d: 0.2 },
    { lo: [130, 145], la: [30, 45], d: 0.22 },
  ];
  regions.forEach(r => {
    const lons = Math.ceil((r.lo[1] - r.lo[0]) * r.d * 1.5), lats = Math.ceil((r.la[1] - r.la[0]) * r.d * 1.5);
    for (let i = 0; i < lons; i++) for (let j = 0; j < lats; j++) {
      LAND.push([r.lo[0] + (i / lons) * (r.lo[1] - r.lo[0]) + (Math.random() - 0.5) * 2,
      r.la[0] + (j / lats) * (r.la[1] - r.la[0]) + (Math.random() - 0.5) * 2]);
    }
  });
})();

const ATTACKS = [];
const GEO = [
  { lon: 116, lat: 40 }, { lon: 37, lat: 56 }, { lon: -100, lat: 38 }, { lon: -55, lat: -10 },
  { lon: 10, lat: 51 }, { lon: 139, lat: 36 }, { lon: 55, lat: 25 }, { lon: 28, lat: 41 },
  { lon: 2, lat: 47 }, { lon: -3, lat: 40 },
];
const TARGET = { lon: -46.6, lat: -23.5 };

function spawnAttack(sev) {
  const src = GEO[Math.floor(Math.random() * GEO.length)];
  ATTACKS.push({
    sev, srcLon: src.lon + (Math.random() - 0.5) * 8, srcLat: src.lat + (Math.random() - 0.5) * 8,
    dstLon: TARGET.lon, dstLat: TARGET.lat, progress: 0, speed: 0.008 + Math.random() * 0.012, done: false
  });
  document.getElementById('map-attack-count').textContent = `Ao vivo · ${ATTACKS.filter(a => !a.done).length} vetores`;
}
for (let i = 0; i < 6; i++) spawnAttack(['critical', 'high', 'high', 'medium', 'medium', 'low'][i]);

function resizeMap() {
  const w = mapCanvas.parentElement.clientWidth, h = Math.round(w * 0.36);
  mapCanvas.width = w * devicePixelRatio; mapCanvas.height = h * devicePixelRatio;
  mapCanvas.style.height = h + 'px'; mapW = w; mapH = h;
}

function drawMap() {
  if (!mapW) return;
  const dpr = devicePixelRatio, light = state.theme === 'light';
  mctx.save(); mctx.scale(dpr, dpr); mctx.clearRect(0, 0, mapW, mapH);
  mctx.fillStyle = light ? '#e8e2d8' : '#080810'; mctx.fillRect(0, 0, mapW, mapH);
  mctx.fillStyle = light ? 'rgba(139,96,0,0.2)' : 'rgba(184,150,12,0.18)';
  LAND.forEach(([lon, lat]) => { const [x, y] = lonLatToXY(lon, lat, mapW, mapH); mctx.beginPath(); mctx.arc(x, y, 1, 0, Math.PI * 2); mctx.fill(); });

  const [tx, ty] = lonLatToXY(TARGET.lon, TARGET.lat, mapW, mapH);
  const pulse = (Date.now() % 2000) / 2000;
  mctx.beginPath(); mctx.arc(tx, ty, 5 + pulse * 10, 0, Math.PI * 2);
  mctx.strokeStyle = `rgba(212,175,55,${0.5 * (1 - pulse)})`; mctx.lineWidth = 1; mctx.stroke();
  mctx.beginPath(); mctx.arc(tx, ty, 5, 0, Math.PI * 2); mctx.strokeStyle = 'rgba(212,175,55,0.8)'; mctx.lineWidth = 1.5; mctx.stroke();
  mctx.beginPath(); mctx.arc(tx, ty, 2, 0, Math.PI * 2); mctx.fillStyle = '#d4af37'; mctx.fill();
  ATTACKS.forEach(a => {
    if (a.progress >= 1) { a.done = true; return; }
    a.progress += a.speed;
    const [sx, sy] = lonLatToXY(a.srcLon, a.srcLat, mapW, mapH), [dx, dy] = lonLatToXY(a.dstLon, a.dstLat, mapW, mapH);
    const cpx = (sx + dx) / 2, cpy = Math.min(sy, dy) - Math.abs(dx - sx) * 0.35;
    const t = a.progress, px = Math.pow(1 - t, 2) * sx + 2 * (1 - t) * t * cpx + t * t * dx, py = Math.pow(1 - t, 2) * sy + 2 * (1 - t) * t * cpy + t * t * dy;
    const col = a.sev === 'critical' ? '255,61,61' : a.sev === 'high' ? '200,120,10' : '122,106,122';
    mctx.beginPath(); mctx.moveTo(sx, sy); mctx.quadraticCurveTo(cpx, cpy, px, py);
    mctx.strokeStyle = `rgba(${col},0.3)`; mctx.lineWidth = 1; mctx.stroke();
    mctx.beginPath(); mctx.arc(px, py, a.sev === 'critical' ? 3 : 2, 0, Math.PI * 2);
    mctx.fillStyle = `rgba(${col},0.9)`;
    if (a.sev === 'critical') { mctx.shadowBlur = 6; mctx.shadowColor = `rgba(${col},0.8)`; }
    mctx.fill(); mctx.shadowBlur = 0;
    mctx.beginPath(); mctx.arc(sx, sy, 2, 0, Math.PI * 2); mctx.fillStyle = `rgba(${col},0.5)`; mctx.fill();
  });
  for (let i = ATTACKS.length - 1; i >= 0; i--) if (ATTACKS[i].done) ATTACKS.splice(i, 1);
  mctx.restore();
}


const canvas = document.getElementById('trafficChart');
const ctx = canvas.getContext('2d');
let cIn = [], cBl = [], cOut = [];

function initChart() {
  cIn = Array.from({ length: 24 }, (_, h) => 22 + Math.sin(h / 3) * 14 + Math.random() * 18 + (h > 8 && h < 20 ? 28 : 0));
  cBl = Array.from({ length: 24 }, (_, h) => 6 + Math.random() * 10 + (h === 14 ? 22 : 0));
  cOut = Array.from({ length: 24 }, (_, h) => 14 + Math.cos(h / 4) * 7 + Math.random() * 9 + (h > 9 && h < 18 ? 16 : 0));
}
function updateChart() {
  cIn.shift(); cIn.push(20 + Math.random() * 40);
  cBl.shift(); cBl.push(4 + Math.random() * 18);
  cOut.shift(); cOut.push(12 + Math.random() * 28);
  drawChart();
}
function drawChart() {
  const cw = canvas.width / devicePixelRatio, ch = canvas.height / devicePixelRatio;
  const light = state.theme === 'light';
  ctx.clearRect(0, 0, cw, ch);
  const pad = { l: 8, r: 8, t: 10, b: 22 }, N = cIn.length;
  ctx.strokeStyle = light ? 'rgba(180,160,120,0.3)' : 'rgba(42,26,42,0.8)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const y = pad.t + (i / 4) * (ch - pad.t - pad.b); ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(cw - pad.r, y); ctx.stroke(); }
  ctx.fillStyle = light ? '#9a8a7a' : '#4a3a4a'; ctx.font = '8px JetBrains Mono'; ctx.textAlign = 'center';
  [0, 6, 12, 18, 23].forEach(h => ctx.fillText(h + 'h', pad.l + (h / (N - 1)) * (cw - pad.l - pad.r), ch - 4));
  function curve(data, sc, fc) {
    const w = cw - pad.l - pad.r, h = ch - pad.t - pad.b, max = 76;
    const pts = data.map((v, i) => ({ x: pad.l + (i / (N - 1)) * w, y: pad.t + h - (Math.min(v, max) / max) * h }));
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) { const mx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2; ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y); }
    if (fc) { ctx.lineTo(pts[N - 1].x, pad.t + h); ctx.lineTo(pts[0].x, pad.t + h); ctx.closePath(); const g = ctx.createLinearGradient(0, pad.t, 0, pad.t + h); g.addColorStop(0, fc); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) { const mx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2; ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y); } }
    ctx.strokeStyle = sc; ctx.lineWidth = 1.5; ctx.stroke();
  }
  curve(cIn, '#8b0000', 'rgba(139,0,0,0.18)');
  curve(cOut, '#b8960c', null);
  curve(cBl, '#c0152a', null);
}
function resizeChart() {
  const r = canvas.parentElement.getBoundingClientRect();
  canvas.width = r.width * devicePixelRatio; canvas.height = 160 * devicePixelRatio; canvas.style.height = '160px';
  ctx.scale(devicePixelRatio, devicePixelRatio); drawChart();
}

function animLoop() { drawMap(); requestAnimationFrame(animLoop); }


const autoThreats = [
  { sev: 'high', type: 'Força Bruta RDP', src: '91.121.44.12' },
  { sev: 'medium', type: 'Consulta DNS Suspeita', src: '10.0.5.88' },
  { sev: 'critical', type: 'Assinatura de Ransomware', src: '10.0.2.99' },
  { sev: 'low', type: 'Porta de Saída Incomum', src: '10.0.4.201' },
  { sev: 'high', type: 'ARP Spoofing Detectado', src: '192.168.1.77' },
  { sev: 'medium', type: 'Falha de Autenticação VPN', src: '77.88.55.60' },
  { sev: 'critical', type: 'Tentativa de Injeção SQL', src: '185.220.101.5' },
  { sev: 'high', type: 'Enumeração LDAP', src: '203.0.113.44' },
];
const autoAlerts = [
  'Pico de tráfego anômalo na porta 8443 — limiar excedido.',
  'Novo vetor de força bruta — <strong>10.0.1.12</strong> — 88 tentativas em 30s.',
  'Violação de regra — flood ICMP de <strong>203.0.113.7</strong>.',
  'Tempestade de autenticação VPN — <strong>77.88.55.60</strong> — 45 tentativas.',
  'Anomalia de transferência — <strong>10.0.4.17</strong> — 2,3GB em 10 minutos.',
];
let autoIdx = 0;

setInterval(() => {
  state.packets += Math.floor(Math.random() * 800 + 200);
  if (Math.random() < 0.35) {
    const t = autoThreats[Math.floor(Math.random() * autoThreats.length)];
    const nt = { id: state.nextId++, sev: t.sev, type: t.type, src: t.src, time: Date.now() };
    state.threats.unshift(nt); if (state.threats.length > 25) state.threats = state.threats.slice(0, 25);
    renderThreats(nt.id); sndThreat(nt.sev); spawnAttack(nt.sev);
    const banner = document.getElementById('alert-banner');
    document.getElementById('alert-text').innerHTML = autoAlerts[autoIdx % autoAlerts.length]; autoIdx++;
    banner.classList.remove('new-alert'); void banner.offsetWidth; banner.classList.add('new-alert');
  } else {
    updateStats(true);
    document.querySelectorAll('#threat-list .threat-item').forEach(el => {
      const id = parseInt(el.dataset.id), t = state.threats.find(x => x.id === id);
      if (t) { const te = el.querySelector('.threat-time'); if (te) te.textContent = timeAgo(t.time); }
    });
  }
  state.origins.forEach(o => { if (Math.random() < 0.4) o.count += Math.floor(Math.random() * 8 + 1); });
  renderOrigins();
  if (Math.random() < 0.5) spawnAttack(['high', 'medium', 'medium', 'low'][Math.floor(Math.random() * 4)]);
  updateChart();
}, 5000);


function openModal(t) { document.getElementById('modal-' + t).classList.add('open'); }
function closeModal(t) { document.getElementById('modal-' + t).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(o => { o.addEventListener('click', e => { if (e.target === o) { sndClick(); o.classList.remove('open'); } }); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open')); });

function addThreat() {
  const sev = document.getElementById('t-sev').value, src = document.getElementById('t-src').value.trim() || 'Desconhecido', type = document.getElementById('t-type').value.trim();
  if (!type) { shake('t-type'); return; }
  const t = { id: state.nextId++, sev, type, src, time: Date.now() };
  state.threats.unshift(t); renderThreats(t.id); spawnAttack(sev); sndSuccess(); closeModal('threat');
  document.getElementById('t-type').value = ''; document.getElementById('t-src').value = '';
  showToast('Ameaça registrada com sucesso.');
}
function addRule() {
  const action = document.getElementById('r-action').value, proto = document.getElementById('r-proto').value.trim(), desc = document.getElementById('r-desc').value.trim(), port = document.getElementById('r-port').value.trim() || '—';
  if (!proto) { shake('r-proto'); return; } if (!desc) { shake('r-desc'); return; }
  const r = { id: state.nextId++, action, proto, desc, port }; state.rules.push(r); renderRules(r.id); closeModal('rule'); sndSuccess();
  ['r-proto', 'r-desc', 'r-port'].forEach(id => document.getElementById(id).value = '');
  showToast('Regra de firewall criada.');
}
function addVPN() {
  const name = document.getElementById('v-name').value.trim(), detail = document.getElementById('v-detail').value.trim() || '—', status = document.getElementById('v-status').value, uptime = (document.getElementById('v-uptime').value.trim() || '—') + '%';
  if (!name) { shake('v-name'); return; }
  const v = { id: state.nextId++, name, detail, status, uptime }; state.vpns.push(v); renderVPNs(v.id); closeModal('vpn'); sndSuccess();
  ['v-name', 'v-detail', 'v-uptime'].forEach(id => document.getElementById(id).value = '');
  showToast('Túnel VPN vinculado.');
}

function shake(id) {
  const el = document.getElementById(id); el.style.borderColor = 'var(--ember)';
  el.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 200, iterations: 2 });
  setTimeout(() => el.style.borderColor = '', 1000);
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}


function enterDashboard() {
  const s = document.getElementById('splash');
  s.classList.add('hide'); setTimeout(() => s.style.display = 'none', 900);
  setTimeout(() => handleResize(), 100);
}
setTimeout(enterDashboard, 6000);

function handleResize() { resizeMap(); resizeChart(); }
window.addEventListener('resize', handleResize);


initChart(); handleResize();
renderThreats(); renderRules(); renderVPNs(); renderOrigins(); updateStats();
animLoop();

document.querySelectorAll('button,select').forEach(el => {
  el.addEventListener('mouseenter', () => sndHover());
});
