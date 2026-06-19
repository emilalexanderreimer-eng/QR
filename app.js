const input       = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrOutput    = document.getElementById('qr-output');
const qrCanvas    = document.getElementById('qr-canvas');
const errorMsg    = document.getElementById('error-msg');
const sizeSelect  = document.getElementById('size-select');
 
/* ── Generieren ─────────────────────────────────────────── */
function generate() {
  const text = input.value.trim();
  const size = parseInt(sizeSelect.value, 10);
 
  // Fehlermeldung immer erst zurücksetzen
  errorMsg.hidden = true;
  errorMsg.textContent = '';
 
  if (!text) {
    errorMsg.textContent = 'Bitte einen Text oder eine URL eingeben.';
    errorMsg.hidden = false;
    qrOutput.hidden = true;
    return;
  }
 
  // QRCode.toCanvas zeichnet direkt auf das vorhandene <canvas>-Element
  QRCode.toCanvas(qrCanvas, text, {
    width:  size,
    margin: 2,
    color: {
      dark:  '#111111',
      light: '#ffffff',
    },
  }, function (err) {
    if (err) {
      errorMsg.textContent = 'Fehler: ' + err.message;
      errorMsg.hidden = false;
      qrOutput.hidden = true;
      return;
    }
    // Ausgabe sichtbar machen – löst die CSS-Animation aus
    qrOutput.hidden = false;
  });
}
 
/* ── Download ───────────────────────────────────────────── */
function download() {
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href     = qrCanvas.toDataURL('image/png');
  link.click();
}
 
/* ── Events ─────────────────────────────────────────────── */
generateBtn.addEventListener('click', generate);
downloadBtn.addEventListener('click', download);
 
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') generate();
});
