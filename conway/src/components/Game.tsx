import React, { useState } from 'react';
import "./styles/Game.css"

const gridTemplate = (
    rowNumber = 100,
    colNumber = 100,
    size = 100
) => Array(size).fill(0).map(() => Array(size).fill(0))

const Game: React.FC = () => {
    const [grid, setGrid] = useState(() => gridTemplate());

    return (
        <main className="grid__container">
            {
                grid.map((rows, rIndex) => rows.map(
                    (col, cIndex) => <div 
                    key={rIndex + cIndex} 
                    style={{
                        border: "solid 1px black",
                        background: grid[rIndex][cIndex] === 1 ? "blue" : "white",
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