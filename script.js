let secretNumber = generateSecretNumber();
let attempts = 0;
let timer, timeRemaining = 10 * 60; // 10 minutes in seconds
let timerRunning = false;
let previousGuesses = new Set();
let highScores = [];
let playerName = '';
let currentPlayerHistory = [];

function generateSecretNumber() {
    let digits = [];
    while (digits.length < 4) {
        let newDigit = Math.floor(Math.random() * 10);
        if (!digits.includes(newDigit)) {
            digits.push(newDigit);
        }
    }
    return digits.join("");
}

function startGame() {
    enableGameControls(true);
    document.getElementById("start-button").disabled = true;
    document.getElementById("pass-button").disabled = false;
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
    timerRunning = true;
}

function updateTimer() {
    if (timeRemaining <= 0) {
        clearInterval(timer);
        alert("Time's up! The number was " + secretNumber);
        resetGame();
        return;
    }

    timeRemaining--;
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    document.getElementById("time-remaining").innerText = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
    setGameInteractions(false);
    document.getElementById("resume-button").disabled = false;
}

function resumeTimer() {
    if (!timerRunning) {
        startTime = new Date() - (new Date() - startTime);
        timer = setInterval(updateTimer, 1000);
        timerRunning = true;
        setGameInteractions(true);
        document.getElementById("resume-button").disabled = true;
    }
}

function passGame() {
    clearInterval(timer);
    let finalScore = calculateScore();
    updateHighScores(finalScore);
    alert("The number was " + secretNumber + ". Your score: " + finalScore);
    resetGame();
}

function resetGame() {
    secretNumber = generateSecretNumber();
    previousGuesses.clear();
    attempts = 0;
    timeRemaining = 10 * 60; // Reset the timer
    timerRunning = false;
    document.getElementById("time-remaining").innerText = "Time Remaining: 10:00";
    document.getElementById("attempts-made").innerText = "Attempts: 0";
    document.getElementById("current-score").innerText = "Score: 0";
    enableGameControls(false);
    document.getElementById("start-button").disabled = false;
    document.getElementById("player-name").disabled = false;
}

function enableGameControls(enable) {
    document.getElementById("pause-button").disabled = !enable;
    document.getElementById("pass-button").disabled = !enable;
    setGameInteractions(enable);
}

function setGameInteractions(enabled) {
    document.getElementById("guess-button").disabled = !enabled;
    document.querySelectorAll(".guess-input").forEach(input => input.disabled = !enabled);
    document.getElementById("notes").disabled = !enabled;
}

function calculateScore() {
    return attempts === 0 ? 0 : Math.round(100 / attempts);
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
    document.getElementById("current-score").innerText = `Score: ${calculateScore()}`;

    updateHistory(guess, bulls, cows);

    if (bulls === 4) {
        clearInterval(timer);
        let finalScore = calculateScore();
        alert("Congratulations! You've guessed the right number! Your score: " + finalScore);
        updateHighScores(finalScore);
        resetGame();
    }
}

function updateHistory(guess, bulls, cows) {
    currentPlayerHistory.push({ guess, bulls, cows });
    displayCurrentPlayerHistory();
}

function displayCurrentPlayerHistory() {
    let historyElement = document.getElementById("history");
    historyElement.innerHTML = "<h3>Current Player History</h3>";
    currentPlayerHistory.forEach(entry => {
        historyElement.innerHTML += `<div>${entry.guess}: Bulls - ${entry.bulls}, Cows - ${entry.cows}</div>`;
    });
}

function submitName() {
    let newName = document.getElementById("player-name").value;
    if (newName.trim() === '') {
        alert("Please enter a name.");
        return;
    }

    if (playerName !== newName) {
        playerName = newName;
        currentPlayerHistory = [];
        displayCurrentPlayerHistory();
    }

    alert("Name submitted successfully!");
    document.getElementById("player-name").disabled = true;
}

function updateHighScores(finalScore) {
    let highScoreEntry = {
        name: playerName || "Anonymous",
        score: finalScore,
        time: formatTime(10 * 60 - timeRemaining),
        attempts: attempts
    };

    highScores.push(highScoreEntry);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);

    displayHighScores();
}

function displayHighScores() {
    let highScoresElement = document.getElementById("high-scores");
    highScoresElement.innerHTML = "<h3>High Scores</h3>";
    highScores.forEach(entry => {
        highScoresElement.innerHTML += `<div>${entry.name}: Score - ${entry.score}, Time - ${entry.time}, Attempts - ${entry.attempts}</div>`;
    });
}

function formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

window.onload = () => {
    enableGameControls(false);
    setGameInteractions(false);
};
