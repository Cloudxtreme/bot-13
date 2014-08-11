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

querystring = require('querystring')
url = require('url')

sessions = [
  {name: "Why Rust?!", link: "http://mahfel.rocks/sessions/Why_Rust.webm"},
  {name: "Clojure Concurrency - Part I", link: "http://mahfel.rocks/sessions/Clojure_Conc_I.webm"},
  {name: "Clojure Concurrency - Part II", link: "http://mahfel.rocks/sessions/Clojure_Conc_II.webm"},
  ]

j = (x) -> x.name + "\n" + x.link

module.exports = (robot) ->
  robot.respond /sessions? #?(\d+|last|(list )?all)/i, (msg) ->
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

  robot.router.all "/hubot/sessions", (req, res) ->
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end JSON.stringify(sessions)
