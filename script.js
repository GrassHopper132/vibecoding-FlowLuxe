// Helper to pick a random element
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

// Form + elements
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
const newFlowBtn = document.getElementById("newFlow");

const subscribeBtn = document.getElementById("subscribeBtn");
const subscribeMsg = document.getElementById("subscribeMsg");

// Maps for nicer text
const styleText = {
  belly: "Belly dance flow",
  pole: "Pole artistry flow",
  twerk: "Twerk-inspired flow"
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
  low: "soothing, low-impact pace focused on breathing and small details",
  medium: "balanced pace with enough movement to reset your mood",
  high: "intense, cardio-style pace to shake off stress and tension"
};

const lengthMap = {
  short: "about 5–8 minutes",
  medium: "about 10–15 minutes",
  long: "about 18–25 minutes"
};

const bodyMap = {
  light: "a light & flowy movement style",
  strong: "a strong & athletic presence",
  curvy: "a curvy, full-figure presence"
};

const skillMap = {
  gentle: "gentle, beginner-friendly combinations",
  intermediate: "polished, intermediate-level artistry",
  elite: "elite-level performance with advanced control"
};

const notes = [
  "This session is designed to help you leave the day behind and come back to your body in a kind way.",
  "Use this flow as a small ritual: dim the lights, take a sip of water, and let your shoulders drop.",
  "You don’t have to copy every move perfectly—just let the rhythm give your mind a break.",
  "If you’ve had a rough day, treat this as a reset button, not a workout scorecard."
];

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const s = styleEl.value;
  const m = moodEl.value;
  const i = intensityEl.value;
  const len = lengthEl.value;
  const body = bodyTypeEl.value;
  const skill = skillEl.value;

  if(!s || !m || !i || !len || !skill){
    alert("Please fill out all required fields.");
    return;
  }

  const title = `${styleText[s]} · ${m.charAt(0).toUpperCase() + m.slice(1)} mood`;
  const moodLine = pick(moodLines[m]);

  const parts = [];
  parts.push(`A ${lengthMap[len]} ${styleText[s]} session featuring ${moodLine}.`);
  parts.push(`The intensity is ${intensityMap[i]}.`);

  if(body && bodyMap[body]){
    parts.push(`The featured dancer brings ${bodyMap[body]}.`);
  }

  if(skill && skillMap[skill]){
    parts.push(`Choreography feels like ${skillMap[skill]}.`);
  }

  sessionTitle.textContent = title;
  sessionDetails.textContent = parts.join(" ");
  sessionNote.textContent = pick(notes);

  resultCard.hidden = false;
  resultCard.scrollIntoView({behavior:"smooth"});
});

// New flow button
newFlowBtn.addEventListener("click", () => {
  resultCard.hidden = true;
  form.reset();
  sessionTitle.textContent = "";
  sessionDetails.textContent = "";
  sessionNote.textContent = "";
});

// Mock subscription
subscribeBtn.addEventListener("click", () => {
  subscribeMsg.textContent =
    "In a real app, this button would open a secure checkout page. For this class demo, it just shows this message.";
});
