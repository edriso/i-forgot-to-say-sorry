const generateBtn = document.querySelector('.generate-btn');
const textarea = document.querySelector('textarea');
const apologyCard = document.getElementById('apologyCard');
const stickerOptions = document.querySelectorAll('.sticker-option');
const stickerPicker = document.querySelector('.sticker-picker');

// Add sticker to card on click
stickerOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    const emoji = btn.dataset.sticker;
    addSticker(emoji);
  });
});

function addSticker(emoji) {
  const sticker = document.createElement('div');
  sticker.classList.add('sticker');
  sticker.textContent = emoji;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('sticker-delete');
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sticker.remove();
  });
  sticker.appendChild(deleteBtn);

  // Place in center of card
  const cardRect = apologyCard.getBoundingClientRect();
  sticker.style.left = (cardRect.width / 2 - 16) + 'px';
  sticker.style.top = (cardRect.height / 2 - 16) + 'px';

  apologyCard.appendChild(sticker);
  makeDraggable(sticker);
}

function makeDraggable(el) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function onStart(e) {
    // Ignore if clicking delete button
    if (e.target.classList.contains('sticker-delete')) return;

    isDragging = true;
    const pos = getPointerPos(e);
    const rect = el.getBoundingClientRect();
    offsetX = pos.x - rect.left;
    offsetY = pos.y - rect.top;

    el.style.zIndex = 20;
    el.style.transition = 'none';

    e.preventDefault();
  }

  function onMove(e) {
    if (!isDragging) return;

    const pos = getPointerPos(e);
    const parentRect = apologyCard.getBoundingClientRect();

    let newX = pos.x - parentRect.left - offsetX;
    let newY = pos.y - parentRect.top - offsetY;

    // Clamp within card bounds
    const elWidth = el.offsetWidth;
    const elHeight = el.offsetHeight;
    newX = Math.max(0, Math.min(newX, parentRect.width - elWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - elHeight));

    el.style.left = newX + 'px';
    el.style.top = newY + 'px';

    e.preventDefault();
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    el.style.zIndex = 10;
    el.style.transition = 'transform 0.1s';
  }

  // Pointer events (covers mouse + touch)
  el.addEventListener('pointerdown', onStart);
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onEnd);
}

function getPointerPos(e) {
  return { x: e.clientX, y: e.clientY };
}

// Generate image
generateBtn.addEventListener('click', async () => {
  if (textarea.value.trim() === '') {
    alert('Please enter your apology first!');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.style.display = 'none';
  stickerPicker.style.display = 'none';
  textarea.style.resize = 'none';

  // Hide delete buttons for capture
  const deleteBtns = document.querySelectorAll('.sticker-delete');
  deleteBtns.forEach(btn => btn.style.display = 'none');

  const image = await htmlToImage.toPng(document.body);
  const a = document.createElement('a');
  a.href = image;
  a.download = 'apology.png';
  a.click();
  a.remove();

  generateBtn.disabled = false;
  generateBtn.style.display = 'inline-block';
  stickerPicker.style.display = '';
  textarea.style.resize = 'auto';
  deleteBtns.forEach(btn => btn.style.display = '');
  textarea.focus();

  alert('Apology image generated and downloaded!');
});
