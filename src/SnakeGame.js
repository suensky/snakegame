import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const gridSize = 20;

function SnakeGame() {
    const [snake, setSnake] = useState([{x: 2, y: 2}]);
    const [food, setFood] = useState({x: 5, y: 5});
    const [direction, setDirection] = useState('RIGHT');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [milestones, setMilestones] = useState([5, 10, 20, 40, 80]);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
                case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
                case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
                case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
                default: break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    useEffect(() => {
        if (!gameActive || gameOver) return;

        const moveSnake = () => {
            setSnake(prev => {
                const newHead = { ...prev[0] };

                switch (direction) {
                    case 'UP': newHead.y -= 1; break;
                    case 'DOWN': newHead.y += 1; break;
                    case 'LEFT': newHead.x -= 1; break;
                    case 'RIGHT': newHead.x += 1; break;
                    default: break;
                }

                // Check for border collisions
                if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
                    setGameOver(true);
                    setGameActive(false);
                    return [...prev];
                }

                const newSnake = [newHead, ...prev.slice(0, -1)];

                if (newHead.x === food.x && newHead.y === food.y) {
                    newSnake.push(prev[prev.length - 1]);
                    setScore(score + 1);
                    if (milestones.includes(score + 1)) {
                        setLevel(level + 1);
                    }
                    placeFood();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, 200 / level);

        return () => clearInterval(interval);
    }, [snake, direction, food, score, level, milestones, gameActive, gameOver]);

    const placeFood = () => {
        let newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
        };
        setFood(newFood);
    };

    const startGame = () => {
        setGameActive(true);
        setGameOver(false);
        setSnake([{x: 2, y: 2}]);
        setScore(0);
        setLevel(1);
        placeFood();
    };

    const pauseGame = () => {
        setGameActive(false);
    };

    return (
        <div className="game-area">
            {snake.map((block, i) => (
                <div key={i} className="snake-block" style={{ top: `${block.y * 5}%`, left: `${block.x * 5}%` }} />
            ))}
            <div className="food-block" style={{ top: `${food.y * 5}%`, left: `${food.x * 5}%` }} />
            <div className="score">Score: {score}</div>
            <div className="level">Level: {level}</div>
            <div className="game-over" style={{ display: gameOver ? 'block' : 'none' }}>Game Over!</div>
            <button onClick={startGame} disabled={gameActive && !gameOver}>Start</button>
            <button onClick={pauseGame} disabled={!gameActive}>Pause</button>
            <button onClick={startGame} disabled={gameActive && !gameOver}>Resume</button>
        </div>
    );
}

export default SnakeGame;
