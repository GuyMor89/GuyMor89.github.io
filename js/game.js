'use strict'


var gBoard
var haveMinesBeenPlaced = false
var gMineCounterDOM = document.querySelector('.mine-counter span')
var gSmileyDOM = document.querySelector('.smiley')
var gCheckedCells = []
var gTimerInterval
var amountOfFlags
var isGameOn = true
var isDead = false
var hasTimerBeenStarted = false
var livesLeft = 3

const MINE = '<img src="img/mine.png"></img>'
const FLAG = '<img src="img/flag.png"></img>'
var boardRows = 7
var boardCols = 8
var amountOfMines

function onInit() {

    amountOfMines = Math.round((boardRows * boardCols) * 0.15)

    gBoard = createBoard()
    renderBoard(gBoard)
    adjustBoardWidth()

    isGameOn = true
    isDead = false
    amountOfFlags = amountOfMines

    livesLeft = 3
    lifeCounter()

    gSmileyDOM.innerHTML = '<img src="img/happy.png"></img>'

    gMineCounterDOM.innerText = amountOfFlags.toString().padStart(3, '0')
    haveMinesBeenPlaced = false
    gCheckedCells.length = 0

    hasTimerBeenStarted = false
    stopTimer()
}

function changeBoardSize() {
    boardRows = submitRows()
    boardCols = submitCols()
    onInit()
}

function lifeCounter() {

    var strHTML = ''
    var life = '<img src="img/grin.png"></img>'
    var lifeLost = '<img src="img/frown.png"></img>'

    for (let i = 0; i < 3; i++) {
        if (i < livesLeft) {
            strHTML += ' '
            strHTML += life
        } else {
            strHTML += ' '
            strHTML += lifeLost
        }
    }

    var lifeCounterBox = document.querySelector('.life-counter-box')

    lifeCounterBox.innerHTML = strHTML

}

function createBoard() {
    var board = []

    for (let i = 0; i < boardRows; i++) {
        board[i] = []
        for (let j = 0; j < boardCols; j++) {
            board[i][j] = {
                minesAroundCell: 0,
                isShown: false,
                isMine: false,
                isFlagged: false
            }
        }
    }

    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (let i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (let j = 0; j < board[i].length; j++) {

            const title = `Cell: ${i}, ${j}`

            strHTML += `<td title="${title}" data-i="${i}" data-j="${j}" class="cell" onclick="cellClicked(this, event)"></td>`
        }
        strHTML += `</tr>`

        const elBoard = document.querySelector('.board')
        elBoard.innerHTML = strHTML
    }
}

function adjustBoardWidth() {
    var elBoardBorder = document.querySelector('.board-border')
    var elDashboard1 = document.querySelector('.dashboard')
    var elDashboard2 = document.querySelector('.dashboard2')

    elBoardBorder.style.width = `${boardCols * 50 + 40}px`
    elDashboard1.style.width = `${boardCols * 50 + 40}px`
    elDashboard2.style.width = `${boardCols * 50 + 40}px`

}

var cellContent = ''

function cellClicked(elCell, event) {

    if (!isGameOn) return

    var i = +elCell.dataset.i
    var j = +elCell.dataset.j

    var cell = { i, j }

    if (!hasTimerBeenStarted) startTimer()
    hasTimerBeenStarted = true

    if (event.ctrlKey && event.button === 0 && !gBoard[cell.i][cell.j].isShown) {
        if (!gBoard[i][j].isFlagged) cellContent = elCell.innerHTML
        if (gBoard[i][j].isFlagged) {
            gBoard[i][j].isFlagged = false
            elCell.innerHTML = cellContent

            if (amountOfFlags >= 0) amountOfFlags += 1
            gMineCounterDOM.innerText = amountOfFlags.toString().padStart(3, '0')

        } else if (amountOfFlags > 0) {
            gBoard[i][j].isFlagged = true
            elCell.innerHTML = FLAG

            if (amountOfFlags > 0) amountOfFlags -= 1
            gMineCounterDOM.innerText = amountOfFlags.toString().padStart(3, '0')
        }
    } else if (!gBoard[i][j].isMine) {

        elCell.classList.add('shown')
        gBoard[i][j].isShown = true

        if (!haveMinesBeenPlaced) placeMines(elCell)

        showCells(cell)

        elCell.innerHTML = gBoard[i][j].minesAroundCell
        colorCells(elCell)

    } else if (gBoard[i][j].isMine && livesLeft > 0 && !gBoard[i][j].isShown) {
        livesLeft--
        lifeCounter()
        elCell.innerHTML = MINE
        gBoard[cell.i][cell.j].isShown = true
        document.querySelector(`td[data-i="${cell.i}"][data-j="${cell.j}"]`).classList.add('explode')

    } else if (livesLeft === 0) {
        console.log('Game Over');
        revealMines(cell)
        isDead = true
        isGameOn = false
        clearInterval(gTimerInterval)
    }

    if (youWin()) {
        console.log('You win')
        isGameOn = false
        clearInterval(gTimerInterval)
    }

    changeSmiley(cell)

}

function placeMines(elCell) {

    var i = +elCell.dataset.i
    var j = +elCell.dataset.j

    var cell = { i, j }

    findEmptyCells(cell)
    findCellsToPlaceMines(elCell)
    findMinesOnMap(cell)

    haveMinesBeenPlaced = true

}


var gCheckedCells = []

function showCells(cell) {

    var X = cell.i
    var Y = cell.j

    if (gCheckedCells.some(cell => cell.i === X && cell.j === Y)) {
        return
    }

    gCheckedCells.push({ i: X, j: Y });

    if (gBoard[cell.i][cell.j].minesAroundCell === 0) {
        for (let i = (X - 1); i <= (X + 1); i++) {
            if (i >= 0 && i < gBoard.length) {
                for (let j = Y - 1; j <= Y + 1; j++) {
                    if (j >= 0 && j < gBoard[i].length) {
                        if (!gBoard[i][j].isMine) {

                            var curCellDOM = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
                            gBoard[i][j].isShown = true
                            curCellDOM.classList.add('shown')

                            showCells({ i, j });

                            curCellDOM.innerHTML = gBoard[i][j].minesAroundCell
                            colorCells(curCellDOM)
                        }
                    }
                }
            }
        }
    }
    return
}


function colorCells(elCell) {
    if (elCell.innerHTML === '0') elCell.style.color = '#c0c0c0'
    if (elCell.innerHTML === '1') elCell.style.color = 'blue'
    if (elCell.innerHTML === '2') elCell.style.color = 'green'
    if (elCell.innerHTML === '3') elCell.style.color = 'red'
}


function changeSmiley() {

    if (isDead) {
        gSmileyDOM.innerHTML = '<img src="img/dead.png"></img>'
        return
    }
    else if (youWin()) {
        gSmileyDOM.innerHTML = '<img src="img/cool.png"></img>'
        return
    } else if ((gSmileyDOM.innerHTML = '<img src="img/happy.png"></img>')) {
        gSmileyDOM.innerHTML = '<img src="img/excited.png"></img>'
        setTimeout(() => {
            gSmileyDOM.innerHTML = '<img src="img/happy.png"></img>'
        }, 300);
    } else {
        gSmileyDOM.innerHTML = '<img src="img/happy.png"></img>'
    }
}


function youWin() {
    var flaggedMines = 0
    var shownCells = 0
    var youWin = false

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isFlagged) flaggedMines++
            if (gBoard[i][j].isShown) shownCells++
        }
    }
    if (flaggedMines === amountOfMines &&
        shownCells === ((boardRows * boardCols) - amountOfMines)) youWin = true

    return youWin
}


// function gameOver(cell) {

//     var gameIsOver = false

//     if (gBoard[cell.i][cell.j].isMine &&
//         !gBoard[cell.i][cell.j].isFlagged &&
//         livesLeft === 0) gameIsOver = true

//     return gameIsOver
// }


var cellsWithMinesModel = []

function revealMines(cell) {

    cellsWithMinesModel.length = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) cellsWithMinesModel.push({ i, j })
        }
    }

    for (let i = 0; i < cellsWithMinesModel.length; i++) {
        var cellsWithMinesDOM = document.querySelector(`td[data-i="${cellsWithMinesModel[i].i}"][data-j="${cellsWithMinesModel[i].j}"]`)
        cellsWithMinesDOM.innerHTML = MINE
    }

    document.querySelector(`td[data-i="${cell.i}"][data-j="${cell.j}"]`).classList.add('explode')


}