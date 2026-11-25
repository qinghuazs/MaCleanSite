import { mountPage } from '../components/PageShell'
import { Guide } from '../pages/Guide'

mountPage({
  depth: 1,
  title: { zh: '用户手册 | MaClean', en: 'User Guide | MaClean' },
  children: <Guide />,
})
