import { useState } from 'react'
import { ENTITY_STATUS } from '@/constants/appointmentStatus'

let nextTempId = -1

const snapshot = (dentist) => ({
  specialtyId: dentist.specialtyId,
  licenseNumber: dentist.licenseNumber,
  status: dentist.status,
  serviceIds: [...dentist.serviceIds],
  schedules: dentist.schedules.map((item) => ({ ...item })),
  blocks: dentist.blocks.map((item) => ({ ...item })),
})

/**
 * Edición local del perfil de un odontólogo (administración): especialidad, licencia, servicios habilitados,
 * horario semanal y bloqueos. Todo queda en memoria hasta "Guardar".
 *
 * TODO(api): save → dentistsService.update/setServices/setSchedules; addBlock → dentistsService.addBlock
 * (409 si choca con citas: mostrar la lista a reprogramar antes de guardar); removeBlock → dentistsService.removeBlock.
 */
export function useDentistEditor(dentist) {
  const [draft, setDraft] = useState(() => snapshot(dentist))
  const [dirty, setDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const change = (updater) => {
    setDraft((current) => updater(current))
    setDirty(true)
  }

  return {
    draft,
    dirty,
    isSaving,

    setProfile: (field, value) => change((current) => ({ ...current, [field]: value })),

    toggleService: (serviceId) =>
      change((current) => ({
        ...current,
        serviceIds: current.serviceIds.includes(serviceId)
          ? current.serviceIds.filter((id) => id !== serviceId)
          : [...current.serviceIds, serviceId],
      })),

    addSchedule: (dayOfWeek) =>
      change((current) => ({
        ...current,
        schedules: [...current.schedules, { id: nextTempId--, dayOfWeek, startTime: '08:00', endTime: '12:00' }],
      })),

    updateSchedule: (id, field, value) =>
      change((current) => ({
        ...current,
        schedules: current.schedules.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      })),

    removeSchedule: (id) =>
      change((current) => ({ ...current, schedules: current.schedules.filter((item) => item.id !== id) })),

    addBlock: (block) =>
      change((current) => ({ ...current, blocks: [...current.blocks, { id: nextTempId--, ...block }] })),

    removeBlock: (id) => change((current) => ({ ...current, blocks: current.blocks.filter((item) => item.id !== id) })),

    toggleStatus: () =>
      change((current) => ({
        ...current,
        status: current.status === ENTITY_STATUS.ACTIVE ? ENTITY_STATUS.INACTIVE : ENTITY_STATUS.ACTIVE,
      })),

    discard: () => {
      setDraft(snapshot(dentist))
      setDirty(false)
    },

    save: async () => {
      setIsSaving(true)
      try {
        // TODO(api): await Promise.all([dentistsService.update(...), setServices(...), setSchedules(...)])
        setDirty(false)
        return true
      } finally {
        setIsSaving(false)
      }
    },
  }
}
