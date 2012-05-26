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

Board.jsProcessMove = Board.processMove;

Board.processMove = function() {
    if (!socket_connected) {
        alert("I am not connected to the server. Please start the server with `ruby eventloop.rb` if you haven't already (and then refresh this page).\nIf you already started the server, your browser may not support websockets.");
    }
    if (GamePlay.mode == "pause" || player_lost) {
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

var make_move = null;

Board.callback = function(move) {
    make_move = function() { return move; };
    can_make_next_move = true;
    console.log("player is moving.");
    Board.jsProcessMove();
};
