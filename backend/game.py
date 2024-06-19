class TicTacToeGame:
    """
    A class to represent the game board and handling the business logic of the game
    """
    def __init__(self):
        self.board = [["" for _ in range(3)] for _ in range(3)]
        self.current_player = "X"
        self.winner = None
        self.draw = False

    def make_move(self, player, move):
        """
        Handling the players turns. After each turn check for a win, and if there is no win change the player.
        :param player:
        :param move:
        :return:
        """
        x, y = move
        if self.board[x][y] == "" and player == self.current_player:
            self.board[x][y] = player
            if self.check_winner(player):
                self.winner = player
            elif self.check_draw():
                self.draw = True
            else:
                self.current_player = "O" if player == "X" else "X"

    def check_winner(self, player):
        """
        A method to check if the player has won by iterating over the matrix and look for win.
        :param player:
        :return:
        """
        for i in range(3):
            if all([self.board[i][j] == player for j in range(3)]) or all([self.board[j][i] == player for j in range(3)]):
                return True
        if all([self.board[i][i] == player for i in range(3)]) or all([self.board[i][2 - i] == player for i in range(3)]):
            return True
        return False

    def check_draw(self):
        """
        Handles draw of the game.
        :return:
        """
        for row in self.board:
            if "" in row:
                return False
        print("It's a draw!")
        return True
