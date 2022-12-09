document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const row = 10;
    const bombNumber = 20;
    const squares = [];

    // create all the div in the grid
    function createBoard() {
        const yesBomb = Array(bombNumber).fill('bomb');
        const noBomb = Array(row * row - bombNumber).fill('empty');
        const gameArr = [...yesBomb, ...noBomb].sort(() => Math.random() - 0.5);
        // console.log(gameArr);

        // CREATE THE SQUARES IN THE GRID
        for (let i = 0; i < row * row; i++){
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(String(gameArr[i]));
            grid.appendChild(square);
            squares.push(square);

            // ADD EVENT LITSENER ON EACH SQUARE
            square.addEventListener('click', function (event) {
                handleClick(square);
             });
        }

        const vector = {
            topLeft: [1,11,10],//@ i= 0
            topRight: [10,9,-1],//@ i= 9
            top: [1,11,10,9,-1],
            bottom:[-1,-11,-10,-9,1],
            bottomLeft: [-10,-9,1],//@ i= 90
            bottomRight: [-10,-11,-1],//@ i= 99
            left: [-10,-9,1,11,10],//@ i%10 == 0
            right: [-10,-11,-1,9,10],//@ (i+1)%10 ==0
            middle: [-10,-9,1,11,10,9,-1,-11]
        };
        //  ADD THE NUMBER OF BOMBS SURROUNDING A SQUARE
        for (let i = 0; i < squares.length; i++){
            //addBomb(squares, i, direction)
            if (squares[i].classList.contains('empty')) {
                if (i == 0) { squares[i].setAttribute('data', addBomb(squares, i, vector.topLeft)); }
                else if (i == 9) { squares[i].setAttribute('data', addBomb(squares, i, vector.topRight)); }
                else if (i == 90) { squares[i].setAttribute('data', addBomb(squares, i, vector.bottomLeft)); }
                else if (i == 99) { squares[i].setAttribute('data', addBomb(squares, i, vector.bottomRight)); }
                else if (i > 0 && i < 9) { squares[i].setAttribute('data', addBomb(squares, i, vector.top)); }
                else if (i > 90 && i < 99) { squares[i].setAttribute('data', addBomb(squares, i, vector.bottom)); }
                else if (i % 10 == 0) { squares[i].setAttribute('data', addBomb(squares, i, vector.left)); }
                else if ((i + 1) % 10 == 0) { squares[i].setAttribute('data', addBomb(squares, i, vector.right)); }
                else { squares[i].setAttribute('data', addBomb(squares, i, vector.middle)); }
            }
        }
    }
    createBoard();

    // CLICK FUNCTION FOR EACH SQUARE
    function handleClick(square) { 
        if (square.classList.contains('bomb')) {
            console.log("Game Over");
         }

    }


    // ADD THE BOMBS ARROUND EACH SQUARE AND SET IT AS A DATA ATTRIBUTE
    function addBomb(list, idx, direction) { 
        let ans = 0;
        for (let i = 0; i < direction.length; i++){
            if (list[idx + direction[i]].classList.contains('bomb')) ans++;                                   
        }
        return ans;
    }

});