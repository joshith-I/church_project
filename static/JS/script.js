function toggleDropdown(event) {
  const dropdown = document.getElementById('councilsDropdown');
  if (!dropdown) return;

  if (event) event.preventDefault();
  dropdown.classList.toggle('show');
}

function openImage(src) {
  const popup = document.getElementById('imagePopup');
  const popupImage = document.getElementById('popupImage');
  if (!popup || !popupImage) return;
  popupImage.src = src;
  popup.style.display = 'flex';
}

function closeImage() {
  const popup = document.getElementById('imagePopup');
  if (!popup) return;
  popup.style.display = 'none';
  const popupImage = document.getElementById('popupImage');
  if (popupImage) popupImage.src = '';
}

document.addEventListener('click', function (event) {
  const dropdown = document.getElementById('councilsDropdown');
  const trigger = document.querySelector('.councils');
  if (!dropdown || !trigger) return;

  const clickedInsideDropdown = dropdown.contains(event.target);
  const clickedTrigger = trigger.contains(event.target);

  if (!clickedInsideDropdown && !clickedTrigger) {
    dropdown.classList.remove('show');
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeImage();
  }
});
