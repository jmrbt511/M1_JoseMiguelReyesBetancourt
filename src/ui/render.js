import { getContrastTextColor } from '../color/convert.js';
import { copyText } from './clipboard.js';
import { t } from '../i18n/i18n.js';

let toastTimeout;

const LOCK_CLOSED_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
const LOCK_OPEN_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>`;

// handlers.onToggleLock(index) se llama al hacer clic en el candado.
// Hacer clic en el resto de la muestra siempre copia el código de color.

// handlers.onToggleLock(index) is applied when clicking on the chains.
// Click on the rest of the swatch to copy the color code.

// handlers.onToggleLock(index) est appelé quand on clique sur le cadenas.
// Le clic sur le reste du swatch copie toujours le code couleur.

export function renderPalette(container, colors, format, handlers = {}) {
  container.innerHTML = '';

  colors.forEach((color, index) => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch' + (color.locked ? ' locked' : '');
    swatch.style.backgroundColor = color.hex;
    swatch.tabIndex = 0;
    swatch.setAttribute('role', 'button');

    const textColor = getContrastTextColor(color.hex);
    swatch.style.color = textColor;

    const code = document.createElement('span');
    code.className = 'code';
    code.textContent = format === 'hsl' ? color.hsl : color.hex.toUpperCase();
    swatch.title = t('tooltips.swatchCopy', code.textContent);
    swatch.setAttribute('aria-label', t('tooltips.swatchCopy', code.textContent));

    const lockBtn = document.createElement('button');
    lockBtn.type = 'button';
    lockBtn.className = 'lock-btn' + (color.locked ? ' active' : '');
    lockBtn.innerHTML = color.locked ? LOCK_CLOSED_SVG : LOCK_OPEN_SVG;
    lockBtn.title = color.locked ? t('tooltips.lockOff') : t('tooltips.lockOn');
    lockBtn.setAttribute('aria-pressed', String(!!color.locked));
    lockBtn.setAttribute('aria-label', lockBtn.title);
    lockBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      if (handlers.onToggleLock) handlers.onToggleLock(index);
    });

    const copyHandler = async () => {
      const ok = await copyText(code.textContent);
      showToast(ok ? t('toast.copied', code.textContent) : t('toast.copyFailed'));
    };
    swatch.addEventListener('click', copyHandler);
    swatch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        copyHandler();
      }
    });

    swatch.appendChild(lockBtn);
    swatch.appendChild(code);
    container.appendChild(swatch);
  });
}

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 1800);
}
