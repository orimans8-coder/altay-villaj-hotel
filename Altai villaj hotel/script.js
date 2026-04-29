import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const STORAGE_KEY = "hotelReservations";

/* =========================
   DOM ELEMENTS
========================= */

const reservationForm = document.getElementById("reservationForm");
const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

const guestNameInput = document.getElementById("guestName");
const guestPhoneInput = document.getElementById("guestPhone");
const guestEmailInput = document.getElementById("guestEmail");
const roomTypeInput = document.getElementById("roomType");
const guestCountInput = document.getElementById("guestCount");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const guestCommentInput = document.getElementById("guestComment");

const reviewForm = document.getElementById("reviewForm");
const reviewNameInput = document.getElementById("reviewName");
const reviewRatingInput = document.getElementById("reviewRating");
const reviewTextInput = document.getElementById("reviewText");
const reviewSubmitBtn = document.getElementById("reviewSubmitBtn");
const reviewsList = document.getElementById("reviewsList");

/* =========================
   UI HELPERS
========================= */

function showToast(message, type = "success") {
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}

function setSubmitting(button, isSubmitting, text = "Отправка...") {
  if (!button) return;

  button.disabled = isSubmitting;

  if (isSubmitting) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent.trim();
    }

    button.textContent = text;
    button.style.opacity = "0.8";
    button.style.cursor = "not-allowed";
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.style.opacity = "";
    button.style.cursor = "";
  }
}

/* =========================
   TRANSLATION HELPER
========================= */

function getCurrentLang() {
  return localStorage.getItem("siteLanguage") || "ru";
}

function getTranslation(key) {
  const lang = getCurrentLang();
  const dictionary = window.translations || globalThis.translations;

  if (dictionary?.[lang]?.[key]) {
    return dictionary[lang][key];
  }

  if (dictionary?.ru?.[key]) {
    return dictionary.ru[key];
  }

  return key;
}

/* =========================
   UTILS
========================= */

function sanitizeText(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 9;
}

function addDays(dateString, days) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return [];
  }
}

function saveStoredBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error("LocalStorage save error:", error);
  }
}

/* =========================
   BOOKING
========================= */

function buildBookingObject() {
  return {
    id: `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    guestName: sanitizeText(guestNameInput?.value),
    guestPhone: sanitizeText(guestPhoneInput?.value),
    guestEmail: sanitizeText(guestEmailInput?.value),
    roomType: sanitizeText(roomTypeInput?.value),
    guestCount: sanitizeText(guestCountInput?.value),
    checkIn: sanitizeText(checkinInput?.value),
    checkOut: sanitizeText(checkoutInput?.value),
    guestComment: sanitizeText(guestCommentInput?.value),
    status: "Новая",
    createdAt: new Date().toISOString(),
  };
}

function validateBooking(booking) {
  if (
    !booking.guestName ||
    !booking.guestPhone ||
    !booking.guestEmail ||
    !booking.roomType ||
    !booking.guestCount ||
    !booking.checkIn ||
    !booking.checkOut
  ) {
    showToast("Заполните все обязательные поля", "error");
    return false;
  }

  if (!isValidEmail(booking.guestEmail)) {
    showToast("Введите корректный email", "error");
    return false;
  }

  if (!isValidPhone(booking.guestPhone)) {
    showToast("Введите корректный телефон", "error");
    return false;
  }

  if (Number(booking.guestCount) < 1) {
    showToast("Количество гостей должно быть не меньше 1", "error");
    return false;
  }

  if (booking.checkOut <= booking.checkIn) {
    showToast("Дата выезда должна быть позже даты заезда", "error");
    return false;
  }

  return true;
}

async function handleReservationSubmit(event) {
  event.preventDefault();

  const booking = buildBookingObject();

  if (!validateBooking(booking)) {
    return;
  }

  try {
    setSubmitting(submitBtn, true, "Отправка...");

    const docRef = await addDoc(collection(db, "bookings"), {
      ...booking,
      createdAt: serverTimestamp(),
    });

    const existingBookings = getStoredBookings();

    existingBookings.push({
      ...booking,
      firestoreId: docRef.id,
    });

    saveStoredBookings(existingBookings);

    reservationForm.reset();
    setMinDates();

    showToast("Заявка успешно отправлена");
  } catch (error) {
    console.error("Booking error:", error);

    const existingBookings = getStoredBookings();

    existingBookings.push({
      ...booking,
      firebaseError: true,
    });

    saveStoredBookings(existingBookings);

    showToast("Интернет/Firebase ошибка. Заявка сохранена локально", "error");
  } finally {
    setSubmitting(submitBtn, false);
  }
}

function setMinDates() {
  const today = new Date().toISOString().split("T")[0];

  if (checkinInput) {
    checkinInput.min = today;
  }

  if (checkoutInput) {
    checkoutInput.min = today;
  }
}

function bindDateLogic() {
  if (!checkinInput || !checkoutInput) {
    return;
  }

  checkinInput.addEventListener("change", () => {
    if (!checkinInput.value) {
      checkoutInput.min = new Date().toISOString().split("T")[0];
      return;
    }

    const nextDay = addDays(checkinInput.value, 1);
    checkoutInput.min = nextDay || checkinInput.value;

    if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
      checkoutInput.value = "";
    }
  });
}

function initRoomFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");

  if (room && roomTypeInput) {
    roomTypeInput.value = room;
  }
}

function initRoomButtons() {
  const roomButtons = document.querySelectorAll(".room-book-btn");

  roomButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const room = button.dataset.room;

      if (!roomTypeInput || !room) {
        return;
      }

      roomTypeInput.value = room;

      const bookingSection = document.getElementById("booking");

      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function initReservationForm() {
  if (!reservationForm) {
    return;
  }

  setMinDates();
  bindDateLogic();
  initRoomFromQuery();

  reservationForm.addEventListener("submit", handleReservationSubmit);
}

/* =========================
   REVIEWS
========================= */

async function handleReviewSubmit(event) {
  event.preventDefault();

  const review = {
    guestName: sanitizeText(reviewNameInput?.value),
    rating: Number(reviewRatingInput?.value),
    text: sanitizeText(reviewTextInput?.value),
    approved: false,
    hidden: false,
    createdAt: serverTimestamp(),
  };

  if (!review.guestName || !review.rating || !review.text) {
    showToast("Заполните форму отзыва полностью", "error");
    return;
  }

  if (review.rating < 1 || review.rating > 5) {
    showToast("Выберите оценку от 1 до 5", "error");
    return;
  }

  try {
    setSubmitting(reviewSubmitBtn, true, "Отправка...");

    await addDoc(collection(db, "reviews"), review);

    reviewForm.reset();
    showToast("Отзыв отправлен и ждёт модерации");
  } catch (error) {
    console.error("Review error:", error);
    showToast("Не удалось отправить отзыв", "error");
  } finally {
    setSubmitting(reviewSubmitBtn, false);
  }
}

function renderReviews(reviews) {
  if (!reviewsList) {
    return;
  }

  if (!reviews.length) {
    reviewsList.innerHTML = `
      <div class="review-card review-empty-card">
        <p>${escapeHtml(getTranslation("reviews_empty_text"))}</p>
        <h4>Altay Villaj Hotel</h4>
      </div>
    `;
    return;
  }

  reviewsList.innerHTML = reviews
    .map((review) => {
      const rating = Number(review.rating || 0);
      const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
      const stars = "★".repeat(safeRating) + "☆".repeat(5 - safeRating);

      return `
        <div class="review-card">
          <div class="review-stars" aria-label="Оценка ${safeRating} из 5">${stars}</div>
          <p>${escapeHtml(review.text || "")}</p>
          <h4>${escapeHtml(review.guestName || "Гость")}</h4>
        </div>
      `;
    })
    .join("");
}

function loadApprovedReviews() {
  if (!reviewsList) {
    return;
  }

  onSnapshot(
    collection(db, "reviews"),
    (snapshot) => {
      const reviews = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (data.approved === true && data.hidden !== true) {
          reviews.push({
            id: docSnap.id,
            ...data,
          });
        }
      });

      reviews.sort((a, b) => {
        const aSec = a.createdAt?.seconds || 0;
        const bSec = b.createdAt?.seconds || 0;
        return bSec - aSec;
      });

      renderReviews(reviews);
    },
    (error) => {
      console.error("Load reviews error:", error);
      renderReviews([]);
    },
  );
}

function initReviewForm() {
  if (!reviewForm) {
    return;
  }

  reviewForm.addEventListener("submit", handleReviewSubmit);
}

/* =========================
   MOBILE MENU
========================= */

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    mainNav.classList.toggle("active");

    const isOpen = mainNav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  const navLinks = mainNav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================
   HEADER SCROLL
========================= */

function initHeaderScroll() {
  const header = document.getElementById("siteHeader");

  if (!header) {
    return;
  }

  const toggleScrolled = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  toggleScrolled();
  window.addEventListener("scroll", toggleScrolled, { passive: true });
}

/* =========================
   FAQ
========================= */

function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");

    if (!btn) {
      return;
    }

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => faq.classList.remove("active"));

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

/* =========================
   GALLERY LIGHTBOX
========================= */

function closeLightbox() {
  const lightbox = document.querySelector(".image-lightbox");

  if (lightbox) {
    lightbox.classList.remove("active");

    setTimeout(() => {
      lightbox.remove();
    }, 180);
  }

  document.body.style.overflow = "";
}

function openLightbox(imageUrl, imageAlt = "Gallery image") {
  if (!imageUrl) {
    return;
  }

  closeLightbox();

  const overlay = document.createElement("div");
  overlay.className = "image-lightbox";

  overlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" type="button" aria-label="Закрыть">×</button>
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageAlt)}" />
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    overlay.classList.add("active");
  }, 10);

  overlay.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("image-lightbox") ||
      event.target.classList.contains("lightbox-close")
    ) {
      closeLightbox();
    }
  });
}

function initGalleryClick() {
  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest(".gallery-view-btn");

    if (viewButton) {
      event.preventDefault();
      event.stopPropagation();

      const galleryItem = viewButton.closest(".gallery-item");

      if (!galleryItem) {
        return;
      }

      const img = galleryItem.querySelector("img");

      if (!img) {
        return;
      }

      const imageUrl = img.getAttribute("src");
      const imageAlt = img.getAttribute("alt") || "Фото галереи";

      openLightbox(imageUrl, imageAlt);
      return;
    }

    const galleryItem = event.target.closest(".gallery-item");

    if (!galleryItem) {
      return;
    }

    if (event.target.closest("button, a")) {
      return;
    }

    const img = galleryItem.querySelector("img");

    if (!img) {
      return;
    }

    const imageUrl = img.getAttribute("src");
    const imageAlt = img.getAttribute("alt") || "Фото галереи";

    openLightbox(imageUrl, imageAlt);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

/* =========================
   ACTIVE NAV LINK
========================= */

function initActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;
  const navLinks = document.querySelectorAll("#mainNav a");

  navLinks.forEach((link) => {
    link.classList.remove("active-page");

    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    const url = new URL(href, window.location.href);
    const linkPage = url.pathname.split("/").pop() || "index.html";
    const linkHash = url.hash;

    const isSamePage = linkPage === currentPage;

    if (!isSamePage) {
      return;
    }

    if (currentHash) {
      if (linkHash === currentHash) {
        link.classList.add("active-page");
      }
      return;
    }

    if (!linkHash) {
      link.classList.add("active-page");
    }
  });
}

/* =========================
   INSTAGRAM VIDEO
========================= */

function initInstagramVideo() {
  const playBtn = document.getElementById("playVideoBtn");
  const instaVideo = document.getElementById("instaVideo");
  const videoOverlay =
    document.getElementById("videoOverlay") ||
    document.querySelector(".video-overlay");

  if (!playBtn || !instaVideo) {
    return;
  }

  playBtn.addEventListener("click", () => {
    const videoSrc = instaVideo.dataset.src;

    if (videoSrc && !instaVideo.src) {
      instaVideo.src = videoSrc;
    }

    if (videoOverlay) {
      videoOverlay.style.display = "none";
    }
  });
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  initFaq();
  initGalleryClick();
  initActiveNavLink();
  initRoomButtons();

  initReservationForm();
  initReviewForm();
  loadApprovedReviews();
  initInstagramVideo();
});
