// Reglas de los formularios de cuentas, en el formato de React Hook Form: register('campo', regla).
// Son las mismas del API (DTOs/Auth/ValidationPatterns.cs, LoginRequest.cs y RegisterPatientRequest.cs).
// Si cambian allá, hay que cambiarlas aquí; el API siempre vuelve a validar.

import { todayInClinic } from '@/utils/clinicTime'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 8 a 72 caracteres, con al menos una letra y un número
const PASSWORD_PATTERN = /^(?=.*[A-Za-zÁÉÍÓÚÑáéíóúñ])(?=.*\d).{8,72}$/
// 5 a 30 caracteres (letras, números y guiones), con al menos 5 letras o números
const IDENTIFICATION_PATTERN = /^(?=(?:-*[A-Za-z0-9]){5})[A-Za-z0-9-]{5,30}$/
const PHONE_PATTERN = /^[0-9+\-\s()]{7,30}$/

const trimmed = (value) => (typeof value === 'string' ? value.trim() : value)

const email = {
  required: 'El correo es obligatorio.',
  maxLength: { value: 255, message: 'El correo no puede superar los 255 caracteres.' },
  validate: (value) => EMAIL_PATTERN.test(trimmed(value)) || 'El correo no es válido.',
}

export const loginRules = {
  email,
  // En el login no se valida el formato de la contraseña: solo importa si coincide
  password: { required: 'La contraseña es obligatoria.' },
}

export const registerRules = {
  fullName: {
    required: 'El nombre es obligatorio.',
    validate: (value) => {
      const length = trimmed(value).length
      return (length >= 3 && length <= 150) || 'El nombre debe tener entre 3 y 150 caracteres.'
    },
  },
  identification: {
    required: 'La identificación es obligatoria.',
    validate: (value) =>
      IDENTIFICATION_PATTERN.test(trimmed(value)) ||
      'La identificación debe tener entre 5 y 30 caracteres (letras, números y guiones), con al menos 5 letras o números.',
  },
  email,
  password: {
    required: 'La contraseña es obligatoria.',
    pattern: {
      value: PASSWORD_PATTERN,
      message: 'La contraseña debe tener entre 8 y 72 caracteres, con al menos una letra y un número.',
    },
  },
  // Solo existe en el formulario; no se envía al API
  confirmPassword: {
    required: 'Confirme la contraseña.',
    validate: (value, form) => value === form.password || 'Las contraseñas no coinciden.',
  },
  phone: {
    validate: (value) =>
      !trimmed(value) ||
      PHONE_PATTERN.test(trimmed(value)) ||
      'El teléfono solo puede tener números, espacios, +, - y paréntesis (7 a 30 caracteres).',
  },
  birthDate: {
    // El <input type="date"> entrega "AAAA-MM-DD", que se puede comparar como texto
    // "Hoy" es el día de Costa Rica, no el del navegador (el API compara con su propia fecha)
    validate: (value) => !value || value <= todayInClinic() || 'La fecha de nacimiento no puede estar en el futuro.',
  },
  emergencyContact: {
    maxLength: { value: 200, message: 'El contacto de emergencia no puede superar los 200 caracteres.' },
  },
  acceptsDataConsent: {
    required: 'Debe aceptar el tratamiento de sus datos personales.',
  },
}
