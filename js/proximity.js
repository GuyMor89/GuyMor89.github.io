'use strict'

function findNearbyMines(cell) {

    var count = 0
    var X = cell.i
    var Y = cell.j

    for (let i = (X - 1); i <= (X + 1); i++) {
        if (i >= 0 && i < gBoard.length) {
            for (let j = Y - 1; j <= Y + 1; j++) {
                if (j >= 0 && j < gBoard[i].length) {
                    if (gBoard[i][j] === gBoard[X][Y]) continue
                    if (gBoard[i][j].isMine) count++

                }
            }
        }
    }
    return count
}

var nearbyCells = []

function findNearbyCells(cell) {

    nearbyCells.length = 0

    var X = cell.i
    var Y = cell.j

    for (let i = (X - 1); i <= (X + 1); i++) {
        if (i >= 0 && i < gBoard.length) {
            for (let j = Y - 1; j <= Y + 1; j++) {
                if (j >= 0 && j < gBoard[i].length) {
                    if (gBoard[i][j] === gBoard[X][Y]) continue
                    nearbyCells.push({ i, j })

                }
            }
        }
    } return
}


function findMinesOnMap() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            var cell = { i, j }
            gBoard[i][j].minesAroundCell = findNearbyMines(cell)
        }
    }
}


var gEmptyCells = []

function findEmptyCells(cell) {

    gEmptyCells.length = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine &&
                gBoard[i][j] !== gBoard[cell.i][cell.j]) {
                // console.log({i, j});
                gEmptyCells.push({ i, j })
            }
        }
    } return gEmptyCells
}


function findCellsToPlaceMines(elCell) {

    var i = +elCell.dataset.i
    var j = +elCell.dataset.j

    var cell = { i, j }

    findNearbyCells(cell)

    for (let k = 0; k < amountOfMines; k++) {
        var randomCellModel = gEmptyCells[getRandomIntInclusive(0, gEmptyCells.length - 1)]
        var randomCellDOM = document.querySelector(`td[data-i="${randomCellModel.i}"][data-j="${randomCellModel.j}"]`)

        if (nearbyCells.some(cell => cell.i === randomCellModel.i && cell.j === randomCellModel.j)) {
            k--
            continue
        }

        if (gBoard[randomCellModel.i][randomCellModel.j].isMine) {
            k--
            continue
        }

        gBoard[randomCellModel.i][randomCellModel.j].isMine = true
        // randomCellDOM.innerHTML = MINE
    }
}




