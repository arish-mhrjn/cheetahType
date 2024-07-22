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

  console.log({ key, expected });
  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, "current");
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
});

//moving cursor
const cursor = document.getElementById(".cursor");
const nextLetter = document.querySelector(".letter.current");
console.log(nextLetter.getBoundingClientRect().top);
if (nextLetter) {
  cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + "px";
  cursor.style.left = nextLetter.getBoundingClientRect().left + 2 + "px";
}

newGame();
