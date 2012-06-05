var Board = {
    init: function(boardNumber) {
        var fullBoard;
        Board.min_size = 5;
        Board.max_size = 15;
        Board.move_num = 0;

        if (typeof(localStorage) != 'undefined' ) {
            $("#select_largeboard").show();
            var val = null;
            try {
                val = localStorage.getItem("board");
            } catch (e) {
            }

            if (val !== null) {
                var spl = val.split(';');

                Board.min_size = parseInt(spl[0],10);
                Board.max_size = parseInt(spl[1],10);

                $("#select_largeboard option").each(function(opt) {
                    if ($(this).val() == val) {
                        $(this).prop('selected', true);
                    }
                });
            }



            $('#largeboard_dim').change(function(evt) {
                localStorage.setItem("board", evt.srcElement.value);
                location.reload();
            });
        }

        Board.initRandom(boardNumber);

        // initialize board
        HEIGHT = Math.min(Math.floor(Board.random() * (Board.max_size-Board.min_size+1)) + Board.min_size, Board.max_size);
        WIDTH = Math.min(Math.floor(Board.random() * (Board.max_size-Board.min_size+1)) + Board.min_size, Board.max_size);

        Board.board = new Array(WIDTH);

        for (var i=0; i<WIDTH; i++) {
            Board.board[i] = new Array(HEIGHT);
            for (var j=0; j<HEIGHT; j++) {
                Board.board[i][j] = 0;
            }
        }

        Board.history = new Array(WIDTH);

        for (var i=0; i<WIDTH; i++) {
            Board.history[i] = new Array(HEIGHT);
            for (var j=0; j<HEIGHT; j++) {
                Board.history[i][j] = 0;
            }
        }

        // initialize items on board
        do {
            Board.numberOfItemTypes = Math.floor(Board.random() * 3 + 3);
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
                    x = Math.min(Math.floor(Board.random() * WIDTH), WIDTH);
                    y = Math.min(Math.floor(Board.random() * HEIGHT), HEIGHT);
                } while (Board.board[x][y] != 0);
                Board.board[x][y] = i + 1;
            }
        }

        // get them the same starting position
        do {
            x = Math.min(Math.floor(Board.random() * WIDTH), WIDTH);
            y = Math.min(Math.floor(Board.random() * HEIGHT), HEIGHT);
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
        Board.newGame();
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
        Board.move_num++;
        var move_start = new Date().getTime();
        var myMove = make_move();
        var elapsed = ((new Date().getTime() - move_start) / 1000).toFixed(2);
        console.log("["+Board.move_num+"] elapsed time: "+elapsed+"s");
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

        Board.history[Board.myX][Board.myY] |= 1;
        Board.history[Board.oppX][Board.oppY] |= 2;

    },
    checkGameOver: function() {
        var item_type_score_max = 0,
            item_type_score_min = 0;
        var item_types_left = Board.numberOfItemTypes;
        for (var i=0; i < Board.numberOfItemTypes; i++) {
            var diff = Board.myBotCollected[i] - Board.simpleBotCollected[i];
            var numleft = Board.totalItems[i] - Board.myBotCollected[i] - Board.simpleBotCollected[i];
            var item_score_max = diff + numleft;
            var item_score_min = diff - numleft;
            if (item_score_min == 0 && item_score_max == 0) { // tie
                item_types_left --;
            } else if (item_score_min >= 0) {
                item_type_score_max ++; // player 1 could win or tie
                if (item_score_min > 0) {
                    item_type_score_min ++; // player 1 wins for this type of fruit
                    item_types_left --;
                }
            } else if (item_score_max <= 0) {
                item_type_score_min --; // player 2 could win or tie
                if (item_score_max < 0) {
                    item_type_score_max --; // player 2 wins
                    item_types_left --;
                }
            } else if(numleft != 0) { // still up in the air
                item_type_score_min --;
                item_type_score_max ++;
            }
        }
        if (item_type_score_max < 0) {
            return item_type_score_max;
        } else if (item_type_score_min > 0) {
            return item_type_score_min;
        } else if (item_types_left == 0) {
            return 0;
        }
        return;
    },
    initRandom: function(boardNumber) {
        // Create a random number generator (PRNG) for board
        // setup use and one for any other use. Doing this
        // allows us to better control the sequence of numbers
        // we receive. Only those functions generating random
        // numbers for board setup should call Board.random().

        Math.seedrandom(boardNumber);
        Board.boardSetupPRNG = Math.random;
        Math.seedrandom();
        Board.normalPRNG = Math.random;
    },
    random: function() {
        // Generate a random number from the board setup 
        // PRNG and then switch Math.random back to the normal PRNG.
        var number;

        Math.random = Board.boardSetupPRNG;
        number = Math.random();
        Math.random = Board.normalPRNG;

        return number;
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
