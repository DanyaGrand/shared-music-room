const SUPABASE_URL = "https://lroavfagilgbujyaqqbk.supabase.co";
const SUPABASE_KEY = "sb_publishable_9JIiQmMwOlc6kCaZILPlKw_QYkbuRUv";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginBox=document.getElementById("loginBox");
const adminBox=document.getElementById("adminBox");
const loginStatus=document.getElementById("loginStatus");

async function checkSession(){
  const {data}=await sb.auth.getSession();
  if(data.session){showAdmin();} else {showLogin();}
}
function showAdmin(){loginBox.hidden=true;adminBox.hidden=false;loadTracks();}
function showLogin(){loginBox.hidden=false;adminBox.hidden=true;}

document.getElementById("login").onclick=async()=>{
  const email=document.getElementById("email").value.trim();
  const password=document.getElementById("password").value;
  if(!email||!password){loginStatus.textContent="Введи email и пароль.";return}
  loginStatus.textContent="Вход...";
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error){loginStatus.textContent="Ошибка входа: "+error.message;return}
  loginStatus.textContent="Успешно!";
  showAdmin();
};
document.getElementById("logout").onclick=async()=>{await sb.auth.signOut();showLogin()};

async function loadTracks(){
  const {data,error}=await sb.from("tracks").select("*").order("created_at",{ascending:false});
  if(error){document.getElementById("status").textContent="Ошибка загрузки списка.";console.error(error);return}
  render(data||[]);
}
function render(tracks){
  document.getElementById("count").textContent=`${tracks.length} трек${tracks.length%10===1?"":"ов"}`;
  document.getElementById("tracks").innerHTML=tracks.map(t=>`<div class="track"><img class="mini" src="${t.cover_url||""}" onerror="this.style.visibility='hidden'"><div class="meta"><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></div></div>`).join("") || '<p class="empty">Пока нет песен.</p>';
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

document.getElementById("upload").onclick=async()=>{
  const af=document.getElementById("audioFile").files[0], cf=document.getElementById("imageFile").files[0];
  if(!af){document.getElementById("status").textContent="Выбери аудиофайл.";return}
  const btn=document.getElementById("upload"); btn.disabled=true; btn.textContent="Загрузка...";
  try{
    const id=crypto.randomUUID();
    const audioPath=`${id}-${af.name.replace(/[^\w.\-]+/g,"_")}`;
    let r=await sb.storage.from("music").upload(audioPath,af);
    if(r.error)throw r.error;
    const audio_url=sb.storage.from("music").getPublicUrl(audioPath).data.publicUrl;
    let cover_url=null;
    if(cf){
      const cp=`${id}-cover-${cf.name.replace(/[^\w.\-]+/g,"_")}`;
      r=await sb.storage.from("music").upload(cp,cf);
      if(r.error)throw r.error;
      cover_url=sb.storage.from("music").getPublicUrl(cp).data.publicUrl;
    }
    r=await sb.from("tracks").insert({
      title:document.getElementById("title").value.trim()||af.name,
      artist:document.getElementById("artist").value.trim()||"Неизвестный исполнитель",
      audio_url,cover_url
    });
    if(r.error)throw r.error;
    document.getElementById("title").value="";
    document.getElementById("artist").value="";
    document.getElementById("audioFile").value="";
    document.getElementById("imageFile").value="";
    document.getElementById("status").textContent="Готово! Песня добавлена для всех 🎵";
    loadTracks();
  }catch(e){
    console.error(e);
    document.getElementById("status").textContent="Не получилось загрузить: "+e.message;
  }
  btn.disabled=false; btn.textContent="Загрузить в общую комнату";
};

document.getElementById("theme").onclick=()=>document.body.classList.toggle("light");
sb.auth.onAuthStateChange((_event,session)=>{if(session)showAdmin();else showLogin()});
checkSession();
