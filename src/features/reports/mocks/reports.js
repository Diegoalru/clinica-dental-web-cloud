// DATOS DE EJEMPLO: sustituir por reportsService.summary(filters) cuando exista el endpoint.
export const reportSummary = {
  period: { from: '2026-10-01', to: '2026-10-31' },
  total: 148,
  previousDeltaPercent: 6,
  completed: 112,
  cancelled: 21,
  noShow: 15,
  weekly: [
    { label: 'Sem 1', completed: 24, cancelled: 4, noShow: 2 },
    { label: 'Sem 2', completed: 27, cancelled: 5, noShow: 4 },
    { label: 'Sem 3', completed: 22, cancelled: 3, noShow: 3 },
    { label: 'Sem 4', completed: 29, cancelled: 6, noShow: 4 },
    { label: 'Sem 5', completed: 10, cancelled: 3, noShow: 2 },
  ],
  byDentist: [
    { dentistId: 1, name: 'Dra. Laura Mora', completed: 48, cancelled: 8, noShow: 6 },
    { dentistId: 2, name: 'Dr. Carlos Vargas', completed: 37, cancelled: 7, noShow: 5 },
    { dentistId: 3, name: 'Dr. Andrés Quesada', completed: 27, cancelled: 6, noShow: 4 },
  ],
  byService: [
    { serviceId: 1, name: 'Limpieza dental', count: 61 },
    { serviceId: 2, name: 'Valoración general', count: 42 },
    { serviceId: 3, name: 'Resina / calza', count: 25 },
    { serviceId: 4, name: 'Control de ortodoncia', count: 14 },
    { serviceId: 6, name: 'Extracción simple', count: 6 },
  ],
}
