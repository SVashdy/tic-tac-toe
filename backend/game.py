class TicTacToeGame:
    def __init__(self):
        self.board = [["" for _ in range(3)] for _ in range(3)]
        self.current_player = "X"
        self.winner = None

    def make_move(self, player, move):
        x, y = move
        if self.board[x][y] == "" and player == self.current_player:
            self.board[x][y] = player
            if self.check_winner(player):
                self.winner = player
            else:
                self.current_player = "O" if player == "X" else "X"

    def check_winner(self, player):
        # Check rows, columns, and diagonals for a win
        for i in range(3):
            if all([self.board[i][j] == player for j in range(3)]) or all([self.board[j][i] == player for j in range(3)]):
                return True
        if all([self.board[i][i] == player for i in range(3)]) or all([self.board[i][2 - i] == player for i in range(3)]):
            return True
        return False
