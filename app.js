let wordList = [];
let currentWords = [];
let incorrectWords = [];
let stats = {
  newToday: 0,
  curveDone: 0,
};

const loadWords = async () => {
  const res = await fetch('words.json');
  wordList = await res.json();
  generateTodayWords();
};

const generateTodayWords = () => {
  const todayWords = [];
  for (let i = 0; i < 10; i++) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    todayWords.push(word);
  }
  currentWords = todayWords;
  renderWords(todayWords);
};

const renderWords = (words) => {
  const container = document.getElementById('wordList');
  container.innerHTML = '';
  words.forEach((word, i) => {
    const item = document.createElement('div');
    item.className = 'word-item';
    item.innerHTML = `
      <button onclick="speak('${word}')">🔊 听</button>
      <input type="text" id="input-${i}" placeholder="请输入单词">
    `;
    container.appendChild(item);
  });
};

const speak = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
};

document.getElementById('submitBtn').addEventListener('click', () => {
  incorrectWords = [];
  currentWords.forEach((word, i) => {
    const input = document.getElementById(`input-${i}`);
    if (input.value.trim().toLowerCase() === word.toLowerCase()) {
      input.classList.add('correct');
      stats.newToday++;
    } else {
      input.classList.add('incorrect');
      incorrectWords.push(word);
    }
    input.disabled = true;
  });
  updateStats();
  if (incorrectWords.length > 0) {
    document.getElementById('retryBtn').style.display = 'inline-block';
  }
});

document.getElementById('retryBtn').addEventListener('click', () => {
  renderWords(incorrectWords);
  document.getElementById('retryBtn').style.display = 'none';
});

const updateStats = () => {
  document.getElementById('newWords').textContent = `今天掌握：${stats.newToday} 个新词`;
  document.getElementById('curveWords').textContent = `完成记忆曲线：${stats.curveDone} 个`;
};

loadWords();
