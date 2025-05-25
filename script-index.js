const wordListEl = document.getElementById("word-list");
const startButton = document.getElementById("start-dictation");

// 获取今天的词
const todayWords = getTodayWords();
todayWords.forEach(word => {
  const li = document.createElement("li");
  li.textContent = word;
  wordListEl.appendChild(li);
});

startButton.onclick = () => {
  localStorage.setItem("dictationWords", JSON.stringify(todayWords));
  window.location.href = "dictation.html";
};
