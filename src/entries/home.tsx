import { mountPage } from '../components/PageShell'
import { Home } from '../pages/Home'

mountPage({
  depth: 0,
  title: { zh: 'MaClean：Mac 磁盘清理工具', en: 'MaClean: disk cleanup for Mac' },
  children: <Home />,
})
