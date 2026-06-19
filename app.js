const input       = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrOutput    = document.getElementById('qr-output');
const qrWrapper   = document.getElementById('qr-canvas-wrapper');
const errorMsg    = document.getElementById('error-msg');
const sizeSelect  = document.getElementById('size-select');
 
function generate() {
  const text = input.value.trim();
  const size = parseInt(sizeSelect.value, 10);
 
  errorMsg.hidden = true;
 
  if (!text) {
    errorMsg.hidden = false;
    qrOutput.hidden = true;
    return;
  }
 
  // Hide first so the fade-in animation re-triggers on each generation
  qrOutput.hidden = true;
  qrWrapper.innerHTML = '';
 
  new QRCode(qrWrapper, {
    text,
    width:        size,
    height:       size,
    colorDark:    '#111111',
    colorLight:   '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
 
  // Show on next frame so the CSS animation fires cleanly
  requestAnimationFrame(() => {
    qrOutput.hidden = false;
  });
}
 
function download() {
  // qrcodejs renders a <canvas> in modern browsers, <img> as fallback
  const canvas = qrWrapper.querySelector('canvas');
  const img    = qrWrapper.querySelector('img');
 
  const link = document.createElement('a');
  link.download = 'qrcode.png';
 
  if (canvas) {
    link.href = canvas.toDataURL('image/png');
  } else if (img) {
    link.href = img.src;
  } else {
    return;
  }
 
  link.click();
}
 
generateBtn.addEventListener('click', generate);
downloadBtn.addEventListener('click', download);
 
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') generate();
});
 
