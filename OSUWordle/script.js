import { WORDS } from "./words.js";
import { OSUWORDS } from "./osu-words.js";
import { WORDS6 } from "./words6.js";
import { WORDS7 } from "./words7.js";

// Aquire Date for Index
function getDaysForIndex(startDate, todaysDate) {
    const start = new Date(startDate);
    const today = new Date(todaysDate);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = today.getTime() - start.getTime();
    const diffDays = Math.round(diffInTime / oneDay);
    
    return diffDays;
}
var today = new Date();
var day = String(today.getDate()).padStart(2, '0');
var month = String(today.getMonth()).padStart(2, '0');
var year = today.getFullYear();
today = month + '/' + day + '/' + year;
console.log(getDaysForIndex("08/20/2022", today))

//Local Storage Variables
let currentWordIndex = getDaysForIndex("08/20/2022", today);
let currentWord = OSUWORDS[2]

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
// Picks a random word from the OSU-WORDS array
let rightGuessString = currentWord
let lengthOfCorrectWord = rightGuessString.length
document.getElementById("length").innerHTML = lengthOfCorrectWord
//toastr.info(`${rightGuessString}`)

initBoard();

console.log(rightGuessString)

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < lengthOfCorrectWord; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === '#216b02') {
                return
            } 

            if (oldColor === '#8c8600' && color !== '#216b02') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }
    //toastr.info(`${guessString}`)

    if (guessString.length != lengthOfCorrectWord) {
        Swal.fire({
          title: 'Not Enough Letters',
          text: `TYPE MORE! 😡`,
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
        return
    }

    if (!(WORDS.includes(guessString) || OSUWORDS.includes(guessString) || WORDS6.includes(guessString) || WORDS7.includes(guessString))) {
        Swal.fire({
          title: 'What?!',
          text: `There's like 300,000 words, I guess I don't know that one. 😬`,
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
        return
    }

    
    for (let i = 0; i < lengthOfCorrectWord; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = '#2b2b2b'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade #216b02 
                letterColor = '#216b02'
            } else {
                // shade box #8c8600
                letterColor = '#8c8600'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        Swal.fire({
          title: 'Congrats!',
          html: `Today's word is <b style="text-transform:uppercase">${rightGuessString}</b>... and ❌ichigan still sucks.`,
          icon: 'success',
          confirmButtonText: 'Close'
        })
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
          Swal.fire({
          title: 'Game Over!',
          html: `Today's word was <b style="text-transform:uppercase">${rightGuessString}</b>... but it's okay, ❌ichigan still sucks.`,
          icon: 'error',
        })
        }
    }
}

function insertLetter (pressedKey) {
    if (nextLetter === lengthOfCorrectWord) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "⌫") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})
