const START_DATE = new Date('2024-10-10T00:00:00');
const YT_VIDEO_ID = 'hv2lCmRXvtY';

// Carregar API do YouTube
(function(){
    const tag=document.createElement('script');
    tag.src='https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
})();

let player;
window.onYouTubeIframeAPIReady = function(){
    player = new YT.Player('player', {
        height:'180',
        width:'320',
        videoId:YT_VIDEO_ID,
        playerVars:{rel:0,modestbranding:1}
    });
};

// Botão Play/Pause
document.getElementById('playPauseBtn').addEventListener('click',()=>{
    if(!player) return;
    const s = player.getPlayerState();
    if(s === 1){
        player.pauseVideo();
        playPauseBtn.innerHTML='&#9658; Tocar';
    } else {
        player.playVideo();
        playPauseBtn.innerHTML='&#10073;&#10073; Pausar';
    }
});

// Contador de tempo
function diff(from,to){
    let y=to.getFullYear()-from.getFullYear(),
        m=to.getMonth()-from.getMonth(),
        d=to.getDate()-from.getDate(),
        h=to.getHours()-from.getHours(),
        min=to.getMinutes()-from.getMinutes();
    if(min<0){min+=60;h--;}
    if(h<0){h+=24;d--;}
    if(d<0){m--;d+=new Date(to.getFullYear(),to.getMonth(),0).getDate();}
    if(m<0){m+=12;y--;}
    return {y,m,d,h,min};
}

function render(){
    const now = new Date();
    const t = diff(START_DATE, now);
    years.textContent = t.y;
    months.textContent = t.m;
    days.textContent = t.d;
    hours.textContent = t.h;
    minutes.textContent = t.min;
}
render();
setInterval(render, 30000);

// QRCode
function makeQR(){
    new QRCode(document.getElementById('qrcode'), {
        text:window.location.href,
        width:128,
        height:128,
        colorDark:'#0c2a4d',
        colorLight:'#ffffff'
    });
}
window.onload = makeQR;

// -----------------------------
// GALERIA COM CLOUDINARY - LISTA POR TAG (PÚBLICA)
// -----------------------------
const gallery = document.getElementById('gallery');
const CLOUD_NAME = 'ddid5uuj4';
const TAG_NAME = 'galeria';
const LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG_NAME}.json`;

async function carregarGaleriaPorTagList(){
    try {
        const resp = await fetch(LIST_URL, { cache: 'no-store' });
        if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        gallery.innerHTML = "";

        if(!data.resources || data.resources.length === 0){
            gallery.innerHTML = `<p>Nenhuma imagem com a tag "${TAG_NAME}" foi encontrada.</p>`;
            return;
        }

        // opcional: ordenar mais recentes primeiro
        data.resources.sort((a,b) => (b.version||0) - (a.version||0));

        data.resources.forEach(item => {
            const src = item.secure_url || `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`;
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.decoding = 'async';
            img.src = src;
            img.alt = item.public_id.split('/').pop();
            gallery.appendChild(img);
        });

    } catch (e) {
        console.error("Erro ao carregar galeria:", e);
        gallery.innerHTML = `<p>Não foi possível carregar a galeria. Verifique no Cloudinary se a opção "Resource list" NÃO está marcada em Security e se as imagens têm a tag "${TAG_NAME}".</p>`;
    }
}

carregarGaleriaPorTagList();

// -----------------------------
// LIGHTBOX SIMPLES
// -----------------------------
document.addEventListener("click", function(e){
    if(e.target.closest("#gallery img")){
        const src = e.target.src;
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = lightbox.querySelector("img");
        lightboxImg.src = src;
        lightbox.classList.add("show");
    }
    if(e.target.id === "lightbox" || e.target.closest("#lightbox") && e.target.tagName !== "IMG"){
        document.getElementById("lightbox").classList.remove("show");
    }
});
document.addEventListener("keyup", function(e){
    if(e.key === "Escape"){
        document.getElementById("lightbox").classList.remove("show");
    }
});
