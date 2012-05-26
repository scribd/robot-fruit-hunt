# The API

```haskell
type ItemType = Int

-- possible moves
data Move = ERR | EAST | NORTH | WEST | SOUTH | TAKE | PASS deriving (Enum, Eq, Ord)

-- width of game board
width :: Int

-- height of game board
height :: Int

-- current position of your bot
getMyX :: Int
getMyY :: Int

-- current position of your opponent
getOpponentX :: Int
getOpponentY :: Int

-- Returns the current board. It's an array of arrays.
getBoard :: [[ItemType]]

-- convenience function. For a given field (getBoard !! x !! y), if there's a fruit
-- at that field, returns the index of the fruit starting at 1. Returns Nothing if
-- there's no fruit there.
hasItem :: ItemType -> Maybe ItemType

-- Return the number of different fruit types. Each fruit type might be on the board
-- multiple times (use getTotalItemCount type) to query how often).
getNumberOfItemTypes :: Int

-- Returns the number of fruits you or your opponent have.
-- e.g. if (getMyItemCount 1) returns 3, you have 3 pieces of the fruit 1.
getMyItemCount :: ItemType -> Double
getOpponentItemCount :: ItemType -> Double

-- Returns the total number of fruits available for a given category.
-- E.g. if (getTotalItemCount 2) returns 5, a total of 5 fruits of type 2 exists
-- on the board and the players inventories.
getTotalItemCount :: ItemType -> Double

-- this is where you come in. Have this function return any value of type Move.
makeMove :: State (Map String String) Move
```

# A Simple Bot

```haskell
makeMove = return EAST
```
# Debugging With Trace Statements

You can use the [trace](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Debug-Trace.html#v:trace) function for debugging.
The `trace` statement takes two values. It prints out the first and returns the second. Example:

```haskell
makeMove = trace "I'm moving!" (return EAST)
```

You can *only* use `trace` while testing locally. Output will be printed to the console.

# IO

You may have noticed that `makeMove` is a pure function. Your bot cannot do any IO. That includes `trace` functions and random number generators as well.

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
