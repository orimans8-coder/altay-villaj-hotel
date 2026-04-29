import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* =========================================================
   ADMIN SECURITY
   Пароль: Beka2004
   В коде хранится только SHA-256 хэш пароля
========================================================= */

const ADMIN_PASSWORD_HASH =
  "fad1dbf54417987d4ddb92684287b2878ce537cf7287907a97bcd5cb9833ca92";

/* =========================================================
   EMAILJS CONFIG
========================================================= */

const EMAILJS_PUBLIC_KEY = "zkRvmPwNIHKKu0c_8";
const EMAILJS_SERVICE_ID = "service_8rvug6o";
const EMAILJS_DECISION_TEMPLATE_ID = "template_96knwos";

/* =========================================================
   GLOBAL STATE
========================================================= */

let emailJsInitialized = false;
let allBookings = [];
let allReviews = [];
let unsubscribeBookings = null;
let unsubscribeReviews = null;

/* =========================================================
   DOM ELEMENTS
========================================================= */

const adminLoginOverlay = document.getElementById("adminLoginOverlay");
const adminPanel = document.getElementById("adminPanel");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPasswordInput = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const exportBtn = document.getElementById("exportBtn");
const bookingList = document.getElementById("booking-list");
const reviewsAdminList = document.getElementById("reviewsAdminList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalBookingsEl = document.getElementById("totalCount");
const newBookingsEl = document.getElementById("newCount");
const confirmedBookingsEl = document.getElementById("confirmedCount");
const cancelledBookingsEl = document.getElementById("cancelledCount");
const completedBookingsEl = document.getElementById("completedCount");

/* =========================================================
   HELPERS
========================================================= */

function t(key) {
  return window.adminT ? window.adminT(key) : key;
}

function showMessage(message) {
  alert(message);
}

async function hashText(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(value || ""));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCommentPreview(comment) {
  const text = String(comment || "").trim();

  if (!text) {
    return t("no_data");
  }

  return text.length > 60 ? `${text.slice(0, 60)}...` : text;
}

function formatDateFromTimestamp(timestamp) {
  if (!timestamp) {
    return t("no_date");
  }

  try {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString("ru-RU");
    }

    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString("ru-RU");
    }

    if (timestamp instanceof Date) {
      return timestamp.toLocaleString("ru-RU");
    }

    if (typeof timestamp === "string") {
      return timestamp;
    }

    return t("no_date");
  } catch {
    return t("no_date");
  }
}

function getEmailErrorMessage(error) {
  if (!error) {
    return "Неизвестная ошибка";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.text) {
    return error.text;
  }

  if (error.message) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Неизвестная ошибка";
  }
}

/* =========================================================
   EMAILJS
========================================================= */

function initEmailJS() {
  if (emailJsInitialized) {
    return true;
  }

  try {
    if (!window.emailjs) {
      console.warn("EmailJS SDK не найден.");
      return false;
    }

    window.emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });

    emailJsInitialized = true;
    return true;
  } catch (error) {
    console.error("Ошибка инициализации EmailJS:", error);
    return false;
  }
}

async function sendDecisionEmail(booking, decisionMessage) {
  if (!window.emailjs) {
    throw new Error("EmailJS SDK не загружен.");
  }

  if (!booking?.guestEmail) {
    throw new Error("У клиента отсутствует email.");
  }

  return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_DECISION_TEMPLATE_ID, {
    to_name: booking.guestName || "Гость",
    to_email: booking.guestEmail || "",
    check_in: booking.checkIn || "-",
    check_out: booking.checkOut || "-",
    hotel_name: "AltayVilage_Hotel",
    phone: booking.guestPhone || "-",
    room_type: booking.roomType || "-",
    guest_count: booking.guestCount || "-",
    guest_comment: booking.guestComment || "-",
    decision_message: decisionMessage,
  });
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

function showAdminPanel() {
  if (adminLoginOverlay) {
    adminLoginOverlay.style.display = "none";
  }

  if (adminPanel) {
    adminPanel.style.display = "block";
  }

  sessionStorage.setItem("adminLoggedIn", "true");
}

function showLoginPanel() {
  if (adminLoginOverlay) {
    adminLoginOverlay.style.display = "flex";
  }

  if (adminPanel) {
    adminPanel.style.display = "none";
  }

  sessionStorage.removeItem("adminLoggedIn");
}

function checkAdminAccess() {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn");

  if (isLoggedIn === "true") {
    showAdminPanel();
    loadBookings();
    loadReviewsAdmin();
  } else {
    showLoginPanel();
  }
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const enteredPassword = adminPasswordInput
      ? adminPasswordInput.value.trim()
      : "";

    const enteredPasswordHash = await hashText(enteredPassword);

    if (enteredPasswordHash === ADMIN_PASSWORD_HASH) {
      if (loginError) {
        loginError.textContent = "";
      }

      if (adminPasswordInput) {
        adminPasswordInput.value = "";
      }

      showAdminPanel();
      loadBookings();
      loadReviewsAdmin();
    } else {
      if (loginError) {
        loginError.textContent = t("login_error");
      }
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminLoggedIn");

    if (unsubscribeBookings) {
      unsubscribeBookings();
      unsubscribeBookings = null;
    }

    if (unsubscribeReviews) {
      unsubscribeReviews();
      unsubscribeReviews = null;
    }

    allBookings = [];
    allReviews = [];

    showLoginPanel();
    window.location.reload();
  });
}

/* =========================================================
   BOOKING STATUS
========================================================= */

function normalizeStatus(status) {
  const normalized = String(status || "").trim();

  const map = {
    Жаңы: "Новая",
    Новая: "Новая",
    New: "Новая",
    Yeni: "Новая",

    Подтверждена: "Подтверждена",
    Confirmed: "Подтверждена",
    Тастыкталган: "Подтверждена",
    Onaylandı: "Подтверждена",

    Отменена: "Отменена",
    Cancelled: "Отменена",
    "Жокко чыгарылган": "Отменена",
    "İptal Edildi": "Отменена",

    Завершена: "Завершена",
    Completed: "Завершена",
    Аяктаган: "Завершена",
    Tamamlandı: "Завершена",
  };

  return map[normalized] || "Новая";
}

function getStatusLabel(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "Новая") {
    return t("status_new");
  }

  if (normalized === "Подтверждена") {
    return t("status_confirmed");
  }

  if (normalized === "Отменена") {
    return t("status_cancelled");
  }

  if (normalized === "Завершена") {
    return t("status_completed");
  }

  return normalized;
}

function getStatusClass(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "Подтверждена") {
    return "status-confirmed";
  }

  if (normalized === "Отменена") {
    return "status-cancelled";
  }

  if (normalized === "Завершена") {
    return "status-completed";
  }

  return "status-new";
}

async function changeStatus(docId, newStatus) {
  try {
    const booking = allBookings.find((item) => item.id === docId);

    if (!booking) {
      showMessage("Заявка не найдена.");
      return;
    }

    const oldStatus = normalizeStatus(booking.status);
    const normalizedNewStatus = normalizeStatus(newStatus);

    const bookingRef = doc(db, "bookings", docId);

    await updateDoc(bookingRef, {
      status: normalizedNewStatus,
    });

    booking.status = normalizedNewStatus;

    if (oldStatus === normalizedNewStatus) {
      showMessage("Статус сохранён.");
      return;
    }

    if (
      normalizedNewStatus !== "Подтверждена" &&
      normalizedNewStatus !== "Отменена"
    ) {
      showMessage("Статус успешно обновлён.");
      return;
    }

    if (!booking.guestEmail || !booking.guestEmail.trim()) {
      showMessage(
        "Статус обновлён, но письмо не отправлено: у клиента не указан email.",
      );
      return;
    }

    if (!initEmailJS()) {
      showMessage(
        "Статус обновлён, но письмо не отправлено: EmailJS не подключён.",
      );
      return;
    }

    try {
      if (normalizedNewStatus === "Подтверждена") {
        await sendDecisionEmail(
          booking,
          "Ваша заявка в AltayVilage_Hotel одобрена. Бронирование подтверждено.",
        );

        showMessage("Статус обновлён. Письмо об одобрении успешно отправлено.");
      }

      if (normalizedNewStatus === "Отменена") {
        await sendDecisionEmail(
          booking,
          "К сожалению, ваша заявка в AltayVilage_Hotel не была одобрена. Возможно, на выбранные даты нет свободных мест.",
        );

        showMessage("Статус обновлён. Письмо об отказе успешно отправлено.");
      }
    } catch (emailError) {
      console.error("Ошибка отправки письма:", emailError);

      showMessage(
        "Статус обновлён, но письмо не отправилось: " +
          getEmailErrorMessage(emailError),
      );
    }
  } catch (error) {
    console.error("Ошибка при изменении статуса:", error);
    showMessage(t("update_error"));
  }
}

async function removeBooking(docId) {
  const isConfirmed = window.confirm(t("delete_confirm"));

  if (!isConfirmed) {
    return;
  }

  try {
    const bookingRef = doc(db, "bookings", docId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    showMessage(t("delete_error"));
  }
}

/* =========================================================
   BOOKINGS RENDER
========================================================= */

function updateStats(bookings) {
  if (totalBookingsEl) {
    totalBookingsEl.textContent = bookings.length;
  }

  if (newBookingsEl) {
    newBookingsEl.textContent = bookings.filter(
      (item) => normalizeStatus(item.status) === "Новая",
    ).length;
  }

  if (confirmedBookingsEl) {
    confirmedBookingsEl.textContent = bookings.filter(
      (item) => normalizeStatus(item.status) === "Подтверждена",
    ).length;
  }

  if (cancelledBookingsEl) {
    cancelledBookingsEl.textContent = bookings.filter(
      (item) => normalizeStatus(item.status) === "Отменена",
    ).length;
  }

  if (completedBookingsEl) {
    completedBookingsEl.textContent = bookings.filter(
      (item) => normalizeStatus(item.status) === "Завершена",
    ).length;
  }
}

function renderBookings(bookings) {
  if (!bookingList) {
    return;
  }

  bookingList.innerHTML = "";

  if (!bookings.length) {
    bookingList.innerHTML = `
      <tr>
        <td colspan="11" class="empty-row">${t("not_found")}</td>
      </tr>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  bookings.forEach((item) => {
    const currentStatus = normalizeStatus(item.status);
    const row = document.createElement("tr");
    row.className = "booking-row";

    row.innerHTML = `
      <td><strong>${escapeHtml(item.guestName || t("no_data"))}</strong></td>
      <td>${escapeHtml(item.guestPhone || t("no_data"))}</td>
      <td>${escapeHtml(item.guestEmail || t("no_data"))}</td>
      <td>${escapeHtml(item.roomType || t("no_data"))}</td>
      <td>${escapeHtml(item.guestCount || t("no_data"))}</td>
      <td>${escapeHtml(item.checkIn || t("no_data"))}</td>
      <td>${escapeHtml(item.checkOut || t("no_data"))}</td>
      <td title="${escapeHtml(item.guestComment || "")}">
        ${escapeHtml(getCommentPreview(item.guestComment))}
      </td>
      <td>
        <span class="status-badge ${getStatusClass(currentStatus)}">
          ${escapeHtml(getStatusLabel(currentStatus))}
        </span>

        <div style="margin-top:8px;">
          <select class="status-select" data-id="${escapeHtml(item.id)}">
            <option value="Новая" ${
              currentStatus === "Новая" ? "selected" : ""
            }>${t("status_new")}</option>

            <option value="Подтверждена" ${
              currentStatus === "Подтверждена" ? "selected" : ""
            }>${t("status_confirmed")}</option>

            <option value="Отменена" ${
              currentStatus === "Отменена" ? "selected" : ""
            }>${t("status_cancelled")}</option>

            <option value="Завершена" ${
              currentStatus === "Завершена" ? "selected" : ""
            }>${t("status_completed")}</option>
          </select>
        </div>
      </td>
      <td>${escapeHtml(item.createdAtFormatted || t("no_date"))}</td>
      <td>
        <div class="table-actions">
          <button class="save-status-btn" data-id="${escapeHtml(
            item.id,
          )}" type="button">
            ${t("save_btn")}
          </button>

          <button class="delete-btn" data-id="${escapeHtml(
            item.id,
          )}" type="button">
            ${t("delete_btn")}
          </button>
        </div>
      </td>
    `;

    fragment.appendChild(row);
  });

  bookingList.appendChild(fragment);
  attachBookingTableEvents();
}

function attachBookingTableEvents() {
  const saveButtons = document.querySelectorAll(".save-status-btn");

  saveButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const docId = button.dataset.id;
      const select = document.querySelector(
        `.status-select[data-id="${CSS.escape(docId)}"]`,
      );

      if (!select) {
        return;
      }

      await changeStatus(docId, select.value);
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    if (button.hasAttribute("data-review-id")) {
      return;
    }

    button.addEventListener("click", async () => {
      const docId = button.dataset.id;
      await removeBooking(docId);
    });
  });
}

function getFilteredBookings() {
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedStatus = statusFilter ? statusFilter.value : "Все";

  return allBookings.filter((item) => {
    const name = String(item.guestName || "").toLowerCase();
    const phone = String(item.guestPhone || "").toLowerCase();
    const email = String(item.guestEmail || "").toLowerCase();
    const roomType = String(item.roomType || "").toLowerCase();
    const comment = String(item.guestComment || "").toLowerCase();
    const status = normalizeStatus(item.status);

    const matchesSearch =
      !searchValue ||
      name.includes(searchValue) ||
      phone.includes(searchValue) ||
      email.includes(searchValue) ||
      roomType.includes(searchValue) ||
      comment.includes(searchValue);

    const matchesStatus = selectedStatus === "Все" || status === selectedStatus;

    return matchesSearch && matchesStatus;
  });
}

function applyFilters() {
  renderBookings(getFilteredBookings());
}

function loadBookings() {
  if (unsubscribeBookings) {
    unsubscribeBookings();
    unsubscribeBookings = null;
  }

  const bookingsQuery = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc"),
  );

  unsubscribeBookings = onSnapshot(
    bookingsQuery,
    (snapshot) => {
      allBookings = [];

      snapshot.forEach((bookingDoc) => {
        const data = bookingDoc.data();

        allBookings.push({
          id: bookingDoc.id,
          guestName: data.guestName || "",
          guestPhone: data.guestPhone || "",
          guestEmail: data.guestEmail || "",
          roomType: data.roomType || "",
          guestCount: data.guestCount ?? "",
          checkIn: data.checkIn || "",
          checkOut: data.checkOut || "",
          guestComment: data.guestComment || "",
          status: normalizeStatus(data.status),
          createdAtFormatted: formatDateFromTimestamp(data.createdAt),
        });
      });

      updateStats(allBookings);
      applyFilters();
    },
    (error) => {
      console.error("Ошибка чтения данных:", error);

      if (bookingList) {
        bookingList.innerHTML = `
          <tr>
            <td colspan="11" class="empty-row">${t("load_error")}</td>
          </tr>
        `;
      }
    },
  );
}

/* =========================================================
   EXPORT
========================================================= */

function exportBookingsToCSV() {
  const filteredBookings = getFilteredBookings();

  if (!filteredBookings.length) {
    showMessage(t("export_empty"));
    return;
  }

  const headers = [
    t("th_name"),
    t("th_phone"),
    t("th_email"),
    t("th_room"),
    t("th_guests"),
    t("th_checkin"),
    t("th_checkout"),
    t("th_comment"),
    t("th_status"),
    t("th_created"),
  ];

  const rows = filteredBookings.map((item) => [
    item.guestName || "",
    item.guestPhone || "",
    item.guestEmail || "",
    item.roomType || "",
    item.guestCount || "",
    item.checkIn || "",
    item.checkOut || "",
    item.guestComment || "",
    getStatusLabel(item.status),
    item.createdAtFormatted || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"),
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "bookings_export.csv");
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

if (exportBtn) {
  exportBtn.addEventListener("click", exportBookingsToCSV);
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (statusFilter) {
  statusFilter.addEventListener("change", applyFilters);
}

/* =========================================================
   REVIEWS ADMIN
========================================================= */

function formatReviewDate(timestamp) {
  if (!timestamp) {
    return t("no_date");
  }

  try {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString("ru-RU");
    }

    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString("ru-RU");
    }

    return t("no_date");
  } catch {
    return t("no_date");
  }
}

function getReviewStatusHtml(item) {
  if (item.approved === true && item.hidden !== true) {
    return `<span class="review-status-badge review-approved">${t(
      "review_status_approved",
    )}</span>`;
  }

  if (item.hidden === true) {
    return `<span class="review-status-badge review-hidden">${t(
      "review_status_hidden",
    )}</span>`;
  }

  return `<span class="review-status-badge review-pending">${t(
    "review_status_pending",
  )}</span>`;
}

function renderReviewsAdmin(reviews) {
  if (!reviewsAdminList) {
    return;
  }

  if (!reviews.length) {
    reviewsAdminList.innerHTML = `
      <tr>
        <td colspan="6" class="empty-row">${t("reviews_not_found")}</td>
      </tr>
    `;
    return;
  }

  reviewsAdminList.innerHTML = reviews
    .map((item) => {
      return `
        <tr class="review-row">
          <td><strong>${escapeHtml(
            item.guestName || t("guest_word"),
          )}</strong></td>

          <td>${"★".repeat(Number(item.rating || 0))}</td>

          <td>${escapeHtml(item.text || t("no_data"))}</td>

          <td>${getReviewStatusHtml(item)}</td>

          <td>${formatReviewDate(item.createdAt)}</td>

          <td>
            <div class="review-action-group">
              <button
                class="approve-btn"
                data-approve-review="${escapeHtml(item.id)}"
                type="button"
              >
                ${t("review_approve_btn")}
              </button>

              <button
                class="hide-btn"
                data-hide-review="${escapeHtml(item.id)}"
                type="button"
              >
                ${t("review_hide_btn")}
              </button>

              <button
                class="delete-btn"
                data-review-id="${escapeHtml(item.id)}"
                type="button"
              >
                ${t("delete_btn")}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  bindReviewActions();
}

function bindReviewActions() {
  document.querySelectorAll("[data-approve-review]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reviewId = button.getAttribute("data-approve-review");

      try {
        await updateDoc(doc(db, "reviews", reviewId), {
          approved: true,
          hidden: false,
        });

        showMessage(t("review_approved_msg"));
      } catch (error) {
        console.error(error);
        showMessage(t("review_approve_error"));
      }
    });
  });

  document.querySelectorAll("[data-hide-review]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reviewId = button.getAttribute("data-hide-review");

      try {
        await updateDoc(doc(db, "reviews", reviewId), {
          approved: false,
          hidden: true,
        });

        showMessage(t("review_hidden_msg"));
      } catch (error) {
        console.error(error);
        showMessage(t("review_hide_error"));
      }
    });
  });

  document.querySelectorAll("[data-review-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reviewId = button.getAttribute("data-review-id");
      const confirmed = window.confirm(t("review_delete_confirm"));

      if (!confirmed) {
        return;
      }

      try {
        await deleteDoc(doc(db, "reviews", reviewId));
        showMessage(t("review_deleted_msg"));
      } catch (error) {
        console.error(error);
        showMessage(t("review_delete_error"));
      }
    });
  });
}

function loadReviewsAdmin() {
  if (!reviewsAdminList) {
    return;
  }

  if (unsubscribeReviews) {
    unsubscribeReviews();
    unsubscribeReviews = null;
  }

  const reviewsQuery = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc"),
  );

  unsubscribeReviews = onSnapshot(
    reviewsQuery,
    (snapshot) => {
      allReviews = [];

      snapshot.forEach((reviewDoc) => {
        allReviews.push({
          id: reviewDoc.id,
          ...reviewDoc.data(),
        });
      });

      renderReviewsAdmin(allReviews);
    },
    (error) => {
      console.error(error);

      reviewsAdminList.innerHTML = `
        <tr>
          <td colspan="6" class="empty-row">${t("reviews_load_error")}</td>
        </tr>
      `;
    },
  );
}

/* =========================================================
   LANGUAGE REBUILD
========================================================= */

function rebuildStatusFilterOptions() {
  if (!statusFilter) {
    return;
  }

  const current = statusFilter.value;

  statusFilter.innerHTML = `
    <option value="Все">${t("filter_all")}</option>
    <option value="Новая">${t("status_new")}</option>
    <option value="Подтверждена">${t("status_confirmed")}</option>
    <option value="Отменена">${t("status_cancelled")}</option>
    <option value="Завершена">${t("status_completed")}</option>
  `;

  const allowedValues = [
    "Все",
    "Новая",
    "Подтверждена",
    "Отменена",
    "Завершена",
  ];

  statusFilter.value = allowedValues.includes(current) ? current : "Все";
}

window.addEventListener("admin-language-changed", () => {
  if (loginError && loginError.textContent) {
    loginError.textContent = t("login_error");
  }

  rebuildStatusFilterOptions();
  updateStats(allBookings);
  applyFilters();
  renderReviewsAdmin(allReviews);
});

/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener("beforeunload", () => {
  if (unsubscribeBookings) {
    unsubscribeBookings();
    unsubscribeBookings = null;
  }

  if (unsubscribeReviews) {
    unsubscribeReviews();
    unsubscribeReviews = null;
  }
});

/* =========================================================
   INIT
========================================================= */

checkAdminAccess();
