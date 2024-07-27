"use strict";

// Query selectors
let word = document.getElementById("words");
const game = document.getElementById("game");
const timer = document.getElementById("info");
const words =
  "land came much that want light never the did red end sometimes said set found here got red at next in live light much air near river ask miss still every into in cut place where state until been our take ask while man oil saw hand part tell same large the little song paper about below fall seem turn play far man seem back must food all large out again war is letter one what thing paper day sea great world were run make write turn me to back".split(
    " "
  );
const wordsCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function formatWord(word) {
  return `<div class="word">
  <span class="letter">${word
    .split("")
    .join('</span><span class="letter">')}</span>
  </div>`;
}

function addClass(el, name) {
  el.classList.add(name);
}

function removeClass(el, name) {
  el.classList.remove(name);
}

function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return randomIndex;
}

function newGame() {
  word.innerHTML = "";
  for (let i = 0; i < 200; i++) {
    word.innerHTML += formatWord(words[randomWord() - 1]);
  }
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
  window.timer = null;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById("game"), "over");
}

game.addEventListener("keyup", (ev) => {
  ev.preventDefault();
  const key = ev.key;
  const currentLetter = document.querySelector(".letter.current");
  const currentWord = document.querySelector(".word.current");
  const expected = currentLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackspace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord.firstElementChild;
  if (document.querySelector("#game.over")) {
    return;
  }

  // Move lines
  updateScroll();

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = new Date().getTime();
      }
      const currentTime = new Date().getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = gameTime / 1000 - sPassed;
      if (sLeft <= 0) {
        gameOver();
      }
      document.getElementById("info").innerHTML = sLeft + " ";
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextElementSibling != null) {
        addClass(currentLetter.nextSibling, "current");
      }
    } else {
      console.dir(currentWord);
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      currentWord.innerHTML = currentWord.innerHTML.trim();
      currentWord.appendChild(incorrectLetter);
    }
  }
  if (isSpace) {
    if (expected !== " ") {
      const lettersToInvalidate = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ];
      lettersToInvalidate.forEach((letter) => addClass(letter, "incorrect"));
    }
    removeClass(currentWord, "current");
    if (currentLetter) removeClass(currentLetter, "current");
    const nextWord = currentWord.nextElementSibling;
    if (nextWord) {
      addClass(nextWord, "current");
      const firstLetterOfNextWord = nextWord.querySelector(".letter");
      if (firstLetterOfNextWord) addClass(firstLetterOfNextWord, "current");
    }
  }

  // Backspace
  if (isBackspace) {
    if (currentLetter) {
      const prevLetter = currentLetter.previousElementSibling;
      if (isFirstLetter && currentWord.previousSibling) {
        const prevWord = currentWord.previousElementSibling;
        const hasIncorrectLetter = Array.from(prevWord.children).some(
          (letter) => letter.classList.contains("incorrect")
        );
        const extraLetter = Array.from(prevWord.children).some((letter) =>
          letter.classList.contains("extra")
        );
        if (!extraLetter) {
          removeClass(currentWord, "current");
          removeClass(currentLetter, "current");
          addClass(prevWord, "current");
          const lastLetterOfPreviousWord = prevWord.lastElementChild;
          if (lastLetterOfPreviousWord) {
            addClass(lastLetterOfPreviousWord, "current");
            removeClass(lastLetterOfPreviousWord, "correct");
            removeClass(lastLetterOfPreviousWord, "incorrect");
          }
        } else {
          removeClass(currentLetter, "current");
          removeClass(currentWord, "current");
          addClass(prevWord, "current");
          const lastLetterOfPreviousWord = prevWord.lastElementChild;
          addClass(lastLetterOfPreviousWord, "current");
          const extraElement = prevWord.querySelector(".current");
          if (extraElement) extraElement.parentNode.removeChild(extraElement);
        }
      } else if (!isFirstLetter && prevLetter) {
        removeClass(currentLetter, "correct");
        removeClass(currentLetter, "incorrect");
        removeClass(currentLetter, "current");
        addClass(prevLetter, "current");
        removeClass(prevLetter, "correct");
        removeClass(prevLetter, "incorrect");
      }
    } else {
      const hasIncorrectLetter = Array.from(currentWord.children).some(
        (letter) => letter.classList.contains("incorrect")
      );
      const extraLetter = Array.from(currentWord.children).some((letter) =>
        letter.classList.contains("extra")
      );
      const lastLetterOfPreviousWord = currentWord.lastElementChild;
      if (hasIncorrectLetter) {
        if (!extraLetter) {
          if (lastLetterOfPreviousWord) {
            addClass(lastLetterOfPreviousWord, "current");
            removeClass(lastLetterOfPreviousWord, "correct");
            removeClass(lastLetterOfPreviousWord, "incorrect");
          }
        } else {
          addClass(lastLetterOfPreviousWord, "current");
          const extraElement = currentWord.querySelector(".current");
          if (extraElement) extraElement.parentNode.removeChild(extraElement);
        }
      }
    }
  }

  // Moving cursor
  updateCursorPositioning();
});

function updateCursorPositioning() {
  const cursor = document.getElementById("cursor");
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top + 6 + "px";
  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] + "px";
}

let lineHeight;
let requiredLength;

function updateScroll() {
  const currentWord = document.querySelector(".word.current");
  const currentTop = currentWord.getBoundingClientRect().top;
  const wordheight = word.getBoundingClientRect().top;
  console.log(wordheight);
  if (!lineHeight) {
    lineHeight = parseFloat(window.getComputedStyle(currentWord).lineHeight);
  }

  if (currentTop > requiredLength) {
    const margin = parseInt(word.style.marginTop || "0px");
    console.log(margin);
    word.style.marginTop = margin - lineHeight + "px";
    updateCursorPositioning();
  }
}

newGame();

// Scroll function
requiredLength = word.getBoundingClientRect().top + 70;

updateCursorPositioning();
window.addEventListener("resize", () => {
  requiredLength = word.getBoundingClientRect().top + 70;
  updateCursorPositioning();
});
window.addEventListener("resize", updateScroll);
