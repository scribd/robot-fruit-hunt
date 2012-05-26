import Data.Maybe
import Data.Ord (comparing)
import Data.List (sortBy)

dist (x1, y1) (x2, y2) = (abs $ x2 - x1) + (abs $ y2 - y1)
myPos = (getMyX, getMyY)
oppPos = (getOpponentX, getOpponentY)

when_ :: Bool -> Maybe a -> Maybe a
when_ cond val = if cond then val else Nothing

allItems :: [(Int, Int)]
allItems = catMaybes [when_ (isJust $ hasItem (getBoard !! x !! y)) (Just (x, y)) | x <- [0..(width-1)], y <- [0..(height-1)]]

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
