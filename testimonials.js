/* Testimonials logic. Only entries that are verified AND have client consent are shown. */
(function (root) {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function visibleTestimonials(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (t) {
      return t && t.verified === true && t.consent === true &&
        typeof t.name === 'string' && t.name.trim() && t.name.length <= 60 &&
        typeof t.quote === 'string' && t.quote.trim() && t.quote.length <= 600;
    });
  }

  var VIDEO_HOSTS = ['www.youtube.com', 'youtu.be', 'www.instagram.com', 'www.linkedin.com', 'vimeo.com'];

  function safeVideo(u) {
    if (typeof u !== 'string' || u.length > 300) return '';
    var m = /^https:\/\/([a-z0-9.-]+)(\/[^\s"'<>]*)?$/i.exec(u);
    return m && VIDEO_HOSTS.indexOf(m[1].toLowerCase()) !== -1 ? u : '';
  }

  function short(s, n) {
    return typeof s === 'string' && s.length <= n ? s : '';
  }

  var CATEGORIES = [
    { id: 'buying', label: 'Help buying insurance' },
    { id: 'parents', label: 'Insurance for my parents' },
    { id: 'term', label: 'Term or life insurance' },
    { id: 'claims', label: 'Claim support' },
    { id: 'business', label: 'Business insurance' },
    { id: 'motor', label: 'Motor insurance' },
    { id: 'invest', label: 'SIPs and mutual funds' },
    { id: 'loans', label: 'Loans' }
  ];

  function labelOf(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    return '';
  }

  function categoriesOf(t) {
    var raw = t ? (Array.isArray(t.category) ? t.category : [t.category]) : [];
    var out = [];
    raw.forEach(function (id) {
      if (typeof id === 'string' && labelOf(id) && out.indexOf(id) === -1) out.push(id);
    });
    return out.length ? out : ['other'];
  }

  function categoryOf(t) {
    return categoriesOf(t)[0];
  }

  function filterByCategory(list, cat) {
    var v = visibleTestimonials(list);
    if (!cat || cat === 'all' || !labelOf(cat)) return v;
    return v.filter(function (t) { return categoriesOf(t).indexOf(cat) !== -1; });
  }

  function filtersHtml(list) {
    var v = visibleTestimonials(list);
    if (!v.length) return '';
    var out = '<button type="button" class="chip on" data-cat="all">All (' + v.length + ')</button>';
    CATEGORIES.forEach(function (c) {
      var n = v.filter(function (t) { return categoriesOf(t).indexOf(c.id) !== -1; }).length;
      if (n) out += '<button type="button" class="chip" data-cat="' + c.id + '">' + esc(c.label) + ' (' + n + ')</button>';
    });
    return out;
  }

  function cardHtml(t) {
    var meta = [categoriesOf(t).map(labelOf).filter(Boolean).join(', ') || short(t.service, 60), short(t.city, 40)].filter(Boolean).map(esc).join(' · ');
    var vid = safeVideo(t.videoUrl);
    return '<figure class="card"><blockquote>' + esc(t.quote) + '</blockquote>' +
      '<figcaption><strong>' + esc(t.name) + '</strong>' +
      (meta ? '<span>' + meta + '</span>' : '') +
      (t.date ? '<span>' + esc(short(t.date, 30)) + '</span>' : '') +
      (vid ? '<a class="vid" href="' + esc(vid) + '" target="_blank" rel="noopener noreferrer">Watch video</a>' : '') +
      '</figcaption></figure>';
  }

  function render(list, cat) {
    var all = visibleTestimonials(list);
    var v = filterByCategory(list, cat);
    if (all.length && !v.length) return '<p class="empty">No reviews in this category yet.</p>';
    if (!v.length) {
      return '<p class="empty">Client reviews will appear here soon. Every review is checked with the client before it is published.</p>';
    }
    return v.map(cardHtml).join('');
  }

  var api = { esc: esc, visibleTestimonials: visibleTestimonials, render: render, CATEGORIES: CATEGORIES, categoryOf: categoryOf, categoriesOf: categoriesOf, filterByCategory: filterByCategory, filtersHtml: filtersHtml };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Testimonials = api;
})(typeof window !== 'undefined' ? window : this);
