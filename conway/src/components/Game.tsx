import React, { useState, useEffect, useRef } from 'react';
import "./styles/Game.css"

const gridTemplate = (size: number = 100) => Array(size).fill(0).map(() => Array(size).fill(0));
const rowNumber: number = 100;
const colNumber: number = 100;

const Game: React.FC = () => {
    const [grid, setGrid] = useState(() => gridTemplate());
    const [gameState, setGameState] = useState(false);
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;

    useEffect(() => {

        if (gameState === true) {
            initiateSim(grid)
        };

    }, [gameState])

    const updateCell = (
        grid: any,
        rIndex: any,
        cIndex: any
    ) => {

        // * NEW GRID COPY
        const newGrid = [...grid];

        // * UPDATE SPECIFIC INDEX'S
        if (!grid[rIndex][cIndex]) {
            grid[rIndex][cIndex] = 1
        } else {
            grid[rIndex][cIndex] = 0
        }

        // * UPDATE GRID STATE
        newGrid[rIndex] = grid[rIndex];
        setGrid(newGrid);
    }

    const initiateSim = (grid: any) => {

        if (gameStateRef.current === false) {
            const newGrid = gridTemplate();
            return setGrid(newGrid)
        }

        // * NEW GRID COPY
        const newGrid = [...grid];

        const neighborCheck = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, -1],
            [-1, 1],
            [1, 1],
            [-1, -1]
        ];

        if (gameStateRef.current === true) {

            // * CHECK AND UPDATE POSITIONS
            for (let i = 0; i < rowNumber; i++) {
                for (let c = 0; c < colNumber; c++) {
                    let cellState = 0;

                    neighborCheck.forEach(([x, y]) => {
                        const positionX = i + x;
                        const positionY = c + y;

                        if (
                            positionX >= 0 &&
                            positionX < rowNumber &&
                            positionY >= 0 &&
                            positionY < colNumber
                        ) cellState += grid[positionX][positionY];
                    })

                    if (cellState < 2 || cellState > 3) {
                        newGrid[i][c] = 0;
                    } else if (grid[i][c] === 0 && cellState === 3) {
                        newGrid[i][c] = 1;
                    }
                }
            }

            // * UPDATE GRID
            setGrid(newGrid);
        } 

        if (gameState) setTimeout(() => initiateSim(grid), 10);
    }

    return (
        <>
            <button
                onClick={() => {setGameState(!gameState)}}>{!gameState ? "start" : "stop"}</button>
            <main className="grid__container">
                {
                    grid.map((rows, rIndex) => rows.map(
                        (col, cIndex) => <div
                            key={rIndex + cIndex}
                            onClick={() => updateCell(grid, rIndex, cIndex)}
                            style={{
                                border: "solid 1px black",
                                backgroundColor: grid[rIndex][cIndex] ? "blue" : "white",
                                width: 10,
                                height: 10,
                            }}>
                        </div>
                    ))
                }
            </main>
        </>
    );
}

export default Game;