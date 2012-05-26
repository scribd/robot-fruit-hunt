# The API

    type ItemType = Int
    data Move = ERR | EAST | NORTH | WEST | SOUTH | TAKE | PASS deriving (Enum, Eq, Ord)

    width :: Int
    height :: Int

    getMyX :: Int
    getMyY :: Int

    getOpponentX :: Int
    getOpponentY :: Int

    getBoard :: [[ItemType]]

    hasItem :: ItemType -> Maybe ItemType

    getNumberOfItemTypes :: Int

    getMyItemCount :: ItemType -> Double
    getOpponentItemCount :: ItemType -> Double
    getTotalItemCount :: ItemType -> Double

    -- this is where you come in:
    makeMove :: State (Map String String) Move

# A Simple Bot

    makeMove = return EAST

# Debugging With Trace Statements

You can use the [trace](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Debug-Trace.html#v:trace) function for debugging.
The `trace` statement takes two values. It prints out the first and returns the second. Example:

    makeMove = trace "I'm moving!" (return EAST)

You can *only* use `trace` while testing locally. Output will be printed to the console.

# IO

You may have noticed that `makeMove` is a pure function. Your bot cannot do any IO. That includes `trace` functions and random number generators as well.

# State

makeMove uses the [State Monad](http://hackage.haskell.org/packages/archive/mtl/1.1.0.2/doc/html/Control-Monad-State-Lazy.html). In this case the state is a `Map` of Strings to Strings.
You can access the state with `get` and modify it with `put`. Here's a simple bot that keeps a counter of how many moves it's made:

    makeMove = do
      let key = "move_num"
      state <- get
      case lookup key state of
        Just _ -> put $ adjust (\num -> (read num :: Int) + 1) key state
        Nothing -> put $ insert key (show 0) state
      return EAST
