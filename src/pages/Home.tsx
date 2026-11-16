import PageStub from '../components/PageStub'
import RuleList from '../components/RuleList'
import { navLinks } from '../components/links'

export default function Home() {
  return (
    <PageStub
      index="00"
      section="Index"
      title="SURKOV"
      lead="Дизайн, который помнят руками. UI/UX, веб-дизайн, разработка и приложения."
      back={{ to: '/works', label: 'Смотреть работы' }}
    >
      <RuleList
        items={navLinks.filter((l) => l.to !== '/').map((l) => ({ key: l.to, index: l.n, label: l.label, to: l.to }))}
      />
    </PageStub>
  )
}
