import { useRef } from 'react'
import rosette from '../../assets/rosette.jpg'
import { NebulaCanvas } from './NebulaCanvas'

/**
 * 会动的玫瑰星云。首屏用默认大小；页面最后的下载页也放了一个小一些的（传 className 改最大宽度）。
 * 星云用滤色叠在背景上，所以放它的那一块要自己带不透明的底色并单独成一层（isolate + bg-canvas）
 */
export function HeroNebula({ className = 'max-w-[600px]' }: { className?: string }) {
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <div aria-hidden="true" className={`relative mx-auto aspect-[600/378] w-full ${className}`}>
      {/* 应用概览页里星云背后那团很淡的蓝色光晕 */}
      <div className="absolute -inset-[42%] bg-[radial-gradient(closest-side,rgb(104_124_178/0.12),rgb(83_103_141/0.06)_49%,transparent)]" />
      <div className="absolute -inset-[14%] bg-[radial-gradient(ellipse_at_center,rgb(200_92_72/0.14),transparent_66%)]" />
      <div
        // 用滤色叠在星空上：图片里黑的地方透出后面的星点，星云四周不会留下一圈没有星星的暗块。
        // 星云比外面这个占位的框大（宽屏约 680 宽）：图片四周是渐隐的，伸出去的部分看不出边，
        // 这样放大星云不用挤占左边文字的位置。原图只有 756 宽，再放大会发虚
        className="absolute top-1/2 left-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2 mix-blend-screen desk:w-[113%]"
        style={{ maskImage: 'radial-gradient(ellipse 50% 50% at center, #000 58%, transparent 100%)' }}
      >
        <img ref={imageRef} src={rosette} alt="" width={756} height={538} className="nebula-image block h-auto w-full" />
        <NebulaCanvas imageRef={imageRef} />
      </div>
    </div>
  )
}
