import { translations } from './translations.js';

const LANG_STORAGE_KEY = 'palette-tool:lang';
export const SUPPORTED_LANGS = ['es', 'en', 'fr'];
export const DEFAULT_LANG = 'es'; // langue de base du site

let currentLang = DEFAULT_LANG;

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (error) {
    console.warn('Impossible de sauvegarder la préférence de langue :', error);
  }
}

// À appeler une fois au démarrage : relit la langue choisie précédemment,
// ou retombe sur l'espagnol si rien n'est stocké ou navigateur non pris en charge.
export function initLang() {
  let stored = null;
  try {
    stored = localStorage.getItem(LANG_STORAGE_KEY);
  } catch (error) {
    stored = null;
  }
  currentLang = SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG;
  document.documentElement.lang = currentLang;
  return currentLang;
}

// t('toast.copied', '#FF0000') -> lit translations[currentLang].toast.copied('#FF0000')
// Si la clé est absente dans la langue courante, on retombe sur DEFAULT_LANG
// plutôt que de laisser un texte vide à l'écran.
export function t(path, ...args) {
  const resolve = (dict) => path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), dict);

  let value = resolve(translations[currentLang]);
  if (value === undefined) value = resolve(translations[DEFAULT_LANG]);
  if (value === undefined) return path;

  return typeof value === 'function' ? value(...args) : value;
}
