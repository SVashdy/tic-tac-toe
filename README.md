# Tic-Tac-Toe Game
This project is a real-time Tic-Tac-Toe game built with FastAPI for the backend and React + Vite for the frontend. The application uses WebSockets to facilitate real-time updates between players.

## Why WebSockets?
WebSockets were chosen for this project to enable real-time communication between the client and server. Unlike traditional HTTP requests that require continuous polling to check for updates, WebSockets maintain a persistent connection that allows the server to push updates to the client immediately. This is crucial for a game like Tic-Tac-Toe, where real-time updates ensure a smooth and responsive gaming experience.

## Project Structure
The project is divided into two main parts: the backend and the frontend.

## Backend
- main.py: This file contains the FastAPI application setup and the WebSocket endpoint to handle real-time communication.
- game.py: This file contains the logic for the Tic-Tac-Toe game, including the game state, player moves, and winner determination.
## Frontend
- App.jsx: This file contains the React component for the game interface, including the WebSocket client logic for communication with the backend.
- App.css: This file contains the styling for the game interface.

## How to Run
### Prerequisites
Ensure you have the following installed:

- Python 3.8 or higher
- Node.js and npm

### Backend Setup
Create a virtual environment and activate it:

1) `python -m venv venv`
   `source venv/bin/activate`
2) Install the required Python packages:
   `pip install fastapi uvicorn`
3) Navigate to the `/backend` directory and run the FastAPI server:
   `uvicorn main:app --reload`
The backend server will start at http://localhost:8000.

### Frontend Setup
1) Navigate to the frontend directory and install the npm packages:
   `npm install`
2) Start the Vite development server:
   `npm run dev`
The frontend will start at http://localhost:3000.

### Running the Application
1) Ensure the backend server is running at http://localhost:8000.
2) Open a browser and navigate to http://localhost:3000 to start playing the game.
3) To set a move double click on a box.

### Files and Directories

* /backend:
    * `game.py`: Contains the game logic.
    * `main.py`: Sets up the FastAPI server and handles Websockets.
* /frontend: standard Vite+React structure. `/src` contains the main pages and logic.