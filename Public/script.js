
// --- NEW FIREBASE CONNECTION ---
// PASTE YOUR FIREBASE CONFIG KEYS HERE
const firebaseConfig = {
  apiKey: "AIzaSy...YOUR_KEY...",
  authDomain: "flowluxe-3c774.firebaseapp.com",
  projectId: "flowluxe-3c774",
  storageBucket: "flowluxe-3c774.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// --- Get references to the services we need ---
const db = firebase.firestore();
const auth = firebase.auth();
const analytics = firebase.analytics();
const perf = firebase.performance();
// --- END OF NEW FIREBASE CODE ---


/* ---------- DOM refs ---------- */
const form = document.getElementById("flowForm");
const styleEl = document.getElementById("style");
const moodEl = document.getElementById("mood");
const intensityEl = document.getElementById("intensity");
const lengthEl = document.getElementById("length");
const bodyTypeEl = document.getElementById("bodyType");
const skillEl = document.getElementById("skill");

const resultCard = document.getElementById("resultCard");
const sessionTitle = document.getElementById("sessionTitle");
const sessionVideo = document.getElementById("sessionVideo");
const sessionDetails = document.getElementById("sessionDetails");
const sessionNote = document.getElementById("sessionNote");
const formError = document.getElementById("formError");

const saveFavBtn = document.getElementById("saveFav");
const favoritesBtn = document.getElementById("favoritesBtn");
const favDrawer = document.getElementById("favDrawer");
const favList = document.getElementById("favList");
const closeFav = document.getElementById("closeFav");

const buildMixBtn = document.getElementById("buildMix");
const mixList = document.getElementById("mixList");

const subscribeBtn = document.getElementById("subscribeBtn");
const subscribeMsg = document.getElementById("subscribeMsg");

const audioToggle = document.getElementById("audioToggle");
const ambience = document.getElementById("ambience");
const motionToggle = document.getElementById("motionToggle");
const installBtn = document.getElementById("installBtn");

const overlay = document.getElementById("breathOverlay");
const breathText = document.getElementById("breathText");
const skipBreath = document.getElementById("skipBreath");
const startBreath = document.getElementById("startBreath");

const fxCanvas = document.getElementById("fxCanvas");

// Auth/Login DOM Refs
const loginSection = document.getElementById("loginSection");
const mainContent = document.getElementById("mainContent");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const authError = document.getElementById("authError");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");


/* ---------- NEW AUTH LOGIC ---------- */
signupBtn.addEventListener("click", () => {
  const email = emailEl.value;
  const password = passwordEl.value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user.uid);
      authError.hidden = true;
    })
    .catch((error) => {
      authError.textContent = error.message;
      authError.hidden = false;
    });
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const email = emailEl.value;
  const password = passwordEl.value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user.uid);
      authError.hidden = true;
    })
    .catch((error) => {
      authError.textContent = error.message;
      authError.hidden = false;
    });
});
auth.onAuthStateChanged((user) => {
  if (user) {
    loginSection.hidden = true;
    mainContent.hidden = false;
    updateFavCount();
    renderFavs();
  } else {
    loginSection.hidden = false;
    mainContent.hidden = true;
  }
});
/* ---------- END OF NEW AUTH LOGIC ---------- */


/* ---------- texts ---------- */
// NEW: Added "family"
const styleText = { 
  belly:"Belly dance flow", 
  pole:"Pole artistry flow", 
  twerk:"Twerk-inspired flow",
  family: "Family dance flow" 
};

// NEW: Added "family"
// IMPORTANT: Make sure your video file is named "family dance.mp4"
const videoMap = {
  "belly": "belly dance.mp4",
  "pole": "pole dance.mp4",
  "twerk": "twerk.mp4",
  "family": "family dance.mp4"
};

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

// This helper function was missing in some old versions
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- theme + ambience ---------- */
function setThemeFromMood(mood){
  const cls = mood==="confident" ? "theme-confident" : mood==="playful" ? "theme-playful" : "theme-calm";
  document.body.classList.remove("theme-calm","theme-confident","theme-playful");
  document.body.classList.add(cls);
  if(audioToggle.checked) setAmbienceForMood(mood);
}
const moodTracks = {
  calm: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_aa7b4d66b5.mp3?filename=ambient-piano-10667.mp3",
  confident: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3a7e6fdf0b.mp3?filename=ambient-111527.mp3",
  playful: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2e9a7b6b76.mp3?filename=future-bass-110089.mp3"
};
function setAmbienceForMood(m){ ambience.src=moodTracks[m]||""; ambience.volume=0.25; ambience.play().catch(()=>{}); }
audioToggle.addEventListener("change", ()=> {
  if(audioToggle.checked){ setAmbienceForMood(moodEl.value||"calm"); } else { ambience.pause(); ambience.currentTime=0; }
});
moodEl.addEventListener("change", ()=> setThemeFromMood(moodEl.value||"calm"));

/* ---------- generate session ---------- */
let lastSession=null;
function generateSession(meta){
  analytics.logEvent('generate_flow', { style: meta.s, mood: meta.m, intensity: meta.i });

  if (videoMap[meta.s]) {
    sessionVideo.src = videoMap[meta.s];
    sessionVideo.hidden = false;
    sessionVideo.play();
  } else {
    sessionVideo.hidden = true;
    sessionVideo.pause();
  }

  const title = `${styleText[meta.s]} · ${meta.m[0].toUpperCase()+meta.m.slice(1)} mood`;
  const moodLine = pick(moodLines[meta.m]);
  const parts = [
    `A ${lengthMap[meta.len]} ${styleText[meta.s]} session featuring ${moodLine}.`,
    `The intensity is ${intensityMap[meta.i]}.`
  ];
  if(meta.body && bodyMap[meta.body]) parts.push(`The featured dancer brings ${bodyMap[meta.body]}.`);
  if(meta.skill && skillMap[meta.skill]) parts.push(`Choreography feels like ${skillMap[meta.skill]}.`);

  lastSession = { id:Date.now(), title, details:parts.join(" "), note:pick(notes), meta };
  sessionTitle.textContent = lastSession.title;
  sessionDetails.textContent = lastSession.details;
  sessionNote.textContent = lastSession.note;

  resultCard.hidden = false;
  resultCard.scrollIntoView({behavior:"smooth"});
  setThemeFromMood(meta.m);
}

form.addEventListener("submit",(e)=>{
  e.preventDefault();
  formError.hidden = true; 

  const s=styleEl.value, m=moodEl.value, i=intensityEl.value, len=lengthEl.value;
  const body=bodyTypeEl.value, skill=skillEl.value;
  
  if(!s||!m||!i||!len||!skill){ 
    formError.textContent = "Please fill out all required fields to build your flow.";
    formError.hidden = false;
    return; 
  }
  
  generateSession({s,m,i,len,body,skill});
});

/* Preset tiles */
document.querySelectorAll(".preset").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    styleEl.value = btn.dataset.style;
    moodEl.value = btn.dataset.mood;
    intensityEl.value = btn.dataset.intensity;
    lengthEl.value = btn.dataset.length;
    skillEl.value = "intermediate";
    bodyTypeEl.value = "";
    generateSession({s:styleEl.value,m:moodEl.value,i:intensityEl.value,len:lengthEl.value,body:"",skill:"intermediate"});
  });
});


/* ---------- favorites (NEW FIREBASE-POWERED) ---------- */
function getFavsCollection() {
  const user = auth.currentUser;
  if (!user) return null;
  return db.collection("users").doc(user.uid).collection("favorites");
}

async function renderFavs(){
  const favsCollection = getFavsCollection();
  if (!favsCollection) return;

  favList.innerHTML = "";
  
  try {
    const snapshot = await favsCollection.orderBy("id", "desc").limit(20).get();
    
    snapshot.forEach(doc => {
      const f = doc.data();
      const docId = doc.id;

      const li = document.createElement("li");
      li.innerHTML = `<strong>${f.title}</strong><div class="tiny">${f.details}</div>
        <div class="row" style="margin-top:6px"><button class="ghost small del" data-id="${docId}">Delete</button></div>`;
      favList.appendChild(li);
    });

    favList.querySelectorAll(".del").forEach(b => {
      b.addEventListener("click", async () => {
        const docId = b.dataset.id;
        // Replaced confirm() with a simpler check for compatibility
        if (window.confirm("Are you sure you want to delete this favorite?")) {
          await getFavsCollection().doc(docId).delete();
          renderFavs();
          updateFavCount();
        }
      });
    });

  } catch (error) {
    console.error("Error rendering favorites: ", error);
  }
}

async function updateFavCount(){
  const favsCollection = getFavsCollection();
  if (!favsCollection) {
    favoritesBtn.textContent = "Favorites (0)";
    return;
  }
  
  const snapshot = await favsCollection.get();
  const count = snapshot.size;
  favoritesBtn.textContent = `Favorites (${count})`;
}

saveFavBtn.addEventListener("click", async () => {
  if(!lastSession) return;
  
  const favsCollection = getFavsCollection();
  if (!favsCollection) {
    console.warn("Please log in to save favorites."); // Replaced alert()
    return;
  }

  try {
    await favsCollection.add(lastSession); 
    updateFavCount();
    favDrawer.setAttribute("aria-hidden","false");
    renderFavs();
  } catch (error)
    {
    console.error("Error saving favorite: ", error);
  }
});

favoritesBtn.addEventListener("click", ()=>{ favDrawer.setAttribute("aria-hidden","false"); renderFavs(); });
closeFav.addEventListener("click", ()=> favDrawer.setAttribute("aria-hidden","true"));
/* ---------- END OF FIREBASE FAVORITES ---------- */


/* ---------- Unwind Mix (UPDATED) ---------- */
buildMixBtn.addEventListener("click", ()=>{
  const m = moodEl.value || "calm";
  const i = intensityEl.value || "medium";
  
  const allStyles = ["belly", "pole", "twerk", "family"];
  const selectedStyle = styleEl.value || allStyles[Math.floor(Math.random() * allStyles.length)];

  const seq = [
    {s: selectedStyle, len: "short"},
    {s: allStyles[Math.floor(Math.random() * allStyles.length)], len: "medium"},
    {s: allStyles[Math.floor(Math.random() * allStyles.length)], len: i === "high" ? "medium" : "short"}
  ];

  mixList.innerHTML = "";
  seq.forEach((step,k)=>{
    const title = styleText[step.s] || `${step.s} flow`;
    const el = document.createElement("li");
    el.innerHTML = `<strong>${title} · ${m[0].toUpperCase()+m.slice(1)} mood</strong>
      <span class="tiny"> (${lengthMap[step.len]})</span>
      <div class="row" style="margin-top:6px"><button class="primary small play" data-k="${k}">Play this step</button></div>`;
    mixList.appendChild(el);
  });
  mixList.querySelectorAll(".play").forEach(b=>{
    b.addEventListener("click", ()=>{
      const k = parseInt(b.dataset.k);
      const meta = { s: seq[k].s, m, i, len: seq[k].len, body:"", skill:"intermediate" };
      generateSession(meta);
      window.scrollTo({top:0,behavior:"smooth"});
    });
  });
});

/* ---------- Breathing overlay (BUGS FIXED) ---------- */
let breathTimers = []; 
function clearBreathTimers(){ breathTimers.forEach(t=>clearTimeout(t)); breathTimers = []; }
function showOverlay(){ overlay.hidden = false; }
function hideOverlay(){ overlay.hidden = true; clearBreathTimers(); breathText.textContent = "Ready?"; }

function runBreathing(){
  if(overlay.hidden) return; // safety
  const steps = [
    {t:"Inhale…", d:4000},
    {t:"Hold…",   d:4000},
    {t:"Exhale…", d:4000} 
  ];
  let loops = 0, i = 0;
  const cycle = () => {
    if(overlay.hidden) return;
    breathText.textContent = steps[i].t;
    const t = setTimeout(()=>{
      i = (i+1) % steps.length;
      if(i===0) loops++;
      if(loops>=3){ breathText.textContent="You’re reset ✨"; breathTimers.push(setTimeout(hideOverlay,1200)); }
      else cycle();
    }, steps[i].d);
    breathTimers.push(t);
  };
  cycle();
}

startBreath.addEventListener("click", ()=>{ showOverlay(); runBreathing(); });
skipBreath.addEventListener("click", hideOverlay);
/* ---------- END OF BUG FIXES ---------- */


/* ---------- subscription stub ---------- */
subscribeBtn.addEventListener("click", ()=> {
  subscribeMsg.textContent = "In a real app this would open a secure checkout. Demo keeps content private (no sharing).";
});

/* ---------- PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e; installBtn.hidden = false;
});
installBtn.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; installBtn.hidden = true;
});
if('serviceWorker' in navigator){ window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js')); }

/* ---------- particles (light) ---------- */
(function particles(){
  const c = fxCanvas, ctx = c.getContext('2d'); let w,h,stars=[],stop=false;
  function resize(){ w=c.width=window.innerWidth; h=c.height=window.innerHeight; }
  function init(){
    resize();
    stars = new Array(80).fill(0).map(()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.3,a:Math.random()*0.6+0.2,s:(Math.random()*0.2+0.05)*(Math.random()<0.5?-1:1)}));
    loop();
  }
  function draw(){
    if(stop) return;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='rgba(255,255,255,0.8)';
    for(const s of stars){ ctx.globalAlpha=s.a; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); s.x+=s.s; if(s.x<-5) s.x=w+5; if(s.x>w+5) s.x=-5; }
    ctx.globalAlpha=1; requestAnimationFrame(draw);
  }
  function loop(){ requestAnimationFrame(draw); }
  window.addEventListener('resize', resize);
  
  // Check if motion is not reduced, then initialize
  if (!motionToggle.checked) {
    init();
  }
  
  // Add listener for the motion toggle
  motionToggle.addEventListener('change', () => {
    if (motionToggle.checked) {
      stop = true; // Stop the animation
      ctx.clearRect(0,0,w,h); // Clear the canvas
    } else {
      stop = false;
      if (stars.length === 0) { // Only init if it hasn't been initialized
        init();
      } else {
        loop(); // Just resume the loop
      }
    }
  });
})();

/* ---------- safety on load ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  overlay.hidden = true;
});
