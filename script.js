const wordsPerDay = 8;
const wordList = [...words]; // 从 words.js 获取
const todayKey = new Date().toISOString().slice(0, 10); // 2025-05-25
const savedData = JSON.parse(localStorage.getItem('juzi-data') || '{}');

if (!savedData[todayKey]) {
  savedData[todayKey] = {
    reviewedWords: [],
    completed: false,
    wrongWords: [],
  };

  // 抽取未出现过的单词
  const usedWords = Object.values(savedData).flatMap(d => d.reviewedWords);
  const available = wordList.filter(w => !usedWords.includes(w));
  savedData[todayKey].reviewedWords = available.slice(0, wordsPerDay);
  localStorage.setItem('juzi-data', JSON.stringify(savedData));
}

let currentWords = savedData[todayKey].reviewedWords;
let wrongWords = [];
let retryMode = false;

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
}

function renderWords(words) {
  const container = document.getElementById('word-container');
  container.innerHTML = '';
  words.forEach((word, i) => {
    const div = document.createElement('div');
    div.className = 'word-input';
    div.innerHTML = `
      <button onclick="speak('${word}')">🔊</button>
      <input type="text" data-word="${word}" placeholder="输入拼写..." />
    `;
    container.appendChild(div);
  });
}

function updateStats() {
  const total = Object.values(savedData)
    .flatMap(day => day.reviewedWords)
    .filter((w, i, a) => a.indexOf(w) === i).length;

  const complete = Object.values(savedData)
    .filter(day => day.completed)
    .flatMap(day => day.reviewedWords)
    .filter((w, i, a) => a.indexOf(w) === i).length;

  document.getElementById('stats').textContent =
    `今日记忆：${currentWords.length} 个 | 累计记住：${complete} 个`;
}

document.getElementById('submit-btn').onclick = function () {
  const inputs = document.querySelectorAll('input');
  let allCorrect = true;
  wrongWords = [];

  inputs.forEach(input => {
    const correct = input.dataset.word;
    if (input.value.trim().toLowerCase() !== correct.toLowerCase()) {
      allCorrect = false;
      wrongWords.push(correct);
      input.style.border = '2px solid red';
    } else {
      input.style.border = '2px solid green';
    }
  });

  if (allCorrect) {
    savedData[todayKey].completed = true;
    savedData[todayKey].wrongWords = [];
    alert('全部正确，今日完成 ✅');
  } else {
    savedData[todayKey].wrongWords = wrongWords;
    document.getElementById('retry-btn').style.display = 'inline-block';
    alert(`有 ${wrongWords.length} 个错误 ❌，请点击下方按钮重练`);
  }

  localStorage.setItem('juzi-data', JSON.stringify(savedData));
  updateStats();
};

document.getElementById('retry-btn').onclick = function () {
  retryMode = true;
  renderWords(savedData[todayKey].wrongWords);
};

renderWords(currentWords);
updateStats();
