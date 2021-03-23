const { v4: uuid } = require('uuid')
const models = require('../models')
const Dryness = models.dryness

const reverseGeoCoder = require('./reverseGeoCoder')

function check (urlInfo) {
  const error = {}
  error.msg = ''

  // 必須クエリがない
  if (!urlInfo.query.lat || !urlInfo.query.long || !urlInfo.query.score) { error.msg += 'No query :' }
  if (!urlInfo.query.lat) { error.msg += ' lat' }
  if (!urlInfo.query.long) { error.msg += ' long' }
  if (!urlInfo.query.score) { error.msg += ' score' }

  // lat, longの形式
  if (isFinite(urlInfo.query.lat) && isFinite(urlInfo.query.long)) {
    const lat = parseFloat(urlInfo.query.lat)
    const long = parseFloat(urlInfo.query.long)
    if (lat < 20.2531 || lat > 45.3326) {
      error.msg += 'Invalid lat range. The range is 20.2531-45.3326.'
    }
    if (long < 122.5557 || long > 153.5912) {
      error.msg += 'Invalid long range. The range is 122.5557-153.5912.'
    }
  } else {
    error.msg += 'lat or long is not a number.'
  }
  // 年齢の形式
  if (isFinite(urlInfo.query.age)) {
    const age = Number(urlInfo.query.age)
    if (!Number.isInteger(age)) { error.msg += 'age is not an integer.' }
    if (age < 0 || age > 130) {
      error.msg += 'Invalid age range. The range is 0-130.'
    }
  } else {
    error.msg += 'score is not a number.'
  }
  // 性別の形式
  if (isFinite(urlInfo.query.sex)) {
    const sex = Number(urlInfo.query.sex)
    if (!Number.isInteger(sex)) { error.msg += 'sex is not an integer.' }
    if (!(sex === 0 || sex === 1)) {
      error.msg += 'Invalid sex value. sex value is 0 or 1.'
    }
  } else {
    error.msg += 'sex is not a number.'
  }
  // scoreの形式
  if (isFinite(urlInfo.query.score)) {
    const score = Number(urlInfo.query.score)
    if (!Number.isInteger(score)) { error.msg += 'score is not an integer.' }
    if (score < 1 || score > 5) {
      error.msg += 'Invalid score range. The range is 1-5.'
    }
  } else {
    error.msg += 'score is not a number.'
  }

  if (error.msg !== '') { return { ok: false, msg: error.msg } } else { return { ok: true, msg: 'OK' } }
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

async function create (urlInfo) {
  const pos = {}

  const { ok, msg } = check(urlInfo)
  if (ok === false) {
    return Promise.resolve([400, `"Error": "${msg}"`])
  }

  pos.lat = urlInfo.query.lat
  pos.long = urlInfo.query.long
  const codeInfo = await getCode(pos)

  return new Promise((resolve, reject) => {
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
          if (record === 0) {
            resolve([400, '{"Error": "Not Found"}'])
          }
        })
        .catch((err) => {
          resolve([500, err])
        })

      Dryness.findByPk(id)
        .then((r) => {
          resolve(r ? [200, r] : [404, '{"Error": "Not Found"}'])
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
