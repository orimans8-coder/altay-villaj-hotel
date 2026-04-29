/* =========================================================
   ALTAY VILLAJ HOTEL — FLOAT ACTIONS
   WhatsApp button + Scroll to top button
   Phone: +996 501 595 598
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  createFloatActions();
  initScrollTopButton();
});

function createFloatActions() {
  const oldFloatActions = document.querySelector(".float-actions");

  if (oldFloatActions) {
    oldFloatActions.remove();
  }

  const floatActions = document.createElement("div");
  floatActions.className = "float-actions";

  floatActions.innerHTML = `
    <a
      href="https://wa.me/996501595598"
      target="_blank"
      class="float-whatsapp"
      aria-label="WhatsApp"
      title="Написать в WhatsApp"
    >
      <i class="fa-brands fa-whatsapp"></i>
    </a>

    <button
      class="float-top"
      id="floatTopBtn"
      type="button"
      aria-label="Наверх"
      title="Наверх"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  `;

  document.body.appendChild(floatActions);
  addFloatActionsStyles();
}

function initScrollTopButton() {
  const floatTopBtn = document.getElementById("floatTopBtn");

  if (!floatTopBtn) {
    return;
  }

  const toggleFloatTopButton = () => {
    if (window.scrollY > 450) {
      floatTopBtn.classList.add("show");
    } else {
      floatTopBtn.classList.remove("show");
    }
  };

  toggleFloatTopButton();

  window.addEventListener("scroll", toggleFloatTopButton);

  floatTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function addFloatActionsStyles() {
  const oldStyle = document.getElementById("floatActionsStyle");

  if (oldStyle) {
    oldStyle.remove();
  }

  const style = document.createElement("style");
  style.id = "floatActionsStyle";

  style.textContent = `
    /* =========================
       FLOAT ACTIONS
    ========================= */

    .float-actions {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .float-whatsapp,
    .float-top {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.24);
      transition: 0.25s ease;
    }

    .float-whatsapp {
      background: #25d366;
      color: #ffffff;
    }

    .float-whatsapp:hover {
      background: #1fb95a;
      color: #ffffff;
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 18px 42px rgba(37, 211, 102, 0.35);
    }

    .float-top {
      background: #ffffff;
      color: #4d3827;
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px);
    }

    .float-top.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .float-top:hover {
      background: #f1c46b;
      color: #111111;
      transform: translateY(-4px);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);
    }

    @media (max-width: 768px) {
      .float-actions {
        right: 16px;
        bottom: 16px;
      }

      .float-whatsapp,
      .float-top {
        width: 50px;
        height: 50px;
        font-size: 21px;
      }
    }

    @media (max-width: 480px) {
      .float-actions {
        right: 14px;
        bottom: 14px;
        gap: 10px;
      }

      .float-whatsapp,
      .float-top {
        width: 48px;
        height: 48px;
        font-size: 20px;
      }
    }
  `;

  document.head.appendChild(style);
}
