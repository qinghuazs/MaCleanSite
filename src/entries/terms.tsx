import { mountPage } from '../components/PageShell'
import { terms } from '../content/legal'
import { Legal } from '../pages/Legal'

mountPage({
  depth: 1,
  title: { zh: '服务条款 | Maclean', en: 'Terms of Service | Maclean' },
  children: <Legal doc={terms} current="terms" />,
})
