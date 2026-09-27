"use strict";
/* ==========================================================================
   IBNIDREES PROTOTYPE — shared helpers
   ========================================================================== */
(function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHTML(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function formatTime(iso) {
    var d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  function formatDateTime(iso) { return formatDate(iso) + " \u2022 " + formatTime(iso); }
  function timeAgo(iso) {
    var mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return mins <= 1 ? "just now" : mins + "m ago";
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    var days = Math.floor(hrs / 24);
    return days + "d ago";
  }

  var WHATSAPP_NUMBER = "2348109351073"; // from the flyer: 08109351073
  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  var STATUS_LABELS = {
    pending: "Awaiting review", approved: "Approved", rejected: "Not approved",
    awaiting_confirmation: "Awaiting payment confirmation", confirmed: "Payment confirmed"
  };
  var STATUS_TONES = {
    pending: "warn", approved: "ok", rejected: "danger",
    awaiting_confirmation: "warn", confirmed: "ok"
  };

  /* ---- a small, consistent inline icon set (no external icon library) --- */
  function icon(name, cls) {
    var paths = {
      cap: '<path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>',
      book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
      globe: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="16" y1="2.5" x2="16" y2="7"/><line x1="8" y1="2.5" x2="8" y2="7"/><line x1="3" y1="10" x2="21" y2="10"/>',
      clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
      whatsapp: '<path d="M20 12a8 8 0 1 1-3.6-6.66"/><path d="M20.5 3.5 16.6 6a8 8 0 0 1 3.2 6.4"/><path d="M8.5 9.2c.3-.6.9-.6 1.2 0l.7 1.4c.2.4.1.9-.2 1.2l-.5.5c-.2.2-.2.5 0 .8.6 1 1.7 2 2.7 2.5.3.2.6.1.8-.1l.5-.6c.3-.3.8-.4 1.2-.2l1.4.8c.5.3.6.9.2 1.3-1.4 1.4-3.6 1.1-5.6-.4-1.7-1.3-3-3.1-3.4-4.7-.3-1.1 0-2.1.5-2.7z" fill="currentColor" stroke="none"/>',
      chevronRight: '<polyline points="9 18 15 12 9 6"/>',
      chevronDown: '<polyline points="6 9 12 15 18 9"/>',
      play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
      video: '<rect x="2" y="6" width="14" height="12" rx="2"/><polygon points="22 8 16 12 22 16 22 8" fill="currentColor" stroke="none"/>',
      home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
      list: '<line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
      userCircle: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>',
      users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19a6.5 6.5 0 0 1 13 0"/><path d="M15.5 6.2A3.2 3.2 0 0 1 18 11.9"/><path d="M16.5 13.2c2 .4 3.5 2 3.5 3.9"/>',
      shield: '<path d="M12 3 4 6v6c0 5 3.4 7.6 8 9 4.6-1.4 8-4 8-9V6l-8-3z"/><polyline points="9 12 11 14 15 10"/>',
      arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
      mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/>',
      logout: '<path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/><polyline points="15 16 20 12 15 8"/><line x1="20" y1="12" x2="9" y2="12"/>',
      star: '<path d="M12 2.5 15 9l6.5.7-4.9 4.4 1.4 6.4L12 17.6 6 20.5l1.4-6.4L2.5 9.7 9 9l3-6.5z"/>',
      alert: '<path d="M10.3 3.9 2.6 18a1.8 1.8 0 0 0 1.6 2.7h15.6a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13.5"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/>'
    };
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || "") + "</svg>";
  }

  function showModal(title, bodyHTML) {
    var existing = document.getElementById("u-modal-root");
    if (existing) existing.remove();
    var wrap = document.createElement("div");
    wrap.id = "u-modal-root";
    wrap.className = "modal-overlay";
    wrap.innerHTML =
      '<div class="modal-card">' +
        '<div class="modal-card__head"><h3>' + escapeHTML(title) + '</h3><button class="icon-btn" id="u-modal-close">' + icon("x") + "</button></div>" +
        '<div class="modal-card__body">' + bodyHTML + "</div>" +
      "</div>";
    document.body.appendChild(wrap);
    function close() { wrap.remove(); }
    wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
    document.getElementById("u-modal-close").addEventListener("click", close);
  }

  window.U = {
    $: $, $all: $all, escapeHTML: escapeHTML,
    formatDate: formatDate, formatTime: formatTime, formatDateTime: formatDateTime, timeAgo: timeAgo,
    waLink: waLink, STATUS_LABELS: STATUS_LABELS, STATUS_TONES: STATUS_TONES, icon: icon, showModal: showModal
  };
})();
