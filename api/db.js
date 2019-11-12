const uuid = require('uuid/v4')
const models = require('../models')
const Dryness = models.dryness

const reverseGeoCoder = require('./reverseGeoCoder')

function check (urlInfo) {
  const error = {}

  // 必須クエリがない
  if (!urlInfo.query.lat || !urlInfo.query.long || !urlInfo.query.score) { error.msg = 'No query :' }
  if (!urlInfo.query.lat) { error.msg += ' lat' }
  if (!urlInfo.query.long) { error.msg += ' long' }
  if (!urlInfo.query.score) { error.msg += ' score' }

  if (error.msg) { return (false, error.msg) } else { return (true, 'OK') }
}

function getCode (pos) {
  return new Promise((resolve, reject) => {
    reverseGeoCoder.getCode(pos)
      .then((code) => {
        resolve([code, null])
      }, (err) => {
        // Use resolve() to return multiple values
        if (err.statusCode) {
          resolve([err.statusCode, err.message])
        } else {
          resolve([500, err.message])
        }
      })
  })
}

function create (urlInfo) {
  return new Promise(async (resolve, reject) => {
    const pos = {}

    const { ok, msg } = check(urlInfo)
    if (ok === false) { resolve([400, `"Error": "${msg}"`]) }

    pos.lat = urlInfo.query.lat
    pos.long = urlInfo.query.long
    const codeInfo = await getCode(pos)
    const code = codeInfo[0]
    const errMsg = codeInfo[1]
    if (code < 10000) {
      resolve([code, `"Error": "${errMsg}"`])
    } else {
      Dryness.create({
        id: uuid(),
        age: Number(urlInfo.query.age),
        sex: Number(urlInfo.query.sex),
        code,
        score: Number(urlInfo.query.score)
      })
        .then((record) => {
          resolve([200, record])
        })
        .catch((err) => {
          resolve([500, err])
        })
    }
  })
}

function read (id) {
  return new Promise((resolve, reject) => {
    Dryness.findByPk(id)
      .then((record) => {
        resolve(record ? [200, record] : [404, '{"Error": "Not Found"}'])
      })
      .catch((err) => {
        resolve([500, err])
      })
  })
}

function update (id, urlInfo) {
  return new Promise((resolve, reject) => {
    const pos = {}

    const { ok, msg } = check(urlInfo)
    if (ok === false) { resolve([400, `"Error": "${msg}"`]) }

    pos.lat = urlInfo.query.lat
    pos.long = urlInfo.query.long
    const { code, errMsg } = getCode(pos)
    if (code < 10000) {
      resolve([code, `"Error": "${errMsg}"`])
    } else {
      const param = {
        age: urlInfo.query.age,
        sex: urlInfo.query.sex,
        code,
        score: urlInfo.query.score
      }

      const filter = {
        where: {
          id
        }
      }

      Dryness.update(param, filter)
        .then((record) => {
          resolve([200, record])
        })
        .catch((err) => {
          resolve([500, err])
        })
    }
  })
}

function remove (id) {
  return new Promise((resolve, reject) => {
    const filter = {
      where: {
        id
      }
    }

    Dryness.destroy(filter)
      .then((record) => {
        resolve([200, record])
      })
      .catch((err) => {
        resolve([500, err])
      })
  })
}

module.exports = {
  create,
  read,
  update,
  remove
}
