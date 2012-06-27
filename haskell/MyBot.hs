import Data.Maybe
import Data.Ord (comparing)
import Data.List (sortBy)

-- manhattan distance
dist (x1, y1) (x2, y2) = (abs $ x2 - x1) + (abs $ y2 - y1)

-- positions
myPos = (getMyX, getMyY)
oppPos = (getOpponentX, getOpponentY)

for = flip map

-- get a list of all the positions with items
allItems :: [(Int, Int)]
allItems = catMaybes $ for positions $ \(x, y) ->
              if (isJust . hasItem $ getBoard !! x !! y)
                then Just (x, y)
                else Nothing
 
-- all items, sorted by those closest to our bot
nearestItems :: [(Int, Int)]
nearestItems = sortBy (comparing $ dist myPos) allItems

moveTo :: (Int, Int) -> Move
moveTo (x, y)
    | getMyX < x = EAST
    | getMyX > x = WEST
    | getMyY < y = SOUTH
    | getMyY > y = NORTH
    | otherwise  = TAKE

makeMove :: State (Map String String) Move
makeMove = return . moveTo . head $ nearestItems
