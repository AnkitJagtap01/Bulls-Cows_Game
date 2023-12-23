let secretNumber = generateSecretNumber();
let attempts = 0;

function generateSecretNumber() {
    let digits = [];
    while (digits.length < 4) {
        let newDigit = Math.floor(Math.random() * 10);
        if (!digits.includes(newDigit)) {
            digits.push(newDigit);
        }
    }
    return digits.join('');
}

function updateHistory(guess, bulls, cows) {
    let historyElement = document.getElementById('history');
    let newEntry = document.createElement("div");
    newEntry.innerText = `Guess: ${guess} - Bulls: ${bulls}, Cows: ${cows}`;
    historyElement.prepend(newEntry);
}

function checkGuess() {
    let guess = document.getElementById('guess').value;
    if (guess.length !== 4 || new Set(guess).size !== 4) {
        alert("Enter a 4-digit number with unique digits.");
        return;
    }

    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretNumber[i]) {
            bulls++;
        } else if (secretNumber.includes(guess[i])) {
            cows++;
        }
    }

    attempts++;
    document.getElementById('result').innerText = `Guess: ${guess}\nBulls: ${bulls}, Cows: ${cows}\nAttempts: ${attempts}`;

    updateHistory(guess, bulls, cows);

    if (bulls === 4) {
        alert("Congratulations! You've guessed the right number!");
        secretNumber = generateSecretNumber();
        attempts = 0;
        document.getElementById('history').innerHTML = '';
    }
}

document.getElementById('guess').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});
