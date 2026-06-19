const input       = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrOutput    = document.getElementById('qr-output');
const qrImg       = document.getElementById('qr-img');
const errorMsg    = document.getElementById('error-msg');
const sizeSelect  = document.getElementById('size-select');
 
let currentDataUrl = null;
 
/* ── Sicherheitscheck: Bibliothek geladen? ──────────────── */
window.addEventListener('load', function () {
  if (typeof QRCode === 'undefined') {
    errorMsg.textContent = 'Bibliothek konnte nicht geladen werden – bitte Seite neu laden.';
    errorMsg.hidden = false;
    generateBtn.disabled = true;
  }
});
 
/* ── Generieren ─────────────────────────────────────────── */
function generate() {
  const text = input.value.trim();
  const size = parseInt(sizeSelect.value, 10);
 
  errorMsg.hidden = true;
  errorMsg.textContent = '';
 
  if (!text) {
    errorMsg.textContent = 'Bitte einen Text oder eine URL eingeben.';
    errorMsg.hidden = false;
    qrOutput.hidden = true;
    return;
  }
 
  QRCode.toDataURL(text, {
    width:  size,
    margin: 4,           // ≥ 4 Module Ruhezone – Pflicht laut QR-Standard
    type:   'image/png',
    color: {
      dark:  '#000000',  // reines Schwarz
      light: '#ffffff',  // reines Weiß
    },
    errorCorrectionLevel: 'M',
  }, function (err, dataUrl) {
    if (err) {
      errorMsg.textContent = 'Fehler: ' + err.message;
      errorMsg.hidden = false;
      qrOutput.hidden = true;
      return;
    }
 
    currentDataUrl  = dataUrl;
    qrImg.src       = dataUrl;
    qrImg.width     = size;
    qrImg.height    = size;
    qrOutput.hidden = false;
  });
}
 
/* ── Download ───────────────────────────────────────────── */
function download() {
  if (!currentDataUrl) return;
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href     = currentDataUrl;
  link.click();
}
 
/* ── Events ─────────────────────────────────────────────── */
generateBtn.addEventListener('click', generate);
downloadBtn.addEventListener('click', download);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') generate();
});
