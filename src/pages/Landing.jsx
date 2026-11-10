const features = [
  {
    title: 'Agenda de citas',
    text: 'Reserva con validación de horarios, bloqueos y citas existentes para evitar duplicados.',
  },
  {
    title: 'Expediente clínico',
    text: 'Diagnóstico, tratamiento y notas de cada atención vinculados a la cita.',
  },
  {
    title: 'Recordatorios por correo',
    text: 'Confirmaciones y recordatorios automáticos para mejorar la asistencia.',
  },
]

function Landing() {
  return (
    <>
      <section className="bg-sky-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Gestión simple para tu clínica dental
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Pacientes, odontólogos, servicios y citas en un solo lugar, accesible
            desde cualquier dispositivo.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              disabled
              className="rounded-md bg-sky-600 px-5 py-2.5 font-medium text-white opacity-60"
            >
              Agendar cita
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-lg border border-slate-200 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900">{f.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{f.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Landing
