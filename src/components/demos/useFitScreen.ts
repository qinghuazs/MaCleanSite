import { useLayoutEffect, useRef, type RefObject } from 'react'

/**
 * 让「区块标题 + 介绍 + 演示窗口」在宽屏上正好占一屏（用户 2026-11-26 要求）。
 *
 * 窗口要放在带 data-page 的那一页里。窗口的高度取视口里剩下的高度，多出来的由窗口里能伸缩的那一块吃掉
 * （系统数据是地图，扫描结果是列表）；剩下的高度放不下内容时把窗口整体缩小一点（最小 0.8 倍，再小字就看不清了），
 * 还放不下就照内容的高度排、超出一屏。视口特别高时窗口也不无限拉长。
 * 「一屏」从这一页的顶边算起，顶边紧贴页头下面（翻页时就停在这个位置，见 usePagedScroll）。
 *
 * 窗口里的内容要能量出「最少要多高」：把窗口高度收到 0 时的滚动高度。所以窗口得是纵向的弹性布局，
 * 会滚动的那一块要自己写明最小高度。
 *
 * @param lang 语言。换语言后文字折行不同，最少高度要重新量
 * @param trigger 窗口里内容高度可能变化的原因（比如选中的分类）。同一种语言、同一个宽度下最少高度只增不减，
 *                点来点去时窗口不会忽大忽小
 */
export function useFitScreen(frame: RefObject<HTMLDivElement | null>, lang: string, trigger = '', { minZoom = 0.8, maxExtra = 240 } = {}) {
  const natural = useRef({ key: '', height: 0 })
  useLayoutEffect(() => {
    const el = frame.current
    const page = el?.closest<HTMLElement>('[data-page]')
    if (!el || !page) return
    const wide = window.matchMedia('(min-width: 67.5rem)')
    const bottomGap = 14 // 窗口底边离屏幕底边留一点空
    // measure：要不要重新量内容的最少高度。量的时候得把窗口临时收到 0 高，页面会跟着缩一下，
    // 所以只在挂载、换语言、窗口里的内容变了、宽度变了的时候量；上面的标题折行变化、窗口高度变化时只重算、不重量
    const fit = (measure: boolean) => {
      if (!wide.matches || el.offsetParent === null) {
        // 手机版式下不管，窗口照内容的高度排
        el.style.removeProperty('zoom')
        el.style.removeProperty('height')
        return
      }
      const cacheKey = `${lang}:${el.parentElement!.clientWidth}`
      if (natural.current.key !== cacheKey) natural.current = { key: cacheKey, height: 0 }
      const scrolled = window.scrollY
      const pageBefore = page.getBoundingClientRect()
      const measured = measure || natural.current.height === 0
      if (measured) {
        // 按 1 倍、高度收到 0 量出内容最少要多高（加上下两条边框）
        el.style.setProperty('zoom', '1')
        el.style.height = '0px'
        natural.current.height = Math.max(natural.current.height, el.scrollHeight + 2)
      }
      const need = natural.current.height
      const top = el.getBoundingClientRect().top - page.getBoundingClientRect().top
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 77
      const available = window.innerHeight - header - bottomGap - top
      const zoom = Math.min(1, Math.max(minZoom, available / need))
      el.style.setProperty('zoom', String(zoom))
      el.style.height = `${Math.min(Math.max(available / zoom, need), need + maxExtra)}px`
      if (measured) {
        // 量的那一下会把页面的滚动位置带跑，先放回去
        if (window.scrollY !== scrolled) window.scrollTo({ top: scrolled, behavior: 'instant' })
        // 这一页整个在视口上方时，它的底边挪了多少，下面的内容就挪了多少：页面跟着挪，正在看的内容不动。
        // （按这一页的底边算，不按窗口的高度算：页有最小高度，窗口变高不一定把下面顶下去）
        const shift = page.getBoundingClientRect().bottom - pageBefore.bottom
        if (pageBefore.bottom <= header && Math.abs(shift) > 0.5) window.scrollTo({ top: scrolled + shift, behavior: 'instant' })
      }
    }
    fit(true)
    const onResize = () => fit(false)
    window.addEventListener('resize', onResize)
    // 上面的标题、介绍折行变了（换语言、字体加载完），窗口能用的高度也跟着变
    const heading = page.firstElementChild
    const observer = 'ResizeObserver' in window && heading ? new ResizeObserver(onResize) : null
    if (observer && heading) observer.observe(heading)
    document.fonts?.ready.then(() => fit(true))
    return () => {
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
    }
  }, [frame, lang, trigger, minZoom, maxExtra])
}
