<template>
  <div class="demo-x">
    <p>
      <span>{{ title }}</span>
      <div v-if="isStep" :class="['btn', {active: isRunning}]" @click="start">{{ btnName }}</div>
    </p>
    
    <div class="demo">{{ current }}</div>
  </div>
</template>
<script setup>
import { computed, ref, onUnmounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '运行一下，页面如下显示：' },
  content: { type: [String, Array], default: '' },
  duration: { type: [Number, Array], default: 1000 },
})

const isStep = computed(() => Array.isArray(props.content))
const isRunning = ref(false)
const btnName = computed(() => (isRunning.value ? '运行中' : '开始运行'))
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

function start(){
  if (isRunning.value) return
  isRunning.value = true
  currentIndex.value = 0
  step()
}

let stepId = null
function step() {
  stepId = setTimeout(() => {
    console.log('step', currentIndex)
    if (currentIndex.value + 1 >= props.content.length) {
      stepId = null
      isRunning.value = false
    } else {
      currentIndex.value = currentIndex.value + 1
      step()
    }
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
  border-left: 0.2rem solid var(--c-brand);
}
.btn {
  position: relative;
  display: inline-block;
  cursor: pointer;
  font-size: 0.8rem;
  padding-left: 12px;
}

.btn:before{
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  content: '';
  border: 0.4rem transparent solid;
  border-left-color: var(--c-brand);
}
.active.btn:before{
  position: absolute;
  border: none;
  width: 0.6rem;
  height: 0.6rem;
  background: var(--c-danger);
}
</style>
