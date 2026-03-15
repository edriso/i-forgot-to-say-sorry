// --- DOM Elements ---
const generateBtn = document.querySelector('.generate-btn');
const textarea = document.querySelector('textarea');
const apologyCard = document.getElementById('apologyCard');
const stickerPicker = document.querySelector('.sticker-picker');

// --- Stickers ---

document.querySelector('.sticker-options').addEventListener('click', (e) => {
  const btn = e.target.closest('.sticker-option');
  if (!btn) return;
  addSticker(btn.dataset.sticker);
});

function addSticker(emoji) {
  const sticker = document.createElement('div');
  sticker.classList.add('sticker');
  sticker.textContent = emoji;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('sticker-delete');
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sticker.remove();
  });
  sticker.appendChild(deleteBtn);

  const cardRect = apologyCard.getBoundingClientRect();
  sticker.style.left = (cardRect.width / 2 - 16) + 'px';
  sticker.style.top = (cardRect.height / 2 - 16) + 'px';

  apologyCard.appendChild(sticker);
  makeDraggable(sticker);
}

// --- Drag & Drop (pointer events — works on mouse + touch) ---

function makeDraggable(el) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  el.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('sticker-delete')) return;

    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.style.zIndex = 20;
    el.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const parentRect = apologyCard.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - parentRect.left - offsetX, parentRect.width - el.offsetWidth));
    const newY = Math.max(0, Math.min(e.clientY - parentRect.top - offsetY, parentRect.height - el.offsetHeight));

    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
    e.preventDefault();
  });

  document.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    el.style.zIndex = 10;
    el.style.transition = 'transform 0.1s';
  });
}

// --- Image Generation ---

generateBtn.addEventListener('click', async () => {
  if (textarea.value.trim() === '') {
    alert('Please enter your apology first!');
    return;
  }

  // Hide UI elements for clean capture
  generateBtn.disabled = true;
  generateBtn.style.display = 'none';
  stickerPicker.style.display = 'none';
  textarea.style.resize = 'none';
  const deleteBtns = document.querySelectorAll('.sticker-delete');
  deleteBtns.forEach(btn => btn.style.display = 'none');

  const image = await htmlToImage.toPng(document.body);
  const a = document.createElement('a');
  a.href = image;
  a.download = 'apology.png';
  a.click();
  a.remove();

  // Restore UI
  generateBtn.disabled = false;
  generateBtn.style.display = 'inline-block';
  stickerPicker.style.display = '';
  textarea.style.resize = 'auto';
  deleteBtns.forEach(btn => btn.style.display = '');
  textarea.focus();

  alert('Apology image generated and downloaded!');
});
