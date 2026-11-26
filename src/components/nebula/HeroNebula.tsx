import { useRef } from 'react'
import rosette from '../../assets/rosette.jpg'
import { NebulaCanvas } from './NebulaCanvas'

export function HeroNebula() {
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <div aria-hidden="true" className="relative isolate mx-auto aspect-[600/378] w-full max-w-[600px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(200_92_72/0.14),transparent_66%)]" />
      <div className="stars absolute inset-0" />
      <div
        className="absolute top-1/2 left-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2"
        style={{ maskImage: 'radial-gradient(ellipse 50% 50% at center, #000 58%, transparent 100%)' }}
      >
        <img ref={imageRef} src={rosette} alt="" width={756} height={538} className="nebula-image block h-auto w-full" />
        <NebulaCanvas imageRef={imageRef} />
      </div>
    </div>
  )
}
