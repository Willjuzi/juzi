function getTodayKey() {
  const today = new Date();
  return `words-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getTodayWords() {
  const key = getTodayKey();
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);

  const selected = generateTodayWords();
  localStorage.setItem(key, JSON.stringify(selected));
  return selected;
}

function generateTodayWords() {
  const seen = new Set();
  const selected = [];
  while (selected.length < 8) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    if (!seen.has(word)) {
      seen.add(word);
      selected.push(word);
    }
  }
  return selected;
}

function markTodayCompleted() {
  const key = getTodayKey() + "-done";
  localStorage.setItem(key, "true");
}
