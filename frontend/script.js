/* ================= DOM ELEMENTS ================= */
const inputSection = document.getElementById("input-section");
const chatSection = document.getElementById("chat-section");
const resultSection = document.getElementById("result-section");

const ideaInput = document.getElementById("idea-input");
const chatHistory = document.getElementById("chat-history");
const chatInput = document.getElementById("chat-input");

const generateBtn = document.getElementById("generate-btn");

/* ================= STATE ================= */
let projectIdea = "";
let questions = [];
let answers = [];
let currentQuestionIndex = 0;

/* ================= START ANALYSIS ================= */
async function startAnalysis() {
  projectIdea = ideaInput.value.trim();
  if (!projectIdea) {
    alert("Please enter an idea");
    return;
  }

  inputSection.classList.add("hidden-section");
  chatSection.classList.remove("hidden-section");

  chatHistory.innerHTML = "";

  try {
    const res = await fetch(
      "https://ai-requirement-analyst.onrender.com/docs#/default/analyze_idea_analyze_post",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: projectIdea }),
      },
    );

    if (!res.ok) throw new Error("Backend error during analysis");

    let text = await res.text();

    questions = parseQuestions(text);

    if (questions.length === 0) {
      throw new Error("No questions returned");
    }

    answers = [];
    currentQuestionIndex = 0;

    generateBtn.classList.add("hidden-section");

    addMessage("ai", questions[0]);
  } catch (err) {
    console.error(err);
    alert(err.message);
    inputSection.classList.remove("hidden-section");
    chatSection.classList.add("hidden-section");
  }
}

/* ================= QUESTION PARSER ================= */
function parseQuestions(text) {
  // Remove wrapping quotes
  if (text.startsWith('"') && text.endsWith('"')) {
    text = text.slice(1, -1);
  }

  // Convert escaped newlines to real newlines
  text = text.replace(/\\n/g, "\n");

  return text
    .split("\n")
    .map((l) => l.replace(/\*\*/g, "").trim())
    .filter((l) => l.length > 5)
    .map((l) => l.replace(/^\d+[\.\)]\s*/, ""))
    .filter((l) => l.includes("?"));
}

/* ================= SEND ANSWER ================= */
function sendAnswer() {
  const answer = chatInput.value.trim();
  if (!answer) return;

  addMessage("user", answer);
  answers.push(answer);
  chatInput.value = "";

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    setTimeout(() => {
      addMessage("ai", questions[currentQuestionIndex]);
    }, 300);
  } else {
    setTimeout(() => {
      addMessage(
        "ai",
        "All questions answered. Click **Generate Requirements**.",
      );
      generateBtn.classList.remove("hidden-section");
    }, 300);
  }
}

/* ================= GENERATE REQUIREMENTS ================= */
async function generateRequirements() {
  generateBtn.disabled = true;
  generateBtn.innerText = "Generating...";

  const formattedAnswers = {};
  questions.forEach((q, i) => {
    formattedAnswers[q] = answers[i] || "";
  });

  try {
    const res = await fetch("http://127.0.0.1:8001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea: projectIdea,
        answers: formattedAnswers,
      }),
    });

    if (!res.ok) throw new Error("Generation failed");

    const text = await res.text();

    chatSection.classList.add("hidden-section");
    resultSection.classList.remove("hidden-section");

    parseSRS(text);
  } catch (err) {
    console.error(err);
    alert("Error generating requirements");
    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Requirements";
  }
}

/* ================= SRS PARSER ================= */
function parseSRS(text) {
  const func = [];
  const nonFunc = [];
  const tech = [];

  let current = null;

  const lines = text
    .replace(/\*\*/g, "")
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((l) => l.trim());

  lines.forEach((line) => {
    const lower = line.toLowerCase();

    if (lower.includes("functional requirements") && !lower.includes("non")) {
      current = func;
    } else if (lower.includes("non-functional requirements")) {
      current = nonFunc;
    } else if (lower.includes("technical")) {
      current = tech;
    } else if (
      current &&
      (line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line))
    ) {
      current.push(line.replace(/^[-•\d+\.]\s*/, ""));
    }
  });

  fill("func-req-list", func);
  fill("non-func-req-list", nonFunc);
  fill("tech-spec-list", tech);
}

/* ================= UI HELPERS ================= */
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatHistory.appendChild(div);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function fill(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = items.length
    ? items.map((i) => `<li>${i}</li>`).join("")
    : "<li>No data generated.</li>";
}
