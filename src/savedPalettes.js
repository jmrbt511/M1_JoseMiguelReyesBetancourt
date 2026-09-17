const LIBRARY_KEY = 'palette-tool:library:v1';
const LIBRARY_VERSION = 1;

function readLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (data.version !== LIBRARY_VERSION || !Array.isArray(data.palettes)) return [];
    return data.palettes;
  } catch (error) {
    console.warn('Lecture des palettes enregistrées impossible :', error);
    return [];
  }
}

function writeLibrary(palettes) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify({ version: LIBRARY_VERSION, palettes }));
    return true;
  } catch (error) {
    console.warn('Sauvegarde des palettes enregistrées impossible :', error);
    return false;
  }
}

export function getSavedPalettes() {
  return readLibrary();
}
// Guarda una instantánea de la paleta actual (colores fijados, sin el estado de "bloqueo", que solo tiene sentido durante la generación en curso). //
// Saves a snapshot of the current palette (frozen colors, excluding the "locked" state, which is only meaningful during the current generation). //
// Enregistre un instantané de la palette courante (couleurs figées, sans l'état "verrouillé" qui n'a de sens que pendant la génération en cours).//


export function addSavedPalette({ colors, harmonyType, size, format }) {
  const palettes = readLibrary();
  const entry = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    harmonyType,
    size,
    format,
    colors: colors.map((c) => ({ h: c.h, s: c.s, l: c.l, hex: c.hex, hsl: c.hsl })),
  };
  palettes.unshift(entry);
  writeLibrary(palettes);
  return entry;
}

export function removeSavedPalette(id) {
  const palettes = readLibrary().filter((p) => p.id !== id);
  writeLibrary(palettes);
  return palettes;
}
