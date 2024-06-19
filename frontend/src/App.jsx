import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    // State to manage the board, player, current player, winner, draw state, and WebSocket connection
    const [board, setBoard] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);
    const [player, setPlayer] = useState("X");
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [winner, setWinner] = useState(null);  // State to track the winner
    const [draw, setDraw] = useState(false);  // State to track draw
    const [ws, setWs] = useState(null);

    // Function to establish WebSocket connection
    const connectWebSocket = () => {
        const websocket = new WebSocket("ws://localhost:8000/ws");

        websocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        websocket.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
            const data = JSON.parse(event.data);
            setBoard(data.board);
            setCurrentPlayer(data.currentPlayer);
            if (data.winner) {
                setWinner(data.winner);
            }
            if (data.draw) {
                setDraw(data.draw);
            }
        };

        websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        websocket.onclose = () => {
            console.log("WebSocket connection closed, attempting to reconnect...");
            setTimeout(connectWebSocket, 1000); // Try to reconnect every second
        };

        setWs(websocket);
    };

    // useEffect to establish WebSocket connection on component mount
    useEffect(() => {
        connectWebSocket();
    }, []);

    // useEffect to display alert when there's a winner or a draw
    useEffect(() => {
        if (winner) {
            alert(`${winner} wins!`);
        } else if (draw) {
            alert(`It's a draw!`);
        }
    }, [winner, draw]);

    // Function to handle making a move
    const makeMove = (x, y) => {
        if (winner || draw) {
            console.log("Game over, cannot make a move");
            return;
        }
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log("Cannot send move: WebSocket not open");
        } else if (board[x][y] !== "") {
            console.log("Cannot send move: Invalid move, cell is already occupied");
        } else if (player !== currentPlayer) {
            console.log("Player = " + player + " current player = " + currentPlayer);
            console.log("Setting player to current player");
            setPlayer(currentPlayer); // Set player to currentPlayer
        } else {
            console.log("Sending move:", { move: [x, y], player });
            ws.send(JSON.stringify({ move: [x, y], player }));
            setPlayer(player === "X" ? "O" : "X"); // Switch player after a valid move
        }
    };

    return (
        <div>
            <h1>Tic Tac Toe</h1>
            <div className="board-container">
                {board.map((row, x) =>
                    row.map((cell, y) => (
                        <div
                            key={`${x}-${y}`}
                            onClick={() => makeMove(x, y)}
                            style={{
                                width: '100px',
                                height: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid black',
                                fontSize: '24px'
                            }}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>
            <p>Current Player: {currentPlayer}</p>
        </div>
    );
};

export default App;
