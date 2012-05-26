# Welcome!

## Testing a Javascript Bot

`cd javascript`.

Modify `mybot.js` to start writing your bot. Opening `game.html` will allow you to generate random boards, and either watch your bot play or step through one move at a time. Refer to http://www.scribd.com/jobs/botrace_api for available methods. gl/hf!

Scribd.

ps: you should be able to ignore everything in `assets/`, but if you want to disable the opponent bot from playing in `game.html`, go to `assets/simplebot.js` and find:

    makeMove: function() {
       // to disable to opponent, uncomment the next line
       // return PASS;

Uncomment the `return PASS;` and your bot will be free to roam the board alone.

## Testing a Haskell Bot

`cd haskell`.

### Requirements

- ghc, the Haskell compiler (duh)
- ruby
- [eventmachine](http://rubyeventmachine.com/)
- [em-websocket](https://github.com/igrigorik/em-websocket)
- a browser that supports websockets (latest versions of Firefox or Chrome will work)

### Testing

Start the game server with `ruby gameserver.rb`.

Modify `MyBot.hs` to start writing your bot. Opening `game.html` will allow you to generate random boards, and either watch your bot play or step through one move at a time. gl/hf!

Read about the Haskell API in [HaskellAPI.markdown](haskell/HaskellAPI.markdown).

You can disable the opponent by following the steps listed in the Javascript section above.
