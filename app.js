// ─── Elemente ────────────────────────────────────────────────
var input       = document.getElementById('qr-input');
var generateBtn = document.getElementById('generate-btn');
var downloadBtn = document.getElementById('download-btn');
var qrOutput    = document.getElementById('qr-output');
var qrCanvas    = document.getElementById('qr-canvas');
var errorMsg    = document.getElementById('error-msg');
var sizeSelect  = document.getElementById('size-select');
 
// ─── Hilfsfunktion Fehleranzeige ─────────────────────────────
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden      = false;
  qrOutput.hidden      = true;
}
 
// ─── QR-Code generieren ──────────────────────────────────────
// Verwendet window.qrcode (qrcode-generator, Kazuhiko Arase).
// Die API ist vollständig synchron – kein Callback, kein Promise.
function generate() {
  var text = input.value.trim();
  var size = parseInt(sizeSelect.value, 10);
 
  errorMsg.hidden = true;
 
  if (!text) {
    showError('Bitte einen Text oder eine URL eingeben.');
    return;
  }
 
  try {
    // typeNumber 0 = automatisch; 'M' = mittlere Fehlerkorrektur
    var qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
 
    var modules = qr.getModuleCount(); // z.B. 33 für eine kurze URL
    var margin  = 4;                   // 4-Modul-Ruhezone (ISO-18004-Pflicht)
    var total   = modules + margin * 2;
    var cell    = Math.max(1, Math.floor(size / total));
    var edge    = cell * total;        // tatsächliche Canvas-Größe
 
    // Canvas dimensionieren
    qrCanvas.width  = edge;
    qrCanvas.height = edge;
 
    var ctx = qrCanvas.getContext('2d');
 
    // Hintergrund: reines Weiß
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, edge, edge);
 
    // Module: reines Schwarz
    ctx.fillStyle = '#000000';
    for (var row = 0; row < modules; row++) {
      for (var col = 0; col < modules; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            (margin + col) * cell,
            (margin + row) * cell,
            cell,
            cell
          );
        }
      }
    }
 
    qrOutput.hidden = false;
 
  } catch (e) {
    // Häufigste Ursache: Text zu lang für QR-Kapazität
    showError('Fehler beim Generieren: ' + e.message);
  }
}
 
// ─── Download ────────────────────────────────────────────────
function download() {
  var link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href     = qrCanvas.toDataURL('image/png');
  link.click();
}
 
// ─── Events ──────────────────────────────────────────────────
generateBtn.addEventListener('click', generate);
downloadBtn.addEventListener('click', download);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') generate();
});
