let secretNumber = generateSecretNumber();
let attempts = 0;

function generateSecretNumber() {
    let digits = new Set();
    while (digits.size < 4) {
        digits.add(Math.floor(Math.random() * 10));
    }
    return Array.from(digits).join('');
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

    if (bulls === 4) {
        alert("Congratulations! You've guessed the right number!");
        secretNumber = generateSecretNumber();
        attempts = 0;
    }
}

document.getElementById('guess').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});
