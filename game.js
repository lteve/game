const Direction = {
  Up: 1,
  Down: 2,
  Left: 3,
  Right: 4,
};

class Snake {
  constructor() {
    this.length = 3;
    this.body = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    this.direction = Direction.Right;
  }

  move() {
    const head = this.body[0];
    let newHead = null;

    switch (this.direction) {
      case Direction.Up:
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case Direction.Down:
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case Direction.Left:
        newHead = { x: head.x - 1, y: head.y };
        break;
      case Direction.Right:
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    this.body.unshift(newHead);
    if (this.body.length > this.length) {
      this.body.pop();
    }
  }

  changeDirection(newDirection) {
    if (this.isOppositeDirection(newDirection)) {
      return;
    }

    this.direction = newDirection;
  }

  isOppositeDirection(newDirection) {
    return (
      (this.direction === Direction.Up && newDirection === Direction.Down) ||
      (this.direction === Direction.Down && newDirection === Direction.Up) ||
      (this.direction === Direction.Left && newDirection === Direction.Right) ||
      (this.direction === Direction.Right && newDirection === Direction.Left)
    );
  }

  grow() {
    this.length++;
  }

  collidesWithFood(food) {
    const head = this.body[0];
    return head.x === food.x && head.y === food.y;
  }

  collidesWithWall(width, height) {
    const head = this.body[0];
    return (
      head.x < 0 || head.x >= width || head.y < 0 || head.y >= height
    );
  }

  collidesWithSelf() {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (this.body[i].x === head.x && this.body[i].y === head.y) {
        return true;
      }
    }
    return false;
  }
}

class Food {
  constructor(width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
  }
}

class Game {
  constructor(canvas, context, width, height) {
    this.canvas = canvas;
    this.context = context;
    this.width = width;
    this.height = height;
    this.snake = new Snake();
    this.food = new Food(width, height);
    this.running = false;
    this.score = 0;
  }

  start() {
    this.running = true;
    this.draw();
    this.run();
  }

  run() {
    setTimeout(() => {
      if (!this.running) {
        return;
      }

      this.update();
      if (this.isGameOver()) {
        this.running = false;
        this.onGameOver();
      } else {
        this.run();
      }
    }, 100);
  }

  // update() {
  //   this.snake.move();
  //   if (this.snake.collidesWithFood(this.food)) {
  //     this.snake
  update() {
    this.snake.move();
    if (this.snake.collidesWithFood(this.food)) {
      this.snake.grow();
      this.score += 10;
      this.spawnFood();
    }
    if (this.snake.checkCollision()) {
      this.gameOver = true;
    }
  }
  
