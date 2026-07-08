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
    var panel = document.getElementById('capDetail');
    if (!pills.length || !panel) return;
    var titleEl = document.getElementById('capDetailTitle');
    var tagsEl = document.getElementById('capDetailTags');
    var noteEl = document.getElementById('capDetailNote');
    var closeBtn = document.getElementById('capDetailClose');
    var activePill = null;

    function closePanel() {
      panel.hidden = true;
      if (activePill) activePill.classList.remove('is-active');
      activePill = null;
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var data = CAPABILITIES[pill.getAttribute('data-cap')];
        if (!data) return;
        if (activePill === pill) {
          closePanel();
          return;
        }
        if (activePill) activePill.classList.remove('is-active');
        pill.classList.add('is-active');
        activePill = pill;

        titleEl.textContent = data.title;
        tagsEl.innerHTML = '';
        (data.tools || []).forEach(function (tool) {
          var span = document.createElement('span');
          span.className = 'tag';
          span.textContent = tool;
          tagsEl.appendChild(span);
        });
        noteEl.textContent = data.note || '';
        panel.hidden = false;
        panel.scrollIntoView({ block: 'nearest' });
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePanel);
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
