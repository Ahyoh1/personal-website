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

  // Tool/context data behind each capability pill on the Home page,
  // sourced from the same stack tags shown per role on the Experience page.
  var CAPABILITIES = {
    'warehousing': { title: 'Data Warehousing', tools: ['Google BigQuery', 'Amazon Redshift', 'Snowflake'] },
    'transformation': { title: 'Data Transformation', tools: ['dbt', 'Dataform'] },
    'visualisation': { title: 'Data Visualisation', tools: ['Tableau', 'Looker'] },
    'orchestration': { title: 'Orchestration & Automation', tools: ['Apache Airflow', 'Terraform', 'Circle CI', 'Cloud Functions', 'Git', 'Zapier', 'n8n', 'Posthog'] },
    'ai-engineering': { title: 'AI Engineering', tools: ['MCP', 'Claude Code', 'Vertex AI (Gemini)', 'Amazon Bedrock'] },
    'languages': { title: 'Languages', tools: ['SQL', 'Python', 'JavaScript', 'Ruby on Rails'] },
    'leadership': { title: 'Team Leadership', tools: [], note: 'Grew and managed the analytics team at Pinpoint, and led a team of three analysts through Chelsea FC’s data platform migration.' },
    'stakeholder': { title: 'Stakeholder Management', tools: [], note: 'Reported into C-suite and board reviews at Commercetools, and partnered across engineering, design, CRM and analytics at Pinpoint.' },
    'cost': { title: 'Cost Optimisation', tools: [], note: 'Cut BigQuery costs at Pinpoint, reduced Redshift warehouse costs at Zoopla, and migrated ingestion tooling off third-party platforms to cut spend.' },
    'ai-product': { title: 'AI Product Development', tools: [], note: 'Shipped AI-powered products used company-wide: a customer-intelligence platform at Pinpoint and a pricing-intelligence tool at Zoopla.' },
    'culture': { title: 'Data Culture', tools: [], note: 'Led company-wide data-literacy initiatives at Pinpoint and drove data-driven decision-making at Commercetools.' },
    'mentorship': { title: 'Mentorship', tools: ['Utiva', 'DigiGirls', 'The Knowledge Academy'] }
  };

  function initCapabilities() {
    var pills = document.querySelectorAll('.cap-pill');
    var visual = document.querySelector('.cap-visual');
    if (!pills.length || !visual) return;
    var activePill = null;

    function isMobile() {
      return window.matchMedia('(max-width: 860px)').matches;
    }

    function itemsFor(data) {
      var isNote = !(data.tools && data.tools.length);
      return { items: isNote ? (data.note ? [data.note] : []) : data.tools, isNote: isNote };
    }

    function clearCluster() {
      visual.querySelectorAll('.cap-chip, .cap-chip-row, .cap-chip-line').forEach(function (el) {
        el.remove();
      });
      if (activePill) activePill.classList.remove('is-active');
      activePill = null;
    }

    function makeChip(text, isNote) {
      var chip = document.createElement('span');
      chip.className = 'cap-chip' + (isNote ? ' cap-chip-note' : '');
      chip.textContent = text;
      return chip;
    }

    function renderMobile(pill, data) {
      var parsed = itemsFor(data);
      if (!parsed.items.length) return;
      var row = document.createElement('div');
      row.className = 'cap-chip-row';
      parsed.items.forEach(function (text) {
        row.appendChild(makeChip(text, parsed.isNote));
      });
      pill.insertAdjacentElement('afterend', row);
    }

    function renderDesktop(pill, data) {
      var parsed = itemsFor(data);
      var n = parsed.items.length;
      if (!n) return;

      var visualRect = visual.getBoundingClientRect();
      var pillRect = pill.getBoundingClientRect();
      var cx = visualRect.width / 2;
      var cy = visualRect.height / 2;
      var px = pillRect.left - visualRect.left + pillRect.width / 2;
      var py = pillRect.top - visualRect.top + pillRect.height / 2;

      var dx = px - cx;
      var dy = py - cy;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      if (len < 30) { dx = 0; dy = 1; len = 1; }
      dx /= len; dy /= len;

      var baseAngle = Math.atan2(dy, dx);
      var spread = parsed.isNote ? 0 : Math.min(2.4, 0.6 + n * 0.3);
      var pillColor = getComputedStyle(pill).backgroundColor;

      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'cap-chip-line');
      svg.setAttribute('width', visualRect.width);
      svg.setAttribute('height', visualRect.height);
      visual.appendChild(svg);

      parsed.items.forEach(function (text, i) {
        var t = n === 1 ? 0.5 : i / (n - 1);
        var angle = n === 1 ? baseAngle : baseAngle - spread / 2 + spread * t;
        var ring = (n > 5 && i % 2 === 1) ? 1 : 0;
        var radius = (parsed.isNote ? 112 : 82) + ring * 56;
        var bx = px + Math.cos(angle) * radius;
        var by = py + Math.sin(angle) * radius;
        var edgePad = 55;
        bx = Math.min(visualRect.width - edgePad, Math.max(edgePad, bx));
        by = Math.min(visualRect.height - edgePad, Math.max(edgePad, by));

        var line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', px);
        line.setAttribute('y1', py);
        line.setAttribute('x2', bx);
        line.setAttribute('y2', by);
        line.setAttribute('stroke', pillColor);
        line.setAttribute('stroke-width', '1.5');
        svg.appendChild(line);

        var chip = makeChip(text, parsed.isNote);
        chip.style.left = bx + 'px';
        chip.style.top = by + 'px';
        chip.style.borderColor = pillColor;
        visual.appendChild(chip);

        (function (el, delay) {
          setTimeout(function () { el.classList.add('is-visible'); }, delay);
        })(chip, 30 + i * 40);
      });
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        var data = CAPABILITIES[pill.getAttribute('data-cap')];
        if (!data) return;
        var wasActive = activePill === pill;
        clearCluster();
        if (wasActive) return;

        pill.classList.add('is-active');
        activePill = pill;

        if (isMobile()) {
          renderMobile(pill, data);
        } else {
          renderDesktop(pill, data);
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!activePill) return;
      if (e.target.closest('.cap-pill') || e.target.closest('.cap-chip')) return;
      clearCluster();
    });

    window.addEventListener('resize', clearCluster);
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
    initCapabilities();

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
