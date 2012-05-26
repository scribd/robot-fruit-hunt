// TODO it keeps going even after the game is over. Stop processing the next move after that.
// pause doesn't work anymore

var socket = new WebSocket("ws://localhost:3000/");
var socket_connected = false;
var can_make_next_move = true;
socket.onopen = function(){  
    socket_connected = true;
    console.log("Socket to game server successfully opened.");  
};

socket.onmessage = function(msg){  
    var move = JSON.parse(msg.data);
    if (move.error) {
        console.log(move.error);
        // TODO what move signals "bad move, player lost"?
        Board.callback(0);
    } else {
        console.log(move.trace);
        playerState = move.state;
        Board.callback(move.move);
    }
};


function render_items(func) {
    items = "[(0,0),";
    var n = Board.numberOfItemTypes;
    for(var i=1; i <= n; i++) {
        items += "(" + i + "," + func(i) + ")";
        if (i != n) {
            items += ",";
        }
    }
    items += "]";
    return items;
}

var playerState = "empty";

var playerData = function() {
    return {
        WIDTH : WIDTH,
        HEIGHT : HEIGHT,
        get_my_x : get_my_x(),
        get_my_y : get_my_y(),
        get_opponent_x : get_opponent_x(),
        get_opponent_y : get_opponent_y(),
        get_board : get_board(),
        get_my_item_count : render_items(get_my_item_count),
        get_opponent_item_count : render_items(get_opponent_item_count),
        get_total_item_count : render_items(get_total_item_count),
        state : playerState
    };
};

Board.processMove = function() {
    // TODO do this thru an ajax call to a server instead.
    // or websockets!
    if (!socket_connected) {
        alert("I am not connected to the server. Please start the server with `ruby eventloop.rb` if you haven't already (and then refresh this page).\nIf you already started the server, your browser may not support websockets.");
    }
    if (GamePlay.mode == "pause") {
        return null;
    }
    if (can_make_next_move) {
        socket.send(JSON.stringify(playerData()));
        can_make_next_move = false;
    } else {
        console.log("...");
        setTimeout(Board.processMove, 1000);
    }
};

Board.callback = function(move) {
    can_make_next_move = true;
    console.log("player is moving.");
    var myMove = move;
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

    if (Board.myX == Board.oppX && Board.myY == Board.oppY) {
        Board.history[Board.myX][Board.myY] = 3;
    } else {
        Board.history[Board.myX][Board.myY] = 1;
        Board.history[Board.oppX][Board.oppY] = 2;
    }


};
