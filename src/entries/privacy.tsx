import { mountPage } from '../components/PageShell'
import { privacy } from '../content/legal'
import { Legal } from '../pages/Legal'

mountPage({
  depth: 1,
  title: { zh: '隐私政策 | MaClean', en: 'Privacy Policy | MaClean' },
  children: <Legal doc={privacy} current="privacy" />,
})
