const b = document.getElementById("board");
const startBtn = document.getElementById("start");


startBtn.addEventListener('click', () => {

    gameController.initiate();

});


function createPlayer(name, input) {

    const playerName = name;
    const playerInput = input

    const getName = () => playerName;
    const getInput = () => playerInput;

    return { getName, getInput };

}


const gameBoard = (function () {

    let nbTurns = 0;
    let row = [0, 0, 0];
    let column = [0, 0, 0];
    let diag1 = 0;
    let diag2 = 0;

    let values = { "x": 1, "o": -1, "": 0 };
    let x = "x";
    let o = "o";
    let n = "";

    let board = [
        [n, n, n], // Row 0
        [n, n, n], // Row 1
        [n, n, n]  // Row 2
    ];

    function reset() {
        b.innerHTML = '';
        b.style.pointerEvents = 'auto';
        nbTurns = 0;
        row = [0, 0, 0];
        column = [0, 0, 0];
        diag1 = 0;
        diag2 = 0;
    }

    function boardScan(player) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                let value = values[board[i][j]];

                if (value !== 0) {
                    row[i] += value;
                    column[j] += value;

                    if (i === j) diag1 += value;
                    if (i + j === 2) diag2 += value;

                    matchResult(player, i, j);
                }
            }
        }
    }

    function playTheGame(r, c) {
        let player = gameController.getPlayingPlayer();
        matchPlay(player, r, c);
    }

    function matchPlay(player, r, c) {
        nbTurns++;

        board[r][c] = player.getInput();

        let playCase = document.getElementById(`case${r}${c}`);
        playCase.innerText = player.getInput();
        playCase.style.pointerEvents = 'none';

        let value = values[board[r][c].toLowerCase()];

        row[r] += value;
        column[c] += value;

        if (r === c) diag1 += value;
        if (r + c === 2) diag2 += value;

        console.log(`${player.getName()} plays at [${r}, ${c}]`);

        gameController.swapPlayer();

        matchResult(player, r, c);
    }

    function matchResult(player, r, c) {

        if (Math.abs(row[r]) === 3 || Math.abs(column[c]) === 3 || Math.abs(diag1) === 3 || Math.abs(diag2) === 3) {
            console.log(`Winner: ${player.getName()}`);
            b.style.pointerEvents = 'none';
            alert(`Winner: ${player.getName()}`);
        } else if (nbTurns === 9) {
            console.log(`no winner, tie.`);
            alert(`No winner, tie.`);
        }
    }

    return { matchResult, boardScan, matchPlay, playTheGame, reset };

})();

const gameController = (function () {

    let player1 = undefined;

    let player2 = undefined;

    let playingPlayer = undefined;
    let waitingPlayer = undefined;

    function initiate() {

       gameBoard.reset();

        const p1name = document.getElementById("player1Name").value;
        const p2name = document.getElementById("player2Name").value;

        player1 = createPlayer(p1name, "x");
        player2 = createPlayer(p2name, "o");
        playingPlayer = player1;
        waitingPlayer = player2;

        alert(player1.getName() + " " + player2.getName() + " " + playingPlayer.getInput() + " " + waitingPlayer.getInput());


        for (let i = 0; i < 3; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < 3; j++) {

                let cas = document.createElement("div");
                cas.classList.add("case");
                cas.addEventListener('click', () => {
                    gameBoard.playTheGame(i, j);
                });
                cas.id = "case" + i + j;
                row.append(cas);

            }
            b.append(row);
        }
    }

    function swapPlayer() {
        let temp = playingPlayer;
        playingPlayer = waitingPlayer;
        waitingPlayer = temp;
    }

    const getPlayingPlayer = () => playingPlayer;
    const getWaitingPlayer = () => waitingPlayer;

    return { swapPlayer, getPlayingPlayer, getWaitingPlayer, initiate };
})();


let player1 = createPlayer("player1", "x");

let player2 = createPlayer("player2", "o");

