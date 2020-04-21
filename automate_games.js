// For automating games to collect win-loss-tie-unfinished statistics
// Much of this code was borrowed from assets/js/player.js
BOT1_WIN = 0;
BOT2_WIN = 1;
TIE = 2;
UNFINISHED = 3;


var Automate = {
    init: function()
    {
        $(NumGames).html(GAMES_TO_PLAY);

        $('.play').bind('click', function() { Automate.automate_games()});
    },

    automate_games: function()
    {
        var n_bots = BOTS_TO_TEST.length;
        var match_dict = new Object();
        for(var n = 0; n < GAMES_TO_PLAY; ++n)
        {
            console.log("Game: " + n)

            Math.seedrandom();
            nextBoardNum = Math.min(Math.floor(Math.random() * 999999), 999999);

            for(var i=0; i < n_bots; ++i)
            {
                BOT_1 = BOTS_TO_TEST[i];
                for(var j = i; j < n_bots; ++j)
                {
                    BOT_2 = BOTS_TO_TEST[j]

                    match_key = BOT_1.get_name() + " vs. " + BOT_2.get_name()
                    if(match_dict[match_key] == undefined)
                    {
                        match_dict[match_key] = [0,0,0,0]
                    }

                    // console.log(BOT_1.get_name() + " vs. " + BOT_2.get_name())

                    Automate.setupNewGame(nextBoardNum);
                    result = Automate.play();

                    match_dict[match_key][result] += 1

                    // console.log(result)
                } // for
            } // for
        } // for

        var keys = Object.keys(match_dict)
        var html_str = "";
        for(var i=0; i < keys.length; ++i)
        {
            var key = keys[i];
            var res = match_dict[key].join(",");

            html_str += key + "," + res + "<br/>";
        }

        $(Games).html(html_str);
    },

    setupNewGame: function(boardNumber)
    {
        // Create a new board setup according to the following priority:
        //
        // 1. If a board number is passed in, use that.
        // 2. If the bot has default_board_number() defined, use that.
        // 3. Generate a random board number.
        var nextBoardNum;

        if(boardNumber === undefined) {
            if ( typeof default_board_number == 'function' && !isNaN(parseInt(default_board_number()))) {
                nextBoardNum = default_board_number()
            } else {
                Math.seedrandom();
                nextBoardNum = Math.min(Math.floor(Math.random() * 999999), 999999);
            }
        } else {
            nextBoardNum = boardNumber;
        }

        $('#board_number').val(nextBoardNum);

        Board.init(nextBoardNum);
        Board.newGame();

        return nextBoardNum;
    },

    play: function()
    {
        var game_end = UNFINISHED;
        for (var i = 0; i < MAX_MOVES; i++)
        {
            Board.processMove();

            // Check for end condition
            var score = Board.checkGameOver();
            if (score !== undefined)
            {
                if (score > 0)
                {
                    game_end = BOT1_WIN;
                }
                if (score < 0)
                {
                    game_end = BOT2_WIN;
                }
                if (score == 0)
                {
                    game_end = TIE;
                }

                break;
            } // if
        } // for

        return game_end;

    },
}
