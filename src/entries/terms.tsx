import { mountPage } from '../components/PageShell'
import { terms } from '../content/legal'
import { Legal } from '../pages/Legal'

mountPage({
  depth: 1,
  title: { zh: '服务条款 | MaClean', en: 'Terms of Service | MaClean' },
  children: <Legal doc={terms} current="terms" />,
})
