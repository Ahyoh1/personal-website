(function () {
  'use strict';

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

  function initReadMore() {
    document.querySelectorAll('[data-readmore]').forEach(function (trigger) {
      var detail = trigger.nextElementSibling;
      if (!detail || !detail.classList.contains('exp-detail')) return;
      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        trigger.textContent = !isOpen ? 'Show less' : 'Read more →';
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
    initNav();
    initReadMore();
    initEmailReveal();

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
