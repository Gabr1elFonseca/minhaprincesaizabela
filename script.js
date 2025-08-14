
// ==============================
// Configurações principais
// ==============================
const START_DATE = new Date('2024-10-10T00:00:00');
const YT_VIDEO_ID = 'hv2lCmRXvtY';

// Cloudinary (sem depender de /image/list)
const CLOUD_NAME = "ddid5uuj4";
const FOLDER_NAME = "galeria";
const IMAGES = Array.from({length: 19}, (_, i) => `amor${i+1}`);

// ==============================
// Música - YouTube Iframe API
// ==============================
(function(){
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.body.appendChild(tag);
})();

let player;
let isPlayerReady = false;

window.onYouTubeIframeAPIReady = function(){
  player = new YT.Player('player', {
    height: '180',
    width: '320',
    videoId: YT_VIDEO_ID,
    playerVars: {
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: function(){
        isPlayerReady = true;
      },
      onStateChange: function(e){
        const btn = document.getElementById('playPauseBtn');
        if(!btn) return;
        if(e.data === YT.PlayerState.PLAYING){
          btn.innerHTML = '&#10074;&#10074; Pausar';
        } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED){
          btn.innerHTML = '&#9658; Tocar';
        }
      }
    }
  });
};

document.addEventListener('click', function(e){
  const btn = e.target.closest('#playPauseBtn');
  if(!btn) return;
  if(!isPlayerReady || !player) return;
  const state = player.getPlayerState ? player.getPlayerState() : null;
  if(state === YT.PlayerState.PLAYING){
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

// ==============================
// Cronômetro (anos, meses, dias, horas, minutos)
// ==============================
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');

function daysInMonth(year, monthIndex){ // monthIndex 0-11
  return new Date(year, monthIndex + 1, 0).getDate();
}

function diff(from, to){
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  let h = to.getHours() - from.getHours();
  let min = to.getMinutes() - from.getMinutes();

  if(min < 0){ min += 60; h--; }
  if(h < 0){ h += 24; d--; }
  if(d < 0){
    const prevMonthIndex = (to.getMonth() - 1 + 12) % 12;
    const yearForPrevMonth = prevMonthIndex === 11 ? to.getFullYear() - 1 : to.getFullYear();
    d += daysInMonth(yearForPrevMonth, prevMonthIndex);
    m--;
  }
  if(m < 0){ m += 12; y--; }
  return { y, m, d, h, min };
}

function renderCounter(){
  const now = new Date();
  const t = diff(START_DATE, now);
  if(yearsEl) yearsEl.textContent = t.y;
  if(monthsEl) monthsEl.textContent = t.m;
  if(daysEl) daysEl.textContent = t.d;
  if(hoursEl) hoursEl.textContent = t.h;
  if(minutesEl) minutesEl.textContent = t.min;
}

// ==============================
// QR Code
// ==============================
function makeQR(){
  const el = document.getElementById('qrcode');
  if(!el || typeof QRCode === "undefined") return;
  new QRCode(el, {
    text: window.location.href,
    width: 128,
    height: 128,
    colorDark: '#0c2a4d',
    colorLight: '#ffffff'
  });
}

// ==============================
// Galeria (prefixo/pasta, sem API/JSON)
// ==============================
function carregarGaleria(){
  const container = document.getElementById('gallery');
  if(!container) return;
  container.innerHTML = "";
  IMAGES.forEach(id => {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    // Sem extensão: f_auto,q_auto deixa a Cloudinary servir o melhor formato (jpg/webp/avif)
    img.src = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${FOLDER_NAME}/${id}`;
    img.alt = id;
    container.appendChild(img);
  });
}

// ==============================
// Boot
// ==============================
document.addEventListener('DOMContentLoaded', function(){
  renderCounter();
  setInterval(renderCounter, 30000);
  makeQR();
  carregarGaleria();
});
