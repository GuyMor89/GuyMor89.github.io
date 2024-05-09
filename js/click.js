'use strict'

var ModelCellContent = ''

function rightMouseClick(DOMCell) {

    var ModelCell = shiftCellType(DOMCell)

    if (!gBoard[ModelCell.i][ModelCell.j].isShown) {

        if (!gBoard[ModelCell.i][ModelCell.j].isFlagged) ModelCellContent = DOMCell.innerHTML
        if (gBoard[ModelCell.i][ModelCell.j].isFlagged) {
            gBoard[ModelCell.i][ModelCell.j].isFlagged = false
            DOMCell.innerHTML = ModelCellContent

            if (amountOfFlags >= 0) amountOfFlags++
            resetFlags()

        } else if (amountOfFlags > 0) {
            gBoard[ModelCell.i][ModelCell.j].isFlagged = true
            DOMCell.innerHTML = FLAG

            if (amountOfFlags > 0) amountOfFlags--
            resetFlags()
        }
    }
}


function leftMouseClick(DOMCell) {

    var ModelCell = shiftCellType(DOMCell)

    if (!hasTimerBeenStarted) startTimer()
    hasTimerBeenStarted = true

    if (isHintOn) {
        useHint(DOMCell)

    } else if (manualMode) {
        manualMines(ModelCell)

    } else if (!gBoard[ModelCell.i][ModelCell.j].isMine) {
        DOMCell.classList.add('shown')
        gBoard[ModelCell.i][ModelCell.j].isShown = true

        if (!haveMinesBeenPlaced) placeMines(DOMCell)
        if (haveMinesBeenPlaced) findMinesOnMap(ModelCell)

        showCells(ModelCell)

        DOMCell.innerText = gBoard[ModelCell.i][ModelCell.j].minesAroundCell
        colorCells(DOMCell)

    } else if (gBoard[ModelCell.i][ModelCell.j].isMine && livesLeft > 0 && !gBoard[ModelCell.i][ModelCell.j].isShown) {
        amountOfFlags--
        resetFlags()

        livesLeft--
        setCounter('life')

        DOMCell.innerHTML = MINE
        gBoard[ModelCell.i][ModelCell.j].isShown = true
        document.querySelector(`td[data-i="${ModelCell.i}"][data-j="${ModelCell.j}"]`).classList.add('explode')

    } else if (livesLeft === 0) {
        revealMines(ModelCell)
        isGameOn = false
        clearInterval(timerInterval)
    }

    if (youWin()) {
        isGameOn = false
        clearInterval(timerInterval)
    }

}


function useHint(DOMCell) {

    var ModelCell = shiftCellType(DOMCell)

    findNearbyCellsOrMines(ModelCell)
    nearbyCells.push(ModelCell)

    for (let i = 0; i < nearbyCells.length; i++) {
        if (!gBoard[nearbyCells[i].i][nearbyCells[i].j].isShown) {
            let curDOMCell = document.querySelector(`td[data-i="${nearbyCells[i].i}"][data-j="${nearbyCells[i].j}"]`)
            curDOMCell.classList.add('shown')
            curDOMCell.innerHTML = gBoard[nearbyCells[i].i][nearbyCells[i].j].isMine ? MINE : gBoard[nearbyCells[i].i][nearbyCells[i].j].minesAroundCell
            colorCells(curDOMCell)

            setTimeout(() => {
                curDOMCell.classList.remove('shown')
                curDOMCell.innerHTML = ''
            }, 1000);
        }
    }
    isHintOn = false
    hintsLeft--
    setCounter('hint')
}