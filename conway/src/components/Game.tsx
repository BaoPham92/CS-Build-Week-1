import React, { useState, useCallback, useEffect, useRef } from 'react';
import produce from "immer";
import "./styles/Game.css"

const gridTemplate = (size: number = 50) => Array(size).fill(0).map(() => Array(size).fill(0));
const rowNumber: number = 50;
const colNumber: number = 50;

const Game: React.FC = () => {
    const [grid, setGrid] = useState(() => gridTemplate());
    const [gameState, setGameState] = useState(false);
    const [reset, setReset] = useState(false);
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;

    useEffect(() => {

        if (reset === true) {
            const newGrid = gridTemplate();
            setReset(false)
            return setGrid(newGrid)
        }

        if (gameState === true) {
            initiateSim()
        };

    }, [gameState, reset])

    const updateCell = (
        grid: any,
        rIndex: any,
        cIndex: any
    ) => {
        // * NEW GRID COPY
        const newGrid: any = produce(grid, (copy: any) => {
            copy[rIndex][cIndex] = grid[rIndex][cIndex] ? 0 : 1;
        });

        // * UPDATE GRID STATE
        setGrid(newGrid);
    }

    const initiateSim = useCallback(() => {

        if (!gameStateRef.current) return null;

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

        setGrid(grid => {
            return produce(grid, newGrid => {
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
            })
        })

        setTimeout(() => initiateSim(), 10);
    }, [])

    return (
        <div className="board">
            <div className="grid__wrapper">
                <div className="grid__container">
                    {
                        grid.map((rows, rIndex) => rows.map(
                            (col, cIndex) => <div
                                key={rIndex + cIndex}
                                onClick={() => !gameState ? updateCell(grid, rIndex, cIndex) : undefined}
                                style={{
                                    border: "solid 0.5px black",
                                    backgroundColor: grid[rIndex][cIndex] ? "blue" : "white",
                                    width: 25,
                                    height: 25,
                                }}>
                            </div>
                        ))
                    }
                </div>
            </div>

            <button
                onClick={() => { setGameState(!gameState) }}>
                {!gameState ? "start" : "stop"}
            </button>

            <button
                onClick={() => { setReset(!reset) }}>
                reset
            </button>
        </div>
    );
}

export default Game;
