# Description:
#   An HTTP Listener for notifications on github pushes
#
# Dependencies:
#   "url": ""
#   "querystring": ""
#   "gitio2": "2.0.0"
#
# Configuration:
#   Just put this url <HUBOT_URL>:<PORT>/hubot/gh-commits?room=<room> into you'r github hooks
#
# Commands:
#   None
#
# URLS:
#   POST /hubot/gh-commits?room=<room>[&type=<type]
#
# Authors:
#   nesQuick

url = require('url')
querystring = require('querystring')
gitio = require('gitio2')
child_process = require 'child_process'

module.exports = (robot) ->

  robot.router.post "/hubot/gh-commits", (req, res) ->
    query = querystring.parse(url.parse(req.url).query)

    res.send 200

    user = {}
    user.room = query.room if query.room
    user.type = query.type if query.type

    return if req.body.zen? # initial ping
    push = req.body

    try
      if push.commits.length > 0
        commitWord = if push.commits.length > 1 then "commits" else "commit"
        robot.send user, "Got #{push.commits.length} new #{commitWord} from #{push.commits[0].author.name} on #{push.repository.name}"
               
        for commit in push.commits
          do (commit) ->
            gitio commit.url, (err, data) ->
              robot.send user, "  * #{commit.message} (#{if err then commit.url else data})"
      else
        if push.created
          robot.send user, "#{push.pusher.name} created: #{push.ref}: #{push.base_ref}"
        if push.deleted
          robot.send user, "#{push.pusher.name} deleted: #{push.ref}"
      
      #reload
      setTimeout (->
        robot.send user, "update repository using git pull,run npm install and reRun the process ..."         
      ), 2000
       
      setTimeout (->
         process.exit 0         
      ), 4000


    catch error
      console.log "github-commits error: #{error}. Push: #{push}"

