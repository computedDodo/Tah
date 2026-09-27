"use strict";
/* ==========================================================================
   IBNIDREES PROTOTYPE — app bootstrap
   ========================================================================== */
(function () {
  var U = window.U, Router = window.Router, Pages = window.Pages;

  function render404(root) {
    root.innerHTML =
      '<section class="wrap section" style="text-align:center;padding:80px 20px">' +
        "<h1>Page not found</h1>" +
        '<p style="margin-bottom:20px">That page doesn\u2019t exist in this prototype.</p>' +
        '<button class="btn btn--gold" data-nav="/">Back to home</button>' +
      "</section>";
  }

  Router.register("/", Pages.home);
  Router.register("/subjects", Pages.subjects);
  Router.register("/enroll", Pages.enroll);
  Router.register("/portal", Pages.portalPicker);
  Router.register("/portal/family", Pages.portalFamily);
  Router.register("/portal/tutor", Pages.portalTutor);
  Router.register("/portal/admin", Pages.portalAdmin);
  Router.register("/404", render404);

  // Global click delegation for any [data-nav] element anywhere on the page.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-nav]");
    if (!el) return;
    e.preventDefault();
    var params = {};
    if (el.dataset.subject) params.subject = el.dataset.subject;
    Router.navigate(el.getAttribute("data-nav"), params);
    closeMobileNav();
  });

  function setActiveNav(path) {
    U.$all(".site-nav__link").forEach(function (link) {
      var target = link.getAttribute("data-nav");
      var active = target === "/" ? path === "/" : path.indexOf(target) === 0;
      link.classList.toggle("is-active", active);
    });
  }

  function closeMobileNav() {
    document.body.classList.remove("nav-open");
  }

  document.addEventListener("route:changed", function (e) {
    setActiveNav(e.detail.path);
  });

  var navToggle = U.$("#nav-toggle");
  if (navToggle) navToggle.addEventListener("click", function () { document.body.classList.toggle("nav-open"); });

  document.addEventListener("DOMContentLoaded", function () {
    Router.init("#app");
  });
})();
