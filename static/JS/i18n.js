/*
 * Language switching (English <-> Tamil) for every page.
 * - Reads text from window.CHURCH_TRANSLATIONS (translations.js).
 * - English is the default; the choice is saved in localStorage ("churchLanguage").
 * - No page reload: text is swapped in place, then "church:languagechange" fires
 *   so dynamic content (announcements) can re-render.
 * - The small "EN | தமிழ்" switcher is created here, so no HTML is repeated per page.
 */
(function () {
    "use strict";

    var STORAGE_KEY = "churchLanguage";
    var DEFAULT_LANG = "en";
    var LANGS = ["en", "ta"];
    var dict = window.CHURCH_TRANSLATIONS || { en: {}, ta: {} };
    var current = DEFAULT_LANG;

    function readSaved() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            return LANGS.indexOf(v) > -1 ? v : DEFAULT_LANG;
        } catch (e) { return DEFAULT_LANG; }
    }

    function t(key, params) {
        var text = (dict[current] && dict[current][key]);
        if (text === undefined) text = dict.en[key];
        if (text === undefined) return key;
        if (params) {
            Object.keys(params).forEach(function (k) {
                text = text.split("{" + k + "}").join(params[k]);
            });
        }
        return text;
    }

    var ATTRS = [
        ["data-i18n-alt", "alt"],
        ["data-i18n-label", "aria-label"],
        ["data-i18n-title", "title"]
    ];

    function translateDom(root) {
        root = root || document;
        root.querySelectorAll("[data-i18n]").forEach(function (el) {
            el.textContent = t(el.getAttribute("data-i18n"));
        });
        ATTRS.forEach(function (pair) {
            root.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
                el.setAttribute(pair[1], t(el.getAttribute(pair[0])));
            });
        });
    }

    function updateSwitcher() {
        document.querySelectorAll(".lang-switch button").forEach(function (b) {
            b.setAttribute("aria-pressed", b.getAttribute("data-lang") === current ? "true" : "false");
        });
        document.querySelectorAll(".lang-switch").forEach(function (g) {
            g.setAttribute("aria-label", t("lang.group"));
        });
    }

    function setLanguage(lang, persist) {
        current = LANGS.indexOf(lang) > -1 ? lang : DEFAULT_LANG;
        document.documentElement.lang = current;
        translateDom();
        updateSwitcher();
        if (persist) {
            try { localStorage.setItem(STORAGE_KEY, current); } catch (e) { /* storage blocked: still works for this page */ }
        }
        document.dispatchEvent(new CustomEvent("church:languagechange", { detail: { lang: current } }));
    }

    function buildSwitcher() {
        var header = document.querySelector("header.Name");
        if (!header || header.querySelector(".lang-switch")) return;
        var wrap = document.createElement("div");
        wrap.className = "lang-switch";
        wrap.setAttribute("role", "group");

        function btn(lang, label, htmlLang) {
            var b = document.createElement("button");
            b.type = "button";
            b.setAttribute("data-lang", lang);
            b.setAttribute("lang", htmlLang);
            b.textContent = label;
            b.addEventListener("click", function () { setLanguage(lang, true); });
            return b;
        }
        var sep = document.createElement("span");
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = "|";
        wrap.appendChild(btn("en", "EN", "en"));
        wrap.appendChild(sep);
        wrap.appendChild(btn("ta", "தமிழ்", "ta"));
        header.appendChild(wrap);
    }

    window.ChurchI18n = {
        t: t,
        setLanguage: function (l) { setLanguage(l, true); },
        get lang() { return current; }
    };

    function init() {
        buildSwitcher();
        setLanguage(readSaved(), false);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();

    // Keep other open tabs in sync
    window.addEventListener("storage", function (e) {
        if (e.key === STORAGE_KEY && LANGS.indexOf(e.newValue) > -1 && e.newValue !== current) setLanguage(e.newValue, false);
    });
})();
