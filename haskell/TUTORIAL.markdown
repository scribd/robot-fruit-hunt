# Welcome!

So you want to write a Haskell bot for the [Robot Fruit Hunt](http://www.scribd.com/jobs/botrace). You came to the right place!

First, [read about how the game works](http://www.scribd.com/jobs/botrace_rules).

Then, make sure you have followed the instructions in the [README](https://github.com/egonSchiele/robot-fruit-hunt) to set up your coding environment.

Now, let's write our first bot.

# Hello World

Here's a Haskell bot that always goes EAST:

```haskell
makeMove = return EAST
```

# A Smarter Bot

Here's a bot that always goes to the nearest fruit:

```haskell
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
```

# Debugging With Trace Statements

You can use the [trace](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Debug-Trace.html#v:trace) function for debugging.
The `trace` statement takes two values. It prints out the first and returns the second. Example:

```haskell
makeMove = trace "I'm moving!" (return EAST)
```

You can *only* use `trace` while testing locally. Output will be printed to the javascript console.

# IO

You may have noticed that `makeMove` is a pure function. Your bot cannot do any IO. That includes `trace` functions and random number generators as well. When you submit your bot, make sure it doesn't do any IO!

# State

makeMove uses the [State Monad](http://hackage.haskell.org/packages/archive/mtl/1.1.0.2/doc/html/Control-Monad-State-Lazy.html). In this case the state is a `Map` of Strings to Strings.
You can access the state with `get` and modify it with `put`. Here's a simple bot that keeps a counter of how many moves it's made:

```haskell
makeMove = do
  let key = "move_num"
  state <- get
  case lookup key state of
    Just _ -> put $ adjust (\num -> (read num :: Int) + 1) key state
    Nothing -> put $ insert key (show 0) state
  return EAST
```

# The Complete API
The complete API can be found [here](http://github.com/egonSchiele/robot-fruit-hunt/blob/master/haskell/HaskellAPI.markdown).

Happy coding!
