export const state = () => ({
  list: []
})

export const mutations = {
  get (state) {
    // const csv = require('csv')
    // const iconv = require('iconv-lite')
    // // const Iconv = require('iconv-lite').Iconv
    // // const iconv = new Iconv('sjis', 'utf-8//TRANSLIT//IGNORE')

    // const filename = '../data/jititai-code.csv'

    // const parser = csv.parse({ columns: ['code', 'pref_kanji', 'city_kanji', 'pref_kana', 'city_kana'] })
    // if (process.server) {
    //   const fs = require('fs')
    //   const readableStream = fs.createReadStream(filename)
    //   readableStream.pipe(iconv.decodeStream('shift_jis')).pipe(iconv.encodeStream('utf8')).pipe(parser)
    // }

    // parser.on('readable', () => {
    //   let data
    //   // eslint-disable-next-line no-cond-assign
    //   while (data = parser.read()) {
    //     console.log(data)
    //   }
    // })

    // parser.on('end', () => {
    //   console.log('end')
    // })

    // eslint-disable-next-line import/no-webpack-loader-syntax
    const csvObj = require('raw-loader!../data/jititai-code.csv')
    const csvStr = csvObj.default
    const splitAry = csvStr.split('\r\n')

    const all = {} // 1列の連想配列
    all.code = parseInt(0)
    all.pref_kanji = '全国'
    all.city_kanji = '全域'
    all.pref_kana = 'ｾﾞﾝｺｸ'
    all.city_kana = 'ｾﾞﾝｲｷ'
    state.list.push(all)

    // 1行目は項目名のため除外
    for (let i = 1; i < splitAry.length - 1; i++) {
      const line = {} // 1列の連想配列
      const lineAry = splitAry[i].split(',')
      line.code = parseInt(lineAry[0] / 10) // チェックサムを除去
      line.pref_kanji = lineAry[1]
      line.city_kanji = lineAry[2]
      line.pref_kana = lineAry[3]
      line.city_kana = lineAry[4]
      if (line.code % 1000 === 0) { // 都道府県のコードについては、市名を「全域」にする
        line.city_kanji = '全域'
        line.city_kana = 'ｾﾞﾝｲｷ'
      }
      state.list.push(line)
    }

    // const parse = require('csv-parse')
    // // eslint-disable-next-line import/no-webpack-loader-syntax
    // const csvStr = require('raw-loader!../data/jititai-code.csv')
    // console.log(csvStr)

    // const output = []
    // parse(csvStr, {
    //   trim: true,
    //   skip_empty_lines: true,
    //   columns: ['code', 'pref_kanji', 'city_kanji', 'pref_kana', 'city_kana']
    // })
    //   // Use the readable stream api
    //   .on('readable', function () {
    //     let record
    //     // eslint-disable-next-line no-cond-assign
    //     while (record = this.read()) {
    //       output.push(record)
    //       console.log(record)
    //     }
    //   })
  }
}

export const actions = {
  get ({ commit }) {
    commit('get')
  }
}

export const getters = {
  list (state) { return state.list }
}
