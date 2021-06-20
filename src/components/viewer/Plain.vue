<template>
  <div id="messages">{{ logMessages }}</div>
</template>

<script>
export default {
  props: ["logs"],
  computed: {
    logMessages() {
      return this.logs
        .map((log) => {
          return log.join(",");
        })
        .join("\n");
    },
  },
};
</script>
