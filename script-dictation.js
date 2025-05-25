const words = JSON.parse(localStorage.getItem("dictationWords") || "[]");
let currentIndex = 0;
let errors = [];

const wordIndexEl = document.getElementById("current-word-index");
const playButton = document.getElementById("play-audio");
const inputEl = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-answer");
const resultEl = document.getElementById("result-section");
const resultMsg = document.getElementById("result-message");
const retryBtn = document.getElementById("retry-button");

function speak(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function showWord() {
  wordIndexEl.textContent = `第 ${currentIndex + 1} 个单词`;
  inputEl.value = "";
  inputEl.focus();
}

playButton.onclick = () => speak(words[currentIndex]);

submitBtn.onclick = () => {
  const userInput = inputEl.value.trim().toLowerCase();
  const correct = words[currentIndex];
  if (userInput !== correct) {
    errors.push(correct);
  }

  currentIndex++;
  if (currentIndex < words.length) {
    showWord();
  } else {
    inputEl.style.display = "none";
    playButton.style.display = "none";
    submitBtn.style.display = "none";
    wordIndexEl.style.display = "none";

    resultEl.style.display = "block";
    if (errors.length === 0) {
      resultMsg.textContent = "🎉 全部拼写正确，今日任务完成！";
      markTodayCompleted();
    } else {
      resultMsg.textContent = `❌ 有 ${errors.length} 个拼写错误`;
      retryBtn.style.display = "inline-block";
    }
  }
};

retryBtn.onclick = () => {
  localStorage.setItem("dictationWords", JSON.stringify(errors));
  location.reload();
};

showWord();
