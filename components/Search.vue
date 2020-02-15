<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        条件で抽出
      </div>
      <div class="level-item">
        <p class="is-5">
          <label for="prefecture">都道府県</label>
        </p>
        <div class="select">
          <select id="prefecture" v-model="prefecture">
            <option v-for="record in returnPref" :key="record.code" v-bind:value="record.code">
              {{ record.pref_kanji }}
            </option>
          </select>
        </div>
      </div>

      <div class="level-item">
        <p class="is-5">
          <label for="city">市区町村</label>
        </p>
        <div class="select">
          <select id="city" v-model="city">
            <option v-for="record in returnCities" :key="record.code" v-bind:value="record.code">
              {{ record.city_kanji }}
            </option>
          </select>
        </div>
      </div>

      <div class="level-item">
        <p class="is-5">
          <label for="city">期間</label>
        </p>
        <b-field>
          <b-datepicker
            v-model="dates"
            placeholder="Click to select..."
            range
          />
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dates: [],
      prefecture: 0,
      city: 0
    }
  },
  computed: {
    returnPref () {
      const list = this.$store.getters['geo_code/list'].slice()
      const res = list.filter((value, index) => {
        if (value.code % 1000 === 0) { return value }
      })
      return res
    },
    returnCities () {
      const list = this.$store.getters['geo_code/list'].slice()
      const res = list.filter((value, index) => {
        if (parseInt(value.code / 1000) === parseInt(this.prefecture / 1000)) { return value }
      })
      return res
    }
  },
  watch: {
    dates () {
      this.$store.dispatch('dryness/change_query',
        { 'start': this.dates[0], 'end': this.dates[1], 'prefecture': this.prefecture, 'city': this.city })
    },
    prefecture () {
      this.$store.dispatch('dryness/change_query',
        { 'start': this.dates[0], 'end': this.dates[1], 'prefecture': this.prefecture, 'city': this.city })
    },
    city () {
      this.$store.dispatch('dryness/change_query',
        { 'start': this.dates[0], 'end': this.dates[1], 'prefecture': this.prefecture, 'city': this.city })
    }
  }
}
</script>
