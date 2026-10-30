// Dropdown Toggle Function
// (previously defined twice - the first copy also re-assigned window.onclick on every click; merged into one)
const CHURCH_EMAIL = "stjosephchurchkalimar@gmail.com";

function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    var dropdown = document.getElementById("councilsDropdown");
    if (dropdown) {
        var isOpen = dropdown.classList.toggle("show");
        event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
}

function closeDropdowns() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove("show");
    }
    var triggers = document.getElementsByClassName("councils");
    for (var j = 0; j < triggers.length; j++) {
        triggers[j].setAttribute("aria-expanded", "false");
    }
}

// Close Dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.councils')) {
        closeDropdowns();
    }
}

// Gallery image popup (gallery.html calls openImage()/closeImage() but they were never defined)
function openImage(src) {
    var popup = document.getElementById("imagePopup");
    var img = document.getElementById("popupImage");
    if (!popup || !img) return;
    img.src = src;
    popup.style.display = "flex";
}

function closeImage() {
    var popup = document.getElementById("imagePopup");
    if (popup) popup.style.display = "none";
}

// Escape closes the gallery popup and any open dropdown (focus goes back to the trigger)
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape') return;
    closeImage();
    var open = document.querySelector('.dropdown-content.show');
    if (open) {
        closeDropdowns();
        var trigger = document.querySelector('.councils');
        if (trigger) trigger.focus();
    }
});

// Keyboard/screen-reader support added without editing every HTML page
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown trigger announces its state
    document.querySelectorAll('.councils').forEach(function(t) {
        t.setAttribute('aria-haspopup', 'true');
        t.setAttribute('aria-expanded', 'false');
    });
    // Close the dropdown when keyboard focus tabs out of it
    document.querySelectorAll('.dropdown').forEach(function(d) {
        d.addEventListener('focusout', function(e) {
            if (!d.contains(e.relatedTarget)) closeDropdowns();
        });
    });
    // Gallery photos only had mouse onclick: make them focusable and Enter/Space operable
    document.querySelectorAll('.photo-grid img[onclick]').forEach(function(img) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openImage(img.src); }
        });
    });
    var popup = document.getElementById('imagePopup');
    // (the dialog's aria-label is set in gallery.html and translated by i18n.js)
    if (popup) { popup.setAttribute('role', 'dialog'); popup.setAttribute('aria-modal', 'true'); }
});

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Remove active styling from all buttons, add to clicked button
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // 2. Filter gallery items based on selection
      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
});



