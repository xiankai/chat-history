<template>
  <h1>This is the search page</h1>
  <input v-model="search" />
  <div id="messages">{{ foundMessages }}</div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {search: ''};
  },
  computed: {
    logs() {
      return this.$datasource.searchStorage(this.search) || [];
    },
    foundMessages() {
      return this.logs.map(log => {
        return log.join(',');
      }).join('\n');
    }
  }
}
</script>

<style>
  #messages {
    white-space: pre-line;
    text-align: left;
  }
</style>