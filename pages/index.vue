<template>
  <div>
    <navbar />
    <div id="wrapper" class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box">
            <Map />
          </div>
        </div>
        <div class="tile is-4 is-parent">
          <div class="tile is-child box">
            <List />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import Navbar from '~/components/Navbar.vue'
import List from '~/components/List.vue'
import Map from '~/components/Map.vue'

export default {
  components: {
    Navbar,
    List,
    Map
  },
  data () {
    return {
      socket: ''
    }
  },
  computed: {
    all_list () {
      return this.$store.state.dryness.all_list
    },
    query () {
      return this.$store.state.dryness.query
    }
  },
  watch: {
    all_list () {
      this.$store.dispatch('dryness/update')
      this.$store.dispatch('ymap/setColors')
    },
    query () {
      this.$store.dispatch('dryness/update')
      this.$store.dispatch('ymap/setColors')
    }
  },
  async fetch ({ store }) {
    await store.dispatch('geo_code/get')
  },
  mounted () {
    this.socket = io()

    this.socket.on('new-message', (message) => {
      // this.messages.push(message || {})
      this.$store.dispatch('dryness/add_record', message || {})
    })

    this.socket.on('update-message', (message) => {
      // const index = this.messages.findIndex(({ msg }) => index === message.id)
      // this.messages.splice(index, 1, message)
      this.$store.dispatch('dryness/update_record', message)
    })

    this.socket.on('remove-id', (id) => {
      // const index = this.messages.findIndex(({ msg }) => index === id)
      // this.messages.splice(index, 1)
      this.$store.dispatch('dryness/remove_record', id)
    })
  }
}
</script>
