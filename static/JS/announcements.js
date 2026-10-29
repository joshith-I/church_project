
/*
 * Edit this list to publish new announcements.
 *
 * Dates use YYYY-MM-DD.
 * Set pinned: true for important notices.
 * Set expires: "" if the notice has no expiry date.
 */

const announcements = [
    {
        id: 1,
        category: "event",
        date: "2026-10-23",
        expires: "2026-12-31",
        pinned: true,

        title: {
            en: "Upcoming Parish Feast",
            ta: "வரவிருக்கும் பங்குத் திருவிழா "
        },

        body: {
            en: "Please check with the parish office for the confirmed feast schedule and celebration details.",
            ta: "திருவிழா வின் உறுதிப்படுத்தப்பட்ட நிகழ்ச்சி நிரல் மற்றும் விவரங்களுக்கு பங்குத் தந்தையிடம் அல்லது ஆலய அலுவலகத்தில் விசாரிக்கவும்."
        }
    },

    {
        id: 2,
        category: "mass",
        date: "2026-10-23",
        expires: "",
        pinned: false,

        title: {
            en: "Holy Mass Schedule",
            ta: "திருப்பலி  நேரம்"
        },

        body: {
            en: "Please contact the parish office to confirm the current Holy Mass timings.",
            ta: "தற்போதைய திருப்பலி  நேரங்களை உறுதிப்படுத்த ஆலய அலுவலகத்தைத் தொடர்புகொள்ளவும்."
        }
    },

    {
        id: 3,
        category: "general",
        date: "2026-10-23",
        expires: "2026-11-30",
        pinned: false,

        title: {
            en: "Parish Announcements",
            ta: "பங்கின் அறிவிப்புகள்"
        },

        body: {
            en: "Parishioners are requested to follow official church announcements for the latest information.",
            ta: "சமீபத்திய தகவல்களுக்கு ஆலயத்தின் அதிகாரப்பூர்வ அறிவிப்புகளைப் பின்பற்றுமாறு பங்கு மக்களைக் கேட்டுக்கொள்கிறோம்."
        }
    }
];

const CATEGORY_KEYS = {
    mass: "ann.cat.mass",
    event: "ann.cat.event",
    meeting: "ann.cat.meeting",
    general: "ann.cat.general"
};

// Language comes from the shared switcher (i18n.js); fall back to English.
function currentLanguage() {
    return (window.ChurchI18n && window.ChurchI18n.lang) || "en";
}

function tr(key, params) {
    return window.ChurchI18n ? window.ChurchI18n.t(key, params) : key;
}

function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    return new Intl.DateTimeFormat(
        currentLanguage() === "ta" ? "ta-IN" : "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}

function getToday() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

function renderAnnouncements() {
    const container = document.getElementById("announcementList");
    const emptyMessage = document.getElementById("emptyMessage");
    const count = document.getElementById("noticeCount");
    const filter = document.getElementById("categoryFilter");

    if (!container || !emptyMessage || !count || !filter) return;

    const lang = currentLanguage();
    const today = getToday();
    const selectedCategory = filter.value;

    const visibleAnnouncements = announcements
        .filter(item => !item.expires || item.expires >= today)
        .filter(item => selectedCategory === "all" ||
            item.category === selectedCategory)
        .sort((a, b) => {
            if (a.pinned !== b.pinned) {
                return Number(b.pinned) - Number(a.pinned);
            }

            return b.date.localeCompare(a.date);
        });

    container.replaceChildren();

    visibleAnnouncements.forEach(item => {
        const card = document.createElement("article");
        card.className = "notice-card";

        if (item.pinned) card.classList.add("pinned");

        const meta = document.createElement("div");
        meta.className = "notice-meta";

        const category = document.createElement("span");
        category.className = "notice-category";
        category.textContent = tr(CATEGORY_KEYS[item.category] || "ann.notice");

        meta.appendChild(category);

        if (item.pinned) {
            const pinned = document.createElement("span");
            pinned.textContent = tr("ann.important");
            meta.appendChild(pinned);
        }

        const date = document.createElement("p");
        date.className = "notice-date";
        date.textContent = formatDate(item.date);

        const title = document.createElement("h3");
        title.textContent = item.title[lang] || item.title.en;

        const body = document.createElement("p");
        body.className = "notice-body";
        body.textContent = item.body[lang] || item.body.en;

        const footer = document.createElement("div");
        footer.className = "notice-footer";
        footer.textContent = tr("ann.cardFooter");

        card.append(meta, date, title, body, footer);
        container.appendChild(card);
    });

    count.textContent = tr("ann.count", { n: visibleAnnouncements.length });

    emptyMessage.hidden = visibleAnnouncements.length > 0;
}

document.getElementById("categoryFilter")
    .addEventListener("change", renderAnnouncements);

// Re-render whenever the language is switched (and once on first load).
document.addEventListener("church:languagechange", renderAnnouncements);
renderAnnouncements();
