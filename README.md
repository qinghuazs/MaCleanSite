# Maclean 官网

Maclean（macOS 磁盘清理应用）的产品官网：首页 + 服务条款 / 隐私政策 / 退款政策，中英双语。
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
| `productName` / `price` | 产品名与价格，和 Dodo 产品一致（目前 Maclean Pro，US$10 买断） |
| `devicesPerLicense` | 每个许可证可激活的 Mac 数，和 Dodo 许可证权益的激活上限一致（目前 1） |
| `refundDays` | 无理由退款天数（目前 3 天），同时出现在价格卡片、常见问题、服务条款和退款政策里 |
| `downloadUrl` | dmg 下载地址；留空时下载按钮显示"即将开放下载" |
| `dodoProductId` | Dodo 正式环境产品 ID（pdt_…），和应用里 `LicenseConfig.productIDs[.live]` 一致；留空时购买按钮显示"即将开放购买" |

## 结构

```
index.html, terms/, privacy/, refund/   各页面入口 HTML（多页面构建，路径干净）
src/site.config.ts      可配置项
src/i18n.tsx            中英切换（?lang= → 上次选择 → 浏览器语言）
src/styles.css          设计变量（浅色 / 深色两套）与 Tailwind 主题
src/components/         页头、页脚、首屏清理账本示例、按钮与标签
src/pages/Home.tsx      首页各区块
src/content/legal.ts    三份政策正文（中英）
src/pages/Legal.tsx     政策页模板
```

## 设计

参考 Claude 官网风格：暖白纸张底色 `#FAF9F5`、深墨文字 `#141413`、陶土色强调 `#D97757`；标题用衬线（Newsreader + 思源宋体），正文用 Instrument Sans + 苹方。
字体全部用 @fontsource 本地打包，不依赖 Google Fonts（国内访问不到）；思源宋体按 unicode-range 分片，只下载用到的字。
首屏是一个可交互的"清理账本"示例（示例数据），页面加载时灰色的"系统数据"条会拆成彩色分类，这是全页唯一的自动动效，系统开了"减弱动态效果"时直接显示结果。

## 部署

`vite.config.ts` 里 `base: './'`，构建产物全部用相对路径，`dist/` 可以直接放到 GitHub Pages（含子路径）、Cloudflare Pages、Vercel 或自有服务器。
