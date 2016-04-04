function new_game() {
}

function make_move() {
   var board = get_board();
   var size = board.length;
   var numTypes = get_number_of_item_types();
   var freqMap = {};
   var bestFruit = 99;
   for (var i = 1; i <= numTypes; i++) {
     freqMap[i] = get_total_item_count(i);
     var takenCount = get_my_item_count(i) + get_opponent_item_count(i);
     var needCount = Math.ceil(get_total_item_count(i) / 2);
     var totalCount = get_total_item_count(i);
     if (get_total_item_count(i) < bestFruit  && (totalCount - takenCount > 0)) {
      bestFruit = i;
     }
   }
   console.log('best fruit is' + bestFruit);

   var destination = find_closest_item(bestFruit);

   var move = move_towards_pos(destination[0], destination[1]);
   return move;

   function find_closest_item(itemType) {
   var myX = get_my_x();
   var myY = get_my_y();
   var board = get_board();
   var itemPositions = [];

   for (var x=0; x<board.length; x++) {
      for (var y=0; y<board[0].length; y++) {
         if (board[x][y] === itemType) {
            itemPositions.push([x, y]);
         }
      }
   }

   var bestDistance = 9999;
   var bestPos = [-1, -1];
   for (var i=0; i<itemPositions.length; i++) {
      var pos = itemPositions[i];
      distance = Math.abs(myX - pos[0]) + Math.abs(myY - pos[1]);
      if (distance < bestDistance) {
         bestDistance = distance;
         bestPos = [pos[0], pos[1]];
      }
   }
   console.log('best pos ', bestPos)
   return bestPos;
  }


    function move_towards_pos(pos_x, pos_y) {
      var myX = get_my_x(), myY = get_my_y();
      if (pos_x > myX) {
         console.log('moving east');
         return EAST;
      } else if (pos_x < myX) {
         console.log('moving west');
         return WEST;
      } else if (pos_y > myY) {
         console.log('moving south');
         return SOUTH;
      } else if (pos_y < myY) {
         console.log('moving north');
         return NORTH;
      } else {
         // We're on it!
         console.log('taking')
         return TAKE;
      }
   }


   // var myX = get_my_x();
   // var myY = get_my_y();



   // // we found an item! take it!
   // if (board[get_my_x()][get_my_y()] > 0) {
   //     return TAKE;
   // }

   // var rand = Math.random() * 4;

   // if (rand < 1) return NORTH;
   // if (rand < 2) return SOUTH;
   // if (rand < 3) return EAST;
   // if (rand < 4) return WEST;

   // return PASS;
}

// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}