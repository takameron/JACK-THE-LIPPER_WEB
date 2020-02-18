const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const models = require('../models')
const Dryness = models.dryness

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const auth = require('./auth')
config.dev = process.env.NODE_ENV !== 'production'

let server
let socketShare

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(auth)
  app.use(nuxt.render)

  // Listen the server
  server = app.listen(port, host)
  socketStart(server)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

function socketStart (server) {
  const io = require('socket.io').listen(server)

  io.on('connection', (socket) => {
    socketShare = socket
    consola.info({
      message: 'id: ' + socket.id + ' is connected',
      badge: true
    })

    Dryness.findAll()
      .then((records) => {
        if (records.length > 0) {
          records.forEach((record) => {
            socket.emit('new-message', record)
          })
        }
      })
      .catch((err) => {
        socket.emit('error', err)
      })
  })
}

// eslint-disable-next-line no-unused-vars
function sendNewRecord (record) {
  if (socketShare) {
    socketShare.emit('new-message', record)
    socketShare.broadcast.emit('new-message', record)
  }
}

function sendUpdateRecord (record) {
  if (socketShare) {
    socketShare.emit('update-message', record)
    socketShare.broadcast.emit('update-message', record)
  }
}

function sendRemoveRecord (id) {
  if (socketShare) {
    socketShare.emit('remove-id', id)
    socketShare.broadcast.emit('remove-id', id)
  }
}

start()

module.exports = {
  sendNewRecord,
  sendUpdateRecord,
  sendRemoveRecord
}
