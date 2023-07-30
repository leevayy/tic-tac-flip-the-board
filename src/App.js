import React, { useState } from "react";

export default function Game() {


	return <Board />
}

function Board() {
	const width = 3;
	const height = 3;

    const [board, setBoard] = useState(() => {
        const defaultSquareValue = '';
        const initialBoard = [];
		// filling up 2d array with id's for each cell
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push(defaultSquareValue);
            }
            initialBoard.push(row);
        }
        return initialBoard;
    });

	function changeSquareValue(square) {
		// to identify cell we need to do some math.
		// since each id=y*width+x
		// y=(id-x)//width and x=id%width
		let id = square.target.id;
		let x = id%width;
		let y = Math.floor( (id - x) / width )
		
		if (board[y][x] === '') {
			const newBoard = [...board];
			newBoard[y][x] = 'X'
			setBoard( newBoard );
		}
	}

	return board.map((boardRow, y) => (
		<div className="board-row">
			{boardRow.map( (val, x) => {
				let id = y * width + x;
				return <Square id={id} value={val} handleClick={changeSquareValue}></Square>
			})}
		</div>
	));
}

function Square({id, value, handleClick}) {
	return <button className="square" onClick={handleClick} id={id}>{value}</button>;
}
