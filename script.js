document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');
    const winMessage = document.getElementById('win-message');
    const winImage = document.getElementById('win-image');
    
    let board = [];
    let score = 0;
    let winImageUrl = 'win-image.jpg'; // Путь к изображению в локальной папке
    
    // Инициализация игры
    function initGame() {
        // Создаем пустую доску 4x4
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        scoreElement.textContent = '0';
        winMessage.classList.add('hidden');
        
        // Очищаем сетку
        grid.innerHTML = '';
        
        // Создаем ячейки
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                grid.appendChild(cell);
            }
        }
        
        // Добавляем 2 начальных плитки
        addRandomTile();
        addRandomTile();
        
        updateView();
    }
    
    // Добавление случайной плитки (2 или 4)
    function addRandomTile() {
        const emptyCells = [];
        
        // Находим все пустые ячейки
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] === 0) {
                    emptyCells.push({row, col});
                }
            }
        }
        
        // Если есть пустые ячейки, добавляем новую плитку
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
            return true;
        }
        
        return false;
    }
    
    // Обновление отображения доски
    function updateView() {
        // Удаляем все плитки
        document.querySelectorAll('.tile').forEach(tile => tile.remove());
        
        // Добавляем текущие плитки
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] !== 0) {
                    const value = board[row][col];
                    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    const tile = document.createElement('div');
                    tile.classList.add('tile', `tile-${value}`);
                    tile.textContent = value;
                    cell.appendChild(tile);
                    
                    // Анимация появления новой плитки
                    if (tile.dataset.new === 'true') {
                        tile.style.transform = 'scale(0)';
                        setTimeout(() => {
                            tile.style.transform = 'scale(1)';
                        }, 10);
                        tile.removeAttribute('data-new');
                    }
                }
            }
        }
        
        // Проверяем победу
        if (score >= 1000) {
            showWinMessage();
        }
    }
    
    // Движение плиток
    function move(direction) {
        let moved = false;
        const newBoard = Array(4).fill().map(() => Array(4).fill(0));
        
        // Обрабатываем каждое направление по-разному
        if (direction === 'left') {
            for (let row = 0; row < 4; row++) {
                let newCol = 0;
                let prevValue = null;
                
                for (let col = 0; col < 4; col++) {
                    if (board[row][col] !== 0) {
                        if (prevValue === null) {
                            prevValue = board[row][col];
                        } else if (prevValue === board[row][col]) {
                            newBoard[row][newCol] = prevValue * 2;
                            score += prevValue * 2;
                            prevValue = null;
                            moved = true;
                            newCol++;
                        } else {
                            newBoard[row][newCol] = prevValue;
                            prevValue = board[row][col];
                            newCol++;
                        }
                    }
                }
                
                if (prevValue !== null) {
                    newBoard[row][newCol] = prevValue;
                    if (newCol !== 3) moved = true;
                }
            }
        } else if (direction === 'right') {
            for (let row = 0; row < 4; row++) {
                let newCol = 3;
                let prevValue = null;
                
                for (let col = 3; col >= 0; col--) {
                    if (board[row][col] !== 0) {
                        if (prevValue === null) {
                            prevValue = board[row][col];
                        } else if (prevValue === board[row][col]) {
                            newBoard[row][newCol] = prevValue * 2;
                            score += prevValue * 2;
                            prevValue = null;
                            moved = true;
                            newCol--;
                        } else {
                            newBoard[row][newCol] = prevValue;
                            prevValue = board[row][col];
                            newCol--;
                        }
                    }
                }
                
                if (prevValue !== null) {
                    newBoard[row][newCol] = prevValue;
                    if (newCol !== 0) moved = true;
                }
            }
        } else if (direction === 'up') {
            for (let col = 0; col < 4; col++) {
                let newRow = 0;
                let prevValue = null;
                
                for (let row = 0; row < 4; row++) {
                    if (board[row][col] !== 0) {
                        if (prevValue === null) {
                            prevValue = board[row][col];
                        } else if (prevValue === board[row][col]) {
                            newBoard[newRow][col] = prevValue * 2;
                            score += prevValue * 2;
                            prevValue = null;
                            moved = true;
                            newRow++;
                        } else {
                            newBoard[newRow][col] = prevValue;
                            prevValue = board[row][col];
                            newRow++;
                        }
                    }
                }
                
                if (prevValue !== null) {
                    newBoard[newRow][col] = prevValue;
                    if (newRow !== 3) moved = true;
                }
            }
        } else if (direction === 'down') {
            for (let col = 0; col < 4; col++) {
                let newRow = 3;
                let prevValue = null;
                
                for (let row = 3; row >= 0; row--) {
                    if (board[row][col] !== 0) {
                        if (prevValue === null) {
                            prevValue = board[row][col];
                        } else if (prevValue === board[row][col]) {
                            newBoard[newRow][col] = prevValue * 2;
                            score += prevValue * 2;
                            prevValue = null;
                            moved = true;
                            newRow--;
                        } else {
                            newBoard[newRow][col] = prevValue;
                            prevValue = board[row][col];
                            newRow--;
                        }
                    }
                }
                
                if (prevValue !== null) {
                    newBoard[newRow][col] = prevValue;
                    if (newRow !== 0) moved = true;
                }
            }
        }
        
        // Если было движение, обновляем доску и добавляем новую плитку
        if (moved) {
            board = newBoard;
            addRandomTile();
            scoreElement.textContent = score;
            updateView();
        }
    }
    
    // Показать сообщение о победе
    function showWinMessage() {
        winImage.src = winImageUrl;
        winMessage.classList.remove('hidden');
    }
    
    // Обработка нажатий клавиш
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            move('left');
        } else if (e.key === 'ArrowRight') {
            move('right');
        } else if (e.key === 'ArrowUp') {
            move('up');
        } else if (e.key === 'ArrowDown') {
            move('down');
        }
    });
    
    // Кнопка новой игры
    restartBtn.addEventListener('click', initGame);
    
    // Начало игры
    initGame();
});