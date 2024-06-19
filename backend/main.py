from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from game import TicTacToeGame

app = FastAPI()  # I chose FastAPI as it's robust and scale-able. It might be an overkill for this instance but I
# believe is a good practice.

origins = ["*"]

app.add_middleware(
    CORSMiddleware,  # Using CORS to handle requests from frontend in the Python backend
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game = TicTacToeGame()
clients = []


async def send_game_state():
    """
    Returns the current state of the game to the UI.
    :return:
    """
    for client in clients:
        await client.send_json({
            "board": game.board,
            "currentPlayer": game.current_player,
            "winner": game.winner,
            "draw": game.draw
        })


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Using websocket to have 'real-time' updates to the game instead of relying on single requests.
    :param websocket:
    :return:
    """
    await websocket.accept()
    clients.append(websocket)
    print("WebSocket connection established")
    try:
        await send_game_state()  # Send initial game state
        while True:
            data = await websocket.receive_json()
            print("Message received:", data)  # Would use logging in a real-world setting
            move = data.get("move")
            player = data.get("player")
            if move and player and not game.winner and not game.draw:  # Don't accept moves if the game is already
                # won or drawn
                game.make_move(player, move)
                await send_game_state()
    except WebSocketDisconnect:
        print("WebSocket disconnected")
        clients.remove(websocket)
    except Exception as e:
        print(f"Connection error: {e}")
        clients.remove(websocket)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
