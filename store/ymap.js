let ymap = {}
let blankmap = {}

function median (arr) {
  const half = (arr.length / 2) | 0
  const temp = arr.sort()

  if (temp.length % 2) {
    return temp[half]
  } else {
    return (temp[half - 1] + temp[half]) / 2
  }
}

export const state = () => ({
  center: {
    lat: 36.111221,
    lng: 137.950266
  },
  zoom: 10
})

export const mutations = {
  setCenter (state, latlng) {
    state.center = latlng
    ymap.panTo({
      center: new Y.LatLng(state.center.lat, state.center.lng),
      animation: true
    })
  },
  setColors (state, list) {
    const zoomLevel = ymap.getZoom()

    const colors = {}
    colors.area = {}
    colors.area.default = 'dcdcdc'
    for (const item in list) {
      if (zoomLevel > 8) {
        // 市町村単位で集計（同一の自治体コードのスコアを配列化）

        // すでに計算済みでないか確認（なくても同じハッシュに同じキーを代入するだけだから結果は変わらない）
        if (colors.area[list[item].code]) { continue }
        let typicalValue = 0 // 代表値
        const scores = []

        const sameCode = list.filter(i => list[item].code === i.code)
        for (const i in sameCode) {
          scores.push(sameCode[i].score)
        }
        typicalValue = median(scores) // 中央値
        colors.area[list[item].code] = this.$stageColor(typicalValue)
      } else {
        // 都道府県単位で集計（自治体コードの上位2桁が同じもののスコアを配列化）
        const prefCode = parseInt(list[item].code / 1000)
        if (colors.area[prefCode]) { continue }
        let typicalValue = 0
        const scores = []

        const sameCode = list.filter((i, index) => prefCode === parseInt(i.code / 1000))
        for (const i in sameCode) {
          scores.push(sameCode[i].score)
        }
        typicalValue = median(scores) // 中央値
        colors.area[prefCode] = this.$stageColor(typicalValue)
      }
    }

    colors.label = {}
    colors.border = {}
    colors.label.default = '696969'
    colors.border.default = 'aaa'
    colors.bg = 'b0c4de'

    blankmap.setStyle(colors, true)
  },
  init (state) {
    /* global Y */
    ymap = new Y.Map('yahoo_map', { configure: { scrollWheelZoom: true } })
    ymap.addControl(new Y.SliderZoomControlVertical())

    blankmap = new Y.BlankMapLayer()
    const layerset = new Y.LayerSet('白地図', [blankmap], { maxZoom: 13, minZoom: 6 })
    ymap.addLayerSet('blankmap', layerset)

    ymap.drawMap(
      new Y.LatLng(state.center.lat, state.center.lng),
      state.zoom,
      Y.LayerSetId.NORMAL
    )
    ymap.setLayerSet('blankmap')
  }
}

export const actions = {
  setCenter ({ commit }, latlng) {
    commit('setCenter', latlng)
  },
  setColors ({ rootState, commit }) {
    commit('setColors', rootState.dryness.match_list)
  },
  init ({ rootState, commit }) {
    commit('init')
    ymap.bind('zoomend', () => commit('setColors', rootState.dryness.match_list))
  }
}
