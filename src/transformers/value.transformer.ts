import { isDateString, isNumber, isNumberString } from 'class-validator'

export function unknownToNumber(value: unknown): number | unknown {
  return isNumberString(value) ? Number(value) : value
}

export function numberToBoolean(value: number): boolean | number {
  return isNumber(value, {
    allowNaN: false,
    allowInfinity: false,
  })
    ? Boolean(value)
    : value
}

export function unknownToDate(value: unknown): Date | unknown {
  return isDateString(value) ? new Date(value as string) : value
}
