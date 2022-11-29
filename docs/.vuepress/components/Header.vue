<template>
  <div class="xj-header-x">
    <router-link class="prev" :to="prev"> 返回</router-link>
    <router-link class="next" :to="next">下一页 </router-link>
  </div>
</template>

<script setup>
const props = defineProps({
  // 节点列表
  prev: '',
  next: '',
})
</script>

<style>
.xj-header-x {
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;

  padding-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
}
.xj-header-x .prev:before {
  content: '←';
}

.xj-header-x .next:after {
  content: '→';
}

.xj-header-x a:hover {
  text-decoration: none;
}
</style>
