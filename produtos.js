function abrirImagem(img) {
  document.getElementById("modalImagem").style.display = "block";
  document.getElementById("imagemExpandida").src = img.src;
}

function fecharImagem() {
  document.getElementById("modalImagem").style.display = "none";
}
