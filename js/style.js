'use strict'


function adjustBoardWidth() {
    var elBoardBorder = document.querySelector('.board-border')
    var elDashboard = document.querySelector('.dashboard')

    elBoardBorder.style.width = `${setBoardSize.cols * 50 + 40}px`
    elDashboard.style.width = `${setBoardSize.cols * 50 + 40}px`
}

function changeBoardSize() {
    var rowValue = document.querySelector('.number-box.row').value;
    var colValue = document.querySelector('.number-box.col').value;

    if (rowValue > 3) setBoardSize.rows = rowValue
    if (colValue > 3) setBoardSize.cols = colValue

    onInit()
}


function clickSmileys(elImg) {
    elImg.src = 'img/happy.png'
    setTimeout(() => {
        elImg.src = 'img/grin.png'
    }, 300);
}

function clickBulb(elImg) {
    if (haveMinesBeenPlaced) {
        elImg.src = 'img/bulbOff.png'
        setTimeout(() => {
            elImg.src = 'img/bulbOn.png'
        }, 300);
    }
}

var flash = null

function clickFlagBox(elBox) {

    var span = elBox.querySelector('span')

    if (flash !== null) {
        clearInterval(flash)
        flash = null
        span.innerText = amountOfFlags.toString().padStart(3, '0')
    } else flash = setInterval(() => {
        span.innerText = span.innerText === '777' ? '' : '777';
    }, 600);

}

function resetFlagsAndSmiley() {
    document.querySelector('.mine-counter span').innerText = amountOfFlags.toString().padStart(3, '0')
    document.querySelector('.smiley').innerHTML = '<img src="img/happy.png"></img>'
}


function changeSmiley(ModelCell) {

    var smileyDom = document.querySelector('.smiley')

    if (youWin()) {
        smileyDom.innerHTML = '<img src="img/cool.png"></img>'
        return
    } else if (!isGameOn) {
        smileyDom.innerHTML = '<img src="img/dead.png"></img>'
        return
    } else if (gBoard[ModelCell.i][ModelCell.j].isMine &&
        livesLeft > 0 &&
        gBoard[ModelCell.i][ModelCell.j].isShown) {
        smileyDom.innerHTML = '<img src="img/dead.png"></img>'
        setTimeout(() => {
            smileyDom.innerHTML = '<img src="img/happy.png"></img>'
        }, 300);
    } else if ((smileyDom.innerHTML = '<img src="img/happy.png"></img>')) {
        smileyDom.innerHTML = '<img src="img/excited.png"></img>'
        setTimeout(() => {
            smileyDom.innerHTML = '<img src="img/happy.png"></img>'
        }, 300);
    } else {
        smileyDom.innerHTML = '<img src="img/happy.png"></img>'
    }
}

function colorCells(DOMCell) {
    if (DOMCell.innerHTML === '0') DOMCell.style.color = '#c0c0c0'
    if (DOMCell.innerHTML === '1') DOMCell.style.color = 'blue'
    if (DOMCell.innerHTML === '2') DOMCell.style.color = 'green'
    if (DOMCell.innerHTML === '3') DOMCell.style.color = 'red'
    if (DOMCell.innerHTML === '4') DOMCell.style.color = 'darkblue'
    if (DOMCell.innerHTML === '5') DOMCell.style.color = 'brown'
    if (DOMCell.innerHTML === '6') DOMCell.style.color = 'cyan'
    if (DOMCell.innerHTML === '7') DOMCell.style.color = 'black'
    if (DOMCell.innerHTML === '8') DOMCell.style.color = 'grey'
}