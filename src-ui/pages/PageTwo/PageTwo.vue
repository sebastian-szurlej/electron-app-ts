<template>
  <div class="menu-position pa-2 d-flex">
    <v-btn density="compact" variant="text" icon="mdi-magnify-plus"></v-btn>
    <v-spacer></v-spacer>
    <v-btn density="compact" variant="text" icon="mdi-arrow-expand-all" @click="resetView"></v-btn>
  </div>
  <div id="canva-container" class="container height">
    <div id="canva" class="zoom-area">
      <v-img src="@/assets/test-2.jpeg"></v-img>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ZoomPan } from '@/helpers/ZoomPan'

let zoomPan: ZoomPan

onMounted(() => {
  const container = document.getElementById('canva-container')!
  zoomPan = new ZoomPan({
    minScale: 0.1,
    maxScale: 30,
    element: document.getElementById('canva')!,
    scaleSensitivity: 50,
    translateSensitivity: 10
  })
  container.addEventListener('wheel', (event) => {
    event.preventDefault()
    if (!event.ctrlKey) {
      zoomPan.panY({
        originY: event.deltaY
      })
    } else {
      zoomPan.zoomInOut({
        deltaScale: Math.sign(event.deltaY) > 0 ? 1 : -1,
        x: event.pageX,
        y: event.pageY
      })
    }
  })
  container.addEventListener('mousedown', (event) => {
    if (event.button !== 1) {
      return
    }
    event.preventDefault()
    container.addEventListener('mousemove', moveMouse)
  })
  container.addEventListener('mouseup', (event) => {
    if (event.button !== 1) {
      return
    }
    event.preventDefault()
    container.removeEventListener('mousemove', moveMouse)
  })
})

const resetView = () => {
  zoomPan.panTo({
    scale: 1,
    originX: 0,
    originY: 0
  })
}

const moveMouse = (event: MouseEvent) => {
  console.log(event.movementX)
  zoomPan.panBy({
    originX: event.movementX,
    originY: event.movementY
  })
}
</script>

<style scoped>
.container {
  background-color: #bdbdbd;
}

.menu-position {
  gap: 2px;
  position: absolute;
  right: 0;
  z-index: 1;
}

.zoom-area {
  image-rendering: pixelated;
  position: relative;
  height: 300px;
  width: 400px;
  left: 50px;
  top: 50px;
  background-color: #ffffff;
}
</style>
