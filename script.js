const wordsPerDay = 8;
let todayKey = new Date().toISOString().split("T")[0];
let storedProgress = JSON.parse(localStorage.getItem("progress") || "{}");
let todayWords = storedProgress[todayKey]?.words || [];

if (todayWords.length === 0) {
  const usedWords = Object.values(storedProgress).flatMap(day => day.words);
  const unusedWords = wordList.filter(w => !usedWords.includes(w));
  todayWords = unusedWords.slice(0, wordsPerDay);
  storedProgress[todayKey] = { words: todayWords, correct: [] };
  localStorage.setItem("progress", JSON.stringify(storedProgress));
}

const wordListContainer = document.getElementById("word-list");
todayWords.forEach(word => {
  const div = document.createElement("div");
  div.className = "word-item";
  div.innerHTML = `<label>${word}</label><input data-word="${word}" />`;
  wordListContainer.appendChild(div);
});

document.getElementById("submit").onclick = () => {
  const inputs = document.querySelectorAll("input");
  let correct = [];
  let wrong = [];

  inputs.forEach(input => {
    const target = input.dataset.word;
    if (input.value.trim().toLowerCase() === target.toLowerCase()) {
      correct.push(target);
      input.style.borderColor = "green";
    } else {
      wrong.push(target);
      input.style.borderColor = "red";
    }
  });

  storedProgress[todayKey].correct = correct;
  localStorage.setItem("progress", JSON.stringify(storedProgress));

  document.getElementById("retry").style.display = wrong.length ? "inline-block" : "none";
  updateStats();
};

document.getElementById("retry").onclick = () => {
  const wrongWords = todayWords.filter(word => !storedProgress[todayKey].correct.includes(word));
  wordListContainer.innerHTML = "";
  wrongWords.forEach(word => {
    const div = document.createElement("div");
    div.className = "word-item";
    div.innerHTML = `<label>${word}</label><input data-word="${word}" />`;
    wordListContainer.appendChild(div);
  });
};

function updateStats() {
  let learnedToday = storedProgress[todayKey]?.correct?.length || 0;
  let finishedWords = Object.values(storedProgress)
    .flatMap(d => d.correct || [])
    .filter((v, i, a) => a.indexOf(v) === i).length;
  document.getElementById("stats").textContent = `今日记忆单词：${learnedToday} | 完成记忆曲线：${finishedWords}`;
}

updateStats();
