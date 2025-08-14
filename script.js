
// Configuração fixa
const CLOUD_NAME = "ddid5uuj4";
const TAG_NAME = "galeria";

// URL da lista de imagens
const LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG_NAME}.json`;

async function carregarGaleriaPorTagList() {
    const container = document.querySelector("#galeria");
    container.innerHTML = "<p>Carregando imagens...</p>";

    try {
        const resp = await fetch(LIST_URL, { cache: "no-store" });
        if (!resp.ok) throw new Error("Erro ao buscar imagens");

        const data = await resp.json();
        container.innerHTML = "";

        if (!data.resources || data.resources.length === 0) {
            container.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
            return;
        }

        data.resources.forEach(item => {
            const img = document.createElement("img");
            img.src = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`;
            img.alt = item.public_id;
            img.loading = "lazy";
            container.appendChild(img);
        });
    } catch (err) {
        console.error("Erro ao carregar galeria:", err);
        container.innerHTML = "<p>Não foi possível carregar as imagens. Tente novamente mais tarde.</p>";
    }
}

// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", carregarGaleriaPorTagList);
