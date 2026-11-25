import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLang, type L } from '../../i18n'

// MCP 一块：左边是一段问答示意（数字和扫描结果演示一致），右边是接入配置。
// 配置的写法和应用「设置 → AI 助手」里生成的一样，选好客户端和权限可以直接复制

const command = '/Applications/MaClean.app/Contents/MacOS/MaClean'

type Mode = 'read-only' | 'safe' | 'full'
const modes: { id: Mode; label: L; hint: L; args: string[] }[] = [
  {
    id: 'read-only',
    label: { zh: '只读', en: 'Read-only' },
    hint: { zh: '扫描、分析和生成清理方案。', en: 'Scan, analyze, and generate cleanup plans.' },
    args: ['--mcp', '--mode', 'read-only'],
  },
  {
    id: 'safe',
    label: { zh: '安全（推荐）', en: 'Safe (recommended)' },
    hint: { zh: '移到废纸篓、回滚和生成终端脚本。', en: 'Move items to the Trash, restore them, and generate terminal scripts.' },
    args: ['--mcp'],
  },
  {
    id: 'full',
    label: { zh: '完全', en: 'Full' },
    hint: { zh: '还可永久删除文件和清空废纸篓。', en: 'Also allows permanently deleting files and emptying the Trash.' },
    args: ['--mcp', '--mode', 'full'],
  },
]

type Format = 'toml' | 'shell' | 'json'
const fileLabel: L = { zh: '配置文件', en: 'Configuration file' }
const jsonHelp: L = {
  zh: '已有配置时，将 maclean 项加入 mcpServers。新建文件时，粘贴整段 JSON。',
  en: 'In an existing configuration, add the maclean entry to mcpServers. For a new file, paste the full JSON.',
}
const clients: { name: string; format: Format; where: L; location: L; help: L }[] = [
  {
    name: 'Codex',
    format: 'toml',
    where: fileLabel,
    location: { zh: '~/.codex/config.toml', en: '~/.codex/config.toml' },
    help: { zh: '将下方配置加入文件，然后重新连接 MaClean。', en: 'Add the configuration below to the file, then reconnect to MaClean.' },
  },
  {
    name: 'Claude Code',
    format: 'shell',
    where: { zh: '运行位置', en: 'Run in' },
    location: { zh: '终端', en: 'Terminal' },
    help: { zh: '复制下方命令，在终端中运行。', en: 'Copy the command below and run it in Terminal.' },
  },
  { name: 'Cursor', format: 'json', where: fileLabel, location: { zh: '~/.cursor/mcp.json', en: '~/.cursor/mcp.json' }, help: jsonHelp },
  {
    name: 'Trae',
    format: 'json',
    where: { zh: '添加位置', en: 'Add in' },
    location: { zh: '设置 → MCP → 手动添加', en: 'Settings → MCP → Add manually' },
    help: { zh: '打开手动添加，将下方 JSON 粘贴到配置编辑器。', en: 'Open Add manually and paste the JSON below into the configuration editor.' },
  },
  { name: 'WorkBuddy', format: 'json', where: fileLabel, location: { zh: '~/.workbuddy/mcp.json', en: '~/.workbuddy/mcp.json' }, help: jsonHelp },
  {
    name: 'Claude Desktop',
    format: 'json',
    where: fileLabel,
    location: { zh: '~/Library/Application Support/Claude/claude_desktop_config.json', en: '~/Library/Application Support/Claude/claude_desktop_config.json' },
    help: jsonHelp,
  },
]

function snippet(format: Format, args: string[]): string {
  const list = `[${args.map((a) => JSON.stringify(a)).join(', ')}]`
  if (format === 'shell') return `claude mcp add --scope user maclean -- ${command} ${args.join(' ')}`
  if (format === 'toml') return `[mcp_servers.maclean]\ncommand = ${JSON.stringify(command)}\nargs = ${list}`
  return `{\n  "mcpServers": {\n    "maclean": {\n      "command": ${JSON.stringify(command)},\n      "args": ${list}\n    }\n  }\n}`
}

export function McpDemo() {
  const { t } = useLang()
  const [client, setClient] = useState(0)
  const [mode, setMode] = useState<Mode>('safe')
  const [copied, setCopied] = useState(false)
  const current = clients[client]
  const currentMode = modes.find((m) => m.id === mode)!
  const config = snippet(current.format, currentMode.args)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(config)
      setCopied(true)
    } catch {
      // 剪贴板不可用时不提示成功，用户可以手动选中复制
    }
  }

  const panel = 'rounded-[14px] border border-line bg-canvas p-3.5 desk:p-5'
  const apps: [L, string][] = [
    [{ zh: 'Chrome', en: 'Chrome' }, '5.2 GB'],
    [{ zh: 'QQ 音乐', en: 'QQ Music' }, '3.7 GB'],
    [{ zh: '微信', en: 'WeChat' }, '3.4 GB'],
  ]

  return (
    <div className="grid gap-3 desk:grid-cols-[minmax(0,470fr)_minmax(0,572fr)] desk:gap-4">
      {/* 问答示意 */}
      <div className={`${panel} flex flex-col gap-3`}>
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-muted">{t({ zh: 'AI 助手', en: 'AI assistant' })}</p>
          <p className="flex items-center gap-1.5 rounded-full bg-raised px-[9px] py-[3px] text-[11px] leading-[17px] text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-good" />
            {t({ zh: '已连接 MaClean', en: 'Connected to MaClean' })}
          </p>
        </div>
        <p className="rounded-xl bg-raised px-3 py-2.5 text-[14px] leading-[22px]">
          {t({ zh: '哪些应用的缓存占得最多？清掉以后，还会重新生成吗？', en: 'Which apps have the biggest caches? Will they come back after I clear them?' })}
        </p>
        <p className="flex items-center gap-2 text-[11px] leading-[17px] text-subtle">
          {t({ zh: '调用工具', en: 'Tool call' })}
          <span className="rounded-md border border-line px-[7px] py-0.5 font-mono text-muted">maclean · get_ledger</span>
        </p>
        <p className="text-[14px] leading-[22px]">{t({ zh: '缓存占得最多的三个应用：', en: 'The three apps with the biggest caches:' })}</p>
        <ul className="space-y-1.5 rounded-[10px] bg-surface px-3 py-2.5 text-[13px] leading-5">
          {apps.map(([name, size]) => (
            <li key={size} className="flex justify-between gap-3">
              <span>{t(name)}</span>
              <span className="font-mono font-medium text-good">{size}</span>
            </li>
          ))}
        </ul>
        <p className="text-[14px] leading-[22px] text-muted">
          {t({
            zh: '清掉以后会重新生成，但要用到才会：再打开网页、再听这些歌时才重新下载。Chrome 和微信要先退出才能清。',
            en: 'Yes, they come back, but only when needed: pages and songs are downloaded again the next time you open them. Chrome and WeChat have to quit before their caches can be cleared.',
          })}
        </p>
      </div>

      {/* 接入配置 */}
      <div className={`${panel} flex min-w-0 flex-col gap-3.5`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] leading-[23px] font-bold">{t({ zh: '接入配置', en: 'Configuration' })}</p>
          <button type="button" onClick={copy} className="rounded-lg bg-ink px-3.5 py-[7px] text-[13px] leading-5 font-bold text-canvas hover:bg-white">
            {copied ? t({ zh: '已复制', en: 'Copied' }) : t({ zh: '复制配置', en: 'Copy Configuration' })}
          </button>
        </div>

        <div role="group" aria-label={t({ zh: '客户端', en: 'Client' })} className="flex flex-wrap gap-0.5 self-start rounded-[10px] border border-line bg-surface p-[3px]">
          {clients.map((c, i) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={i === client}
              onClick={() => setClient(i)}
              className={`rounded-[7px] px-2.5 py-[5px] text-[13px] leading-5 transition-colors ${i === client ? 'bg-raised font-bold text-ink' : 'font-medium text-muted hover:text-ink'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div>
          <label className="flex items-center gap-2.5 text-[13px] text-muted">
            {t({ zh: '权限', en: 'Permission' })}
            <span className="relative">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="cursor-pointer appearance-none rounded-lg border border-line bg-surface py-[5px] pr-8 pl-2.5 text-[13px] leading-5 font-medium text-ink"
              >
                {modes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {t(m.label)}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted" />
            </span>
          </label>
          <p className={`mt-1.5 text-[12px] leading-[18px] ${mode === 'full' ? 'text-warn' : 'text-subtle'}`}>{t(currentMode.hint)}</p>
        </div>

        <div>
          <p className="flex flex-wrap items-baseline gap-x-2 text-[12px] leading-[18px] text-muted">
            {t(current.where)}
            <span className={`break-all text-ink ${current.format === 'shell' || current.name === 'Trae' ? '' : 'font-mono'}`}>{t(current.location)}</span>
          </p>
          <p className="mt-0.5 text-[12px] leading-[18px] text-subtle">{t(current.help)}</p>
        </div>

        {/* 终端命令是一长行，折行显示；配置文件保持原样、放不下时横向滚动 */}
        <pre
          className={`no-scrollbar overflow-x-auto rounded-lg border border-line bg-black px-3 py-2.5 font-mono text-[12px] leading-5 desk:text-[13px] ${
            current.format === 'shell' ? 'break-all whitespace-pre-wrap' : ''
          }`}
        >
          <code>{config}</code>
        </pre>

        <p className="text-[12px] leading-[18px] text-subtle">
          {t({
            zh: '如需扫描文稿等受保护目录，请给启动 AI 助手的应用授予完全磁盘访问权限。',
            en: 'To scan protected folders such as Documents, grant Full Disk Access to the app that launches the AI assistant.',
          })}
        </p>
      </div>
    </div>
  )
}
