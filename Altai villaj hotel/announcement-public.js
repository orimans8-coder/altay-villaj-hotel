import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* =========================================================
   ALTAY VILLAJ HOTEL — PUBLIC ANNOUNCEMENT BAR
   Показывает активное объявление на выбранном языке
========================================================= */

let unsubscribePublicAnnouncements = null;
let currentAnnouncement = null;

document.addEventListener("DOMContentLoaded", () => {
  createAnnouncementBar();
  loadPublicAnnouncement();

  window.addEventListener("site-language-changed", () => {
    renderPublicAnnouncement(currentAnnouncement, true);
  });
});

/* =========================
   HELPERS
========================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCurrentLanguage() {
  return localStorage.getItem("siteLanguage") || "ru";
}

function getAnnouncementTranslation(announcement) {
  if (!announcement) {
    return null;
  }

  const lang = getCurrentLanguage();

  const current = announcement[lang];
  const fallbackRu = announcement.ru;
  const fallbackKy = announcement.ky;

  const title =
    current?.title ||
    fallbackRu?.title ||
    fallbackKy?.title ||
    announcement.title ||
    "Объявление";

  const text =
    current?.text ||
    fallbackRu?.text ||
    fallbackKy?.text ||
    announcement.text ||
    "";

  return {
    title,
    text,
  };
}

/* =========================
   CREATE BAR
========================= */

function createAnnouncementBar() {
  const oldBar = document.getElementById("publicAnnouncementBar");

  if (oldBar) {
    oldBar.remove();
  }

  const bar = document.createElement("div");
  bar.className = "public-announcement-bar";
  bar.id = "publicAnnouncementBar";
  bar.style.display = "none";

  bar.innerHTML = `
    <div class="public-announcement-inner">
      <div class="public-announcement-icon">
        <i class="fa-solid fa-bullhorn"></i>
      </div>

      <div class="public-announcement-content">
        <strong id="publicAnnouncementTitle"></strong>
        <span id="publicAnnouncementText"></span>
      </div>

      <button
        type="button"
        class="public-announcement-close"
        id="publicAnnouncementClose"
        aria-label="Закрыть объявление"
      >
        ×
      </button>
    </div>
  `;

  document.body.prepend(bar);
  addPublicAnnouncementStyles();

  const closeBtn = document.getElementById("publicAnnouncementClose");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      bar.style.display = "none";
      sessionStorage.setItem("announcementClosed", "true");
    });
  }
}

/* =========================
   LOAD ANNOUNCEMENT
========================= */

function loadPublicAnnouncement() {
  if (unsubscribePublicAnnouncements) {
    unsubscribePublicAnnouncements();
    unsubscribePublicAnnouncements = null;
  }

  const announcementsQuery = query(
    collection(db, "announcements"),
    orderBy("createdAt", "desc"),
  );

  unsubscribePublicAnnouncements = onSnapshot(
    announcementsQuery,
    (snapshot) => {
      const activeAnnouncements = [];

      snapshot.forEach((announcementDoc) => {
        const data = announcementDoc.data();

        if (data.active === true) {
          activeAnnouncements.push({
            id: announcementDoc.id,
            ...data,
          });
        }
      });

      currentAnnouncement = activeAnnouncements[0] || null;
      renderPublicAnnouncement(currentAnnouncement);
    },
    (error) => {
      console.error("Ошибка загрузки публичного объявления:", error);
    },
  );
}

/* =========================
   RENDER ANNOUNCEMENT
========================= */

function renderPublicAnnouncement(announcement, languageChanged = false) {
  const bar = document.getElementById("publicAnnouncementBar");
  const titleEl = document.getElementById("publicAnnouncementTitle");
  const textEl = document.getElementById("publicAnnouncementText");

  if (!bar || !titleEl || !textEl) {
    return;
  }

  if (!announcement) {
    bar.style.display = "none";
    return;
  }

  const closed = sessionStorage.getItem("announcementClosed");

  if (closed === "true" && !languageChanged) {
    return;
  }

  const translation = getAnnouncementTranslation(announcement);

  if (!translation || !translation.text) {
    bar.style.display = "none";
    return;
  }

  titleEl.innerHTML = escapeHtml(translation.title);
  textEl.innerHTML = escapeHtml(translation.text);

  bar.style.display = "block";
}

/* =========================
   STYLES
========================= */

function addPublicAnnouncementStyles() {
  const oldStyle = document.getElementById("publicAnnouncementStyle");

  if (oldStyle) {
    oldStyle.remove();
  }

  const style = document.createElement("style");
  style.id = "publicAnnouncementStyle";

  style.textContent = `
    .public-announcement-bar {
      position: fixed;
      left: 0;
      top: 82px;
      width: 100%;
      z-index: 1999;
      padding: 0 16px;
      animation: announcementSlideDown 0.35s ease;
    }

    .public-announcement-inner {
      width: min(1180px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-radius: 0 0 22px 22px;
      background: linear-gradient(135deg, #8b6b4a, #b9976f);
      color: #ffffff;
      box-shadow: 0 16px 40px rgba(70, 52, 34, 0.22);
    }

    .public-announcement-icon {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.18);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .public-announcement-content {
      display: flex;
      flex-direction: column;
      line-height: 1.35;
    }

    .public-announcement-content strong {
      font-size: 16px;
      font-weight: 900;
    }

    .public-announcement-content span {
      font-size: 14px;
      opacity: 0.92;
    }

    .public-announcement-close {
      width: 38px;
      height: 38px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff;
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
      transition: 0.25s ease;
    }

    .public-announcement-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.08);
    }

    @keyframes announcementSlideDown {
      from {
        opacity: 0;
        transform: translateY(-14px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .public-announcement-bar {
        top: 72px;
        padding: 0 10px;
      }

      .public-announcement-inner {
        grid-template-columns: auto 1fr auto;
        gap: 10px;
        padding: 12px;
        border-radius: 0 0 18px 18px;
      }

      .public-announcement-icon {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        font-size: 16px;
      }

      .public-announcement-content strong {
        font-size: 14px;
      }

      .public-announcement-content span {
        font-size: 13px;
      }

      .public-announcement-close {
        width: 34px;
        height: 34px;
        font-size: 24px;
      }
    }
  `;

  document.head.appendChild(style);
}
