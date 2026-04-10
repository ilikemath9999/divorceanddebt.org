// BTN Cross-Site Search Widget v1.0
// Embeds a floating search button that opens a Google site:-scoped search across the BTN network.
// Pure JS, no dependencies, dark theme, keyboard accessible. Under 5KB.
(function() {
  'use strict';

  var DOMAINS = [
    'openbankruptcyproject.org',
    '1328f.com',
    '1328f.org',
    'chapter7vs13.org',
    'automaticstay.org',
    '523a.org',
    'meanstest.org',
    'bankruptcymeanstest.org',
    '341meeting.org',
    '727a8.org',
    'relieffromstay.org',
    'dischargeinjunction.org',
    'bankruptcydischarge.org',
    'chapter13plan.org',
    'bankruptcymill.com',
    'bankruptcymill.org',
    'prosedebtors.org',
    'keepmycarinbankruptcy.com',
    'keepmyhouseinbankruptcy.com',
    'howmuchdoesbankruptcycost.com',
    'filebankruptcywithoutlawyer.com',
    'bankruptcystudentloans.org',
    'bankruptcyexemptionsbystate.com',
    'bankruptcytaxes.org',
    'codebtorstay.org',
    'bankruptcytrustee.org',
    'stopgarnishment.org',
    'medicaldebtbankruptcy.com',
    'bankruptcyhardship.org',
    'howtofilebankruptcy.org'
  ];

  var siteQuery = DOMAINS.map(function(d) { return 'site:' + d; }).join(' OR ');

  function ga(evt, params) {
    if (typeof gtag === 'function') gtag('event', evt, params);
  }

  // Inject CSS
  var css = document.createElement('style');
  css.textContent =
    '#btn-search-toggle{position:fixed;bottom:20px;right:20px;z-index:99999;' +
    'width:48px;height:48px;border-radius:50%;border:1px solid #30363d;' +
    'background:#161b22;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    'box-shadow:0 4px 12px rgba(0,0,0,.4);transition:transform .2s,background .2s}' +
    '#btn-search-toggle:hover{background:#21262d;transform:scale(1.08)}' +
    '#btn-search-toggle svg{width:22px;height:22px;fill:none;stroke:#58a6ff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '#btn-search-overlay{position:fixed;inset:0;z-index:100000;background:rgba(1,4,9,.75);' +
    'display:none;align-items:flex-start;justify-content:center;padding-top:18vh}' +
    '#btn-search-overlay.open{display:flex}' +
    '#btn-search-box{background:#161b22;border:1px solid #30363d;border-radius:12px;' +
    'width:90%;max-width:560px;padding:20px 24px;box-shadow:0 16px 48px rgba(0,0,0,.5)}' +
    '#btn-search-box label{display:block;color:#8b949e;font-size:.8rem;margin-bottom:8px;' +
    'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}' +
    '#btn-search-box .s-row{display:flex;gap:8px}' +
    '#btn-search-input{flex:1;padding:10px 14px;border-radius:6px;border:1px solid #30363d;' +
    'background:#0d1117;color:#f0f6fc;font-size:1rem;outline:none;' +
    'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}' +
    '#btn-search-input:focus{border-color:#58a6ff;box-shadow:0 0 0 3px rgba(88,166,255,.15)}' +
    '#btn-search-input::placeholder{color:#484f58}' +
    '#btn-search-submit{padding:10px 18px;border-radius:6px;border:none;' +
    'background:#238636;color:#fff;font-weight:600;font-size:.95rem;cursor:pointer;' +
    'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;white-space:nowrap}' +
    '#btn-search-submit:hover{background:#2ea043}' +
    '#btn-search-hint{color:#484f58;font-size:.75rem;margin-top:10px;text-align:center;' +
    'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}' +
    '#btn-search-hint kbd{background:#21262d;border:1px solid #30363d;border-radius:3px;' +
    'padding:1px 5px;font-size:.7rem;color:#8b949e}';
  document.head.appendChild(css);

  // Toggle button
  var toggle = document.createElement('button');
  toggle.id = 'btn-search-toggle';
  toggle.setAttribute('aria-label', 'Search the Bankruptcy Tools Network');
  toggle.setAttribute('title', 'Search across all BTN sites (Ctrl+K)');
  toggle.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  // Overlay
  var overlay = document.createElement('div');
  overlay.id = 'btn-search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Search');
  overlay.innerHTML =
    '<div id="btn-search-box">' +
    '<label for="btn-search-input">Search across 160+ Bankruptcy Tools Network sites</label>' +
    '<div class="s-row">' +
    '<input id="btn-search-input" type="text" placeholder="e.g. means test income" autocomplete="off">' +
    '<button id="btn-search-submit" type="button">Search</button>' +
    '</div>' +
    '<div id="btn-search-hint"><kbd>Enter</kbd> to search &middot; <kbd>Esc</kbd> to close &middot; <kbd>Ctrl+K</kbd> to toggle</div>' +
    '</div>';

  document.body.appendChild(toggle);
  document.body.appendChild(overlay);

  var input = document.getElementById('btn-search-input');
  var submitBtn = document.getElementById('btn-search-submit');

  function openSearch() {
    overlay.classList.add('open');
    setTimeout(function() { input.focus(); }, 50);
    ga('btn_search_open', { site: location.hostname, page_path: location.pathname });
  }

  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    toggle.focus();
  }

  function doSearch() {
    var q = input.value.trim();
    if (!q) return;
    ga('btn_search_query', { search_term: q.substring(0, 100), site: location.hostname, page_path: location.pathname });
    var url = 'https://www.google.com/search?q=' + encodeURIComponent(q) + '+' + encodeURIComponent(siteQuery);
    window.open(url, '_blank', 'noopener');
    closeSearch();
  }

  toggle.addEventListener('click', openSearch);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSearch(); });
  submitBtn.addEventListener('click', doSearch);

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.preventDefault();
      closeSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeSearch() : openSearch();
    }
  });
})();
