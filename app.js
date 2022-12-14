document.addEventListener('DOMContentLoaded', () => {
    const bombsRemain = document.querySelector('.bombs-remain>p');
    const scoring = document.querySelector('.scoring>p');

    const grid = document.querySelector(".grid");
    const row = 10;
    const bombNumber = 20;
    const squares = [];
    let isGameOver = false;
    let flags = 0;

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
    
    // create all the div in the grid
    function createBoard() {
        const yesBomb = Array(bombNumber).fill('bomb');
        const noBomb = Array(row * row - bombNumber).fill('empty');
        const gameArr = [...yesBomb, ...noBomb].sort(() => Math.random() - 0.5);
        
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
            
            square.oncontextmenu = function (e) {
                e.preventDefault();
                flagIt(square);
            };
        }

        
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
        const currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flaged')) return;

        if (square.classList.contains('bomb')) {
            theGameOver(square);
        }else { 
            let bombArround = square.getAttribute('data');
            if (bombArround != 0) {
                square.classList.add('checked');
                square.innerHTML = bombArround;
                return;
            }
            checkEmptyFriends(square,currentId);
            square.classList.add('checked');
        }

    }

    function checkEmptyFriends(square,currentId) { 
        const isLeftEdge = (currentId % row) === 0;
        const isRightEdge = (currentId % row) === row - 1;

        setTimeout(() => { 
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId)].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - row].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId > 10) {
                const newId = squares[parseInt(currentId) - row].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - row].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + row].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + row].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + row].id;
                const newSquare = document.getElementById(newId);
                handleClick(newSquare);
            };
        },10);
    }

    // FLAGING THE MINES
    function flagIt(square) {
        if (isGameOver) return;
        if ((!square.classList.contains('checked')) && (flags <= bombNumber)) { 
            if (!square.classList.contains('flagged')) {
                square.classList.add('flagged');
                square.innerHTML = '????';
                flags++;
                bombsRemain.innerHTML = `Remaining Bomb : ${20 - flags}`;
                scoring.innerHTML = `Score : ${flags * 10}`;
                isWinner();
            } else { 
                square.classList.remove('flagged');
                square.innerHTML = '';
                flags--;
                bombsRemain.innerHTML = `Remaining Bomb : ${20 - flags}`;
                scoring.innerHTML = `Score : ${flags * 10}`;
                
            }
        }
    }

    // THE GAME OVE CASE
    function theGameOver(square) {
        console.log(' GAME OVER !');
        isGameOver = true;

        squares.forEach((square) => { 
            if (square.classList.contains('bomb')) {
                square.innerHTML = '????';
            }
        });
    }

    // ADD THE BOMBS ARROUND EACH SQUARE AND SET IT AS A DATA ATTRIBUTE
    function addBomb(list, idx, direction) { 
        let ans = 0;
        for (let i = 0; i < direction.length; i++){
            if (list[idx + direction[i]].classList.contains('bomb')) ans++;                                   
        }
        return ans;
    }

    // CHECK FOR WIN
    function isWinner() { 
        let compare = 0;
        for (let i = 0; i < squares.length; i++){
            if (
                squares[i].classList.contains('flagged') &&
                squares[i].classList.contains('bomb')
            ) { 
                compare++;
            }            
        }
        if (compare === bombNumber) {
            isGameOver = true;
            bombsRemain.innerHTML = `YOU WIN`;
        }
    }

});

