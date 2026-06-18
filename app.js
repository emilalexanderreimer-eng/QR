// Hilfsfunktion
const $ = (sel) => document.querySelector(sel);

const inputText = $('#inputText');
const sizeInput = $('#size');
const marginInput = $('#margin');
const eccSelect = $('#ecc');
const fgColorInput = $('#fgColor');
const bgColorInput = $('#bgColor');

const btnGenerate = $('#btnGenerate');
const btnClear = $('#btnClear');
const btnPNG = $('#btnDownloadPNG');
const qrContainer = $('#qrContainer');

let lastCanvas = null;

function showHint() {
  qrContainer.innerHTML = '<div class="hint">Gib oben Text/URL ein und klicke „QR‑Code erzeugen“.</div>';
  btnPNG.disabled = true;
  lastCanvas = null;
}
showHint();

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function generateQRCode() {
  const text = inputText.value.trim();
  if (!text) { showHint(); return; }

  const size = clamp(parseInt(sizeInput.value, 10) || 256, 64, 4096);
  const margin = clamp(parseInt(marginInput.value, 10) || 4, 0, 128);
  const eccKey = eccSelect.value; // 'L' | 'M' | 'Q' | 'H'
  const fg = fgColorInput.value || '#000000';
  const bg = bgColorInput.value || '#ffffff';

  // Container leeren
  qrContainer.innerHTML = '';

  // qrcode.js rendert zunächst als <img> (data URL), wir konvertieren zu Canvas,
  // damit wir Margin, Farben und PNG-Export sicher steuern.
  const tempDiv = document.createElement('div');
  const qr = new QRCode(tempDiv, {
    text,
    width: size,
    height: size,
    colorDark: fg,
    colorLight: bg,
    correctLevel: QRCode.CorrectLevel[eccKey]
  });

  // Rendering ist async – per setTimeout/frame warten, bis <img> existiert
  requestAnimationFrame(() => {
    const img = tempDiv.querySelector('img') || tempDiv.querySelector('canvas');
    if (!img) { showHint(); alert('Konnte den QR‑Code nicht rendern.'); return; }

    const canvas = document.createElement('canvas');
    const s = size + margin * 2;
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d');

    // Hintergrund (Quiet Zone)
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, s, s);

    // Wenn img, dann zeichnen; wenn canvas, ebenfalls
    const draw = () => {
      ctx.drawImage(img, margin, margin, size, size);
      qrContainer.appendChild(canvas);
      lastCanvas = canvas;
      btnPNG.disabled = false;
    };

    if (img.tagName.toLowerCase() === 'img') {
      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
        img.onerror = () => { showHint(); alert('Bild konnte nicht geladen werden.'); };
      }
    } else {
      // bereits Canvas
      draw();
    }
  });
}

function downloadPNG() {
  if (!lastCanvas) return;
  lastCanvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qrcode.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/png', 1.0);
}

btnGenerate.addEventListener('click', generateQRCode);
btnClear.addEventListener('click', () => { inputText.value = ''; showHint(); });

// Optional: Live-Updates
[inputText, sizeInput, marginInput, eccSelect, fgColorInput, bgColorInput].forEach(el => {
  el.addEventListener('change', () => {
    if (inputText.value.trim()) generateQRCode();
  });
});

btnPNG.addEventListener('click', downloadPNG);
