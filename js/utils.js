'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor(elapsedTime / 1000);
        document.querySelector('.timer span').innerText = seconds.toString().padStart(3, '0')
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval)
    document.querySelector('.timer span').innerText = '000'
}

