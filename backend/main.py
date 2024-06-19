from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from game import TicTacToeGame

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game = TicTacToeGame()
clients = []

async def send_game_state():
    for client in clients:
        await client.send_json({
            "board": game.board,
            "currentPlayer": game.current_player,
            "winner": game.winner
        })

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    print("WebSocket connection established")
    try:
        await send_game_state()  # Send initial game state
        while True:
            data = await websocket.receive_json()
            print("Message received:", data)
            move = data.get("move")
            player = data.get("player")
            if move and player and not game.winner:  # Don't accept moves if the game is already won
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
