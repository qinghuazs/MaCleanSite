import { mountPage } from '../components/PageShell'
import { refund } from '../content/legal'
import { Legal } from '../pages/Legal'

mountPage({
  depth: 1,
  title: { zh: '退款政策 | MaClean', en: 'Refund Policy | MaClean' },
  children: <Legal doc={refund} current="refund" />,
})
