// Tailwind configuration
if (window.tailwind && window.tailwind.config) {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: "#092f7aff",
          secondary: "#091c3bff",
          accent: "#10b924ff",
        },
        backgroundImage: {
          "hero-gradient": "linear-gradient(90deg, #1D4ED0, #00040a)",
        },
      },
    },
  };
}

let isPanelOpen = false;

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  return `#${R.toString(16).padStart(2, "0")}${G
    .toString(16)
    .padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
}

function updateColors() {
  const bgColor1El = document.getElementById("bgColor1");
  const bgColor2El = document.getElementById("bgColor2");
  const textColorEl = document.getElementById("textColor");
  const buttonColorEl = document.getElementById("buttonColor");
  const home = document.getElementById("home");

  // Exit silently if color-panel inputs are not present on this page.
  if (!bgColor1El || !bgColor2El || !textColorEl || !buttonColorEl || !home) {
    return;
  }

  const bgColor1 = bgColor1El.value;
  const bgColor2 = bgColor2El.value;
  const textColor = textColorEl.value;
  const buttonColor = buttonColorEl.value;

  home.style.background = `linear-gradient(90deg, ${bgColor1}, ${bgColor2})`;
  document.body.style.color = textColor;

  document.querySelectorAll("button").forEach((button) => {
    button.style.backgroundColor = buttonColor;
    button.onmouseover = () => {
      button.style.backgroundColor = shadeColor(buttonColor, -10);
    };
    button.onmouseout = () => {
      button.style.backgroundColor = buttonColor;
    };
  });
}

function resetColors() {
  const bgColor1El = document.getElementById("bgColor1");
  const bgColor2El = document.getElementById("bgColor2");
  const textColorEl = document.getElementById("textColor");
  const buttonColorEl = document.getElementById("buttonColor");

  if (!bgColor1El || !bgColor2El || !textColorEl || !buttonColorEl) {
    return;
  }

  bgColor1El.value = "#1d4ed8";
  bgColor2El.value = "#00040a";
  textColorEl.value = "#000000";
  buttonColorEl.value = "#10B981";
  updateColors();
}

function toggleColorPanel() {
  const panel = document.getElementById("colorPanel");
  if (!panel) {
    return;
  }

  isPanelOpen = !isPanelOpen;
  panel.style.display = isPanelOpen ? "block" : "none";
}

window.addEventListener("load", updateColors);

// Lightbox with desktop/mobile support.
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImg) {
    return;
  }

  const openLightbox = (img) => {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "Imagem ampliada";
    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("img:not(.no-lightbox)").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lightboxClose) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.style.display === "flex") {
      closeLightbox();
    }
  });
});
