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
            amountOfFlags--
            resetFlags()

        }
    }

    if (youWin()) {
        isGameOn = false
        clearInterval(timerInterval)

        var firstScore = localStorage.getItem('firstScore')
        var secondScore = localStorage.getItem('secondScore')
        var thirdScore = localStorage.getItem('thirdScore')

        if (countScore() > firstScore) localStorage.setItem('firstScore', countScore())
        if (countScore() > secondScore) localStorage.setItem('secondScore', countScore())
        if (countScore() > thirdScore) localStorage.setItem('thirdScore', countScore())
    }
}

var clickCounter = 0

function leftMouseClick(DOMCell) {

    var ModelCell = shiftCellType(DOMCell)

    if (isHintOn) {
        useHint(ModelCell)

    } else if (manuelMode) {
        manuelMines(ModelCell)

    } else if (isMegaHintOn) {
        console.log(isMegaHintOn);
        useMegaHint(ModelCell)

    } else if (!gBoard[ModelCell.i][ModelCell.j].isMine) {
        if (gBoard[ModelCell.i][ModelCell.j].isFlagged) {
            amountOfFlags++
            resetFlags()
        }
        DOMCell.classList.add('shown')
        gBoard[ModelCell.i][ModelCell.j].isShown = true

        if (!haveMinesBeenPlaced) placeMines(DOMCell)
        if (haveMinesBeenPlaced) markMinesAroundAllCells(ModelCell)

        showCells(ModelCell)

        DOMCell.innerText = gBoard[ModelCell.i][ModelCell.j].minesAroundCell
        colorCells(DOMCell)

        clickCounter++
        // console.log(clickCounter);

    } else if (gBoard[ModelCell.i][ModelCell.j].isMine &&
        livesLeft > 0) {
        if (amountOfFlags > 0) {
            amountOfFlags--
            document.querySelector('.mine-counter span').innerText = amountOfFlags.toString().padStart(3, '0')
        }
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

        var firstScore = localStorage.getItem('firstScore')
        var secondScore = localStorage.getItem('secondScore')
        var thirdScore = localStorage.getItem('thirdScore')

        if (countScore() > firstScore) localStorage.setItem('firstScore', countScore())
        if (countScore() > secondScore) localStorage.setItem('secondScore', countScore())
        if (countScore() > thirdScore) localStorage.setItem('thirdScore', countScore())
    }
    
    if (!hasTimerBeenStarted && haveMinesBeenPlaced) {
        startTimer()
        hasTimerBeenStarted = true
    }

}

function hintIsOn() {
    if (haveMinesBeenPlaced && hintsLeft > 0) isHintOn = true
}


function useHint(ModelCell) {

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


function megaHintIsOn(DOMBtn) {
    if (haveMinesBeenPlaced && megaHintsLeft > 0) {
        isMegaHintOn = true
        DOMBtn.innerHTML = `<img src="img/megaOff.png">`
    }
}


var megaHintButton = document.querySelector('.mega-hint')
var megaStartAndEndArray = []
var megaArray = []

function useMegaHint(ModelCell) {

    if (!isMegaHintOn) return

    if (megaStartAndEndArray.length > 2) return

    megaStartAndEndArray.push(ModelCell)

    if (megaStartAndEndArray.length < 2) return

    if (megaStartAndEndArray.length === 2) {
        for (let i = megaStartAndEndArray[0].i; i <= megaStartAndEndArray[1].i; i++) {
            for (let j = megaStartAndEndArray[0].j; j <= megaStartAndEndArray[1].j; j++) {
                megaArray.push({ i, j })
            }
        }
        for (let i = 0; i < megaArray.length; i++) {
            if (!gBoard[megaArray[i].i][megaArray[i].j].isShown) {
                let curDOMCell = document.querySelector(`td[data-i="${megaArray[i].i}"][data-j="${megaArray[i].j}"]`)
                curDOMCell.classList.add('shown')
                curDOMCell.innerHTML = gBoard[megaArray[i].i][megaArray[i].j].isMine ? MINE : gBoard[megaArray[i].i][megaArray[i].j].minesAroundCell
                colorCells(curDOMCell)

                setTimeout(() => {
                    curDOMCell.classList.remove('shown')
                    curDOMCell.innerHTML = ''
                }, 1000);
            }
        }
    }

    megaHintsLeft--
    isMegaHintOn = false
}