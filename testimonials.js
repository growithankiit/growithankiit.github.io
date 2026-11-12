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

  function cardHtml(t) {
    var meta = [short(t.service, 60), short(t.city, 40)].filter(Boolean).map(esc).join(' · ');
    var vid = safeVideo(t.videoUrl);
    return '<figure class="card"><blockquote>' + esc(t.quote) + '</blockquote>' +
      '<figcaption><strong>' + esc(t.name) + '</strong>' +
      (meta ? '<span>' + meta + '</span>' : '') +
      (t.date ? '<span>' + esc(short(t.date, 30)) + '</span>' : '') +
      (vid ? '<a class="vid" href="' + esc(vid) + '" target="_blank" rel="noopener noreferrer">Watch video</a>' : '') +
      '</figcaption></figure>';
  }

  function render(list) {
    var v = visibleTestimonials(list);
    if (!v.length) {
      return '<p class="empty">Client reviews will appear here soon. Every review is checked with the client before it is published.</p>';
    }
    return v.map(cardHtml).join('');
  }

  var api = { esc: esc, visibleTestimonials: visibleTestimonials, render: render };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Testimonials = api;
})(typeof window !== 'undefined' ? window : this);
