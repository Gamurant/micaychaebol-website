/* Mì Cay Chaebol: hiện thực đơn từ menu.js, trạng thái mở cửa */
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
    var list = MENU.combos.slice();
    var html = list.map(function (c) { return comboHTML(c, false); }).join("");
    if (MENU.special) html += comboHTML(MENU.special, true);
    host.innerHTML = html;
  }
  function comboHTML(c, special) {
    return '<li class="combo' + (special ? " combo-special" : "") + '">' +
      '<p class="combo-name"><span class="caps">' + esc(c.title) + '</span> <span class="tail">' + esc(c.tail) + "</span></p>" +
      '<p class="combo-items"><b>' + esc(c.name) + "</b> · " + esc(c.items) + "</p>" +
      '<span class="combo-price">' + k(c.price) + "</span>" +
      "</li>";
  }

  /* ---------- Thực đơn ---------- */
  function renderMenu() {
    var host = $("[data-menu]"), tabs = $("[data-tabs]");
    if (!host || !MENU) return;
    // Chia nhóm món vào 2 cột cho cân: thử mọi cách chia, giữ thứ tự trong từng cột.
    // Trên điện thoại hai cột gộp lại và nhóm món trở về đúng thứ tự trong menu.js.
    var gs = MENU.groups, w = gs.map(function (g) {
      var n = (g.photo ? 6 : 0) + 2 + (g.extras ? 2 : 0);
      g.sections.forEach(function (s) { n += s.items.length + (s.title ? 1 : 0); });
      return n;
    });
    var best = 0, bestDiff = Infinity;
    for (var mask = 0; mask < (1 << gs.length); mask++) {
      if ((mask & 1) || !(mask & 2)) continue;          // nhóm 1 bên trái, nhóm 2 bên phải
      var d = 0;
      for (var j = 0; j < gs.length; j++) d += (mask >> j & 1) ? -w[j] : w[j];
      if (Math.abs(d) < bestDiff) { bestDiff = Math.abs(d); best = mask; }
    }
    var cols = [[], []];
    gs.forEach(function (g, i) { cols[best >> i & 1].push(groupHTML(g, i)); });
    host.innerHTML = cols.map(function (c) { return '<div class="menu-col">' + c.join("") + "</div>"; }).join("");
    tabs.innerHTML = MENU.groups.map(function (g) {
      return '<a href="#' + g.id + '">' + esc(g.name) + ' <span class="ko" lang="ko">' + esc(g.ko || "") + "</span></a>";
    }).join("");
  }
  function groupHTML(g, i) {
    var out = '<article class="group" id="' + esc(g.id) + '" style="order:' + i + '" aria-labelledby="' + esc(g.id) + '-h">';
    out += '<header class="group-head"><h3 id="' + esc(g.id) + '-h">' + esc(g.name) + "</h3>" +
      (g.ko ? '<span class="ko" lang="ko">' + esc(g.ko) + "</span>" : "") + "</header>";
    if (g.photo) {
      out += '<div class="group-photo"><img src="' + esc(g.photo) + '" width="720" height="540" loading="lazy" alt="' + esc(g.photoAlt || g.name) + '"></div>';
    }
    g.sections.forEach(function (s) {
      if (s.title) {
        out += '<h4 class="sub">' + esc(s.title) + (s.new ? ' <span class="tag tag-new">Mới</span>' : "") + "</h4>";
      }
      out += '<ul class="items">' + s.items.map(function (it) {
        var tags = (it.pick ? '<span class="tag tag-pick">Quán gợi ý</span>' : "") + (it.new ? '<span class="tag tag-new">Mới</span>' : "");
        return '<li class="item' + (it.pick ? " is-pick" : "") + '">' +
          '<p class="item-name"><span>' + esc(it.name) + "</span>" +
          (it.ko ? '<span class="ko-name" lang="ko">' + esc(it.ko) + "</span>" : "") + tags +
          (it.note ? '<span class="item-note">' + esc(it.note) + "</span>" : "") + "</p>" +
          (it.price == null
            ? '<span class="item-price ask">Hỏi quán</span>'
            : '<span class="item-price">' + k(it.price) + "</span>") +
          "</li>";
      }).join("") + "</ul>";
    });
    if (g.extras) {
      out += '<div class="extras"><h4>' + esc(g.extras.title) + "</h4><ul>" + g.extras.items.map(function (x) {
        return "<li>" + esc(x.name) + " <b>" + (x.price == null ? "hỏi quán" : k(x.price)) + "</b></li>";
      }).join("") + "</ul></div>";
    }
    return out + "</article>";
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
    var data = {
      "@context": "https://schema.org", "@type": "Menu",
      "@id": "https://micaychaebol.com/#thuc-don",
      name: "Thực đơn Mì Cay Chaebol", inLanguage: "vi",
      hasMenuSection: sections
    };
    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
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
    var el = $("[data-status]"), txt = $("[data-status-text]");
    if (!el || !txt) return;
    var now = vnMinutes(), open = now >= OPEN_MIN && now < CLOSE_MIN, msg;
    if (open && CLOSE_MIN - now <= 30) msg = "Sắp đóng cửa · còn " + (CLOSE_MIN - now) + " phút";
    else if (open) msg = "Đang mở cửa · đến 21:30";
    else if (now < OPEN_MIN) msg = "Chưa mở cửa · mở lúc 10:00";
    else msg = "Đã đóng cửa · mở lại 10:00 mai";
    el.setAttribute("data-open", open ? "true" : "false");
    txt.textContent = msg;
  }

  /* ---------- Tab nhóm món đang xem ---------- */
  function bindTabs() {
    var links = $$("[data-tabs] a");
    if (!("IntersectionObserver" in window) || !links.length) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId[en.target.id];
        if (a) {
          a.setAttribute("aria-current", "true");
          var bar = a.parentNode;
          bar.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$(".group").forEach(function (g) { io.observe(g); });
  }

  /* ---------- Hiện dần khi cuộn ---------- */
  function bindReveal() {
    var els = $$(".reveal, .group, .combo");
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
  injectMenuSchema();
  bindTabs();
  bindReveal();
  updateStatus();
  setInterval(updateStatus, 60 * 1000);
})();
