
const CLOUD_NAME = "ddid5uuj4";
const FOLDER_NAME = "galeria";

// Lista de imagens (public IDs com extensão)
const IMAGES = [
  "amor1.jpg", "amor2.jpg", "amor3.jpg", "amor4.jpg", "amor5.jpg",
  "amor6.jpg", "amor7.jpg", "amor8.jpg", "amor9.jpg", "amor10.jpg",
  "amor11.jpg", "amor12.jpg", "amor13.jpg", "amor14.jpg", "amor15.jpg",
  "amor16.jpg", "amor17.jpg", "amor18.jpg", "amor19.jpg"
];

function carregarGaleria() {
  const container = document.querySelector("#galeria");
  container.innerHTML = "";

  IMAGES.forEach(nome => {
    const img = document.createElement("img");
    img.src = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER_NAME}/${nome}`;
    img.alt = nome;
    img.loading = "lazy";
    container.appendChild(img);
  });
}

document.addEventListener("DOMContentLoaded", carregarGaleria);
