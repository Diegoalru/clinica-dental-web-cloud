import { Outlet } from 'react-router'
import Icon from '@/components/ui/Icon'

const highlights = [
  { icon: 'calendar', text: 'Agende y consulte sus citas desde cualquier dispositivo.' },
  { icon: 'file-text', text: 'Su expediente clínico, siempre vinculado a cada atención.' },
  { icon: 'mail', text: 'Confirmaciones y recordatorios automáticos por correo.' },
]

/** Dos columnas para login y registro: formulario a la izquierda y panel institucional a la derecha. */
function AuthLayout() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-lg bg-white/15">
            <Icon name="tooth" size={22} />
          </span>
          <span className="text-lg font-semibold">Clínica Dental</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight">Su clínica, en un solo lugar.</h2>
          <p className="mt-3 text-brand-100">
            Pacientes, odontólogos, servicios y citas con validación de horarios para evitar duplicados.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon name={item.icon} size={16} />
                </span>
                <span className="text-sm text-brand-50">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-200">Proyecto académico · Curso 16-0550</p>
      </aside>
    </div>
  )
}

export default AuthLayout
