import PageStub from '../components/PageStub'
import RuleList from '../components/RuleList'
import { config } from '../config'

export default function Contact() {
  const rows = [
    { key: 'email', index: 'Mail', value: config.email },
    { key: 'tg', index: 'TG', value: config.telegram },
    { key: 'phone', index: 'Tel', value: config.phone },
  ].filter((r) => r.value)
  return (
    <PageStub index="04" section="Contact" title="CONTACT" lead="Контакты будут добавлены. Форма появится после настройки доставки.">
      {rows.length > 0 && <RuleList items={rows.map((r) => ({ key: r.key, index: r.index, label: r.value }))} />}
    </PageStub>
  )
}
