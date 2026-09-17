const STORAGE_KEY = 'palette-tool:v1';
const STORAGE_VERSION = 1;

export function savePalette(state) {
  try {
    const payload = {
      version: STORAGE_VERSION,
      harmonyType: state.harmonyType,
      size: state.size,
      format: state.format,
      colors: state.colors,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.warn('Sauvegarde locale impossible :', error);
    return false;
  }
}

export function loadPalette() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);

    // Una versión diferente implica un formato de datos incompatible: Se descarta la copia de seguridad en lugar de arriesgarse a un fallo del sistema.
    // A different version implies an incompatible data format: The save file is ignored rather than risking a crash.
    // Une version différente signifie un format de données incompatible : On ignore la sauvegarde plutôt que de risquer un plantage.
    
    if (data.version !== STORAGE_VERSION) return null;
    return data;
  } catch (error) {
    console.warn('Lecture de la sauvegarde locale impossible :', error);
    return null;
  }
}
