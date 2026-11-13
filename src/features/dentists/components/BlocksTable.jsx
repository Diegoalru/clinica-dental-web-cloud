import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Table, { Td, Th } from '@/components/ui/Table'
import { formatDateTimeShort } from '@/utils/dateLabels'

/** Bloqueos puntuales (vacaciones, reuniones). `blocks`: [{ id, startsAt, endsAt, reason }]. */
function BlocksTable({ blocks, editable = false, onRemove }) {
  if (blocks.length === 0) {
    return <EmptyState icon="clock" title="Sin bloqueos próximos" description="Los bloqueos quitan espacios de la agenda." />
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Desde</Th>
          <Th>Hasta</Th>
          <Th>Motivo</Th>
          {editable && <Th align="right">Acciones</Th>}
        </tr>
      </thead>
      <tbody>
        {blocks.map((block) => (
          <tr key={block.id}>
            <Td className="tabular-nums">{formatDateTimeShort(block.startsAt)}</Td>
            <Td className="tabular-nums">{formatDateTimeShort(block.endsAt)}</Td>
            <Td className="text-slate-900">{block.reason || '—'}</Td>
            {editable && (
              <Td align="right">
                <Button variant="ghost" size="sm" icon="trash" className="text-rose-600 hover:bg-rose-50" onClick={() => onRemove(block.id)}>
                  Eliminar
                </Button>
              </Td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default BlocksTable
