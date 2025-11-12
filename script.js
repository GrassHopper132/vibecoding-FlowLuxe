// ====== State & helpers ======
const DB = {
  favs: "flowluxe:favorites",
  prefs: "flowluxe:prefs",
  streak: "flowluxe:streak",
};
const load = (k, def) => JSON.parse(localStorage.getItem(k) || JSON.stringify(def));
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];

// ====== DOM refs ======
const form = document.getElementById("flowForm");
const styleEl = document.getElementById("style");
const moodEl = document.getElementById("mood");
const intensityEl = document.getElementById("intensity");
const lengthEl = document.getElementById("length");
const bodyTypeEl = document.getElementById("bodyType");
const skillEl = document.getElementById("skill");

const resultCard = document.getElementById("resultCard");
const sessionTitle = document.getElementById("sessionTitle");
const sessionDetails = document.getElementById("sessionDetails");
const sessionNote = document.getElementById("sessionNote");
const saveFavBtn = document.getElementById("saveFav");
const startBreathBtn = document.getElementById("startBreath");

const buildMixBtn = document.getElementById("buildMix");
const mixList = document.getElementById("mixList");

const subscribeBtn = document.getElementById("subscribeBtn");
const subscribeMsg = document.getElementById("subscribeMsg");

const favoritesBtn = document.getElementById("favoritesBtn");
const favDrawer = document.getElementById("favDrawer");
const favList = document.getElementById("favList");
const closeFav = document.getElementById("closeFav");

const audioToggle = document.getElementById("audioToggle");
const ambience = document.getElementById("ambience");
const motionToggle = document.getElementById("motionToggle");

const installBtn = document.getElementById("installBtn");

const fxCanvas = document.getElementById("fxCanvas");

// ====== Text maps ======
const styleText = { belly:"Belly dance flow", pole:"Pole artistry flow", twerk:"Twerk-inspired flow" };
const moodLines = {
  calm: [
    "slow, hypnotic sequences with soft camera motion",
    "warm, grounded movement with long, flowing transitions",
    "gentle, breath-paced choreography in a dim, cozy studio"
  ],
  confident: [
    "bold, precise accents with spotlight-style lighting",
    "powerful lines and strong pauses that show off control",
    "sharp, musical hits that feel like a private stage show"
  ],
  playful: [
    "bouncy, upbeat combos that invite you to smile",
    "colorful lighting and fun musical breaks",
    "light-hearted groove patterns that keep the energy up"
  ]
};
const intensityMap = {
  low:"soothing, low-impact pace focused on breathing and small details",
  medium:"balanced pace with enough movement to reset your mood",
  high:"intense, cardio-style pace to shake off stress and tension"
};
const lengthMap = { short:"about 5–8 minutes", medium:"about 10–15 minutes", long:"about 18–25 minutes" };
const bodyMap = { light:"a light & flowy movement style", strong:"a strong & athletic presence", curvy:"a curvy, full-figure presence" };
const skillMap = { gentle:"gentle, beginner-friendly combinations", intermediate:"polished, intermediate-level artistry", elite:"elite-level performance with advanced control" };
const notes = [
  "This session is designed to help you leave the day behind and come back to your body in a kind way.",
  "Use this flow as a small ritual: dim the lights, take a sip of water, and let your shoulders drop.",
  "You don’t have to copy every move perfectly—just let the rhythm give your mind a break.",
  "If you’ve had a rough day, treat this as a reset button, not a workout scorecard."
];

// ====== Mood theme handling ======
function updateThemeFromMood(mood){
  const body = document.body;
  body.classList.remove("theme-calm","theme-confident","theme-playful");
  const cls = mood==="confident" ? "theme-confident" : mood==="playful" ? "theme-playful" : "theme-calm";
  body.classList.add(cls);
  // music swap if enabled
  if (audioToggle.checked) setAmbienceForMood(mood);
}

// ====== Generate session ======
let lastSession = null;

function generateSession({s,m,i,len,body,skill}){
  const title = `${styleText[s]} · ${m[0].toUpperCase()+m.slice(1)} mood`;
  const moodLine = pick(moodLines[m]);
  const parts = [
    `A ${lengthMap[len]} ${styleText[s]} session featuring ${moodLine}.`,
    `The intensity is ${intensityMap[i]}.`
  ];
  if(body && bodyMap[body]) parts.push(`The featured dancer brings ${bodyMap[body]}.`);
  if(skill && skillMap[skill]) parts.push(`Choreography feels like ${skillMap[skill]}.`);

  lastSession = {
    id: Date.now(),
    title,
    details: parts.join(" "),
    note: pick(notes),
    meta: {s,m,i,len,body,skill}
  };

  sessionTitle.textContent = lastSession.title;
  sessionDetails.textContent = lastSession.details;
  sessionNote.textContent = lastSession.note;

  resultCard.hidden = false;
  resultCard.scrollIntoView({behavior:"smooth"});
  updateThemeFromMood(m);
}

form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const s = styleEl.value, m = moodEl.value, i = intensityEl.value, len = lengthEl.value;
  const body = bodyTypeEl.value, skill = skillEl.value;
  if(!s||!m||!i||!len||!skill){ alert("Please fill out all required fields."); return; }
  generateSession({s,m,i,len,body,skill});
});

// Preset tiles
for(const btn of document.querySelectorAll(".preset")){
  btn.addEventListener("click", ()=>{
    styleEl.value = btn.dataset.style;
    moodEl.value = btn.dataset.mood;
    intensityEl.value = btn.dataset.intensity;
    lengthEl.value = btn.dataset.length;
    skillEl.value = "intermediate";
    bodyTypeEl.value = "";
    generateSession({s:styleEl.value,m:moodEl.value,i:intensityEl.value,len:lengthEl.value,body:"",skill:"intermediate"});
  });
}

// ====== Favorites ======
function renderFavs(){
  const favs = load(DB.favs, []);
  favList.innerHTML = "";
  favs.forEach((f,idx)=>{
    const li = document.createElement("li");
    li.innerHTML = `<strong>${f.title}</strong><div class="tiny">${f.details}</div>
      <div class="row" style="margin-top:6px"><button data-i="${idx}" class="ghost small del">Delete</button></div>`;
    favList.appendChild(li);
  });
  favList.querySelectorAll(".del").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const favs = load(DB.favs, []);
      favs.splice(parseInt(btn.dataset.i),1);
      save(DB.favs, favs);
      renderFavs(); updateFavCount();
    });
  });
}
function updateFavCount(){
  const c = load(DB.favs, []).length;
  favoritesBtn.textContent = `Favorites (${c})`;
}
saveFavBtn.addEventListener("click", ()=>{
  if(!lastSession) return;
  const favs = load(DB.favs, []);
  favs.unshift(lastSession);
  if(favs.length>20) favs.pop();
  save(DB.favs, favs);
  updateFavCount();
  favDrawer.setAttribute("aria-hidden","false");
  renderFavs();
});
favoritesBtn.addEventListener("click", ()=>{ favDrawer.setAttribute("aria-hidden","false"); renderFavs(); });
closeFav.addEventListener("click", ()=> favDrawer.setAttribute("aria-hidden","true"));

// ====== Unwind Mix (auto playlist) ======
buildMixBtn.addEventListener("click", ()=>{
  // base on current mood/intensity, default calm/medium
  const m = moodEl.value || "calm";
  const i = intensityEl.value || "medium";
  const sOptions = ["belly","pole","twerk"];
  const seq = [
    {s: sOptions[0], len:"short"},
    {s: sOptions[1], len:"medium"},
    {s: sOptions[2], len: i==="high" ? "medium" : "short"},
  ];
  mixList.innerHTML = "";
  seq.forEach((step,k)=>{
    const meta = { s: step.s, m, i, len: step.len, body:"", skill:"intermediate" };
    const title = `${styleText[meta.s]} · ${m[0].toUpperCase()+m.slice(1)} mood`;
    const el = document.createElement("li");
    el.innerHTML = `<strong>${title}</strong> <span class="tiny">(${lengthMap[meta.len]})</span>
      <div class="row" style="margin-top:6px"><button class="primary small play" data-k="${k}">Play this step</button></div>`;
    mixList.appendChild(el);
  });
  mixList.querySelectorAll(".play").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const k = parseInt(btn.dataset.k);
      const meta = seq[k];
      generateSession({ s: meta.s, m, i, len: meta.len, body:"", skill:"intermediate" });
      window.scrollTo({top:0,behavior:"smooth"});
    });
  });
});

// ====== Breathing overlay ======
const overlay = document.getElementById("breathOverlay");
const ring = document.getElementById("breathRing");
const breathText = document.getElementById("breathText");
const skipBreath = document.getElementById("skipBreath");

function breathingScript(){
  const steps = [
    {t:"Inhale…", d:4000},
    {t:"Hold…",   d:4000},
    {t:"Exhale…", d:4000},
  ];
  let loops = 0;
  let i = 0;
  function next(){
    if(overlay.hidden) return;
    const step = steps[i];
    breathText.textContent = step.t;
    setTimeout(()=>{
      i = (i+1) % steps.length;
      if(i===0) loops++;
      if(loops>=3){ // ~36s
        breathText.textContent = "You’re reset ✨";
        setTimeout(()=>overlay.hidden = true, 1200);
      } else next();
    }, step.d);
  }
  next();
}
startBreathBtn.addEventListener("click", ()=>{
  overlay.hidden = false;
  breathingScript();
});
skipBreath.addEventListener("click", ()=> overlay.hidden = true);

// ====== Ambient audio (per mood) ======
const moodTracks = {
  calm: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_aa7b4d66b5.mp3?filename=ambient-piano-10667.mp3",
  confident: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3a7e6fdf0b.mp3?filename=ambient-111527.mp3",
  playful: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2e9a7b6b76.mp3?filename=future-bass-110089.mp3"
};
function setAmbienceForMood(mood){
  ambience.src = moodTracks[mood] || "";
  ambience.volume = 0.25;
  ambience.play().catch(()=>{ /* ignore autoplay blocks */ });
}
audioToggle.addEventListener("change", ()=>{
  if(audioToggle.checked){
    const m = moodEl.value || "calm";
    setAmbienceForMood(m);
  } else {
    ambience.pause(); ambience.currentTime = 0;
  }
});

// Mood reacts live when user changes mood select
moodEl.addEventListener("change", ()=> updateThemeFromMood(moodEl.value||"calm"));

// ====== Motion toggle (accessibility) ======
motionToggle.addEventListener("change", ()=>{
  document.body.dataset.reduceMotion = motionToggle.checked ? "1" : "0";
  // also stop particles if reduce motion
  fx.stop = motionToggle.checked;
});

// ====== Subscription stub ======
subscribeBtn.addEventListener("click", ()=>{
  subscribeMsg.textContent = "In a real app, this would open a secure checkout. Demo keeps content private (no sharing).";
});

// ====== Favorites init ======
updateFavCount();

// ====== PWA install prompt ======
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js'));
}

// ====== Cinematic particles (lightweight) ======
const fx = (()=> {
  const c = fxCanvas, ctx = c.getContext('2d');
  let w=0,h=0, stars=[], stop=false;
  function resize(){ w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
  function init(){
    resize();
    stars = new Array(80).fill(0).map(()=>({
      x:Math.random()*w,
      y:Math.random()*h,
      r:Math.random()*1.2+0.3,
      a:Math.random()*0.6+0.2,
      s:(Math.random()*0.2+0.05)*(Math.random()<0.5?-1:1)
    }));
    loop();
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for(const s of stars){
      ctx.globalAlpha = s.a;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      s.x += s.s; if(s.x<-5) s.x=w+5; if(s.x>w+5) s.x=-5;
    }
    ctx.globalAlpha = 1;
  }
  function loop(){
    if(stop) return;
    draw();
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize);
  return { init, stop:false };
})();
fx.init();
