import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BellRing, Check, ChevronDown, Lock, Scale, SquareTerminal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import appIcon from '../assets/app-icon.png'
import { McpDemo } from '../components/demos/McpDemo'
import { ScanDemo } from '../components/demos/ScanDemo'
import { SystemDataDemo } from '../components/demos/SystemDataDemo'
import { UninstallDemo } from '../components/demos/UninstallDemo'
import { HeroNebula } from '../components/nebula/HeroNebula'
import { StarSky } from '../components/nebula/StarSky'
import { ButtonLink } from '../components/ui'
import { usePagedScroll } from '../components/usePagedScroll'
import { useLang, type L } from '../i18n'
import { links } from '../paths'
import { macs, purchaseUrl, site } from '../site.config'

// 首页：首屏 → 功能（系统数据、扫描结果、卸载应用、MCP 四个演示）→ 由你决定 → 价格与激活 → 常见问题 → 下载

const l = links(0)
const comingSoon: L = { zh: '即将开放下载', en: 'Download coming soon' }

export function Home() {
  // 宽屏上前几页之间「滚一下换一页」（首屏、系统数据、扫描结果、卸载应用、MCP、四张卡片、价格），带 data-page 的区块就是一页
  usePagedScroll()
  return (
    <>
      <Hero />
      <Features />
      <Safety />
      <Pricing />
      <Faq />
      <Download />
    </>
  )
}

function DownloadButton({ className }: { className?: string }) {
  const { t } = useLang()
  return (
    <ButtonLink href={site.downloadUrl || null} download disabledLabel={t(comingSoon)} className={className}>
      {t({ zh: `下载 ${site.name}`, en: `Download ${site.name}` })}
      <ArrowDown aria-hidden="true" className="size-4" strokeWidth={2.2} />
    </ButtonLink>
  )
}

function Hero() {
  const { t, lang } = useLang()
  // 首屏占满一屏：高度是窗口高度减去页头（66 / 76 加 1px 底边），内容在里面上下居中。
  // 窗口矮、内容放不下时照内容的高度排；特别高的窗口（竖屏显示器）最多 1400，不让首屏空出一大片
  return (
    // 自己带底色、单独成一层：星云用滤色叠在星空上，要有不透明的底才叠得对
    <div data-page className="relative isolate overflow-hidden bg-canvas">
      {/* 整块星空铺满首屏（左右到窗口边），到底边渐渐淡出，和下面的页面底色接上 */}
      <StarSky className="absolute inset-0 -z-10 size-full [mask-image:linear-gradient(to_bottom,#000_76%,transparent)]" />
      <section className="wrap grid min-h-[min(calc(100svh-67px),1400px)] content-center items-center gap-10 pt-11 pb-12 desk:min-h-[min(calc(100svh-77px),1400px)] desk:grid-cols-[minmax(0,540px)_minmax(0,1fr)] desk:gap-[52px] desk:pt-12 desk:pb-[84px]">
        <div>
          <p className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.06em] text-accent">
            <span aria-hidden="true" className="size-[5px] rounded-full bg-accent" />
            {t({ zh: 'Mac 磁盘清理工具', en: 'Disk cleaner for Mac' })}
          </p>
          {/* 中文标题是用户写的两句题词「星风一拂浮尘散，玫瑰深处见清辉」（2026-11-26 定；之前试过「虚室生白」
              「磁盘空间都去哪了？」）：上下两行，手机上字号跟着屏幕宽度缩，保证每句不折行。
              英文不逐字译，取两句的意思各一行 */}
          <h1
            className={`mt-5 whitespace-nowrap desk:mt-[26px] ${
              lang === 'en'
                ? 'text-[40px] leading-[54px] desk:text-[60px] desk:leading-[76px]'
                : 'text-[length:min(44px,10.4vw)] leading-[1.3] desk:text-[60px] desk:leading-[82px]'
            }`}
          >
            {t({ zh: '星风一拂浮尘散，', en: 'The dust clears.' })}
            <br />
            {/* 第二句用星云里的暖色做渐变，和右边的星云呼应；整页其余的强调色都是冷色。
                渐变是「只在字的形状里显示的背景」，背景只铺到这个 span 的盒子为止；行内 span 的盒子高度按第一种字体
                （Newsreader）算，思源宋体的汉字比它高出约 0.12em，顶上那一截就没有颜色，看着像被削掉。
                所以改成 inline-block 并上下各加一点内边距把盒子撑高，再用负外边距抵掉，不影响排版 */}
            <span className="-my-[0.2em] inline-block bg-linear-to-r from-[#ffe9c4] via-[#ffc48d] to-[#ff9d80] bg-clip-text py-[0.2em] text-transparent">{t({ zh: '玫瑰深处见清辉', en: 'The rose glows.' })}</span>
          </h1>
          {/* 导语是用户自己写的（2026-11-26）：一句话把产品讲全，最后一句单独一行。
              第一句很长，用 text-balance 让各行差不多宽，免得最后一行只剩两三个字 */}
          <p className="mt-5 text-[14px] leading-[26px] text-muted desk:mt-6 desk:text-[16px] desk:leading-[28px]">
            <span className="block text-balance">
              {t({
                zh: 'MaClean 是一款把去留决定权交给你的 Mac 清理工具：用空间地图看清「系统数据」，按应用逐项核对扫描结果，卸载时让应用本体和留下的数据分开处理，还可以通过 MCP 让 AI 助手帮你解读占用、拟一份清理方案。',
                en: 'MaClean is a Mac cleaner that leaves the decisions to you: map what’s in System Data, review scan results app by app, uninstall an app separately from the data it leaves behind, and let an AI assistant explain your usage and draft a cleanup plan over MCP.',
              })}
            </span>
            <span className="block">
              {t({ zh: '默认一项不选，清理时默认移到废纸篓。', en: 'By default nothing is selected, and cleaning moves files to the Trash.' })}
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3 desk:mt-7">
            <DownloadButton />
            <ButtonLink href={l.section('features')} variant="secondary">
              {t({ zh: '了解功能', en: 'See features' })}
              <ArrowDownRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
            </ButtonLink>
          </div>
          <p className="mt-4 text-[12px] text-subtle">
            {t({ zh: `免费扫描\u2002·\u2002macOS ${site.minMacOS}+\u2002·\u2002已通过 Apple 公证`, en: `Free to scan\u2002·\u2002macOS ${site.minMacOS}+\u2002·\u2002Notarized by Apple` })}
          </p>
        </div>

        <HeroNebula />
      </section>
    </div>
  )
}

/**
 * 一页：大标题 + 介绍 + 内容，内容直接放在页面上（没有外层卡片）。
 * 宽屏上每一页正好一屏，并且参与「滚一下换一页」（data-page）。内容是演示窗口时，窗口的高度由演示自己的 useFitScreen 算；
 * 内容是别的（比如卡片）时传 fill，让内容撑满这一页剩下的高度。
 * 手机上的演示多半是简化过的，介绍可以另给一段
 */
function DemoPage({
  id,
  title,
  intro,
  mobileIntro,
  fill,
  children,
}: {
  id: string
  title: L
  intro?: { zh: ReactNode; en: ReactNode }
  mobileIntro?: L
  fill?: boolean
  children: ReactNode
}) {
  const { t } = useLang()
  return (
    // 宽屏上每一页至少一屏高（视口高度减 77px 的页头）：内容不满一屏的页（比如 MCP）下面留空，不让下一块露出来。
    // 点链接跳到这一页时和翻页停在同一个位置（顶边紧贴页头；全站的 scroll-padding-top 是 88px，这里抵掉 11px）
    <div
      id={id}
      data-page
      className={`mt-[18px] first:mt-0 desk:mt-0 desk:min-h-[calc(100svh-77px)] desk:-scroll-mt-[11px] ${fill ? 'desk:flex desk:flex-col desk:pb-3.5' : ''}`}
    >
      {/* 手机上页与页之间用一条线分开；宽屏上是翻页，不需要 */}
      <div className="border-t border-line pt-[23px] desk:border-t-0 desk:pt-6">
        <h2 className="text-[32px] leading-[41px] desk:text-[36px] desk:leading-[46px]">{t(title)}</h2>
        {/* 介绍折成两行时让两行差不多宽 */}
        {intro && (
          <p className={`mt-2 text-muted desk:text-balance ${mobileIntro ? 'hidden text-[17px] leading-[28px] desk:block' : 'text-[14px] leading-6 desk:text-[17px] desk:leading-[28px]'}`}>{t(intro)}</p>
        )}
        {mobileIntro && <p className="mt-2 text-[14px] leading-6 text-muted desk:hidden">{t(mobileIntro)}</p>}
      </div>
      <div className={`mt-[22px] desk:mt-6 ${fill ? 'desk:flex desk:flex-1 desk:flex-col' : ''}`}>{children}</div>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="wrap pb-14 desk:pb-[86px]">
      {/* 系统数据、扫描结果、卸载应用、MCP 各是一页（2026-11-26 按用户的意思改的）。每个演示自己标了「演示数据」 */}
      <DemoPage
        id="system-data"
        title={{ zh: '系统数据：一图观全貌，方寸见分明', en: 'System Data: one map, every detail' }}
        // 介绍是用户写的：两句各占一行，先说容量条，再说地图
        intro={{
          zh: (
            <>
              启动磁盘已用多少、还剩多少，应用支持、沙盒容器、缓存和开发工具各占几何，容量条上一目了然。
              <br />
              再顺着地图找到大目录，点选色块，看看空间花在了哪里，对应的目录和建议清理量随之变化。
            </>
          ),
          en: (
            <>
              The capacity bar shows at a glance how much of the startup disk is used and how much is left, and how much goes to application support, sandboxed containers, caches, and
              developer tools.
              <br />
              Then follow the map to the big folders: click a block to see where the space went, and the folders and the suggested amount update with it.
            </>
          ),
        }}
        // 手机上的演示没有容量条，暂时还用原来那段手机版说明，等最后统一改手机端时再定
        mobileIntro={{
          zh: '点一块颜色，看看哪几个目录占得最多。地图按容量分区，点「查看扫描结果」可以接着看哪些文件适合清理。',
          en: 'Tap a block to see which folders take the most. The map is sized by capacity. Tap View Scan Results to see which files are worth cleaning.',
        }}
      >
        <SystemDataDemo />
      </DemoPage>

      <DemoPage
        id="scan"
        title={{ zh: '扫描结果：一览繁芜，去留从容', en: 'Scan Results: all in view, yours to decide' }}
        // 介绍是用户写的（2026-11-26）
        intro={{
          zh: (
            <>
              扫描结果按应用归拢，点开才见每一项的底细：删了会自己回来的缓存，归「建议清理」；删了要付代价的——网站
              {/* 折行别落在「登录」两个字中间 */}
              <span className="whitespace-nowrap">重新登录</span>
              、聊天图片打不开——归「待确认」；不该动的数据库和正在使用的文件，只许「查看」。默认一项未选，去留由你逐项勾。
            </>
          ),
          en: 'Scan results are grouped by app, and opening one shows what each item really is. Caches that come back after you delete them are Suggested. Items that cost you something to delete, such as signing in to websites again or chat photos that no longer open, are To review. Databases that shouldn’t be touched and files in use are View only. Nothing is selected by default, and you decide item by item.',
        }}
      >
        <ScanDemo />
      </DemoPage>

      <DemoPage
        id="uninstall"
        title={{ zh: '卸载应用：挥别旧时客，留白待新程', en: 'Uninstall Apps: part with the old, make room for the new' }}
        // 介绍先沿用原来卡片上的说明，等用户给新的
        intro={{
          zh: '按名称找应用，或筛出 90 天未使用的软件。网格显示应用本体大小。点图标，再决定哪些关联文件一起移到废纸篓，也可以只卸载应用本体，把数据留下。',
          en: 'Find an app by name, or filter for apps unused for 90 days. The grid shows the size of the app itself. Click an icon, then decide which related files go to the Trash with it, or uninstall only the app and keep its data.',
        }}
      >
        <UninstallDemo />
      </DemoPage>

      <DemoPage
        id="mcp"
        title={{ zh: 'MCP 支持：试问方寸事，智能解纷繁', en: 'MCP Support: ask about your disk, let AI untangle it' }}
        // 介绍先沿用原来卡片上的说明和那条链接，等用户给新的
        intro={{
          zh: (
            <>
              通过 MCP 把常用的 AI 助手接到 MaClean，让它读扫描结果、解释占用，再列一份清理方案。
              <a href={l.section('pricing')} className="ml-2 font-bold whitespace-nowrap text-accent hover:underline">
                只读模式免费，查看 Pro 激活方式
                <ArrowRight aria-hidden="true" className="ml-1.5 inline size-4 -translate-y-px" />
              </a>
            </>
          ),
          en: (
            <>
              Connect your AI assistant to MaClean over MCP. It can read the scan results, explain what’s using space, and draft a cleanup plan.
              <a href={l.section('pricing')} className="ml-2 font-bold whitespace-nowrap text-accent hover:underline">
                Read-only mode is free. See how to activate Pro
                <ArrowRight aria-hidden="true" className="ml-1.5 inline size-4 -translate-y-px" />
              </a>
            </>
          ),
        }}
      >
        <McpDemo />
      </DemoPage>
    </section>
  )
}

/**
 * 上面几页没讲到的四件事（2026-11-26 和用户商量后换的内容；原来的三张卡片讲的是默认不勾选、仅查看、移到废纸篓，
 * 这些已经写进首屏和扫描结果的介绍里了）。宽屏一行两张。每一条都要和应用、用户手册对得上
 */
function Safety() {
  const { t } = useLang()
  const cards = [
    {
      icon: <SquareTerminal aria-hidden="true" className="size-[18px] desk:size-6" />,
      title: { zh: '终端待办', en: 'Terminal Tasks' },
      text: {
        zh: 'pnpm、Docker、Xcode 模拟器这类东西，要用它们自己的命令清。MaClean 把命令写成脚本，列出会删哪些，由你在终端里按回车执行。这类删除不经过废纸篓。',
        en: 'Things like pnpm, Docker, and Xcode simulators have to be cleaned with their own commands. MaClean writes the commands into a script and lists what will be deleted, and you run it in Terminal and press Return to confirm. These deletions skip the Trash.',
      },
    },
    {
      icon: <BellRing aria-hidden="true" className="size-[18px] desk:size-6" />,
      title: { zh: '增长监控', en: 'Growth monitoring' },
      text: {
        zh: '每天记录一次磁盘占用。哪个目录突然变大、可用空间低于你设的值时，发通知提醒你；菜单栏还能显示剩余空间。这些都免费。',
        en: 'MaClean records disk usage once a day and notifies you when a folder grows or free space drops below the threshold you set. It can also show free space in the menu bar. All of this is free.',
      },
    },
    {
      icon: <Lock aria-hidden="true" className="size-[18px] desk:size-6" />,
      title: { zh: '文件不出本机', en: 'Nothing leaves your Mac' },
      text: {
        zh: '扫描和统计都在这台 Mac 上完成，结果不上传。申请「完全磁盘访问」，是为了扫到微信、文稿这些受保护的目录。只在激活、校验许可证和检查更新时联网。',
        en: 'Scanning and analysis happen on this Mac, and the results are never uploaded. Full Disk Access is needed to reach protected folders such as WeChat and Documents. The app only goes online to activate and verify your license and to check for updates.',
      },
    },
    {
      icon: <Scale aria-hidden="true" className="size-[18px] desk:size-6" />,
      title: { zh: '实际能腾出多少', en: 'What you actually get back' },
      text: {
        zh: '移到废纸篓只是挪了地方，清空之后空间才腾出来。和别处共用数据的文件、有本地快照的时候，实际腾出的会比占用少，所以预计释放量是单独标出来的。',
        en: 'Moving files to the Trash only relocates them. The space is freed when you empty the Trash. When files share data with other files, or local snapshots exist, you get back less than they occupy, which is why the estimated space freed is shown separately.',
      },
    },
  ]
  return (
    <section className="wrap pb-14 desk:pb-[90px]">
      {/* 这一块也是一页（用户 2026-11-26 要求占一屏）：四张卡片两行两列，撑满标题下面剩下的高度 */}
      <DemoPage id="safety" fill title={{ zh: '清简留余地，细微见用心', en: 'Room to spare, care in the details' }}>
        <ul className="grid gap-2.5 desk:flex-1 desk:grid-cols-2 desk:grid-rows-2 desk:gap-5">
          {cards.map((card) => (
            <li key={card.title.en} className="flex items-start gap-3.5 rounded-2xl border border-line bg-raised p-3.5 desk:items-center desk:gap-5 desk:rounded-[20px] desk:px-7 desk:py-5 xl:gap-6 xl:px-9 xl:py-6">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-wash text-accent desk:size-12 desk:rounded-xl xl:size-[52px] xl:rounded-[14px]">{card.icon}</span>
              <div>
                <h3 className="font-sans text-[16px] leading-[26px] font-medium desk:text-[22px] desk:leading-[33px] desk:font-bold xl:text-[24px] xl:leading-[36px]">{t(card.title)}</h3>
                <p className="mt-1 text-[13px] leading-[22px] text-muted desk:mt-2 desk:text-[16px] desk:leading-[28px] xl:text-[17px] xl:leading-[30px]">{t(card.text)}</p>
              </div>
            </li>
          ))}
        </ul>
      </DemoPage>
    </section>
  )
}

/** 怎样激活许可证：手机上竖着排；宽屏上是一条横栏，第一行标题和切换，第二行几步并排、占满整行 */
function Activation() {
  const { t } = useLang()
  const [tab, setTab] = useState<'first' | 'move'>('first')
  const steps: Record<typeof tab, { label: L; text: L }[]> = {
    first: [
      { label: { zh: '购买', en: 'Buy' }, text: { zh: `在官网点「购买 ${site.productName}」，用常用邮箱完成付款。`, en: `Click Buy ${site.productName} on this site and pay with an email address you use.` } },
      { label: { zh: '收信', en: 'Email' }, text: { zh: '在下单邮箱找到许可证密钥，复制完整密钥。', en: 'Find the license key in that inbox and copy the whole key.' } },
      { label: { zh: '激活', en: 'Activate' }, text: { zh: '打开「设置 → 许可证」，点「粘贴」，再点「激活」。', en: 'Open Settings → License, click Paste, then Activate.' } },
    ],
    move: [
      {
        label: { zh: '旧 Mac', en: 'Old Mac' },
        text: { zh: '在「设置 → 许可证」点「在这台 Mac 上停用…」，确认停用以释放名额。', en: 'In Settings → License, click Deactivate on This Mac…, then confirm to free up the license.' },
      },
      { label: { zh: '新 Mac', en: 'New Mac' }, text: { zh: '打开同一设置页，粘贴原来的密钥并激活。', en: 'Open the same settings page, paste the same key and activate.' } },
    ],
  }
  const tabs: { id: typeof tab; label: L }[] = [
    { id: 'first', label: { zh: '首次激活', en: 'First activation' } },
    { id: 'move', label: { zh: '换一台 Mac', en: 'Moving to another Mac' } },
  ]
  return (
    <div className="rounded-2xl border border-line bg-surface p-3.5 desk:rounded-[20px] desk:px-7 desk:py-4">
      <div className="desk:flex desk:items-center desk:gap-5">
        <h3 className="font-sans text-[17px] leading-[27px] font-bold desk:text-[18px] desk:leading-[28px]">{t({ zh: '怎样激活许可证？', en: 'How do I activate a license?' })}</h3>
        <div role="group" className="mt-2.5 flex flex-wrap gap-1.5 desk:mt-0">
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={tab === x.id}
              onClick={() => setTab(x.id)}
              className={`h-10 rounded-lg px-4 text-[13px] transition-colors desk:h-8 desk:px-3.5 desk:text-[14px] ${tab === x.id ? 'bg-ink font-bold text-on-accent' : 'bg-raised text-muted hover:text-ink'}`}
            >
              {t(x.label)}
            </button>
          ))}
        </div>
      </div>
      {/* 宽屏上有几步就分几栏，每一步的说明尽量一行放下，不在右边空出一块 */}
      <ol
        className={`mt-3 space-y-2.5 text-[13px] leading-[21px] desk:mt-3 desk:grid desk:gap-6 desk:space-y-0 desk:text-[14px] desk:leading-[23px] ${
          steps[tab].length === 3 ? 'desk:grid-cols-3' : 'desk:grid-cols-2'
        }`}
      >
        {steps[tab].map((step, i) => (
          <li key={step.label.en} className="grid grid-cols-[60px_minmax(0,1fr)] gap-2.5 desk:block">
            <p className="font-bold text-accent">
              <span className="hidden desk:inline">{i + 1}.{'\u2002'}</span>
              {t(step.label)}
            </p>
            <p className="desk:mt-0.5 desk:text-muted">{t(step.text)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * 价格这一页（2026-11-26 用户让重新设计、占一屏）：左右两张卡片把「免费能做什么」「许可证解锁什么」摆在一起，
 * 下面一条横栏讲怎样激活。两张卡片撑满中间的高度。
 * 免费和收费的分界要和应用一致（见 CLAUDE.md「付费边界」）
 */
function Pricing() {
  const { t } = useLang()
  const buy = purchaseUrl()
  const free: L[] = [
    { zh: '扫描磁盘，按应用查看扫描结果', en: 'Scan your disk and review the results app by app' },
    { zh: '系统数据：容量条和占用空间地图', en: 'System Data: the capacity bar and the storage map' },
    { zh: '增长监控和低空间提醒', en: 'Growth monitoring and low-space alerts' },
    { zh: 'MCP 只读模式：让 AI 助手扫描、分析、拟清理方案', en: 'MCP read-only mode: an AI assistant can scan, analyze, and draft a cleanup plan' },
  ]
  const pro: L[] = [
    { zh: '执行清理', en: 'Cleaning' },
    { zh: '卸载应用', en: 'Uninstalling apps' },
    { zh: '生成终端脚本', en: 'Terminal scripts' },
    { zh: 'MCP 安全模式和完全模式', en: 'MCP Safe and Full modes' },
  ]
  const card = 'flex flex-col rounded-2xl border bg-raised p-3.5 desk:rounded-[20px] desk:px-8 desk:py-6'
  const list = (items: L[]) => (
    <ul className="mt-3 space-y-2 text-[13px] leading-[22px] desk:mt-4 desk:space-y-2 desk:text-[16px] desk:leading-[26px]">
      {items.map((item) => (
        <li key={item.en} className="flex gap-2.5">
          <Check aria-hidden="true" className="mt-[5px] size-3.5 shrink-0 text-good desk:mt-1.5 desk:size-4" strokeWidth={2.4} />
          <span>{t(item)}</span>
        </li>
      ))}
    </ul>
  )
  return (
    <section className="wrap pb-14 desk:pb-[83px]">
      <DemoPage
        id="pricing"
        fill
        title={{ zh: '先免费扫描', en: 'Scan for free first' }}
        intro={{
          zh: '扫描、查看系统数据和扫描结果都免费。也可以通过 MCP 让 AI 助手分析占用，先列一份清理方案。',
          en: 'Scanning, System Data and Scan Results are all free. You can also have an AI assistant analyze your disk over MCP and draft a cleanup plan first.',
        }}
      >
        <div className="grid gap-2.5 desk:flex-1 desk:grid-cols-2 desk:gap-5">
          <div className={`${card} border-line`}>
            <p className="text-[16px] font-semibold text-muted desk:text-[18px]">{t({ zh: '不需要许可证', en: 'No license needed' })}</p>
            <p className="mt-2 text-[38px] leading-[43px] font-bold tracking-[-0.01em] desk:text-[46px] desk:leading-[52px]">{t({ zh: '免费', en: 'Free' })}</p>
            {list(free)}
            <div className="mt-4 desk:mt-auto desk:pt-5">
              <ButtonLink href={site.downloadUrl || null} download disabledLabel={t(comingSoon)}>
                {t({ zh: `下载 ${site.name}`, en: `Download ${site.name}` })}
                <ArrowDown aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </ButtonLink>
            </div>
          </div>

          <div className={`${card} border-accent/45`}>
            <p className="text-[16px] font-semibold text-accent desk:text-[18px]">{site.productName}</p>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
              <span className="text-[38px] leading-[43px] font-bold tracking-[-0.03em] desk:text-[46px] desk:leading-[52px]">{t(site.price)}</span>
              <span className="text-[13px] whitespace-nowrap text-muted desk:text-[14px]">{t({ zh: '一次买断', en: 'one-time purchase' })}</span>
            </p>
            <p className="mt-3 text-[13px] text-muted desk:mt-4 desk:text-[15px]">{t({ zh: '激活许可证后解锁：', en: 'A license unlocks:' })}</p>
            <div className="-mt-1.5 desk:-mt-2">{list(pro)}</div>
            {/* 按钮和两句说明排在一行，放不下时说明折到下面 */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 desk:mt-auto desk:pt-5">
              <ButtonLink href={buy} external disabledLabel={t({ zh: '即将开放购买', en: 'Purchasing opens soon' })}>
                {t({ zh: `购买 ${site.productName}`, en: `Buy ${site.productName}` })}
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </ButtonLink>
              <p className="text-[12px] leading-5 text-subtle desk:text-[13px] desk:leading-[21px]">
                {t({ zh: `每份许可证可激活 ${macs.zh} Mac`, en: `Each license activates ${macs.en}` })}
                <br />
                {t({ zh: `购买后 ${site.refundDays} 天内可申请全额退款`, en: `Full refund within ${site.refundDays} days of purchase` })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2.5 desk:mt-5">
          <Activation />
        </div>
      </DemoPage>
    </section>
  )
}

function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<Set<number>>(new Set([0]))
  const more = (href: string, label: L) => (
    <a href={href} className="text-accent underline decoration-1 underline-offset-4">
      {t(label)}
    </a>
  )
  const items: { q: L; a: L<ReactNode> }[] = [
    {
      q: { zh: '「系统数据」里装了什么？', en: 'What’s inside System Data?' },
      a: {
        zh: '它是 macOS 对多种磁盘占用的统称。MaClean 把可识别的应用支持文件、沙盒容器、缓存和开发工具目录分开统计。点地图色块能看到具体目录。',
        en: 'It’s the name macOS gives to many kinds of disk usage. MaClean counts the parts it can identify separately: application support files, sandbox containers, caches and developer tool folders. Click a block on the map to see the actual folders.',
      },
    },
    {
      q: { zh: '会误删我想保留的文件吗？', en: 'Could it delete files I want to keep?' },
      a: {
        zh: '扫描只读，起初一项都没勾。建议项也由你选择，待确认的要逐项勾，「仅查看」的项目无法勾选。缓存可能重建，聊天媒体等个人内容要看清用途再选。',
        en: 'Scanning is read-only and nothing is selected to start. You choose even the suggested items, items to review are selected one at a time, and View only items can’t be selected. Caches can be rebuilt; for personal content such as chat media, check what it is before selecting it.',
      },
    },
    {
      q: { zh: '占用、预计释放和实际腾出的空间有何区别？', en: 'How do size, estimated freed and actual freed space differ?' },
      a: {
        zh: '占用是整组文件的大小，预计释放是当前选择中可处理的部分。默认移到废纸篓，清空后才会腾出空间。重新下载或生成的缓存还会再次占用磁盘。',
        en: 'Size is how big the whole group of files is; estimated freed is the part of your current selection that can be handled. By default files go to the Trash, and space is only freed once you empty it. Caches that are downloaded or rebuilt will take up space again.',
      },
    },
    {
      q: { zh: '扫描结果会上传吗？', en: 'Are scan results uploaded?' },
      a: {
        zh: <>扫描和统计在本机完成。激活、校验许可证和检查更新会联网。若主动接入第三方 AI 助手，它读到的路径与文件信息可能发送给对应服务。详见{more(l.privacy, { zh: '隐私政策', en: 'Privacy Policy' })}。</>,
        en: (
          <>
            Scanning and analysis happen on your Mac. Activating or verifying a license and checking for updates use the network. If you connect a third-party AI assistant, the paths and file
            information it reads may be sent to that service. See the {more(l.privacy, { zh: '隐私政策', en: 'Privacy Policy' })}.
          </>
        ),
      },
    },
    {
      q: { zh: '需要开启完全磁盘访问吗？', en: 'Do I need to turn on Full Disk Access?' },
      a: {
        zh: '扫描可从当前可访问的目录开始。部分受保护目录需要完全磁盘访问权限，缺少权限时，MaClean 会提示你到系统设置开启。',
        en: 'Scanning can start with the folders that are already accessible. Some protected folders need Full Disk Access; when it’s missing, MaClean points you to System Settings to turn it on.',
      },
    },
    {
      q: { zh: '终端待办怎么用？', en: 'How do Terminal Tasks work?' },
      a: {
        zh: '需要手动处理的项目可以生成终端脚本。先查看内容，自行执行，再回到「终端待办」复查。',
        en: 'Items you have to handle yourself can be written into a Terminal script. Review it, run it yourself, then come back to Terminal Tasks to verify.',
      },
    },
    {
      q: { zh: 'AI 助手怎么接入？', en: 'How do I connect an AI assistant?' },
      a: {
        zh: '在「设置 → AI 助手」选好客户端和权限，把配置复制到对应的客户端。只读模式免费，适合先让助手解释占用。',
        en: 'In Settings → AI Assistants, pick your client and permission, then copy the configuration into that client. Read-only mode is free and is a good way to have the assistant explain what’s using space first.',
      },
    },
    {
      q: { zh: '支持哪些 macOS 版本？', en: 'Which macOS versions are supported?' },
      a: {
        zh: `${site.name} ${site.version} 支持 macOS ${site.minMacOS} 及以上版本。`,
        en: `${site.name} ${site.version} supports macOS ${site.minMacOS} and later.`,
      },
    },
    {
      q: { zh: '怎么更新到新版本？', en: 'How do I update to a new version?' },
      a: {
        zh: 'MaClean 每天自动检查一次，有新版本会在应用里提示。也可以在菜单里点「检查更新…」，或从官网下载新版。',
        en: 'MaClean checks once a day and tells you in the app when a new version is available. You can also choose Check for Updates… from the menu, or download the new version from this site.',
      },
    },
    {
      q: { zh: '可以退款吗？', en: 'Can I get a refund?' },
      a: {
        zh: <>购买后 {site.refundDays} 天内可按{more(l.refund, { zh: '退款政策', en: 'Refund Policy' })}申请全额退款，申请时附上下单邮箱或订单号。</>,
        en: (
          <>
            Within {site.refundDays} days of purchase you can request a full refund under the {more(l.refund, { zh: '退款政策', en: 'Refund Policy' })}. Include the email you ordered
            with or the order number.
          </>
        ),
      },
    },
  ]
  const toggle = (i: number) => {
    const next = new Set(open)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setOpen(next)
  }

  return (
    <section id="faq" className="wrap grid gap-5 pb-14 desk:grid-cols-[minmax(0,450px)_minmax(0,1fr)] desk:gap-0 desk:pb-[86px]">
      <div>
        <h2 className="text-[30px] leading-[39px] desk:text-[41px] desk:leading-[53px]">{t({ zh: '常见问题', en: 'FAQ' })}</h2>
        <p className="mt-2 text-[13px] text-muted desk:text-[14px]">
          {t({ zh: '具体怎么操作，见', en: 'For step-by-step instructions, see the ' })}
          {more(l.guide, { zh: '用户手册', en: 'User Guide' })}
          {t({ zh: '。', en: '.' })}
        </p>
      </div>
      <ul>
        {items.map((item, i) => {
          const on = open.has(i)
          return (
            <li key={item.q.en} className="border-b border-line">
              <h3 className="font-sans">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-0.5 py-3.5 text-left text-[15px] leading-[23px] font-bold desk:text-[17px] desk:leading-[26px]"
                >
                  {t(item.q)}
                  <ChevronDown aria-hidden="true" className={`size-[18px] shrink-0 text-muted transition-transform ${on ? 'rotate-180' : ''}`} />
                </button>
              </h3>
              {on && <p className="pb-4 text-[14px] leading-[21px] text-muted desk:text-[15px] desk:leading-[23px]">{t(item.a)}</p>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Download() {
  const { t } = useLang()
  return (
    <section id="download" className="wrap pb-10 desk:pb-[51px]">
      <div className="flex flex-col items-center rounded-[24px] border border-line bg-[linear-gradient(100deg,var(--surface),#1a172b_55%,var(--surface))] px-3 py-7 text-center desk:py-[38px]">
        <img src={appIcon} alt="" width={42} height={42} className="size-[38px] desk:size-[42px]" />
        <h2 className="mt-5 text-[26px] leading-[34px] desk:mt-6 desk:text-[37px] desk:leading-[48px]">{t({ zh: '给 Mac 留一点余地', en: 'Give your Mac some room' })}</h2>
        <DownloadButton className="mt-4" />
        <p className="mt-4 text-[11px] text-subtle desk:text-[12px]">
          {t({ zh: `${site.name} ${site.version}\u2002·\u2002macOS ${site.minMacOS} 或更新版本`, en: `${site.name} ${site.version}\u2002·\u2002macOS ${site.minMacOS} or later` })}
        </p>
      </div>
    </section>
  )
}
