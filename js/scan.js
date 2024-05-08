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
    } 
    return count
}


function findMinesOnMap() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            var ModelCell = { i, j }
            gBoard[i][j].minesAroundCell = findNearbyCellsOrMines(ModelCell)
        }
    }
}

var randomCells = []

function findCellsToPlaceMines(DOMCell) {

    randomCells.length = 0

    var ModelCell = shiftCellType(DOMCell)

    findNearbyCellsOrMines(ModelCell)

    for (let k = 0; k < amountOfMines; k++) {

        var randomCellModel = {
            i: getRandomIntInclusive(0, setBoardSize.rows - 1),
            j: getRandomIntInclusive(0, setBoardSize.cols - 1)
        }
        if (nearbyCells.some(ModelCell => ModelCell.i === randomCellModel.i && ModelCell.j === randomCellModel.j)) {
            k--
            continue
        }
        if (randomCells.some(randomCell => randomCell.i === randomCellModel.i && randomCell.j === randomCellModel.j)) {
            k--
            continue
        }
        randomCells.push(randomCellModel)

        gBoard[randomCellModel.i][randomCellModel.j].isMine = true

        var randomCellDOM = document.querySelector(`td[data-i="${randomCellModel.i}"][data-j="${randomCellModel.j}"]`)
        // randomCellDOM.innerHTML = MINE
    }
}




