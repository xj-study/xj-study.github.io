<template>
  <div class="cell">
    <slot></slot>
  </div>
</template>

<script setup>
import { useSlots } from 'vue'
const slots = useSlots()
let nodes = slots.default()
console.log('nodes', nodes)
</script>
