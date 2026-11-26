# MaClean 官网

MaClean（macOS 磁盘清理应用）的产品官网：首页 + 用户手册 + 服务条款 / 隐私政策 / 退款政策，中英双语。
技术栈：Vite 8 + React 19 + TypeScript + Tailwind CSS v4，多页面静态站点，无后端。

## 命令

```bash
npm install
npm run dev       # 本地开发，http://localhost:5173
npm run build     # 类型检查 + 构建到 dist/
npm run preview   # 预览构建结果
```

## 上线前要改的

所有待定信息都在 `src/site.config.ts`：

| 字段 | 说明 |
| --- | --- |
| `contactEmail` | 客服与退款邮箱，留空时页面和政策里显示"联系邮箱待补充" |
| `productName` / `price` | 产品名与价格，和 Dodo 产品一致（目前 MaClean Pro，US$10.99 买断） |
| `devicesPerLicense` | 每个许可证可激活的 Mac 数，和 Dodo 许可证权益的激活上限一致（目前 1） |
| `refundDays` | 无理由退款天数（目前 3 天），同时出现在价格卡片、常见问题、服务条款和退款政策里 |
| `downloadUrl` | dmg 下载直链（GitHub Releases，发新版时连同 `version` 一起改）；留空时下载按钮显示"即将开放下载" |
| `dodoProductId` | Dodo 正式环境产品 ID（pdt_…），和应用里 `LicenseConfig.productIDs[.live]` 一致；留空时购买按钮显示"即将开放购买" |

## 结构

```
index.html, guide/, terms/, privacy/, refund/   各页面入口 HTML（多页面构建，路径干净）
src/site.config.ts      可配置项
src/i18n.tsx            中英切换（?lang= → 上次选择 → 浏览器语言）
src/styles.css          设计变量（只有深色一套）与 Tailwind 主题
src/components/         页头、页脚、按钮
src/components/demos/   首页的四个交互演示（系统数据、扫描结果、卸载应用、MCP）和共用的窗口外框
src/content/demo.ts     演示用的数据（分类、目录、应用、各项大小）
src/assets/apps/        演示里的应用图标（96px）
src/pages/Home.tsx      首页各区块
src/content/legal.ts    三份政策正文（中英）
src/pages/Legal.tsx     政策页模板
src/content/guide.ts    用户手册正文（中英）
src/pages/Guide.tsx     用户手册页模板（/guide/）
```

## 用户手册

`/guide/`，页头导航和页脚「产品」一栏有入口。正文在 `src/content/guide.ts`，照应用 1.1.1 写的（`guideVersion`）；应用改了界面文字或操作流程，这里要跟着改。

- 界面上的名字要和应用一致：中文照简体界面写，英文照应用翻译文件里的写法（`../MacleanAPP/MacleanAPP/Localizable.xcstrings`、`../maclean/Localization/Localizable.xcstrings`），不要自己另译
- 正文里能用的标记只有 `**加粗**`、`` `代码` ``、`[文字](目标)`，目标写 `#锚点`、`{download}`（首页下载区）或完整网址；表格固定两列
- 「清空前找回文件」一节没有实测过：MaClean 移进废纸篓的文件在访达里有没有「放回原处」还没确认

## 设计

设计稿：Figma「MaClean 官网 1.1.1 · 首页改版」https://www.figma.com/design/xw22wImHiidJRzVqvOw52V/ ，中文、英文各有 1440 和 390 两张画板。2026-11-25 按这份稿子重做了首页。

- **只做深色**（用户决定不做浅色），和应用的深色界面一致：底色 `#090B13`、文字和主按钮近白 `#F1F3FA`、强调色冰蓝 `#D4E3FF`（应用里「已勾选」的颜色）。Figma 稿里的强调色是淡紫 `#EBCBFF`，2026-11-26 用户觉得不好看，换成了应用自己的配色；整页只有星云和首屏标题第二行（取星云颜色的渐变）是暖色。变量都在 `src/styles.css`；手册页、政策页还在用旧名字（paper / ink-2 / clay …），那里留了一组别名指到新变量
- **字体**：标题用衬线（Newsreader + 思源宋体），正文用 Instrument Sans + 苹方。全部用 @fontsource 本地打包，不依赖 Google Fonts（国内访问不到）；思源宋体按 unicode-range 分片，只下载用到的字
- **宽度**：断点 `desk` = 1080px。1080 以上是桌面版式，内容最宽 1200；1080 以下用手机版式，内容列最宽 480 并居中。首页用 `.wrap`，手册页、政策页用 `.wrap-wide`（窄屏不限 480）
- **演示**：首页四个演示照应用界面做，可以点，数据在 `src/content/demo.ts`，全是演示数据。演示里的「清理」「卸载」不碰任何文件：「清理」弹出“这是演示”，卸载走到确认那一步为止。界面文字要和应用一致，英文照应用翻译文件里的写法，不要自己另译
- **MCP 一块的接入配置**和应用「设置 → AI 助手」生成的一样（写法照 `../maclean` 的 `MCPStdio.swift`，客户端和位置照应用的 `SettingsView.swift`），可以直接复制去用，所以应用改了这里要跟着改
- **页头的两个按钮**（2026-11-26 用户要求）：「下载」点了直接下载安装包（`downloadUrl`，没填时退回首页下载区），「购买」新窗口打开 Dodo 付款页（`purchaseUrl()`，没填产品 ID 时不显示）。1080 以下页头放不下「购买」，收在「菜单」最后一项
- **首屏占一屏**（2026-11-26 用户要求）：高度是窗口高度减去页头，文字和星云在里面上下居中；窗口矮到放不下时照内容的高度排，特别高的窗口最多 1400
- **系统数据也占一屏**（2026-11-26 用户要求，只在宽屏）：区块的标题、介绍加演示窗口合起来正好一屏。扫描结果那页同样处理。高度是 `src/components/demos/useFitScreen.ts` 算的：窗口取视口里剩下的高度，多出来的给窗口里能伸缩的那一块（系统数据是地图，扫描结果是应用列表，卸载应用是应用网格；列表和网格放不下时在窗口里面滚动）；放不下时整个窗口缩小，最小 0.8 倍，再矮就超出一屏；视口特别高时地图不无限拉长。改这个窗口里的内容后，要在 754、860、1000 几个高度下看一遍
- **滚一下换一页**（2026-11-26 用户要求，像苹果官网那样；只在宽屏）：带 `data-page` 的区块各是一页，目前是首屏、系统数据、扫描结果、卸载应用四页（后三页用 `Home.tsx` 里的 `DemoPage`：大标题 + 介绍 + 演示窗口，没有外层卡片），其余区块用户说以后再改，改好一个加一个 `data-page` 就行（要从页面最上面连着排）。逻辑在 `src/components/usePagedScroll.ts`：只接管滚轮和触控板，翻过最后一页后是普通滚动，从下面往回滚先停在最后一页。没用 CSS scroll-snap，因为鼠标滚轮滚一格不到半屏会弹回原处
- **首屏的星空**（2026-11-26 用户要求）：整块首屏铺满星空（`src/components/nebula/StarSky.tsx`，画布），照应用里的 `StarfieldBackground` 画：星点大小、亮度、冷暖色、闪烁和缓慢漂移用同一套算法，数量按面积算、最多 12000 颗，每秒 30 帧；滚出视口或切到后台时暂停，开了减弱动态效果时只画一帧。星空到首屏底边渐渐淡出。星云用滤色（`mix-blend-screen`）叠在星空上，所以首屏那一层自己带底色（`bg-canvas`），去掉会在星云四周露出一圈黑块
- **首屏的玫瑰星云**是应用概览页那张图（`src/assets/rosette.jpg`），叠加星空背景，在 WebGL 中让云雾和尘粒缓慢移动。WebGL 不可用时用 CSS 让星云缓慢漂移。页面不可见或星云滚出视口时暂停，系统开启减弱动态效果时显示静态图。页脚有图片署名，换图时一起改
- **图标**：网站图标和页头图标取自应用图标；`src/assets/apps/` 里的第三方应用图标是从本机已装的应用导出的

## 部署

线上地址：https://getmaclean.vercel.app （maclean.vercel.app 已被别人占用；项目默认地址 https://maclean-site.vercel.app 也能访问。Vercel 项目 `qinghuazs-projects/maclean-site`，已连接 GitHub 仓库 qinghuazs/MaCleanSite）。
推送到 `main` 会自动部署正式环境；其他分支会生成预览地址。手动部署：`vercel --prod`。

`vite.config.ts` 里 `base: './'`，构建产物全部用相对路径，换到 GitHub Pages（含子路径）、Cloudflare Pages 或自有服务器也能直接用。

## 应用自动更新（Sparkle，2026-11-06 起）

应用 1.1.0 起内置 Sparkle，每天读一次 `https://getmaclean.vercel.app/appcast.xml`（源文件 `public/appcast.xml`）。发新版的顺序：

1. 应用仓库 `./Scripts/build-release.sh <版本>`，产出公证好的 `build/MaClean-<版本>.dmg` 和 `build/appcast-item.xml`（带 EdDSA 签名）
2. `gh release create v<版本> build/MaClean-<版本>.dmg -R qinghuazs/MaCleanSite`
3. 把 `appcast-item.xml` 的 `<item>` 加到 `public/appcast.xml` 的 channel 最上面，连同 `site.config.ts` 的 `version`、`downloadUrl` 一起提交推送

顺序不能反：appcast 先上线而 dmg 还没传，用户点更新会下载失败。

两点注意（2026-11-25 发 1.1.1 时遇到）：

- 这个仓库的工作分支和发布标签可能同名（分支 `v1.1.1`，`gh release create v1.1.1` 又建了同名标签），`git push origin v1.1.1` 会报 "matches more than one"。推送时写完整名字：`git push origin refs/heads/v1.1.1:refs/heads/v1.1.1`，上线用 `git push origin refs/heads/v1.1.1:refs/heads/main`
- 1.1.1 起条目里的更新内容按语言各放一份（`<description xml:lang="en">`、`zh-Hans`、`zh-Hant`），应用里的更新窗口按界面语言挑；这几段由打包脚本从应用仓库的 `Scripts/release-notes/<版本>.<语言>.html` 生成，照原样贴进来就行

