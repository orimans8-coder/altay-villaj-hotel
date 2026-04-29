/* =========================
   ALTAY VILLAJ HOTEL
   PREMIUM GALLERY LIGHTBOX IMAGE + VIDEO
========================= */

document.addEventListener(
  "click",
  function (event) {
    const galleryItem = event.target.closest(".gallery-item");

    if (!galleryItem) {
      return;
    }

    const img = galleryItem.querySelector("img");
    const video = galleryItem.querySelector("video");

    if (!img && !video) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (video) {
      const videoUrl = video.getAttribute("src");
      const videoTitle =
        galleryItem.querySelector(".gallery-photo-label")?.textContent ||
        "Видео";

      if (!videoUrl) {
        return;
      }

      openGalleryVideoLightbox(videoUrl, videoTitle);
      return;
    }

    if (img) {
      const imageUrl = img.getAttribute("src");
      const imageAlt = img.getAttribute("alt") || "Фото галереи";

      if (!imageUrl) {
        return;
      }

      openGalleryImageLightbox(imageUrl, imageAlt);
    }
  },
  true,
);

function escapeGalleryHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openGalleryImageLightbox(imageUrl, imageAlt) {
  closeGalleryLightbox();

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox-fixed";

  lightbox.innerHTML = `
    <div class="gallery-lightbox-box">
      <button class="gallery-lightbox-close" type="button" aria-label="Закрыть">×</button>
      <img src="${escapeGalleryHtml(imageUrl)}" alt="${escapeGalleryHtml(imageAlt)}" />
    </div>
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";

  bindGalleryLightboxClose(lightbox);
}

function openGalleryVideoLightbox(videoUrl, videoTitle) {
  closeGalleryLightbox();

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox-fixed gallery-video-lightbox";

  lightbox.innerHTML = `
    <div class="gallery-lightbox-box gallery-video-lightbox-box">
      <button class="gallery-lightbox-close" type="button" aria-label="Закрыть">×</button>

      <video
        src="${escapeGalleryHtml(videoUrl)}"
        controls
        autoplay
        playsinline
      ></video>

      <p class="gallery-video-title">${escapeGalleryHtml(videoTitle)}</p>
    </div>
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";

  bindGalleryLightboxClose(lightbox);
}

function bindGalleryLightboxClose(lightbox) {
  const closeBtn = lightbox.querySelector(".gallery-lightbox-close");

  closeBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    closeGalleryLightbox();
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeGalleryLightbox();
    }
  });
}

function closeGalleryLightbox() {
  const lightbox = document.querySelector(".gallery-lightbox-fixed");

  if (lightbox) {
    const video = lightbox.querySelector("video");

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    lightbox.remove();
  }

  document.body.style.overflow = "";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeGalleryLightbox();
  }
});
