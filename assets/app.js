/* ==========================================================================
   Vault — cards, budgets, expenses and savings, persisted locally.
   ========================================================================== */

const STORE_KEY = 'vault.finance.v1';

/* ------------------------------------------------------------------ themes */

const THEMES = [
  { id: 'midnight',  name: 'Midnight',  c: ['#38445a', '#1b2230', '#0a0e15'], ink: 'light' },
  { id: 'cobalt',    name: 'Cobalt',    c: ['#3183e6', '#1a55ab', '#0c2e6b'], ink: 'light' },
  { id: 'aurora',    name: 'Aurora',    c: ['#22c48d', '#0f8a68', '#06503d'], ink: 'light' },
  { id: 'teal',      name: 'Teal',      c: ['#31b8c6', '#13748c', '#083e52'], ink: 'light' },
  { id: 'amethyst',  name: 'Amethyst',  c: ['#8f74f2', '#5b3fbe', '#2d1d6e'], ink: 'light' },
  { id: 'rose',      name: 'Rose',      c: ['#f27ba1', '#c9436f', '#761d40'], ink: 'light' },
  { id: 'sunset',    name: 'Sunset',    c: ['#f9884f', '#e2525e', '#8f2340'], ink: 'light' },
  { id: 'crimson',   name: 'Crimson',   c: ['#e35a51', '#a62a2f', '#5a1117'], ink: 'light' },
  { id: 'champagne', name: 'Champagne', c: ['#f4e8cd', '#dcc79a', '#b89e6b'], ink: 'dark'  },
  { id: 'graphite',  name: 'Graphite',  c: ['#4d4d4a', '#2b2b29', '#131312'], ink: 'light' },
];

const themeOf = id => THEMES.find(t => t.id === id) || THEMES[0];
const themeVars = id => {
  const t = themeOf(id);
  return `--c1:${t.c[0]};--c2:${t.c[1]};--c3:${t.c[2]}`;
};

/* -------------------------------------------------------------- categories */

const EXPENSE_CATS = [
  { id: 'food',       label: 'Food & Drink',      icon: 'coffee' },
  { id: 'groceries',  label: 'Groceries',         icon: 'cart'   },
  { id: 'transport',  label: 'Transport',         icon: 'truck'  },
  { id: 'bills',      label: 'Bills & Utilities', icon: 'file'   },
  { id: 'shopping',   label: 'Shopping',          icon: 'bag'    },
  { id: 'health',     label: 'Health',            icon: 'heart'  },
  { id: 'fun',        label: 'Entertainment',     icon: 'film'   },
  { id: 'fees',       label: 'Transfers & Fees',  icon: 'repeat' },
  { id: 'other',      label: 'Other',             icon: 'dots'   },
];

const INCOME_CATS = [
  { id: 'salary',      label: 'Salary',           icon: 'trend'  },
  { id: 'allowance',   label: 'Allowance',        icon: 'trend'  },
  { id: 'deposit',     label: 'Savings deposit',  icon: 'target' },
  { id: 'transfer_in', label: 'Transfer in',      icon: 'in'     },
  { id: 'interest',    label: 'Interest',         icon: 'trend'  },
  { id: 'refund',      label: 'Refund',           icon: 'repeat' },
  { id: 'gift',        label: 'Gift',             icon: 'gift'   },
  { id: 'income_other',label: 'Other income',     icon: 'dots'   },
];

const CATS = {};
EXPENSE_CATS.forEach(c => (CATS[c.id] = { ...c, kind: 'expense' }));
INCOME_CATS.forEach(c => (CATS[c.id] = { ...c, kind: 'deposit' }));
const catOf = id => CATS[id] || { id: 'other', label: 'Other', icon: 'dots', kind: 'expense' };

const CURRENCIES = [
  ['PHP', 'Philippine peso'], ['USD', 'US dollar'], ['EUR', 'Euro'],
  ['GBP', 'British pound'], ['JPY', 'Japanese yen'], ['SGD', 'Singapore dollar'],
  ['MYR', 'Malaysian ringgit'], ['IDR', 'Indonesian rupiah'], ['THB', 'Thai baht'],
  ['VND', 'Vietnamese dong'], ['INR', 'Indian rupee'], ['AUD', 'Australian dollar'],
  ['CAD', 'Canadian dollar'], ['HKD', 'Hong Kong dollar'], ['KRW', 'South Korean won'],
  ['AED', 'UAE dirham'], ['CNY', 'Chinese yuan'], ['NZD', 'New Zealand dollar'],
];

/* ------------------------------------------------------------------- icons */

const ICON = {
  plus:    '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus:   '<line x1="5" y1="12" x2="19" y2="12"/>',
  x:       '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check:   '<polyline points="20 6 9 17 4 12"/>',
  alert:   '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  pencil:  '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  trash:   '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  sun:     '<circle cx="12" cy="12" r="4.5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M1 12h2M21 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>',
  moon:    '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  wallet:  '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/><path d="M16 15h3"/>',
  card:    '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/>',
  target:  '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.6"/>',
  out:     '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
  in:      '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
  down:    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  up:      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/><polyline points="12 8 12 12 15.5 14"/>',
  coffee:  '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
  cart:    '<circle cx="9" cy="20" r="1.4"/><circle cx="19" cy="20" r="1.4"/><path d="M1 2h3.5l2.5 12.4a2 2 0 0 0 2 1.6h9.3a2 2 0 0 0 2-1.6L22 6H5.5"/>',
  truck:   '<rect x="1" y="4" width="14" height="12" rx="1.5"/><path d="M15 8h3.6l3.4 3.4V16H15z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
  file:    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="15" y1="13" x2="9" y2="13"/><line x1="15" y1="17" x2="9" y2="17"/>',
  bag:     '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  heart:   '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  film:    '<rect x="2" y="2.5" width="20" height="19" rx="2.2"/><line x1="7" y1="2.5" x2="7" y2="21.5"/><line x1="17" y1="2.5" x2="17" y2="21.5"/><line x1="2" y1="12" x2="22" y2="12"/>',
  repeat:  '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  dots:    '<circle cx="12" cy="12" r=".9"/><circle cx="19" cy="12" r=".9"/><circle cx="5" cy="12" r=".9"/>',
  trend:   '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  gift:    '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  wifi:    '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5.5 5.5 0 0 1 7 0"/><path d="M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="1.1"/>',
};

const svgOf = (name, w = 1.7) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICON[name] || ''}</svg>`;

const ico = (name, cls = '') =>
  `<span class="i ${cls}" aria-hidden="true">${svgOf(name)}</span>`;

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    if (!el.firstElementChild) el.innerHTML = svgOf(el.dataset.icon);
  });
}

/* ------------------------------------------------------------------- utils */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const money = v => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

let _nf = null, _nfKey = '';
function nf() {
  if (_nfKey !== S.currency) {
    const base = { style: 'currency', currency: S.currency };
    try {
      _nf = new Intl.NumberFormat(undefined, { ...base, currencyDisplay: 'narrowSymbol' });
    } catch {
      try { _nf = new Intl.NumberFormat(undefined, base); }
      catch { _nf = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }); }
    }
    _nfKey = S.currency;
  }
  return _nf;
}
const fmt = n => nf().format(money(n));

/* Stat-tile values auto-compact only once they'd otherwise blow the layout. */
function fmtBig(n) {
  if (Math.abs(n) >= 1e7) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency', currency: S.currency, currencyDisplay: 'narrowSymbol',
        notation: 'compact', maximumFractionDigits: 1,
      }).format(n);
    } catch { /* fall through */ }
  }
  return fmt(n);
}

function curSymbol() {
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: 'currency', currency: S.currency, currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    return parts.find(p => p.type === 'currency')?.value || S.currency;
  } catch { return S.currency; }
}

const isoOf = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const monthOf = iso => String(iso || '').slice(0, 7);

function fmtDate(iso) {
  const today = isoOf();
  if (iso === today) return 'Today';
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (iso === isoOf(y)) return 'Yesterday';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(+d)) return iso;
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined,
    sameYear ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' });
}

const pluralise = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

/* --------------------------------------------------------------- the state */

const DEFAULTS = () => ({
  v: 1,
  currency: 'PHP',
  holder: 'CARDHOLDER',
  appTheme: 'dark',
  cards: [],
  tx: [],
});

let S = DEFAULTS();

function normalise(raw) {
  const d = DEFAULTS();
  if (!raw || typeof raw !== 'object') return d;

  const out = {
    ...d,
    currency: CURRENCIES.some(c => c[0] === raw.currency) ? raw.currency : d.currency,
    holder: typeof raw.holder === 'string' ? raw.holder.slice(0, 22) : d.holder,
    appTheme: raw.appTheme === 'light' ? 'light' : 'dark',
    cards: [],
    tx: [],
  };

  out.cards = (Array.isArray(raw.cards) ? raw.cards : []).map(c => ({
    id: String(c?.id || uid()),
    name: String(c?.name || 'Card').slice(0, 24),
    type: c?.type === 'savings' ? 'savings' : 'spending',
    theme: THEMES.some(t => t.id === c?.theme) ? c.theme : 'midnight',
    balance: money(c?.balance),
    budget: c?.budget == null || c.budget === '' ? null : money(c.budget),
    budgetPeriod: c?.budgetPeriod === 'all' ? 'all' : 'month',
    goal: c?.goal == null || c.goal === '' ? null : money(c.goal),
    last4: /^\d{4}$/.test(String(c?.last4)) ? String(c.last4) : randDigits(4),
    exp: /^\d{2}\/\d{2}$/.test(String(c?.exp)) ? c.exp : randExpiry(),
    cvv: /^\d{3}$/.test(String(c?.cvv)) ? String(c.cvv) : randDigits(3),
    createdAt: Number(c?.createdAt) || Date.now(),
  }));

  const ids = new Set(out.cards.map(c => c.id));
  out.tx = (Array.isArray(raw.tx) ? raw.tx : [])
    .filter(t => t && ids.has(String(t.cardId)))
    .map(t => ({
      id: String(t.id || uid()),
      cardId: String(t.cardId),
      kind: t.kind === 'deposit' ? 'deposit' : 'expense',
      amount: Math.abs(money(t.amount)),
      category: CATS[t.category] ? t.category : (t.kind === 'deposit' ? 'transfer_in' : 'other'),
      note: String(t.note || '').slice(0, 60),
      date: /^\d{4}-\d{2}-\d{2}$/.test(String(t.date)) ? t.date : isoOf(),
      createdAt: Number(t.createdAt) || Date.now(),
    }))
    .filter(t => t.amount > 0);

  return out;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    S = normalise(raw ? JSON.parse(raw) : null);
  } catch (err) {
    console.warn('Could not read saved data, starting fresh.', err);
    S = DEFAULTS();
  }
}

let saveWarned = false;
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(S));
  } catch (err) {
    if (!saveWarned) {
      saveWarned = true;
      toast('Could not save — this browser is blocking local storage.', 'bad');
      console.error(err);
    }
  }
}

const randDigits = n => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
function randExpiry() {
  const y = new Date().getFullYear() + 3 + Math.floor(Math.random() * 3);
  return `${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}/${String(y).slice(2)}`;
}

/* --------------------------------------------------------------- selectors */

const cardById = id => S.cards.find(c => c.id === id);
const txOf = id => S.tx.filter(t => t.cardId === id);

const bySeen = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt);

const sum = (list, fn) => list.reduce((n, x) => n + fn(x), 0);

const spentOn = (id, period = 'all') => {
  const m = monthOf(isoOf());
  return money(sum(txOf(id).filter(t =>
    t.kind === 'expense' && (period === 'all' || monthOf(t.date) === m)), t => t.amount));
};

const depositedOn = id =>
  money(sum(txOf(id).filter(t => t.kind === 'deposit'), t => t.amount));

/** Where a card stands against its budget or goal, plus the status chip copy. */
function progressOf(card) {
  if (card.type === 'savings') {
    if (!card.goal || card.goal <= 0) return null;
    const pct = (card.balance / card.goal) * 100;
    const done = pct >= 100;
    return {
      kind: 'goal',
      pct: clamp(pct, 0, 100),
      raw: pct,
      used: card.balance,
      total: card.goal,
      left: money(Math.max(0, card.goal - card.balance)),
      state: done ? 'good' : 'ok',
      icon: done ? 'check' : 'target',
      label: done ? 'Goal reached' : `${Math.floor(clamp(pct, 0, 99))}% of goal`,
      note: done
        ? 'Goal reached'
        : `${fmt(Math.max(0, card.goal - card.balance))} to go`,
    };
  }

  if (!card.budget || card.budget <= 0) return null;
  const used = spentOn(card.id, card.budgetPeriod);
  const pct = (used / card.budget) * 100;
  const state = pct >= 100 ? 'critical' : pct >= 80 ? 'warning' : 'ok';
  return {
    kind: 'budget',
    pct: clamp(pct, 0, 100),
    raw: pct,
    used,
    total: card.budget,
    left: money(card.budget - used),
    state,
    icon: state === 'ok' ? 'check' : 'alert',
    label: state === 'critical' ? 'Over budget' : state === 'warning' ? 'Nearly spent' : 'On track',
    note: used > card.budget
      ? `${fmt(used - card.budget)} over`
      : `${fmt(card.budget - used)} left`,
  };
}

/* ---------------------------------------------------------------- toasts */

function toast(msg, tone = 'info') {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.dataset.tone = tone;
  el.innerHTML = ico(tone === 'good' ? 'check' : tone === 'bad' ? 'alert' : 'info') +
    `<span>${esc(msg)}</span>`;
  host.append(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 600);
  }, 2600);
}

/* --------------------------------------------------------------- confirm */

let confirmResolve = null;

function ask({ title, body, ok = 'Delete', danger = true }) {
  const dlg = $('#dlgConfirm');
  $('#dlgConfTitle').textContent = title;
  $('#confirmBody').innerHTML = body;
  const btn = $('#confirmOk');
  btn.textContent = ok;
  btn.className = danger ? 'btn btn-danger' : 'btn btn-primary';
  dlg.showModal();
  return new Promise(res => { confirmResolve = res; });
}

function settleConfirm(value) {
  const fn = confirmResolve;
  confirmResolve = null;
  if (fn) fn(value);
}

/* ================================================================ RENDER */

function render() {
  renderStats();
  renderCards();
  renderActivity();
  if (detailId && $('#dlgDetail').open) renderDetail();
}

/* ------------------------------------------------------------ stat tiles */

function renderStats() {
  const cards = S.cards;
  const spending = cards.filter(c => c.type === 'spending');
  const savings = cards.filter(c => c.type === 'savings');

  const total = money(sum(cards, c => c.balance));
  const spentAll = money(sum(S.tx.filter(t => t.kind === 'expense'), t => t.amount));
  const thisMonth = monthOf(isoOf());
  const spentMonth = money(sum(
    S.tx.filter(t => t.kind === 'expense' && monthOf(t.date) === thisMonth), t => t.amount));
  const saved = money(sum(savings, c => c.balance));

  $('#statBalance').textContent = cards.length ? fmtBig(total) : fmt(0);
  $('#statBalanceSub').textContent = cards.length
    ? `Across ${pluralise(cards.length, 'card')}` +
      (savings.length ? ` · ${pluralise(savings.length, 'savings card')}` : '')
    : 'No cards yet';

  $('#statSpent').textContent = fmtBig(spentAll);
  $('#statSpentSub').innerHTML = spentAll
    ? `<span class="down">${esc(fmt(spentMonth))}</span> this month`
    : 'Nothing logged yet';

  $('#statSaved').textContent = fmtBig(saved);
  const goalCards = savings.filter(c => c.goal > 0);
  if (!savings.length) {
    $('#statSavedSub').textContent = 'No savings card yet';
  } else if (goalCards.length) {
    const g = money(sum(goalCards, c => c.goal));
    const b = money(sum(goalCards, c => Math.min(c.balance, c.goal)));
    $('#statSavedSub').innerHTML =
      `<span class="up">${Math.floor(g ? (b / g) * 100 : 0)}%</span> of ${pluralise(goalCards.length, 'goal')}`;
  } else {
    $('#statSavedSub').textContent = `In ${pluralise(savings.length, 'savings card')}`;
  }

  const budgeted = spending.filter(c => c.budget > 0);
  if (!budgeted.length) {
    $('#statBudget').textContent = '—';
    $('#statBudgetSub').textContent = 'No budgets set';
  } else {
    const left = money(sum(budgeted, c => Math.max(0, c.budget - spentOn(c.id, c.budgetPeriod))));
    const over = budgeted.filter(c => spentOn(c.id, c.budgetPeriod) > c.budget).length;
    $('#statBudget').textContent = fmtBig(left);
    $('#statBudgetSub').innerHTML = over
      ? `<span class="down">${pluralise(over, 'card')}</span> over budget`
      : `Across ${pluralise(budgeted.length, 'budget')}`;
  }
}

/* ---------------------------------------------------------------- cards */

function cardMarkup(card) {
  const t = themeOf(card.theme);
  const prog = progressOf(card);
  const isSavings = card.type === 'savings';
  const holder = (S.holder || 'CARDHOLDER').trim() || 'CARDHOLDER';
  const spent = spentOn(card.id);
  const count = txOf(card.id).length;

  /* back: the money line under the balance */
  let backNote;
  if (prog) {
    backNote = `
      <div class="back-note">
        <span>${prog.kind === 'goal' ? 'Goal' : 'Budget'} ${esc(fmt(prog.total))}</span>
        <span class="n-val">${esc(prog.note)}</span>
      </div>
      <div class="meter on-card" data-state="${prog.state}">
        <span style="width:${prog.pct.toFixed(1)}%"></span>
      </div>`;
  } else {
    /* One line only — the back has no room for two once the balance and the
       card name are in, at the narrow end of the grid. */
    backNote = `
      <div class="back-note" style="margin-bottom:0">
        <span>${count ? esc(pluralise(count, 'transaction')) : 'No activity yet'}</span>
        <span class="n-val">${isSavings ? 'Deposited' : 'Spent'}
          ${esc(fmt(isSavings ? depositedOn(card.id) : spent))}</span>
      </div>`;
  }

  return `
  <article class="bank" data-card="${esc(card.id)}" style="${themeVars(card.theme)}">
    <div class="bank-shell" role="button" tabindex="0"
         aria-label="${esc(card.name)} card. Activate to flip and see the balance.">
      <div class="bank-tilt">
        <div class="bank-flip">

          <div class="face face-front" data-ink="${t.ink}">
            <div class="gloss"></div>
            <div class="face-top">
              <div>
                <p class="bank-name">${esc(card.name)}</p>
                <span class="bank-kind">${ico(isSavings ? 'target' : 'card')}${isSavings ? 'Savings' : 'Spending'}</span>
              </div>
              <div class="bank-logo">${ico('wifi')}</div>
            </div>
            <div class="chip"></div>
            <p class="pan"><i>••••</i><i>••••</i><i>••••</i><b>${esc(card.last4)}</b></p>
            <div class="face-bottom">
              <div><span class="meta-k">Card holder</span><span class="meta-v">${esc(holder)}</span></div>
              <div><span class="meta-k">Valid thru</span><span class="meta-v">${esc(card.exp)}</span></div>
            </div>
          </div>

          <div class="face face-back" data-ink="${t.ink}">
            <div class="gloss"></div>
            <div class="magstripe"></div>
            <div class="back-in">
              <div class="back-row">
                <div>
                  <p class="back-k">Available balance</p>
                  <p class="back-amount">${esc(fmt(card.balance))}</p>
                </div>
                <div class="cvv">
                  <span class="back-k">CVV</span>
                  <span class="cvv-box">${esc(card.cvv)}</span>
                </div>
              </div>
              <div class="back-foot">
                ${backNote}
                <p class="bank-hintline">${esc(card.name)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="bank-bar">
      <button class="btn btn-soft btn-sm grow" type="button" data-act="tx" data-id="${esc(card.id)}">
        ${ico(isSavings ? 'plus' : 'minus')}<span>${isSavings ? 'Add money' : 'Log expense'}</span>
      </button>
      <button class="btn btn-ghost btn-sm" type="button" data-act="detail" data-id="${esc(card.id)}"
              title="Open ${esc(card.name)}">${ico('history')}<span>Details</span></button>
      <button class="btn btn-ghost btn-sm btn-icon" type="button" data-act="edit" data-id="${esc(card.id)}"
              title="Edit ${esc(card.name)}" aria-label="Edit ${esc(card.name)}">${ico('pencil')}</button>
    </div>
  </article>`;
}

/* Set by wire() — re-rendering the grid orphans the tilt tracker's shell. */
let tiltReset = () => {};

function renderCards() {
  const grid = $('#cardGrid');
  const empty = $('#cardsEmpty');
  const flipped = new Set($$('.bank.is-flipped').map(el => el.dataset.card));
  tiltReset();

  if (!S.cards.length) {
    grid.innerHTML = '';
    grid.hidden = true;
    empty.hidden = false;
    return;
  }
  grid.hidden = false;
  empty.hidden = true;
  grid.innerHTML = S.cards.map(cardMarkup).join('');
  flipped.forEach(id => {
    const el = grid.querySelector(`.bank[data-card="${CSS.escape(id)}"]`);
    if (el) el.classList.add('is-flipped');
  });
}

/* -------------------------------------------------------------- activity */

function txRow(t, { withCard = true, del = true } = {}) {
  const cat = catOf(t.category);
  const card = cardById(t.cardId);
  const inbound = t.kind === 'deposit';
  const bits = [fmtDate(t.date), withCard && card ? card.name : null, cat.label].filter(Boolean);

  return `
  <div class="row" data-tx="${esc(t.id)}">
    <span class="row-ico">${ico(cat.icon)}</span>
    <div class="row-main">
      <p class="row-t">${esc(t.note || cat.label)}</p>
      <p class="row-s">${bits.map(esc).join(' · ')}</p>
    </div>
    <div class="row-end">
      <span class="amt ${inbound ? 'in' : 'out'}">${inbound ? '+' : '−'}${esc(fmt(t.amount))}</span>
      ${del ? `<button class="row-del" type="button" data-act="del-tx" data-id="${esc(t.id)}"
             title="Delete transaction" aria-label="Delete transaction">${ico('trash')}</button>` : ''}
    </div>
  </div>`;
}

function renderActivity() {
  const block = $('#activityBlock');
  const list = $('#activityList');
  const recent = [...S.tx].sort(bySeen);

  if (!recent.length) {
    block.hidden = true;
    list.innerHTML = '';
    return;
  }
  block.hidden = false;
  $('#activityCount').textContent = `${pluralise(S.tx.length, 'transaction')} logged`;
  list.className = 'panel rows';
  list.innerHTML = recent.slice(0, 8).map(t => txRow(t)).join('');
}

/* ---------------------------------------------------------- card detail */

let detailId = null;
let detailFilter = 'all';

function categoryBars(card) {
  const spend = txOf(card.id).filter(t => t.kind === 'expense');
  if (!spend.length) return '';

  const byCat = new Map();
  spend.forEach(t => {
    const k = t.category;
    const cur = byCat.get(k) || { amount: 0, n: 0 };
    cur.amount += t.amount;
    cur.n += 1;
    byCat.set(k, cur);
  });

  let rows = [...byCat.entries()]
    .map(([id, v]) => ({ ...catOf(id), amount: money(v.amount), n: v.n }))
    .sort((a, b) => b.amount - a.amount);

  /* Never grow the hue count — anything past six folds into one "Other" bar. */
  if (rows.length > 6) {
    const rest = rows.slice(6);
    rows = rows.slice(0, 6).concat({
      id: '_rest', label: `${rest.length} more categories`, icon: 'dots',
      amount: money(sum(rest, r => r.amount)), n: sum(rest, r => r.n),
    });
  }

  const total = money(sum(rows, r => r.amount));
  const max = Math.max(...rows.map(r => r.amount));

  return `
  <section class="d-sec">
    <div class="d-sec-head">
      <h3>Spending by category</h3>
      <span class="hint">${esc(fmt(total))} total</span>
    </div>
    <div class="bars">
      ${rows.map(r => `
        <div class="bar-row" title="${esc(r.label)} — ${esc(fmt(r.amount))} · ${esc(pluralise(r.n, 'transaction'))} · ${Math.round(total ? (r.amount / total) * 100 : 0)}% of spend">
          <span class="bar-lab">${ico(r.icon)}<span>${esc(r.label)}</span></span>
          <div class="bar-track"><div class="bar-fill" style="width:${max ? Math.max(2, (r.amount / max) * 100).toFixed(1) : 0}%"></div></div>
          <span class="bar-val">${esc(fmt(r.amount))}</span>
        </div>`).join('')}
    </div>
  </section>`;
}

function goalBox(card) {
  const prog = progressOf(card);
  const isSavings = card.type === 'savings';
  const word = isSavings ? 'goal' : 'budget';

  if (!prog) {
    return `
    <div class="goal-box">
      <div class="goal-top">
        <div>
          <p class="goal-figs">No ${word} set</p>
          <p class="goal-sub">${isSavings
            ? 'Set a target and this card gets a progress bar.'
            : 'Set one and expenses on this card get tracked against it.'}</p>
        </div>
        <button class="btn btn-soft btn-sm" type="button" data-act="set-goal" data-id="${esc(card.id)}">
          ${ico('plus')}<span>Set ${word}</span>
        </button>
      </div>
    </div>`;
  }

  const periodTxt = card.budgetPeriod === 'month' ? 'this month' : 'all time';

  return `
  <div class="goal-box">
    <div class="goal-top">
      <div>
        <p class="goal-figs">${esc(fmt(prog.used))} <span class="sep">of</span> ${esc(fmt(prog.total))}</p>
        <p class="goal-sub">${isSavings
          ? `Saved towards goal · ${esc(prog.note)}`
          : `Spent ${periodTxt} · ${esc(prog.note)}`}</p>
      </div>
      <span class="chip-status" data-state="${prog.state}">${ico(prog.icon)}${esc(prog.label)}</span>
    </div>
    <div class="meter lg" style="--meter:${prog.state === 'critical' ? 'var(--critical)'
      : prog.state === 'warning' ? 'var(--warning)'
      : prog.state === 'good' ? 'var(--good)' : 'var(--accent)'}">
      <span style="width:${prog.pct.toFixed(1)}%"></span>
    </div>
  </div>`;
}

function renderDetail() {
  const card = cardById(detailId);
  if (!card) { $('#dlgDetail').close(); return; }

  const isSavings = card.type === 'savings';
  const all = txOf(card.id).sort(bySeen);
  const used = new Set(all.map(t => t.category));
  const shown = detailFilter === 'all' ? all : all.filter(t => t.category === detailFilter);

  $('#dlgDetailTitle').innerHTML =
    `<span class="card-dot" style="${themeVars(card.theme)}"></span><span>${esc(card.name)}</span>`;

  $('#detailBody').innerHTML = `
    <div class="d-hero">
      <div class="d-hero-main">
        <p class="tile-label">${isSavings ? 'Saved in this card' : 'Available balance'}</p>
        <p class="d-amount">${esc(fmt(card.balance))}</p>
      </div>
      <div class="d-actions">
        <button class="btn btn-primary" type="button" data-act="tx" data-id="${esc(card.id)}"
                data-kind="${isSavings ? 'deposit' : 'expense'}">
          ${ico(isSavings ? 'plus' : 'minus')}<span>${isSavings ? 'Add deposit' : 'Log expense'}</span>
        </button>
        <button class="btn btn-soft" type="button" data-act="tx" data-id="${esc(card.id)}"
                data-kind="${isSavings ? 'expense' : 'deposit'}">
          ${ico(isSavings ? 'out' : 'in')}<span>${isSavings ? 'Withdraw' : 'Add funds'}</span>
        </button>
      </div>
    </div>

    <section class="d-sec">
      <div class="d-sec-head"><h3>${isSavings ? 'Savings goal' : 'Budget'}</h3></div>
      ${goalBox(card)}
    </section>

    ${categoryBars(card)}

    <section class="d-sec">
      <div class="d-sec-head">
        <h3>History</h3>
        ${all.length ? `
        <select id="detailFilter" class="sel-sm" aria-label="Filter transactions by category">
          <option value="all"${detailFilter === 'all' ? ' selected' : ''}>All categories</option>
          ${[...used].map(id => `<option value="${esc(id)}"${detailFilter === id ? ' selected' : ''}>${esc(catOf(id).label)}</option>`).join('')}
        </select>` : ''}
      </div>
      ${shown.length
        ? `<div class="scroll-list rows">${shown.map(t => txRow(t, { withCard: false })).join('')}</div>`
        : `<div class="scroll-list"><p class="empty-sm">${all.length
            ? 'Nothing in this category.'
            : `No transactions on this card yet. ${isSavings ? 'Add a deposit' : 'Log an expense'} to get started.`}</p></div>`}
    </section>

    <div class="d-foot">
      <button class="btn btn-soft" type="button" data-act="edit" data-id="${esc(card.id)}">
        ${ico('pencil')}<span>Edit card</span>
      </button>
      <span class="spacer"></span>
      <button class="btn btn-ghost" type="button" data-act="clear-card" data-id="${esc(card.id)}"
              ${all.length ? '' : 'disabled'}>${ico('history')}<span>Clear history</span></button>
      <button class="btn btn-danger" type="button" data-act="del-card" data-id="${esc(card.id)}">
        ${ico('trash')}<span>Delete card</span>
      </button>
    </div>`;
}

function openDetail(id) {
  detailId = id;
  detailFilter = 'all';
  renderDetail();
  $('#dlgDetail').showModal();
}

/* ================================================= card add / edit form */

let editingId = null;

function renderSwatches(selected) {
  $('#fcThemes').innerHTML = THEMES.map(t => `
    <label class="sw" style="${themeVars(t.id)}" title="${esc(t.name)}">
      <input type="radio" name="theme" value="${esc(t.id)}"${t.id === selected ? ' checked' : ''}>
      <span></span>
      <span class="sr-only">${esc(t.name)}</span>
    </label>`).join('');
}

function syncCardForm() {
  const type = $('#formCard').elements.type.value;
  $$('#formCard [data-when]').forEach(el => { el.hidden = el.dataset.when !== type; });
  $('#fcTypeHint').textContent = type === 'savings'
    ? 'Money added counts as a deposit and grows the balance.'
    : "Expenses come out of this card's balance.";
}

function openCardForm(id = null, focusField = null) {
  editingId = id;
  const form = $('#formCard');
  const card = id ? cardById(id) : null;

  $('#dlgCardTitle').textContent = card ? `Edit ${card.name}` : 'Add card';
  $('#fcSubmit').textContent = card ? 'Save changes' : 'Add card';

  form.elements.name.value = card?.name || '';
  form.elements.type.value = card?.type || 'spending';
  form.elements.balance.value = card ? card.balance : 0;
  form.elements.budget.value = card?.budget ?? '';
  form.elements.goal.value = card?.goal ?? '';
  form.elements.budgetPeriod.value = card?.budgetPeriod || 'month';
  renderSwatches(card?.theme || THEMES[Math.floor(Math.random() * THEMES.length)].id);
  syncCardForm();
  refreshCurrencyMarks();

  $('#dlgCard').showModal();
  const target = focusField ? form.elements[focusField] : form.elements.name;
  (target || form.elements.name).focus();
  if (target && target.select) target.select();
}

function submitCardForm(ev) {
  const f = ev.target.elements;
  const type = f.type.value === 'savings' ? 'savings' : 'spending';
  const name = f.name.value.trim().slice(0, 24) || 'Card';
  const balance = money(f.balance.value);
  const budget = type === 'spending' && f.budget.value !== '' ? money(f.budget.value) : null;
  const goal = type === 'savings' && f.goal.value !== '' ? money(f.goal.value) : null;

  if (editingId) {
    const card = cardById(editingId);
    if (card) {
      Object.assign(card, {
        name, type, balance, budget, goal,
        theme: f.theme.value,
        budgetPeriod: f.budgetPeriod.value === 'all' ? 'all' : 'month',
      });
      toast(`${name} updated`, 'good');
    }
  } else {
    S.cards.push({
      id: uid(), name, type, theme: f.theme.value,
      balance, budget, goal,
      budgetPeriod: f.budgetPeriod.value === 'all' ? 'all' : 'month',
      last4: randDigits(4), exp: randExpiry(), cvv: randDigits(3),
      createdAt: Date.now(),
    });
    toast(`${name} added`, 'good');
  }

  editingId = null;
  save();
  render();
}

/* ================================================== transaction form */

let txCardId = null;

function fillCatOptions(kind, keep) {
  const list = kind === 'deposit' ? INCOME_CATS : EXPENSE_CATS;
  const sel = $('#ftCat');
  sel.innerHTML = list.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
  if (keep && list.some(c => c.id === keep)) sel.value = keep;
}

function syncTxForm() {
  const card = cardById(txCardId);
  if (!card) return;
  const form = $('#formTx');
  const kind = form.elements.kind.value;
  const isSavings = card.type === 'savings';

  $('#dlgTxTitle').textContent = kind === 'deposit'
    ? (isSavings ? 'Add deposit' : 'Add funds')
    : (isSavings ? 'Withdraw from savings' : 'Log expense');
  $('#ftSubmit').textContent = kind === 'deposit' ? 'Add money' : 'Log it';

  $('#ftContext').innerHTML =
    `<span class="card-dot" style="${themeVars(card.theme)};display:inline-block;vertical-align:-1px;margin-right:6px"></span>` +
    `${esc(card.name)} · balance ${esc(fmt(card.balance))}`;

  if (fillCatOptions.lastKind !== kind) {
    fillCatOptions(kind, kind === 'deposit' && isSavings ? 'deposit' : null);
    fillCatOptions.lastKind = kind;
  }
  updateTxPreview();
}

function updateTxPreview() {
  const card = cardById(txCardId);
  const form = $('#formTx');
  const out = $('#ftPreview');
  if (!card) { out.textContent = ''; return; }

  const amt = money(form.elements.amount.value);
  if (!amt || amt <= 0) { out.textContent = ''; return; }

  const kind = form.elements.kind.value;
  const after = money(kind === 'deposit' ? card.balance + amt : card.balance - amt);
  const prog = progressOf(card);

  let extra = '';
  if (kind === 'expense' && prog?.kind === 'budget') {
    const used = prog.used + amt;
    extra = used > prog.total
      ? ` This puts you <b>${esc(fmt(used - prog.total))}</b> over budget.`
      : ` <b>${esc(fmt(prog.total - used))}</b> of budget would be left.`;
  }
  if (kind === 'deposit' && prog?.kind === 'goal') {
    const pct = Math.floor((after / prog.total) * 100);
    extra = pct >= 100 ? ' That reaches the goal.' : ` That's <b>${pct}%</b> of the goal.`;
  }

  out.innerHTML = `Balance after: <b>${esc(fmt(after))}</b>.` +
    (after < 0 ? ' <b>This card would go negative.</b>' : '') + extra;
}

function openTxForm(cardId, kind) {
  const card = cardById(cardId);
  if (!card) return;
  txCardId = cardId;

  const form = $('#formTx');
  form.reset();
  form.elements.kind.value = kind || (card.type === 'savings' ? 'deposit' : 'expense');
  form.elements.date.value = isoOf();
  fillCatOptions.lastKind = null;
  refreshCurrencyMarks();
  syncTxForm();

  $('#dlgTx').showModal();
  form.elements.amount.focus();
}

function submitTxForm(ev) {
  const card = cardById(txCardId);
  if (!card) return;
  const f = ev.target.elements;
  const amount = money(f.amount.value);
  if (!(amount > 0)) return;

  const kind = f.kind.value === 'deposit' ? 'deposit' : 'expense';
  const tx = {
    id: uid(),
    cardId: card.id,
    kind,
    amount,
    category: CATS[f.category.value] ? f.category.value : (kind === 'deposit' ? 'transfer_in' : 'other'),
    note: f.note.value.trim().slice(0, 60),
    date: /^\d{4}-\d{2}-\d{2}$/.test(f.date.value) ? f.date.value : isoOf(),
    createdAt: Date.now(),
  };

  S.tx.push(tx);
  card.balance = money(kind === 'deposit' ? card.balance + amount : card.balance - amount);
  save();
  render();

  toast(kind === 'deposit'
    ? `${fmt(amount)} added to ${card.name}`
    : `${fmt(amount)} logged on ${card.name}`, 'good');
}

/* ------------------------------------------------------------- mutations */

function deleteTx(id) {
  const i = S.tx.findIndex(t => t.id === id);
  if (i < 0) return;
  const [t] = S.tx.splice(i, 1);
  const card = cardById(t.cardId);
  if (card) {
    card.balance = money(t.kind === 'deposit' ? card.balance - t.amount : card.balance + t.amount);
  }
  save();
  render();
  toast('Transaction removed');
}

async function clearCard(id) {
  const card = cardById(id);
  if (!card) return;
  const list = txOf(id);
  if (!list.length) return;

  const restored = money(
    card.balance
    + sum(list.filter(t => t.kind === 'expense'), t => t.amount)
    - sum(list.filter(t => t.kind === 'deposit'), t => t.amount));

  const ok = await ask({
    title: `Clear ${card.name}'s history?`,
    body: `This deletes <b>${esc(pluralise(list.length, 'transaction'))}</b> and restores the balance to
           <b>${esc(fmt(restored))}</b>. The card itself stays.`,
    ok: 'Clear history',
  });
  if (!ok) return;

  S.tx = S.tx.filter(t => t.cardId !== id);
  card.balance = restored;
  save();
  render();
  toast(`${card.name} history cleared`, 'good');
}

async function deleteCard(id) {
  const card = cardById(id);
  if (!card) return;
  const n = txOf(id).length;

  const ok = await ask({
    title: `Delete ${card.name}?`,
    body: `The card and its <b>${esc(pluralise(n, 'transaction'))}</b> will be removed for good.`,
    ok: 'Delete card',
  });
  if (!ok) return;

  S.cards = S.cards.filter(c => c.id !== id);
  S.tx = S.tx.filter(t => t.cardId !== id);
  if (detailId === id) { detailId = null; $('#dlgDetail').close(); }
  save();
  render();
  toast(`${card.name} deleted`);
}

async function wipeAll() {
  const ok = await ask({
    title: 'Erase everything?',
    body: `All <b>${esc(pluralise(S.cards.length, 'card'))}</b> and
           <b>${esc(pluralise(S.tx.length, 'transaction'))}</b> will be deleted from this browser.
           Export a backup first if you might want them back.`,
    ok: 'Erase all data',
  });
  if (!ok) return;

  const keep = { currency: S.currency, holder: S.holder, appTheme: S.appTheme };
  S = { ...DEFAULTS(), ...keep };
  detailId = null;
  $('#dlgDetail').close();
  $('#dlgSettings').close();
  save();
  render();
  toast('All data erased');
}

/* ------------------------------------------------------------ sample data */

function seed() {
  const d = new Date();
  const day = n => {
    const x = new Date(d);
    x.setDate(x.getDate() - n);
    return isoOf(x);
  };

  const mk = (name, type, theme, balance, extra = {}) => ({
    id: uid(), name, type, theme, balance: money(balance),
    budget: null, goal: null, budgetPeriod: 'month',
    last4: randDigits(4), exp: randExpiry(), cvv: randDigits(3),
    createdAt: Date.now(), ...extra,
  });

  const gcash = mk('GCash', 'spending', 'cobalt', 4820, { budget: 8000 });
  const bdo   = mk('BDO Debit', 'spending', 'midnight', 18450, { budget: 20000 });
  const gotyme = mk('GoTyme Savings', 'savings', 'aurora', 12500, { goal: 50000 });

  S.cards.push(gcash, bdo, gotyme);

  const tx = (card, kind, amount, category, note, ago) => S.tx.push({
    id: uid(), cardId: card.id, kind, amount: money(amount),
    category, note, date: day(ago), createdAt: Date.now() - ago * 1000,
  });

  tx(gcash, 'expense', 185, 'food', 'Lunch at the office', 0);
  tx(gcash, 'expense', 96, 'transport', 'Grab home', 1);
  tx(gcash, 'expense', 1249, 'bills', 'Globe postpaid', 3);
  tx(gcash, 'expense', 430, 'groceries', 'Convenience run', 5);
  tx(bdo, 'expense', 2380, 'shopping', 'New running shoes', 2);
  tx(bdo, 'expense', 640, 'fun', 'Cinema + snacks', 4);
  tx(bdo, 'expense', 1180, 'health', 'Pharmacy', 8);
  tx(gotyme, 'deposit', 5000, 'deposit', 'Payday transfer', 6);
  tx(gotyme, 'deposit', 2500, 'deposit', 'Side project', 12);

  save();
  render();
  toast('Sample cards loaded', 'good');
}

/* ------------------------------------------------------------- settings */

function refreshCurrencyMarks() {
  const sym = curSymbol();
  $$('[data-cur-symbol]').forEach(el => { el.textContent = sym; });
}

function applyAppTheme() {
  document.documentElement.dataset.theme = S.appTheme;
  const btn = $('#btnTheme');
  btn.innerHTML = ico(S.appTheme === 'dark' ? 'sun' : 'moon');
  btn.title = S.appTheme === 'dark' ? 'Switch to light' : 'Switch to dark';
}

function openSettings() {
  const f = $('#formSettings').elements;
  f.currency.innerHTML = CURRENCIES
    .map(([code, name]) => `<option value="${code}"${code === S.currency ? ' selected' : ''}>${code} — ${esc(name)}</option>`)
    .join('');
  f.holder.value = S.holder === 'CARDHOLDER' ? '' : S.holder;
  $('#dlgSettings').showModal();
}

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vault-backup-${isoOf()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Backup downloaded', 'good');
}

async function importData(file) {
  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    toast('That file is not valid JSON.', 'bad');
    return;
  }

  const next = normalise(parsed);
  if (!next.cards.length && !next.tx.length) {
    toast('No cards found in that file.', 'bad');
    return;
  }

  const ok = await ask({
    title: 'Replace current data?',
    body: `The backup holds <b>${esc(pluralise(next.cards.length, 'card'))}</b> and
           <b>${esc(pluralise(next.tx.length, 'transaction'))}</b>. Importing replaces
           everything currently in this browser.`,
    ok: 'Import and replace',
  });
  if (!ok) return;

  S = next;
  detailId = null;
  $('#dlgDetail').close();
  $('#dlgSettings').close();
  save();
  applyAppTheme();
  refreshCurrencyMarks();
  render();
  toast('Backup restored', 'good');
}

/* ==================================================== event wiring */

function actionFrom(ev) {
  const btn = ev.target.closest('[data-act]');
  return btn ? { act: btn.dataset.act, id: btn.dataset.id, kind: btn.dataset.kind, btn } : null;
}

function wire() {
  hydrateIcons();
  applyAppTheme();
  refreshCurrencyMarks();

  /* --- topbar --- */
  $('#btnAddCard').addEventListener('click', () => openCardForm());
  $('#btnSettings').addEventListener('click', openSettings);
  $('#btnTheme').addEventListener('click', () => {
    S.appTheme = S.appTheme === 'dark' ? 'light' : 'dark';
    applyAppTheme();
    save();
  });

  /* --- delegated actions across the page and the detail dialog --- */
  document.addEventListener('click', ev => {
    const a = actionFrom(ev);
    if (!a) return;
    switch (a.act) {
      case 'add-card':   openCardForm(); break;
      case 'seed':       seed(); break;
      case 'tx':         openTxForm(a.id, a.kind); break;
      case 'detail':     openDetail(a.id); break;
      case 'edit':       openCardForm(a.id); break;
      case 'set-goal':   openCardForm(a.id, cardById(a.id)?.type === 'savings' ? 'goal' : 'budget'); break;
      case 'del-tx':     deleteTx(a.id); break;
      case 'clear-card': clearCard(a.id); break;
      case 'del-card':   deleteCard(a.id); break;
      default: return;
    }
    ev.preventDefault();
  });

  /* --- card flip --- */
  const grid = $('#cardGrid');

  grid.addEventListener('click', ev => {
    const shell = ev.target.closest('.bank-shell');
    if (!shell) return;
    shell.closest('.bank').classList.toggle('is-flipped');
  });

  grid.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const shell = ev.target.closest('.bank-shell');
    if (!shell) return;
    ev.preventDefault();
    shell.closest('.bank').classList.toggle('is-flipped');
  });

  /* Pointer-tracked tilt. It lives on .bank-tilt so it composes with the flip
     on the child instead of fighting it. Tracked by shell rather than reset on
     every descendant's pointerleave — that fires constantly inside the card. */
  const flat = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let tilted = null;

  const dropTilt = () => {
    const t = tilted?.querySelector('.bank-tilt');
    if (t) { t.style.transition = ''; t.style.transform = ''; }
    tilted = null;
  };

  grid.addEventListener('pointermove', ev => {
    if (flat.matches || !fine.matches || ev.pointerType !== 'mouse') return;
    const shell = ev.target.closest('.bank-shell');
    if (shell !== tilted) dropTilt();
    if (!shell) return;
    tilted = shell;

    const r = shell.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width - .5;
    const py = (ev.clientY - r.top) / r.height - .5;
    const tilt = shell.querySelector('.bank-tilt');
    tilt.style.transition = 'none';
    tilt.style.transform = `rotateY(${(px * 11).toFixed(2)}deg) rotateX(${(-py * 9).toFixed(2)}deg)`;
  });

  grid.addEventListener('pointerleave', dropTilt);
  tiltReset = () => { tilted = null; };

  /* --- dialogs: close buttons + confirm plumbing --- */
  $$('dialog').forEach(dlg => {
    dlg.addEventListener('click', ev => {
      if (ev.target.closest('[data-close]')) dlg.close();
    });
  });

  $('#confirmOk').addEventListener('click', () => {
    settleConfirm(true);
    $('#dlgConfirm').close();
  });
  $('#dlgConfirm').addEventListener('close', () => settleConfirm(false));

  /* --- card form --- */
  const formCard = $('#formCard');
  formCard.addEventListener('change', ev => {
    if (ev.target.name === 'type') syncCardForm();
  });
  formCard.addEventListener('submit', submitCardForm);
  $('#dlgCard').addEventListener('close', () => { editingId = null; });

  /* --- transaction form --- */
  const formTx = $('#formTx');
  formTx.addEventListener('change', ev => {
    if (ev.target.name === 'kind') syncTxForm();
    else updateTxPreview();
  });
  formTx.addEventListener('input', ev => {
    if (ev.target.name === 'amount') updateTxPreview();
  });
  formTx.addEventListener('submit', submitTxForm);

  /* --- detail: category filter --- */
  $('#detailBody').addEventListener('change', ev => {
    if (ev.target.id !== 'detailFilter') return;
    detailFilter = ev.target.value;
    renderDetail();
  });
  $('#dlgDetail').addEventListener('close', () => { detailId = null; });

  /* --- settings --- */
  $('#formSettings').addEventListener('submit', ev => {
    const f = ev.target.elements;
    S.currency = CURRENCIES.some(c => c[0] === f.currency.value) ? f.currency.value : S.currency;
    S.holder = f.holder.value.trim().slice(0, 22) || 'CARDHOLDER';
    save();
    refreshCurrencyMarks();
    render();
    toast('Settings saved', 'good');
  });

  $('#btnExport').addEventListener('click', exportData);
  $('#btnImport').addEventListener('click', () => $('#fileImport').click());
  $('#fileImport').addEventListener('change', ev => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (file) importData(file);
  });
  $('#btnWipe').addEventListener('click', wipeAll);

  /* --- keyboard shortcut --- */
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'n' || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const t = ev.target;
    if (t.matches('input, select, textarea') || $$('dialog[open]').length) return;
    ev.preventDefault();
    openCardForm();
  });

  /* another tab edited the same store */
  window.addEventListener('storage', ev => {
    if (ev.key !== STORE_KEY) return;
    load();
    applyAppTheme();
    refreshCurrencyMarks();
    render();
  });
}

/* -------------------------------------------------------------- boot */

load();
wire();
render();
