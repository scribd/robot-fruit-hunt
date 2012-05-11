var GamePlay = {
    init: function() {
        GamePlay.canvas = document.getElementById('game_view');
        $('.pause').bind('click', function() { GamePlay.mode = "pause";});
        $('.play').bind('click', function() { GamePlay.mode = "play"; Board.processMove(); GamePlay.draw();});
        $('.forward').bind('click', function() { Board.processMove(); GamePlay.draw();});
        $('.reset').bind('click', function() { GamePlay.setupGame();});
        $('#buttons').css('padding-left', GamePlay.itemTypeCount * 50);
        GamePlay.setupGame();
    },
    setupGame: function() {
        Board.init();
        Board.newGame();
        GamePlay.itemTypeCount = get_number_of_item_types();
        GamePlay.mode = "pause";
        document.getElementById('game_view').width = GamePlay.itemTypeCount * 50 + WIDTH * 50;
        document.getElementById('game_view').height = HEIGHT * 50;
        GamePlay.draw();
    },
    draw: function() {
        var ctx = GamePlay.canvas.getContext('2d');
        ctx.clearRect(0,0,GamePlay.canvas.width,GamePlay.canvas.height);
        GamePlay.drawEmptyGrid();
        GamePlay.drawPlayerOne(ctx, Board.board);
        GamePlay.drawPlayerTwo(ctx, Board.board);
        GamePlay.drawItems(ctx, Board.board);
        GamePlay.displayScore(ctx, Board.board);
        if (GamePlay.mode == "play") {
           if (Board.noMoreItems()) {
               GamePlay.mode = "pause";
               return;
           }
           Board.processMove();
           setTimeout(function() {GamePlay.draw();}, 500);
        } else {
           GamePlay.mode = "pause";
        }
    },
    drawEmptyGrid: function() { 
        var ctx = GamePlay.canvas.getContext('2d');
        ctx.fillStyle="#666";
        for (var i=0; i<WIDTH; i++) {
            for (var j=0; j<HEIGHT; j++) {
                ctx.fillRect(GamePlay.itemTypeCount*50+i*50+1, j*50+1, 48, 48); 
            }
        }
    },
    displayScore: function(ctx, state) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#00F";
        ctx.fillText("Player 1", 0, 50);
        ctx.fillStyle = "#000";
        for (var i=0; i<GamePlay.itemTypeCount; i++) {
            ctx.fillText(Board.myBotCollected[i], 50*i, 100);
        }
        ctx.fillStyle = "#0F0";
        ctx.fillText("Player 2", 0, 150);
        ctx.fillStyle = "#000";
        for (var i=0; i<GamePlay.itemTypeCount; i++) {
            ctx.fillText(Board.simpleBotCollected[i], 50*i, 200);
        }
        ctx.fillStyle = "#F00";
        ctx.fillText("LEFT", 0, 250);
        ctx.fillStyle = "#000";
        for (var i=0; i<GamePlay.itemTypeCount; i++) {
            ctx.fillText(Board.totalItems[i]-Board.myBotCollected[i]-Board.simpleBotCollected[i], 50*i, 300);
        }
    },
    drawPlayerOne: function(ctx, state) {
        ctx.strokeStyle = "#00F";
        ctx.beginPath();
        ctx.arc(GamePlay.itemTypeCount*50+Board.myX*50+25, Board.myY*50+25, 23,0, Math.PI*2);
        ctx.lineWidth = 2;
        ctx.stroke();
    },
    drawPlayerTwo: function(ctx, state) {
        ctx.strokeStyle = "#0F0";
        ctx.beginPath();
        ctx.strokeRect(GamePlay.itemTypeCount*50+Board.oppX*50, Board.oppY*50, 50, 50);
        ctx.lineWidth = 2;
        ctx.stroke();
    },
    drawItems: function(ctx, state) {
        for (var i=0; i<WIDTH; i++) {
            for (var j=0; j<HEIGHT; j++) {
                if (state[i][j] !== 0) {
                    ctx.fillStyle = "#F00";
                    ctx.font = "30px Arial";
                    ctx.fillText(state[i][j], GamePlay.itemTypeCount*50+i*50+18, j*50 + 35);
                }
            }
        }
    }
}
