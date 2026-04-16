import React, { useRef, useEffect, useState } from 'react';
// import { loadPyodide } from 'pyodide';

const DinoGame = () => {
    const canvasRef = useRef(null);
    const animationIdRef = useRef(null);
    const drawRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [pyodideReady, setPyodideReady] = useState(false);
    const pyodideRef = useRef(null);

    useEffect(() => {
        const initPyodide = async () => {
            try {
                const pyodide = await window.loadPyodide();
                pyodideRef.current = pyodide;

                // Código Python para el minijuego
                const pythonCode = `
import time

# Variables del juego
dino = {'x': 50, 'y': 150, 'width': 20, 'height': 20, 'dy': 0, 'jumping': False}
obstacles = []
frame = 0
score = 0
game_over = False
gravity = 0.6
jump_strength = -12
canvas_width = 400
canvas_height = 200

def jump():
    global dino
    if not dino['jumping']:
        dino['dy'] = jump_strength
        dino['jumping'] = True

def update():
    global dino, obstacles, frame, score, game_over
    if game_over:
        return {'dino': dino, 'obstacles': obstacles, 'score': score, 'game_over': game_over}

    # Actualizar dino
    dino['y'] += dino['dy']
    dino['dy'] += gravity

    if dino['y'] > 150:
        dino['y'] = 150
        dino['dy'] = 0
        dino['jumping'] = False

    # Generar obstáculos
    if frame % 100 == 0:
        obstacles.append({'x': canvas_width, 'y': 150, 'width': 20, 'height': 20})

    # Actualizar obstáculos
    new_obstacles = []
    for obs in obstacles:
        obs['x'] -= 5
        if obs['x'] + obs['width'] >= 0:
            new_obstacles.append(obs)
        else:
            score += 1
    obstacles[:] = new_obstacles

    # Verificar colisión
    for obs in obstacles:
        if (dino['x'] < obs['x'] + obs['width'] and
            dino['x'] + dino['width'] > obs['x'] and
            dino['y'] < obs['y'] + obs['height'] and
            dino['y'] + dino['height'] > obs['y']):
            game_over = True
            break

    frame += 1
    return {'dino': dino, 'obstacles': obstacles, 'score': score, 'game_over': game_over}

def reset():
    global dino, obstacles, frame, score, game_over
    dino = {'x': 50, 'y': 150, 'width': 20, 'height': 20, 'dy': 0, 'jumping': False}
    obstacles = []
    frame = 0
    score = 0
    game_over = False
`;

                await pyodide.runPythonAsync(pythonCode);
                setPyodideReady(true);
            } catch (error) {
                // silence initialization errors
            }
        };

        initPyodide();
    }, []);

    useEffect(() => {
        if (!pyodideReady) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            try {
                const pyodide = pyodideRef.current;
                const updateFn = pyodide.globals.get('update');
                updateFn();
                updateFn.destroy();

                const toPlainObject = (value) => {
                    if (value instanceof Map) {
                        return Object.fromEntries(value);
                    }
                    return value;
                };

                let dinoJs = pyodide.globals.get('dino').toJs();
                dinoJs = toPlainObject(dinoJs);

                let obstaclesJs = pyodide.globals.get('obstacles').toJs({ depth: 2 });
                if (Array.isArray(obstaclesJs)) {
                    obstaclesJs = obstaclesJs.map(item => toPlainObject(item));
                }

                const scoreJs = pyodide.globals.get('score');
                const gameOverJs = pyodide.globals.get('game_over');

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw dino
                ctx.fillStyle = 'green';
                ctx.fillRect(dinoJs.x, dinoJs.y, dinoJs.width, dinoJs.height);

                // Draw obstacles
                ctx.fillStyle = 'red';
                obstaclesJs.forEach(obs => {
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                });

                // Draw ground
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 170, canvas.width, 2);

                setScore(scoreJs);
                setGameOver(gameOverJs);

                if (!gameOverJs) {
                    animationIdRef.current = requestAnimationFrame(draw);
                }
            } catch (error) {
                // no-op
            }
        };

        drawRef.current = draw;
        draw();

        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        };
    }, [pyodideReady]);

    const handleJump = () => {
        if (pyodideReady && !gameOver) {
            pyodideRef.current.globals.get('jump')();
        }
    };

    const restartGame = () => {
        if (pyodideReady) {
            pyodideRef.current.globals.get('reset')();
            setGameOver(false);
            setScore(0);
            if (drawRef.current) {
                if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
                drawRef.current();
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            handleJump();
        }
    };

    const handleClick = () => {
        handleJump();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        const canvas = canvasRef.current;
        if (canvas) canvas.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            if (canvas) canvas.removeEventListener('click', handleClick);
        };
    }, [pyodideReady, gameOver]);

    return (
        <div className="flex flex-col items-center">
            {!pyodideReady ? (
                <p>Cargando minijuego...</p>
            ) : (
                <>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={200}
                        className="border border-gray-400"
                    />
                    <p className="mt-2">Puntuación: {score}</p>
                    {gameOver && (
                        <div className="mt-4">
                            <p className="text-red-500">¡Game Over!</p>
                            <button
                                onClick={restartGame}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Reiniciar
                            </button>
                        </div>
                    )}
                    <p className="mt-2 text-sm text-gray-600">Presiona Espacio o haz clic para saltar</p>
                </>
            )}
        </div>
    );
};

export default DinoGame;