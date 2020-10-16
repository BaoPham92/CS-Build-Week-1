import React, { useState } from 'react';
import "./styles/Game.css"

const gridTemplate = (size: number = 100) => Array(size).fill(0).map(() => Array(size).fill(0));
const rowNumber = 100;
const colNumber = 100;

const Game: React.FC = () => {
    const [grid, setGrid] = useState(() => gridTemplate());

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

    return (
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
    );
}

export default Game;