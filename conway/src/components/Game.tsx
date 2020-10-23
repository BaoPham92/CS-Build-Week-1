import React, { useState, useCallback, useEffect, useRef } from 'react';
import produce from "immer";
import "./styles/Game.css"

const gridTemplate = (
    size: number = 50,
    random: boolean = false
) => Array(size).fill(0).map(() => {
    const cellState = Array(size).fill(0);

    if (random) {
        return cellState.map(() => Math.floor(Math.random() * 2))
    }

    return cellState
});
const rowNumber: number = 50;
const colNumber: number = 50;

const Game: React.FC = () => {
    const [grid, setGrid] = useState(() => gridTemplate(undefined, true));
    const [gameState, setGameState] = useState(true);
    const [menu, setMenu] = useState(false)
    const [menuInfo, setMenuInfo] = useState(false)
    const [reset, setReset] = useState({ restart: false, clear: false });
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;

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
                        } else if (grid[i][c] === 0 && cellState === 3)
                            newGrid[i][c] = 1;
                    }
                }
            })
        })

        setTimeout(() => initiateSim(), 10);
    }, [])

    useEffect(() => {
        const { clear, restart } = reset;

        if (restart || clear) {
            const newGrid = gridTemplate(undefined, clear ? false : true);
            setReset({ ...reset, restart: false, clear: false })

            if (clear === true) setGameState(false)

            return setGrid(newGrid)
        }

        if (gameState === true) initiateSim();

    }, [gameState, initiateSim, reset])

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
                                    border: "solid 0.5px #45A29E",
                                    backgroundColor: grid[rIndex][cIndex] ? "#66FCF1" : "#1F2833",
                                    width: 25,
                                    height: 25,
                                }}>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div
                onClick={() => setMenu(!menu)}
                className="menu-btn">
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className={
                `menu-info ${!menu ? '' : menuInfo ? 'menu-active' : ''}`
            }>
                <div>
                    <header>
                        <h2>About Conway's Game of Life</h2>
                    </header>

                    <p>
                        The Game of Life, also known simply as Life,
                        is a cellular automaton devised by the British mathematician
                        John Horton Conway in 1970. It is a zero-player game,
                        meaning that its evolution is determined by its initial state,
                        requiring no further input. One interacts with the Game of Life
                        by creating an initial configuration and observing how it evolves.
                        It is Turing complete and can simulate a universal constructor or
                        any other Turing machine.
                    </p>
                </div>
                <button className="menu-info_btn">
                    <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">
                        Learn More
                    </a>
                </button>
            </div>

            <div className={`menu ${menu ? 'menu-active' : ''}`}>
                <button
                    onClick={() => setMenu(!menu)}>
                    Close
                </button>

                <button
                    onClick={() => { setGameState(!gameState) }}>
                    {!gameState ? "Start" : "Stop"}
                </button>

                <button
                    onClick={() => { setReset({ ...reset, restart: true }) }}>
                    Restart
                </button>

                <button
                    onClick={() => { setReset({ ...reset, clear: true }) }}>
                    Clear
                </button>

                <button
                    onClick={() => setMenuInfo(!menuInfo)}>
                    About "Conway's Game Of Life"
                </button>
            </div>
        </div>
    );
}

export default Game;
