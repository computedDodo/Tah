"use strict";
/* ==========================================================================
   IBNIDREES PROTOTYPE — router
   Hash-based on purpose: zero server configuration needed to deploy this
   as a static site, and a hard refresh on any page never 404s.
   ========================================================================== */
(function () {
  var routes = {};
  var appEl = null;

  function register(name, renderFn) { routes[name] = renderFn; }

  function parseHash() {
    var raw = window.location.hash.slice(1) || "/";
    var parts = raw.split("?");
    var path = parts[0] || "/";
    var params = {};
    if (parts[1]) new URLSearchParams(parts[1]).forEach(function (v, k) { params[k] = v; });
    return { path: path, params: params };
  }

  function navigate(path, params) {
    var hash = "#" + path;
    if (params && Object.keys(params).length) hash += "?" + new URLSearchParams(params).toString();
    window.location.hash = hash;
  }

  function currentPath() { return parseHash().path; }

  function renderRoute() {
    var loc = parseHash();
    var renderFn = routes[loc.path] || routes["/404"];
    appEl.innerHTML = "";
    renderFn(appEl, loc.params);
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent("route:changed", { detail: loc }));
  }

  function init(rootSelector) {
    appEl = document.querySelector(rootSelector);
    window.addEventListener("hashchange", renderRoute);
    renderRoute();
  }

  window.Router = { register: register, navigate: navigate, init: init, currentPath: currentPath };
})();
