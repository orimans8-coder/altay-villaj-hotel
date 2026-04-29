import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* =========================================================
   ALTAY VILLAJ HOTEL — ADMIN ANNOUNCEMENTS
   Многоязычные объявления RU / KG / EN / TR
========================================================= */

let allAnnouncements = [];
let unsubscribeAnnouncements = null;

document.addEventListener("DOMContentLoaded", () => {
  createAnnouncementsSection();
  loadAnnouncements();
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

function formatAnnouncementDate(timestamp) {
  if (!timestamp) {
    return "—";
  }

  try {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString("ru-RU");
    }

    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString("ru-RU");
    }

    return "—";
  } catch {
    return "—";
  }
}

function getAnnouncementTitle(item) {
  return (
    item?.ru?.title ||
    item?.ky?.title ||
    item?.en?.title ||
    item?.tr?.title ||
    item?.title ||
    "Без заголовка"
  );
}

function getAnnouncementText(item) {
  return (
    item?.ru?.text ||
    item?.ky?.text ||
    item?.en?.text ||
    item?.tr?.text ||
    item?.text ||
    ""
  );
}

/* =========================
   CREATE ADMIN SECTION
========================= */

function createAnnouncementsSection() {
  const adminMainContainer = document.querySelector(".admin-main .container");

  if (!adminMainContainer) {
    return;
  }

  const oldSection = document.getElementById("adminAnnouncementsSection");

  if (oldSection) {
    oldSection.remove();
  }

  const section = document.createElement("section");
  section.className = "admin-section-box admin-announcements-section";
  section.id = "adminAnnouncementsSection";
  section.style.marginTop = "24px";

  section.innerHTML = `
    <h2>Объявления для гостей</h2>
    <p>
      Здесь администратор может опубликовать важное объявление.
      Оно появится на главной странице сайта на выбранном языке клиента.
    </p>

    <form id="announcementForm" class="announcement-form">
      <div class="announcement-lang-box">
        <h3>RU — Русский</h3>

        <input
          type="text"
          id="announcementTitleRu"
          placeholder="Заголовок на русском"
          value="Внимание!"
          required
        />

        <textarea
          id="announcementTextRu"
          placeholder="Текст объявления на русском"
          required
        >Мы открываемся с 1 мая.</textarea>
      </div>

      <div class="announcement-lang-box">
        <h3>KG — Кыргызча</h3>

        <input
          type="text"
          id="announcementTitleKy"
          placeholder="Кыргызча аталышы"
          value="Көңүл буруңуздар!"
          required
        />

        <textarea
          id="announcementTextKy"
          placeholder="Кыргызча жарыянын тексти"
          required
        >Биз 1-майдан баштап ачылып жатабыз.</textarea>
      </div>

      <div class="announcement-lang-box">
        <h3>EN — English</h3>

        <input
          type="text"
          id="announcementTitleEn"
          placeholder="Title in English"
          value="Attention!"
        />

        <textarea
          id="announcementTextEn"
          placeholder="Announcement text in English"
        >We are opening from May 1.</textarea>
      </div>

      <div class="announcement-lang-box">
        <h3>TR — Türkçe</h3>

        <input
          type="text"
          id="announcementTitleTr"
          placeholder="Türkçe başlık"
          value="Dikkat!"
        />

        <textarea
          id="announcementTextTr"
          placeholder="Türkçe duyuru metni"
        >1 Mayıs’tan itibaren açılıyoruz.</textarea>
      </div>

      <label class="announcement-checkbox">
        <input type="checkbox" id="announcementActive" checked />
        <span>Сразу показать на сайте</span>
      </label>

      <button type="submit" class="btn primary-btn">
        Опубликовать объявление
      </button>
    </form>

    <div class="announcements-admin-list" id="announcementsAdminList">
      <div class="announcement-empty">Загрузка объявлений...</div>
    </div>
  `;

  adminMainContainer.appendChild(section);

  const form = document.getElementById("announcementForm");

  if (form) {
    form.addEventListener("submit", handleAnnouncementSubmit);
  }

  addAnnouncementAdminStyles();
}

/* =========================
   SUBMIT ANNOUNCEMENT
========================= */

async function handleAnnouncementSubmit(event) {
  event.preventDefault();

  const titleRu = document.getElementById("announcementTitleRu")?.value.trim();
  const textRu = document.getElementById("announcementTextRu")?.value.trim();

  const titleKy = document.getElementById("announcementTitleKy")?.value.trim();
  const textKy = document.getElementById("announcementTextKy")?.value.trim();

  const titleEn = document.getElementById("announcementTitleEn")?.value.trim();
  const textEn = document.getElementById("announcementTextEn")?.value.trim();

  const titleTr = document.getElementById("announcementTitleTr")?.value.trim();
  const textTr = document.getElementById("announcementTextTr")?.value.trim();

  const activeInput = document.getElementById("announcementActive");
  const active = activeInput ? activeInput.checked : true;

  if (!titleRu || !textRu || !titleKy || !textKy) {
    alert("Заполните минимум русский и кыргызский вариант объявления.");
    return;
  }

  try {
    await addDoc(collection(db, "announcements"), {
      active,
      createdAt: serverTimestamp(),

      ru: {
        title: titleRu,
        text: textRu,
      },

      ky: {
        title: titleKy,
        text: textKy,
      },

      en: {
        title: titleEn || titleRu,
        text: textEn || textRu,
      },

      tr: {
        title: titleTr || titleRu,
        text: textTr || textRu,
      },
    });

    alert("Объявление опубликовано.");

    if (activeInput) {
      activeInput.checked = true;
    }
  } catch (error) {
    console.error("Ошибка публикации объявления:", error);
    alert("Ошибка публикации объявления.");
  }
}

/* =========================
   LOAD ANNOUNCEMENTS
========================= */

function loadAnnouncements() {
  if (unsubscribeAnnouncements) {
    unsubscribeAnnouncements();
    unsubscribeAnnouncements = null;
  }

  const announcementsQuery = query(
    collection(db, "announcements"),
    orderBy("createdAt", "desc"),
  );

  unsubscribeAnnouncements = onSnapshot(
    announcementsQuery,
    (snapshot) => {
      allAnnouncements = [];

      snapshot.forEach((announcementDoc) => {
        allAnnouncements.push({
          id: announcementDoc.id,
          ...announcementDoc.data(),
        });
      });

      renderAnnouncementsAdmin();
    },
    (error) => {
      console.error("Ошибка загрузки объявлений:", error);

      const list = document.getElementById("announcementsAdminList");

      if (list) {
        list.innerHTML = `
          <div class="announcement-empty">
            Ошибка загрузки объявлений.
          </div>
        `;
      }
    },
  );
}

/* =========================
   RENDER ADMIN LIST
========================= */

function renderAnnouncementsAdmin() {
  const list = document.getElementById("announcementsAdminList");

  if (!list) {
    return;
  }

  if (!allAnnouncements.length) {
    list.innerHTML = `
      <div class="announcement-empty">
        Пока объявлений нет.
      </div>
    `;
    return;
  }

  list.innerHTML = allAnnouncements
    .map((item) => {
      const statusText = item.active ? "Активно" : "Скрыто";
      const statusClass = item.active
        ? "announcement-status-active"
        : "announcement-status-hidden";

      return `
        <div class="announcement-admin-card">
          <div class="announcement-admin-info">
            <div class="announcement-admin-top">
              <h3>${escapeHtml(getAnnouncementTitle(item))}</h3>

              <span class="announcement-status ${statusClass}">
                ${statusText}
              </span>
            </div>

            <p>${escapeHtml(getAnnouncementText(item))}</p>

            <div class="announcement-mini-translations">
              <div><strong>RU:</strong> ${escapeHtml(item?.ru?.title || "-")}</div>
              <div><strong>KG:</strong> ${escapeHtml(item?.ky?.title || "-")}</div>
              <div><strong>EN:</strong> ${escapeHtml(item?.en?.title || "-")}</div>
              <div><strong>TR:</strong> ${escapeHtml(item?.tr?.title || "-")}</div>
            </div>

            <small>
              Дата: ${escapeHtml(formatAnnouncementDate(item.createdAt))}
            </small>
          </div>

          <div class="announcement-admin-actions">
            <button
              type="button"
              class="announcement-toggle-btn"
              data-toggle-announcement="${escapeHtml(item.id)}"
              data-current-active="${item.active ? "true" : "false"}"
            >
              ${item.active ? "Скрыть" : "Показать"}
            </button>

            <button
              type="button"
              class="announcement-delete-btn"
              data-delete-announcement="${escapeHtml(item.id)}"
            >
              Удалить
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  bindAnnouncementActions();
}

/* =========================
   ACTIONS
========================= */

function bindAnnouncementActions() {
  document.querySelectorAll("[data-toggle-announcement]").forEach((button) => {
    button.addEventListener("click", async () => {
      const announcementId = button.getAttribute("data-toggle-announcement");
      const currentActive =
        button.getAttribute("data-current-active") === "true";

      try {
        await updateDoc(doc(db, "announcements", announcementId), {
          active: !currentActive,
        });
      } catch (error) {
        console.error("Ошибка изменения статуса объявления:", error);
        alert("Ошибка изменения статуса объявления.");
      }
    });
  });

  document.querySelectorAll("[data-delete-announcement]").forEach((button) => {
    button.addEventListener("click", async () => {
      const announcementId = button.getAttribute("data-delete-announcement");
      const confirmed = window.confirm("Удалить это объявление?");

      if (!confirmed) {
        return;
      }

      try {
        await deleteDoc(doc(db, "announcements", announcementId));
      } catch (error) {
        console.error("Ошибка удаления объявления:", error);
        alert("Ошибка удаления объявления.");
      }
    });
  });
}

/* =========================
   STYLES
========================= */

function addAnnouncementAdminStyles() {
  const oldStyle = document.getElementById("adminAnnouncementsStyle");

  if (oldStyle) {
    oldStyle.remove();
  }

  const style = document.createElement("style");
  style.id = "adminAnnouncementsStyle";

  style.textContent = `
    .announcement-form {
      margin-top: 22px;
      display: grid;
      gap: 18px;
      max-width: 920px;
    }

    .announcement-lang-box {
      padding: 18px;
      border-radius: 18px;
      border: 1px solid #e8edf3;
      background: linear-gradient(180deg, #ffffff, #f8fafc);
    }

    .announcement-lang-box h3 {
      margin: 0 0 14px;
      color: #222222;
      font-size: 18px;
    }

    .announcement-form input,
    .announcement-form textarea {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #d7dbe0;
      border-radius: 14px;
      font-size: 15px;
      outline: none;
      background: #ffffff;
      transition: 0.25s ease;
      margin-bottom: 12px;
    }

    .announcement-form textarea {
      min-height: 100px;
      resize: vertical;
      margin-bottom: 0;
    }

    .announcement-form input:focus,
    .announcement-form textarea:focus {
      border-color: #7b5b3a;
      box-shadow: 0 0 0 3px rgba(123, 91, 58, 0.12);
    }

    .announcement-checkbox {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: #475569;
      font-weight: 700;
    }

    .announcement-checkbox input {
      width: auto;
      margin: 0;
    }

    .announcements-admin-list {
      margin-top: 26px;
      display: grid;
      gap: 14px;
    }

    .announcement-empty {
      padding: 18px;
      border-radius: 16px;
      background: #f8fafc;
      border: 1px solid #e8edf3;
      color: #64748b;
      text-align: center;
      font-weight: 700;
    }

    .announcement-admin-card {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 18px;
      padding: 18px;
      border-radius: 18px;
      border: 1px solid #e8edf3;
      background: linear-gradient(180deg, #ffffff, #f8fafc);
    }

    .announcement-admin-top {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .announcement-admin-top h3 {
      margin: 0;
      font-size: 20px;
      color: #222222;
    }

    .announcement-admin-info p {
      margin: 0 0 10px;
      color: #64748b;
      line-height: 1.6;
    }

    .announcement-mini-translations {
      display: grid;
      gap: 5px;
      margin: 12px 0;
      padding: 12px;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid #e8edf3;
      color: #64748b;
      font-size: 13px;
    }

    .announcement-admin-info small {
      color: #94a3b8;
      font-weight: 700;
    }

    .announcement-status {
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 900;
    }

    .announcement-status-active {
      background: #eaf8ee;
      color: #2b7a43;
    }

    .announcement-status-hidden {
      background: #eef1f5;
      color: #556070;
    }

    .announcement-admin-actions {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      flex-wrap: wrap;
    }

    .announcement-toggle-btn,
    .announcement-delete-btn {
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 900;
      transition: 0.25s ease;
    }

    .announcement-toggle-btn {
      background: #eaf8ee;
      color: #2b7a43;
    }

    .announcement-delete-btn {
      background: #f5d7d7;
      color: #9d2f2f;
    }

    .announcement-toggle-btn:hover,
    .announcement-delete-btn:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 760px) {
      .announcement-admin-card {
        grid-template-columns: 1fr;
      }

      .announcement-admin-actions {
        width: 100%;
      }

      .announcement-toggle-btn,
      .announcement-delete-btn {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);
}
