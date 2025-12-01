// Loading screen functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loginContainer = document.getElementById('loginContainer');
    
    if (loadingScreen && loginContainer) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        }, 3000);
    }
    
    initializeDashboard();
});

// Dashboard functionality
function initializeDashboard() {
    // Update time display
    function updateTime() {
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString();
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.sidebar-btn[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab
            tabContents.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === `${targetTab}-tab`) {
                    tab.classList.add('active');
                    
                    // Initialize snake game if switching to that tab
                    if (targetTab === 'snake-game' && typeof initializeSnakeGame === 'function') {
                        setTimeout(initializeSnakeGame, 100);
                    }
                }
            });
        });
    });
    
    // See More Projects button
    const seeMoreBtn = document.getElementById('seeMoreProjects');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', function() {
            alert('Fetching more projects... This would typically load additional projects from a database or API.');
            
            // Simulate loading more projects
            const projectsTab = document.getElementById('projects-tab');
            const output = projectsTab.querySelector('.output');
            
            const newProject = document.createElement('div');
            newProject.className = 'project-item';
            newProject.innerHTML = `
                <div class="project-header">
                    <span class="project-name">New Security Tool</span>
                    <span class="project-status planned">Planned</span>
                </div>
                <div class="project-description">Upcoming project in development phase</div>
                <div class="project-tech">
                    <span class="tech-tag">Python</span>
                    <span class="tech-tag">Security</span>
                </div>
            `;
            
            output.appendChild(newProject);
            
            // Add typing effect
            typeWriter(newProject.querySelector('.project-description'), 'New automated security assessment tool for web applications.');
        });
    }
    
    // Terminal typing effects
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Add some interactive effects to terminal windows
    const terminalWindows = document.querySelectorAll('.terminal-window');
    terminalWindows.forEach(terminal => {
        const header = terminal.querySelector('.terminal-header');
        const closeBtn = terminal.querySelector('.button.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                terminal.style.opacity = '0';
                setTimeout(() => {
                    terminal.style.display = 'none';
                }, 300);
            });
        }
        
        // Minimize functionality
        const minimizeBtn = terminal.querySelector('.button.minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function() {
                const body = terminal.querySelector('.terminal-body');
                body.style.display = body.style.display === 'none' ? 'block' : 'none';
            });
        }
    });
    
    // Add command execution simulation
    simulateCommandExecution();
    
    // Initialize Snake Game if on the snake game tab
    if (document.getElementById('snake-game-tab')?.classList.contains('active')) {
        initializeSnakeGame();
    }
}

function simulateCommandExecution() {
    const commandElements = document.querySelectorAll('.command');
    
    commandElements.forEach(commandElement => {
        const originalText = commandElement.textContent;
        commandElement.textContent = '';
        
        let i = 0;
        function typeCommand() {
            if (i < originalText.length) {
                commandElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeCommand, 50);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeCommand, 1000);
    });
}

// Add some cool terminal effects
document.addEventListener('keydown', function(e) {
    // Add Konami code easter egg
    if (e.key === 'ArrowUp') {
        const terminals = document.querySelectorAll('.terminal-body');
        terminals.forEach(terminal => {
            terminal.style.background = 'radial-gradient(circle, #1a1a2e 0%, #0f3460 100%)';
            setTimeout(() => {
                terminal.style.background = '';
            }, 1000);
        });
    }
});

// Make the interface more interactive
function addTerminalEffects() {
    const prompts = document.querySelectorAll('.prompt');
    
    prompts.forEach(prompt => {
        prompt.addEventListener('click', function() {
            this.style.textShadow = '0 0 10px #5575ff';
            setTimeout(() => {
                this.style.textShadow = '';
            }, 500);
        });
    });
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTerminalEffects);
} else {
    addTerminalEffects();
}

// Snake Game Implementation
class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameSpeed = 120;
        this.gameLoop = null;
        
        // Initialize game
        this.initializeGame();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeGame() {
        // Initialize snake in the middle
        this.snake = [
            {x: 8, y: 8},
            {x: 7, y: 8},
            {x: 6, y: 8}
        ];
        
        // Create first food
        this.createFood();
        
        // Reset game state
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameSpeed = 120;
    }
    
    createFood() {
        let newFood;
        let onSnake;
        
        do {
            onSnake = false;
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            // Check if food is on snake
            for (let segment of this.snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    onSnake = true;
                    break;
                }
            }
        } while (onSnake);
        
        this.food = newFood;
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
            document.getElementById('startGame').disabled = true;
            document.getElementById('pauseGame').disabled = false;
        }
    }
    
    pauseGame() {
        if (this.gameRunning && !this.gamePaused) {
            this.gamePaused = true;
            clearInterval(this.gameLoop);
            this.showPauseMessage();
            document.getElementById('pauseGame').textContent = 'RESUME';
        } else if (this.gamePaused) {
            this.gamePaused = false;
            this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
            this.hidePauseMessage();
            document.getElementById('pauseGame').textContent = 'PAUSE';
        }
    }
    
    resetGame() {
        clearInterval(this.gameLoop);
        this.gameRunning = false;
        this.gamePaused = false;
        this.initializeGame();
        this.draw();
        this.updateDisplay();
        document.getElementById('startGame').disabled = false;
        document.getElementById('pauseGame').disabled = true;
        document.getElementById('pauseGame').textContent = 'PAUSE';
        this.hidePauseMessage();
        this.hideGameOver();
    }
    
    update() {
        if (this.gamePaused) return;
        
        this.direction = this.nextDirection;
        
        // Calculate new head position
        const head = {...this.snake[0]};
        
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.createFood();
            
            // Increase speed slightly
            if (this.gameSpeed > 60 && this.score % 50 === 0) {
                this.gameSpeed -= 5;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
            }
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        this.draw();
        this.updateDisplay();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional)
        this.ctx.strokeStyle = '#111';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.tileCount; i++) {
            for (let j = 0; j < this.tileCount; j++) {
                this.ctx.strokeRect(i * this.gridSize, j * this.gridSize, this.gridSize, this.gridSize);
            }
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = '#27ca3f';
            } else {
                // Snake body
                this.ctx.fillStyle = '#00ff00';
            }
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            
            // Snake border
            this.ctx.strokeStyle = '#1a1a2e';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff5f56';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize, this.gridSize);
        
        // Food border
        this.ctx.strokeStyle = '#1a1a2e';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize, this.gridSize);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        this.showGameOver();
        this.updateDisplay();
        
        document.getElementById('startGame').disabled = false;
        document.getElementById('pauseGame').disabled = true;
    }
    
    showGameOver() {
        let gameOverDiv = document.getElementById('gameOver');
        if (!gameOverDiv) {
            gameOverDiv = document.createElement('div');
            gameOverDiv.id = 'gameOver';
            gameOverDiv.className = 'game-over';
            gameOverDiv.innerHTML = `
                <h2>GAME OVER</h2>
                <p>Final Score: ${this.score}</p>
                <p>High Score: ${this.highScore}</p>
                <button onclick="snakeGame.resetGame()" class="game-btn">PLAY AGAIN</button>
            `;
            this.canvas.parentNode.appendChild(gameOverDiv);
        }
    }
    
    hideGameOver() {
        const gameOverDiv = document.getElementById('gameOver');
        if (gameOverDiv) {
            gameOverDiv.remove();
        }
    }
    
    showPauseMessage() {
        let pauseDiv = document.getElementById('pauseMessage');
        if (!pauseDiv) {
            pauseDiv = document.createElement('div');
            pauseDiv.id = 'pauseMessage';
            pauseDiv.className = 'pause-overlay';
            pauseDiv.textContent = 'GAME PAUSED';
            this.canvas.parentNode.appendChild(pauseDiv);
        }
    }
    
    hidePauseMessage() {
        const pauseDiv = document.getElementById('pauseMessage');
        if (pauseDiv) {
            pauseDiv.remove();
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
                case 'p':
                case 'P':
                    this.pauseGame();
                    break;
                case 'r':
                case 'R':
                    this.resetGame();
                    break;
            }
        });
        
        // Button event listeners
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('pauseGame').addEventListener('click', () => this.pauseGame());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
    }
}

// Initialize the game when the page loads
let snakeGame;

function initializeSnakeGame() {
    snakeGame = new SnakeGame('gameCanvas');
    snakeGame.draw(); // Draw initial state
}

// Make sure the game initializes when the snake game tab is shown
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game when snake game tab is activated
    const snakeTabBtn = document.querySelector('[data-tab="snake-game"]');
    if (snakeTabBtn) {
        snakeTabBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (!snakeGame) {
                    initializeSnakeGame();
                }
            }, 100);
        });
    }
    
    // Also initialize if the page loads on snake game tab
    if (document.getElementById('snake-game-tab')?.classList.contains('active')) {
        initializeSnakeGame();
    }
});