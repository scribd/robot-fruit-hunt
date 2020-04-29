// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}

// These are what you want to touch for gather_win_stats.html
BOTS_TO_TEST = [TemplateBot, RandoBot, SimpleBot, SimpleBot2]
GAMES_TO_PLAY = 25
MAX_MOVES = 1000 // Maximum number of moves that can occur before game is terminated as "unfinished"
OUTPUT_FOLDER = "output"

// These are what you want to touch for game.html
BOT_1 = SimpleBot2
BOT_2 = RandoBot
// BOT_1 = TemplateBot
// BOT_2 = TemplateBot


// Reverse for BOT_2
BOT_2.get_my_x = get_opponent_x
BOT_2.get_my_y = get_opponent_y
BOT_2.get_my_item_count = get_opponent_item_count
BOT_2.get_opponent_x = get_my_x
BOT_2.get_opponent_y = get_my_y
BOT_2.get_opponent_item_count = get_my_item_count

function make_move()
{
    return BOT_1.make_move()
}

function new_game()
{
    BOT_1.new_game()
    BOT_2.new_game()
}
