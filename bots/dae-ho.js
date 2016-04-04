function new_game() {
}

function make_move() {
   var board = get_board();

   var currentPositionFruitType = board[get_my_x()][get_my_y()];
   // we found an item! take it!
   if (currentPositionFruitType > 0 && dh_isItWorthIt(currentPositionFruitType)) {
         return TAKE;
   }
   
   var closestFruitList = dh_closestFruitList();
   for (var i = 0; i < closestFruitList.length; i++) {
      if (dh_isItWorthIt(closestFruitList[i].fruitType)) {
         return dh_goTo(closestFruitList[i].x, closestFruitList[i].y);
      }
   }

   var rand = Math.random() * 4;

   if (rand < 1) return NORTH;
   if (rand < 2) return SOUTH;
   if (rand < 3) return EAST;
   if (rand < 4) return WEST;

   return PASS;
}

// Helper function to decide whether this fruit is worth getting. 1 is yes, 0 is no
function dh_isItWorthIt(fruitType) {
   var board = get_board();
   var totalFruitTypes = get_number_of_item_types();
   var myFruitCount = [];
   var opponentFruitCount = [];
   var totalFruitCount = [];
   
   for (var i = 0; i < totalFruitTypes; i++) {
      myFruitCount[i] = get_my_item_count(i+1);
      opponentFruitCount[i] = get_opponent_item_count(i+1);
      totalFruitCount[i] = get_total_item_count(i+1);
   }

   if (opponentFruitCount[fruitType] > (myFruitCount[fruitType] / 2))
      return 0;

   return 1;
}

// Helper function to determine a direction to head towards a destination
function dh_goTo(destX, destY) {
   var myX = get_my_x();
   var myY = get_my_y();
   var move = [EAST,SOUTH];
   
   if ((destX - myX) < 0)
      move[0]=WEST;
   if ((destY - myY) < 0)
      move[1]=NORTH;
   
   if ((destX - myX) != 0) {
      if ((destY - myY) != 0) {
         var rand = Math.random() * 2;
         if (rand < 1) return move[0];
         if (rand < 2) return move[1];
      }
      else return move[0];
   }
   else {
      if ((destY - myY) != 0)
         return move[1];
   }

   return PASS;
}

// Helper function to return absolute distance
function dh_distance(firstX, firstY, secondX, secondY) {
   return (Math.abs(secondX - firstX) + Math.abs(secondY - firstY));
}

// Returns an array of JSON objects that contain x, y, and fruitType sorted by closest to farthest
function dh_closestFruitList() {
   var board = get_board();
   var field;
   var curX, curY;
   var myX = get_my_x();
   var myY = get_my_y();
   var fruitList = [];

   for (curX = 0 ; curX < WIDTH; curX++) {
      for (curY = 0; curY < HEIGHT; curY++) {
         field = board[curX][curY];
         if (field > 0) {
            fruitList.push({"x":curX,"y":curY,"fruitType":field});
         }
      }
   }

   fruitList.sort(function (a,b) {
      var distance = dh_distance(myX, myY, a.x, a.y) - dh_distance(myX, myY, b.x, b.y);
      if (distance == 0) {
         return get_total_item_count(a.fruitType) - get_total_item_count(b.fruitType);
      }
      return distance;
   });

   return fruitList;
}


// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
