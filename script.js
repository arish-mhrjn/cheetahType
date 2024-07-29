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

function getWpm() {
  const words = [...document.querySelectorAll(".word")];
  const lastTypedWord = document.querySelector(".word.current");
  const lastTypedWordIndex = words.indexOf(lastTypedWord);
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter((word) => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter((letter) =>
      letter.className.includes("incorrect")
    );
    const correctLetters = letters.filter((letter) =>
      letter.className.includes("correct")
    );
    return (
      incorrectLetters.length === 0 && correctLetters.length === letters.length
    );
  });
  return (correctWords.length / gameTime) * 60000;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById("game"), "over");
  document.getElementById("info").innerHTML = `WPM: ${getWpm()}`;
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

  if (!window.timer && (isLetter || isSpace)) {
    startTimer();
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextElementSibling != null) {
        addClass(currentLetter.nextSibling, "current");
      }
    } else {
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
      if (isFirstLetter && currentWord.previousElementSibling) {
        const prevWord = currentWord.previousElementSibling;
        const hasIncorrectLetter = Array.from(prevWord.children).some(
          (letter) => letter.classList.contains("incorrect")
        );
        const extraLetter = Array.from(prevWord.children).some((letter) =>
          letter.classList.contains("extra")
        );
        const isHiddenWord = prevWord.classList.contains("hidden");
        if (!extraLetter && hasIncorrectLetter && !isHiddenWord) {
          removeClass(currentWord, "current");
          removeClass(currentLetter, "current");
          addClass(prevWord, "current");
          const lastLetterOfPreviousWord = prevWord.lastElementChild;
          if (lastLetterOfPreviousWord) {
            addClass(lastLetterOfPreviousWord, "current");
            removeClass(lastLetterOfPreviousWord, "correct");
            removeClass(lastLetterOfPreviousWord, "incorrect");
          }
        } else if (!hasIncorrectLetter && !isHiddenWord) {
          const prevLetterW = prevWord.lastElementChild;
          removeClass(prevLetterW, "current");
          removeClass(prevWord, "current");
          // } else if (isHiddenWord) {
          //   const prevLetterW = prevWord.lastElementChild;
          //   removeClass(prevLetterW, "current");
          //   removeClass(prevWord, "current");
        } else if (isHiddenWord) {
          const prevLetterW = prevWord.lastElementChild;
          removeClass(prevLetterW, "current");
          removeClass(prevWord, "current");
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

const startTimer = function () {
  window.timer = function () {
    if (!window.gameStart) {
      window.gameStart = new Date().getTime();
    }
    const currentTime = new Date().getTime();
    const msPassed = currentTime - window.gameStart;
    const sPassed = Math.round(msPassed / 1000);
    const sLeft = gameTime / 1000 - sPassed;
    if (sLeft <= 0) {
      gameOver();
      return;
    }
    document.getElementById("info").innerHTML = sLeft + " ";
  };
  window.timer();
  const timer = setInterval(window.timer, 1000);
  return timer;
};
function updateCursorPositioning() {
  const cursor = document.getElementById("cursor");
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");

  const targetElement = nextLetter || nextWord;
  if (targetElement) {
    cursor.style.top = targetElement.offsetTop + 6 + "px";
    if (nextLetter) {
      cursor.style.left = targetElement.offsetLeft + "px";
    } else if (nextWord) {
      cursor.style.left =
        targetElement.offsetLeft + targetElement.offsetWidth + "px";
    }
  }
  const cursorTop = cursor.offsetTop;
  // console.log(cursorTop, requiredLength
  // if ((nextLetter || nextWord).offsetTop > cursorTop+7 && cursorTop-7 >= requiredLength) {
  //   console.log("line changed")s
  // }
}

let lineHeight;
let requiredLength;

function removeFirstLine() {
  const containerTop = document
    .getElementById("words")
    .getBoundingClientRect().top;
  const wordsList = document.querySelectorAll(".word");
  // console.log(wordsList);
  for (const word of wordsList) {
    word.topValue = word.getBoundingClientRect().top - containerTop;
  }
  for (const word of wordsList) {
    if (word.topValue < 35) {
      addClass(word, "hidden");
    }
  }
  // document.querySelectorAll('.word').forEach((word) => {
  // })
}

function updateScroll() {
  const currentWord = document.querySelector(".word.current");
  const currentTop = currentWord.offsetTop;
  if (!lineHeight) {
    lineHeight = parseFloat(window.getComputedStyle(currentWord).lineHeight);
  }

  if (currentTop > requiredLength) {
    removeFirstLine();
    // word.style.marginTop = margin - lineHeight + "px";
    updateCursorPositioning();
  }
}

newGame();
// Scroll function
requiredLength = word.offsetTop + 70;

updateCursorPositioning();
window.addEventListener("resize", () => {
  requiredLength = word.offsetTop + 70;
  updateCursorPositioning();
});
window.addEventListener("resize", updateScroll);
