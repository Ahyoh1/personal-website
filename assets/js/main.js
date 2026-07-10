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

  // Tool/context data behind each capability pill on the Home page,
  // sourced from the same stack tags shown per role on the Experience page.
  var CAPABILITIES = {
    'warehousing': { title: 'Data Warehousing', tools: ['Google BigQuery', 'Amazon Redshift', 'Snowflake'] },
    'transformation': { title: 'Data Transformation', tools: ['dbt', 'Dataform'] },
    'visualisation': { title: 'Data Visualisation', tools: ['Tableau', 'Looker'] },
    'orchestration': { title: 'Orchestration & Automation', tools: ['Apache Airflow', 'Terraform', 'Circle CI', 'Cloud Functions', 'Git', 'Zapier', 'n8n', 'Posthog'] },
    'ai-engineering': { title: 'AI Engineering', tools: ['MCP', 'Claude Code', 'Vertex AI (Gemini)', 'Amazon Bedrock'] },
    'languages': { title: 'Languages', tools: ['SQL', 'Python', 'JavaScript', 'Ruby on Rails'] },
    'leadership': { title: 'Team Leadership', tools: [] },
    'stakeholder': { title: 'Stakeholder Management', tools: [] },
    'cost': { title: 'Cost Optimisation', tools: [] },
    'ai-product': { title: 'AI Product Development', tools: [] },
    'culture': { title: 'Data Culture', tools: [] },
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

      // Keep the fan pointing into open space: if "away from center" would
      // send it off the edge the pill is already hugging, flip that axis
      // inward instead of letting the later bounds-clamp collapse chips
      // on top of each other.
      var edgeMargin = 130;
      if (px < edgeMargin && dx < 0) dx = Math.abs(dx) || 0.6;
      if (px > visualRect.width - edgeMargin && dx > 0) dx = -Math.abs(dx) || -0.6;
      if (py < edgeMargin && dy < 0) dy = Math.abs(dy) || 0.6;
      if (py > visualRect.height - edgeMargin && dy > 0) dy = -Math.abs(dy) || -0.6;
      var newLen = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= newLen; dy /= newLen;

      var baseAngle = Math.atan2(dy, dx);
      var spread = parsed.isNote ? 0 : Math.min(3.2, 0.8 + n * 0.34);
      var pillColor = getComputedStyle(pill).backgroundColor;

      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'cap-chip-line');
      svg.setAttribute('width', visualRect.width);
      svg.setAttribute('height', visualRect.height);
      visual.appendChild(svg);

      // Split into two interleaved rings (near/far) rather than one arc -
      // each ring spreads its own items across the full angle, and ring 1
      // is phase-shifted by half a slot so it falls in ring 0's gaps
      // instead of stacking radially outward from it.
      var useTwoRings = n >= 4;
      var ring0Count = useTwoRings ? Math.ceil(n / 2) : n;
      var ring1Count = useTwoRings ? Math.floor(n / 2) : 0;
      var baseRadius = (parsed.isNote ? 130 : 100) + n * 7;
      var ringGap = 95;
      var phaseShift = ring1Count ? (spread / ring1Count) / 2 : 0;

      parsed.items.forEach(function (text, i) {
        var inRing1 = useTwoRings && i % 2 === 1;
        var ringIndex = inRing1 ? (i - 1) / 2 : Math.ceil(i / 2);
        var ringCount = inRing1 ? ring1Count : ring0Count;
        var t = ringCount <= 1 ? 0.5 : ringIndex / (ringCount - 1);
        var angle = ringCount === 1 ? baseAngle : baseAngle - spread / 2 + spread * t;
        if (inRing1) angle += phaseShift;
        var radius = baseRadius + (inRing1 ? ringGap : 0);
        var bx = px + Math.cos(angle) * radius;
        var by = py + Math.sin(angle) * radius;
        var edgePad = 20;
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
        if (!data || !itemsFor(data).items.length) return;
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
