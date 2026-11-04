import { mountPage } from '../components/PageShell'
import { Home } from '../pages/Home'

mountPage({
  depth: 0,
  title: { zh: 'Maclean：看清再清理的 Mac 磁盘清理工具', en: 'Maclean: a Mac disk cleaner that explains before it deletes' },
  children: <Home />,
})
