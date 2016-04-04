// this is your opponent in the real-time player to use for debugging 
var p1_board;
var p1_toConsider = new Array();
var p1_considered = new Array(HEIGHT);

function make_move() {
       // to disable to opponent, uncomment the next line
       // return PASS;

       p1_board = get_board();

       // we found an item! take it!
       if (has_item(p1_board[get_opponent_x()][get_opponent_y()])) {
           return TAKE;
       }

       // looks like we'll have to keep track of what moves we've looked at
       p1_toConsider = new Array();
       p1_considered = new Array(HEIGHT);
       for (var i = 0; i < WIDTH; i++) {
           p1_considered[i] = new Array(HEIGHT);
           for (var j = 0; j < HEIGHT; j++) {
               p1_considered[i][j] = 0;
           }
       }

       // let's find the move that will start leading us to the closest item
       return p1_findMove(new p1_node(get_opponent_x(), get_opponent_y(), -1));
}

function p1_findMove(n) {
       // closest item! we will go to it
       if (has_item(p1_board[n.x][n.y]))
           return n.move;

       var possibleMove = n.move;

       // NORTH
       if (p1_considerMove(n.x, n.y-1)) {
           if (n.move == -1) {
               possibleMove = NORTH;
           } 
           p1_toConsider.push(new p1_node(n.x, n.y-1, possibleMove));
       } 

       // SOUTH
       if (p1_considerMove(n.x, n.y+1)) {
           if (n.move == -1) {
               possibleMove = SOUTH;
           } 
           p1_toConsider.push(new p1_node(n.x, n.y+1, possibleMove));
       } 

       // WEST
       if (p1_considerMove(n.x-1, n.y)) {
           if (n.move == -1) {
               possibleMove = WEST;
           } 
           p1_toConsider.push(new p1_node(n.x-1, n.y, possibleMove));
       } 

       // EAST 
       if (p1_considerMove(n.x+1, n.y)) {
           if (n.move == -1) {
               possibleMove = EAST;
           } 
           p1_toConsider.push(new p1_node(n.x+1, n.y, possibleMove));
       } 

       // take next p1_node to bloom out from
       if (p1_toConsider.length > 0) {
           var next = p1_toConsider.shift();
           return p1_findMove(next);
       }

       // no move found
       return -1;
}

function p1_considerMove(x, y) {
       if (!p1_isValidMove(x, y)) return false;
       if (p1_considered[x][y] > 0) return false;
       p1_considered[x][y] = 1;
       return true;
}

function p1_isValidMove(x, y) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
            return false;
        return true;
    }

function p1_node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
}


function new_game_2() {
}

// Optionally include this function if you'd like to always reset to a 
// certain p1_board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_p1_board_number() {
//    return 123;
//}
