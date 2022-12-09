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
        console.log(gameArr);
    
        for (let i = 0; i < row * row; i++){
            let square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(String(gameArr[i]));
            grid.appendChild(square);
            squares.push(square);
        } 
    }
    createBoard();

});