/**
 * Tabla con scroll horizontal en pantallas angostas. Uso:
 *
 *   <Table>
 *     <thead><tr><Th>Nombre</Th><Th align="right">Precio</Th></tr></thead>
 *     <tbody><tr><Td>…</Td></tr></tbody>
 *   </Table>
 */
function Table({ className = '', children, ...props }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[560px] text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  )
}

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' }

export function Th({ align = 'left', className = '', children, ...props }) {
  return (
    <th
      scope="col"
      className={`border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-500 uppercase ${ALIGN[align]} ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export function Td({ align = 'left', className = '', children, ...props }) {
  return (
    <td
      className={`border-b border-slate-100 px-4 py-3 align-middle text-slate-700 ${ALIGN[align]} ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}

export default Table
