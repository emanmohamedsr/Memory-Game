window.addEventListener("load", () => {
  console.log("Window loaded");
  createInitialCards();
});

let startButton = document.querySelector(".start-button");
let startTheGame = false;

startButton.addEventListener("click", StartHandler);
function StartHandler() {
  startTheGame = !startTheGame;
  if (startTheGame) {
    console.log("Game started");
    startTimer();
    startButton.textContent = "Stop";
    startButton.classList.add("stop-button");
    startButton.classList.remove("start-button");
    startButton.classList.remove("reset-button");
  } else {
    console.log("Game stopped");
    stopTimer();
    startButton.textContent = "Start";
    startButton.classList.add("start-button");
    startButton.classList.remove("stop-button");
    startButton.classList.remove("reset-button");
  }
}

const totalTime = 180;
let timerInterval,
  remainingTime = totalTime; 
  let timerElement = document.querySelector(".timer span");
  
function formatTime(seconds) {
  return `${Math.floor(seconds / 60) >= 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60)}:${seconds % 60 >= 10 ? seconds % 60 : '0' + (seconds % 60)}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime < 0) {
      stopTimer();
      timeIsUpMessage();
      resetGame();
      return;
    }
    timerElement.textContent = formatTime(remainingTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetGame() {
  startTheGame = false;
  nActiveCards = 0;
  nSameCards = 0;
  activeCards = [];
  wrongTriesCount = 0;
  wrongTries.textContent = wrongTriesCount;
  remainingTime = totalTime;
  timerElement.textContent = formatTime(remainingTime);
  startButton.textContent = "Reset";
  startButton.classList.add("reset-button");
  startButton.classList.remove("start-button");
  startButton.classList.remove("stop-button");
  clearBoard(); 
}

function clearBoard() {
  const cardsSection = document.querySelector(".cards");
  cardsSection.innerHTML = "";
  createInitialCards();
}

let cover = "/Assets/cover.png";
let images = [
  "/Assets/image_0.png",
  "/Assets/image_1.png",
  "/Assets/image_2.png",
  "/Assets/image_3.png",
  "/Assets/image_4.png",
  "/Assets/image_5.png",
  "/Assets/image_6.png",
  "/Assets/image_7.png",
];

function shuffleImages() {
  let tempImages = images.concat(images);
  const size = tempImages.length;
  let shuffledArray = [];
  for (let i = 0; i < size; i++) {
    let randomIndex = Math.floor(Math.random() * tempImages.length);
    shuffledArray.push(tempImages[randomIndex]);
    tempImages.splice(randomIndex, 1);
  }
  return shuffledArray;
}

function createInitialCards() {
  let shuffledImages = shuffleImages();
  let cardsSection = document.querySelector(".cards");
  for (let i = 0; i < shuffledImages.length; i++) {
    let card = document.createElement("div");
    card.classList.add("card");

    let front = document.createElement("img");
    front.classList.add("face", "front");
    front.src = cover;
    front.alt = "front image";
    card.appendChild(front);

    let back = document.createElement("img");
    back.classList.add("face", "back");
    back.src = shuffledImages[i];
    back.alt = "back image";
    card.appendChild(back);

    card.addEventListener("click", activationHandler);
    cardsSection.appendChild(card);
  }
}

let nActiveCards = 0;
let nSameCards = 0;
let activeCards = [];
let isChecking = false;
let wrongTriesCount = 0;
let wrongTries = document.querySelector(".wrong-tries span");

function activationHandler(event) {
  if (isChecking || !startTheGame) return;

  activeCards[nActiveCards++] = event.currentTarget;
  event.currentTarget.classList.add("active");

  if (nActiveCards === 2) {
    isChecking = true;

    setTimeout(() => {
      let firstActiveCardBackImageSrc =
        activeCards[0].querySelector(".back").src;
      let secondActiveCardBackImageSrc =
        activeCards[1].querySelector(".back").src;

      if (firstActiveCardBackImageSrc === secondActiveCardBackImageSrc) {
        nSameCards++;
        activeCards.forEach((card) => {
          card.classList.remove("active");
          card.classList.add("same");
          card.removeEventListener("click", activationHandler);
        });
        if (nSameCards === images.length) {
          winMessage();
          stopTimer();
          resetGame();
        }
      } else {
        wrongTriesCount++;
        wrongTries.textContent = wrongTriesCount;
        activeCards.forEach((card) => card.classList.remove("active"));
      }
      activeCards = [];
      nActiveCards = 0;
      isChecking = false;
    }, 800);
  }
}

function timeIsUpMessage() {
  Swal.fire({
    title: "Time's up!",
    width: 600,
    padding: "1em",
    color: "#b47474",
    background: "#fff",
    backdrop: `
            rgb(0,0,0,0.5)
            url("../Assets/bunny-sad.gif")
            right bottom
            no-repeat
            `,
    confirmButtonColor: "#b47474",
  });
}

function winMessage() {
  Swal.fire({
    title: "Congratulations! You've won!",
    width: 600,
    padding: "1em",
    color: "#b47474",
    background: "#fff",
    backdrop: `
            rgb(0,0,0,0.5)
            url("../Assets/bunny-dance.gif")
            right bottom
            no-repeat
            `,
    confirmButtonColor: "#b47474",
  });
}
