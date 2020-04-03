// Randomly picks a direction and moves to it. If item, picks it up.

var RandoBot =
{
    get_my_x: get_my_x ,
    get_my_y: get_my_y ,
    get_my_item_count: get_my_item_count ,
    get_opponent_x: get_opponent_x ,
    get_opponent_y: get_opponent_y ,
    get_opponent_item_count: get_opponent_item_count ,

    get_name: function()
    {
        return "RandoBot";
    } ,

    new_game: function()
    {
    } ,

    make_move: function()
    {
       var board = get_board();

       // we found an item! take it!
       if (board[this.get_my_x()][this.get_my_y()] > 0) {
           return TAKE;
       }

       var rand = Math.random() * 4;

       if (rand < 1) return NORTH;
       if (rand < 2) return SOUTH;
       if (rand < 3) return EAST;
       if (rand < 4) return WEST;

       return PASS;
    }
}
