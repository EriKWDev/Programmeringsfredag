def clear_screen():
    """
    clears the screen
    :return: 100 epty lines
    """

    print ( "\n" * 50)


def create_test_board():
    """
    converts a visual representation of a board
    and converts it into a dictionary
    ex:

       1 2 3 4 5 6 7 8

    1  0 0 0 0 0 0 0 0
    2  0 0 0 0 0 0 0 0
    3  0 0 0 0 0 0 0 0
    4  0 0 0 1 2 0 0 0
    5  0 0 0 2 1 0 0 0
    6  0 0 0 0 0 0 0 0
    7  0 0 0 0 0 0 0 0
    8  0 0 0 0 0 0 0 0

    """
    # the current string can be manipulated and each changed element will be changed in the corresponding dictionary
    test_board_string =  """
       1 2 3 4 5 6 7 8
    1  0 0 0 2 2 0 0 0
    2  0 0 0 1 0 0 0 0
    3  0 0 1 1 0 0 0 0
    4  0 0 1 1 2 0 0 0
    5  0 0 0 2 1 0 0 0
    6  0 0 0 0 0 0 0 0
    7  0 0 0 0 0 0 0 0
    8  0 0 0 0 0 0 0 0
    """



    test_board_dictionary = {}
    for a in range(0, 8):
        for b in range(0, 8):
            test_board_dictionary[(a + 1, b + 1)] = int(test_board_string[31 + 2*b + 23*a])

    return test_board_dictionary



def create_starting_board():
    """
    creates an 8x8 list representing an 8x8 board
    each element is represented by a number
    0: empty square
    1: white square
    2: black square
    (4, 4) = 1
    (4, 5) = 2
    (5, 4) = 1
    (5, 5) = 2
    all other squares = 0

       1 2 3 4 5 6 7 8

    1  0 0 0 0 0 0 0 0
    2  0 0 0 0 0 0 0 0
    3  0 0 0 0 0 0 0 0
    4  0 0 0 1 2 0 0 0
    5  0 0 0 2 1 0 0 0
    6  0 0 0 0 0 0 0 0
    7  0 0 0 0 0 0 0 0
    8  0 0 0 0 0 0 0 0

    board = {(1, 1): 0, (1, 2): 0, (1, 3): 0, (1, 4): 0, (1, 5): 0, (1, 6): 0, (1, 7): 0, (1, 8): 0,
             (2, 1): 0, (2, 2): 0, (2, 3): 0, (2, 4): 0, (2, 5): 0, (2, 6): 0, (2, 7): 0, (2, 8): 0,
             (3, 1): 0, (3, 2): 0, (3, 3): 0, (3, 4): 0, (3, 5): 0, (3, 6): 0, (3, 7): 0, (3, 8): 0,
             (4, 1): 0, (4, 2): 0, (4, 3): 0, (4, 4): 1, (4, 5): 2, (4, 6): 0, (4, 7): 0, (4, 8): 0,
             (5, 1): 0, (5, 2): 0, (5, 3): 0, (5, 4): 2, (5, 5): 1, (5, 6): 0, (5, 7): 0, (5, 8): 0,
             (6, 1): 0, (6, 2): 0, (6, 3): 0, (6, 4): 0, (6, 5): 0, (6, 6): 0, (6, 7): 0, (6, 8): 0,
             (7, 1): 0, (7, 2): 0, (7, 3): 0, (7, 4): 0, (7, 5): 0, (7, 6): 0, (7, 7): 0, (7, 8): 0,
             (8, 1): 0, (8, 2): 0, (8, 3): 0, (8, 4): 0, (8, 5): 0, (8, 6): 0, (8, 7): 0, (8, 8): 0}

    """

    board = {}

    for a in range(1, 9):
        for b in range(1, 9):
            board[(a, b)] = 0

    board[(4, 4)] = 1
    board[(4, 5)] = 2
    board[(5, 4)] = 2
    board[(5, 5)] = 1

    return board


def check_for_replaceable_squares(board, current_square, direction, colour, square_list = None):
    """
    board: the current board
    current_square: the square we want to examine (tuple)
    direction: the direction of the check (int from 1 to 8 in iteration 1, then a tuple from line 124-139)
    colour: the colour of the player attempting a move (1 or 2)
    square_list: empty list in iteration 1, list containing

    starts at current_square and checks the next square in the chosen direction
    if there exists a line in the chosen direction from current_square consisting of consecutive
    opposite-colour coloured squares followed by a colour coloured square:
    return square_list which contains the opposite-coloured squares
    on the line between the starting square and the ending square
    if no line exists: return None

    1 2 3
    8 x 4 (each number represents a direction and x = latest_square)
    7 6 5

    """

    # determines the directional tuple, if it is already determined skips this step
    if type(direction) == tuple:
        pass
    else:
        if direction == 1:
            direction = (-1, -1)
        elif direction == 2:
            direction = (-1, 0)
        elif direction == 3:
            direction = (-1, 1)
        elif direction == 4:
            direction = (0, 1)
        elif direction == 5:
            direction = (1, 1)
        elif direction == 6:
            direction = (1, 0)
        elif direction == 7:
            direction = (1, -1)
        elif direction == 8:
            direction = (0, -1)



    # checks if the next square in direction exists (is on the board)
    next_square = (current_square[0] + direction[0], current_square[1] + direction[1])

    if 1 <= next_square[0]<= 8 and 1 <= next_square[1] <= 8:
        # next_square exists, checks the value of next_square
        if board[next_square] == 0:
            return
        elif board[current_square] == 0 and board[next_square] == colour:
            return
        elif board[next_square] != colour:
            # turn square_list into a list during first iteration
            if square_list == None:
                square_list = []

            square_list.append(next_square)

            return check_for_replaceable_squares(board, next_square, direction, colour, square_list)
        else:
            return square_list
    else:
        return





def check_available_moves(board, colour):
    """
    :param board: the current board (dictionary)
    :param colour: the colour represinting the player making a move (1 or 2)
    :return: all possible moves represented as tuples (list of tuples)
    """
    # a list containing all empty squares on the board
    empty_squares = []

    # adds all tuples representing empty squares to empty_squares
    for square in board:
        if board[square] == 0:
            empty_squares.append(square)

    # a list containing squares representing valid moves
    valid_squares = []

    # runs check_for_replaceable_squares in all directions on all squares in empty_squares and appends
    # all valid squares to valid_squares
    for square in empty_squares:
        for direction in range (1, 9):
            if type(check_for_replaceable_squares(board, square, direction, colour)) == list:

                valid_squares.append(square)
                break

    return valid_squares

def replace_relevant_squares(board, square, colour):
    """
    when a move is made replaces all the relevant squares with the relevant colour
    :param board: a board (dict)
    :param square: the chosen square (tuple)
    :param colour: the colour of the current square (1 or 2)
    :return: the mutated board
    """

    replaceable_squares = []

    for direction in range (1, 9):

        if type(check_for_replaceable_squares(board, square, direction, colour)) == list:
            replaceable_squares += check_for_replaceable_squares(board, square, direction, colour)

    for square in replaceable_squares:
        board[square] = colour

    return board



def print_board(board):
    """
    board: a board (dicitonary)
    prints the board in it's current state as an 8x8 grid of squares
    """

    for a in range(1, 9):
        for b in range(1, 9):
            print (board[a, b], end=' ')
        print()

def make_a_move(round, board):

    """
    if round is odd: it is white's move
    if round is even: it is black's move

    prompts the current player to make a move

    :param round: the current round (positive int)
    :param board: the current board
    :return: round +=1 and the mutated board
    """

    def take_valid_input(board, colour, available_moves = None):
        """
        prompts a player to make a move and ensures that it is in the list available moves
        :return: returns take_valid_input() until the move is valid, then returns the chosen move (tuple)
        """
        move = input(str(colour) + " Make a move: ")

        print(move)

        move_tuple = (int(move[0]), int(move[1]))

        if available_moves == None:
            available_moves = check_available_moves(board, colour)

        if move_tuple in available_moves:
            return move_tuple
        else:



            clear_screen()
            print_board(board)
            print(available_moves)
            print("Invalid move, try again.")
            return take_valid_input(board, colour, available_moves)


    if round % 2 == 1:
        colour = 1 #white
    else:
        colour = 2 #black

    move_tuple = take_valid_input(board, colour)

    board[move_tuple] = colour

    board = replace_relevant_squares(board, move_tuple, colour)

    return round + 1, board

def game():

    """
    runs the whole game
    """

    round = 1

    colour = 1 #white

    board = create_starting_board()



    while len(check_available_moves(board, colour)) > 0:

        clear_screen()

        print_board(board)

        (round, board) = make_a_move(round, board)

        print("Round: " + str(round) + ". It is " + str(colour) + "'s move:")

        print_board(board)

    white_points = 0

    black_points = 0

    for index in board:
        if board[index] == 1:
            white_points += 1
        elif board[index] == 2:
            black_points += 1

    print("White points: " + str(white_points))
    print("Black points: " + str(black_points))

game()
