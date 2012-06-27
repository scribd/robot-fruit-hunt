type ItemType = Int
data Move = ERR | EAST | NORTH | WEST | SOUTH | TAKE | PASS deriving (Enum, Eq, Ord)

instance Show Move where
  show = show . fromEnum

-- convenience function, all positions on the board
positions :: [(Int, Int)]
positions = [(x, y) | x <- [0..(width-1)], y <- [0..(height-1)]]

-- c
width = %d
height = %d

flatten = mconcat

-- c
getMyX :: Int
getMyX = %d

-- c
getMyY :: Int
getMyY = %d

-- c
getOpponentX :: Int
getOpponentX = %d

-- c
getOpponentY :: Int
getOpponentY = %d

-- c
getBoard :: [[ItemType]]
getBoard = %s

hasItem :: ItemType -> Maybe ItemType
hasItem field = if field > 0
                  then Just field
                  else Nothing

getNumberOfItemTypes :: Int
getNumberOfItemTypes = length . nub . flatten $ getBoard

getCount :: [(ItemType, Double)] -> ItemType -> Double
getCount items type_ = snd . head . filter (\(typ_, count_) -> typ_ == type_) $ items

-- c
getMyItemCount :: ItemType -> Double
getMyItemCount = getCount items
  where items = %s

-- c
getOpponentItemCount :: ItemType -> Double
getOpponentItemCount = getCount items
  where items = %s

-- c
getTotalItemCount :: ItemType -> Double
getTotalItemCount = getCount items
  where items = %s

-- c
__state = %s

main = print $ runState makeMove __state
