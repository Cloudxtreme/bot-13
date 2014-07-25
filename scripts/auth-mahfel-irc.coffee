# Description:
#   Auth allows you to assign roles to users which can be used by other scripts
#   to restrict access to Hubot commands
#
# Dependencies:
#   None
#
# Configuration:
#   HUBOT_AUTH_ADMIN - A comma separate list of user IDs
#
# Commands:
#   hubot <user> has <role> role - Assigns a role to a user
#   hubot <user> doesn't have <role> role - Removes a role from a user
#   hubot what role does <user> have - Find out what roles are assigned to a specific user
#   hubot who has admin role - Find out who's an admin and can assign roles
#   hubot who has <role> role - Find out who's an admin and can assign roles
#
# Notes:
#   * Call the method: robot.auth.hasRole(msg.envelope.user,'<role>')
#   * returns bool true or false
#
#   * the 'admin' role can only be assigned through the environment variable
#   * roles are all transformed to lower case
#
#   * The script assumes that user IDs will be unique on the service end as to
#     correctly identify a user. Names were insecure as a user could impersonate
#     a user
#
# Author:
#   alexwilliamsca, tombell

module.exports = (robot) ->

  unless process.env.HUBOT_AUTH_ADMIN?
    robot.logger.warning 'The HUBOT_AUTH_ADMIN environment variable not set'

  if process.env.HUBOT_AUTH_ADMIN?
    admins = process.env.HUBOT_AUTH_ADMIN.split ','
  else
    admins = []

  class Auth
    hasRole: (user, roles) ->
      user = robot.brain.userForName(user.name)
      if user? and user.roles?
        roles = [roles] if typeof roles is 'string'
        for role in roles
          return true if role in user.roles
      return false

    usersWithRole: (role) ->
      users = []
      for own key, user of robot.brain.data.users
        if user.name!=undefined and robot.auth.hasRole(user, role) and users.indexOf(user.name.toLowerCase())==-1
          users.push(user.name.toLowerCase())
      users
      
  class Mahfel
    fixRoles: (users) ->
      #clean up all roles
      for own key, fetchUser of robot.brain.data.users
        if(fetchUser.name!=undefined)
            user = robot.brain.userForName(fetchUser.name)
            user.roles=[]
      for mahfelUser in users
        user = robot.brain.userForName(mahfelUser.name)
        if (user!=null)
            #clean all roles and add role from mongodb's data
            user.roles=[mahfelUser.role]
            console.log("add "+mahfelUser.role+" to "+user.name)
                
  robot.mahfel = new Mahfel          
  robot.auth = new Auth

  robot.respond /@?(.+) (has) (["'\w: -_]+) (role)/i, (msg) ->
    name    = msg.match[1].trim()
    newRole = msg.match[3].trim().toLowerCase()

    unless name.toLowerCase() in ['', 'who', 'what', 'where', 'when', 'why']
      user = robot.brain.userForName(name)
      return msg.reply "#{name} does not exist" unless user?
      user.roles or= []

      if newRole in user.roles
        msg.reply "#{name} already has the '#{newRole}' role."
      else
        if newRole is 'admin'
          msg.reply "Sorry, the 'admin' role can only be defined in the HUBOT_AUTH_ADMIN env variable."
        else
          myRoles = msg.message.user.roles or []
          if msg.message.user.name.toString() in admins
            user.roles.push(newRole)
            msg.reply "Ok, #{name} has the '#{newRole}' role."

  robot.respond /@?(.+) (doesn't have|does not have) (["'\w: -_]+) (role)/i, (msg) ->
    name    = msg.match[1].trim()
    newRole = msg.match[3].trim().toLowerCase()

    unless name.toLowerCase() in ['', 'who', 'what', 'where', 'when', 'why']
      user = robot.brain.userForName(name)
      return msg.reply "#{name} does not exist" unless user?
      user.roles or= []

      if newRole is 'admin'
        msg.reply "Sorry, the 'admin' role can only be removed from the HUBOT_AUTH_ADMIN env variable."
      else
        myRoles = msg.message.user.roles or []
        if msg.message.user.name.toString() in admins
          user.roles = (role for role in user.roles when role isnt newRole)
          msg.reply "Ok, #{name} doesn't have the '#{newRole}' role."

  robot.respond /(what role does|what roles does) @?(.+) (have)\?*$/i, (msg) ->
    name = msg.match[2].trim()
    user = robot.brain.userForName(name)
    return msg.reply "#{name} does not exist" unless user?
    user.roles or= []
    displayRoles = user.roles

    if user.name.toString() in admins
      displayRoles.push('admin') unless 'admin' in user.roles

    if displayRoles.length == 0
      msg.reply "#{name} has no roles."
    else
      msg.reply "#{name} has the following roles: #{displayRoles.join(', ')}."

  robot.respond /who has admin role\?*$/i, (msg) ->
    adminNames = []
    for admin in admins
      user = robot.brain.userForName(admin)
      unless robot.auth.hasRole(msg.envelope.user,'admin')
        adminNames.push user.name if user?

    if adminNames.length > 0
      msg.reply "The following people have the 'admin' role: #{adminNames.join(', ')}"
    else
      msg.reply "There are no people that have the 'admin' role."
      
  robot.respond /who has @?(.+) role\?*$/i, (msg) ->
    role = msg.match[1].trim().toLowerCase()
    if role!='admin'
        users=robot.auth.usersWithRole(role)
        if users.length > 0
          msg.reply "The following people have the '"+role+"' role: #{users.join(', ')}"
        else
          msg.reply "There are no people that have the '"+role+"' role."

