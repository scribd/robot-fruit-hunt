var itemStats = {};
function new_game() {
   for(var ii = 0; ii < get_number_of_item_types(); ii++){
      itemStats[ii] = get_total_item_count(ii);
   }
}

function coordinatesOfType(board, typeNumber) {
  var coordinates = [];

  for (var i = 0; i < board.length; i++) {
    var column = board[i];
    for (var j = 0; j < column.length; j++) {
      var row = column[j];

      if (row === typeNumber) {
        coordinates.push({
          x: i,
          y: j,
        });
      }
    }
  }

  return coordinates;
}

function distance(x1, y1, x2, y2) {
   return Math.abs(x1-x2) + Math.abs(y1-y2);
}

function whatToCollect(){
   var x =  get_my_x();
   var y =  get_my_y();

   var ox =  get_opponent_x();
   var oy =  get_opponent_y();

   var myItems = {};
   var oItems = {};
   // get collected stats
   for(var ii = 1; ii < get_number_of_item_types(); ii++){
      myItems[ii] = get_my_item_count(ii);
      oItems[ii] = get_opponent_item_count(ii);
   }

   var possible = {};
   var closest = 9999;
   var closestItem = null;
   for(var ii = 1; ii < get_number_of_item_types(); ii++) {
      if(
        myItems[ii] > itemStats[ii]/2 ||
        oItems[ii] > itemStats[ii]/2
      ){
         // no need to collect this type - it is won or lost already
         continue;
      }

      possible[ii] = {
         opponentHas: oItems[ii],
         iHave: myItems[ii],
         items: coordinatesOfType(get_board(), ii),
         closest: 9999,
         closestItem: null,
         opponentClosest: null
      };
      console.log(ii, possible[ii]);

      for(var jj = 0; jj < possible[ii].items.length; jj++){
         var dist = distance(x, y, possible[ii].items[jj].x, possible[ii].items[jj].y);
         if(dist < possible[ii].closest) {
            possible[ii].closest = dist;
            possible[ii].closestItem = possible[ii].items[jj];

            if(dist < closest) {
               closest = dist;
               closestItem = possible[ii].items[jj];
            }
         }
      }
   }
   console.log('closestItem', closestItem, x, y);
   if(closestItem.x < x) {
      return WEST;
   }
   if(closestItem.x > x) {
      return EAST;
   }
   if(closestItem.y > y) {
      return SOUTH;
   }
   if(closestItem.y < y) {
      return NORTH;
   }
}

function make_move() {
   var board = get_board();


   // we found an item! take it!
   if (board[get_my_x()][get_my_y()] > 0) {
       return TAKE;
   }
   var move = whatToCollect();
   console.log('my move is', move);
   return move;
}

// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
