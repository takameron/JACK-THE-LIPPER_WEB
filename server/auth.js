const auth = require('basic-auth')

const environment = process.env.NODE_ENV || 'development'
const env = require(`../env.${environment}.js`)

const password = env.BASIC_PASSWORD

const admins = {
  'username': { password }
}

module.exports = function (request, response, next) {
  if (password) {
    const user = auth(request)
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
      response.set('WWW-Authenticate', 'Basic realm="example"')
      return response.status(401).send()
    }
  }
  return next()
}
