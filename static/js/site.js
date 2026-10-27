document.querySelector('.copy-citation')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(document.getElementById('citation').textContent);
    status.textContent = button.dataset.done;
  } catch {
    const details = document.querySelector('details');
    if (details) details.open = true;
    status.textContent = button.dataset.fail;
  }
});
const themeButton = document.querySelector('.theme-toggle');
const syncTheme = () => themeButton?.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
syncTheme();
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch {}
  syncTheme();
});
const menuButton = document.querySelector('.menu-toggle');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  document.getElementById('main-nav').classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    document.getElementById('main-nav').classList.remove('is-open');
    menuButton.focus();
  }
});
document.querySelector('.print-button')?.addEventListener('click', () => window.print());
