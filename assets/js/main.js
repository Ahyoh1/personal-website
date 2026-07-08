(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'vo-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark');
  }

  function initTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    applyTheme(saved === 'dark' ? 'dark' : 'light');
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var links = document.querySelector('[data-nav-links]');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initAccordion() {
    document.querySelectorAll('.role-card').forEach(function (card) {
      var trigger = card.querySelector('.role-summary');
      var detail = card.querySelector('.role-detail');
      if (!trigger || !detail) return;
      trigger.addEventListener('click', function () {
        var isOpen = card.getAttribute('data-open') === 'true';
        card.setAttribute('data-open', String(!isOpen));
        trigger.setAttribute('aria-expanded', String(!isOpen));
        detail.style.maxHeight = !isOpen ? detail.scrollHeight + 'px' : '0px';
      });
    });
  }

  // Builds the mailto link client-side to keep the address off
  // plain-text scrapers of the static HTML.
  function initEmailReveal() {
    var el = document.querySelector('[data-email-reveal]');
    if (!el) return;
    var user = 'victoryogbebor0';
    var domain = 'gmail.com';
    var address = user + '@' + domain;
    el.textContent = address;
    el.setAttribute('href', 'mailto:' + address);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();
    initAccordion();
    initEmailReveal();

    var themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    var current = document.body.getAttribute('data-page');
    if (current) {
      document.querySelectorAll('.nav-links a').forEach(function (link) {
        if (link.getAttribute('data-page') === current) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  });
})();
