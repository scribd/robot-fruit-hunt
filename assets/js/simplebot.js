// this is your opponent in the real-time player to use for debugging 
var board;
var toConsider = new Array();
var considered = new Array(HEIGHT);

function make_move_2() {
       // to disable to opponent, uncomment the next line
       // return PASS;

       board = get_board();

       // we found an item! take it!
       if (has_item(board[get_opponent_x()][get_opponent_y()])) {
           return TAKE;
       }

       // looks like we'll have to keep track of what moves we've looked at
       toConsider = new Array();
       considered = new Array(HEIGHT);
       for (var i = 0; i < WIDTH; i++) {
           considered[i] = new Array(HEIGHT);
           for (var j = 0; j < HEIGHT; j++) {
               considered[i][j] = 0;
           }
       }

       // let's find the move that will start leading us to the closest item
       return findMove(new node(get_opponent_x(), get_opponent_y(), -1));
}

function findMove(n) {
       // closest item! we will go to it
       if (has_item(board[n.x][n.y]))
           return n.move;

       var possibleMove = n.move;

       // NORTH
       if (considerMove(n.x, n.y-1)) {
           if (n.move == -1) {
               possibleMove = NORTH;
           } 
           toConsider.push(new node(n.x, n.y-1, possibleMove));
       } 

       // SOUTH
       if (considerMove(n.x, n.y+1)) {
           if (n.move == -1) {
               possibleMove = SOUTH;
           } 
           toConsider.push(new node(n.x, n.y+1, possibleMove));
       } 

       // WEST
       if (considerMove(n.x-1, n.y)) {
           if (n.move == -1) {
               possibleMove = WEST;
           } 
           toConsider.push(new node(n.x-1, n.y, possibleMove));
       } 

       // EAST 
       if (considerMove(n.x+1, n.y)) {
           if (n.move == -1) {
               possibleMove = EAST;
           } 
           toConsider.push(new node(n.x+1, n.y, possibleMove));
       } 

       // take next node to bloom out from
       if (toConsider.length > 0) {
           var next = toConsider.shift();
           return findMove(next);
       }

       // no move found
       return -1;
}

function considerMove(x, y) {
       if (!isValidMove(x, y)) return false;
       if (considered[x][y] > 0) return false;
       considered[x][y] = 1;
       return true;
}

function isValidMove(x, y) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
            return false;
        return true;
    }

function node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
}


function new_game_2() {
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
