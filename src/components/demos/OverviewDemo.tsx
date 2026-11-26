import { ArrowDownRight, Play, Pause } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import rosette from '../../assets/rosette.jpg'
import { useLang } from '../../i18n'
import { site } from '../../site.config'
import { NebulaCanvas, scanDuration } from '../nebula/NebulaCanvas'
import { AppTabs, TrafficLights, WindowFrame } from './chrome'

const actionClass = 'inline-flex h-[30px] items-center gap-1.5 rounded-full border border-win-line bg-win-row px-3 text-[11px] font-medium whitespace-nowrap text-win-ink hover:bg-raised desk:h-[33px] desk:text-[12px]'

export function OverviewDemo() {
  const { t } = useLang()
  const [scan, setScan] = useState<'idle' | 'scanning' | 'complete'>('idle')
  const [paused, setPaused] = useState(false)
  const [motionAvailable, setMotionAvailable] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const scanStart = useRef<number | null>(null)
  const scanTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(scanTimer.current), [])

  const startScan = () => {
    if (scan === 'scanning') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || paused || !motionAvailable) {
      setScan('complete')
      return
    }
    scanStart.current = performance.now()
    setScan('scanning')
    scanTimer.current = window.setTimeout(() => {
      scanStart.current = null
      setScan('complete')
    }, scanDuration)
  }

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-[-8%] bg-[radial-gradient(ellipse_at_58%_52%,rgb(200_92_72/0.16),transparent_62%)] blur-2xl" />
      <WindowFrame className="mx-auto max-w-[600px] rounded-[18px]">
        <div className="relative" style={{ aspectRatio: '600 / 378' }}>
          <div
            className="absolute top-[9%] left-1/2 w-[68%] -translate-x-1/2"
            style={{ maskImage: 'radial-gradient(ellipse 50% 50% at center, #000 58%, transparent 100%)' }}
          >
            <img ref={imageRef} src={rosette} alt="" width={756} height={538} className="block h-auto w-full" />
            {!paused && <NebulaCanvas imageRef={imageRef} scanStart={scanStart} onAvailability={setMotionAvailable} />}
          </div>
          <TrafficLights className="absolute top-[4%] left-[2.5%] scale-75 desk:scale-100" />
          <div className="absolute top-[3.4%] right-[3%] left-[15%] flex justify-center desk:inset-x-[9%]">
            <AppTabs active="overview" size="xs" />
          </div>
          <div className="absolute inset-x-0 bottom-[5.5%] flex items-center justify-center gap-1.5">
            <button type="button" onClick={startScan} aria-disabled={scan === 'scanning'} className={actionClass}>
              {scan === 'scanning' && t({ zh: '正在演示扫描…', en: 'Running demo scan…' })}
              {scan === 'complete' && t({ zh: '重播', en: 'Replay' })}
              {scan === 'idle' && t({ zh: '演示扫描', en: 'Demo Scan' })}
            </button>
            {scan === 'complete' && (
              <a href="#system-data" className={actionClass}>
                {t({ zh: '查看演示结果', en: 'View Demo Results' })}
                <ArrowDownRight aria-hidden="true" className="size-3.5" />
              </a>
            )}
          </div>
          {(motionAvailable || paused) && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? t({ zh: '播放星云动效', en: 'Play nebula animation' }) : t({ zh: '暂停星云动效', en: 'Pause nebula animation' })}
              className="absolute right-[3%] bottom-[5.5%] grid size-[30px] place-items-center rounded-full text-win-muted hover:bg-win-row hover:text-win-ink desk:size-[33px]"
            >
              {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
            </button>
          )}
        </div>
      </WindowFrame>
      <p className="relative mt-3 text-center text-[11px] text-subtle">
        {site.name} {site.version}
        {'\u2002·\u2002'}
        {t({ zh: '概览', en: 'Overview' })}
      </p>
      <p role="status" className="sr-only">
        {scan === 'scanning' && t({ zh: '正在演示扫描', en: 'Running demo scan' })}
        {scan === 'complete' && t({ zh: '演示扫描完成', en: 'Demo scan complete' })}
      </p>
    </div>
  )
}
