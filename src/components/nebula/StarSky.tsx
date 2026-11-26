import { useEffect, useRef } from 'react'

// 首屏整块的星空，照应用里的 StarfieldBackground 画（../MacleanAPP/Experiments/StarfieldBackground）：
// 星点的大小、亮度、冷暖色、闪烁和缓慢漂移用同一套算法，数量按面积算。
// 滚出视口、切到后台时停下；系统开了「减弱动态效果」时只画一帧静止的

/** 每平方像素几颗星：应用窗口约 1100×720，放 4999 颗 */
const density = 0.0062
const maxStars = 12_000
/** 整体亮度：应用里是 0.42，网页上星空铺得更大、离文字更远，稍微提亮一点 */
const opacity = 0.6
/** 画布最多这么多像素，再大的屏幕就降一点清晰度，不让每帧的开销跟着屏幕无限涨 */
const maxPixels = 6_000_000

type Star = { x: number; y: number; radius: number; brightness: number; tint: string; phase: number; frequency: number; drift: number }

/** 固定种子：每次打开、改变窗口大小，星点的位置都一样 */
function makeStars(count: number): Star[] {
  let state = 0x53544152
  const unit = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: count }, () => {
    const x = unit()
    const y = unit()
    const depth = unit()
    const warmth = unit()
    return {
      x,
      y,
      radius: 0.18 + 0.58 * depth ** 3,
      brightness: 0.17 + 0.56 * depth ** 2,
      tint: `rgb(${Math.round(255 * (0.82 + 0.18 * warmth))} ${Math.round(255 * (0.89 + 0.08 * warmth))} ${Math.round(255 * (1 - 0.12 * warmth))})`,
      phase: unit() * 2 * Math.PI,
      frequency: 0.35 + unit() * 0.7,
      // 近处的星点移动更快，远处的更慢
      drift: 1.8 + 6.2 * depth * depth,
    }
  })
}

export function StarSky({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')
    if (!context) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const all = makeStars(maxStars)
    let count = 0
    let width = 0
    let height = 0
    let ratio = 1
    let inView = !('IntersectionObserver' in window)
    let frame = 0
    let previous: number | undefined
    let elapsed = 0

    const paint = () => {
      const time = elapsed / 1000
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      for (let i = 0; i < count; i++) {
        const star = all[i]
        const x = (star.x * width + time * star.drift) % width
        const y = (star.y * height + time * star.drift * 0.16) % height
        const twinkle = 0.8 + 0.2 * Math.sin(time * star.frequency + star.phase)
        // 漂到边上时淡出，绕回另一边时淡入
        const edge = Math.min(1, Math.min(x, y, width - x, height - y) / 6)
        const alpha = star.brightness * twinkle * edge * opacity
        context.fillStyle = star.tint
        if (star.brightness > 0.69) {
          context.globalAlpha = alpha * 0.065
          context.beginPath()
          context.arc(x, y, star.radius * 3, 0, 2 * Math.PI)
          context.fill()
        }
        context.globalAlpha = alpha
        if (star.radius < 0.4) {
          // 不到一个像素的星点画成小方块，和圆看不出差别，画起来快得多
          context.fillRect(x - star.radius, y - star.radius, star.radius * 2, star.radius * 2)
        } else {
          context.beginPath()
          context.arc(x, y, star.radius, 0, 2 * Math.PI)
          context.fill()
        }
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width < 1 || height < 1) return
      ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(maxPixels / (width * height)))
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      count = Math.min(maxStars, Math.round(width * height * density))
      paint()
    }

    const tick = (now: number) => {
      // 和应用一样每秒 30 帧
      if (previous === undefined || now - previous >= 32) {
        if (previous !== undefined) elapsed += now - previous
        previous = now
        paint()
      }
      frame = window.requestAnimationFrame(tick)
    }
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      previous = undefined
    }
    const sync = () => {
      if (reduced.matches || document.hidden || !inView) stop()
      else if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const visibility =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            sync()
          })
        : null
    visibility?.observe(canvas)
    const sizing = 'ResizeObserver' in window ? new ResizeObserver(resize) : null
    sizing?.observe(canvas)
    if (!sizing) window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)
    resize()
    sync()

    return () => {
      stop()
      visibility?.disconnect()
      sizing?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />
}
