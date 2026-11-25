import type { L } from '../i18n'

// 用户手册正文（中英）。界面上的名字要和应用一致：中文照应用的简体界面写，英文照应用翻译文件
// （../MacleanAPP/MacleanAPP/Localizable.xcstrings、../maclean/Localization/Localizable.xcstrings）里的写法。
// 正文里可以用的标记：**加粗**、`代码`、[文字](目标)；目标是 #锚点（本页）、{download}（首页下载区）或完整网址。

/** 这份手册是照哪个版本的应用写的；应用改了界面或流程后，正文和这里一起改 */
export const guideVersion = '1.1.1'

export type GuideStep = { title?: L; text: L }
export type GuideBlock =
  | { kind: 'p'; text: L }
  | { kind: 'h3'; id: string; text: L }
  | { kind: 'steps'; items: GuideStep[] }
  | { kind: 'table'; head: [L, L]; rows: [L, L][] }
  | { kind: 'warn'; text: L }
export type GuideSection = { id: string; h: L; blocks: GuideBlock[] }
export type GuideDoc = { title: L; intro: L; sections: GuideSection[] }

export const guide: GuideDoc = {
  title: { zh: 'MaClean 用户手册', en: 'MaClean User Guide' },
  intro: {
    zh: 'MaClean 帮你找出哪些应用和目录占用磁盘空间，查看清理建议，并按需要清理文件或卸载应用。第一次使用时，可以先扫描、查看结果，再决定要处理哪些项目。',
    en: 'MaClean shows which apps and folders take up disk space, suggests what to clean, and lets you clean up files or uninstall apps when you choose. The first time, you can just scan and look through the results before deciding what to do.',
  },
  sections: [
    {
      id: 'start',
      h: { zh: '安装和快速开始', en: 'Install and quick start' },
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: { zh: '安装 MaClean。', en: 'Install MaClean.' },
              text: {
                zh: '从[下载区]({download})下载安装包，打开 `.dmg`，将 MaClean 拖入「应用程序」文件夹，再从访达打开。',
                en: 'Download the installer from the [download section]({download}), open the `.dmg`, drag MaClean into the Applications folder, then open it from Finder.',
              },
            },
            {
              title: { zh: '先授予完全磁盘访问。', en: 'Grant Full Disk Access first.' },
              text: {
                zh: '没有这项权限时，微信、文稿、废纸篓等受保护的目录扫描不到，结果会不完整。步骤见[授予完全磁盘访问](#fda)。',
                en: "Without it, protected folders such as WeChat's data, Documents and the Trash can't be scanned, so the results will be incomplete. See [Grant Full Disk Access](#fda).",
              },
            },
            {
              title: { zh: '从「概览」开始扫描。', en: 'Start a scan from Overview.' },
              text: {
                zh: '点「开始扫描」或按 `⌘R`。扫描只读取磁盘信息。留在「概览」时，扫描完成后会自动打开「扫描结果」。',
                en: 'Click **Start Scan** or press `⌘R`. Scanning only reads disk information. If you stay on Overview, Scan Results opens automatically when the scan finishes.',
              },
            },
            {
              title: { zh: '选好项目再清理。', en: 'Choose items, then clean.' },
              text: {
                zh: '展开应用，先看文件路径和删除影响，核对勾选项与清理方式后再点「清理」。首次清理建议使用默认的「移到废纸篓」。',
                en: 'Expand an app, check the file paths and what deleting them does, confirm your selection and the cleanup method, then click **Clean**. For your first cleanup, keep the default, **Move to Trash**.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'scan',
      h: { zh: '扫描并选择项目', en: 'Scan and choose items' },
      blocks: [
        {
          kind: 'p',
          text: {
            zh: '「扫描结果」按应用组织扫描到的项目。顶部显示项目数和占用总量，底部显示已勾选项目数及预计释放空间。',
            en: "Scan Results groups what the scan found by app. The top shows how many items were found and how much space they use. The bottom bar shows how many you've selected and the estimated space freed.",
          },
        },
        {
          kind: 'steps',
          items: [
            {
              title: { zh: '搜索或筛选。', en: 'Search or filter.' },
              text: {
                zh: '在「搜索文件、软件或路径」输入应用名、文件名或路径。勾选「只看建议项」可以缩小列表范围。',
                en: 'Type an app name, file name or path into **Search files, apps, or paths**. Turn on **Suggested only** to narrow the list.',
              },
            },
            {
              title: { zh: '展开应用和文件详情。', en: 'Expand apps and items.' },
              text: {
                zh: '点应用行查看缓存、日志、编译产物等项目，再点文件行查看说明。右键可选「在访达中显示」或「复制路径」，也可将可清理的项目标为「以后再说」。',
                en: 'Click an app row to see its caches, logs, build products and other items, then click an item to read its details. Right-click for **Show in Finder** or **Copy Path**, or to mark a cleanable item **Not Now**.',
              },
            },
            {
              title: { zh: '勾选项目并核对底栏。', en: 'Select items and check the bottom bar.' },
              text: {
                zh: '可以逐项勾选，也可以点「全选建议项」，批量勾选当前搜索范围内的建议项。批量操作会跳过标为「以后再说」的项目，以及需要先退出正在运行的应用才能清理的项目。',
                en: 'Select items one by one, or click **Select All Suggested** to select every suggested item in the current search results. This skips items marked **Not Now** and items that can only be cleaned after quitting an app that is running.',
              },
            },
          ],
        },
        {
          kind: 'table',
          head: [
            { zh: '项目状态', en: 'Status' },
            { zh: '处理方式', en: 'What to do' },
          ],
          rows: [
            [
              { zh: '建议清理', en: 'Suggested' },
              { zh: '常见的是可重建的缓存和日志。清理缓存后，应用可能在下次使用时重新生成。', en: 'Usually caches and logs that can be rebuilt. After you clean a cache, the app may recreate it the next time you use it.' },
            ],
            [
              { zh: '需要你确认', en: 'Needs Your Review' },
              { zh: '逐项查看用途和删除影响。聊天媒体、离线内容和大文件等，先确认是否还需要。', en: 'Check what each item is for and what deleting it does. For chat media, offline content, large files and the like, make sure you no longer need them.' },
            ],
            [
              { zh: '仅查看', en: 'View only' },
              { zh: '可检查路径、占用和说明，项目不可勾选。', en: "You can see the path, size and description, but the item can't be selected." },
            ],
          ],
        },
        {
          kind: 'p',
          text: {
            zh: '更改搜索词或关闭筛选会保留已有勾选。想从头选择时，点「全不选」。',
            en: 'Changing the search text or turning off the filter keeps your selection. To start over, click **Deselect All**.',
          },
        },
        { kind: 'h3', id: 'running-apps', text: { zh: '应用正在运行时', en: 'When an app is running' } },
        {
          kind: 'p',
          text: {
            zh: '有些项目要先退出对应的应用才能清理。应用开着时，它那一行会标「需先退出」，「全选建议项」也不会勾这些项目。',
            en: 'Some items can only be cleaned after their app quits. While the app is open, its row is marked **Quit first**, and **Select All Suggested** leaves those items unselected.',
          },
        },
        {
          kind: 'p',
          text: {
            zh: '底栏提示「另有 N 个建议项因应用正在运行没勾选」时，点后面的「查看」，在小窗里给要清理的应用点「勾选」。',
            en: "When the bottom bar says some suggested items weren't selected because their apps are running, click **View** next to it, then click **Select** for each app you want to clean.",
          },
        },
        {
          kind: 'p',
          text: {
            zh: '「设置 → 清理」里的「清理前自动退出相关应用」打开时，清理前会先自动退出这些应用，请先保存好其中的工作。这个开关关闭时，要自己先退出应用，再清理。',
            en: 'With **Quit affected apps before cleanup** turned on in Settings → Clean, MaClean quits those apps before cleaning, so save your work in them first. With it off, quit the apps yourself before cleaning.',
          },
        },
      ],
    },
    {
      id: 'clean',
      h: { zh: '执行清理和找回文件', en: 'Clean up and recover files' },
      blocks: [
        {
          kind: 'p',
          text: {
            zh: '选好项目后，到「设置 → 清理」核对「清理方式」。回到「扫描结果」点「清理」，等结果弹窗出现。',
            en: "Once you've made your selection, check **Cleanup method** in Settings → Clean. Go back to Scan Results, click **Clean**, and wait for the results window.",
          },
        },
        {
          kind: 'table',
          head: [
            { zh: '清理方式', en: 'Cleanup method' },
            { zh: '执行后的结果', en: 'What happens' },
          ],
          rows: [
            [
              { zh: '移到废纸篓', en: 'Move to Trash' },
              { zh: '默认方式。移入废纸篓的文件仍占用磁盘空间，清空后才释放对应空间。', en: 'The default. Files in the Trash still take up disk space. The space is freed when you empty the Trash.' },
            ],
            [
              { zh: '永久删除（无法恢复）', en: "Delete Permanently (Can't Undo)" },
              { zh: '从设置切换时需要确认。以此方式删除的项目会跳过废纸篓，无法从废纸篓恢复。', en: "Switching to it in Settings asks you to confirm. Items deleted this way skip the Trash and can't be restored from it." },
            ],
          ],
        },
        {
          kind: 'p',
          text: {
            zh: '清空废纸篓是单独的操作，不在「清理方式」里。有两个入口，都要再确认一次：在结果弹窗里点「现在清空废纸篓…」，或在扫描结果里勾选了废纸篓这一项再点「清理」。清空会永久删除废纸篓里的全部内容，包括其他磁盘上的废纸篓和不是 MaClean 移进去的文件，无法恢复。',
            en: "Emptying the Trash is a separate action, not a cleanup method. There are two ways to do it, and both ask you to confirm again: click **Empty Trash Now…** in the results window, or select the Trash item in Scan Results and click **Clean**. Emptying permanently deletes everything in the Trash, including the Trash on other disks and files MaClean didn't put there, and it can't be undone.",
          },
        },
        { kind: 'h3', id: 'results', text: { zh: '查看清理结果', en: 'Read the results' } },
        {
          kind: 'p',
          text: {
            zh: '先看「失败」和「跳过」的原因。若应用仍在运行，保存工作并退出应用后重试。显示「已写入终端脚本」的项目，到「终端待办」查看。',
            en: 'Start with the reasons under **Failed** and **Skipped**. If an app is still running, save your work, quit it and try again. Items listed under **Written to Terminal Script** are waiting in Terminal Tasks.',
          },
        },
        {
          kind: 'p',
          text: {
            zh: '文件移到废纸篓后，可以先保留。确认内容都可以删除时，可在结果弹窗里点「现在清空废纸篓…」，也可在关闭弹窗后从访达清空。',
            en: "You can leave files in the Trash for a while. When you're sure everything can go, click **Empty Trash Now…** in the results window, or empty the Trash from Finder later.",
          },
        },
        { kind: 'h3', id: 'recover', text: { zh: '清空前找回文件', en: 'Recover files before emptying' } },
        {
          kind: 'steps',
          items: [
            {
              text: {
                zh: '打开程序坞里的「废纸篓」，找到要还原的文件或应用。',
                en: 'Open the Trash from the Dock and find the file or app you want back.',
              },
            },
            {
              text: {
                zh: '右键点该项目。访达提供「放回原处」时，选这一项恢复。如果没有这个选项，先把项目拖到安全位置，核对原路径后再移回。',
                en: 'Right-click it. If Finder offers **Put Back**, choose it. If not, drag the item somewhere safe, check where it originally was, then move it back.',
              },
            },
          ],
        },
        {
          kind: 'p',
          text: {
            zh: 'MaClean 1.1.1 暂时隐藏了「清理记录」页签。需要还原文件时，请在清空废纸篓前从访达逐项处理。',
            en: 'MaClean 1.1.1 temporarily hides the Cleanup History tab. To restore files, do it item by item in Finder before you empty the Trash.',
          },
        },
        {
          kind: 'p',
          text: {
            zh: '[Apple 支持文档：废纸篓的用法](https://support.apple.com/zh-cn/guide/mac-help/mchlp1093/mac)',
            en: '[Apple Support: using the Trash on Mac](https://support.apple.com/guide/mac-help/mchlp1093/mac)',
          },
        },
      ],
    },
    {
      id: 'system-data',
      h: { zh: '读懂系统数据', en: 'Read System Data' },
      blocks: [
        {
          kind: 'p',
          text: {
            zh: '在「系统数据」页查看启动磁盘的已用空间和可用空间，并按分类追查占用较大的目录。统计过程只读取文件信息。',
            en: 'The System Data page shows used and available space on your startup disk and lets you trace the largest folders by category. Analysis only reads file information.',
          },
        },
        {
          kind: 'steps',
          items: [
            {
              title: { zh: '查看统计时间。', en: 'Check when it was analyzed.' },
              text: {
                zh: '首次进入会开始统计。点右上角「重新统计」，更新过期的数据或检查清理后的占用变化。',
                en: 'The first visit starts an analysis. Click **Reanalyze** at the top right to refresh old data or to see what changed after a cleanup.',
              },
            },
            {
              title: { zh: '点分类或地图色块。', en: 'Click a category or a block on the map.' },
              text: {
                zh: '在顶部切换分类，或点左侧地图上的子目录色块。右侧会定位并展开对应明细。',
                en: 'Switch categories at the top, or click a subfolder block on the map on the left. The details on the right jump to that folder and expand it.',
              },
            },
            {
              title: { zh: '核对目录和清理建议。', en: 'Check the folders and suggestions.' },
              text: {
                zh: '右侧列出占用最大的目录，有更多条目时可点「查看明细」。底部显示最近一次扫描对该类给出的建议清理量。点「查看扫描结果」可进一步核对。',
                en: "The right side lists the largest folders. Click **Show details** when there are more. At the bottom you'll see how much the latest scan suggests cleaning in this category. Click **View Scan Results** to look closer.",
              },
            },
          ],
        },
        {
          kind: 'table',
          head: [
            { zh: '分类', en: 'Category' },
            { zh: '主要内容', en: 'What it contains' },
          ],
          rows: [
            [
              { zh: '应用支持数据', en: 'Application Support Data' },
              { zh: '应用保存的设置、数据库和本地内容。', en: 'Settings, databases and local content saved by apps.' },
            ],
            [
              { zh: '沙盒应用容器', en: 'Sandboxed App Containers' },
              { zh: '各个应用在沙盒里的数据，可能含聊天记录等个人文件。', en: 'Data each app keeps in its sandbox. It may include personal files such as chat history.' },
            ],
            [
              { zh: '用户缓存', en: 'User Cache' },
              { zh: '应用会按需重新生成的临时文件。', en: 'Temporary files that apps recreate when needed.' },
            ],
            [
              { zh: 'iOS 模拟器运行时', en: 'iOS Simulator Runtimes' },
              { zh: 'Xcode 下载的模拟器系统版本。', en: 'Simulator OS versions downloaded by Xcode.' },
            ],
            [
              { zh: 'Xcode 开发者目录', en: 'Xcode Developer Folder' },
              { zh: '编译缓存、模拟器设备与设备支持文件。', en: 'Build caches, simulator devices and device support files.' },
            ],
            [
              { zh: '废纸篓', en: 'Trash' },
              { zh: '已移到废纸篓的文件，清空后才真正释放空间。', en: 'Files already moved to the Trash. The space is only freed when you empty it.' },
            ],
            [
              { zh: '本地快照', en: 'Local Snapshots' },
              { zh: '本地备份快照，大小可能显示未知。', en: 'Local backup snapshots. The size may show as unknown.' },
            ],
          ],
        },
        {
          kind: 'p',
          text: {
            zh: '占用很小的分类不画进地图，列在地图下方，同样可以点开查看。',
            en: "Very small categories aren't drawn on the map. They're listed below it and can still be opened.",
          },
        },
        {
          kind: 'p',
          text: {
            zh: '地图显示目录占用。若文件共享底层数据，预计释放量可能低于占用量。废纸篓、快照和清理期间的其他磁盘写入也可能影响实际可用空间。',
            en: 'The map shows how much space folders occupy. When files share underlying data, the estimated space freed can be lower than the space they occupy. The Trash, snapshots and other disk writes during a cleanup can also affect the space you actually get back.',
          },
        },
      ],
    },
    {
      id: 'uninstall',
      h: { zh: '卸载应用和处理终端待办', en: 'Uninstall apps and handle Terminal Tasks' },
      blocks: [
        { kind: 'h3', id: 'uninstall-app', text: { zh: '卸载应用', en: 'Uninstall an app' } },
        {
          kind: 'steps',
          items: [
            {
              title: { zh: '打开卸载清单。', en: 'Open the uninstall list.' },
              text: {
                zh: '在「卸载应用」页按名称或标识符搜索，点应用图标。也可打开「90 天未使用」筛选。',
                en: "On the Uninstall Apps page, search by name or identifier and click the app's icon. You can also turn on the **Unused for 90 days** filter.",
              },
            },
            {
              title: { zh: '核对应用本体和附属数据。', en: 'Review the app and its data.' },
              text: {
                zh: '逐项查看缓存、容器和支持文件。打算重装应用，或需要保留设置与本地资料时，勾选「保留应用数据（只卸载应用本体）」。',
                en: 'Go through the caches, containers and support files. If you plan to reinstall the app or want to keep its settings and local data, select **Keep app data (uninstall the app only)**.',
              },
            },
            {
              title: { zh: '确认卸载。', en: 'Confirm.' },
              text: {
                zh: '先保存应用里的工作，再点「卸载并移到废纸篓」并确认。访达可能需要授权。想检查旧应用的遗留文件，可点「查看卸载残留」进入扫描结果。',
                en: 'Save your work in the app, then click **Uninstall and Move to Trash** and confirm. Finder may ask for permission. To check for files left by apps you removed earlier, click **View Uninstalled App Leftovers** to open Scan Results.',
              },
            },
          ],
        },
        { kind: 'h3', id: 'terminal-tasks', text: { zh: '处理终端待办', en: 'Handle Terminal Tasks' } },
        {
          kind: 'steps',
          items: [
            {
              title: { zh: '核对脚本。', en: 'Review the script.' },
              text: {
                zh: '在「终端待办」选中「待执行」的脚本，查看「将删除的项」、完整路径和「脚本内容」。',
                en: 'In Terminal Tasks, select a script under **Pending** and check **Items to Delete**, the full paths and **Script Contents**.',
              },
            },
            {
              title: { zh: '确认后执行。', en: "Run it when you're sure." },
              text: {
                zh: '点「在终端执行…」，或用「复制命令」将命令粘贴到终端。脚本会等你按回车确认。标有 `sudo` 的命令可能需要管理员密码。',
                en: 'Click **Run in Terminal…**, or use **Copy Command** and paste the command into Terminal. The script waits for you to press Return. Commands marked `sudo` may ask for an administrator password.',
              },
            },
            {
              title: { zh: '回到 MaClean 复查。', en: 'Verify in MaClean.' },
              text: {
                zh: '脚本执行后点「复查」。MaClean 会检查对应路径是否还在。复查只读取状态，未处理的项目会继续显示。',
                en: 'After the script runs, click **Verify**. MaClean checks whether the paths still exist. Verifying only reads their status, and anything not handled stays listed.',
              },
            },
          ],
        },
        {
          kind: 'warn',
          text: {
            zh: '终端脚本中的删除命令会跳过废纸篓，执行后无法撤销。路径或用途不确定时，先保留脚本，暂缓执行。',
            en: "Delete commands in a Terminal script skip the Trash and can't be undone. If you're unsure about a path or what it's for, keep the script and don't run it yet.",
          },
        },
      ],
    },
    {
      id: 'settings',
      h: { zh: '设置与许可证', en: 'Settings and license' },
      blocks: [
        { kind: 'p', text: { zh: '从窗口顶部打开「设置」。', en: 'Open **Settings** from the top of the window.' } },
        {
          kind: 'table',
          head: [
            { zh: '设置页', en: 'Tab' },
            { zh: '可以操作的内容', en: 'What you can do' },
          ],
          rows: [
            [
              { zh: '通用', en: 'General' },
              { zh: '授权完全磁盘访问和访达自动化。切换界面语言、显示菜单栏剩余空间，或设置登录时启动。更改界面语言后需重启 MaClean。', en: 'Grant Full Disk Access and Finder Automation. Change the app language, show free space in the menu bar, or open MaClean at login. Restart MaClean after changing the language.' },
            ],
            [
              { zh: '清理', en: 'Clean' },
              { zh: '选择清理方式，设置清理前自动退出相关应用，查看扫描结果、快照和脚本的数据目录。「深度扫描」会按通用规则额外检查缓存、日志和下载目录。', en: 'Choose the cleanup method, decide whether to quit affected apps before cleanup, and find the data folders for scan results, snapshots and scripts. **Deep scan** also checks cache, log and download folders against general rules.' },
            ],
            [
              { zh: '提醒', en: 'Alerts' },
              { zh: '允许通知，设置低空间提醒阈值，开启「每日记录磁盘占用」。这一项就是增长监控：MaClean 每天记录一次磁盘占用，发现目录增长或可用空间下降时发通知提醒。', en: 'Allow notifications, set the low-space threshold, and turn on **Record disk usage daily**. This is growth monitoring: MaClean records disk usage once a day and notifies you when a folder grows or free space drops.' },
            ],
            [
              { zh: 'AI 助手', en: 'AI Assistants' },
              { zh: '选择 MCP 客户端和权限模式，并复制接入配置。详见[连接 AI 助手](#mcp)。', en: 'Pick an MCP client and a permission mode, then copy the configuration. See [Connect an AI assistant](#mcp).' },
            ],
            [
              { zh: '许可证', en: 'License' },
              { zh: '购买、激活、重新校验或停用许可证。也可查看当前版本并点「检查更新…」。', en: 'Buy, activate, revalidate or deactivate a license. You can also see the current version and click **Check for Updates…**.' },
            ],
          ],
        },
        { kind: 'h3', id: 'fda', text: { zh: '授予完全磁盘访问', en: 'Grant Full Disk Access' } },
        {
          kind: 'steps',
          items: [
            {
              text: {
                zh: '前往「设置 → 通用 → 权限」，点「打开系统设置」。',
                en: 'Go to Settings → General → Permissions and click **Open System Settings**.',
              },
            },
            {
              text: {
                zh: '在 macOS 的「隐私与安全性 → 完全磁盘访问权限」中打开 MaClean 的开关。',
                en: 'In macOS, under Privacy & Security → Full Disk Access, turn on MaClean.',
              },
            },
            {
              text: {
                zh: '按 `⌘Q` 退出 MaClean，重新打开，再扫描或统计。',
                en: 'Press `⌘Q` to quit MaClean, open it again, then scan or analyze.',
              },
            },
          ],
        },
        {
          kind: 'p',
          text: {
            zh: '如果清理前出现权限提示，弹窗提供「先清理其余 N 项」时，可以先处理权限足够的项目。',
            en: "If a permission alert appears before cleaning and offers **Clean the Other N Items First**, you can go ahead with the items that don't need the permission.",
          },
        },
        { kind: 'h3', id: 'license', text: { zh: '激活与换电脑', en: 'Activate, or move to another Mac' } },
        {
          kind: 'p',
          text: {
            zh: '扫描、查看结果、系统数据和增长监控（「设置 → 提醒」里的「每日记录磁盘占用」）可免费使用。执行清理和卸载应用需要激活许可证。',
            en: 'Scanning, viewing results, System Data and growth monitoring (**Record disk usage daily** in Settings → Alerts) are free. Cleaning and uninstalling apps need an activated license.',
          },
        },
        {
          kind: 'p',
          text: {
            zh: '购买后，从邮件复制密钥，在「设置 → 许可证」中粘贴并点「激活」。换电脑时，先在旧 Mac 点「在这台 Mac 上停用…」，再在新 Mac 激活。',
            en: 'After you buy, copy the key from the email, paste it in Settings → License and click **Activate**. To move to another Mac, click **Deactivate on This Mac…** on the old one first, then activate on the new one.',
          },
        },
      ],
    },
    {
      id: 'assistant',
      h: { zh: 'AI 助手和常见问题', en: 'AI assistants and common questions' },
      blocks: [
        { kind: 'h3', id: 'mcp', text: { zh: '连接 AI 助手', en: 'Connect an AI assistant' } },
        {
          kind: 'p',
          text: {
            zh: '通过 MCP，可以在 Codex、Claude Code 等客户端里查看 MaClean 的扫描和分析结果。打开「设置 → AI 助手」，选择客户端和模式，点「复制配置」。按页面指引添加配置后，重新连接或重启客户端。',
            en: "With MCP, clients such as Codex and Claude Code can read MaClean's scan and analysis results. Open Settings → AI Assistants, pick a client and a mode, and click **Copy Configuration**. Add the configuration as the page describes, then reconnect or restart the client.",
          },
        },
        {
          kind: 'p',
          text: {
            zh: '要让 AI 助手扫描文稿等受保护的目录，还要给启动 AI 助手的应用（比如运行 Claude Code 的终端应用）授予完全磁盘访问权限。只给 MaClean 授权不够。',
            en: 'To let an AI assistant scan protected folders such as Documents, also grant Full Disk Access to the app that launches it, for example the terminal app you run Claude Code in. Granting it to MaClean alone is not enough.',
          },
        },
        {
          kind: 'table',
          head: [
            { zh: '连接模式', en: 'Mode' },
            { zh: '允许的操作', en: 'What it allows' },
          ],
          rows: [
            [
              { zh: '只读', en: 'Read-only' },
              { zh: '扫描、分析和生成清理方案。未激活许可证时，AI 助手以只读模式运行。', en: 'Scanning, analysis and cleanup plans. Without an activated license, AI assistants run in read-only mode.' },
            ],
            [
              { zh: '安全（推荐）', en: 'Safe (recommended)' },
              { zh: '包含只读操作，并允许移到废纸篓、回滚和生成终端脚本。', en: 'Everything in read-only, plus moving files to the Trash, rolling back and generating Terminal scripts.' },
            ],
            [
              { zh: '完全', en: 'Full' },
              { zh: '还允许永久删除文件和清空废纸篓。', en: 'Also allows deleting files permanently and emptying the Trash.' },
            ],
          ],
        },
        { kind: 'h3', id: 'faq', text: { zh: '常见问题', en: 'Common questions' } },
        {
          kind: 'table',
          head: [
            { zh: '遇到的情况', en: 'Problem' },
            { zh: '处理方法', en: 'What to do' },
          ],
          rows: [
            [
              { zh: '扫不到微信或废纸篓', en: "WeChat or the Trash isn't scanned" },
              { zh: '到「设置 → 通用」检查完全磁盘访问。授权后重开 MaClean，再重新扫描或统计。', en: 'Check Full Disk Access in Settings → General. After granting it, reopen MaClean and scan or analyze again.' },
            ],
            [
              { zh: '「清理」按钮点不了', en: 'The Clean button is disabled' },
              { zh: '先勾选可清理的项目。扫描、清理或清空废纸篓进行时，请等待当前操作结束。', en: 'Select something that can be cleaned first. While a scan, a cleanup or emptying the Trash is in progress, wait for it to finish.' },
            ],
            [
              { zh: '点「清理」弹出激活窗口', en: 'Clicking Clean opens the activation window' },
              { zh: '执行清理需要许可证。在弹出的窗口里粘贴密钥激活，或到「设置 → 许可证」购买和激活。', en: 'Cleaning needs a license. Paste your key in that window to activate, or buy and activate in Settings → License.' },
            ],
            [
              { zh: '清理后可用空间变化很小', en: 'Free space barely changed after cleaning' },
              { zh: '检查文件是否进入废纸篓，或有项目被跳过、转为终端待办。共享文件和本地快照也可能影响实际释放量。', en: 'Check whether the files went to the Trash, or whether items were skipped or moved to Terminal Tasks. Shared files and local snapshots can also affect how much space is actually freed.' },
            ],
            [
              { zh: '提示缺少访达权限', en: 'An alert says Finder permission is missing' },
              { zh: '在「设置 → 通用 → 访达自动化」请求授权。若已拒绝，到 macOS 的「隐私与安全性 → 自动化」允许 MaClean 控制访达。', en: 'Request it under Settings → General → Finder Automation. If you declined earlier, go to Privacy & Security → Automation in macOS and allow MaClean to control Finder.' },
            ],
          ],
        },
      ],
    },
  ],
}
