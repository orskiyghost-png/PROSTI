import PageStub from '../components/PageStub'
import RuleList from '../components/RuleList'
import { projects } from '../content/projects'

export default function Works() {
  return (
    <PageStub index="02" section="Works" title={`WORKS (${String(projects.length).padStart(2, '0')})`} lead="Концепты первой волны. Все работы помечены CONCEPT.">
      <RuleList
        items={projects.map((p, i) => ({
          key: p.slug,
          index: String(i + 1).padStart(2, '0'),
          label: p.title,
          meta: `${p.direction} — CONCEPT`,
          to: `/works/${p.slug}`,
        }))}
      />
    </PageStub>
  )
}
