(function () {
  const STORAGE_KEY = 'aj7931-snake-high-score';
  const GRID_SIZE = 20;
  const TICK_MS = 140;
  const SWIPE_THRESHOLD = 28;
  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  class SnakeGame {
    constructor(root) {
      this.root = root;
      this.cells = [];
      this.timerId = null;
      this.status = 'ready';
      this.direction = DIRECTIONS.right;
      this.nextDirection = DIRECTIONS.right;
      this.snake = [];
      this.food = { x: 0, y: 0 };
      this.score = 0;
      this.highScore = this.readHighScore();
      this.touchStart = null;
      this.hasBoard = Boolean(root);
      this.shell = root ? root.closest('.game-shell') : null;
      this.effectLayer = null;
      this.effectTimer = null;

      if (!this.hasBoard) {
        return;
      }

      this.buildBoard();
      this.reset(false);
      this.bindEvents();
      this.render();
      this.updateStatus('Ready');
      this.updateScoreBoard();
    }

    readHighScore() {
      try {
        return Number(localStorage.getItem(STORAGE_KEY) || 0);
      } catch (_error) {
        return 0;
      }
    }

    writeHighScore(value) {
      try {
        localStorage.setItem(STORAGE_KEY, String(value));
      } catch (_error) {
        // Ignore storage failures in restricted browser contexts.
      }
    }

    buildBoard() {
      const fragment = document.createDocumentFragment();
      this.root.innerHTML = '';
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
        const cell = document.createElement('div');
        cell.className = 'snake-cell';
        fragment.appendChild(cell);
        this.cells.push(cell);
      }
      this.effectLayer = document.createElement('div');
      this.effectLayer.className = 'snake-effects';
      this.root.appendChild(fragment);
      this.root.appendChild(this.effectLayer);
    }

    bindEvents() {
      document.addEventListener('keydown', (event) => this.handleKeydown(event));

      this.root.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        if (touch) {
          this.touchStart = { x: touch.clientX, y: touch.clientY };
        }
      }, { passive: true });

      this.root.addEventListener('touchmove', (event) => {
        if (!this.touchStart) {
          return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
          return;
        }

        const deltaX = touch.clientX - this.touchStart.x;
        const deltaY = touch.clientY - this.touchStart.y;
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < SWIPE_THRESHOLD) {
          return;
        }

        event.preventDefault();
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          this.setDirection(deltaX > 0 ? 'right' : 'left');
        } else {
          this.setDirection(deltaY > 0 ? 'down' : 'up');
        }
        this.touchStart = null;
      }, { passive: false });

      this.root.addEventListener('touchend', () => {
        this.touchStart = null;
      });

      document.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', () => this.handleAction(button.dataset.action));
      });

      document.querySelectorAll('[data-direction]').forEach((button) => {
        button.addEventListener('click', () => this.setDirection(button.dataset.direction));
      });
    }

    handleKeydown(event) {
      if (!this.shell || !this.shell.contains(document.activeElement)) {
        return;
      }

      const key = event.key.toLowerCase();
      const mapping = {
        arrowup: 'up',
        arrowdown: 'down',
        arrowleft: 'left',
        arrowright: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      if (mapping[key]) {
        if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
          return;
        }
        event.preventDefault();
        this.setDirection(mapping[key]);
        return;
      }

      if (key === ' ' || key === 'spacebar') {
        event.preventDefault();
        this.togglePause();
      }
    }

    handleAction(action) {
      if (action === 'start') {
        if (this.status === 'running') {
          return;
        }
        if (this.status === 'paused') {
          this.resume();
          return;
        }
        this.start();
        return;
      }

      if (action === 'pause') {
        this.togglePause();
        return;
      }

      if (action === 'toggle') {
        this.togglePause();
        return;
      }

      if (action === 'restart') {
        this.restart();
      }
    }

    setDirection(name) {
      if (!DIRECTIONS[name]) {
        return;
      }

      const current = this.nextDirection || this.direction;
      const next = DIRECTIONS[name];
      const isReverse = current.x + next.x === 0 && current.y + next.y === 0;
      if (isReverse || (current.x === next.x && current.y === next.y)) {
        return;
      }

      this.nextDirection = next;
    }

    start() {
      if (this.status === 'running') {
        return;
      }

      if (this.status !== 'paused') {
        this.reset(true);
      }

      this.status = 'running';
      this.updateStatus('Running');
      this.startLoop();
      this.root.focus({ preventScroll: true });
    }

    resume() {
      if (this.status !== 'paused') {
        return;
      }

      this.status = 'running';
      this.updateStatus('Running');
      this.startLoop();
      this.root.focus({ preventScroll: true });
    }

    togglePause() {
      if (this.status === 'running') {
        this.pause();
      } else if (this.status === 'paused') {
        this.resume();
      }
    }

    pause() {
      if (this.status !== 'running') {
        return;
      }

      this.status = 'paused';
      this.updateStatus('Paused');
      this.stopLoop();
    }

    restart() {
      this.reset(true);
      this.start();
    }

    reset(clearScore) {
      this.stopLoop();
      this.clearEffects();
      this.direction = DIRECTIONS.right;
      this.nextDirection = DIRECTIONS.right;
      this.snake = [
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
      ];
      this.food = this.spawnFood();
      if (clearScore) {
        this.score = 0;
      }
      this.status = 'ready';
      this.updateStatus('Ready');
      this.updateScoreBoard();
      this.render();
    }

    startLoop() {
      this.stopLoop();
      this.timerId = window.setInterval(() => this.tick(), TICK_MS);
    }

    stopLoop() {
      if (this.timerId !== null) {
        window.clearInterval(this.timerId);
        this.timerId = null;
      }
    }

    tick() {
      if (this.status !== 'running') {
        return;
      }

      this.direction = this.nextDirection;
      const head = this.snake[0];
      const nextHead = {
        x: head.x + this.direction.x,
        y: head.y + this.direction.y,
      };

      const willGrow = nextHead.x === this.food.x && nextHead.y === this.food.y;
      if (this.isWallCollision(nextHead) || this.isSelfCollision(nextHead, willGrow)) {
        this.gameOver();
        return;
      }

      this.snake.unshift(nextHead);

      if (willGrow) {
        this.score += 10;
        this.highScore = Math.max(this.highScore, this.score);
        this.writeHighScore(this.highScore);
        this.spawnEatEffect(nextHead);
        this.food = this.spawnFood();
      } else {
        this.snake.pop();
      }

      this.updateScoreBoard();
      this.render();
    }

    gameOver() {
      this.status = 'gameover';
      this.stopLoop();
      this.updateStatus('Game Over');
      this.highScore = Math.max(this.highScore, this.score);
      this.writeHighScore(this.highScore);
      this.updateScoreBoard();
      this.render();
    }

    isWallCollision(point) {
      return point.x < 0 || point.y < 0 || point.x >= GRID_SIZE || point.y >= GRID_SIZE;
    }

    isSelfCollision(point, willGrow) {
      const body = willGrow ? this.snake : this.snake.slice(0, -1);
      return body.some((segment) => segment.x === point.x && segment.y === point.y);
    }

    spawnFood() {
      const available = [];
      for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
          if (!this.snake.some((segment) => segment.x === x && segment.y === y)) {
            available.push({ x, y });
          }
        }
      }

      const index = Math.floor(Math.random() * available.length);
      return available[index] || { x: 0, y: 0 };
    }

    clearEffects() {
      if (this.effectTimer !== null) {
        window.clearTimeout(this.effectTimer);
        this.effectTimer = null;
      }
      if (this.effectLayer) {
        this.effectLayer.innerHTML = '';
      }
    }

    spawnEatEffect(point) {
      if (!this.effectLayer) {
        return;
      }

      const boardRect = this.root.getBoundingClientRect();
      const cellSize = boardRect.width / GRID_SIZE;
      const centerX = (point.x + 0.5) * cellSize;
      const centerY = (point.y + 0.5) * cellSize;

      this.clearEffects();

      const pulse = document.createElement('span');
      pulse.className = 'snake-pulse';
      pulse.style.left = `${centerX}px`;
      pulse.style.top = `${centerY}px`;
      this.effectLayer.appendChild(pulse);

      const particleCount = 8;
      for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'snake-particle';
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.35;
        const distance = cellSize * (0.85 + Math.random() * 1.15);
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
        particle.style.animationDelay = `${Math.random() * 90}ms`;
        this.effectLayer.appendChild(particle);
      }

      this.effectTimer = window.setTimeout(() => {
        if (this.effectLayer) {
          this.effectLayer.innerHTML = '';
        }
        this.effectTimer = null;
      }, 720);
    }

    updateStatus(value) {
      const statusNode = document.querySelector('#game-status');
      if (statusNode) {
        statusNode.textContent = value;
      }
    }

    updateScoreBoard() {
      const scoreNode = document.querySelector('#score');
      const highScoreNode = document.querySelector('#high-score');
      if (scoreNode) {
        scoreNode.textContent = String(this.score);
      }
      if (highScoreNode) {
        highScoreNode.textContent = String(this.highScore);
      }
    }

    render() {
      if (!this.hasBoard) {
        return;
      }

      const snakeCells = new Set(this.snake.map((segment) => `${segment.x}:${segment.y}`));
      const headKey = this.snake.length > 0 ? `${this.snake[0].x}:${this.snake[0].y}` : null;
      const foodKey = `${this.food.x}:${this.food.y}`;

      for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
          const index = y * GRID_SIZE + x;
          const cell = this.cells[index];
          if (!cell) {
            continue;
          }

          cell.className = 'snake-cell';
          const key = `${x}:${y}`;
          if (key === foodKey) {
            cell.classList.add('is-food');
          }
          if (snakeCells.has(key)) {
            cell.classList.add('is-snake');
          }
          if (key === headKey) {
            cell.classList.add('is-head');
          }
        }
      }
    }
  }

  window.createSnakeGame = function createSnakeGame() {
    const board = document.querySelector('#snake-board');
    if (!board) {
      return null;
    }

    if (window.__snakeGameInstance) {
      return window.__snakeGameInstance;
    }

    window.__snakeGameInstance = new SnakeGame(board);
    return window.__snakeGameInstance;
  };
}());
