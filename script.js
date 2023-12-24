let secretNumber = generateSecretNumber();
let attempts = 0;
let timer, startTime;
let timerRunning = false;

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
        startTime = new Date();
        timer = setInterval(updateTime, 1000);
        timerRunning = true;
        document.getElementById("resume-button").disabled = true;
    }
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
    document.getElementById("resume-button").disabled = false;
}

function resumeTimer() {
    if (!timerRunning) {
        startTime = new Date() - (new Date() - startTime); // Adjust start time
        timer = setInterval(updateTime, 1000);
        timerRunning = true;
        document.getElementById("resume-button").disabled = true;
    }
}

function passGame() {
    clearInterval(timer);
    alert("The number was " + secretNumber);
    secretNumber = generateSecretNumber(); // Start a new game
    document.getElementById("history").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    attempts = 0;
    document.getElementById("attempts-made").innerText = "Attempts: 0";
    // Reset timer display
    document.getElementById("time-taken").innerText = "Time: 00:00";
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
        alert("Congratulations! You've guessed the right number!");
        passGame(); // End the game and show the secret number
    }
}
