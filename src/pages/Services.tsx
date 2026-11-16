import PageStub from '../components/PageStub'
import RuleList from '../components/RuleList'

const services = ['UI/UX Design', 'Web Design', 'Web Development', 'App Design']

export default function Services() {
  return (
    <PageStub index="03" section="Services" title="SERVICES" lead="Четыре направления. Детали и формат работы — скоро.">
      <RuleList items={services.map((s, i) => ({ key: s, index: String(i + 1).padStart(2, '0'), label: s }))} />
    </PageStub>
  )
}
