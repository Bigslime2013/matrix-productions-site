// phantomModal.js
import { startMatrixRain, stopMatrixRain } from './matrixRain.js';

export function openPhantomModal() {
  document.getElementById('phantomModal').style.display = 'block';
  startMatrixRain();
}

export function closePhantomModal() {
  document.getElementById('phantomModal').style.display = 'none';
  stopMatrixRain();
}
