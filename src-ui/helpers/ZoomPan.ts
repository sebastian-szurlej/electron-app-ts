// types & interfaces
interface ZoomPanProperties {
  minScale: number
  maxScale: number
  element: HTMLElement
  scaleSensitivity: number
  translateSensitivity: number
}

export interface ZoomPanModel extends ZoomPanProperties {
  transformation: {
    originX: number
    originY: number
    translateX: number
    translateY: number
    scale: number
  }
}

// class implementation
export class ZoomPan {
  element
  minScale
  maxScale
  scaleSensitivity
  translateSensitivity
  transformation = {
    originX: 0,
    originY: 0,
    translateX: 0,
    translateY: 0,
    scale: 1
  }

  constructor({
    element,
    minScale,
    maxScale,
    scaleSensitivity = 10,
    translateSensitivity = 10
  }: ZoomPanProperties) {
    this.element = element
    this.minScale = minScale
    this.maxScale = maxScale
    this.scaleSensitivity = scaleSensitivity
    this.translateSensitivity = translateSensitivity
  }
  zoomInOut({ x, y, deltaScale }: { x: number; y: number; deltaScale: number }) {
    const { left, top } = this.element.getBoundingClientRect()
    const newScale = this.getNewScale({
      deltaScale: deltaScale
    })
    const originX = x - left
    const originY = y - top
    const newOriginX = originX / this.transformation.scale
    const newOriginY = originY / this.transformation.scale
    const translateX = this.getTranslate({
      position: originX,
      previousPosition: this.transformation.originX,
      translate: this.transformation.translateX
    })
    const translateY = this.getTranslate({
      position: originY,
      previousPosition: this.transformation.originY,
      translate: this.transformation.translateY
    })
    this.element.style.transformOrigin = `${newOriginX}px ${newOriginY}px`
    this.element.style.transform = this.getMatrix({ scale: newScale, translateX, translateY })
    this.transformation = {
      originX: newOriginX,
      originY: newOriginY,
      translateX,
      translateY,
      scale: newScale
    }
  }

  panY({ originY }: { originY: number }) {
    this.pan({
      originX: 0,
      originY: originY / (this.translateSensitivity / this.transformation.scale)
    })
  }

  panBy({ originX, originY }: { originX: number; originY: number }) {
    this.pan({ originX, originY })
  }

  panTo({ scale, originX, originY }: { scale: number; originX: number; originY: number }) {
    this.transformation.scale = scale
    this.pan({
      originX: originX - this.transformation.translateX,
      originY: originY - this.transformation.translateY
    })
  }

  pan({ originX, originY }: { originX: number; originY: number }) {
    console.log(originY)
    this.transformation.translateX += originX
    this.transformation.translateY += originY
    this.element.style.transform = this.getMatrix({
      scale: this.transformation.scale,
      translateX: this.transformation.translateX,
      translateY: this.transformation.translateY
    })
  }

  getMatrix({
    scale,
    translateX,
    translateY
  }: {
    scale: number
    translateX: number
    translateY: number
  }) {
    const transformMatrix = new DOMMatrix()
    transformMatrix.translateSelf(translateX, translateY)
    transformMatrix.scaleSelf(scale)
    return `matrix(${transformMatrix.a}, ${transformMatrix.b}, ${transformMatrix.c}, ${transformMatrix.d}, ${transformMatrix.e}, ${transformMatrix.f})`
  }

  getNewScale({ deltaScale }: { deltaScale: number }) {
    let newScale =
      this.transformation.scale + deltaScale / (this.scaleSensitivity / this.transformation.scale)
    newScale = Math.max(this.minScale, Math.min(newScale, this.maxScale))
    return newScale
  }

  getTranslate({
    position,
    previousPosition,
    translate
  }: {
    position: number
    previousPosition: number
    translate: number
  }) {
    return this.checkScaleInRange({
      scale: this.transformation.scale,
      minScale: this.minScale,
      maxScale: this.maxScale
    }) && this.checkPosition({ position, previousPosition })
      ? translate +
          (position - previousPosition * this.transformation.scale) *
            (1 - 1 / this.transformation.scale)
      : translate
  }

  checkScaleInRange({
    scale,
    minScale,
    maxScale
  }: {
    scale: number
    minScale: number
    maxScale: number
  }) {
    return scale <= maxScale && scale >= minScale
  }

  checkPosition({ position, previousPosition }: { position: number; previousPosition: number }) {
    return position !== previousPosition
  }
}
