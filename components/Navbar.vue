<template>
  <nav class="navbar is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        JACK THE LIPPER
      </div>
    </div>
    <div class="navbar-menu navbar-start is-active">
      <Search />
    </div>
  </nav>
</template>

<script>
import Search from '~/components/Search.vue'

export default {
  components: {
    Search
  }
}
</script>
