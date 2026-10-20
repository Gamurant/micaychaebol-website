/* Mì Cay Chaebol: hiện combo và thực đơn từ menu.js, trạng thái mở cửa, menu điện thoại */
(function () {
  "use strict";

  var MENU = window.CHAEBOL_MENU;
  var OPEN_MIN = 10 * 60;        // 10:00
  var CLOSE_MIN = 21 * 60 + 30;  // 21:30

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function k(n) { return n == null ? "" : n + "K"; }

  /* ---------- Combo ---------- */
  function renderCombos() {
    var host = $("[data-combos]");
    if (!host || !MENU) return;
    host.innerHTML = MENU.combos.map(function (c, i) {
      var items = c.items.split(" + ").map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      return '<li class="combo reveal" style="--d:' + i * 80 + 'ms">' +
        '<span class="combo-no">' + esc(c.name.toUpperCase()) + "</span>" +
        '<span class="combo-new">Mới</span>' +
        '<h3 class="combo-title">' + esc(c.title) + " <span>" + esc(c.tail) + "</span></h3>" +
        '<ul class="combo-items">' + items + "</ul>" +
        '<p class="combo-price"><span>Giá combo</span><strong>' + k(c.price) + "</strong></p>" +
        "</li>";
    }).join("");
    var sp = MENU.special, spHost = $("[data-special]");
    if (sp && spHost) {
      spHost.innerHTML = '<article class="special reveal">' +
        '<div><span class="special-tag">' + esc(sp.name) + "</span>" +
        "<h3>" + esc(sp.title) + " " + esc(sp.tail) + "</h3>" +
        "<p>" + esc(sp.items) + "</p></div>" +
        '<p class="special-price"><strong>' + k(sp.price) + "</strong><span>cho 2 người</span></p>" +
        "</article>";
    }
  }

  /* ---------- Thực đơn: tab + bảng món ---------- */
  function renderMenu() {
    var host = $("[data-menu]"), tabs = $("[data-tabs]");
    if (!host || !MENU) return;
    tabs.innerHTML = MENU.groups.map(function (g, i) {
      return '<button class="tab" type="button" role="tab" id="tab-' + g.id + '" aria-controls="' + g.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
        esc(g.name) + (g.ko ? ' <span class="ko" lang="ko">' + esc(g.ko) + "</span>" : "") + "</button>";
    }).join("");
    host.innerHTML = MENU.groups.map(panelHTML).join("");
    // Có JS thì chỉ hiện nhóm đang chọn; không có JS thì hiện tất cả
    $$(".panel", host).forEach(function (p, i) { if (i > 0) p.hidden = true; });
  }
  function panelHTML(g) {
    var visual = g.photo
      ? '<div class="panel-visual"><img src="' + esc(g.photo) + '" width="720" height="540" loading="lazy" alt="' + esc(g.photoAlt || g.name) + '">' +
        '<span class="panel-label">' + esc(g.name) + (g.ko ? ' <span class="ko" lang="ko">' + esc(g.ko) + "</span>" : "") + "</span></div>"
      : '<div class="panel-visual panel-visual-type" aria-hidden="true"><span class="ko" lang="ko">' + esc(g.ko || "") + "</span><span>" + esc(g.name) + "</span></div>";
    var body = '<h3>' + esc(g.name) + (g.ko ? ' <span class="ko" lang="ko">' + esc(g.ko) + "</span>" : "") + "</h3>";
    g.sections.forEach(function (s) {
      if (s.title) body += '<h4 class="sub">' + esc(s.title) + (s.new ? ' <span class="tag tag-new">Mới</span>' : "") + "</h4>";
      body += '<ul class="items">' + s.items.map(function (it) {
        var tags = (it.pick ? '<span class="tag tag-pick">Quán gợi ý</span>' : "") + (it.new ? '<span class="tag tag-new">Mới</span>' : "");
        return '<li class="item"><span class="item-main"><span class="item-name">' + esc(it.name) + "</span>" +
          (it.ko ? '<span class="item-ko" lang="ko">' + esc(it.ko) + "</span>" : "") + tags +
          (it.note ? '<span class="item-note">' + esc(it.note) + "</span>" : "") + "</span>" +
          '<span class="leader" aria-hidden="true"></span>' +
          '<span class="item-price">' + (it.price == null ? "Hỏi quán" : k(it.price)) + "</span></li>";
      }).join("") + "</ul>";
    });
    if (g.extras) {
      body += '<div class="extras"><h4>' + esc(g.extras.title) + "</h4><ul>" + g.extras.items.map(function (x) {
        return "<li>" + esc(x.name) + " <b>" + (x.price == null ? "hỏi quán" : k(x.price)) + "</b></li>";
      }).join("") + "</ul></div>";
    }
    return '<article class="panel" id="' + esc(g.id) + '" role="tabpanel" aria-labelledby="tab-' + esc(g.id) + '">' +
      visual + '<div class="panel-body">' + body + "</div></article>";
  }
  function bindTabs() {
    var tabs = $$(".tab");
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute("aria-controls"));
        if (p) { p.hidden = !on; if (on) { p.classList.remove("is-in"); void p.offsetWidth; p.classList.add("is-in"); } }
      });
      if (focus) tab.focus();
      var bar = tab.parentNode;
      if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
        if (j === null) return;
        e.preventDefault();
        select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
  }

  /* ---------- Schema.org Menu sinh từ menu.js ---------- */
  function injectMenuSchema() {
    if (!MENU) return;
    var offer = function (p) { return p == null ? undefined : { "@type": "Offer", price: p * 1000, priceCurrency: "VND" }; };
    var sections = [{
      "@type": "MenuSection", name: "Combo",
      hasMenuItem: MENU.combos.concat(MENU.special ? [MENU.special] : []).map(function (c) {
        return { "@type": "MenuItem", name: c.name + " – " + c.title + " " + c.tail, description: c.items, offers: offer(c.price) };
      })
    }].concat(MENU.groups.map(function (g) {
      var items = [];
      g.sections.forEach(function (s) {
        s.items.forEach(function (it) {
          items.push({ "@type": "MenuItem", name: s.title ? s.title + " – " + it.name : it.name, description: it.note, offers: offer(it.price) });
        });
      });
      return { "@type": "MenuSection", name: g.name, hasMenuItem: items };
    }));
    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Menu",
      "@id": "https://micaychaebol.com/#thuc-don",
      name: "Thực đơn Mì Cay Chaebol", inLanguage: "vi",
      hasMenuSection: sections
    });
    document.head.appendChild(el);
  }

  /* ---------- Trạng thái mở cửa (giờ Việt Nam) ---------- */
  function vnMinutes() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) { if (p.type === "hour") h = +p.value % 24; if (p.type === "minute") m = +p.value; });
      return h * 60 + m;
    } catch (e) {
      var d = new Date();
      return ((d.getUTCHours() + 7) % 24) * 60 + d.getUTCMinutes();
    }
  }
  function updateStatus() {
    var el = $("[data-status]"), txt = $("[data-status-text]"), txt2 = $("[data-status-text-2]");
    var now = vnMinutes(), open = now >= OPEN_MIN && now < CLOSE_MIN, msg;
    if (open && CLOSE_MIN - now <= 30) msg = "Sắp đóng cửa · còn " + (CLOSE_MIN - now) + " phút";
    else if (open) msg = "Đang mở cửa · đến 21:30";
    else if (now < OPEN_MIN) msg = "Chưa mở cửa · mở lúc 10:00";
    else msg = "Đã đóng cửa · mở lại 10:00 mai";
    if (el) el.setAttribute("data-open", open ? "true" : "false");
    if (txt) txt.textContent = msg;
    if (txt2) txt2.textContent = msg;
  }

  /* ---------- Thanh trên cùng: bóng khi cuộn, menu điện thoại, mục đang xem ---------- */
  function bindHeader() {
    var top = $("[data-top]"), burger = $("[data-burger]"), nav = $("#nav");
    var onScroll = function () { top.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    function close() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Mở menu"); }
    burger.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    if (!("IntersectionObserver" in window)) return;
    var links = $$("a", nav), byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        if (byId[en.target.id]) byId[en.target.id].setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Hiện dần khi cuộn ---------- */
  function bindReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  renderCombos();
  renderMenu();
  bindTabs();
  injectMenuSchema();
  bindHeader();
  bindReveal();
  updateStatus();
  setInterval(updateStatus, 60 * 1000);
})();
