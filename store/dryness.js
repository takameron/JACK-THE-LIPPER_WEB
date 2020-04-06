export const state = () => ({
  all_list: [],
  match_list: [],
  query: {
    start: null,
    end: null,
    prefecture: null,
    city: null
  }
})

export const mutations = {
  add_record (state, record) {
    const index = state.all_list.findIndex(() => index === record.id)
    if (index === -1) {
      state.all_list.push(record)
    }
  },
  update_record (state, record) {
    const index = state.all_list.findIndex(() => index === record.id)
    state.all_list.splice(index, 1, record)
  },
  remove_record (state, id) {
    const index = state.all_list.findIndex(() => index === id)
    state.all_list.splice(index, 1)
  },
  change_query (state, query) {
    state.query = query
  },
  update (state) {
    // all_list と query から match_list を更新
    //
    // start, end の間
    // prefecture に合致 00000なら全て(all_list)
    // city に合致 ??000なら??の数字に合致
    state.match_list = state.all_list.filter((item, index) => {
      if ((state.query.start <= new Date(item.createdAt) && new Date(item.createdAt) <= state.query.end) || (!state.query.start || !state.query.end === null)) {
        if (parseInt(state.query.prefecture / 1000) === parseInt(item.code / 1000) || state.query.prefecture === 0 || state.query.prefecture === null) {
          if (parseInt(state.query.city) === parseInt(item.code) || parseInt(state.query.city % 1000) === 0) {
            return true
          }
        }
      }

    // 仮
    // state.match_list = state.all_list.concat()
    })
  }
}

export const actions = {
  add_record ({ commit }, record) {
    commit('add_record', record)
  },
  update_record ({ commit }, record) {
    commit('update_record', record)
  },
  remove_record ({ commit }, id) {
    commit('remove_record', id)
  },
  change_query ({ commit }, query) {
    commit('change_query', query)
  },
  update ({ commit }) {
    commit('update')
  }
}

export const getters = {
  match_list (state) {
    return state.match_list
  },
  query (state) {
    return state.query
  }
}
