const https = require('https')
const consola = require('consola')

const environment = process.env.NODE_ENV || 'development'
const env = require(`../env.${environment}.js`)

const apiKey = env.YAHOO_APIKEY

class CanNotGetCodeError extends Error {
  constructor (message, statusCode, path) {
    super(message)
    this.statusCode = statusCode
    this.path = path
  }
}

function getCode (pos) {
  const options = {
    protocol: 'https:',
    host: 'map.yahooapis.jp',
    port: 443,
    path: '/geoapi/V1/reverseGeoCoder' + `?appid=${apiKey}&lat=${pos.lat}&lon=${pos.long}&output=json`,
    method: 'GET'
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        let data = {}
        try {
          data = JSON.parse(body)
          if (res.statusCode !== 200 || data.Error) {
            throw new CanNotGetCodeError(data.Error.Message, res.statusCode, req.path)
          }
          if (data.ResultInfo.Count === 0) {
            throw new CanNotGetCodeError('Not found', 404, req.path)
          }
          let found = false
          const elements = data.Feature[0].Property.AddressElement
          for (const element in elements) {
            if (elements[element].Level === 'city') {
              found = true
              resolve(Number(elements[element].Code))
            }
          }
          if (found === false) {
            throw new CanNotGetCodeError('Not found', 404, req.path)
          }
        } catch (e) {
          if (e instanceof CanNotGetCodeError) {
            consola.error({
              message: 'Failed to get code' + ` <${e.statusCode}: ${e.message}>` + ` ${e.path}`,
              badge: true
            })
          } else {
            consola.error({
              message: `problem with request: ${e.message}\n` + `${e}`,
              badge: true
            })
          }
          reject(e)
        }
      })
    }).on('error', (e) => {
      consola.error({
        message: `problem with request: ${e.message}`,
        badge: true
      })
      reject(e)
    })
    req.end()
  })
}

module.exports = {
  getCode
}
