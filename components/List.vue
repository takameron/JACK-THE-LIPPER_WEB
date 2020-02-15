<template>
  <section id="list" class="section">
    <article v-for="(message, index) in reverseMessages" :key="index" class="media">
      <div class="media-left">
        <p class="list-score">
          {{ message.score }}
        </p>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <small>{{ message.createdAt | dateFormatter }}</small><br>
            {{ convCode2Pos(message.code) }} {{ message.age }}歳 {{ message.sex | convSex2Char }}
          </p>
        </div>
      </div>
    </article>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false" />
  </section>
</template>

<script>
import format from 'date-fns/format'

export default {
  filters: {
    dateFormatter (date) {
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
    },
    convSex2Char (sex) {
      if (sex === 0) {
        return '男性'
      } else if (sex === 1) {
        return '女性'
      } else {
        return 'その他の性別'
      }
    }
  },
  data () {
    return {
      isLoading: true
    }
  },
  computed: {
    // 最新のメッセージを上位に表示
    reverseMessages () {
      // return this.messages.slice().reverse()
      return this.$store.getters['dryness/match_list'].slice().reverse()
    }
  },
  mounted () {
    // ローディングアニメーション
    setTimeout(() => {
      this.isLoading = false
    }, 1000)
  },
  methods: {
    convCode2Pos (code) {
      const list = this.$store.getters['geo_code/list'].slice()
      const res = list.filter((value, index) => {
        if (value.code === code) { return value }
      })
      if (res.length !== 0) {
        return res[0].pref_kanji + res[0].city_kanji
      } else {
        return '取得に失敗した市町村名'
      }
    }
  }
}
</script>

<style>
#list {
  max-height:80vh;
  overflow: auto;
}
.list-score {
  font-size: xx-large;
}
</style>
