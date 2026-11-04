# CLAUDE.md

Maclean 官网工程，说明见 README.md。关联工程：应用 ../MacleanAPP，核心库 ../maclean。

- 回复、代码注释用中文；页面文案中英双语都要写（文案就近写在组件里，用 `t({ zh, en })`）
- 待定信息只改 `src/site.config.ts`，不要在组件里写死价格、邮箱、天数
- 产品描述要和应用实际功能一致（核对 ../MacleanAPP/CLAUDE.md 与 ../maclean/docs），政策页里关于联网、数据存储的说法要和 `MacleanAPP/Services/LicenseService.swift` 一致
- 颜色只用 `src/styles.css` 里的语义变量（paper / ink / clay / olive …），深色模式靠变量切换
- 改完跑 `npm run build`，并在 1440 与 390 宽度、浅色与深色下截图检查
