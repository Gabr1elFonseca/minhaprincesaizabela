const START_DATE = new Date('2024-10-10T00:00:00');
const YT_VIDEO_ID = 'hv2lCmRXvtY';
(function(){const tag=document.createElement('script');tag.src='https://www.youtube.com/iframe_api';document.body.appendChild(tag);})();
let player;window.onYouTubeIframeAPIReady=function(){player=new YT.Player('player',{height:'180',width:'320',videoId:YT_VIDEO_ID,playerVars:{rel:0,modestbranding:1}});};
document.getElementById('playPauseBtn').addEventListener('click',()=>{if(!player)return;const s=player.getPlayerState();if(s===1){player.pauseVideo();playPauseBtn.innerHTML='&#9658; Tocar';}else{player.playVideo();playPauseBtn.innerHTML='&#10073;&#10073; Pausar';}});
function diff(from,to){let y=to.getFullYear()-from.getFullYear(),m=to.getMonth()-from.getMonth(),d=to.getDate()-from.getDate(),h=to.getHours()-from.getHours(),min=to.getMinutes()-from.getMinutes();if(min<0){min+=60;h--;}if(h<0){h+=24;d--;}if(d<0){m--;d+=new Date(to.getFullYear(),to.getMonth(),0).getDate();}if(m<0){m+=12;y--;}return{y,m,d,h,min};}
function render(){const now=new Date();const t=diff(START_DATE,now);years.textContent=t.y;months.textContent=t.m;days.textContent=t.d;hours.textContent=t.h;minutes.textContent=t.min;}render();setInterval(render,3e4);
function makeQR(){new QRCode(document.getElementById('qrcode'),{text:window.location.href,width:128,height:128,colorDark:'#0c2a4d',colorLight:'#ffffff'});}window.onload=makeQR;
const fileInput=document.getElementById('fileInput'),gallery=document.getElementById('gallery'),clearBtn=document.getElementById('clearGallery'),LS_KEY='galeria_namoro_v1';
function save(){localStorage.setItem(LS_KEY,JSON.stringify([...gallery.querySelectorAll('img')].map(i=>i.src)));}
function load(){const d=localStorage.getItem(LS_KEY);if(!d)return;JSON.parse(d).forEach(src=>add(src));}
function add(src){const img=document.createElement('img');img.src=src;gallery.appendChild(img);}
fileInput.addEventListener('change',e=>{[...e.target.files].forEach(f=>{if(f.type.startsWith('image/')){const r=new FileReader();r.onload=()=>{add(r.result);save();};r.readAsDataURL(f);}});fileInput.value='';});
clearBtn.addEventListener('click',()=>{gallery.innerHTML='';localStorage.removeItem(LS_KEY);});
load();
