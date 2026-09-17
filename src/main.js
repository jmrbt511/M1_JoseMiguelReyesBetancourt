import { state } from './state.js';
import { generatePalette } from './palette.js';
import { renderPalette, showToast } from './ui/render.js';
import { renderSavedPanel } from './ui/savedPanel.js';
import { savePalette, loadPalette } from './storage.js';
import { getSavedPalettes, addSavedPalette, removeSavedPalette } from './savedPalettes.js';
import { exportPNG } from './ui/export.js';
import { t, initLang, setLang, getLang } from './i18n/i18n.js';

const paletteEl = document.getElementById('palette');
const harmonySelect = document.getElementById('harmony');
const sizeButtons = document.querySelectorAll('[data-size]');
const formatButtons = document.querySelectorAll('[data-format]');
const generateBtn = document.getElementById('generate');
const saveBtn = document.getElementById('save-palette');
const exportPngBtn = document.getElementById('export-png');
const saveStatus = document.getElementById('save-status');
const languageSelect = document.getElementById('language');

const savedPanel = document.getElementById('saved-panel');
const savedList = document.getElementById('saved-list');
const panelToggle = document.getElementById('panel-toggle');
const panelClose = document.getElementById('panel-close');
const panelBackdrop = document.getElementById('panel-backdrop');

// Traduce todo el texto estático de la página al idioma actual.
// data-i18n -> textContent; data-i18n-title -> atributo title.
// Las tooltips parametrizadas (p. ej., "Generar 6 colores") se procesan por separado.

// Translates all static page text into the current language.
// data-i18n -> textContent; data-i18n-title -> title attribute.
// Parameterized tooltips (e.g., "Generate 6 colors") are handled separately.

// Traduit tout le texte statique de la page dans la langue courante.
// data-i18n -> textContent ; data-i18n-title -> attribut title.
// Les tooltips paramétrées (ex : "Générer 6 couleurs") sont traitées à part.

function applyStaticTranslations() {
  document.title = t('title');
  paletteEl.setAttribute('aria-label', t('paletteAriaLabel'));

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });

  sizeButtons.forEach((btn) => {
    btn.title = t('tooltips.sizeOption', btn.dataset.size);
  });

  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());
}

function setActive(buttons, dataAttr, value) {
  buttons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset[dataAttr] === String(value));
  });
}

function syncControls() {
  harmonySelect.value = state.harmonyType;
  setActive(sizeButtons, 'size', state.size);
  setActive(formatButtons, 'format', state.format);
}

function render() {
  renderPalette(paletteEl, state.colors, state.format, { onToggleLock: toggleLock });
}

function toggleLock(index) {
  const color = state.colors[index];
  if (!color) return;
  color.locked = !color.locked;
  render();
  persist();
  showToast(color.locked ? t('toast.locked') : t('toast.unlocked'));
}

function persist() {
  const ok = savePalette(state);
  if (!saveStatus) return;
  saveStatus.textContent = ok ? t('saved') : '';
  if (ok) setTimeout(() => { saveStatus.textContent = ''; }, 1500);
}

// ---------- Paleta principal ----------
// Cambiar la armonía o el tamaño genera una nueva paleta: se trata de parámetros estructurales. 
// Cambiar el formato (HEX/HSL) simplemente vuelve a mostrar // los mismos colores con otra denominación, sin regenerarlos.
// Los colores bloqueados se mantienen en su posición y no son reemplazados por la nueva generación.

// ---------- Main Palette ----------
// Changing the harmony or size generates a new palette; these are structural parameters. 
// Changing the format (HEX/HSL) simply redisplays the same colors using a different notation, without regenerating them.
// Locked colors remain in their positions and are not replaced by the new generation.

// ---------- Palette principale ----------
// Changer d'harmonie ou de taille produit une nouvelle palette : ce sont des paramètres structurels. 
// Changer le format (HEX/HSL) ne fait que ré-afficher les mêmes couleurs sous un autre libellé, sans les régénérer.
// Les couleurs verrouillées sont conservées à leur position et ne sont pas remplacées par le nouveau tirage.

function regenerate() {
  const previous = state.colors;
  const fresh = generatePalette(state.harmonyType, state.size);

  state.colors = fresh.map((color, index) => {
    const prev = previous[index];
    if (prev && prev.locked) return prev;
    return { ...color, locked: false };
  });

  render();
  persist();

  const lockedCount = state.colors.filter((c) => c.locked).length;
  if (lockedCount > 0) {
    showToast(t('toast.regenerated', lockedCount));
  }
}

// ---------- Biblioteca de paletas guardadas ----------
// ---------- Saved Palette Library ----------
// ---------- Bibliothèque de palettes enregistrées ----------

function renderSavedList() {
  renderSavedPanel(savedList, getSavedPalettes(), {
    onLoad: loadSavedPaletteById,
    onDelete: deleteSavedPaletteById,
  });
}

function saveCurrentPalette() {
  addSavedPalette({
    colors: state.colors,
    harmonyType: state.harmonyType,
    size: state.size,
    format: state.format,
  });
  renderSavedList();
  showToast(t('toast.paletteSaved'));
}

function loadSavedPaletteById(id) {
  const entry = getSavedPalettes().find((p) => p.id === id);
  if (!entry) return;

  state.harmonyType = entry.harmonyType || state.harmonyType;
  state.size = entry.size || state.size;
  state.format = entry.format || state.format;
  state.colors = entry.colors.map((c) => ({ ...c, locked: false }));

  syncControls();
  render();
  persist();
  showToast(t('toast.paletteLoaded'));
  closePanel();
}

function deleteSavedPaletteById(id) {
  removeSavedPalette(id);
  renderSavedList();
  showToast(t('toast.paletteDeleted'));
}

// ---------- Panel lateral (fijo en PC, panel deslizante en pantallas pequeñas) ----------
// ---------- Side panel (fixed on PC, drawer on small screens) ----------
// ---------- Panneau latéral (fixe sur PC, tiroir sur petit écran) ----------

function openPanel() {
  if (!savedPanel) return;
  savedPanel.classList.add('open');
  if (panelBackdrop) panelBackdrop.hidden = false;
  if (panelToggle) panelToggle.setAttribute('aria-expanded', 'true');
}

function closePanel() {
  if (!savedPanel) return;
  savedPanel.classList.remove('open');
  if (panelBackdrop) panelBackdrop.hidden = true;
  if (panelToggle) panelToggle.setAttribute('aria-expanded', 'false');
}

// ---------- Inicialización ----------
// ---------- Initialization ----------
// ---------- Initialisation ----------

function init() {
  initLang();
  applyStaticTranslations();

  const saved = loadPalette();
  if (saved && Array.isArray(saved.colors) && saved.colors.length) {
    state.harmonyType = saved.harmonyType || state.harmonyType;
    state.size = saved.size || state.size;
    state.format = saved.format || state.format;
    state.colors = saved.colors.map((c) => ({ ...c, locked: !!c.locked }));
  } else {
    state.colors = generatePalette(state.harmonyType, state.size).map((c) => ({ ...c, locked: false }));
  }

  if (languageSelect) languageSelect.value = getLang();
  syncControls();
  render();
  renderSavedList();
}

harmonySelect.addEventListener('change', () => {
  state.harmonyType = harmonySelect.value;
  regenerate();
});

sizeButtons.forEach((btn) => btn.addEventListener('click', () => {
  state.size = Number(btn.dataset.size);
  setActive(sizeButtons, 'size', state.size);
  regenerate();
}));

formatButtons.forEach((btn) => btn.addEventListener('click', () => {
  state.format = btn.dataset.format;
  setActive(formatButtons, 'format', state.format);
  render();
  persist();
}));

generateBtn.addEventListener('click', regenerate);
saveBtn.addEventListener('click', saveCurrentPalette);

exportPngBtn.addEventListener('click', () => {
  exportPNG(state.colors);
  showToast(t('toast.exportPng'));
});

if (panelToggle) panelToggle.addEventListener('click', () => {
  if (savedPanel.classList.contains('open')) closePanel();
  else openPanel();
});
if (panelClose) panelClose.addEventListener('click', closePanel);
if (panelBackdrop) panelBackdrop.addEventListener('click', closePanel);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePanel();
});

if (languageSelect) {
  languageSelect.addEventListener('change', () => {
    setLang(languageSelect.value);
    applyStaticTranslations();
    render(); 
    // La información sobre herramientas y las etiquetas de las muestras también dependen del idioma
    // Tooltips and swatch labels also depend on the language
    // Les tooltips et libellés des swatches dépendent aussi de la langue
    renderSavedList(); 
    // El panel también tiene información sobre herramientas traducida
    // The panel also has translated tooltips
    // le panneau a lui aussi des tooltips traduits
  });
}

init();
