import { useState } from 'react'
import PageContainer from '@/components/common/PageContainer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FormField from '@/components/ui/FormField'
import PageHeader from '@/components/ui/PageHeader'
import Select from '@/components/ui/Select'
import Stat from '@/components/ui/Stat'
import Table, { Td, Th } from '@/components/ui/Table'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'
import { activeDentists } from '@/features/dentists/mocks/dentists'
import { services } from '@/features/services/mocks/services'
import WeeklyStatusChart from '../components/WeeklyStatusChart'
import { reportSummary } from '../mocks/reports'

const percent = (part, total) => (total === 0 ? '0 %' : `${Math.round((part / total) * 100)} %`)

/** Reportes de consultas (administrador): filtros, indicadores, gráfico semanal y desgloses. */
function ReportsPage() {
  const [filters, setFilters] = useState({
    from: reportSummary.period.from,
    to: reportSummary.period.to,
    dentistId: '',
    serviceId: '',
    status: '',
  })
  const [applied, setApplied] = useState(filters)

  // TODO(api): reportsService.summary(applied). El mock devuelve siempre el mismo resumen.
  const summary = reportSummary
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }))

  return (
    <PageContainer>
      <PageHeader eyebrow="Administración" title="Reportes de consultas" description="Citas por período, odontólogo, servicio y estado." />

      <Card>
        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
          onSubmit={(event) => {
            event.preventDefault()
            setApplied(filters)
          }}
        >
          <FormField label="Desde" type="date" value={filters.from} onChange={update('from')} />
          <FormField label="Hasta" type="date" value={filters.to} onChange={update('to')} />
          <Select label="Odontólogo" value={filters.dentistId} onChange={update('dentistId')}>
            <option value="">Todos</option>
            {activeDentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.displayName}
              </option>
            ))}
          </Select>
          <Select label="Servicio" value={filters.serviceId} onChange={update('serviceId')}>
            <option value="">Todos</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
          <Select label="Estado" value={filters.status} onChange={update('status')}>
            <option value="">Todos</option>
            {[APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW].map((status) => (
              <option key={status} value={status}>
                {APPOINTMENT_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button type="submit" icon="filter" className="w-full">
              Aplicar filtros
            </Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-slate-500">
          Período aplicado: {applied.from} a {applied.to}.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total de citas" value={summary.total} note={`vs. período anterior ${summary.previousDeltaPercent >= 0 ? '+' : ''}${summary.previousDeltaPercent} %`} />
        <Stat label="Atendidas" value={summary.completed} tone="emerald" note={`${percent(summary.completed, summary.total)} del total`} />
        <Stat label="Canceladas" value={summary.cancelled} tone="slate" note={`${percent(summary.cancelled, summary.total)} del total`} />
        <Stat label="No asistidas" value={summary.noShow} tone="rose" note={`${percent(summary.noShow, summary.total)} del total`} />
      </div>

      <Card title="Citas por semana y estado">
        <WeeklyStatusChart data={summary.weekly} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Por odontólogo" padding={false}>
          <Table>
            <thead>
              <tr>
                <Th>Odontólogo</Th>
                <Th align="right">Atendidas</Th>
                <Th align="right">Canceladas</Th>
                <Th align="right">No asist.</Th>
              </tr>
            </thead>
            <tbody>
              {summary.byDentist.map((row) => (
                <tr key={row.dentistId}>
                  <Td className="font-medium text-slate-900">{row.name}</Td>
                  <Td align="right" className="tabular-nums">{row.completed}</Td>
                  <Td align="right" className="tabular-nums">{row.cancelled}</Td>
                  <Td align="right" className="tabular-nums">{row.noShow}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card title="Por servicio" padding={false}>
          <Table>
            <thead>
              <tr>
                <Th>Servicio</Th>
                <Th align="right">Citas</Th>
                <Th align="right">% del total</Th>
              </tr>
            </thead>
            <tbody>
              {summary.byService.map((row) => (
                <tr key={row.serviceId}>
                  <Td className="font-medium text-slate-900">{row.name}</Td>
                  <Td align="right" className="tabular-nums">{row.count}</Td>
                  <Td align="right" className="tabular-nums">{percent(row.count, summary.total)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  )
}

export default ReportsPage
