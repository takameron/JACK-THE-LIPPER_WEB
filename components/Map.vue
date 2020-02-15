<template>
  <div id="yahoo_map" width="600" height="450" />
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('ymap/init')
  }
}
</script>

<style>
#yahoo_map {
  width: auto;
  height: 80vh;
}

#yahoo_map img{
  max-width: none;
}
</style>
