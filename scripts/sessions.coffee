# Description:
#   Link the video of any Mahfel session
#
# Commands:
#   hubot session #<number>
#
# Notes:
#   Starts from 1, cause there are non-programmers around!

sessions = [
  "http://www.youtube.com/watch?v=_NxqbrDAyXY",
  "http://www.youtube.com/watch?v=mTW7d7PI1xk",
  ]

module.exports = (robot) ->
  robot.respond /session #?(\d+)/i, (msg) ->
    number = msg.match[1]
    if number == "0"
        msg.send "Not all people are programmers!"
    else
        msg.send sessions[number - 1] || "No such session!"
