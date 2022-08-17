<template>
  <div class="demo-x">
    <p>{{ title }}</p>
    <div class="demo">{{ current }}</div>
  </div>
</template>
<script setup>
import { computed, ref, onUnmounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '这时页面如下图显示：' },
  content: { type: [String, Array], default: '' },
  duration: { type: [Number, Array], default: 1000 },
})

const isStep = computed(() => Array.isArray(props.content))
const currentIndex = ref(0)
const currentDuration = computed(() => {
  if (Array.isArray(props.duration)) {
    return props.duration[currentIndex.value]
  }
  return props.duration
})

const current = computed(() => {
  if (Array.isArray(props.content)) {
    return props.content[currentIndex.value]
  }
  return props.content
})

let stepId = null
if (isStep.value) step()

function step() {
  stepId = setTimeout(() => {
    currentIndex.value = currentIndex.value + 1
    if (currentIndex.value >= props.content.length) currentIndex.value = 0

    step()
  }, currentDuration.value)
}

onUnmounted(() => {
  stepId && clearTimeout(stepId)
})
</script>

<style>
.demo {
  margin: 1rem 0 2rem;
  padding: 0.25rem 0 0.25rem 1rem;
  border-left: 0.3rem solid var(--c-brand);
}
</style>
