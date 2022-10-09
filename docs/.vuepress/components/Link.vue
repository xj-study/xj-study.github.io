<template>
  <div class="xj-link-x">
    <LinkNode v-for="node in nodes" :node="node" :key="node.id"></LinkNode>
  </div>
</template>

<script setup>
import LinkNode from './LinkNode.vue'
const props = defineProps({
  // 节点列表
  nodes: [],
})
</script>

<style>
.xj-link-x {
  /* border: 1px solid var(--c-border); */
  padding: 0.2rem 0;
}
</style>
