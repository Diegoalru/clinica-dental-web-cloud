import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { canRoleAccess, resolvePostLoginDestination } from './routeAccess.js'

describe('canRoleAccess', () => {
  it('limita cada área a sus roles', () => {
    assert.equal(canRoleAccess('/citas/agendar', 'PATIENT'), true)
    assert.equal(canRoleAccess('/citas/agendar', 'RECEPTIONIST'), false)
    assert.equal(canRoleAccess('/citas', 'DENTIST'), false)
    assert.equal(canRoleAccess('/servicios', 'ADMIN'), false)
    assert.equal(canRoleAccess('/recepcion/agenda', 'ADMIN'), true)
    assert.equal(canRoleAccess('/recepcion/citas/1024', 'RECEPTIONIST'), true)
    assert.equal(canRoleAccess('/recepcion/agenda', 'PATIENT'), false)
    assert.equal(canRoleAccess('/odontologo/citas/1024', 'DENTIST'), true)
    assert.equal(canRoleAccess('/odontologo/agenda', 'ADMIN'), false)
    assert.equal(canRoleAccess('/admin/usuarios', 'ADMIN'), true)
    assert.equal(canRoleAccess('/admin/usuarios', 'RECEPTIONIST'), false)
  })

  it('deja abiertas las rutas comunes a cualquier rol', () => {
    for (const role of ['PATIENT', 'RECEPTIONIST', 'DENTIST', 'ADMIN']) {
      assert.equal(canRoleAccess('/inicio', role), true)
      assert.equal(canRoleAccess('/perfil', role), true)
    }
  })

  it('ignora la query y no confunde prefijos parecidos', () => {
    assert.equal(canRoleAccess('/citas?estado=PENDING', 'DENTIST'), false)
    assert.equal(canRoleAccess('/citas?estado=PENDING', 'PATIENT'), true)
    // "/administracion" no es el área "/admin"
    assert.equal(canRoleAccess('/administracion', 'PATIENT'), true)
  })
})

describe('resolvePostLoginDestination', () => {
  it('respeta el destino cuando el rol puede abrirlo', () => {
    assert.equal(resolvePostLoginDestination('/citas/agendar', 'PATIENT'), '/citas/agendar')
    assert.equal(resolvePostLoginDestination('/recepcion/citas/1024?tab=logs', 'ADMIN'), '/recepcion/citas/1024?tab=logs')
    assert.equal(resolvePostLoginDestination('/perfil', 'DENTIST'), '/perfil')
  })

  it('envía al inicio cuando el destino es de otro rol', () => {
    // Botón "Agendar cita" de la portada usado por personal de la clínica
    assert.equal(resolvePostLoginDestination('/citas/agendar', 'RECEPTIONIST'), '/inicio')
    assert.equal(resolvePostLoginDestination('/citas/agendar', 'ADMIN'), '/inicio')
    // Un paciente cerró sesión en /citas y luego entra un odontólogo en la misma pestaña
    assert.equal(resolvePostLoginDestination('/citas', 'DENTIST'), '/inicio')
    assert.equal(resolvePostLoginDestination('/admin/reportes', 'PATIENT'), '/inicio')
  })

  it('envía al inicio sin destino o con uno que no sirve', () => {
    assert.equal(resolvePostLoginDestination(undefined, 'PATIENT'), '/inicio')
    assert.equal(resolvePostLoginDestination('/acceso-denegado', 'PATIENT'), '/inicio')
    assert.equal(resolvePostLoginDestination('/login', 'PATIENT'), '/inicio')
    assert.equal(resolvePostLoginDestination('https://otro-sitio.example', 'PATIENT'), '/inicio')
  })
})
