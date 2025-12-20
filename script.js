// Configuração Tailwind personalizada
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

let isPanelOpen = false;

function updateColors() {
  const bgColor1 = document.getElementById("bgColor1").value;
  const bgColor2 = document.getElementById("bgColor2").value;
  const textColor = document.getElementById("textColor").value;
  const buttonColor = document.getElementById("buttonColor").value;

  document.getElementById("home").style.background = `linear-gradient(90deg, ${bgColor1}, ${bgColor2})`;
  document.body.style.color = textColor;

  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.backgroundColor = buttonColor;
    button.onmouseover = () => (button.style.backgroundColor = shadeColor(buttonColor, -10));
    button.onmouseout = () => (button.style.backgroundColor = buttonColor);
  });
}

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
  return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
}

function resetColors() {
  document.getElementById("bgColor1").value = "#1d4ed8";
  document.getElementById("bgColor2").value = "#00040a";
  document.getElementById("textColor").value = "#000000";
  document.getElementById("buttonColor").value = "#10B981";
  updateColors();
}

function toggleColorPanel() {
  const panel = document.getElementById("colorPanel");
  isPanelOpen = !isPanelOpen;
  panel.style.display = isPanelOpen ? "block" : "none";
}

window.onload = () => updateColors();

// ===== LIGHTBOX PARA TODAS AS IMAGENS =====
// ===== LIGHTBOX PARA TODAS AS IMAGENS =====
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
    document.body.style.overflow = "auto";
  });
});
// ===== FIM LIGHTBOX =====
