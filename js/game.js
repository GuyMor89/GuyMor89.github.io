'use strict'


var gBoard

var timerInterval
var amountOfFlags
var amountOfMines

var isGameOn = true
var haveMinesBeenPlaced = false
var hasTimerBeenStarted = false
var isHintOn = false
var hintsLeft = 3
var livesLeft = 3

const MINE = '<img src="img/mine.png"></img>'
const FLAG = '<img src="img/flag.png"></img>'
const setBoardSize = {
    rows: 7,
    cols: 8
}


function onInit() {
    amountOfFlags = amountOfMines = Math.round((setBoardSize.rows * setBoardSize.cols) * 0.15)

    gBoard = createBoard()
    renderBoard(gBoard)
    adjustBoardWidth()

    isGameOn = true
    haveMinesBeenPlaced = false
    hasTimerBeenStarted = false
    CheckedCells.length = 0

    livesLeft = 3
    setCounter('life')

    hintsLeft = 3
    setCounter('hint')

    resetFlagsAndSmiley()
    stopTimer()
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

            strHTML += `<td title="${title}" data-i="${i}" data-j="${j}" class="ModelCell" onclick="cellClicked(this, event)"></td>`
        }
        strHTML += `</tr>`

        const elBoard = document.querySelector('.board')
        elBoard.innerHTML = strHTML
    }
}


function cellClicked(DOMCell, event) {

    if (!isGameOn) return

    var ModelCell = shiftCellType(DOMCell)

    if (event.ctrlKey) {
        rightMouseClick(DOMCell)

    } else leftMouseClick(DOMCell)

    changeSmiley(ModelCell)

}

function placeMines(DOMCell) {

    var ModelCell = shiftCellType(DOMCell)

    findCellsToPlaceMines(DOMCell)
    findMinesOnMap(ModelCell)

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

                            curDOMCell.innerHTML = gBoard[i][j].minesAroundCell
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
        shownCells === ((setBoardSize.rows * setBoardSize.cols) - (amountOfMines - livesUsed))) youWin = true

    return youWin
}


var cellsWithMinesModel = []

function revealMines(ModelCell) {

    cellsWithMinesModel.length = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) cellsWithMinesModel.push({ i, j })
        }
    }

    for (let i = 0; i < cellsWithMinesModel.length; i++) {
        let curModelCell = cellsWithMinesModel[i]
        let cellsWithMinesDOM = document.querySelector(`td[data-i="${curModelCell.i}"][data-j="${curModelCell.j}"]`)
        cellsWithMinesDOM.innerHTML = MINE
    }

    document.querySelector(`td[data-i="${ModelCell.i}"][data-j="${ModelCell.j}"]`).classList.add('explode')
}

function hintIsOn() {
    if (haveMinesBeenPlaced && hintsLeft > 0) isHintOn = true
}

function setCounter(type) {

    var strHTML = ''
    var counterBox
    var amountLeft
    var on
    var off

    if (type === 'life') {
        counterBox = document.querySelector('.life-counter-box')
        amountLeft = livesLeft
        on = '<img src="img/grin.png" onclick="clickSmileys(this)"></img>'
        off = '<img src="img/frown.png"></img>'
    }
    if (type === 'hint') {
        if (type === 'hint') counterBox = document.querySelector('.hint-box')
        amountLeft = hintsLeft
        on = '<img src="img/bulbOn.png" onclick="hintIsOn(); clickBulb(this);"></img>'
        off = '<img src="img/bulbOff.png"></img>'
    }

    for (let i = 0; i < 3; i++) {
        if (i < amountLeft) {
            strHTML += ' '
            strHTML += on
        } else {
            strHTML += ' '
            strHTML += off
        }
    }

    counterBox.innerHTML = strHTML
}


