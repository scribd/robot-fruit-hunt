var Board = {
    init: function() {
        var fullBoard;

        // initialize board
        HEIGHT = Math.min(Math.floor(Math.random() * 11) + 5, 15);
        WIDTH = Math.min(Math.floor(Math.random() * 11) + 5, 15);
        Board.board = new Array(WIDTH);

        for (var i=0; i<WIDTH; i++) {
            Board.board[i] = new Array(HEIGHT);
            for (var j=0; j<HEIGHT; j++) {
                Board.board[i][j] = 0;
            }
        }

        // initialize items on board
        do {
            Board.numberOfItemTypes = Math.floor(Math.random() * 3 + 3);
        } while(Board.numberOfItemTypes * Board.numberOfItemTypes >= HEIGHT * WIDTH)
        Board.totalItems = new Array();
        Board.simpleBotCollected = new Array(Board.numberOfItemTypes);
        Board.myBotCollected = new Array(Board.numberOfItemTypes);
        var x;
        var y;
        for (var i=0; i<Board.numberOfItemTypes; i++) {
            Board.myBotCollected[i] = 0;
            Board.simpleBotCollected[i] = 0;
            Board.totalItems[i] = i * 2 + 1;
            for (var j=0; j<Board.totalItems[i]; j++) {
                do {
                    x = Math.min(Math.floor(Math.random() * WIDTH), WIDTH);
                    y = Math.min(Math.floor(Math.random() * HEIGHT), HEIGHT);
                } while (Board.board[x][y] != 0);
                Board.board[x][y] = i + 1;
            }
        }

        // get them the same starting position
        do {
            x = Math.min(Math.floor(Math.random() * WIDTH), WIDTH);
            y = Math.min(Math.floor(Math.random() * HEIGHT), HEIGHT);
        } while (Board.board[x][y] != 0);
        Board.myX = x;
        Board.myY = y;
        Board.oppX = x;
        Board.oppY = y;
        Board.initial_state = {};
        jQuery.extend(true, Board.initial_state, Board);
    },
    reset: function() {
        Board = Board.initial_state;
        Board.initial_state = {};
        jQuery.extend(true, Board.initial_state, Board);
        GamePlay.start();
    },
    newGame: function() {
        var new_game_exists = undefined;
        try {
            new_game_exists = new_game;
        } catch(e) {
        }
        if(new_game_exists !== undefined) {
            new_game();
        }
        // SimpleBot currently doesn't need any sort of init, but if it did, it'd be called here too
    },
    processMove: function() {
        var myMove = make_move();
        var simpleBotMove = SimpleBot.makeMove();
        if ((Board.myX == Board.oppX) && (Board.myY == Board.oppY) && (myMove == TAKE) && (simpleBotMove == TAKE) && Board.board[Board.myX][Board.myY] > 0) {
            Board.myBotCollected[Board.board[Board.myX][Board.myY]-1] = Board.myBotCollected[Board.board[Board.myX][Board.myY]-1] + 0.5;
            Board.simpleBotCollected[Board.board[Board.oppX][Board.oppY]-1] = Board.simpleBotCollected[Board.board[Board.oppX][Board.oppY]-1] + 0.5;
            Board.board[Board.myX][Board.myY] = 0; 
        } else {
            if (myMove == TAKE && Board.board[Board.myX][Board.myY] > 0) {
                Board.myBotCollected[Board.board[Board.myX][Board.myY]-1]++;
                Board.board[Board.myX][Board.myY] = 0; 
            }
            if (simpleBotMove == TAKE && Board.board[Board.oppX][Board.oppY] > 0) {
                Board.simpleBotCollected[Board.board[Board.oppX][Board.oppY]-1]++;
                Board.board[Board.oppX][Board.oppY] = 0; 
            }
        }
        if (myMove == NORTH) {
            if (Board.myY - 1 >= 0) {
                Board.myY = Board.myY - 1;
            }
        }
        if (simpleBotMove == NORTH) {
            if (Board.oppY - 1 >= 0) {
                Board.oppY = Board.oppY - 1;
            }
        }
        if (myMove == SOUTH) {
            if (Board.myY + 1 < HEIGHT) {
                Board.myY = Board.myY + 1;
            }
        }
        if (simpleBotMove == SOUTH) {
            if (Board.oppY + 1 < HEIGHT) {
                Board.oppY = Board.oppY + 1;
            }
        }
        if (myMove == EAST) {
            if (Board.myX + 1 < WIDTH) {
                Board.myX = Board.myX + 1;
            }
        }
        if (simpleBotMove == EAST) {
            if (Board.oppX + 1 < WIDTH) {
                Board.oppX = Board.oppX + 1;
            }
        }
        if (myMove == WEST) {
            if (Board.myX - 1 >= 0) {
                Board.myX = Board.myX - 1;
            }
        }
        if (simpleBotMove == WEST) {
            if (Board.oppX - 1 >= 0) {
                Board.oppX = Board.oppX - 1;
            }
        }
    },
    noMoreItems: function() {
        for (var i=0; i<WIDTH; i++) {
            for (var j=0; j<HEIGHT; j++) {
                if (Board.board[i][j] != 0) {
                    return false;
                }
            }
        }
        return true;
    }
}

// Everything below is are API commands you can use.
// This, however, is not the actual API that's on the server
// but rather a working model of it for the purposes of giving
// you an environment to develop and debug in.

// don't rely on these constants to be the exact value listed here
var EAST = 1;
var NORTH = 2;
var WEST = 3;
var SOUTH = 4;
var TAKE = 5;
var PASS = 6;

var HEIGHT;
var WIDTH;

function has_item(i) {
    return i > 0;
}

function get_board() {
    return Board.board;
}

function get_number_of_item_types() {
    return Board.numberOfItemTypes;
}

function get_my_x() {
    return Board.myX;
}

function get_my_y() {
    return Board.myY;
}

function get_opponent_x() {
    return Board.oppX;
}

function get_opponent_y() {
    return Board.oppY;
}

function get_my_item_count(type) {
    return Board.myBotCollected[type-1];
}

function get_opponent_item_count(type) {
    return Board.simpleBotCollected[type-1];
}

function get_total_item_count(type) {
    return Board.totalItems[type-1];
}

function trace(mesg) {
    console.log(mesg);
}
