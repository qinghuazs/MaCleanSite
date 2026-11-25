# CLAUDE.md

MaClean 官网工程，说明见 README.md。关联工程：应用 ../MacleanAPP，核心库 ../maclean。

- 回复、代码注释用中文；页面文案中英双语都要写（文案就近写在组件里，用 `t({ zh, en })`）
- 待定信息只改 `src/site.config.ts`，不要在组件里写死价格、邮箱、天数
- 产品描述要和应用实际功能一致（核对 ../MacleanAPP/CLAUDE.md 与 ../maclean/docs），政策页里关于联网、数据存储的说法要和 `MacleanAPP/Services/LicenseService.swift` 一致
- 颜色只用 `src/styles.css` 里的语义变量（canvas / surface / ink / muted / accent …）；只有深色一套，不做浅色（2026-11-25 用户决定）
- 改完跑 `npm run build`，并在 1440 与 390 宽度、中文与英文下截图检查；英文比中文长，窄屏上容易折行或顶出去
- 首页按 Figma 稿做（链接见 README「设计」）。演示里的界面文字、数字、MCP 接入配置要和应用一致，演示数据集中在 `src/content/demo.ts`
- 品牌写法统一为 `MaClean`（2026-11-04 用户决定），产品名 `MaClean Pro`；真实路径保持原样：`~/Library/Application Support/Maclean`、MCP 服务名 `maclean`；应用包已改名 `MaClean.app`（可执行文件 `MaClean`），对外版本从 1.0.0 起
- 付费边界（应用 2026-11-04）：免费 = 扫描、系统数据、账本、预检与预览、增长监控、回滚；需要许可证 = 执行清理、生成终端脚本、卸载应用；未激活时 MCP 只能只读
