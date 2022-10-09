<template>
  <div class="xj-link-node-x">{{ node.text }}</div>
</template>

<script setup>
const props = defineProps({
  // 节点数据
  node: {},
})
</script>

<style>
.xj-link-node-x {
  display: inline-block;
  border: 1px solid var(--c-brand);
  padding: 0.2rem;
}

.xj-link-node-x + .xj-link-node-x {
  position: relative;
  margin-left: 3rem;
}

.xj-link-node-x + .xj-link-node-x::before {
  position: absolute;
  content: '--->';
  left: -2.5rem;
  color: var(--c-brand);
}
</style>
