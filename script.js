"use strict";
const config = window.SITE_CONFIG;
document.querySelectorAll('[data-tagline]').forEach(el => el.textContent = config.tagline);
document.querySelector('[data-location]').textContent = config.location;
document.getElementById('year').textContent = new Date().getFullYear();
const projects = document.getElementById('projects');
function render(filter = 'All') {
  projects.replaceChildren();
  config.projects.filter(p => filter === 'All' || p.category === filter).forEach(p => {
    const article = document.createElement('article'); article.className = 'project';
    const img = document.createElement('img'); img.src = p.image; img.alt = p.title; img.loading = 'lazy';
    const category = document.createElement('p'); category.className = 'eyebrow'; category.textContent = p.category;
    const title = document.createElement('h3'); title.textContent = p.title;
    const description = document.createElement('p'); description.textContent = p.description;
    const preview = document.createElement('button'); preview.className = 'gallery-preview'; preview.type = 'button'; preview.setAttribute('aria-label', 'Enlarge picture: ' + p.title); preview.append(img); preview.addEventListener('click', () => { document.getElementById('gallery-image').src = p.image; document.getElementById('gallery-image').alt = p.title; document.getElementById('gallery-title').textContent = p.title; document.getElementById('gallery-description').textContent = p.description; document.getElementById('gallery-dialog').showModal(); }); article.append(preview, category, title, description); projects.append(article);
  });
}
render();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  render(button.dataset.filter);
}));
const menu = document.querySelector('.menu');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); document.getElementById('navigation').classList.toggle('open', open); });
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); document.getElementById('navigation').classList.remove('open'); }));
const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email);
if (emailReady) {
  document.getElementById('send').disabled = false;
  const note = document.getElementById('contact-note'); note.replaceChildren();
  const link = document.createElement('a'); link.href = 'mailto:' + config.email; link.textContent = config.email; note.append('Prefer email? ', link);
}
document.getElementById('quote-form').addEventListener('submit', event => {
  event.preventDefault(); if (!emailReady) return;
  const data = new FormData(event.currentTarget);
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('type')}\n\n${data.get('message')}`;
  window.location.href = 'mailto:' + config.email + '?subject=' + encodeURIComponent('Woodworking inquiry: ' + data.get('type')) + '&body=' + encodeURIComponent(body);
  document.getElementById('form-status').textContent = 'Your email draft is ready to open. Review it and press Send in your email app. If nothing opens, email us directly using the address above.';
});

const galleryDialog = document.getElementById('gallery-dialog');
galleryDialog.querySelector('.gallery-close').addEventListener('click', () => galleryDialog.close());
galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) { const bounds = galleryDialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) galleryDialog.close(); } });
