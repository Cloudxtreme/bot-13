# Description:
#   "Accepts POST and GET data and broadcasts it"
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   None
#
# URLs:
#   POST /hubot/dump
#     message = <message>
#     room = <room>
#
#
#   curl -X POST "http://hubotIp:hubotPort/hubot/dump?foo=bar&name=richard" -d myPost=stallman
#
# Author:
#   beygi

querystring = require('querystring')
url = require('url')

module.exports = (robot) ->
  robot.router.all "/hubot/dump", (req, res) ->

    room = "#mahfel"
    
    POSTS = Object.keys(req.body)
    query = querystring.parse(url.parse(req.url).query)
    GETS=Object.keys(query)
    #robot.logger.info "Message '#{message}' received for room #{room}"

    user = robot.brain.userForId 'broadcast'
    user.room = room
    user.type = 'groupchat'

    for postData in POSTS
        robot.send user, "POST-> "+postData+': "'+req.body[postData]+'"';
    
    for getData in GETS
        robot.send user, "GET-> "+getData+': "'+query[getData]+'"';

    res.writeHead 200, {'Content-Type': 'text/plain'}
    res.end 'Thanks\n'