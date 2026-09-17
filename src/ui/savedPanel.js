import { t } from '../i18n/i18n.js';

// handlers.onLoad(id) et handlers.onDelete(id) sont fournis par main.js.
export function renderSavedPanel(container, palettes, handlers = {}) {
  container.innerHTML = '';

  if (!palettes.length) {
    const empty = document.createElement('p');
    empty.className = 'panel-empty';
    empty.textContent = t('panel.empty');
    container.appendChild(empty);
    return;
  }

  palettes.forEach((palette) => {
    const item = document.createElement('div');
    item.className = 'saved-item';
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.title = t('panel.loadItem');
    item.setAttribute('aria-label', t('panel.loadItem'));

    const swatches = document.createElement('div');
    swatches.className = 'saved-item-swatches';
    palette.colors.forEach((color) => {
      const chip = document.createElement('span');
      chip.style.backgroundColor = color.hex;
      swatches.appendChild(chip);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'saved-item-delete';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = t('panel.deleteItem');
    deleteBtn.setAttribute('aria-label', t('panel.deleteItem'));
    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      if (handlers.onDelete) handlers.onDelete(palette.id);
    });

    const load = () => {
      if (handlers.onLoad) handlers.onLoad(palette.id);
    };
    item.addEventListener('click', load);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        load();
      }
    });

    item.appendChild(swatches);
    item.appendChild(deleteBtn);
    container.appendChild(item);
  });
}
