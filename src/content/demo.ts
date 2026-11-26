import chatgpt from '../assets/apps/chatgpt.png'
import capcut from '../assets/apps/capcut.png'
import chrome from '../assets/apps/chrome.png'
import datagrip from '../assets/apps/datagrip.png'
import doubao from '../assets/apps/doubao.png'
import douyin from '../assets/apps/douyin.png'
import firefox from '../assets/apps/firefox.png'
import idea from '../assets/apps/idea.png'
import lark from '../assets/apps/lark.png'
import playground from '../assets/apps/playground.png'
import qq from '../assets/apps/qq.png'
import qqmusic from '../assets/apps/qqmusic.png'
import trae from '../assets/apps/trae.png'
import wechat from '../assets/apps/wechat.png'
import workbuddy from '../assets/apps/workbuddy.png'
import wps from '../assets/apps/wps.png'
import xcode from '../assets/apps/xcode.png'
import yds from '../assets/apps/yds.png'
import type { L } from '../i18n'

// 首页几个演示窗口用的演示数据（不是任何人电脑上的真实结果）。
// 界面上的名字照应用写：中文照简体界面，英文照应用的翻译文件

const same = (s: string): L => ({ zh: s, en: s })

// ---------- 系统数据 ----------

export type CategoryId = 'support' | 'containers' | 'caches' | 'runtimes' | 'developer'

export type Category = {
  id: CategoryId
  name: L
  gb: number
  /** 容量条、图例、明细里的细条用的颜色 */
  color: string
  /** 地图色块的颜色 */
  tile: string
  desc: L
  path?: string
  /** 占用最大的目录：名字、大小（GB） */
  dirs: { name: L; gb: number }[]
  rest?: number
  /** 扫描结果里这一类的建议清理量；没有就不写 */
  suggested?: string
}

export const disk = { used: 320, total: 512, otherUsed: 229.5, free: 192, mapped: 90.5, mappedShare: 28 }

export const categories: Category[] = [
  {
    id: 'support',
    name: { zh: '应用支持数据', en: 'Application Support Data' },
    gb: 39.6,
    color: 'var(--cat-support)',
    tile: 'var(--tile-support)',
    desc: { zh: '应用保存的设置、数据库和本地内容', en: 'Settings, databases, and local content saved by apps' },
    path: '~/Library/Application Support',
    dirs: [
      { name: same('Final Cut Pro'), gb: 18.4 },
      { name: same('Lightroom'), gb: 6.7 },
      { name: same('Obsidian'), gb: 3.6 },
      { name: same('Figma'), gb: 2.5 },
      { name: same('VS Code'), gb: 1.9 },
      { name: same('Notion'), gb: 1.9 },
    ],
    rest: 4.6,
    suggested: '4.8 GB',
  },
  {
    id: 'containers',
    name: { zh: '沙盒应用容器', en: 'Sandboxed App Containers' },
    gb: 23.4,
    color: 'var(--cat-containers)',
    tile: 'var(--tile-containers)',
    desc: { zh: '各个应用在沙盒里的数据，可能含聊天记录等个人文件', en: 'Data each app keeps in its sandbox; may include personal files such as chat history' },
    path: '~/Library/Containers',
    dirs: [
      { name: { zh: '腾讯会议', en: 'Tencent Meeting' }, gb: 9.2 },
      { name: same('Spark'), gb: 4.2 },
      { name: { zh: 'QQ 音乐', en: 'QQ Music' }, gb: 3.8 },
      { name: same('Pixelmator Pro'), gb: 2.1 },
    ],
    rest: 4.1,
    suggested: '3.7 GB',
  },
  {
    id: 'caches',
    name: { zh: '用户缓存', en: 'User Cache' },
    gb: 12.8,
    color: 'var(--cat-caches)',
    tile: 'var(--tile-caches)',
    desc: { zh: '应用会按需重新生成的临时文件', en: 'Temporary files that apps regenerate as needed' },
    path: '~/Library/Caches',
    dirs: [
      { name: same('Final Cut Pro'), gb: 5.8 },
      { name: same('Chrome'), gb: 3.4 },
      { name: same('Pages'), gb: 2 },
    ],
    rest: 1.6,
    suggested: '3.4 GB',
  },
  {
    id: 'runtimes',
    name: { zh: 'iOS 模拟器运行时', en: 'iOS Simulator Runtimes' },
    gb: 9.6,
    color: 'var(--cat-runtimes)',
    tile: 'var(--tile-runtimes)',
    desc: { zh: 'Xcode 下载的模拟器系统版本', en: 'Simulator OS versions downloaded by Xcode' },
    dirs: [{ name: { zh: 'iOS 26 运行时', en: 'iOS 26 runtime' }, gb: 9.6 }],
  },
  {
    id: 'developer',
    name: { zh: 'Xcode 开发者目录', en: 'Xcode Developer Folder' },
    gb: 5.1,
    color: 'var(--cat-developer)',
    tile: 'var(--tile-developer)',
    desc: { zh: '编译缓存、模拟器设备与设备支持文件', en: 'Build caches, simulator devices, and device support files' },
    path: '~/Library/Developer',
    dirs: [
      { name: same('CoreSimulator'), gb: 3 },
      { name: same('Xcode'), gb: 2.1 },
    ],
    suggested: '2.8 GB',
  },
]

/** 桌面地图的色块：位置按 398 × 245 的画布写，画的时候换算成百分比 */
export const mapSize = { w: 398, h: 245 }
const other: L = { zh: '其余', en: 'Other' }
export const tiles: { cat: CategoryId; name: L; size?: string; x: number; y: number; w: number; h: number; dim?: boolean }[] = [
  { cat: 'support', name: same('Final Cut Pro'), size: '18.4 GB', x: 0, y: 0, w: 224, h: 77 },
  { cat: 'support', name: same('Lightroom'), size: '6.7 GB', x: 0, y: 79, w: 88, h: 48 },
  { cat: 'support', name: same('Obsidian'), size: '3.6 GB', x: 0, y: 130, w: 88, h: 36 },
  { cat: 'support', name: same('Figma'), size: '2.5 GB', x: 90, y: 79, w: 65, h: 35 },
  { cat: 'support', name: same('VS Code'), size: '1.9 GB', x: 158, y: 79, w: 65, h: 35 },
  { cat: 'support', name: same('Notion'), size: '1.9 GB', x: 90, y: 116, w: 61, h: 50 },
  { cat: 'support', name: other, x: 153, y: 116, w: 70, h: 50, dim: true },
  { cat: 'containers', name: { zh: '腾讯会议', en: 'Tencent Meeting' }, size: '9.2 GB', x: 230, y: 0, w: 168, h: 70 },
  { cat: 'containers', name: same('Spark'), size: '4.2 GB', x: 230, y: 72, w: 88, h: 53 },
  { cat: 'containers', name: { zh: 'QQ 音乐', en: 'QQ Music' }, size: '3.8 GB', x: 230, y: 128, w: 88, h: 38 },
  { cat: 'containers', name: same('Pixelmator Pro'), x: 320, y: 72, w: 78, h: 38 },
  { cat: 'containers', name: other, x: 320, y: 113, w: 78, h: 53, dim: true },
  { cat: 'caches', name: same('Final Cut Pro'), size: '5.8 GB', x: 0, y: 173, w: 89, h: 72 },
  { cat: 'caches', name: same('Chrome'), x: 91, y: 173, w: 92, h: 29 },
  { cat: 'caches', name: same('Pages'), x: 91, y: 204, w: 92, h: 20 },
  { cat: 'caches', name: other, x: 91, y: 227, w: 92, h: 18, dim: true },
  { cat: 'runtimes', name: same('iOS 26'), size: '9.6 GB', x: 190, y: 173, w: 135, h: 72 },
  { cat: 'developer', name: same('CoreSimulator'), x: 332, y: 173, w: 66, h: 41 },
  { cat: 'developer', name: same('Xcode'), x: 332, y: 216, w: 66, h: 29 },
]

/** 手机地图：每个分类一块，位置按 300 × 195 的画布写 */
export const mobileMapSize = { w: 300, h: 195 }
export const mobileTiles: Record<CategoryId, { x: number; y: number; w: number; h: number; big?: boolean }> = {
  support: { x: 0, y: 0, w: 166, h: 148, big: true },
  containers: { x: 169, y: 0, w: 131, h: 96, big: true },
  caches: { x: 169, y: 99, w: 131, h: 49 },
  runtimes: { x: 0, y: 151, w: 180, h: 44 },
  developer: { x: 183, y: 151, w: 117, h: 44 },
}

// ---------- 扫描结果 ----------

export type ScanItem = {
  name: L
  path: string
  /** 删了会怎样 */
  note: L
  gb: number
  kind: 'suggested' | 'review' | 'view'
}

export type ScanApp = { id: string; name: L; icon?: string; needsQuit?: boolean; items: ScanItem[] }

const s = (zh: string, en: string, noteZh: string, noteEn: string, gb: number, path: string, kind: ScanItem['kind'] = 'suggested'): ScanItem => ({
  name: { zh, en },
  note: { zh: noteZh, en: noteEn },
  gb,
  path,
  kind,
})

export const scanApps: ScanApp[] = [
  {
    id: 'chrome',
    name: same('Chrome'),
    icon: chrome,
    needsQuit: true,
    items: [
      s('网页资源缓存', 'Web resource cache', '下次打开网页时重新下载', 'Downloaded again the next time you open the pages', 3.6, '~/Library/Caches/Google/Chrome/Default/Cache'),
      s('浏览器运行缓存', 'Browser runtime cache', '浏览器用到时重新生成', 'Rebuilt when the browser needs it', 1.6, '~/Library/Caches/Google/Chrome/Default/Code Cache'),
      s('网站数据', 'Website data', '删除后部分网站要重新登录', 'Some sites will ask you to sign in again', 2, '~/Library/Application Support/Google/Chrome/Default/Local Storage', 'review'),
      s('扩展程序', 'Extensions', '扩展本体，不提供清理', 'The extensions themselves; not offered for cleaning', 0.2, '~/Library/Application Support/Google/Chrome/Default/Extensions', 'view'),
    ],
  },
  {
    id: 'qqmusic',
    name: { zh: 'QQ 音乐', en: 'QQ Music' },
    icon: qqmusic,
    items: [
      s('音乐缓存', 'Music cache', '再听这些歌时重新下载', 'Downloaded again when you play the songs', 3.1, '~/Library/Containers/com.tencent.QQMusicMac/Data/Library/Caches/Music'),
      s('封面缓存', 'Cover art cache', '封面图片，用到时重新下载', 'Cover images; downloaded again when needed', 0.6, '~/Library/Containers/com.tencent.QQMusicMac/Data/Library/Caches/Cover'),
    ],
  },
  {
    id: 'wechat',
    name: { zh: '微信', en: 'WeChat' },
    icon: wechat,
    needsQuit: true,
    items: [
      s('应用缓存', 'App cache', '用到时重新生成', 'Rebuilt when needed', 2.4, '~/Library/Containers/com.tencent.xinWeChat/Data/Library/Caches'),
      s('临时文件', 'Temporary files', '删除后不影响聊天记录', 'Deleting them doesn’t affect chat history', 1, '~/Library/Containers/com.tencent.xinWeChat/Data/tmp'),
      s('聊天媒体', 'Chat media', '删除后聊天里的图片视频打不开', 'Photos and videos in chats will no longer open', 6.9, '~/Library/Containers/com.tencent.xinWeChat/Data/Documents/Media', 'review'),
      s('本地数据库', 'Local database', '聊天记录本身，不提供清理', 'The chat history itself; not offered for cleaning', 0.5, '~/Library/Containers/com.tencent.xinWeChat/Data/Documents/DB', 'view'),
    ],
  },
  {
    id: 'xcode',
    name: same('Xcode'),
    icon: xcode,
    items: [
      s('编译缓存\u2002·\u2002DerivedData', 'Build cache\u2002·\u2002DerivedData', '下次编译时重新生成，首次变慢', 'Rebuilt on the next build; the first one is slower', 1.8, '~/Library/Developer/Xcode/DerivedData'),
      s('构建日志与索引', 'Build logs and index', '打开项目时重新建立索引', 'Re-indexed when you open the project', 1, '~/Library/Developer/Xcode/DerivedData/Index.noindex'),
      s('构建归档', 'Archives', '删除后旧版本无法再导出', 'Older builds can no longer be exported', 7.4, '~/Library/Developer/Xcode/Archives', 'review'),
      s('设备支持文件', 'Device support files', '正在用的系统版本，不提供清理', 'For the OS version in use; not offered for cleaning', 2.7, '~/Library/Developer/Xcode/iOS DeviceSupport', 'view'),
    ],
  },
  {
    id: 'npm',
    name: same('npm'),
    items: [
      s('下载缓存', 'Download cache', 'npm install 时重新下载', 'Downloaded again on npm install', 1.35, '~/.npm/_cacache/content-v2'),
      s('缓存索引', 'Cache index', '下次安装时重新生成', 'Rebuilt on the next install', 0.4, '~/.npm/_cacache/index-v5'),
    ],
  },
  {
    id: 'firefox',
    name: same('Firefox'),
    icon: firefox,
    items: [
      s('网页资源缓存', 'Web resource cache', '下次打开网页时重新下载', 'Downloaded again the next time you open the pages', 0.85, '~/Library/Caches/Firefox/Profiles/demo/cache2'),
      s('着色器缓存', 'Shader cache', '浏览器用到时重新生成', 'Rebuilt when the browser needs it', 0.25, '~/Library/Caches/Firefox/Profiles/demo/shader-cache'),
      s('离线网站数据', 'Offline website data', '删除后部分网站要重新登录', 'Some sites will ask you to sign in again', 0.3, '~/Library/Application Support/Firefox/Profiles/demo/storage', 'review'),
    ],
  },
]

/** 大小写法和应用一致：不到 1 GB 写 MB，去掉多余的零 */
export function formatSize(gb: number): string {
  if (gb < 1) return `${Math.round(gb * 1000)} MB`
  return `${Number(gb.toFixed(2))} GB`
}

// ---------- 卸载应用 ----------

export type UninstallApp = {
  id: string
  bundleId: string
  name: L
  icon: string
  path: string
  /** 应用本体大小（MB）；受保护的应用不写 */
  mb?: number
  /** 应用缓存（MB） */
  cacheMb?: number
  /** 90 天没用过 */
  unused?: boolean
}

const u = (id: string, zh: string, en: string, icon: string, file: string, bundleId: string, mb?: number, cacheMb?: number, unused?: boolean): UninstallApp => ({
  id,
  bundleId,
  name: { zh, en },
  icon,
  path: `/Applications/${file}.app`,
  mb,
  cacheMb,
  unused,
})

export const uninstallApps: UninstallApp[] = [
  u('idea', 'IntelliJ IDEA', 'IntelliJ IDEA', idea, 'IntelliJ IDEA', 'com.jetbrains.intellij', 3800, 180),
  u('xcode', 'Xcode', 'Xcode', xcode, 'Xcode', 'com.apple.dt.Xcode'),
  u('datagrip', 'DataGrip', 'DataGrip', datagrip, 'DataGrip', 'com.jetbrains.datagrip', 2400, 200),
  u('lark', '飞书', 'Lark', lark, 'Lark', 'com.bytedance.macos.feishu', 2200, 210),
  u('capcut', '剪映专业版', 'CapCut', capcut, 'VideoFusion-macOS', 'com.lemon.lvpro', 2050, 220, true),
  u('doubao', '豆包工作', 'Doubao', doubao, 'DoubaoWork', 'com.work.pc.doubao', 1850, 230),
  u('chrome', 'Google Chrome', 'Google Chrome', chrome, 'Google Chrome', 'com.google.Chrome', 1600, 240),
  u('yds', 'YDS Code', 'YDS Code', yds, 'YDS Code', 'com.yonyou.YDSCode', 1480, 250, true),
  u('chatgpt', 'ChatGPT', 'ChatGPT', chatgpt, 'ChatGPT', 'com.openai.chat', 1400, 260),
  u('wps', 'WPS Office', 'WPS Office', wps, 'wpsoffice', 'com.kingsoft.wpsoffice.mac', 1320, 270),
  u('trae', 'TRAE CN', 'TRAE CN', trae, 'Trae CN', 'cn.trae.app', 1250, 280, true),
  u('qq', 'QQ', 'QQ', qq, 'QQ', 'com.tencent.qq', 1180, 290),
  u('douyin', '抖音直播伴侣', 'Douyin Live', douyin, 'Douyin Webcast Mate', 'com.bytedance.webcastmate.mac', 1100, 300),
  u('workbuddy', 'WorkBuddy', 'WorkBuddy', workbuddy, 'WorkBuddy', 'com.tencent.workbuddy.mac', 980, 310, true),
  u('playground', 'Swift Playground', 'Swift Playground', playground, 'Swift Playground', 'com.apple.PlaygroundsMac', undefined, undefined, true),
  u('wechat', '微信', 'WeChat', wechat, 'WeChat', 'com.tencent.xinWeChat', 860, 330),
  u('qqmusic', 'QQ 音乐', 'QQ Music', qqmusic, 'QQMusic', 'com.tencent.QQMusicMac', 420, 340),
  u('firefox', 'Firefox', 'Firefox', firefox, 'Firefox', 'org.mozilla.firefox', 160, 480),
]

/** 卸载页的大小写法：应用本体保留两位小数（3.80 GB），合计去掉多余的零（2.6 GB） */
export function formatMb(mb: number, fixed = false): string {
  if (mb < 1000) return `${mb} MB`
  return fixed ? `${(mb / 1000).toFixed(2)} GB` : `${Number((mb / 1000).toFixed(2))} GB`
}
