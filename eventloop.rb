require 'rubygems'
require 'eventmachine'
require 'em-websocket'
require 'json'

HOST = "0.0.0.0"
PORT = "3000"

def make(d)
    api = File.open("GameAPI.hs", "r").read
    api = sprintf(api, d["WIDTH"], d["HEIGHT"], d["get_my_x"], d["get_my_y"], d["get_opponent_x"], d["get_opponent_y"], d["get_board"].inspect, d["get_my_item_count"], d["get_opponent_item_count"], d["get_total_item_count"], d["state"])
    api += "\n" + File.open("MyBot.hs", "r").read
    f = File.open("Main.hs", "w+")
    f.write(api)
    f.close
    msg = `ghc --make Main.hs`
    if $?.exitstatus != 0
      [false, msg]
    else
      [true, ""]
    end
end

def run
    result = `./Main`
    if result =~ /\((\d),(.+)\)/
        captures = $~.to_a
        return [false, ""] if captures[1] == 0
        [true, {"move" => captures[1].to_i, "state" => captures[2]}.to_json]
    else
        [false, result]
    end
end

EM.run {
    EventMachine::WebSocket.start(:host => HOST, :port => PORT) do |ws|
        ws.onopen {
          puts "WebSocket connection open"
        }

        ws.onclose { puts "Connection closed" }
        ws.onmessage { |msg|
          puts "Recieved message: #{msg}"
          result, msg = make(JSON.parse(msg))
          return ws.send("Error: #{msg}") unless result

          result, move = run
          return ws.send("Error: #{msg}") unless result

          ws.send move
        }
    end
}
