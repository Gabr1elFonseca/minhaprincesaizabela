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
// GALERIA COM CLOUDINARY via JSONP
// -----------------------------
const gallery = document.getElementById('gallery');
const CLOUD_NAME = 'ddid5uuj4';
const TAG_NAME = 'galeria';

// Função chamada pelo JSONP
function mostrarGaleria(data){
    gallery.innerHTML = "";
    if(!data.resources || data.resources.length === 0){
        gallery.innerHTML = `<p>Nenhuma imagem encontrada.</p>`;
        return;
    }

    // Ordena mais recentes primeiro
    data.resources.sort((a,b) => (b.version || 0) - (a.version || 0));

    data.resources.forEach(item => {
        const src = item.secure_url || `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`;
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = src;
        img.alt = item.public_id.split('/').pop();
        gallery.appendChild(img);
    });
}

// Carregar o JSONP
(function(){
    const script = document.createElement('script');
    script.src = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG_NAME}.json?callback=mostrarGaleria`;
    document.body.appendChild(script);
})();
