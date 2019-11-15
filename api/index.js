const path = require('path')
const consola = require('consola')
const express = require('express')
const app = express()

const srv = require('../server/index')
const db = require('./db')
let urlInfo

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// 共通処理
app.all('/*', (request, response, next) => {
  // クエリー文字列を含めてurl情報を取得（trueオプションでクエリ文字列も取得）
  urlInfo = request
  // jsonでレスポンス（外部の人もアクセスできるようにAccess-Control-Allow-Originを設定）
  response.contentType('json')
  response.header('Access-Control-Allow-Origin', '*')
  next()
})

app.post('/v1/dryness/', async function (req, res, next) {
  const info = await db.create(urlInfo)
  const statusCode = info[0]
  const record = info[1]

  if (statusCode !== 200) {
    consola.error({
      message: `Coundn't create record: ${statusCode} ${record} ${req.url}`,
      badge: true
    })
  } else {
    srv.sendNewRecord(record)
  }
  res.status(statusCode).send(record)
})

app.get('/v1/dryness/:id', async function (req, res, next) {
  const info = await db.read(req.params.id)
  const statusCode = info[0]
  const record = info[1]
  if (statusCode !== 200) {
    consola.error({
      message: `Coundn't read record: ${statusCode} ${record}`,
      badge: true
    })
  }
  res.status(statusCode).send(record)
})

app.put('/v1/dryness/:id', async function (req, res, next) {
  const info = await db.update(req.params.id, urlInfo)
  const statusCode = info[0]
  const record = info[1]

  if (statusCode !== 200) {
    consola.error({
      message: `Coundn't update record: ${statusCode} ${record}`,
      badge: true
    })
  } else {
    srv.sendUpdateRecord(record)
  }
  res.status(statusCode).send(record)
})

app.delete('/v1/dryness/:id', async function (req, res, next) {
  const info = await db.remove(req.params.id)
  const statusCode = info[0]
  const count = info[1]

  if (statusCode !== 200) {
    consola.error({
      message: `problem with request: ${statusCode} ${count}`,
      badge: true
    })
  } else if (count === 0) {
    res.status(404).send(`{"Error": "Not Found"}`)
  } else {
    srv.sendRemoveRecord(req.params.id)
    res.status(statusCode).send(`{"Destroyed": ${count}}`)
  }
})

module.exports = {
  path: '/api/',
  handler: app
}
