import React, { useState } from "react";

export default function Game() {
	const initialGameState = {
		moveCount: 0,
		status: "Current move: X",
		statusClass: "X",
		finish: false
	};

	const [gameState, setGameState] = useState(initialGameState);

	const width = 3;
	const height = 3;

	const [board, setBoard] = useState(initBoard(width, height));

	function currentMove(moveCount) {
		return moveCount % 2 === 0 ? "X" : "O";
	}

	function handleOnMove() {
		const newMoveCount = gameState.moveCount + 1;
		const result = calculateWinner(board.flat());
		if (result) {
			const emojipool =
				"🥳 🎉 🎊 🎁 🎈 🤠 😍 🤩 🕺 💃 ✌️ 🤘 🤟 👆 👍 🙌 👏 🍰 🎂 🧁".split(
					/\s/g
				);
			const getEmoji = () =>
				emojipool[Math.floor(Math.random() * emojipool.length)];

			setGameState({
				moveCount: newMoveCount,
				statusClass: `win ${result}`,

				// TODO: make random emojis +
				// ! make them fly out
				status: `${getEmoji()} Yoo-hoo "${result}" won!! ${getEmoji()}`,
				finish: true
			});
		} else {
			setGameState({
				moveCount: newMoveCount,
				statusClass: `${currentMove(newMoveCount)}`,
				status: `Current move: ${currentMove(newMoveCount)}`,
				finish: false
			});
		}
	}

	return (
		<div className="game">
			<div className={`status ${gameState.statusClass}`}>
				{gameState.status}
			</div>
			<Board
				currentMove={currentMove(gameState.moveCount)}
				onMove={handleOnMove}
				width={width}
				height={height}
				board={board}
				setBoard={setBoard}
			/>
			{!gameState.finish ? (
				<ShuffleButton
					onMove={handleOnMove}
					board={board}
					setBoard={setBoard}
				/>
			) : (
				<RestartButton
					width={width}
					height={height}
					initialGameState={initialGameState}
					setBoard={setBoard}
					setGameState={setGameState}
				/>
			)}
		</div>
	);
}

function ShuffleButton({ onMove, board, setBoard }) {
	// TODO: fix shuffle to be random across everyting
	// * smth like flatten the array shuffle and then reassemble it
	function shuffle(array) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex !== 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex]
			];
		}

		return array;
	}

	function handleShuffle() {
		const newBoard = shuffle([...board.map((boardRow) => shuffle(boardRow))]);

		setBoard(newBoard);
	}

	return (
		<button
			className={"shuffle button"}
			onClick={() => {
				handleShuffle();
				onMove();
			}}
		>
			🔮SHUFFLE🎲
		</button>
	);
}

function RestartButton({
	width,
	height,
	setBoard,
	setGameState,
	initialGameState
}) {
	function handleRestart() {
		setGameState(initialGameState);
		setBoard(initBoard(width, height));
	}

	return (
		<button className="restart button" onClick={handleRestart}>
			☑️RESTART🔁
		</button>
	);
}

function Board({ currentMove, onMove, width, height, board, setBoard }) {
	function handleChangeSquareValue(id) {
		// to identify cell we need to do some math.
		// since each id=y*width+x
		// y=(id-x)//width and x=id%width
		let x = id % width;
		let y = Math.floor((id - x) / width);
		if (board[y][x] !== "" || calculateWinner(board.flat())) {
			return;
		}

		const newBoard = [...board];
		newBoard[y][x] = currentMove;
		onMove();
		setBoard(newBoard);
	}

	return (
		<div className="board">
			{board.map((boardRow, y) => (
				<div className="board-row">
					{boardRow.map((val, x) => {
						let id = y * width + x;
						return (
							<Square
								id={id}
								value={val}
								handleClick={() => handleChangeSquareValue(id)}
							></Square>
						);
					})}
				</div>
			))}
		</div>
	);
}

function Square({ id, value, handleClick }) {
	return (
		<button className={`square ${value}`} onClick={handleClick} id={id}>
			{value}
		</button>
	);
}

function initBoard(width, height) {
	const defaultSquareValue = "";
	const initialBoard = [];
	// filling up 2d array with empty strings
	for (let y = 0; y < height; y++) {
		const row = [];
		for (let x = 0; x < width; x++) {
			row.push(defaultSquareValue);
		}
		initialBoard.push(row);
	}
	return initialBoard;
}

function calculateWinner(flatBoard) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			flatBoard[a] &&
			flatBoard[a] === flatBoard[b] &&
			flatBoard[a] === flatBoard[c]
		) {
			return flatBoard[a];
		}
	}
	if (!flatBoard.includes("")) return "friendship";
	return null;
}
