<template>
  <div id="container">
    <div class="area">
      <div class="rectangle"></div>
      <div class="circle"></div>
      <div class="text-area">
        <h1>Example line of text</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { renderer } from '@/pages/PageTwo/zooming'

onMounted(() => {
  const container = document.getElementById('container')
  const instance = renderer({
    minScale: 0.1,
    maxScale: 30,
    element: container.children[0],
    scaleSensitivity: 50
  })
  container.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) {
      return
    }
    event.preventDefault()
    instance.zoom({
      deltaScale: Math.sign(event.deltaY) > 0 ? 1 : -1,
      x: event.pageX,
      y: event.pageY
    })
  })
  container.addEventListener('dblclick', () => {
    instance.panTo({
      originX: 0,
      originY: 0,
      scale: 1
    })
  })
  container.addEventListener('mousemove', (event) => {
    if (!event.shiftKey) {
      return
    }
    event.preventDefault()
    instance.panBy({
      originX: event.movementX,
      originY: event.movementY
    })
  })
})
</script>

<style scoped>
#container {
  height: 100%;
  width: 100%;
  position: absolute;
}

.area {
  border: 1px dashed black;
  height: 80%;
  width: 80%;
  position: absolute;
}

.circle {
  height: 200px;
  width: 200px;
  background-color: navajowhite;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}

.rectangle {
  background-color: navajowhite;
  height: 150px;
  width: 250px;
  position: relative;
}

.text-area {
  float: right;
  position: relative;
}
</style>
