# Welcome!

This is the Haskell sandbox for Scribd's [Robot Fruit Hunt](http://www.scribd.com/jobs/botrace).
It allows you to test your Haskell bots locally before you upload them to Scribd.

If you want to write a Javascript bot, check out the [JS sandbox](https://github.com/scribd/robot-fruit-hunt).

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

### Writing a Bot

[Read the tutorial](http://egonschiele.github.com/robot-fruit-hunt).

Then [Check out the Haskell API](http://github.com/egonSchiele/robot-fruit-hunt/blob/master/haskell/HaskellAPI.markdown).
