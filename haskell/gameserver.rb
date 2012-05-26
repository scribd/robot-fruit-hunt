require 'rubygems'
require 'eventmachine'
require 'em-websocket'
require 'json'

HOST = "0.0.0.0"
PORT = "3000"

def make(d)
    `rm Main Main.hs Main.hi Main.o`
    api = File.open("GameAPI.hs", "r").read
    api = sprintf(api, d["WIDTH"], d["HEIGHT"], d["get_my_x"], d["get_my_y"], d["get_opponent_x"], d["get_opponent_y"], d["get_board"].inspect, d["get_my_item_count"], d["get_opponent_item_count"], d["get_total_item_count"], d["state"])
    mybot = File.open("MyBot.hs", "r").readlines
    mybot.each do |line|
      if line =~ /^import .+/
        api = line + api
      else
        api += line
      end
    end
    f = File.open("Main.hs", "w+")
    f.write(api)
    f.close
    msg = `ghc --make Main.hs 2>&1`
    if $?.exitstatus != 0
      [false, {"error" => msg}.to_json]
    else
      [true, ""]
    end
end

def run
    _result = `./Main 2>&1`
    result = _result.split("\n")
    if result[-1] =~ /\((\d),(.+)\)/
        captures = $~.to_a
        [true, {"move" => captures[1].to_i, "state" => captures[2], "trace" => result[0, result.size-1].join("\n")}.to_json]
    else
        [false, {"error" => result.join("\n")}.to_json]
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
          ws.send(msg) unless result

          result, move = run
          ws.send move
        }
    end
}
