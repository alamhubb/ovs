<script setup lang="ts">
const props = defineProps(['node']);
const node = props.node
</script>

<template>
  <div class="row-center no-wrap overflow-hidden">
    {{ node.key }}${{ node.name||node.image }}
  </div>
  <div class="flex-row">
    <div class="flex-1" v-for="(child,index) in node.children">
      <tree-view :node="child"></tree-view>
    </div>
  </div>
</template>

