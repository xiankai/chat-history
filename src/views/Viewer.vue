<template>
  <div>This is the chat history page</div>
  <ListComponent :items="recipients" v-model:selectedItem="recipient" />
  <v-date-picker v-model="date" />
  <component :is="AsyncViewerComponent" :logs="logs" />
</template>

<script>
  import { defineAsyncComponent } from "@vue/runtime-core";
  import ListComponent from "../components/ListComponent";
  const date = new Date("2008-11-06");

  export default {
    name: "Viewer",
    data() {
      return {
        recipients: this.$datasource.retrieveBucketListFromStorage(),
        recipient: "duvly@hotmail.com",
        date,
      };
    },
    computed: {
      logs() {
        const logs = this.$datasource.retrieveBucketFromStorage(this.recipient, {
          year: this.date.getFullYear(),
          month: this.date.getMonth() + 1,
          day: this.date.getDate() + 1,
        });
        return logs;
      },
      AsyncViewerComponent() {
        return defineAsyncComponent(() =>
          import(`../components/viewer/${this.$viewerComponent}.vue`)
        );
      },
    },
    components: {
      ListComponent,
    },
  };
</script>

<style>
  #messages {
    white-space: pre-line;
    text-align: left;
  }
</style>