import { useRef } from 'react'
import rosette from '../../assets/rosette.jpg'
import { NebulaCanvas } from './NebulaCanvas'

export function HeroNebula() {
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[600/378] w-full max-w-[600px]">
      {/* 应用概览页里星云背后那团很淡的蓝色光晕 */}
      <div className="absolute -inset-[30%] bg-[radial-gradient(closest-side,rgb(104_124_178/0.12),rgb(83_103_141/0.06)_49%,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(200_92_72/0.14),transparent_66%)]" />
      <div
        // 用滤色叠在星空上：图片里黑的地方透出后面的星点，星云四周不会留下一圈没有星星的暗块
        className="absolute top-1/2 left-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{ maskImage: 'radial-gradient(ellipse 50% 50% at center, #000 58%, transparent 100%)' }}
      >
        <img ref={imageRef} src={rosette} alt="" width={756} height={538} className="nebula-image block h-auto w-full" />
        <NebulaCanvas imageRef={imageRef} />
      </div>
    </div>
  )
}
