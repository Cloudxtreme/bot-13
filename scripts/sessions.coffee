# Description:
#   Link the video of any Mahfel session
#
# Commands:
#   hubot session #<number>
#   hubot session last
#   hubot session list all
#
# Notes:
#   Starts from 1, cause there are non-programmers around!

sessions = [
  {name: "Why Rust?!", link: "http://www.youtube.com/watch?v=_NxqbrDAyXY"},
  {name: "Clojure Concurrency - Part I", link: "http://www.youtube.com/watch?v=mTW7d7PI1xk"},
  {name: "Clojure Concurrency - Part II", link: "http://www.youtube.com/watch?v=chH4om-1kqI"},
  ]

j = (x) -> x.name + "\n" + x.link

module.exports = (robot) ->
  robot.respond /session #?(\d+|last|(list )?all)/i, (msg) ->
    number = msg.match[1]
    if number == "all" || number == "list all"
        msg.send sessions.map((x) -> (sessions.indexOf(x) + 1) + '. ' + j(x)).join("\n")
        return
    if number == "last"
        msg.send j(sessions[sessions.length - 1])
    else if number == "0"
        msg.send "Not all people are programmers!"
    else
        msg.send if number - 1 < sessions.length then j(sessions[number - 1]) else "No such session!"
