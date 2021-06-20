<template>
  <div>This is the chat history page</div>
  <component :is="AsyncViewerComponent" :logs="logs" />
</template>

<script>
  import { defineAsyncComponent } from "@vue/runtime-core";
  const date = new Date("2008-11-06");

  export default {
    name: "Viewer",
    data() {
      const logs = this.$datasource.retrieveBucketFromStorage({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate() + 1,
      });
      return { logs };
    },
    computed: {
      AsyncViewerComponent() {
        return defineAsyncComponent(() =>
          import(`../components/viewer/${this.$viewerComponent}.vue`)
        );
      },
    },
  };
</script>

<style>
  #messages {
    white-space: pre-line;
    text-align: left;
  }
</style>