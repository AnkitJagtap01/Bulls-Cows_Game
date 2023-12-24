let secretNumber = generateSecretNumber();
let attempts = 0;
let timer, startTime;
let timerRunning = false;
let previousGuesses = new Set(); // Store previous guesses

function enableGameControls(enable) {
    document.getElementById("pause-button").disabled = !enable;
    document.getElementById("resume-button").disabled = true; // Always keep resume disabled initially
    document.getElementById("pass-button").disabled = !enable;
    document.getElementById("guess-button").disabled = !enable;
    document.querySelectorAll(".guess-input").forEach(input => input.disabled = !enable);
}

function generateSecretNumber() {
    let digits = [];
    while (digits.length < 4) {
        let newDigit = Math.floor(Math.random() * 10);
        if (!digits.includes(newDigit)) {
            digits.push(newDigit);
        }
    }
    console.log("Secret Number:", digits.join("")); // For debugging
    return digits.join("");
}

function startGame() {
    if (!timerRunning) {
        enableGameControls(true);
        startTime = new Date();
        timer = setInterval(updateTime, 1000);
        timerRunning = true;
        document.getElementById("start-button").disabled = true;
    }
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
    document.getElementById("resume-button").disabled = false;
    setGuessingEnabled(false); // Disable guessing when the game is paused
}

function resumeTimer() {
    if (!timerRunning) {
        startTime = new Date() - (new Date() - startTime); // Adjust start time
        timer = setInterval(updateTime, 1000);
        timerRunning = true;
        document.getElementById("resume-button").disabled = true;
        setGuessingEnabled(true); // Enable guessing when the game is resumed
    }
}

function setGuessingEnabled(enabled) {
    document.getElementById("guess-button").disabled = !enabled;
    document.querySelectorAll(".guess-input").forEach(input => input.disabled = !enabled);
}

function passGame() {
    clearInterval(timer);
    alert("The number was " + secretNumber);
    resetGame();
}

function resetGame() {
    // Reset the game state
    secretNumber = generateSecretNumber(); // Generate a new secret number
    previousGuesses.clear(); // Clear previous guesses
    attempts = 0;
    document.getElementById("attempts-made").innerText = "Attempts: 0";
    document.getElementById("history").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("time-taken").innerText = "Time: 00:00";
    timerRunning = false;

    // Reset input fields and disable controls
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`guess${i}`).value = '';
    }
    enableGameControls(false);

    // Enable start button for a new game
    document.getElementById("start-button").disabled = false;
}

function updateTime() {
    let currentTime = new Date();
    let timeDiff = currentTime - startTime;
    let seconds = Math.floor(timeDiff / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    document.getElementById("time-taken").innerText = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateHistory(guess, bulls, cows) {
    let historyElement = document.getElementById("history");
    let newEntry = document.createElement("div");
    newEntry.innerText = `Guess: ${guess} - Bulls: ${bulls}, Cows: ${cows}`;
    historyElement.prepend(newEntry);
}

function checkGuess() {
    let guess = '';
    for (let i = 1; i <= 4; i++) {
        guess += document.getElementById(`guess${i}`).value;
    }

    if (guess.length !== 4 || new Set(guess).size !== 4) {
        alert("Enter a 4-digit number with unique digits.");
        return;
    }

    // Prevent repeating the same guess
    if (previousGuesses.has(guess)) {
        alert("You have already guessed this number. Try a different number.");
        return;
    }
    previousGuesses.add(guess);

    let bulls = 0, cows = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretNumber[i]) {
            bulls++;
        } else if (secretNumber.includes(guess[i])) {
            cows++;
        }
    }

    attempts++;
    document.getElementById("attempts-made").innerText = `Attempts: ${attempts}`;
    document.getElementById("result").innerText = `Guess: ${guess} - Bulls: ${bulls}, Cows: ${cows}`;

    updateHistory(guess, bulls, cows);

    if (bulls === 4) {
        clearInterval(timer);
        alert("Congratulations! You've guessed the right number!");
        resetGame();
    }
}

window.onload = () => {
    enableGameControls(false); // Disable game controls initially
    setGuessingEnabled(false); // Also disable guessing initially
};