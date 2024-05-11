'use strict'


var gBoard

var timerInterval
var amountOfFlags = 0
var amountOfMines = 0

var isGameOn = true
var haveMinesBeenPlaced = false
var hasTimerBeenStarted = false
var isExterminatorOn = false
var isHintOn = false
var isMegaHintOn = false
var manuelMode = false
var darkMode = false
var scoreIconOn = false
var hintsLeft = 3
var megaHintsLeft = 1
var exterminationsLeft = 1
var livesLeft = 3
var safeClicks = 3

const MINE = '<img src="img/mine.png"></img>'
const FLAG = '<img src="img/flag.png"></img>'
const setBoardSize = {
    rows: 6,
    cols: 11
}

function onInit() {

    gBoard = createBoard()
    renderBoard(gBoard)
    adjustBoardWidth()

    isGameOn = true
    haveMinesBeenPlaced = false

    manuelMode = false
    manuelModeDOM.innerHTML = `<img src="img/manuel.png">`

    isMegaHintOn = false
    megaHintButton.innerHTML = `<img src="img/mega.png">`
    megaStartAndEndArray.length = 0
    megaArray.length = 0

    CheckedCells.length = 0

    livesLeft = hintsLeft = safeClicks = 3
    megaHintsLeft = 1
    setCounter('life')
    setCounter('hint')
    setCounter('safeClick')

    resetSmiley()
    resetFlags()

    hasTimerBeenStarted = false
    stopTimer()
    clickCounter = 0
}

function createBoard() {
    var board = []

    for (let i = 0; i < setBoardSize.rows; i++) {
        board[i] = []
        for (let j = 0; j < setBoardSize.cols; j++) {
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

            const title = `ModelCell: ${i}, ${j}`

            strHTML += `<td title="${title}" data-i="${i}" data-j="${j}" class="cell" onmousedown="cellClicked(this, event)" oncontextmenu="return false"></td>`
        }
        strHTML += `</tr>`

        const elBoard = document.querySelector('.board')
        elBoard.innerHTML = strHTML
    }
}


function cellClicked(DOMCell, event) {

    if (!isGameOn) return

    var ModelCell = shiftCellType(DOMCell)

    if (event.button === 2) {
        rightMouseClick(DOMCell)

    } else if (event.ctrlKey) {


    } else leftMouseClick(DOMCell)

    changeSmiley(ModelCell)
    saveState()
}

function placeMines(DOMCell) {

    amountOfFlags = amountOfMines = Math.round((setBoardSize.rows * setBoardSize.cols) * 0.15)

    var ModelCell = shiftCellType(DOMCell)

    findEmptyCells(ModelCell)
    findCellsToPlaceMines(DOMCell)
    markMinesAroundAllCells(ModelCell)

    haveMinesBeenPlaced = true

    resetFlags()
}

var manuelModeDOM = document.querySelector('.manuel-mode')

function setManuelMode() {
    if (!haveMinesBeenPlaced) {
        manuelMode = true
        manuelModeDOM.innerHTML = `<img src="img/manuelClick.png">`
    }
    else {
        manuelMode = false
        manuelModeDOM.innerHTML = `<img src="img/manuel.png">`
    }
}

function manuelMines(ModelCell) {
    gBoard[ModelCell.i][ModelCell.j].isMine = true
    amountOfMines++
    amountOfFlags++
    resetFlags()
    haveMinesBeenPlaced = true
}


var CheckedCells = []

function showCells(ModelCell) {

    var X = ModelCell.i
    var Y = ModelCell.j

    if (CheckedCells.some(ModelCell => ModelCell.i === X && ModelCell.j === Y)) {
        return
    }

    CheckedCells.push({ i: X, j: Y });

    if (gBoard[ModelCell.i][ModelCell.j].minesAroundCell === 0) {
        for (let i = (X - 1); i <= (X + 1); i++) {
            if (i >= 0 && i < gBoard.length) {
                for (let j = Y - 1; j <= Y + 1; j++) {
                    if (j >= 0 && j < gBoard[i].length) {
                        if (!gBoard[i][j].isMine) {

                            var curDOMCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
                            gBoard[i][j].isShown = true
                            curDOMCell.classList.add('shown')

                            showCells({ i, j });

                            curDOMCell.innerText = gBoard[i][j].minesAroundCell
                            colorCells(curDOMCell)
                        }
                    }
                }
            }
        }
    }
    return
}


function youWin() {
    var flaggedMines = 0
    var shownCells = 0
    var youWin = false
    var livesUsed = (3 - livesLeft)

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isFlagged) flaggedMines++
            if (gBoard[i][j].isShown) shownCells++
        }
    }
    if (flaggedMines === (amountOfMines - livesUsed) &&
        shownCells === ((setBoardSize.rows * setBoardSize.cols) - (amountOfMines - livesUsed))) {
        youWin = true
    }

    return youWin
}


var cellsWithMinesModel = []

function findCellsWithMines() {

    cellsWithMinesModel.length = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) cellsWithMinesModel.push({ i, j })
        }
    }
}

function revealMines(ModelCell) {

    findCellsWithMines()

    for (let i = 0; i < cellsWithMinesModel.length; i++) {
        let curModelCell = cellsWithMinesModel[i]
        let cellsWithMinesDOM = document.querySelector(`td[data-i="${curModelCell.i}"][data-j="${curModelCell.j}"]`)
        cellsWithMinesDOM.innerHTML = MINE
    }

    document.querySelector(`td[data-i="${ModelCell.i}"][data-j="${ModelCell.j}"]`).classList.add('explode')
}


function safeClick(DOMBtn) {

    if (safeClicks < 1 || !haveMinesBeenPlaced) return

    let minesLeft = findEmptyCells({ i: 0, j: 7 }, 'safeClick')

    var livesUsed = (3 - livesLeft)

    if ((shownCells.length + minesLeft - livesUsed !== (setBoardSize.rows * setBoardSize.cols))) {

        for (let k = 0; k < 1; k++) {

            var randomCellModel = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]

            if (gBoard[randomCellModel.i][randomCellModel.j].isShown ||
                gBoard[randomCellModel.i][randomCellModel.j].isMine ||
                gBoard[randomCellModel.i][randomCellModel.j].isFlagged) {
                k--
                continue
            }

            gBoard[randomCellModel.i][randomCellModel.j].isShown = true

            var randomCellDOM = document.querySelector(`td[data-i="${randomCellModel.i}"][data-j="${randomCellModel.j}"]`)
            randomCellDOM.classList.add('shown')
            randomCellDOM.innerHTML = gBoard[randomCellModel.i][randomCellModel.j].minesAroundCell
            colorCells(randomCellDOM)

            setTimeout(() => {
                gBoard[randomCellModel.i][randomCellModel.j].isShown = false
                randomCellDOM.classList.remove('shown')
                randomCellDOM.innerHTML = ''
            }, 3000);
        }
    }

    safeClicks--
    if (safeClicks === 2) DOMBtn.innerHTML = `<img src="img/safe2.png">`
    if (safeClicks === 1) DOMBtn.innerHTML = `<img src="img/safe1.png">`
    if (safeClicks === 0) DOMBtn.innerHTML = `<img src="img/safe0.png">`

}

var mineExterminatorDOM = document.querySelector('.mine-exterminator')


function mineExterminatorIsOn() {
    if (haveMinesBeenPlaced && exterminationsLeft > 0) {
        isExterminatorOn = true

        mineExterminatorDOM.innerHTML = `<img src="img/exterminatorClick.png">`
        setTimeout(() => {
            mineExterminatorDOM.innerHTML = `<img src="img/exterminator.png">`
        }, 500);

        exterminationsLeft--
    }
}


function mineExterminator() {

    if (!isExterminatorOn) return

    findCellsWithMines()

    for (let k = 0; k < 3; k++) {

        let randomCellWithMineModel = cellsWithMinesModel[getRandomIntInclusive(0, amountOfMines - 1)]
        let randomCellWithMineDOM = document.querySelector(`td[data-i="${randomCellWithMineModel.i}"][data-j="${randomCellWithMineModel.j}"]`)

        amountOfMines--
        amountOfFlags--
        resetFlags()
        gBoard[randomCellWithMineModel.i][randomCellWithMineModel.j].isMine = false
        randomCellWithMineDOM.innerHTML = ''

        markMinesAroundAllCells()

        findNearbyCellsOrMines(randomCellWithMineModel)

        for (let i = 0; i < nearbyCells.length; i++) {
            if (gBoard[nearbyCells[i].i][nearbyCells[i].j].isShown) {
                var currCell = document.querySelector(`td[data-i="${nearbyCells[i].i}"][data-j="${nearbyCells[i].j}"]`)
                currCell.innerText = gBoard[nearbyCells[i].i][nearbyCells[i].j].minesAroundCell

                if (gBoard[nearbyCells[i].i][nearbyCells[i].j].minesAroundCell === 0) {
                    gBoard[nearbyCells[i].i][nearbyCells[i].j].isShown = false
                    currCell.classList.remove('shown')

                    CheckedCells.length = 0
                    showCells(nearbyCells[i])

                    colorCells(currCell)

                }
            }
        }
    } isExterminatorOn = false

}