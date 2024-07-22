"use strict";

//query selectors
let word = document.getElementById("words");
const game = document.getElementById("game");
const words =
  "land came much that want light never the did red end sometimes said set found here got red at next in live light much air near river ask miss still every into in cut place where state until been our take ask while man oil saw hand part tell same large the little song paper about below fall seem turn play far man seem back must food all large out again war is letter one what thing paper day sea great world were run make write turn me to back".split(
    " "
  );

const wordsCount = words.length;

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
}

game.addEventListener("keyup", (ev) => {
  ev.preventDefault();
  const key = ev.key;
  const currentLetter = document.querySelector(".letter.current");
  const currentWord = document.querySelector(".word.current");
  const expected = currentLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackspace = "Backspace";
  const isFirstLetter = currentLetter === currentWord.firstElementChild;
  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextElementSibling != null) {
        addClass(currentLetter.nextSibling, "current");
      } else {
      }
    } else {
      console.dir(currentWord);
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      currentWord.innerHTML = currentWord.innerHTML.trim();
      currentWord.appendChild(incorrectLetter);
      // const incorrectLetter = `<span class="letter incorrect extra">${key}</span>`;
      // currentWord.innerHTML = currentWord.innerHTML.trim() + incorrectLetter;
    }
  }

  if (isSpace) {
    if (expected !== " ") {
      const lettersToInvalidate = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ];

      lettersToInvalidate.forEach((letter) => {
        addClass(letter, "incorrect");
      });

      removeClass(currentWord, "current");
      if (currentLetter) {
        removeClass(currentLetter, "current");
      }
      const nextWord = currentWord.nextElementSibling;
      if (nextWord) {
        addClass(nextWord, "current");
        const firstLetterOfNextWord = nextWord.querySelector(".letter");
        if (firstLetterOfNextWord) {
          addClass(firstLetterOfNextWord, "current");
        }
      }
    } else {
      removeClass(currentWord, "current");
      if (currentLetter) {
        removeClass(currentLetter, "current");
      }
      const nextWord = currentWord.nextElementSibling;
      if (nextWord) {
        addClass(nextWord, "current");
        const firstLetterOfNextWord = nextWord.querySelector(".letter");
        if (firstLetterOfNextWord) {
          addClass(firstLetterOfNextWord, "current");
        }
      }
    }
  }

  //backspace
  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      //make previous word current & last letter current
      removeClass(currentWord, "current");
      addClass(currentWord.previousElementSibling, "current");
    }
  }

  //moving cursor
  const cursor = document.getElementById("cursor");
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top + 6 + "px";
  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] + "px";
});

newGame();
