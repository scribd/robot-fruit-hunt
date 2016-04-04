## Please Note
This is a fork of Scribd's [robot-fruit-hunt](https://github.com/scribd/robot-fruit-hunt). Modifications here allow two human-written bots to play each other instead of relying on SimpleBot. It also contains some (very) hacky templating features to easily find where to replace Player 1 and Player 2 names.

## Welcome!

Modify mybot.js to start writing your bot. Opening game.html will allow you to generate random boards, and either watch your bot play or step through one move at a time. Refer [here](http://fruitbots.org/api/api) for available methods. gl/hf! - Scribd.

ps: you should be able to ignore everything in `assets/`, but if you want to disable the opponent bot from playing in `game.html`, go to `assets/simplebot.js` and find:

```javascript
makeMove: function() {
   // to disable to opponent, uncomment the next line
   // return PASS;
```

Uncomment `return PASS;` and your bot will be free to roam the board alone.
