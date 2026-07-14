const navToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

if (navToggle && primaryNavigation) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNavigation.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNavigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement && primaryNavigation.classList.contains('is-open')) {
      primaryNavigation.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof window.createSnakeGame === 'function') {
    window.createSnakeGame();
  }
});
