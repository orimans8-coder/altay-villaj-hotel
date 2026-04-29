/* =========================================================
   ALTAY VILLAJ HOTEL — ROOMS LIGHTBOX
   Увеличение фото номеров на странице rooms.html
   + перевод текста "Нажмите для просмотра"
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initRoomsLightbox();
});

function initRoomsLightbox() {
  const roomImages = document.querySelectorAll(".room-image-wrap img");

  if (!roomImages.length) {
    return;
  }

  setRoomsViewHintText();
  addRoomsLightboxStyles();

  roomImages.forEach((img) => {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
      const imageUrl = img.getAttribute("src");
      const imageAlt = img.getAttribute("alt") || getRoomsDefaultAlt();

      if (!imageUrl) {
        return;
      }

      openRoomsLightbox(imageUrl, imageAlt);
    });
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => {
        setRoomsViewHintText();
      }, 50);
    });
  });
}

function getCurrentRoomsLang() {
  return (
    localStorage.getItem("siteLang") ||
    localStorage.getItem("lang") ||
    document.documentElement.lang ||
    "ru"
  );
}

function getRoomsViewHintText() {
  const lang = getCurrentRoomsLang();

  const fallbackTexts = {
    ru: "Нажмите для просмотра",
    ky: "Көрүү үчүн басыңыз",
    en: "Click to view",
    tr: "Görmek için tıklayın",
  };

  return (
    window.translations?.[lang]?.room_view_hint ||
    fallbackTexts[lang] ||
    fallbackTexts.ru
  );
}

function getRoomsDefaultAlt() {
  const lang = getCurrentRoomsLang();

  const fallbackAlts = {
    ru: "Фото номера",
    ky: "Бөлмөнүн сүрөтү",
    en: "Room photo",
    tr: "Oda fotoğrafı",
  };

  return fallbackAlts[lang] || fallbackAlts.ru;
}

function setRoomsViewHintText() {
  const hintText = getRoomsViewHintText();

  document.querySelectorAll(".room-image-wrap").forEach((wrap) => {
    wrap.setAttribute("data-text", hintText);
  });
}

function openRoomsLightbox(imageUrl, imageAlt) {
  closeRoomsLightbox();

  const lightbox = document.createElement("div");
  lightbox.className = "rooms-lightbox";

  lightbox.innerHTML = `
    <div class="rooms-lightbox-box">
      <button class="rooms-lightbox-close" type="button" aria-label="Закрыть">
        ×
      </button>

      <img src="${escapeRoomsHtml(imageUrl)}" alt="${escapeRoomsHtml(imageAlt)}" />

      <div class="rooms-lightbox-caption">
        ${escapeRoomsHtml(imageAlt)}
      </div>
    </div>
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    lightbox.classList.add("active");
  }, 10);

  const closeBtn = lightbox.querySelector(".rooms-lightbox-close");

  closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    closeRoomsLightbox();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeRoomsLightbox();
    }
  });
}

function closeRoomsLightbox() {
  const lightbox = document.querySelector(".rooms-lightbox");

  if (lightbox) {
    lightbox.classList.remove("active");

    setTimeout(() => {
      lightbox.remove();
    }, 180);
  }

  document.body.style.overflow = "";
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRoomsLightbox();
  }
});

function escapeRoomsHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addRoomsLightboxStyles() {
  const oldStyle = document.getElementById("roomsLightboxStyle");

  if (oldStyle) {
    oldStyle.remove();
  }

  const style = document.createElement("style");
  style.id = "roomsLightboxStyle";

  style.textContent = `
    /* =========================
       ROOMS LIGHTBOX
    ========================= */

    .room-image-wrap {
      position: relative;
    }

    .room-image-wrap::after {
      content: attr(data-text);
      position: absolute;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%) translateY(12px);
      opacity: 0;
      background: rgba(255, 255, 255, 0.94);
      color: #4d3827;
      padding: 10px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      pointer-events: none;
      transition: 0.25s ease;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
      z-index: 3;
    }

    .room-image-wrap:hover::after {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .rooms-lightbox {
      position: fixed;
      inset: 0;
      z-index: 999999999;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      opacity: 0;
      visibility: hidden;
      transition: 0.25s ease;
    }

    .rooms-lightbox.active {
      opacity: 1;
      visibility: visible;
    }

    .rooms-lightbox-box {
      position: relative;
      width: 100%;
      max-width: 1120px;
      transform: scale(0.94);
      transition: 0.25s ease;
    }

    .rooms-lightbox.active .rooms-lightbox-box {
      transform: scale(1);
    }

    .rooms-lightbox-box img {
      width: 100%;
      max-height: 82vh;
      object-fit: contain;
      display: block;
      border-radius: 22px;
      background: #111111;
      box-shadow: 0 30px 100px rgba(0, 0, 0, 0.65);
    }

    .rooms-lightbox-close {
      position: absolute;
      top: -18px;
      right: -18px;
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      background: #ffffff;
      color: #111111;
      font-size: 34px;
      line-height: 1;
      cursor: pointer;
      z-index: 10;
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.45);
      transition: 0.25s ease;
    }

    .rooms-lightbox-close:hover {
      background: #f1c46b;
      transform: scale(1.08);
    }

    .rooms-lightbox-caption {
      margin-top: 14px;
      text-align: center;
      color: #ffffff;
      font-size: 16px;
      font-weight: 800;
    }

    @media (max-width: 768px) {
      .room-image-wrap::after {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        bottom: 12px;
        font-size: 12px;
        padding: 9px 14px;
      }

      .rooms-lightbox {
        padding: 14px;
      }

      .rooms-lightbox-box img {
        max-height: 76vh;
        border-radius: 15px;
      }

      .rooms-lightbox-close {
        top: -12px;
        right: -6px;
        width: 42px;
        height: 42px;
        font-size: 28px;
      }

      .rooms-lightbox-caption {
        font-size: 14px;
      }
    }
  `;

  document.head.appendChild(style);
}
