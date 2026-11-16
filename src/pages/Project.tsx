import { useParams } from 'react-router-dom'
import PageStub from '../components/PageStub'
import RuleList from '../components/RuleList'
import { findProject } from '../content/projects'
import NotFound from './NotFound'

export default function Project() {
  const { slug } = useParams()
  const project = findProject(slug)
  if (!project) return <NotFound />
  return (
    <PageStub index="02" section={`Works / ${project.title}`} title={project.title} lead={project.summary} back={{ to: '/works', label: 'Все работы' }}>
      <RuleList
        items={[
          { key: 'year', index: 'Год', label: project.year },
          { key: 'dir', index: 'Тип', label: project.direction },
          { key: 'status', index: 'Статус', label: 'CONCEPT' },
        ]}
      />
    </PageStub>
  )
}
