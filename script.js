'use strict';

/* ══════════════════════════════════════════════════════
   WEBCLAIR — "Et Internet Fût"
   Atlas interactif du vocabulaire du Web 1970–2030+
   Schéma v2 — Juin 2026
   ══════════════════════════════════════════════════════ */

/* ── WORLD ─────────────────────────────────── */
const WW = 6000, WH = 1200, YMIN = 1968, YMAX = 2032, MX = 380;
const xY = y => MX + ((y - YMIN) / (YMAX - YMIN)) * (WW - 2 * MX);

/* ── CATÉGORIES (10) ────────────────────────
   Chaque catégorie : couleur + position verticale (ly = fraction de WH)
   ─────────────────────────────────────────── */
const CATS = {
  "Fondations":    { color: "#1a7acc", ly: .05 },
  "Infrastructure":{ color: "#1aaa8a", ly: .15 },
  "Backend":       { color: "#8a6add", ly: .25 },
  "Frontend":      { color: "#1acccc", ly: .35 },
  "Sécurité":      { color: "#dd8a3a", ly: .45 },
  "Marketing":     { color: "#cc6aaa", ly: .55 },
  "IA/ML":         { color: "#e8c53a", ly: .65 },
  "Data":          { color: "#5aaa5a", ly: .74 },
  "Mobile":        { color: "#cc7a5a", ly: .83 },
  "DevOps":        { color: "#7a9acc", ly: .92 },
};

/* ── TYPES DE RELATIONS ─────────────────────── */
const ET = {
  INFLUENCE:       { color: "#1a7acc", dash: [4, 6],  label: "Influence",    w: .9,  animType: 'particles', speed: 1.2 },
  DEPENDS_ON:      { color: "#1aaa8a", dash: [],       label: "Dépend de",   w: .7,  animType: 'particles', speed: 1.5 },
  REPLACED_BY:     { color: "#dd8a3a", dash: [8, 4],  label: "Remplacé par", w: 1.1, animType: 'particles', speed: 0.8 },
  EVOLVES_INTO:    { color: "#cc6aaa", dash: [6, 4],  label: "Évolue vers",  w: 1,   animType: 'particles', speed: 1.0 },
  STANDARDISATION: { color: "#8a6add", dash: [],       label: "Standardise",  w: .8,  animType: 'particles', speed: 0.6 },
  CONCURRENCE:     { color: "#e26a6a", dash: [3, 3],  label: "Concurrence",  w: 1,   animType: 'pingPong',  speed: 2   },
};

// Données dynamiques chargées depuis atlas.json
let NODES = [];
let EDGES = [];
let PROSPECTIVE = [];

const nodeMap = {};
const ADJ = {};

/* ── CHARGEMENT ASYNCHRONE & FILTRES LOD ──────────────── */
async function loadAtlasData() {
  try {
    const response = await fetch('data/atlas.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    NODES = data.nodes || [];
    EDGES = data.edges || [];
    PROSPECTIVE = data.prospective || [];
    
    // Construction des index de graphe
    NODES.forEach(n => nodeMap[n.id] = n);
    NODES.forEach(n => ADJ[n.id] = []);
    EDGES.forEach(e => {
      const sn = nodeMap[e.s], tn = nodeMap[e.t];
      if (!sn || !tn) return;
      ADJ[e.s].push({ node: tn, edge: e, dir: 'out' });
      ADJ[e.t].push({ node: sn, edge: e, dir: 'in' });
    });
    
    // Champs dérivés sur chaque nœud
    NODES.forEach(n => {
      n._relations     = ADJ[n.id];
      n._parents       = ADJ[n.id].filter(c => c.dir === 'in'  && c.edge.type === 'EVOLVES_INTO').map(c => c.node.id);
      n._enfants       = ADJ[n.id].filter(c => c.dir === 'out' && c.edge.type === 'EVOLVES_INTO').map(c => c.node.id);
      n._remplacements = ADJ[n.id].filter(c => c.dir === 'out' && c.edge.type === 'REPLACED_BY').map(c => c.node.id);
      n._dep_count     = ADJ[n.id].length;
    });

    // Calcul de la disposition temporelle et catégorielle
    computeLayout();
    zoomFit();
    
    dirty = true;
    
    // Masquage de l'écran d'introduction après initialisation des données
    setTimeout(() => {
      const intro = document.getElementById('intro');
      if (intro) {
        intro.style.opacity = '0';
        setTimeout(() => { intro.style.display = 'none'; }, 1200);
      }
    }, 1500);
  } catch (err) {
    console.error("Failed to load atlas data:", err);
    const introSub = document.querySelector('.i-s');
    if (introSub) {
      introSub.textContent = "Erreur de chargement des données. Veuillez rafraîchir.";
      introSub.style.color = "#ff6b6b";
    }
  }
}

// Fonction de visibilité sémantique (Level of Detail - LOD)
function isNodeVisible(n) {
  const sc = cam.scale;
  const imp = n.importance || 2;
  
  // Toujours montrer les nœuds du parcours actif ou sélectionnés/survolés
  if (activeNarrative && activeNarrative.steps.some(s => s.id === n.id)) {
    return true;
  }
  if (selectedNode && selectedNode.id === n.id) return true;
  if (hoveredNode && hoveredNode.id === n.id) return true;
  
  // Zoom très éloigné : uniquement l'importance 1 (Fondateur)
  if (sc < 0.12) {
    return imp === 1;
  }
  // Zoom intermédiaire : importance 1 et 2 (Structurant)
  if (sc < 0.28) {
    return imp === 1 || imp === 2;
  }
  // Zoom de près : tout est visible
  return true;
}

/* ══════════════════════════════════════════════════════
   PARCOURS NARRATIFS
   ══════════════════════════════════════════════════════ */
const NARRATIVES = [
  {
    id: "react-birth", titre: "Comment est né React ?", desc: "Du DOM manipulé à la main au Virtual DOM révolutionnaire.",
    steps: [
      { id: "html",  note: "Tout commence avec HTML. La page est statique." },
      { id: "js",    note: "JavaScript apporte l'interactivité. Mais manipuler le DOM est lent et fragile." },
      { id: "ajax",  note: "AJAX permet des mises à jour partielles. Gmail et Google Maps révèlent le potentiel." },
      { id: "jq",    note: "jQuery simplifie tout, mais les apps grossissent et le code devient ingérable." },
      { id: "bb",    note: "Backbone.js tente de structurer avec MVC côté client." },
      { id: "ang",   note: "AngularJS chez Google introduit le data-binding bidirectionnel en 2010." },
      { id: "react", note: "Facebook invente le Virtual DOM en 2013. Le composant devient la primitive universelle." },
    ]
  },
  {
    id: "cloud-rise", titre: "L'ascension du Cloud", desc: "Du serveur physique au serverless en 20 ans.",
    steps: [
      { id: "srv",     note: "1990 : Tim Berners-Lee allume le premier serveur web. Un seul ordinateur." },
      { id: "linux",   note: "Linux rend les serveurs accessibles à tous. 96% des serveurs web tourneront dessus." },
      { id: "apache",  note: "Apache, logiciel libre, devient le serveur dominant sur Internet." },
      { id: "broad",   note: "Le haut-débit rend les échanges massifs possibles. Internet change de dimension." },
      { id: "aws",     note: "Amazon invente le cloud en 2006 : louer un serveur à la demande, à la minute." },
      { id: "docker",  note: "Docker empaquète les apps. Le déploiement devient reproductible partout." },
      { id: "k8s",     note: "Kubernetes orchestre des milliers de conteneurs. Google open-source sa magie interne." },
      { id: "srvless", note: "Serverless : plus aucun serveur à gérer. Payer à la milliseconde d'exécution." },
    ]
  },
  {
    id: "web-security", titre: "La guerre de la sécurité", desc: "Comment le Web a appris à chiffrer et se protéger.",
    steps: [
      { id: "crypto", note: "1976 : Diffie et Hellman inventent la cryptographie à clé publique. Révolution." },
      { id: "fw",     note: "1988 : le premier ver Morris frappe Internet. Le firewall naît de la panique." },
      { id: "ssl",    note: "Netscape invente SSL en 1995 pour sécuriser les paiements en ligne." },
      { id: "https",  note: "HTTP + SSL = HTTPS. Le cadenas vert naît. Le Web devient commercialement viable." },
      { id: "auth",   note: "Sessions et cookies standardisent l'authentification. L'identité en ligne existe." },
      { id: "vpn",    note: "Le VPN chiffre toute la connexion. D'abord entreprise, puis grand public." },
    ]
  },
  {
    id: "open-web", titre: "Le Web ouvert", desc: "La philosophie open source qui a construit Internet.",
    steps: [
      { id: "os",    note: "1998 : le mouvement Open Source est officiellement nommé." },
      { id: "linux", note: "Linux est la cathédrale du libre. 96% des serveurs, tous les supercalculateurs." },
      { id: "apache",note: "Apache, logiciel libre, devient le serveur dominant. LAMP naît." },
      { id: "ff",    note: "Firefox brise le monopole d'Internet Explorer. 100M de téléchargements en un an." },
      { id: "wp",    note: "WordPress propulse 43% du Web mondial en open source. Quiconque peut publier." },
      { id: "gh",    note: "GitHub devient la mémoire collective du code. 100 millions de développeurs." },
    ]
  },
  {
    id: "mobile-rev", titre: "La révolution mobile", desc: "Comment l'iPhone a recréé le Web.",
    steps: [
      { id: "iphone", note: "9 janvier 2007. Steve Jobs présente l'iPhone. Flash est condamné à mort." },
      { id: "html5",  note: "HTML5 répond à la mort de Flash : vidéo, audio, canvas natifs dans le navigateur." },
      { id: "css3",   note: "CSS3 apporte animations et flexbox. Flash devient définitivement inutile." },
      { id: "rwd",    note: "Ethan Marcotte invente le Responsive Design en 2010. Un site, tous les écrans." },
      { id: "ipad",   note: "L'iPad crée une troisième catégorie. Les breakpoints responsive se multiplient." },
      { id: "pwa",    note: "Les Progressive Web Apps font de chaque site une app installable." },
    ]
  },
  {
    id: "api-economy", titre: "L'économie des APIs", desc: "Comment les APIs ont fragmenté et unifié le Web.",
    steps: [
      { id: "ajax",  note: "XMLHttpRequest permet les premières requêtes asynchrones depuis le navigateur." },
      { id: "api",   note: "Le concept d'API Web s'impose avec les premiers services tiers." },
      { id: "rest",  note: "Roy Fielding formalise REST en 2000. GET/POST/PUT/DELETE universalisés." },
      { id: "json",  note: "JSON remplace XML. Léger, lisible, natif JavaScript. Format quasi-universel." },
      { id: "node",  note: "Node.js exécute JavaScript côté serveur. Le plein-stack JS devient possible." },
      { id: "gql",   note: "GraphQL de Facebook : demander exactement ce qu'on veut, rien de plus." },
    ]
  },
];

/* ══════════════════════════════════════════════════════
   MOTEUR DE REQUÊTES — window.WC
   ══════════════════════════════════════════════════════ */
const WC = {
  /* Requête filtrée */
  query(filters = {}) {
    return NODES.filter(n => {
      if (filters.categorie  && n.categorie  !== filters.categorie)  return false;
      if (filters.importance && n.importance !== filters.importance) return false;
      if (filters.annee_min  && n.annee < filters.annee_min)         return false;
      if (filters.annee_max  && n.annee > filters.annee_max)         return false;
      if (filters.q) {
        const lq = filters.q.toLowerCase();
        if (!n.nom.toLowerCase().includes(lq) && !n.description_courte.toLowerCase().includes(lq)) return false;
      }
      return true;
    });
  },

  /* Chaîne d'influence descendante depuis un nœud (BFS) */
  influence_chain(id, depth = 4, types = ['EVOLVES_INTO','INFLUENCE']) {
    const visited = new Set([id]);
    const queue   = [{ id, d: 0 }];
    const result  = [];
    while (queue.length) {
      const { id: cur, d } = queue.shift();
      if (d >= depth) continue;
      (ADJ[cur] || []).forEach(c => {
        if (c.dir === 'out' && types.includes(c.edge.type) && !visited.has(c.node.id)) {
          visited.add(c.node.id);
          result.push({ node: c.node, depth: d + 1, via: c.edge.type });
          queue.push({ id: c.node.id, d: d + 1 });
        }
      });
    }
    return result;
  },

  /* Top N nœuds par degré de connexion */
  most_connected(n = 10) {
    return [...NODES].sort((a, b) => b._dep_count - a._dep_count).slice(0, n);
  },

  /* Signaux prospectifs actifs */
  prospective(minProba = 0.5) {
    return PROSPECTIVE.filter(p => p.probabilite >= minProba && p.statut !== 'INFIRMÉ');
  },

  /* Statistiques générales */
  stats() {
    const bycat = {};
    const byimp = {1:0, 2:0, 3:0};
    NODES.forEach(n => {
      bycat[n.categorie] = (bycat[n.categorie] || 0) + 1;
      byimp[n.importance]++;
    });
    return {
      total_nodes: NODES.length,
      total_edges: EDGES.length,
      by_categorie: bycat,
      by_importance: byimp,
      categories: Object.keys(CATS).length
    };
  }
};
window.WC = WC;

/* ══════════════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════════════ */
function computeLayout() {
  const groups = {};
  NODES.forEach(n => {
    const k = n.categorie + '_' + n.annee;
    if (!groups[k]) groups[k] = [];
    groups[k].push(n);
  });
  NODES.forEach(n => {
    n._wx = xY(n.annee);
    n._wy = CATS[n.categorie] ? CATS[n.categorie].ly * WH : WH * 0.5;
  });
  Object.values(groups).forEach(g => {
    if (g.length <= 1) return;
    const sp = 28;
    g.forEach((n, i) => { n._wy += (i - (g.length - 1) / 2) * sp; });
  });
}

/* ══════════════════════════════════════════════════════
   CAMÉRA
   ══════════════════════════════════════════════════════ */
let W = window.innerWidth, H = window.innerHeight;
const cam = { cx: WW / 2, cy: WH / 2, scale: .15 };

/* ── UTILITAIRE : alpha hex ──────────────────────────────
   Convertit un float 0–1 en suffixe hexadécimal 2 chiffres
   Utilisé partout pour composer des couleurs canvas
   ─────────────────────────────────────────────────────── */
function hexA(a) {
  const v = Math.max(0, Math.min(1, a));
  return Math.round(v * 255).toString(16).padStart(2, '0');
}

/* ── MODE CONSTELLATION ─────────────────────────────────── */
function enterConstellation(n) {
  renderMode = 'constellation';
  selectedNode = n;
  constAngle = 0;
  const csh = document.getElementById('csh');
  if (csh) csh.classList.add('on');
  dirty = true; schedRender();
}
function exitConstellation() {
  renderMode = 'map';
  const csh = document.getElementById('csh');
  if (csh) csh.classList.remove('on');
  dirty = true; schedRender();
}



function w2s(wx, wy) {
  return { sx: (wx - cam.cx) * cam.scale + W / 2, sy: (wy - cam.cy) * cam.scale + H / 2 };
}
function s2w(sx, sy) {
  return { wx: (sx - W / 2) / cam.scale + cam.cx, wy: (sy - H / 2) / cam.scale + cam.cy };
}

let camAnim = null;
function flyTo(wx, wy, sc, dur = 650) {
  const sx0 = cam.cx, sy0 = cam.cy, ss0 = cam.scale;
  const sc1 = sc || Math.max(cam.scale, 1.2);
  const t0 = performance.now();
  function ease(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  if (camAnim) cancelAnimationFrame(camAnim);
  function step(now) {
    const t = Math.min(1, (now - t0) / dur);
    const e = ease(t);
    cam.cx = sx0 + (wx - sx0) * e;
    cam.cy = sy0 + (wy - sy0) * e;
    cam.scale = ss0 + (sc1 - ss0) * e;
    dirty = true;
    if (t < 1) camAnim = requestAnimationFrame(step);
    else camAnim = null;
  }
  camAnim = requestAnimationFrame(step);
}
function zoomFit() {
  if (NODES.length === 0) return;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  NODES.forEach(n => { x0 = Math.min(x0, n._wx); x1 = Math.max(x1, n._wx); y0 = Math.min(y0, n._wy); y1 = Math.max(y1, n._wy); });
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const sc = Math.min((W - 140) / (x1 - x0 + 300), (H - 100) / (y1 - y0 + 200), .4);
  flyTo(cx, cy, sc, 700);
}
function zoomAt(sx, sy, factor) {
  const { wx, wy } = s2w(sx, sy);
  cam.scale = Math.max(.06, Math.min(5, cam.scale * factor));
  cam.cx = wx - (sx - W / 2) / cam.scale;
  cam.cy = wy - (sy - H / 2) / cam.scale;
  dirty = true;
}

/* ══════════════════════════════════════════════════════
   ÉTAT DU RENDU
   ══════════════════════════════════════════════════════ */
let dirty = true, renderMode = 'map', selectedNode = null;
let hoveredNode = null, showEdges = true, showLabels = true;
let activeNarrative = null, activeStep = -1;
let activeEdgeFilters = new Set(['INFLUENCE','DEPENDS_ON','REPLACED_BY','EVOLVES_INTO','STANDARDISATION','CONCURRENCE']);

const canvas = document.getElementById('cv');
const ctx    = canvas.getContext('2d');
const mmc    = document.getElementById('mmc');
const mmctx  = mmc.getContext('2d');

function setSize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; dirty = true; }
setSize();

function schedRender() { dirty = true; }
function setDirty() { dirty = true; }

function renderMap() {
  drawGrid();
  drawLanes();
  if (showEdges && cam.scale > .12) drawEdges();
  if (activeNarrative && activeStep >= 0) drawNarrPath();
  drawNodes();
  if (showLabels || cam.scale > .28) drawLabels();
}

/* ── TIMELINE CANVAS ──────────────────────────────────── */
let yearHitAreas = [];

function drawGrid() {
  yearHitAreas = [];
  const sc = cam.scale;

  // Grille verticale (décennies + quinquennies)
  for (let yr = 1970; yr <= 2032; yr += 5) {
    const { sx } = w2s(xY(yr), 0);
    if (sx < -10 || sx > W + 10) continue;
    ctx.beginPath();
    ctx.moveTo(sx, 56);
    ctx.lineTo(sx, H - 38);
    ctx.strokeStyle = yr % 10 === 0 ? 'rgba(26,74,106,.14)' : 'rgba(14,42,70,.08)';
    ctx.lineWidth   = yr % 10 === 0 ? 1 : .5;
    ctx.setLineDash([]); ctx.stroke();
  }

  // Labels d'années — espace monde, texte vertical, profondeur de champ
  const step = sc > .5 ? 1 : sc > .28 ? 5 : 10;
  const labelZone = H - 36;

  for (let yr = YMIN + 2; yr <= YMAX - 2; yr++) {
    if (yr % step !== 0) continue;
    const { sx } = w2s(xY(yr), 0);
    if (sx < -30 || sx > W + 30) continue;

    const distRatio = Math.abs(sx - W / 2) / (W * 0.52);
    const focus     = Math.max(0, 1 - distRatio);
    const alpha     = 0.08 + focus * 0.82;
    const blurPx    = (1 - focus) * 4.5;
    const isMajor   = yr % 10 === 0;

    ctx.save();
    if (blurPx > 0.3) ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    ctx.globalAlpha = alpha;

    const fs = isMajor ? 11 : 9;
    ctx.font      = (isMajor ? '500' : '400') + ` ${fs}px IBM Plex Mono`;
    ctx.fillStyle = isMajor ? '#3a9acc' : 'rgba(26,74,106,0.9)';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';

    ctx.translate(sx, labelZone);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yr, 0, 0);
    ctx.restore();

    if (alpha > 0.35 && isMajor) {
      yearHitAreas.push({ yr, sx, syMin: H - 60, syMax: H - 14 });
    }
  }
}

function drawLanes() {
  Object.entries(CATS).forEach(([cat, def]) => {
    const cy = def.ly * WH, bh = 80;
    const { sy: y0 } = w2s(0, cy - bh / 2);
    const { sy: y1 } = w2s(0, cy + bh / 2);
    ctx.fillStyle = def.color + '09';
    ctx.fillRect(0, y0, W, y1 - y0);
    if (cam.scale > .22 && y0 > 56 && y1 < H - 38) {
      const ly = (y0 + y1) / 2;
      ctx.font      = '8px IBM Plex Mono';
      ctx.fillStyle = def.color + '50';
      ctx.textAlign    = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(cat, 72, ly);
    }
  });
}

/* ── EDGES ──────────────────────────────────────────── */
function getQBPoint(t, x1, y1, cx, cy, x2, y2) {
  const mt = 1 - t;
  return { x: mt*mt*x1 + 2*mt*t*cx + t*t*x2, y: mt*mt*y1 + 2*mt*t*cy + t*t*y2 };
}

function drawEdges() {
  const time = performance.now();
  const sc   = cam.scale;

  EDGES.forEach(e => {
    if (!activeEdgeFilters.has(e.type)) return;
    const sn = nodeMap[e.s], tn = nodeMap[e.t];
    if (!sn || !tn) return;

    // Zoom Sémantique (LOD) : n'affiche la liaison que si les deux nœuds connectés sont visibles
    if (!isNodeVisible(sn) || !isNodeVisible(tn)) return;

    const { sx: x1, sy: y1 } = w2s(sn._wx, sn._wy);
    const { sx: x2, sy: y2 } = w2s(tn._wx, tn._wy);
    if ((x1 < -40 && x2 < -40) || (x1 > W + 40 && x2 > W + 40)) return;

    const et = ET[e.type]; if (!et) return;
    const isHov = (hoveredNode && (hoveredNode.id === e.s || hoveredNode.id === e.t)) ||
                  (selectedNode && (selectedNode.id === e.s || selectedNode.id === e.t));
    const isNar = activeNarrative && activeNarrative.steps.some((s, idx) => {
      if (s.id !== e.s) return false;
      const next = activeNarrative.steps[idx + 1];
      return next && next.id === e.t;
    });

    let a = isHov ? .72 : isNar ? .55 : activeNarrative ? .04 : .18;
    if (sc < .24 && !isHov && !isNar) a *= (sc - .12) / .12;
    if (a <= 0.01) return;

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + (x2 - x1) * .12;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.strokeStyle = et.color + hexA(a);
    ctx.lineWidth   = isHov ? et.w * 1.5 : isNar ? et.w * 1.2 : et.w;
    ctx.setLineDash(et.dash); ctx.stroke(); ctx.setLineDash([]);

    if (et.animType === 'particles' && (isHov || isNar || (!activeNarrative && sc > .25))) {
      const tBase = ((time * et.speed) / 2000) % 1;
      ctx.fillStyle = et.color + hexA(a * 1.3);
      const points = [tBase];
      if (isHov || isNar) points.push((tBase + .5) % 1);
      points.forEach(t => {
        const pt = getQBPoint(t, x1, y1, mx, my, x2, y2);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, isHov ? 2.5 : 1.6, 0, Math.PI * 2); ctx.fill();
      });
    } else if (et.animType === 'pingPong' && (isHov || isNar || (!activeNarrative && sc > .25))) {
      const tBase = (time / 1600) % 1;
      ctx.fillStyle = et.color + hexA(a * 1.3);
      const p1 = getQBPoint(tBase, x1, y1, mx, my, x2, y2);
      const p2 = getQBPoint(1 - tBase, x1, y1, mx, my, x2, y2);
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, isHov ? 3.5 : 2.2, 0, Math.PI * 2);
      ctx.arc(p2.x, p2.y, isHov ? 3.5 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if ((e.type === 'REPLACED_BY' || e.type === 'EVOLVES_INTO') && isHov) {
      drawArrow(x1, y1, x2, y2, et.color + hexA(a), 6);
    }
  });
}

function drawArrow(x1, y1, x2, y2, col, sz) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy);
  if (len < 1) return;
  const nx = dx/len, ny = dy/len;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - sz*nx + sz*.45*ny, y2 - sz*ny - sz*.45*nx);
  ctx.lineTo(x2 - sz*nx - sz*.45*ny, y2 - sz*ny + sz*.45*nx);
  ctx.closePath(); ctx.fillStyle = col; ctx.fill();
}

function drawNarrPath() {
  if (!activeNarrative) return;
  const ids = activeNarrative.steps.map(s => s.id);
  for (let i = 0; i < ids.length - 1; i++) {
    const a = nodeMap[ids[i]], b = nodeMap[ids[i+1]];
    if (!a || !b) continue;
    const { sx: x1, sy: y1 } = w2s(a._wx, a._wy);
    const { sx: x2, sy: y2 } = w2s(b._wx, b._wy);
    const active = i === activeStep || i === activeStep - 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = active ? 'rgba(26,122,204,.7)' : 'rgba(26,74,106,.3)';
    ctx.lineWidth = active ? 2 : 1;
    ctx.setLineDash(active ? [] : [4,6]); ctx.stroke(); ctx.setLineDash([]);
  }
}

/* ── NODES ──────────────────────────────────────────── */
function nodeRadius(n) {
  const imp = n.importance || 2;
  const base = imp === 1 ? 4.5 : imp === 2 ? 3.5 : 2.5;
  return Math.max(base, base * Math.min(cam.scale / .3, 1.4));
}

function drawNodes() {
  const sc = cam.scale;
  NODES.forEach(n => {
    // Zoom Sémantique (LOD) : filtre les nœuds non-visibles
    if (!isNodeVisible(n)) return;

    const { sx, sy } = w2s(n._wx, n._wy);
    if (sx < -30 || sx > W + 30 || sy < 30 || sy > H - 30) return;
    const col     = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    const isHov   = hoveredNode && hoveredNode.id === n.id;
    const isSel   = selectedNode && selectedNode.id === n.id;
    const isNar   = activeNarrative && activeNarrative.steps.some(s => s.id === n.id);
    const isNarAct= activeNarrative && activeNarrative.steps[activeStep] && activeNarrative.steps[activeStep].id === n.id;
    const r = isNarAct ? 8 : (isHov || isSel) ? 6 : nodeRadius(n);

    // Glow
    if (isHov || isSel || isNarAct) {
      [r + 7, r + 14, r + 22].forEach((gr, gi) => {
        ctx.beginPath(); ctx.arc(sx, sy, gr, 0, Math.PI * 2);
        ctx.strokeStyle = col + ['33','22','11'][gi]; ctx.lineWidth = 1; ctx.stroke();
      });
    }

    // Node fill
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
    if (isHov || isSel || isNarAct) {
      ctx.fillStyle = col;
    } else if (isNar) {
      ctx.fillStyle = col + 'cc';
    } else {
      ctx.fillStyle = col + (activeNarrative ? '44' : '99');
    }
    ctx.fill();

    // Inner dot (importance marker)
    if (r > 3.5) {
      ctx.beginPath(); ctx.arc(sx, sy, r * .35, 0, Math.PI * 2);
      ctx.fillStyle = n.importance === 1 ? 'rgba(255,255,255,.35)' : 'rgba(3,6,10,.55)';
      ctx.fill();
    }
  });
}

function drawLabels() {
  const sc = cam.scale;
  if (sc < .13) return;
  ctx.save();
  NODES.forEach(n => {
    // Zoom Sémantique (LOD) : filtre les étiquettes non-visibles
    if (!isNodeVisible(n)) return;

    const { sx, sy } = w2s(n._wx, n._wy);
    if (sx < -80 || sx > W + 80 || sy < 30 || sy > H - 30) return;
    const col     = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    const isHov   = hoveredNode && hoveredNode.id === n.id;
    const isSel   = selectedNode && selectedNode.id === n.id;
    const isNar   = activeNarrative && activeNarrative.steps.some(s => s.id === n.id);
    const isNarAct= activeNarrative && activeNarrative.steps[activeStep] && activeNarrative.steps[activeStep].id === n.id;
    const r = (isHov || isSel) ? 6 : nodeRadius(n);
    const lx = sx + (sx > W / 2 ? -(r + 8) : (r + 8));
    const align = sx > W / 2 ? 'right' : 'left';
    const fs = Math.min(13, Math.max(8.5, 11 * sc));
    if (sc < .22 && !isHov && !isSel && !isNar) return;
    let alpha = 1;
    if (activeNarrative && !isNar && !isHov && !isSel) alpha = .18;
    ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.font = ((isHov || isSel || isNarAct) ? '500' : '400') + ` ${isHov || isSel ? fs + 1 : fs}px IBM Plex Mono`;
    ctx.fillStyle = col + hexA(alpha * ((isHov || isSel || isNarAct) ? 1 : .72));
    ctx.fillText(n.nom, lx, sy);
    if (sc > .55 && (isHov || isSel)) {
      ctx.font = `300 ${Math.max(7.5, fs - 3)}px IBM Plex Mono`;
      ctx.fillStyle = col + '66';
      ctx.fillText(n.annee + ' · ' + n.categorie, lx, sy + fs + 2);
    }
  });
  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   MODE CONSTELLATION
   ══════════════════════════════════════════════════════ */
let constAngle = 0;
function renderConstellation() {
  constAngle += .004;
  dirty = true;
  const cx = W / 2, cy = H / 2;
  const conns = ADJ[selectedNode.id] || [];
  const col   = CATS[selectedNode.categorie] ? CATS[selectedNode.categorie].color : '#8899aa';
  const time  = performance.now();

  ctx.fillStyle = 'rgba(3,6,10,.08)';
  ctx.fillRect(0, 0, W, H);
  [160, 260, 360].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(26,74,106,' + ['.08','.05','.03'][i] + ')';
    ctx.lineWidth = 1; ctx.setLineDash([3,8]); ctx.stroke(); ctx.setLineDash([]);
  });

  const byType = {};
  conns.forEach(c => { const t = c.edge.type; if (!byType[t]) byType[t] = []; byType[t].push(c); });
  const positions = [];
  const typeOrder = ['EVOLVES_INTO','INFLUENCE','DEPENDS_ON','REPLACED_BY','STANDARDISATION','CONCURRENCE'];
  const radii = [180, 260, 340];
  let orbit = 0;
  typeOrder.forEach(type => {
    const cs = byType[type] || []; if (!cs.length) return;
    const r = radii[Math.min(orbit, radii.length - 1)];
    const dir = orbit % 2 === 0 ? 1 : -1;
    cs.forEach((c, i) => {
      const baseAngle = (i / cs.length) * Math.PI * 2 + (orbit * Math.PI * .6);
      const a = baseAngle + constAngle * dir * .5;
      positions.push({ sx: cx + Math.cos(a) * r, sy: cy + Math.sin(a) * r, conn: c, type });
    });
    orbit++;
  });

  positions.forEach(p => {
    if (!activeEdgeFilters.has(p.type)) return;
    const et = ET[p.type]; if (!et) return;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.sx, p.sy);
    ctx.strokeStyle = et.color + hexA(.33); ctx.lineWidth = 1;
    ctx.setLineDash(et.dash); ctx.stroke(); ctx.setLineDash([]);

    if (et.animType === 'particles') {
      const tBase = (time / 1500) % 1;
      ctx.fillStyle = et.color + 'aa';
      [0, .5].forEach(off => {
        const t = (tBase + off) % 1;
        ctx.beginPath();
        ctx.arc(cx + (p.sx - cx) * t, cy + (p.sy - cy) * t, 2, 0, Math.PI * 2); ctx.fill();
      });
    } else if (et.animType === 'pingPong') {
      const tBase = (time / 2000) % 1;
      ctx.fillStyle = et.color + 'aa';
      ctx.beginPath();
      ctx.arc(cx + (p.sx - cx) * tBase,       cy + (p.sy - cy) * tBase,       2.2, 0, Math.PI * 2);
      ctx.arc(cx + (p.sx - cx) * (1 - tBase), cy + (p.sy - cy) * (1 - tBase), 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  positions.forEach(p => {
    const nc   = CATS[p.conn.node.categorie] ? CATS[p.conn.node.categorie].color : '#8899aa';
    const et   = ET[p.type];
    const isHov = hoveredNode && hoveredNode.id === p.conn.node.id;
    const r    = isHov ? 8 : 5;
    if (isHov) {
      [r+6, r+12].forEach((gr, gi) => {
        ctx.beginPath(); ctx.arc(p.sx, p.sy, gr, 0, Math.PI * 2);
        ctx.strokeStyle = nc + ['33','18'][gi]; ctx.lineWidth = 1; ctx.stroke();
      });
    }
    ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
    ctx.fillStyle = isHov ? nc : nc + 'cc'; ctx.fill();
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = `${isHov ? '500' : '400'} 10px IBM Plex Mono`;
    ctx.fillStyle = nc + (isHov ? 'ff' : 'cc');
    ctx.fillText(p.conn.node.nom, p.sx, p.sy + r + 5);
    ctx.font = '7.5px IBM Plex Mono';
    ctx.fillStyle = et.color + '88';
    ctx.fillText(p.dir === 'out' ? et.label : '← ' + et.label, p.sx, p.sy + r + 17);
  });

  [22,32,44,60].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = col + ['33','28','18','0c'][i]; ctx.lineWidth = 1; ctx.stroke();
  });
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fillStyle = col + '22'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.font = '500 15px IBM Plex Mono'; ctx.fillStyle = col;
  ctx.fillText(selectedNode.nom, cx, cy + 22);
  ctx.font = '9px IBM Plex Mono'; ctx.fillStyle = col + 'aa';
  ctx.fillText(selectedNode.annee + ' · ' + selectedNode.categorie, cx, cy + 39);
}

/* ══════════════════════════════════════════════════════
   MINIMAP
   ══════════════════════════════════════════════════════ */
const MMW = 178, MMH = 58, MMPad = 8;
function renderMinimap() {
  mmctx.clearRect(0, 0, MMW, MMH);
  mmctx.fillStyle = 'rgba(3,6,10,.5)'; mmctx.fillRect(0, 0, MMW, MMH);
  const sx = wx => MMPad + (wx / WW) * (MMW - MMPad * 2);
  const sy = wy => MMPad + (wy / WH) * (MMH - MMPad * 2);
  NODES.forEach(n => {
    const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    mmctx.beginPath(); mmctx.arc(sx(n._wx), sy(n._wy), 1.5, 0, Math.PI * 2);
    mmctx.fillStyle = col + 'cc'; mmctx.fill();
  });
  const { wx: vx0, wy: vy0 } = s2w(0, 56);
  const { wx: vx1, wy: vy1 } = s2w(W, H - 38);
  const rx = sx(vx0), ry = sy(vy0), rw = sx(vx1) - rx, rh = sy(vy1) - ry;
  mmctx.strokeStyle = 'rgba(26,122,204,.7)'; mmctx.lineWidth = 1;
  mmctx.strokeRect(Math.max(0,rx), Math.max(0,ry), Math.min(rw,MMW-rx), Math.min(rh,MMH-ry));
}

/* ══════════════════════════════════════════════════════
   HIT TEST
   ══════════════════════════════════════════════════════ */
function hitNode(mx, my) {
  if (renderMode === 'constellation') {
    const cx = W / 2, cy = H / 2;
    const conns = ADJ[selectedNode.id] || [];
    const byType = {};
    conns.forEach(c => { const t = c.edge.type; if (!byType[t]) byType[t] = []; byType[t].push(c); });
    const typeOrder = ['EVOLVES_INTO','INFLUENCE','DEPENDS_ON','REPLACED_BY','STANDARDISATION','CONCURRENCE'];
    const radii = [180, 260, 340]; let orbit = 0;
    for (const type of typeOrder) {
      const cs = byType[type] || []; if (!cs.length) continue;
      const r = radii[Math.min(orbit, radii.length - 1)];
      const dir = orbit % 2 === 0 ? 1 : -1;
      for (let i = 0; i < cs.length; i++) {
        const baseAngle = (i / cs.length) * Math.PI * 2 + (orbit * Math.PI * .6);
        const a = baseAngle + constAngle * dir * .5;
        const nx = W/2 + Math.cos(a)*r, ny = H/2 + Math.sin(a)*r;
        if ((mx-nx)**2 + (my-ny)**2 < 400) return cs[i].node;
      }
      orbit++;
    }
    return null;
  }
  let closest = null, minD = 450;
  NODES.forEach(n => {
    // Ne permet de survoler que les nœuds sémantiquement visibles
    if (!isNodeVisible(n)) return;
    const { sx, sy } = w2s(n._wx, n._wy);
    const d = (mx - sx)**2 + (my - sy)**2;
    if (d < minD) { minD = d; closest = n; }
  });
  return closest;
}

/* ══════════════════════════════════════════════════════
   RECHERCHE
   ══════════════════════════════════════════════════════ */
const siEl = document.getElementById('si');
const srEl = document.getElementById('sr');
let srIdx = -1, srResults = [];

function doSearch(q) {
  if (!q || q.length < 2) { srEl.classList.remove('on'); srResults = []; return; }
  const lq = q.toLowerCase();
  srResults = NODES.filter(n =>
    n.nom.toLowerCase().includes(lq) ||
    n.description_courte.toLowerCase().includes(lq) ||
    n.categorie.toLowerCase().includes(lq) ||
    String(n.annee).includes(lq)
  ).slice(0, 8);
  srIdx = -1; renderSR();
}
function renderSR() {
  if (!srResults.length) { srEl.classList.remove('on'); return; }
  srEl.innerHTML = srResults.map((n, i) => {
    const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    return `<div class="sri${i === srIdx ? ' ak' : ''}" data-id="${n.id}" role="option">
      <div class="sri-dot" style="background:${col}"></div>
      <span class="sri-n">${n.nom}</span>
      <span class="sri-y">${n.annee}</span>
      <span class="sri-c" style="color:${col}88">${n.categorie}</span>
    </div>`;
  }).join('');
  srEl.classList.add('on');
  srEl.querySelectorAll('.sri').forEach(el => {
    el.addEventListener('click', () => { const n = nodeMap[el.dataset.id]; if (n) selectSR(n); });
  });
}
function selectSR(n) {
  siEl.value = ''; srEl.classList.remove('on'); srResults = [];
  flyTo(n._wx, n._wy, 1.8);
  setTimeout(() => openDetail(n), 400);
}
siEl.addEventListener('input', e => doSearch(e.target.value));
siEl.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown')  { srIdx = Math.min(srIdx + 1, srResults.length - 1); renderSR(); }
  else if (e.key === 'ArrowUp')   { srIdx = Math.max(srIdx - 1, -1); renderSR(); }
  else if (e.key === 'Enter' && srIdx >= 0) { selectSR(srResults[srIdx]); }
  else if (e.key === 'Escape') { srEl.classList.remove('on'); siEl.blur(); }
});
siEl.addEventListener('blur', () => setTimeout(() => srEl.classList.remove('on'), 200));

/* ══════════════════════════════════════════════════════
   TOOLTIP
   ══════════════════════════════════════════════════════ */
const ttEl = document.getElementById('tt');
function showTT(n, mx, my) {
  const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
  document.getElementById('tt-n').textContent = n.nom;
  document.getElementById('tt-n').style.color  = col;
  document.getElementById('tt-m').textContent = n.annee + ' · ' + n.categorie;
  document.getElementById('tt-d').textContent = n.description_courte;
  let tx = mx + 14, ty = my - 12;
  if (tx + 240 > W) tx = mx - 246;
  if (ty + 130 > H - 52) ty = my - 130;
  ttEl.style.left = tx + 'px'; ttEl.style.top = ty + 'px';
  ttEl.style.opacity = '1';
}
function hideTT() { ttEl.style.opacity = '0'; }

/* ══════════════════════════════════════════════════════
   PANNEAU DE DÉTAIL
   ══════════════════════════════════════════════════════ */
const dpEl = document.getElementById('dp');
function openDetail(n) {
  selectedNode = n;
  const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
  const impLabels = { 1: '★ Fondamental', 2: '◆ Structurant', 3: '· Notable' };

  document.getElementById('dp-y').textContent = n.annee;
  document.getElementById('dp-n').textContent = n.nom;
  document.getElementById('dp-n').style.color  = col;
  document.getElementById('dp-c').textContent = n.categorie;
  document.getElementById('dp-c').style.color  = col + 'bb';

  const rels = ADJ[n.id] || [];
  const sourcesHtml = n.sources && n.sources.length
    ? `<div class="dp-lbl">Sources</div>
       <div class="dp-sources">${n.sources.map(s =>
         `<a class="dp-src" href="${s}" target="_blank" rel="noopener">${s.replace(/^https?:\/\//, '').split('/')[0]}</a>`
       ).join('')}</div>`
    : '';

  document.getElementById('dp-body').innerHTML = `
    <div class="dp-imp" style="color:${col}88">${impLabels[n.importance] || ''}</div>
    <div class="dp-lbl">En bref</div>
    <div class="dp-sm">${n.description_courte}</div>
    <div class="dp-pr">${n.description_longue}</div>
    ${sourcesHtml}
    <div class="dp-lbl">Connexions (${rels.length})</div>
    <div class="dp-rels">${rels.map(c => {
      const et  = ET[c.edge.type];
      const lbl = c.dir === 'out' ? et.label : '← ' + et.label;
      return `<div class="dp-rel" data-id="${c.node.id}">
        <span class="dp-rb" style="color:${et.color};border-color:${et.color}44;background:${et.color}11">${lbl}</span>
        <span class="dp-rn">${c.node.nom}</span>
        <span class="dp-rel-arrow" style="color:${CATS[c.node.categorie] ? CATS[c.node.categorie].color : '#8899aa'}88">· ${c.node.annee}</span>
      </div>`;
    }).join('')}</div>`;

  document.getElementById('dp-body').querySelectorAll('.dp-rel').forEach(el => {
    el.addEventListener('click', () => {
      const nn = nodeMap[el.dataset.id];
      if (nn) { flyTo(nn._wx, nn._wy, 1.8); openDetail(nn); }
    });
  });
  dpEl.classList.add('on');
  dirty = true; schedRender();
}
function closeDetail() {
  dpEl.classList.remove('on'); selectedNode = null;
  if (renderMode === 'constellation') exitConstellation();
  dirty = true; schedRender();
}
document.getElementById('dp-x').addEventListener('click', closeDetail);
document.getElementById('dp-const').addEventListener('click', () => { if (selectedNode) enterConstellation(selectedNode); });
document.getElementById('dp-story').addEventListener('click', () => {
  if (!selectedNode) return;
  const st = NARRATIVES.find(n => n.steps.some(s => s.id === selectedNode.id));
  if (st) openNarrative(st); else openNarrPanel();
});

/* ══════════════════════════════════════════════════════
   PARCOURS NARRATIFS (Contrôles UI)
   ══════════════════════════════════════════════════════ */
const npEl   = document.getElementById('np');
const btnNar = document.getElementById('btn-nar');
function openNarrPanel() { npEl.classList.add('on'); btnNar.classList.add('hide'); btnNar.setAttribute('aria-expanded','true'); }
function closeNarrPanel() { npEl.classList.remove('on'); btnNar.classList.remove('hide'); btnNar.setAttribute('aria-expanded','false'); }
btnNar.addEventListener('click', openNarrPanel);
document.getElementById('np-x').addEventListener('click', closeNarrPanel);

const npList = document.getElementById('np-list');
NARRATIVES.forEach(nar => {
  const div = document.createElement('div');
  div.className = 'np-st';
  div.innerHTML = `<div class="np-st-t">${nar.titre}</div><div class="np-st-d">${nar.desc}</div><div class="np-st-c">${nar.steps.length} étapes</div>`;
  div.addEventListener('click', () => openNarrative(nar));
  npList.appendChild(div);
});

function openNarrative(nar) {
  activeNarrative = nar; activeStep = 0;
  npList.querySelectorAll('.np-st').forEach((el, i) => el.classList.toggle('ak', NARRATIVES[i].id === nar.id));
  const stepsEl = document.getElementById('nsteps');
  document.getElementById('ns-t').textContent = nar.titre;
  const nsList = document.getElementById('ns-list');
  nsList.innerHTML = nar.steps.map((s, i) => {
    const n = nodeMap[s.id]; if (!n) return '';
    const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    return `<div class="ns-s${i === 0 ? ' ak' : ''}" data-idx="${i}">
      <span class="ns-n">${i + 1}</span>
      <div><div class="ns-nm" style="color:${col}">${n.nom}</div><div class="ns-nt">${s.note}</div></div>
    </div>`;
  }).join('');
  stepsEl.classList.add('on'); openNarrPanel(); updateNarrNav(); flyToStep(0);
  nsList.querySelectorAll('.ns-s').forEach(el => {
    el.addEventListener('click', () => {
      const i = +el.dataset.idx; activeStep = i;
      nsList.querySelectorAll('.ns-s').forEach((e, j) => e.classList.toggle('ak', j === i));
      updateNarrNav(); flyToStep(i); dirty = true; schedRender();
    });
  });
  dirty = true; schedRender();
}
function flyToStep(i) {
  const s = activeNarrative.steps[i]; if (!s) return;
  const n = nodeMap[s.id]; if (!n) return;
  flyTo(n._wx, n._wy, Math.max(cam.scale, 1.4));
}
function updateNarrNav() {
  document.getElementById('ns-prev').disabled = activeStep <= 0;
  document.getElementById('ns-next').disabled = activeStep >= activeNarrative.steps.length - 1;
}
document.getElementById('ns-prev').addEventListener('click', () => {
  if (activeStep > 0) { activeStep--; const els = document.getElementById('ns-list').querySelectorAll('.ns-s'); els.forEach((e,j) => e.classList.toggle('ak', j === activeStep)); updateNarrNav(); flyToStep(activeStep); dirty = true; schedRender(); }
});
document.getElementById('ns-next').addEventListener('click', () => {
  if (activeStep < activeNarrative.steps.length - 1) { activeStep++; const els = document.getElementById('ns-list').querySelectorAll('.ns-s'); els.forEach((e,j) => e.classList.toggle('ak', j === activeStep)); updateNarrNav(); flyToStep(activeStep); dirty = true; schedRender(); }
});
document.getElementById('ns-exit').addEventListener('click', () => {
  activeNarrative = null; activeStep = -1;
  document.getElementById('nsteps').classList.remove('on');
  npList.querySelectorAll('.np-st').forEach(el => el.classList.remove('ak'));
  dirty = true; schedRender();
});

/* ══════════════════════════════════════════════════════
   LÉGENDE
   ══════════════════════════════════════════════════════ */
const legEl = document.getElementById('leg');
legEl.innerHTML = `
<div class="leg-g">
  <div class="leg-gt">Catégories</div>
  ${Object.entries(CATS).map(([k,v]) => `
    <div class="leg-i"><div class="leg-dot" style="background:${v.color}"></div>${k}</div>`).join('')}
</div>
<div class="leg-g">
  <div class="leg-gt">Relations</div>
  ${Object.entries(ET).map(([k,v]) => `
    <div class="leg-i leg-rel on" data-type="${k}" style="cursor:pointer" title="Filtrer ${v.label}">
      <div class="leg-ln" style="border-color:${v.color};border-style:${v.dash.length ? 'dashed' : 'solid'}"></div>
      <span>${v.label}</span>
    </div>`).join('')}
</div>`;

legEl.querySelectorAll('.leg-rel').forEach(el => {
  el.addEventListener('click', () => {
    const type = el.dataset.type;
    if (activeEdgeFilters.has(type)) { activeEdgeFilters.delete(type); el.classList.remove('on'); el.style.opacity = '0.3'; }
    else { activeEdgeFilters.add(type); el.classList.add('on'); el.style.opacity = '1'; }
    dirty = true; schedRender();
  });
});

/* ══════════════════════════════════════════════════════
   ÉVÉNEMENTS
   ══════════════════════════════════════════════════════ */
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  if (renderMode === 'constellation') return;
  zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : .89);
  schedRender();
}, { passive: false });

let isDrag = false, dragSX = 0, dragSY = 0, dragCX = 0, dragCY = 0;
canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  isDrag = true; dragSX = e.clientX; dragSY = e.clientY; dragCX = cam.cx; dragCY = cam.cy;
  canvas.classList.add('drag');
});
window.addEventListener('mouseup', () => { isDrag = false; canvas.classList.remove('drag'); });
window.addEventListener('mousemove', e => {
  if (isDrag) {
    if (renderMode === 'map') { cam.cx = dragCX - (e.clientX - dragSX) / cam.scale; cam.cy = dragCY - (e.clientY - dragSY) / cam.scale; dirty = true; schedRender(); }
    return;
  }
  const n = hitNode(e.clientX, e.clientY);
  if (n) {
    if (!hoveredNode || hoveredNode.id !== n.id) { hoveredNode = n; dirty = true; schedRender(); }
    showTT(n, e.clientX, e.clientY); canvas.classList.add('hover');
  } else {
    if (hoveredNode) { hoveredNode = null; dirty = true; schedRender(); }
    hideTT(); canvas.classList.remove('hover');
  }
  const onYear = e.clientY > H - 62 && yearHitAreas.some(ya => Math.abs(e.clientX - ya.sx) < 18);
  canvas.style.cursor = onYear ? 'pointer' : '';
});
canvas.addEventListener('mouseleave', () => { hoveredNode = null; hideTT(); dirty = true; schedRender(); });

canvas.addEventListener('click', e => {
  const dx = Math.abs(e.clientX - dragSX), dy = Math.abs(e.clientY - dragSY);
  if (dx > 4 || dy > 4) return;

  if (e.clientY > H - 64) {
    for (const ya of yearHitAreas) {
      if (Math.abs(e.clientX - ya.sx) < 18) {
        flyTo(xY(ya.yr), cam.cy, Math.max(cam.scale, .35));
        return;
      }
    }
  }

  const n = hitNode(e.clientX, e.clientY);
  if (n) {
    if (renderMode === 'constellation') {
      exitConstellation(); flyTo(n._wx, n._wy, 1.8);
      setTimeout(() => openDetail(n), 400);
    } else {
      flyTo(n._wx, n._wy, Math.max(cam.scale, 1.4)); openDetail(n);
    }
  } else if (renderMode === 'map') {
    closeDetail();
  }
});

let tch = { x:0, y:0, cx:0, cy:0, dist:0, sc:0 };
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) { tch.x = e.touches[0].clientX; tch.y = e.touches[0].clientY; tch.cx = cam.cx; tch.cy = cam.cy; }
  else if (e.touches.length === 2) { tch.dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); tch.sc = cam.scale; }
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && renderMode === 'map') { cam.cx = tch.cx - (e.touches[0].clientX - tch.x) / cam.scale; cam.cy = tch.cy - (e.touches[0].clientY - tch.y) / cam.scale; dirty = true; schedRender(); }
  else if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); cam.scale = Math.max(.06, Math.min(5, tch.sc * (d / tch.dist))); dirty = true; schedRender(); }
}, { passive: false });

window.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== siEl) { e.preventDefault(); siEl.focus(); }
  if (e.key === 'Escape') {
    if (renderMode === 'constellation') exitConstellation();
    else closeDetail();
    srEl.classList.remove('on');
  }
  if (e.key === 'ArrowRight' && activeNarrative) document.getElementById('ns-next').click();
  if (e.key === 'ArrowLeft'  && activeNarrative) document.getElementById('ns-prev').click();
});

document.getElementById('btn-edges').addEventListener('click', function() { showEdges = !showEdges; this.classList.toggle('on', showEdges); dirty = true; schedRender(); });
document.getElementById('btn-labels').addEventListener('click', function() { showLabels = !showLabels; this.classList.toggle('on', showLabels); dirty = true; schedRender(); });
document.getElementById('z-in').addEventListener('click',  () => zoomAt(W/2, H/2, 1.35));
document.getElementById('z-out').addEventListener('click', () => zoomAt(W/2, H/2, .75));
document.getElementById('z-fit').addEventListener('click', zoomFit);
document.getElementById('mm').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  cam.cx = (e.clientX - r.left) / MMW * WW;
  cam.cy = (e.clientY - r.top)  / MMH * WH;
  dirty = true; schedRender();
});
window.addEventListener('resize', () => { setSize(); schedRender(); });

/* ══════════════════════════════════════════════════════
   INITIALISATION
   ══════════════════════════════════════════════════════ */
loadAtlasData();

function animationLoop() {
  // Les particules et la constellation nécessitent une animation continue
  const hasAnim = (showEdges && cam.scale > .12) || renderMode === 'constellation';
  if (hasAnim) dirty = true;
  if (dirty) {
    dirty = false;
    ctx.clearRect(0, 0, W, H);
    if (renderMode === 'constellation' && selectedNode) renderConstellation();
    else renderMap();
    renderMinimap();
  }
  requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);
