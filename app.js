const SUPABASE_URL = "https://lroavfagilgbujyaqqbk.supabase.co";
const SUPABASE_KEY = "sb_publishable_9JIiQmMwOlc6kCaZILPlKw_QYkbuRUv";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const audio=document.getElementById("audio"), tracksEl=document.getElementById("tracks");
let tracks=[], index=-1;
const fmt=s=>Number.isFinite(s)?`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`:"0:00";

async function loadTracks(){
  const {data,error}=await sb.from("tracks").select("*").order("created_at",{ascending:false});
  if(error){document.getElementById("status").textContent="Ошибка подключения к музыке.";console.error(error);return}
  tracks=data||[]; render();
}
function render(){
  document.getElementById("count").textContent=`${tracks.length} трек${tracks.length%10===1?"":"ов"}`;
  tracksEl.innerHTML=tracks.map((t,i)=>`<div class="track"><img class="mini" src="${t.cover_url||""}" onerror="this.style.visibility='hidden'"><div class="meta"><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></div><button onclick="playTrack(${i})">▶</button></div>`).join("") || '<p class="empty">Пока нет песен.</p>';
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
window.playTrack=async i=>{
  index=i; let t=tracks[i]; audio.src=t.audio_url;
  document.getElementById("nowTitle").textContent=t.title;
  document.getElementById("nowArtist").textContent=t.artist;
  const c=document.getElementById("cover"),e=document.getElementById("coverEmpty");
  if(t.cover_url){c.src=t.cover_url;c.hidden=false;e.style.display="none"}else{c.hidden=true;e.style.display="block"}
  try{await audio.play()}catch(e){console.warn(e)}
};
document.getElementById("play").onclick=()=>audio.src&&(audio.paused?audio.play():audio.pause());
audio.onplay=()=>document.getElementById("play").textContent="Ⅱ";
audio.onpause=()=>document.getElementById("play").textContent="▶";
audio.ontimeupdate=()=>{document.getElementById("cur").textContent=fmt(audio.currentTime);document.getElementById("seek").value=audio.duration?audio.currentTime/audio.duration*100:0};
audio.onloadedmetadata=()=>document.getElementById("dur").textContent=fmt(audio.duration);
document.getElementById("seek").oninput=e=>{if(audio.duration)audio.currentTime=e.target.value/100*audio.duration};
document.getElementById("vol").oninput=e=>audio.volume=e.target.value;
document.getElementById("prev").onclick=()=>index>0&&playTrack(index-1);
document.getElementById("next").onclick=()=>index<tracks.length-1&&playTrack(index+1);
document.getElementById("theme").onclick=()=>document.body.classList.toggle("light");
sb.channel("tracks-live").on("postgres_changes",{event:"*",schema:"public",table:"tracks"},()=>loadTracks()).subscribe();
loadTracks(); audio.volume=.8;
