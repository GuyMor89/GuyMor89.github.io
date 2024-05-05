function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

  // Function to start the timer
  function startTimer() {
    let startTime = Date.now();
    gTimerInterval = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let seconds = Math.floor(elapsedTime / 1000);
      document.querySelector('.timer span').innerText = seconds.toString().padStart(3, '0')
    }, 1000); // Update every millisecond
  }

  function stopTimer() {
    clearInterval(gTimerInterval)
    document.querySelector('.timer span').innerText = '000'
  }
