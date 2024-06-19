import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure you import the CSS file

const App = () => {
    const [board, setBoard] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);
    const [player, setPlayer] = useState("X");
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [winner, setWinner] = useState(null);  // New state to track the winner
    const [ws, setWs] = useState(null);

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

    useEffect(() => {
        connectWebSocket();
    }, []);

    useEffect(() => {
        if (winner) {
            alert(`${winner} wins!`);
        }
    }, [winner]);

    const makeMove = (x, y) => {
        if (winner) {
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
