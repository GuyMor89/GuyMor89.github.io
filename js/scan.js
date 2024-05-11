'use strict'


function shiftCellType(DOMcell) {

    var i = +DOMcell.dataset.i
    var j = +DOMcell.dataset.j

    var ModelCell = { i, j }

    return ModelCell
}

var nearbyCells = []

function findNearbyCellsOrMines(ModelCell) {

    nearbyCells.length = 0

    var count = 0

    var X = ModelCell.i
    var Y = ModelCell.j

    for (let i = (X - 1); i <= (X + 1); i++) {
        if (i >= 0 && i < gBoard.length) {
            for (let j = Y - 1; j <= Y + 1; j++) {
                if (j >= 0 && j < gBoard[i].length) {
                    nearbyCells.push({ i, j })
                    if (gBoard[i][j] === gBoard[X][Y]) continue
                    if (gBoard[i][j].isMine) count++

                }
            }
        }
    } return count
}


function markMinesAroundAllCells() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            var ModelCell = { i, j }
            gBoard[i][j].minesAroundCell = findNearbyCellsOrMines(ModelCell)
        }
    }
}


var emptyCells = []
var shownCells = []

function findEmptyCells(ModelCell, type) {

    emptyCells.length = 0
    shownCells.length = 0

    var minesLeft = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown) shownCells.push({ i, j })
            if (!gBoard[i][j].isMine) {
                if (type !== 'safeClick') {
                    if (gBoard[i][j] !== gBoard[ModelCell.i][ModelCell.j]) {
                        emptyCells.push({ i, j })
                    }
                } else emptyCells.push({ i, j })
            } else minesLeft++
        }
    } return minesLeft
}


function findCellsToPlaceMines(DOMCell) {

    var ModelCell = shiftCellType(DOMCell)

    findNearbyCellsOrMines(ModelCell)

    for (let k = 0; k < amountOfMines; k++) {
        var randomCellModel = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]

        if (nearbyCells.some(ModelCell => ModelCell.i === randomCellModel.i && ModelCell.j === randomCellModel.j)) {
            k--
            continue
        }
        if (gBoard[randomCellModel.i][randomCellModel.j].isMine) {
            k--
            continue
        }
        gBoard[randomCellModel.i][randomCellModel.j].isMine = true

        var randomCellDOM = document.querySelector(`td[data-i="${randomCellModel.i}"][data-j="${randomCellModel.j}"]`)
        // randomCellDOM.innerHTML = MINE
    }
}

var cloneArray = []
var gBoardClone = []

function saveState() {

    gBoardClone = structuredClone(gBoard)

    cloneArray.push(gBoardClone)
}

function restoreState(DOMBtn) {

    CheckedCells.length = 0

    const currentSave = cloneArray[cloneArray.length - 1]
    const previousSave = cloneArray.length > 1 ? cloneArray[cloneArray.length - 2] : null;

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {

            var DOMCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            var mineCounterSpan = document.querySelector('.mine-counter span')

            if (previousSave) {
                if (currentSave[i][j].isFlagged && !previousSave[i][j].isFlagged) {
                    gBoard[i][j].isFlagged = false
                    DOMCell.innerHTML = ''
                }
                if (currentSave[i][j].isShown && !previousSave[i][j].isShown) {
                    gBoard[i][j].isShown = false
                    DOMCell.classList.remove('shown')
                    DOMCell.innerText = ''
                }
                if (currentSave[i][j].isMine && currentSave[i][j].isShown && !previousSave[i][j].isShown) {
                    DOMCell.classList.remove('explode')
                    livesLeft++
                    setCounter('life')
                    amountOfFlags++
                    mineCounterSpan.innerText = amountOfFlags.toString().padStart(3, '0')
                }

            } else if (currentSave) {
                if (currentSave[i][j].isShown) {
                    gBoard[i][j].isShown = false
                    DOMCell.classList.remove('shown')
                    DOMCell.innerText = ''
                } 
                if (currentSave[i][j].isMine && currentSave[i][j].isShown) {
                    DOMCell.classList.remove('explode')
                    livesLeft++
                    setCounter('life')
                    amountOfFlags++
                    mineCounterSpan.innerText = amountOfFlags.toString().padStart(3, '0')
                } 
                if (currentSave[i][j].isFlagged) {
                    gBoard[i][j].isFlagged = false
                    DOMCell.innerHTML = ''
                }
            }
        }
    } cloneArray.pop()
    DOMBtn.innerHTML = `<img src="img/undoClick.png">`

    setTimeout(() => {
        DOMBtn.innerHTML = `<img src="img/undo.png">`
    }, 100);
}


