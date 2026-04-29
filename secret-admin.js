/* =========================================================
   ALTAY VILLAJ HOTEL — SECRET ADMIN ACCESS
   Скрытый вход в админ-панель
   1) Ctrl + Alt + A
   2) 7 быстрых кликов по тексту ALTAY VILLAJ HOTEL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initSecretKeyboardAccess();
  initSecretLogoAccess();
});

function openAdminPanel() {
  window.location.href = "admin.html";
}

/* =========================
   CTRL + ALT + A
========================= */

function initSecretKeyboardAccess() {
  document.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase();

    if (event.ctrlKey && event.altKey && key === "a") {
      event.preventDefault();
      openAdminPanel();
    }
  });
}

/* =========================
   7 CLICKS ON LOGO TEXT
========================= */

function initSecretLogoAccess() {
  const logo = document.querySelector(".logo");

  if (!logo) {
    console.warn("Secret admin: .logo not found");
    return;
  }

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener("click", (event) => {
    clickCount += 1;

    /*
      Важно:
      пока считаем клики, не даём ссылке сразу переходить на index.html
    */
    event.preventDefault();

    clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 1800);

    if (clickCount >= 7) {
      clickCount = 0;
      clearTimeout(clickTimer);
      openAdminPanel();
    }
  });
}
