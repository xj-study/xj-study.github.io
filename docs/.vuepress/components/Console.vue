<template>
  <div class="console-x">
    <p>{{ title }}</p>
    <div class="console">
      <div class="console-item" v-for="(val, index) in list" :key="index">{{ val }}</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: { type: String, default: 'Console 日志打印如下图显示：' },
  content: { type: [String, Array], default: '' },
})

const list = computed(() => {
  if (typeof props.content == 'string') return [props.content]
  return props.content
})
</script>

<style>
.console {
  margin: 1rem 0 2rem;
  padding: 0.25rem 0 0.25rem 1rem;
  border-left: 0.2rem solid var(--c-brand);
}
</style>
