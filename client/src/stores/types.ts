export interface User {
  fullname: string
  email: string
  password?: string
  passwordConfirm?: string
}

export enum Color {
  danger = 'danger'
}

export interface Asset {
  plotCoordinate: string
  city: string
  state: string
}
