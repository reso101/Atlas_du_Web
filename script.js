'use strict';

/* ══════════════════════════════════════════════════════
   WEBCLAIR v3 — "Et Internet Fût"
   Atlas Vivant du Vocabulaire du Web 1970–2030+
   Architecture : AppState + 3 vues + Panneau Détail + Router
   ══════════════════════════════════════════════════════ */

/* ── CONSTANTES MONDE ────────────────────────────────── */
const WW = 6000, WH = 1200, YMIN = 1968, YMAX = 2032, MX = 380;
const xY = y => MX + ((y - YMIN) / (YMAX - YMIN)) * (WW - 2 * MX);

/* ── CATÉGORIES ──────────────────────────────────────── */
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

/* ── TYPES DE RELATIONS ──────────────────────────────── */
const ET = {
  INFLUENCE:       { color: "#1a7acc", dash: [4, 6],  label: "Influence",     w: .9,  speed: 1.2 },
  DEPENDS_ON:      { color: "#1aaa8a", dash: [],       label: "Dépend de",    w: .7,  speed: 1.5 },
  REPLACED_BY:     { color: "#dd8a3a", dash: [8, 4],  label: "Remplacé par",  w: 1.1, speed: 0.8 },
  EVOLVES_INTO:    { color: "#cc6aaa", dash: [6, 4],  label: "Évolue vers",   w: 1,   speed: 1.0 },
  STANDARDISATION: { color: "#8a6add", dash: [],       label: "Standardise",   w: .8,  speed: 0.6 },
  CONCURRENCE:     { color: "#e26a6a", dash: [3, 3],  label: "Concurrence",   w: 1,   speed: 2   },
};

/* ── PARCOURS NARRATIFS ──────────────────────────────── */
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

/* ── ÉTAT GLOBAL ─────────────────────────────────────── */
let NODES = [], EDGES = [], PROSPECTIVE = [];
const nodeMap = {}, ADJ = {};

/* ── APP STATE ───────────────────────────────────────── */
const App = {
  view: 'atlas',            // 'atlas' | 'encyclopedie' | 'prospectives'
  detailOpen: false,
  selectedNode: null,
  hoveredNode: null,
  showEdges: true,
  showLabels: true,
  activeNarrative: null,
  activeStep: -1,
  renderMode: 'map',        // 'map' | 'constellation'
  constAngle: 0,
  activeEdgeFilters: new Set(['INFLUENCE','DEPENDS_ON','REPLACED_BY','EVOLVES_INTO','STANDARDISATION','CONCURRENCE']),
  // Filtres Atlas
  filterCats: new Set(Object.keys(CATS)),
  filterImp: new Set([1, 2, 3]),
  filterYearMin: 1970,
  filterYearMax: 2030,
  // Filtres Encyclopédie
  encSort: 'alpha',
  encFilterCat: 'all',
  // Filtres Prospectives
  prospType: 'all',
};

/* ══════════════════════════════════════════════════════
   CHARGEMENT DES DONNÉES
   ══════════════════════════════════════════════════════ */
async function loadAtlasData() {
  try {
    updateIntroBar(20);
    const response = await fetch('data/atlas.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    updateIntroBar(50);
    const data = await response.json();
    NODES = data.nodes || [];
    EDGES = data.edges || [];
    PROSPECTIVE = data.prospective || [];

    updateIntroBar(70);

    // Index graphe
    NODES.forEach(n => { nodeMap[n.id] = n; ADJ[n.id] = []; });
    EDGES.forEach(e => {
      const sn = nodeMap[e.s], tn = nodeMap[e.t];
      if (!sn || !tn) return;
      ADJ[e.s].push({ node: tn, edge: e, dir: 'out' });
      ADJ[e.t].push({ node: sn, edge: e, dir: 'in' });
    });
    NODES.forEach(n => {
      n._relations     = ADJ[n.id];
      n._dep_count     = ADJ[n.id].length;
    });

    updateIntroBar(85);

    // Initialisation des filtres avec toutes les catégories
    App.filterCats = new Set(Object.keys(CATS));

    computeLayout();
    updateIntroBar(100);

    initAllUI();
    navigateTo(getHashView());

    setTimeout(() => {
      const intro = document.getElementById('intro');
      if (intro) {
        intro.classList.add('fade-out');
        setTimeout(() => { intro.style.display = 'none'; }, 600);
      }
    }, 800);

  } catch (err) {
    console.error('Erreur chargement atlas.json:', err);
    const introSub = document.querySelector('.intro__sub');
    if (introSub) {
      introSub.textContent = 'Erreur de chargement. Veuillez rafraîchir.';
      introSub.style.color = '#e26a6a';
    }
  }
}

function updateIntroBar(pct) {
  const bar = document.getElementById('intro-bar');
  if (bar) bar.style.width = pct + '%';
}

/* ══════════════════════════════════════════════════════
   LAYOUT SPATIAL
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
   HASH ROUTER
   ══════════════════════════════════════════════════════ */
function getHashView() {
  const h = window.location.hash.replace('#', '').split('?')[0];
  return ['atlas', 'encyclopedie', 'prospectives'].includes(h) ? h : 'atlas';
}

function navigateTo(view, pushState = false) {
  App.view = view;
  if (pushState) window.location.hash = view;

  // Activer la section
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
  const activeView = document.getElementById('view-' + view);
  if (activeView) activeView.classList.add('view--active');

  // Nav boutons
  document.querySelectorAll('.hd__nav-btn').forEach(btn => {
    const active = btn.dataset.view === view;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  // Sidebar
  document.querySelectorAll('.sidebar__section').forEach(s => {
    if (!s.id.startsWith('sb-')) return;
    const forView = s.id.replace('sb-', '');
    // Le panneau parcours est commun à atlas uniquement
    if (forView === 'parcours') {
      s.classList.toggle('hidden', view !== 'atlas');
    } else {
      s.classList.toggle('hidden', forView !== view);
    }
  });

  // Contrôles atlas dans header
  const atlasCtrl = document.getElementById('hd-atlas-ctrl');
  if (atlasCtrl) atlasCtrl.classList.toggle('hidden', view !== 'atlas');

  // Actions spécifiques
  if (view === 'atlas') {
    setSize();
    if (NODES.length > 0) { dirty = true; schedRender(); }
  } else if (view === 'encyclopedie') {
    renderEncyclo();
  } else if (view === 'prospectives') {
    renderProspectives();
  }
}

window.addEventListener('hashchange', () => navigateTo(getHashView()));

/* ══════════════════════════════════════════════════════
   INIT UI — initialisation de tous les éléments
   ══════════════════════════════════════════════════════ */
function initAllUI() {
  initSidebar();
  initSearch();
  initDetailPanel();
  initAtlasControls();
  initNarratives();
  initLegend();
  initCanvasEvents();
  initZoom();
  initNavBtns();
  zoomFit();
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════════════════ */
function initSidebar() {
  // Pills catégories Atlas
  const catPills = document.getElementById('cat-pills');
  if (catPills) {
    catPills.innerHTML = Object.entries(CATS).map(([cat, v]) => `
      <button class="cat-pill active" data-cat="${cat}" id="pill-atlas-${cat.replace(/[^a-z]/gi,'')}"
        style="color:${v.color};border-color:${v.color}60">
        <span class="cat-pill__dot" style="background:${v.color}"></span>${cat}
      </button>
    `).join('');
    catPills.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        if (App.filterCats.has(cat)) {
          App.filterCats.delete(cat);
          btn.classList.remove('active');
        } else {
          App.filterCats.add(cat);
          btn.classList.add('active');
        }
        dirty = true; schedRender(); updateAtlasStats();
      });
    });
  }

  // Range années Atlas
  const rangeMin = document.getElementById('range-min');
  const rangeMax = document.getElementById('range-max');
  const fromEl   = document.getElementById('range-from');
  const toEl     = document.getElementById('range-to');

  function updateRangeUI() {
    let a = +rangeMin.value, b = +rangeMax.value;
    if (a > b) [a, b] = [b, a];
    App.filterYearMin = a; App.filterYearMax = b;
    if (fromEl) fromEl.textContent = a;
    if (toEl)   toEl.textContent   = b;
    const fill = document.getElementById('range-fill');
    if (fill) {
      const pct1 = (a - 1970) / 60 * 100;
      const pct2 = (b - 1970) / 60 * 100;
      fill.style.left = pct1 + '%';
      fill.style.width = (pct2 - pct1) + '%';
    }
    dirty = true; schedRender(); updateAtlasStats();
  }

  if (rangeMin) rangeMin.addEventListener('input', updateRangeUI);
  if (rangeMax) rangeMax.addEventListener('input', updateRangeUI);

  // Importance toggles
  document.querySelectorAll('.imp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const imp = +btn.dataset.imp;
      if (App.filterImp.has(imp)) {
        App.filterImp.delete(imp);
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        App.filterImp.add(imp);
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
      dirty = true; schedRender(); updateAtlasStats();
    });
  });

  // Relations filter
  const filterRels = document.getElementById('filter-rels');
  if (filterRels) {
    filterRels.innerHTML = Object.entries(ET).map(([type, v]) => `
      <label class="rel-check">
        <input type="checkbox" data-rel="${type}" checked>
        <div class="rel-check__line" style="border-color:${v.color};border-style:${v.dash.length?'dashed':'solid'}"></div>
        <span class="rel-check__label">${v.label}</span>
      </label>
    `).join('');
    filterRels.querySelectorAll('input[data-rel]').forEach(cb => {
      cb.addEventListener('change', () => {
        const type = cb.dataset.rel;
        if (cb.checked) App.activeEdgeFilters.add(type);
        else App.activeEdgeFilters.delete(type);
        dirty = true; schedRender();
      });
    });
  }

  // Pills catégories Encyclopédie
  const encPills = document.getElementById('encyclo-cat-pills');
  if (encPills) {
    const allBtn = `<button class="cat-pill active" data-cat="all" id="enc-pill-all">Toutes</button>`;
    const catBtns = Object.entries(CATS).map(([cat, v]) => `
      <button class="cat-pill" data-cat="${cat}" id="enc-pill-${cat.replace(/[^a-z]/gi,'')}"
        style="--cat-c:${v.color}">
        <span class="cat-pill__dot" style="background:${v.color}"></span>${cat}
      </button>
    `).join('');
    encPills.innerHTML = allBtn + catBtns;
    encPills.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        encPills.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        App.encFilterCat = btn.dataset.cat;
        renderEncyclo();
      });
    });
  }

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      App.encSort = btn.dataset.sort;
      renderEncyclo();
    });
  });

  // Parcours list dans sidebar
  const parcoursListEl = document.getElementById('parcours-list');
  if (parcoursListEl) {
    parcoursListEl.innerHTML = NARRATIVES.map(nar => `
      <div class="parcours-item" data-nar="${nar.id}" tabindex="0">
        <div class="parcours-item__title">${nar.titre}</div>
        <div class="parcours-item__desc">${nar.desc}</div>
        <div class="parcours-item__count">${nar.steps.length} étapes</div>
      </div>
    `).join('');
    parcoursListEl.querySelectorAll('.parcours-item').forEach(el => {
      el.addEventListener('click', () => {
        const nar = NARRATIVES.find(n => n.id === el.dataset.nar);
        if (nar) {
          if (App.view !== 'atlas') navigateTo('atlas', true);
          setTimeout(() => openNarrative(nar), App.view === 'atlas' ? 0 : 300);
        }
      });
    });
  }

  updateAtlasStats();
}

function updateAtlasStats() {
  const filtered = getFilteredNodes();
  const filteredEdges = getFilteredEdges(filtered);
  const ns = document.getElementById('stats-nodes');
  const es = document.getElementById('stats-edges');
  if (ns) ns.textContent = filtered.length;
  if (es) es.textContent = filteredEdges.length;
}

function getFilteredNodes() {
  return NODES.filter(n =>
    App.filterCats.has(n.categorie) &&
    App.filterImp.has(n.importance) &&
    n.annee >= App.filterYearMin &&
    n.annee <= App.filterYearMax
  );
}

function getFilteredEdges(nodes) {
  const ids = new Set(nodes.map(n => n.id));
  return EDGES.filter(e =>
    App.activeEdgeFilters.has(e.type) &&
    ids.has(e.s) && ids.has(e.t)
  );
}

/* ══════════════════════════════════════════════════════
   NAVIGATION HEADER
   ══════════════════════════════════════════════════════ */
function initNavBtns() {
  document.querySelectorAll('.hd__nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view, true));
  });
}

/* ══════════════════════════════════════════════════════
   RECHERCHE UNIVERSELLE
   ══════════════════════════════════════════════════════ */
let srResults = [], srIdx = -1;

function initSearch() {
  const siEl = document.getElementById('si');
  const srEl = document.getElementById('sr');
  if (!siEl || !srEl) return;

  siEl.addEventListener('input', e => doSearch(e.target.value, siEl, srEl));
  siEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown')  { srIdx = Math.min(srIdx + 1, srResults.length - 1); renderSR(siEl, srEl); }
    else if (e.key === 'ArrowUp')   { srIdx = Math.max(srIdx - 1, -1); renderSR(siEl, srEl); }
    else if (e.key === 'Enter' && srIdx >= 0) { selectSR(srResults[srIdx], siEl, srEl); }
    else if (e.key === 'Escape') { srEl.classList.remove('open'); siEl.blur(); }
  });
  siEl.addEventListener('blur', () => setTimeout(() => srEl.classList.remove('open'), 200));

  window.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== siEl) { e.preventDefault(); siEl.focus(); }
    if (e.key === 'Escape') {
      if (App.renderMode === 'constellation') exitConstellation();
      else closeDetail();
      srEl.classList.remove('open');
    }
    if (e.key === 'ArrowRight' && App.activeNarrative) document.getElementById('ns-next').click();
    if (e.key === 'ArrowLeft'  && App.activeNarrative) document.getElementById('ns-prev').click();
  });
}

function doSearch(q, siEl, srEl) {
  if (!q || q.length < 2) { srEl.classList.remove('open'); srResults = []; return; }
  const lq = q.toLowerCase();
  srResults = NODES.filter(n =>
    n.nom.toLowerCase().includes(lq) ||
    n.description_courte.toLowerCase().includes(lq) ||
    n.categorie.toLowerCase().includes(lq) ||
    String(n.annee).includes(lq)
  ).slice(0, 10);
  srIdx = -1;
  renderSR(siEl, srEl);
}

function renderSR(siEl, srEl) {
  if (!srResults.length) { srEl.classList.remove('open'); return; }

  // Grouper par catégorie pour affichage enrichi
  const grouped = {};
  srResults.forEach(n => {
    if (!grouped[n.categorie]) grouped[n.categorie] = [];
    grouped[n.categorie].push(n);
  });

  let html = '', absIdx = 0;
  Object.entries(grouped).forEach(([cat, nodes]) => {
    const col = CATS[cat] ? CATS[cat].color : '#8899aa';
    html += `<div class="search__group-title" style="border-left:2px solid ${col}20;padding-left:10px">${cat}</div>`;
    nodes.forEach(n => {
      const focused = absIdx === srIdx;
      html += `<div class="search__item${focused ? ' focused' : ''}" data-id="${n.id}" role="option" aria-selected="${focused}">
        <div class="search__dot" style="background:${col}"></div>
        <span class="search__name">${n.nom}</span>
        <span class="search__year">${n.annee}</span>
      </div>`;
      absIdx++;
    });
  });

  srEl.innerHTML = html;
  srEl.classList.add('open');
  srEl.querySelectorAll('.search__item').forEach(el => {
    el.addEventListener('click', () => {
      const n = nodeMap[el.dataset.id];
      if (n) selectSR(n, siEl, srEl);
    });
  });
}

function selectSR(n, siEl, srEl) {
  siEl.value = '';
  srEl.classList.remove('open');
  srResults = [];

  if (App.view !== 'atlas') {
    navigateTo('atlas', true);
    setTimeout(() => { flyTo(n._wx, n._wy, 1.8); setTimeout(() => openDetail(n), 400); }, 300);
  } else {
    flyTo(n._wx, n._wy, 1.8);
    setTimeout(() => openDetail(n), 400);
  }
}

/* ══════════════════════════════════════════════════════
   PANNEAU DE DÉTAIL
   ══════════════════════════════════════════════════════ */
function initDetailPanel() {
  document.getElementById('dp-x').addEventListener('click', closeDetail);
  document.getElementById('dp-const').addEventListener('click', () => {
    if (App.selectedNode) enterConstellation(App.selectedNode);
  });
  document.getElementById('dp-story').addEventListener('click', () => {
    if (!App.selectedNode) return;
    const st = NARRATIVES.find(n => n.steps.some(s => s.id === App.selectedNode.id));
    if (st) openNarrative(st); else openNarrPanel();
  });

  // Fermer en cliquant à l'extérieur (uniquement en vue atlas)
  document.getElementById('main-zone').addEventListener('click', e => {
    if (App.view === 'atlas' && App.detailOpen && e.target === document.getElementById('cv')) {
      // géré par les events canvas
    }
  });
}

function openDetail(n) {
  App.selectedNode = n;
  App.detailOpen = true;
  const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
  const impLabels = { 1: '★ Fondamental', 2: '◆ Structurant', 3: '· Notable' };

  document.getElementById('dp-y').textContent = n.annee;
  document.getElementById('dp-n').textContent = n.nom;
  document.getElementById('dp-n').style.color  = col;

  const catEl = document.getElementById('dp-c');
  catEl.textContent = n.categorie;
  catEl.style.color = col;
  catEl.style.borderColor = col + '60';
  catEl.style.background = col + '15';

  const rels = ADJ[n.id] || [];

  const relsHtml = rels.length ? `
    <div class="dp-section">
      <div class="dp-section__label">Connexions (${rels.length})</div>
      <div class="dp-rels">
        ${rels.map(c => {
          const et  = ET[c.edge.type];
          const lbl = c.dir === 'out' ? et.label : '← ' + et.label;
          const nc  = CATS[c.node.categorie] ? CATS[c.node.categorie].color : '#8899aa';
          return `<div class="dp-rel" data-id="${c.node.id}" role="button" tabindex="0">
            <span class="dp-rel__type" style="color:${et.color};border-color:${et.color}50;background:${et.color}12">${lbl}</span>
            <span class="dp-rel__name" style="color:${nc}">${c.node.nom}</span>
            <span class="dp-rel__year">${c.node.annee}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  const sourcesHtml = n.sources && n.sources.length ? `
    <div class="dp-section">
      <div class="dp-section__label">Sources</div>
      <div class="dp-sources">
        ${n.sources.map(s => `<a class="dp-source" href="${s}" target="_blank" rel="noopener noreferrer">${s.replace(/^https?:\/\//, '').split('/')[0]}</a>`).join('')}
      </div>
    </div>
  ` : '';

  // Prospectives liées à ce nœud
  const linkedProsp = PROSPECTIVE.filter(p => p.signal_nodes && p.signal_nodes.includes(n.id));
  const prospHtml = linkedProsp.length ? `
    <div class="dp-section">
      <div class="dp-section__label">Prospectives liées</div>
      ${linkedProsp.map(p => `
        <div style="padding:8px 10px;background:var(--bg-raised);border:1px solid var(--border);border-radius:var(--r-sm);margin-bottom:8px;cursor:pointer" data-prosp="${p.id}">
          <div style="font-size:0.62rem;color:var(--accent-pulse);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px">${p.type} · ${p.horizon}</div>
          <div style="font-size:0.72rem;color:var(--text-1)">${p.titre}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  document.getElementById('dp-body').innerHTML = `
    <div class="dp-section">
      <div class="dp-section__label">En bref</div>
      <div class="dp-section__text dp-section__text--short" style="color:${col}">${n.description_courte}</div>
    </div>
    <div class="dp-section">
      <div class="dp-section__label">Définition</div>
      <div class="dp-section__text">${n.description_longue}</div>
    </div>
    ${relsHtml}
    ${prospHtml}
    ${sourcesHtml}
  `;

  // Events sur les relations
  document.getElementById('dp-body').querySelectorAll('.dp-rel').forEach(el => {
    el.addEventListener('click', () => {
      const nn = nodeMap[el.dataset.id];
      if (nn) {
        if (App.view === 'atlas') { flyTo(nn._wx, nn._wy, 1.8); }
        openDetail(nn);
      }
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') el.click();
    });
  });

  // Events prospectives liées
  document.getElementById('dp-body').querySelectorAll('[data-prosp]').forEach(el => {
    el.addEventListener('click', () => {
      navigateTo('prospectives', true);
    });
  });

  const dpEl = document.getElementById('dp');
  dpEl.classList.remove('closed');
  dpEl.removeAttribute('aria-hidden');
  document.getElementById('app-layout').classList.remove('panel-closed');

  dirty = true; schedRender();
}

function closeDetail() {
  App.selectedNode = null;
  App.detailOpen = false;
  if (App.renderMode === 'constellation') exitConstellation();

  const dpEl = document.getElementById('dp');
  dpEl.classList.add('closed');
  dpEl.setAttribute('aria-hidden', 'true');
  document.getElementById('app-layout').classList.add('panel-closed');

  dirty = true; schedRender();
}

/* ══════════════════════════════════════════════════════
   VUE ENCYCLOPÉDIE
   ══════════════════════════════════════════════════════ */
let encRendered = 0;
const ENC_BATCH = 40;

function getFilteredSortedNodes() {
  let nodes = [...NODES];

  if (App.encFilterCat !== 'all') {
    nodes = nodes.filter(n => n.categorie === App.encFilterCat);
  }

  switch (App.encSort) {
    case 'alpha':       nodes.sort((a, b) => a.nom.localeCompare(b.nom, 'fr')); break;
    case 'chrono':      nodes.sort((a, b) => a.annee - b.annee || a.nom.localeCompare(b.nom, 'fr')); break;
    case 'importance':  nodes.sort((a, b) => a.importance - b.importance || a.nom.localeCompare(b.nom, 'fr')); break;
    case 'categorie':   nodes.sort((a, b) => a.categorie.localeCompare(b.categorie, 'fr') || a.nom.localeCompare(b.nom, 'fr')); break;
  }
  return nodes;
}

function renderEncyclo() {
  const grid = document.getElementById('encyclo-grid');
  if (!grid) return;

  const nodes = getFilteredSortedNodes();

  // Mise à jour méta
  const meta = document.getElementById('encyclo-meta');
  if (meta) meta.textContent = `${nodes.length} entrée${nodes.length > 1 ? 's' : ''}`;
  const count = document.getElementById('encyclo-count');
  if (count) count.textContent = nodes.length;

  grid.innerHTML = '';

  if (nodes.length === 0) {
    grid.innerHTML = `<div style="text-align:center;color:var(--text-3);padding:40px;font-size:0.8rem">Aucune entrée ne correspond aux filtres.</div>`;
    return;
  }

  // Grouper selon le tri
  const groups = {};
  const groupOrder = [];

  nodes.forEach(n => {
    let key = '';
    if (App.encSort === 'chrono') {
      key = String(n.annee || 'Année inconnue');
    } else if (App.encSort === 'categorie') {
      key = n.categorie;
    } else if (App.encSort === 'importance') {
      const impLabels = { 1: '★ Fondamental', 2: '◆ Structurant', 3: '· Notable' };
      key = impLabels[n.importance] || 'Autre';
    } else {
      // alphabétique
      key = n.nom ? n.nom.charAt(0).toUpperCase() : '#';
      if (!/[A-Z]/.test(key)) key = '#';
    }

    if (!groups[key]) {
      groups[key] = [];
      groupOrder.push(key);
    }
    groups[key].push(n);
  });

  // Rendre chaque groupe
  groupOrder.forEach(key => {
    const groupNodes = groups[key];
    
    const section = document.createElement('section');
    section.className = 'encyclo__year-section';

    const title = document.createElement('h2');
    title.className = 'encyclo__year-title';
    title.innerHTML = `<span>${key}</span> <span class="encyclo__year-count">${groupNodes.length} entrée${groupNodes.length > 1 ? 's' : ''}</span>`;
    section.appendChild(title);

    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'encyclo__year-grid';

    groupNodes.forEach(n => {
      cardsGrid.appendChild(makeEncCard(n));
    });

    section.appendChild(cardsGrid);
    grid.appendChild(section);
  });
}

function makeEncCard(n) {
  const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
  const impIcons = { 1: '★★★', 2: '★★☆', 3: '★☆☆' };
  const rels = ADJ[n.id] || [];

  const div = document.createElement('article');
  div.className = 'enc-card';
  div.setAttribute('role', 'listitem');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `${n.nom}, ${n.categorie}, ${n.annee}`);
  div.style.setProperty('--cat-col', col);
  div.style.borderColor = col + '25';

  // Hover glow
  div.addEventListener('mouseenter', () => {
    div.style.boxShadow = `0 12px 40px rgba(0,0,0,.4), 0 0 30px ${col}25`;
    div.style.borderColor = col + '60';
  });
  div.addEventListener('mouseleave', () => {
    div.style.boxShadow = '';
    div.style.borderColor = col + '25';
  });

  div.innerHTML = `
    <div class="enc-card__top">
      <span class="enc-card__year">${n.annee}</span>
      <span class="enc-card__badge" style="color:${col};border-color:${col}50;background:${col}12">
        <span class="enc-card__dot" style="background:${col}"></span>${n.categorie}
      </span>
    </div>
    <div class="enc-card__name">${n.nom}</div>
    <div class="enc-card__desc">${n.description_courte}</div>
    <div class="enc-card__footer">
      <span class="enc-card__footer-item">${rels.length} connexion${rels.length !== 1 ? 's' : ''}</span>
      ${n.sources && n.sources.length ? `<span class="enc-card__footer-item">◉ ${n.sources.length} source${n.sources.length > 1 ? 's' : ''}</span>` : ''}
      <span class="enc-card__imp" style="color:${col}88" title="Importance">${impIcons[n.importance] || ''}</span>
    </div>
  `;

  div.addEventListener('click', () => openDetail(n));
  div.addEventListener('keydown', e => { if (e.key === 'Enter') div.click(); });

  return div;
}

/* ══════════════════════════════════════════════════════
   VUE PROSPECTIVES
   ══════════════════════════════════════════════════════ */
function renderProspectives() {
  const timeline = document.getElementById('prosp-timeline');
  if (!timeline) return;

  let prosps = [...PROSPECTIVE];
  if (App.prospType !== 'all') prosps = prosps.filter(p => p.type === App.prospType);
  prosps.sort((a, b) => a.horizon - b.horizon);

  if (!prosps.length) {
    timeline.innerHTML = `<div style="text-align:center;color:var(--text-3);padding:40px;font-size:0.8rem">Aucune prospective disponible pour ce filtre.</div>`;
    return;
  }

  timeline.innerHTML = prosps.map((p, i) => {
    const pct = Math.round(p.probabilite * 100);
    const signals = (p.signal_nodes || []).map(id => {
      const n = nodeMap[id];
      return n ? `<button class="prosp-card__signal" data-id="${id}">${n.nom}</button>` : '';
    }).join('');

    return `
      <article class="prosp-card prosp-card--${p.type}" role="listitem"
        style="animation-delay:${i * 0.08}s">
        <div class="prosp-card__top">
          <span class="prosp-card__type prosp-card__type--${p.type}">${p.type}</span>
          <span class="prosp-card__horizon">Horizon : ${p.horizon}</span>
        </div>
        <div class="prosp-card__title">${p.titre}</div>
        <div class="prosp-card__prob">
          <div class="prosp-card__prob-label">
            <span>Probabilité</span>
            <span class="prosp-card__prob-val">${pct}%</span>
          </div>
          <div class="prosp-card__prob-track">
            <div class="prosp-card__prob-fill" style="--prob:${p.probabilite}"></div>
          </div>
        </div>
        <div class="prosp-card__desc">${p.description}</div>
        ${signals ? `<div class="prosp-card__signals">${signals}</div>` : ''}
      </article>
    `;
  }).join('');

  // Animer les barres avec IntersectionObserver
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const fill = card.querySelector('.prosp-card__prob-fill');
        const prob = parseFloat(card.querySelector('.prosp-card__prob-fill')?.style?.getPropertyValue('--prob') || '0.5');
        if (fill) fill.style.width = (prob * 100) + '%';
        card.classList.add('animated');
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.2 });

  timeline.querySelectorAll('.prosp-card').forEach(card => observer.observe(card));

  // Clic sur signaux → ouvre le détail du nœud
  timeline.querySelectorAll('.prosp-card__signal').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const n = nodeMap[btn.dataset.id];
      if (n) openDetail(n);
    });
  });

  // Filtres types prospectives
  document.querySelectorAll('#prosp-type-pills .cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#prosp-type-pills .cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      App.prospType = btn.dataset.type || btn.dataset.cat || 'all';
      renderProspectives();
    });
  });
}

/* ══════════════════════════════════════════════════════
   LÉGENDE ATLAS
   ══════════════════════════════════════════════════════ */
function initLegend() {
  const legEl = document.getElementById('leg');
  if (!legEl) return;

  legEl.innerHTML = `
    <div class="leg__group">
      <div class="leg__group-title">Catégories</div>
      ${Object.entries(CATS).map(([k, v]) => `
        <div class="leg__item">
          <div class="leg__dot" style="background:${v.color}"></div>${k}
        </div>
      `).join('')}
    </div>
    <div class="leg__group">
      <div class="leg__group-title">Relations</div>
      ${Object.entries(ET).map(([k, v]) => `
        <div class="leg__item">
          <div class="leg__line" style="border-color:${v.color};border-style:${v.dash.length?'dashed':'solid'}"></div>
          ${v.label}
        </div>
      `).join('')}
    </div>
  `;
}

/* ══════════════════════════════════════════════════════
   CONTRÔLES ATLAS (header)
   ══════════════════════════════════════════════════════ */
function initAtlasControls() {
  document.getElementById('btn-edges').addEventListener('click', function() {
    App.showEdges = !App.showEdges;
    this.classList.toggle('active', App.showEdges);
    this.setAttribute('aria-pressed', App.showEdges ? 'true' : 'false');
    dirty = true; schedRender();
  });
  document.getElementById('btn-labels').addEventListener('click', function() {
    App.showLabels = !App.showLabels;
    this.classList.toggle('active', App.showLabels);
    this.setAttribute('aria-pressed', App.showLabels ? 'true' : 'false');
    dirty = true; schedRender();
  });
}

/* ══════════════════════════════════════════════════════
   PARCOURS NARRATIFS (Atlas)
   ══════════════════════════════════════════════════════ */
function initNarratives() {
  const btnNar = document.getElementById('btn-nar');
  const npEl   = document.getElementById('np');

  if (btnNar) btnNar.addEventListener('click', openNarrPanel);
  const npX = document.getElementById('np-x');
  if (npX) npX.addEventListener('click', closeNarrPanel);

  // Peupler la liste parcours dans le panneau narratifs du canvas
  const npList = document.getElementById('np-list');
  if (npList) {
    npList.innerHTML = NARRATIVES.map(nar => `
      <div class="np__item" data-nar="${nar.id}" tabindex="0">
        <div class="np__item-title">${nar.titre}</div>
        <div class="np__item-desc">${nar.desc}</div>
        <div class="np__item-count">${nar.steps.length} étapes</div>
      </div>
    `).join('');
    npList.querySelectorAll('.np__item').forEach(el => {
      el.addEventListener('click', () => {
        const nar = NARRATIVES.find(n => n.id === el.dataset.nar);
        if (nar) openNarrative(nar);
      });
    });
  }

  // Navigation étapes
  document.getElementById('ns-prev').addEventListener('click', () => {
    if (App.activeStep > 0) { App.activeStep--; updateNarrNav(); flyToStep(App.activeStep); dirty = true; schedRender(); }
  });
  document.getElementById('ns-next').addEventListener('click', () => {
    if (App.activeStep < App.activeNarrative.steps.length - 1) { App.activeStep++; updateNarrNav(); flyToStep(App.activeStep); dirty = true; schedRender(); }
  });
  document.getElementById('ns-exit').addEventListener('click', () => {
    App.activeNarrative = null; App.activeStep = -1;
    document.getElementById('nsteps').classList.remove('open');
    if (npList) npList.querySelectorAll('.np__item').forEach(el => el.classList.remove('active'));
    dirty = true; schedRender();
  });
}

function openNarrPanel() {
  const npEl = document.getElementById('np');
  const btnNar = document.getElementById('btn-nar');
  if (npEl) { npEl.classList.add('open'); npEl.setAttribute('aria-hidden', 'false'); }
  if (btnNar) { btnNar.classList.add('hidden'); btnNar.setAttribute('aria-expanded', 'true'); }
}

function closeNarrPanel() {
  const npEl = document.getElementById('np');
  const btnNar = document.getElementById('btn-nar');
  if (npEl) { npEl.classList.remove('open'); npEl.setAttribute('aria-hidden', 'true'); }
  if (btnNar) { btnNar.classList.remove('hidden'); btnNar.setAttribute('aria-expanded', 'false'); }
}

function openNarrative(nar) {
  App.activeNarrative = nar; App.activeStep = 0;

  const npList = document.getElementById('np-list');
  if (npList) {
    npList.querySelectorAll('.np__item').forEach(el => {
      el.classList.toggle('active', el.dataset.nar === nar.id);
    });
  }

  const stepsEl = document.getElementById('nsteps');
  const nsTEl   = document.getElementById('ns-t');
  const nsList  = document.getElementById('ns-list');
  if (nsTEl) nsTEl.textContent = nar.titre;

  if (nsList) {
    nsList.innerHTML = nar.steps.map((s, i) => {
      const n = nodeMap[s.id]; if (!n) return '';
      const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
      return `<div class="nstep${i === 0 ? ' active' : ''}" data-idx="${i}">
        <span class="nstep__num">${i + 1}</span>
        <div>
          <div class="nstep__name" style="color:${col}">${n.nom}</div>
          <div class="nstep__note">${s.note}</div>
        </div>
      </div>`;
    }).join('');

    nsList.querySelectorAll('.nstep').forEach(el => {
      el.addEventListener('click', () => {
        App.activeStep = +el.dataset.idx;
        nsList.querySelectorAll('.nstep').forEach((e, j) => e.classList.toggle('active', j === App.activeStep));
        updateNarrNav(); flyToStep(App.activeStep); dirty = true; schedRender();
      });
    });
  }

  if (stepsEl) stepsEl.classList.add('open');
  openNarrPanel();
  updateNarrNav();
  flyToStep(0);
  dirty = true; schedRender();
}

function flyToStep(i) {
  const s = App.activeNarrative.steps[i]; if (!s) return;
  const n = nodeMap[s.id]; if (!n) return;
  flyTo(n._wx, n._wy, Math.max(cam.scale, 1.4));
}

function updateNarrNav() {
  const prev = document.getElementById('ns-prev');
  const next = document.getElementById('ns-next');
  if (prev) prev.disabled = App.activeStep <= 0;
  if (next) next.disabled = App.activeStep >= App.activeNarrative.steps.length - 1;

  // Mettre à jour la step active dans la liste
  const nsList = document.getElementById('ns-list');
  if (nsList) {
    nsList.querySelectorAll('.nstep').forEach((e, j) => e.classList.toggle('active', j === App.activeStep));
  }
}

/* ══════════════════════════════════════════════════════
   CAMÉRA & CANVAS ENGINE
   ══════════════════════════════════════════════════════ */
let W = 800, H = 600;
const cam = { cx: WW / 2, cy: WH / 2, scale: .15 };
let dirty = true;
let camAnim = null;

const canvas = document.getElementById('cv');
const ctx    = canvas ? canvas.getContext('2d') : null;
const mmc    = document.getElementById('mmc');
const mmctx  = mmc ? mmc.getContext('2d') : null;

function setSize() {
  const main = document.getElementById('main-zone');
  if (main && canvas) {
    const r = main.getBoundingClientRect();
    W = r.width || window.innerWidth - 270;
    H = r.height || window.innerHeight - 64;
    canvas.width = W;
    canvas.height = H;
  } else {
    W = window.innerWidth;
    H = window.innerHeight;
    if (canvas) { canvas.width = W; canvas.height = H; }
  }
  dirty = true;
}

function schedRender() { dirty = true; }

function w2s(wx, wy) {
  return { sx: (wx - cam.cx) * cam.scale + W / 2, sy: (wy - cam.cy) * cam.scale + H / 2 };
}
function s2w(sx, sy) {
  return { wx: (sx - W / 2) / cam.scale + cam.cx, wy: (sy - H / 2) / cam.scale + cam.cy };
}

function hexA(a) {
  return Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
}

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
  const nodes = getFilteredNodes();
  if (!nodes.length) return;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  nodes.forEach(n => { x0 = Math.min(x0, n._wx); x1 = Math.max(x1, n._wx); y0 = Math.min(y0, n._wy); y1 = Math.max(y1, n._wy); });
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const sc = Math.min((W - 140) / (x1 - x0 + 300), (H - 100) / (y1 - y0 + 200), .4);
  flyTo(cx, cy, sc, 700);
}

function zoomAt(sx, sy, factor) {
  const { wx, wy } = s2w(sx, sy);
  cam.scale = Math.max(.04, Math.min(5, cam.scale * factor));
  cam.cx = wx - (sx - W / 2) / cam.scale;
  cam.cy = wy - (sy - H / 2) / cam.scale;
  dirty = true;
}

/* ── Visibilité LOD ──────────────────────────────────── */
function isNodeVisible(n) {
  const sc = cam.scale;
  const imp = n.importance || 2;

  // Filtres sidebar
  if (!App.filterCats.has(n.categorie)) return false;
  if (!App.filterImp.has(n.importance)) return false;
  if (n.annee < App.filterYearMin || n.annee > App.filterYearMax) return false;

  // Toujours montrer les nœuds du parcours actif ou sélectionnés
  if (App.activeNarrative && App.activeNarrative.steps.some(s => s.id === n.id)) return true;
  if (App.selectedNode && App.selectedNode.id === n.id) return true;
  if (App.hoveredNode && App.hoveredNode.id === n.id) return true;

  // LOD selon zoom
  if (sc < 0.12) return imp === 1;
  if (sc < 0.28) return imp === 1 || imp === 2;
  return true;
}

/* ── MODE CONSTELLATION ──────────────────────────────── */
let constAngle = 0;
function enterConstellation(n) {
  App.renderMode = 'constellation';
  App.selectedNode = n;
  constAngle = 0;
  const csh = document.getElementById('csh');
  if (csh) csh.classList.add('visible');
  dirty = true; schedRender();
}
function exitConstellation() {
  App.renderMode = 'map';
  const csh = document.getElementById('csh');
  if (csh) csh.classList.remove('visible');
  dirty = true; schedRender();
}

/* ══════════════════════════════════════════════════════
   RENDU CANVAS
   ══════════════════════════════════════════════════════ */
let yearHitAreas = [];

function renderMap() {
  drawGrid();
  drawLanes();
  if (App.showEdges && cam.scale > .12) drawEdges();
  if (App.activeNarrative && App.activeStep >= 0) drawNarrPath();
  drawNodes();
  if (App.showLabels || cam.scale > .28) drawLabels();
}

/* ── Grille temporelle ───────────────────────────────── */
function drawGrid() {
  yearHitAreas = [];
  const sc = cam.scale;

  for (let yr = 1970; yr <= 2032; yr += 5) {
    const { sx } = w2s(xY(yr), 0);
    if (sx < -10 || sx > W + 10) continue;
    const isDecade = yr % 10 === 0;
    ctx.strokeStyle = isDecade ? '#1a7acc18' : '#1a7acc08';
    ctx.lineWidth = isDecade ? 1 : .5;
    ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();

    if (sc > .1) {
      ctx.font = `${isDecade ? '500' : '400'} ${isDecade ? 10 : 8}px IBM Plex Mono`;
      ctx.fillStyle = isDecade ? '#4f87aa' : '#2d5a7a';
      ctx.textAlign = 'center';
      ctx.fillText(yr, sx, H - 8);
      yearHitAreas.push({ yr, sx });
    }
  }
}

/* ── Couloirs catégories ─────────────────────────────── */
function drawLanes() {
  if (cam.scale < 0.18) return;
  Object.entries(CATS).forEach(([cat, v]) => {
    const y = v.ly * WH;
    const { sy } = w2s(0, y);
    if (sy < -20 || sy > H + 20) return;
    ctx.fillStyle = v.color + '08';
    ctx.fillRect(0, sy - 35, W, 70);
    if (cam.scale > .22) {
      ctx.font = '7px IBM Plex Mono';
      ctx.fillStyle = v.color + '50';
      ctx.textAlign = 'left';
      ctx.fillText(cat.toUpperCase(), 8, sy - 20);
    }
  });
}

/* ── Arêtes ──────────────────────────────────────────── */
const time_ref = performance.now();
function drawEdges() {
  const time = performance.now() - time_ref;
  const visNodes = new Set(NODES.filter(isNodeVisible).map(n => n.id));

  EDGES.forEach(e => {
    if (!App.activeEdgeFilters.has(e.type)) return;
    if (!visNodes.has(e.s) || !visNodes.has(e.t)) return;
    const sn = nodeMap[e.s], tn = nodeMap[e.t];
    if (!sn || !tn) return;
    const et = ET[e.type];
    const p1 = w2s(sn._wx, sn._wy);
    const p2 = w2s(tn._wx, tn._wy);
    if (p1.sx < -50 && p2.sx < -50) return;
    if (p1.sx > W + 50 && p2.sx > W + 50) return;

    ctx.beginPath();
    ctx.setLineDash(et.dash);
    ctx.strokeStyle = et.color + '35';
    ctx.lineWidth = et.w;
    ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
    ctx.setLineDash([]);

    // Particule animée
    if (cam.scale > .2) {
      const spd = et.speed || 1;
      const t = ((time / 2200 * spd) % 1);
      ctx.beginPath();
      ctx.arc(p1.sx + (p2.sx - p1.sx) * t, p1.sy + (p2.sy - p1.sy) * t, 2, 0, Math.PI * 2);
      ctx.fillStyle = et.color + 'bb';
      ctx.fill();
    }
  });
}

/* ── Chemin narratif ─────────────────────────────────── */
function drawNarrPath() {
  const steps = App.activeNarrative.steps;
  for (let i = 0; i < steps.length - 1; i++) {
    const a = nodeMap[steps[i].id], b = nodeMap[steps[i + 1].id];
    if (!a || !b) continue;
    const p1 = w2s(a._wx, a._wy), p2 = w2s(b._wx, b._wy);
    ctx.beginPath();
    ctx.strokeStyle = '#00d4aa60';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
    ctx.setLineDash([]);
  }
}

/* ── Nœuds ───────────────────────────────────────────── */
function drawNodes() {
  NODES.forEach(n => {
    if (!isNodeVisible(n)) return;
    const { sx, sy } = w2s(n._wx, n._wy);
    if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) return;

    const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    const isSelected = App.selectedNode && App.selectedNode.id === n.id;
    const isHovered  = App.hoveredNode  && App.hoveredNode.id  === n.id;
    const isInNarr   = App.activeNarrative && App.activeNarrative.steps.some(s => s.id === n.id);
    const isActiveStep = App.activeNarrative && App.activeStep >= 0 &&
                         App.activeNarrative.steps[App.activeStep]?.id === n.id;

    const baseR = n.importance === 1 ? 7 : n.importance === 2 ? 5 : 3.5;
    const r = isSelected || isActiveStep ? baseR * 1.8 : isHovered ? baseR * 1.5 : baseR;

    // Halos
    if (isSelected || isHovered || isActiveStep) {
      [r + 7, r + 14].forEach((gr, gi) => {
        ctx.beginPath(); ctx.arc(sx, sy, gr, 0, Math.PI * 2);
        ctx.strokeStyle = col + ['40', '18'][gi]; ctx.lineWidth = 1; ctx.stroke();
      });
    }
    if (isInNarr && !isActiveStep) {
      ctx.beginPath(); ctx.arc(sx, sy, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#00d4aa35'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    // Nœud
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
    if (isSelected || isActiveStep) {
      const g = ctx.createRadialGradient(sx - r * .3, sy - r * .3, 0, sx, sy, r);
      g.addColorStop(0, col + 'ff'); g.addColorStop(1, col + 'aa');
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = isHovered ? col : col + 'cc';
    }
    ctx.fill();
  });
}

/* ── Labels ──────────────────────────────────────────── */
function drawLabels() {
  ctx.textAlign = 'center';
  NODES.forEach(n => {
    if (!isNodeVisible(n)) return;
    const { sx, sy } = w2s(n._wx, n._wy);
    if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) return;

    const col = CATS[n.categorie] ? CATS[n.categorie].color : '#8899aa';
    const isHov = App.hoveredNode && App.hoveredNode.id === n.id;
    const isAct = App.selectedNode && App.selectedNode.id === n.id;
    const baseR = n.importance === 1 ? 7 : n.importance === 2 ? 5 : 3.5;
    const r = isAct ? baseR * 1.8 : isHov ? baseR * 1.5 : baseR;

    // Visibilité basée sur importance + zoom
    const imp = n.importance;
    if (cam.scale < .15 && imp > 1) return;
    if (cam.scale < .25 && imp > 2) return;

    ctx.font = `${isHov || isAct ? '500' : '400'} ${isHov || isAct ? 11 : 9}px IBM Plex Mono`;
    ctx.fillStyle = col + (isHov || isAct ? 'ff' : '99');
    ctx.fillText(n.nom, sx, sy + r + 10);
  });
}

/* ── Mode Constellation ──────────────────────────────── */
function renderConstellation() {
  if (!App.selectedNode) return;
  constAngle += 0.003;

  const col  = CATS[App.selectedNode.categorie]?.color || '#8899aa';
  const cx = W / 2, cy = H / 2;
  const conns = ADJ[App.selectedNode.id] || [];

  // Fond radial
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
  grad.addColorStop(0, col + '06'); grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  // Organiser par type
  const byType = {};
  conns.forEach(c => { const t = c.edge.type; if (!byType[t]) byType[t] = []; byType[t].push(c); });
  const typeOrder = ['EVOLVES_INTO','INFLUENCE','DEPENDS_ON','REPLACED_BY','STANDARDISATION','CONCURRENCE'];
  const radii = [180, 260, 340];
  let orbit = 0;

  typeOrder.forEach(type => {
    const cs = byType[type] || []; if (!cs.length) return;
    const et = ET[type];
    const r = radii[Math.min(orbit, radii.length - 1)];
    const dir = orbit % 2 === 0 ? 1 : -1;

    // Anneau orbital
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = col + '12'; ctx.lineWidth = 1; ctx.stroke();

    cs.forEach((c, i) => {
      const baseAngle = (i / cs.length) * Math.PI * 2 + (orbit * Math.PI * .6);
      const a = baseAngle + constAngle * dir * .5;
      const nx = cx + Math.cos(a) * r, ny = cy + Math.sin(a) * r;
      const nc = CATS[c.node.categorie]?.color || '#8899aa';

      // Lien
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
      ctx.strokeStyle = et.color + '30'; ctx.lineWidth = 1;
      ctx.setLineDash(et.dash); ctx.stroke(); ctx.setLineDash([]);

      // Nœud satellite
      const isHov = App.hoveredNode && App.hoveredNode.id === c.node.id;
      const nr = isHov ? 8 : 5;
      ctx.beginPath(); ctx.arc(nx, ny, nr, 0, Math.PI * 2);
      ctx.fillStyle = isHov ? nc : nc + 'cc'; ctx.fill();

      // Label
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.font = `${isHov ? '500' : '400'} ${isHov ? 10 : 9}px IBM Plex Mono`;
      ctx.fillStyle = nc + (isHov ? 'ff' : 'cc');
      ctx.fillText(c.node.nom, nx, ny + nr + 5);
    });
    orbit++;
  });

  // Nœud central
  [22, 32, 44, 60].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = col + ['33','28','18','0c'][i]; ctx.lineWidth = 1; ctx.stroke();
  });
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fillStyle = col + '22'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.font = '500 15px IBM Plex Mono'; ctx.fillStyle = col;
  ctx.fillText(App.selectedNode.nom, cx, cy + 22);
  ctx.font = '9px IBM Plex Mono'; ctx.fillStyle = col + 'aa';
  ctx.fillText(App.selectedNode.annee + ' · ' + App.selectedNode.categorie, cx, cy + 40);
}

/* ── Minimap ─────────────────────────────────────────── */
const MMW = 178, MMH = 58, MMPad = 8;
function renderMinimap() {
  if (!mmctx) return;
  mmctx.clearRect(0, 0, MMW, MMH);
  mmctx.fillStyle = 'rgba(10,14,23,.7)'; mmctx.fillRect(0, 0, MMW, MMH);
  const sx = wx => MMPad + (wx / WW) * (MMW - MMPad * 2);
  const sy = wy => MMPad + (wy / WH) * (MMH - MMPad * 2);
  NODES.filter(isNodeVisible).forEach(n => {
    const col = CATS[n.categorie]?.color || '#8899aa';
    mmctx.beginPath(); mmctx.arc(sx(n._wx), sy(n._wy), 1.5, 0, Math.PI * 2);
    mmctx.fillStyle = col + 'cc'; mmctx.fill();
  });
  const { wx: vx0, wy: vy0 } = s2w(0, 0);
  const { wx: vx1, wy: vy1 } = s2w(W, H);
  const rx = sx(vx0), ry = sy(vy0), rw = sx(vx1) - rx, rh = sy(vy1) - ry;
  mmctx.strokeStyle = 'rgba(0,212,170,.7)'; mmctx.lineWidth = 1;
  mmctx.strokeRect(Math.max(0, rx), Math.max(0, ry), Math.min(rw, MMW - rx), Math.min(rh, MMH - ry));
}

/* ── Hit Test ────────────────────────────────────────── */
function hitNode(mx, my) {
  if (App.renderMode === 'constellation') {
    const cx = W / 2, cy = H / 2;
    const conns = ADJ[App.selectedNode.id] || [];
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
    if (!isNodeVisible(n)) return;
    const { sx, sy } = w2s(n._wx, n._wy);
    const d = (mx - sx)**2 + (my - sy)**2;
    if (d < minD) { minD = d; closest = n; }
  });
  return closest;
}

/* ══════════════════════════════════════════════════════
   TOOLTIP
   ══════════════════════════════════════════════════════ */
function showTT(n, mx, my) {
  const ttEl = document.getElementById('tt');
  if (!ttEl) return;
  const col = CATS[n.categorie]?.color || '#8899aa';
  document.getElementById('tt-n').textContent = n.nom;
  document.getElementById('tt-n').style.color  = col;
  document.getElementById('tt-m').textContent = n.annee + ' · ' + n.categorie;
  document.getElementById('tt-d').textContent = n.description_courte;
  let tx = mx + 14, ty = my - 12;
  if (tx + 250 > W) tx = mx - 256;
  if (ty + 140 > H - 52) ty = my - 140;
  ttEl.style.left = tx + 'px'; ttEl.style.top = ty + 'px';
  ttEl.classList.add('visible');
  ttEl.removeAttribute('aria-hidden');
}

function hideTT() {
  const ttEl = document.getElementById('tt');
  if (ttEl) { ttEl.classList.remove('visible'); ttEl.setAttribute('aria-hidden', 'true'); }
}

/* ══════════════════════════════════════════════════════
   ÉVÉNEMENTS CANVAS
   ══════════════════════════════════════════════════════ */
function initCanvasEvents() {
  if (!canvas) return;

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    if (App.renderMode === 'constellation') return;
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
    if (App.view !== 'atlas') return;
    if (isDrag) {
      if (App.renderMode === 'map') { cam.cx = dragCX - (e.clientX - dragSX) / cam.scale; cam.cy = dragCY - (e.clientY - dragSY) / cam.scale; dirty = true; }
      return;
    }
    const n = hitNode(e.clientX, e.clientY);
    if (n) {
      if (!App.hoveredNode || App.hoveredNode.id !== n.id) { App.hoveredNode = n; dirty = true; }
      showTT(n, e.clientX, e.clientY); canvas.classList.add('hover');
    } else {
      if (App.hoveredNode) { App.hoveredNode = null; dirty = true; }
      hideTT(); canvas.classList.remove('hover');
    }
    const onYear = e.clientY > H - 24 && yearHitAreas.some(ya => Math.abs(e.clientX - ya.sx) < 18);
    canvas.style.cursor = onYear ? 'pointer' : '';
  });
  canvas.addEventListener('mouseleave', () => { App.hoveredNode = null; hideTT(); dirty = true; });

  canvas.addEventListener('click', e => {
    if (App.view !== 'atlas') return;
    const dx = Math.abs(e.clientX - dragSX), dy = Math.abs(e.clientY - dragSY);
    if (dx > 4 || dy > 4) return;

    // Click sur zone années
    if (e.clientY > H - 20) {
      for (const ya of yearHitAreas) {
        if (Math.abs(e.clientX - ya.sx) < 18) {
          flyTo(xY(ya.yr), cam.cy, Math.max(cam.scale, .35));
          return;
        }
      }
    }

    const n = hitNode(e.clientX, e.clientY);
    if (n) {
      if (App.renderMode === 'constellation') {
        exitConstellation(); flyTo(n._wx, n._wy, 1.8);
        setTimeout(() => openDetail(n), 400);
      } else {
        flyTo(n._wx, n._wy, Math.max(cam.scale, 1.4)); openDetail(n);
      }
    } else if (App.renderMode === 'map') {
      closeDetail();
    }
  });

  canvas.addEventListener('dblclick', e => {
    const n = hitNode(e.clientX, e.clientY);
    if (n) enterConstellation(n);
  });

  // Touch
  let tch = { x:0, y:0, cx:0, cy:0, dist:0, sc:0 };
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 1) { tch.x = e.touches[0].clientX; tch.y = e.touches[0].clientY; tch.cx = cam.cx; tch.cy = cam.cy; }
    else if (e.touches.length === 2) { tch.dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); tch.sc = cam.scale; }
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && App.renderMode === 'map') { cam.cx = tch.cx - (e.touches[0].clientX - tch.x) / cam.scale; cam.cy = tch.cy - (e.touches[0].clientY - tch.y) / cam.scale; dirty = true; }
    else if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); cam.scale = Math.max(.04, Math.min(5, tch.sc * (d / tch.dist))); dirty = true; }
  }, { passive: false });
}

/* ══════════════════════════════════════════════════════
   CONTRÔLES ZOOM
   ══════════════════════════════════════════════════════ */
function initZoom() {
  document.getElementById('z-in')?.addEventListener('click',  () => { zoomAt(W/2, H/2, 1.35); schedRender(); });
  document.getElementById('z-out')?.addEventListener('click', () => { zoomAt(W/2, H/2, .75); schedRender(); });
  document.getElementById('z-fit')?.addEventListener('click', zoomFit);
  document.getElementById('mm')?.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    cam.cx = (e.clientX - r.left) / MMW * WW;
    cam.cy = (e.clientY - r.top)  / MMH * WH;
    dirty = true;
  });
  window.addEventListener('resize', () => { setSize(); schedRender(); });
}

/* ══════════════════════════════════════════════════════
   API CONSOLE (debug)
   ══════════════════════════════════════════════════════ */
window.WC = {
  query(filters = {}) {
    return NODES.filter(n => {
      if (filters.categorie  && n.categorie  !== filters.categorie)  return false;
      if (filters.importance && n.importance !== filters.importance) return false;
      if (filters.annee_min  && n.annee < filters.annee_min)         return false;
      if (filters.annee_max  && n.annee > filters.annee_max)         return false;
      if (filters.q) { const lq = filters.q.toLowerCase(); if (!n.nom.toLowerCase().includes(lq) && !n.description_courte.toLowerCase().includes(lq)) return false; }
      return true;
    });
  },
  influence_chain(id, depth = 4, types = ['EVOLVES_INTO','INFLUENCE']) {
    const visited = new Set([id]), queue = [{ id, d: 0 }], result = [];
    while (queue.length) {
      const { id: cur, d } = queue.shift(); if (d >= depth) continue;
      (ADJ[cur] || []).forEach(c => { if (c.dir === 'out' && types.includes(c.edge.type) && !visited.has(c.node.id)) { visited.add(c.node.id); result.push({ node: c.node, depth: d+1, via: c.edge.type }); queue.push({ id: c.node.id, d: d+1 }); } });
    }
    return result;
  },
  most_connected: (n=10) => [...NODES].sort((a,b) => b._dep_count - a._dep_count).slice(0,n),
  prospective:    (minP=.5) => PROSPECTIVE.filter(p => p.probabilite >= minP),
  stats:          () => ({ total_nodes: NODES.length, total_edges: EDGES.length }),
  navigate:       (v) => navigateTo(v, true),
  open:           (id) => { const n = nodeMap[id]; if (n) openDetail(n); },
};

/* ══════════════════════════════════════════════════════
   BOUCLE D'ANIMATION
   ══════════════════════════════════════════════════════ */
function animationLoop() {
  if (App.view === 'atlas') {
    const hasAnim = (App.showEdges && cam.scale > .12) || App.renderMode === 'constellation';
    if (hasAnim) dirty = true;
    if (dirty && ctx) {
      dirty = false;
      ctx.clearRect(0, 0, W, H);
      if (App.renderMode === 'constellation' && App.selectedNode) renderConstellation();
      else renderMap();
      renderMinimap();
    }
  }
  requestAnimationFrame(animationLoop);
}

/* ══════════════════════════════════════════════════════
   DÉMARRAGE
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Marquer le panneau comme fermé initialement
  document.getElementById('dp')?.classList.add('closed');
  document.getElementById('app-layout')?.classList.add('panel-closed');
  setSize();
  requestAnimationFrame(animationLoop);
  loadAtlasData();
});
