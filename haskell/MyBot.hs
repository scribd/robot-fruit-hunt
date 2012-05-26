import Data.Maybe
import qualified Data.List as L

dist (x1, y1) (x2, y2) = (abs $ x2 - x1) + (abs $ y2 - y1)
myPos = (getMyX, getMyY)
oppPos = (getOpponentX, getOpponentY)
_hasItem (x, y) = hasItem $ getBoard !! x !! y
first [] = []
first (x:xs)
    | null x = first xs
    | otherwise = x

when_ :: Bool -> Maybe a -> Maybe a
when_ cond val = if cond then val else Nothing

score item = realToFrac (dist myPos item) / realToFrac (weight item)

allItems = catMaybes [when_ (isJust $ hasItem (getBoard !! x !! y)) (Just (x, y)) | x <- [0..(width-1)], y <- [0..(height-1)]]

nearestItems = L.sortBy (\fruit1 fruit2 -> compare (score fruit1) (score fruit2)) allItems

-- if more than half the items are gone, no point in going after 'em.
eligible item = (opp <= (total / 2)) && (my <= (total / 2))
    where type_ = fromJust $ _hasItem item
          total = getTotalItemCount type_
          opp   = getOpponentItemCount type_
          my    = getMyItemCount type_

-- item is closer to us than to the opponent
closer item = (dist myPos item) < (dist oppPos item)

weight item = needed / left
    where type_ = fromJust $ _hasItem item
          total = getTotalItemCount type_
          my    = getMyItemCount type_
          opp   = getOpponentItemCount type_
          left  = total - my - opp
          needed = (total / 2) - my

moveTo (x, y)
    | getMyX < x = EAST
    | getMyX > x = WEST
    | getMyY < y = SOUTH
    | getMyY > y = NORTH
    | otherwise  = TAKE

getNewTarget = do
    state <- get
    let best = filter closer . filter eligible $ nearestItems
    let ok = filter eligible $ nearestItems
    let target = head $ first [best, ok, nearestItems]
    put $ insert "target" (show target) state
    return . moveTo $ target

getOldTarget _target = do
    let target = read _target :: (Int, Int)
    case _hasItem target of
        Just _  -> return . moveTo $ target
        Nothing -> getNewTarget

makeMove = do
    state <- get
    move <- case lookup "target" state of
        Just _target -> getOldTarget _target
        Nothing -> getNewTarget    

    when (move == TAKE) $
        put $ delete "target" state
    trace "hello!" (return move)
