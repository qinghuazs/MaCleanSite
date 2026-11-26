import { useEffect, useRef, type RefObject } from 'react'
import { createNebulaRenderer } from './renderer'

export function NebulaCanvas({ imageRef }: { imageRef: RefObject<HTMLImageElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const image = imageRef.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let renderer: ReturnType<typeof createNebulaRenderer> = null
    let attempted = false
    let inView = !('IntersectionObserver' in window)
    let frame = 0
    let previous: number | undefined
    let elapsed = 0

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      const pixelWidth = Math.max(1, Math.round(width * ratio))
      const pixelHeight = Math.max(1, Math.round(height * ratio))
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight
    }

    const draw = (now: number) => {
      if (previous === undefined || now - previous >= 32) {
        if (previous !== undefined) elapsed += now - previous
        previous = now
        renderer?.draw(elapsed * 0.0007 % 18)
        canvas.style.visibility = 'visible'
      }
      frame = window.requestAnimationFrame(draw)
    }

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      previous = undefined
    }

    const sync = () => {
      if (reduced.matches || document.hidden || !inView) {
        stop()
        image.style.animationPlayState = 'paused'
        if (reduced.matches) canvas.style.visibility = 'hidden'
        return
      }
      if (!attempted && image.complete && image.naturalWidth > 0) {
        attempted = true
        resize()
        renderer = createNebulaRenderer(canvas, image)
      }
      image.style.animationPlayState = renderer ? 'paused' : 'running'
      if (renderer && !frame) frame = window.requestAnimationFrame(draw)
    }

    const loseContext = (event: Event) => {
      event.preventDefault()
      stop()
      renderer = null
      canvas.style.visibility = 'hidden'
      sync()
    }
    const restoreContext = () => {
      attempted = false
      sync()
    }

    const visibility = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    }) : null
    visibility?.observe(canvas)
    const sizing = 'ResizeObserver' in window ? new ResizeObserver(resize) : null
    sizing?.observe(canvas)
    if (!sizing) window.addEventListener('resize', resize)
    image.addEventListener('load', sync)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)
    canvas.addEventListener('webglcontextlost', loseContext)
    canvas.addEventListener('webglcontextrestored', restoreContext)
    sync()

    return () => {
      stop()
      renderer?.dispose()
      visibility?.disconnect()
      sizing?.disconnect()
      window.removeEventListener('resize', resize)
      image.removeEventListener('load', sync)
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
      canvas.removeEventListener('webglcontextlost', loseContext)
      canvas.removeEventListener('webglcontextrestored', restoreContext)
    }
  }, [imageRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="invisible absolute inset-0 size-full" />
}
