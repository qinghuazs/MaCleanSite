import { useEffect } from 'react'

// 首页宽屏上「滚一下换一页」（用户 2026-11-26 要求，像苹果官网那样）。
//
// 带 data-page 的区块各是一页，从页面最上面连着排（目前是首屏和系统数据两页，其余区块以后再改）。
// 在这几页的范围里，滚轮或触控板往下滑一次就翻到下一页，往上滑一次翻回上一页；
// 翻过最后一页以后是普通的滚动。从下面往回滚时先停在最后一页，再滑一次才继续往上翻。
//
// 没有用 CSS 的 scroll-snap：它在鼠标滚轮上是「停下后吸到最近的一页」，滚一格不到半屏就又弹回原处，
// 做不到滚一下就换页。
//
// 只管滚轮和触控板；拖滚动条、按键盘、触屏还是普通滚动。窗口不到 700 高、手机版式、
// 系统开了「减弱动态效果」时都不启用。

const duration = 650
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export function usePagedScroll() {
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 67.5rem) and (min-height: 700px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    // 翻页以后锁住，直到动画放完、这一下滑动（包括触控板的惯性）也停了，才接受下一次
    let locked = false
    let lockedAt = 0
    let lastWheel = 0
    let unlockTimer = 0

    /** 每一页对齐时的滚动位置：页的顶边紧贴页头下面 */
    const stops = () => {
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      return [...document.querySelectorAll<HTMLElement>('[data-page]')].map((el) => Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - header)))
    }

    const tryUnlock = () => {
      const now = performance.now()
      // 动画放完，并且已经有一小会儿没有新的滚轮事件（惯性停了）；最长锁 1.6 秒
      if ((now - lockedAt > duration + 40 && now - lastWheel > 90) || now - lockedAt > 1600) locked = false
      else unlockTimer = window.setTimeout(tryUnlock, 40)
    }

    const go = (to: number) => {
      locked = true
      lockedAt = lastWheel = performance.now()
      window.clearTimeout(unlockTimer)
      unlockTimer = window.setTimeout(tryUnlock, duration)
      const from = window.scrollY
      const start = performance.now()
      window.cancelAnimationFrame(frame)
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        // 页面本身设了平滑滚动，这里每一帧都要直接跳到位
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' })
        if (t < 1) frame = window.requestAnimationFrame(step)
      }
      frame = window.requestAnimationFrame(step)
    }

    const onWheel = (event: WheelEvent) => {
      if (!wide.matches || reduced.matches) return
      // 捏合缩放、横向滚动、弹窗打开时不管
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return
      if (document.querySelector('dialog[open]')) return
      const pages = stops()
      if (pages.length < 2) return
      if (locked) {
        lastWheel = performance.now()
        event.preventDefault()
        return
      }
      const y = window.scrollY
      const last = pages[pages.length - 1]
      if (event.deltaY > 0) {
        // 往下：还没到最后一页就翻到下一页；到了最后一页以后照常滚
        if (y >= last - 1) return
        event.preventDefault()
        go(pages.find((p) => p > y + 1) ?? last)
      } else if (y <= last + 1) {
        // 往上：在翻页的范围里，翻回上一页（已经在最上面就不管）
        const previous = pages.filter((p) => p < y - 1).pop()
        if (previous === undefined) return
        event.preventDefault()
        go(previous)
      } else if (y + event.deltaY < last) {
        // 从下面往回滚、这一下会滚过最后一页的顶边：先停在最后一页
        event.preventDefault()
        go(last)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(unlockTimer)
    }
  }, [])
}
