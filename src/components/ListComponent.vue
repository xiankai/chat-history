<template>
  <ul>
    <li
      v-for="item in items"
      :key="item"
      @click="$emit('update:selectedItem', item)"
      :class="{ 'text-red-500': item === selectedItem }"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script lang="ts">
  import { Options, Vue } from "vue-class-component";

  @Options({
    props: {
      items: Array,
      selectedItem: String,
    },
  })
  export default class ListComponent extends Vue {
    items!: Array<any>;
    selectedItem: string;
  }
</script>
