import React, { useState, useEffect, useCallback, useRef } from 'react';
import SoundManager from '../utils/SoundManager';
import GameSettings from './GameSettings';
import './SnakeGame.css';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0);
  const [gameSpeed, setGameSpeed] = useState(150);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [baseDifficulty, setBaseDifficulty] = useState(150);
  
  const gameLoopRef = useRef();
  const soundManagerRef = useRef(new SoundManager());

  // 生成随机食物位置
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // 检查碰撞
  const checkCollision = useCallback((head, snakeBody) => {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }
    // 检查自身碰撞
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // 游戏主循环
  const gameLoop = useCallback(() => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // 检查碰撞
      if (checkCollision(head, newSnake)) {
        if (soundEnabled) {
          soundManagerRef.current.playGameOverSound();
        }
        setGameOver(true);
        setGameStarted(false);
        return prevSnake;
      }

      newSnake.unshift(head);

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        if (soundEnabled) {
          soundManagerRef.current.playEatSound();
        }
        setScore(prevScore => {
          const newScore = prevScore + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        
        // 根据分数增加游戏速度
        if (score > 0 && score % 50 === 0) {
          setGameSpeed(prev => Math.max(baseDifficulty - 50, prev - 10));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, checkCollision, generateFood, highScore]);

  // 键盘事件处理
  const handleKeyPress = useCallback((e) => {
    // 对于空格键，始终处理以防止默认行为
    if (e.key === ' ') {
      e.preventDefault();
      if (gameOver) {
        resetGame();
      } else {
        // 播放开始/暂停音效
        if (soundEnabled) {
          if (!gameStarted) {
            soundManagerRef.current.playStartSound();
          }
        }
        setGameStarted(prev => !prev);
      }
      return;
    }

    // 对于方向键，只在游戏进行中处理
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setDirection(prev => prev.y === 1 ? prev : { x: 0, y: -1 });
        break;
      case 'ArrowDown':
        e.preventDefault();
        setDirection(prev => prev.y === -1 ? prev : { x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setDirection(prev => prev.x === 1 ? prev : { x: -1, y: 0 });
        break;
      case 'ArrowRight':
        e.preventDefault();
        setDirection(prev => prev.x === -1 ? prev : { x: 1, y: 0 });
        break;
    }
  }, [gameStarted, gameOver, soundEnabled]);

  // 重置游戏
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setGameSpeed(baseDifficulty);
  };

  // 处理难度变化
  const handleDifficultyChange = (newSpeed) => {
    setBaseDifficulty(newSpeed);
    setGameSpeed(newSpeed);
  };

  // 开始游戏
  const startGame = () => {
    if (gameOver) {
      resetGame();
    }
    if (soundEnabled) {
      soundManagerRef.current.playStartSound();
    }
    setGameStarted(true);
  };

  // 设置游戏循环
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, gameSpeed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, gameLoop, gameSpeed]);

  // 添加键盘事件监听器
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="snake-game">
      <h1 className="game-title">🐍 贪吃蛇游戏</h1>
      
      <div className="score-board">
        <div className="score">得分: {score}</div>
        <div className="high-score">最高分: {highScore}</div>
        <div className="game-speed">速度: {Math.round((200 - gameSpeed) / 10)}</div>
      </div>

      <div className="game-settings">
        <label className="sound-toggle">
          <input 
            type="checkbox" 
            checked={soundEnabled} 
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          🔊 音效
        </label>
        <button 
          className="settings-btn" 
          onClick={() => setShowSettings(true)}
          disabled={gameStarted && !gameOver}
        >
          ⚙️ 设置
        </button>
      </div>

      <div className="game-container">
        <div className="game-board">
          {Array.from({ length: BOARD_SIZE }, (_, y) =>
            Array.from({ length: BOARD_SIZE }, (_, x) => {
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
              const isFood = food.x === x && food.y === y;
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${isSnake ? 'snake' : ''} ${isHead ? 'head' : ''} ${isFood ? 'food' : ''}`}
                />
              );
            })
          )}
        </div>

        <div className="game-controls">
          {!gameStarted && !gameOver && (
            <button className="start-button" onClick={startGame}>
              开始游戏
            </button>
          )}
          
          {gameStarted && !gameOver && (
            <button className="pause-button" onClick={() => setGameStarted(false)}>
              暂停游戏
            </button>
          )}
          
          {gameOver && (
            <div className="game-over">
              <h2>😵 游戏结束!</h2>
              <p>最终得分: <span className="final-score">{score}</span></p>
              {score === Number(highScore) && score > 0 && (
                <p className="new-record">🏆 新记录!</p>
              )}
              <button className="restart-button" onClick={startGame}>
                🔄 重新开始
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="instructions">
        <h3>游戏说明:</h3>
        <ul>
          <li>使用方向键控制蛇的移动</li>
          <li>吃到食物得10分</li>
          <li>碰到墙壁或自己的身体游戏结束</li>
          <li>按空格键暂停/继续游戏</li>
        </ul>
      </div>

      <GameSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onDifficultyChange={handleDifficultyChange}
        currentDifficulty={baseDifficulty}
      />
    </div>
  );
};

export default SnakeGame;