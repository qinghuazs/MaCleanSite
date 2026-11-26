import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, Lock, SquareMinus, Trash2 } from 'lucide-react'
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
  // 宽屏上首屏和系统数据两页之间「滚一下换一页」，带 data-page 的区块就是一页
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

/** 功能卡片：左边标题、右边说明，下面是演示 */
function FeatureCard({ id, title, desc, mobileDesc, extra, children }: { id: string; title: L; desc?: L; mobileDesc?: L; extra?: ReactNode; children: ReactNode }) {
  const { t } = useLang()
  // 不传 desc 的那一块没有标题栏，也没有外面这层卡片（边框、底色、内边距），演示窗口直接放在页面上、和上面的文字左右对齐；
  // 标题留给读屏软件
  if (!desc) {
    return (
      <section id={id} aria-label={t(title)}>
        {children}
      </section>
    )
  }
  return (
    <section id={id} className="rounded-[24px] border border-line bg-surface px-[13px] py-[13px] desk:px-[30px] desk:py-[30px] xl:px-[71px]">
      <div className="px-0.5 pt-0.5 desk:grid desk:grid-cols-[auto_minmax(0,655px)] desk:items-start desk:justify-between desk:gap-10 desk:px-0 desk:pt-0">
        <h3 className="font-sans text-[19px] leading-7 font-medium desk:pt-0.5 desk:text-[30px] desk:leading-[45px] desk:font-bold desk:whitespace-nowrap">{t(title)}</h3>
        <div className="mt-1.5 desk:mt-0">
          <p className={`text-[13px] leading-[22px] text-muted desk:text-[16px] desk:leading-[27px] ${mobileDesc ? 'hidden desk:block' : ''}`}>{t(desc)}</p>
          {mobileDesc && <p className="text-[13px] leading-[22px] text-muted desk:hidden">{t(mobileDesc)}</p>}
          {extra}
        </div>
      </div>
      <div className="mt-[15px] desk:mt-[22px]">{children}</div>
    </section>
  )
}

function Features() {
  const { t } = useLang()
  return (
    <section id="features" className="wrap pb-14 desk:pb-[86px]">
      {/* 第二页：标题 + 介绍 + 系统数据窗口，宽屏上正好一屏（窗口的高度由 SystemDataDemo 里的 useFitScreen 算）。
          宽屏上和首屏之间是翻页，不需要分隔线 */}
      <div data-page>
        <div className="border-t border-line pt-[23px] desk:border-t-0 desk:pt-6">
          <h2 className="text-[32px] leading-[41px] desk:text-[44px] desk:leading-[57px]">{t({ zh: '系统数据：一图观全貌，方寸见分明', en: 'System Data: one map, every detail' })}</h2>
          {/* 系统数据的介绍（用户写的，2026-11-26）：两句各占一行，先说容量条，再说地图。
              手机上的演示是简化过的（没有容量条），暂时还用原来那段手机版说明，等最后统一改手机端时再定 */}
          <p className="mt-2 hidden text-[17px] leading-[28px] text-muted desk:block">
            {t({
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
            })}
          </p>
          <p className="mt-2 text-[14px] leading-6 text-muted desk:hidden">
            {t({
              zh: '点一块颜色，看看哪几个目录占得最多。地图按容量分区，点「查看扫描结果」可以接着看哪些文件适合清理。',
              en: 'Tap a block to see which folders take the most. The map is sized by capacity. Tap View Scan Results to see which files are worth cleaning.',
            })}
          </p>
        </div>

        <div className="mt-[22px] desk:mt-6">
          <FeatureCard id="system-data" title={{ zh: '看清系统数据', en: 'See what’s in System Data' }}>
            <SystemDataDemo />
          </FeatureCard>
        </div>
      </div>

      <div className="mt-[18px] space-y-[18px] desk:mt-[22px] desk:space-y-[22px]">

        <FeatureCard
          id="scan"
          title={{ zh: '按应用查看扫描结果', en: 'Scan results, app by app' }}
          desc={{
            zh: '点开 Chrome，分别看「建议清理」「待确认」和「仅查看」。缓存清掉后可能重新下载，有些项目还要先退出应用。默认已选 0 项。',
            en: 'Open Chrome to see what’s Suggested, what needs review, and what’s View only. Caches may be downloaded again after cleaning, and some items need the app to quit first. Nothing is selected by default.',
          }}
        >
          <ScanDemo />
        </FeatureCard>

        <FeatureCard
          id="uninstall"
          title={{ zh: '卸载应用', en: 'Uninstall Apps' }}
          desc={{
            zh: '按名称找应用，或筛出 90 天未使用的软件。网格显示应用本体大小。点图标，再决定哪些关联文件一起移到废纸篓，也可以只卸载应用本体，把数据留下。',
            en: 'Find an app by name, or filter for apps unused for 90 days. The grid shows the size of the app itself. Click an icon, then decide which related files go to the Trash with it, or uninstall only the app and keep its data.',
          }}
        >
          <UninstallDemo />
        </FeatureCard>

        <FeatureCard
          id="mcp"
          title={{ zh: '让 AI 帮你读懂磁盘', en: 'Let AI read your disk' }}
          desc={{
            zh: '通过 MCP 把常用的 AI 助手接到 MaClean，让它读扫描结果、解释占用，再列一份清理方案。',
            en: 'Connect your AI assistant to MaClean over MCP. It can read the scan results, explain what’s using space, and draft a cleanup plan.',
          }}
          extra={
            <a href={l.section('pricing')} className="mt-1 inline-block py-[5px] text-[14px] font-bold text-accent hover:underline">
              {t({ zh: '只读模式免费，查看 Pro 激活方式', en: 'Read-only mode is free. See how to activate Pro' })}
              <ArrowRight aria-hidden="true" className="ml-1.5 inline size-4 -translate-y-px" />
            </a>
          }
        >
          <McpDemo />
        </FeatureCard>
      </div>

      <p className="mt-2.5 text-[11px] text-subtle">{t({ zh: '界面示意\u2002·\u2002使用演示数据', en: 'Interface preview\u2002·\u2002demo data' })}</p>
    </section>
  )
}

function Safety() {
  const { t } = useLang()
  const cards = [
    {
      icon: <SquareMinus aria-hidden="true" className="size-4" />,
      title: { zh: '从零项勾选开始', en: 'Nothing selected to start' },
      text: {
        zh: '扫描完成后由你勾选。「全选建议项」只选当前结果中可处理的建议项，待确认的文件要逐项选择。',
        en: 'You do the selecting once the scan is done. Select All Suggested only picks the suggested items in the current results. Items that need review are selected one at a time.',
      },
    },
    {
      icon: <Lock aria-hidden="true" className="size-4" />,
      title: { zh: '受保护的文件只能查看', en: 'Protected files are view only' },
      text: {
        zh: '「仅查看」的项目无法勾选。遇到需要先退出的应用，列表会标出名称。',
        en: 'View only items can’t be selected. When an app has to quit first, the list names it.',
      },
    },
    {
      icon: <Trash2 aria-hidden="true" className="size-4" />,
      title: { zh: '默认移到废纸篓', en: 'Moves to the Trash by default' },
      text: {
        zh: '默认清理方式会把文件移到废纸篓。清空废纸篓后，空间才真正腾出来。',
        en: 'By default, cleaning moves files to the Trash. The space is only freed once you empty the Trash.',
      },
    },
  ]
  return (
    <section id="safety" className="wrap pb-14 desk:pb-[90px]">
      <h2 className="text-[29px] leading-[37px] desk:text-[41px] desk:leading-[53px]">{t({ zh: '旧物去留，细思量', en: 'You decide what goes' })}</h2>
      <ul className="mt-5 grid gap-2.5 desk:mt-[25px] desk:grid-cols-3 desk:gap-5">
        {cards.map((card) => (
          <li key={card.title.en} className="flex items-center gap-3.5 rounded-2xl border border-line bg-raised p-3.5 desk:block desk:p-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-wash text-accent">{card.icon}</span>
            <div>
              <h3 className="font-sans text-[16px] leading-[26px] font-medium desk:mt-3 desk:text-[18px]">{t(card.title)}</h3>
              <p className="mt-1 text-[13px] leading-[22px] text-muted">{t(card.text)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

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
    <div className="border-t border-line pt-3">
      <h3 className="font-sans text-[17px] leading-[27px] font-bold desk:text-[20px] desk:leading-[31px]">{t({ zh: '怎样激活许可证？', en: 'How do I activate a license?' })}</h3>
      <div role="group" className="mt-2.5 flex flex-wrap gap-1.5">
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`h-10 rounded-lg px-4 text-[13px] transition-colors desk:text-[14px] ${tab === x.id ? 'bg-accent font-bold text-on-accent' : 'bg-raised text-muted hover:text-ink'}`}
          >
            {t(x.label)}
          </button>
        ))}
      </div>
      <dl className="mt-3 space-y-2.5 text-[13px] leading-[21px] desk:text-[14px] desk:leading-[22px]">
        {steps[tab].map((step) => (
          <div key={step.label.en} className="grid grid-cols-[60px_minmax(0,1fr)] gap-2.5">
            <dt className="font-bold text-accent">{t(step.label)}</dt>
            <dd>{t(step.text)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Pricing() {
  const { t } = useLang()
  const buy = purchaseUrl()
  return (
    <section id="pricing" className="wrap pb-14 desk:pb-[83px]">
      <div className="grid gap-6 rounded-[24px] border border-line bg-surface p-[18px] desk:grid-cols-[minmax(0,475px)_minmax(0,440px)] desk:items-center desk:justify-between desk:gap-10 desk:px-[38px] desk:py-[33px]">
        <div>
          <h2 className="text-[30px] leading-[39px] desk:text-[42px] desk:leading-[54px]">{t({ zh: '先免费扫描', en: 'Scan for free first' })}</h2>
          <p className="mt-3 text-[14px] leading-6 text-muted desk:text-[17px] desk:leading-[27px]">
            {t({
              zh: '扫描、查看系统数据和扫描结果都免费。也可以通过 MCP 让 AI 助手分析占用，先列一份清理方案。',
              en: 'Scanning, System Data and Scan Results are all free. You can also have an AI assistant analyze your disk over MCP and draft a cleanup plan first.',
            })}
          </p>
          <div className="mt-3 hidden desk:block">
            <Activation />
          </div>
        </div>

        <div className="rounded-[20px] border border-accent/45 bg-raised p-3.5 desk:p-[25px]">
          <p className="text-[16px] font-semibold text-accent desk:text-[18px]">{site.productName}</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
            <span className="text-[38px] leading-[43px] font-bold tracking-[-0.03em] desk:text-[46px] desk:leading-[52px]">{t(site.price)}</span>
            <span className="text-[13px] whitespace-nowrap text-muted desk:text-[14px]">{t({ zh: '一次买断', en: 'one-time purchase' })}</span>
          </p>
          <p className="mt-3 text-[13px] leading-[22px] text-muted desk:text-[15px] desk:leading-6">
            {t({
              zh: `每份许可证可激活 ${macs.zh} Mac，解锁执行清理、生成终端脚本、卸载应用，以及 MCP 安全和完全模式。购买后 ${site.refundDays} 天内可申请全额退款。`,
              en: `Each license activates ${macs.en} and unlocks cleaning, Terminal scripts, uninstalling apps, and the Safe and Full MCP modes. Full refund available within ${site.refundDays} days of purchase.`,
            })}
          </p>
          <ButtonLink href={buy} external disabledLabel={t({ zh: '即将开放购买', en: 'Purchasing opens soon' })} className="mt-4">
            {t({ zh: `购买 ${site.productName}`, en: `Buy ${site.productName}` })}
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.2} />
          </ButtonLink>
        </div>

        <div className="desk:hidden">
          <Activation />
        </div>
      </div>
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
