<template>
  <div>This is the chat history page</div>
  <div id="messages">{{ logMessages }}</div>
</template>

<script>

const date = new Date();

export default {
  name: "Viewer",
  data() {
    const logs = this.$datasource.retrieveBucketFromStorage({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate() + 1,
    });
    return {logs};
  },
  computed: {
    logMessages() {
      return this.logs.map(log => {
        return log.join(',');
      }).join('\n');
    }
  },
}
</script>

<style>
  #messages {
    white-space: pre-line;
    text-align: left;
  }
</style>