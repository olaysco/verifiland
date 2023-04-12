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

type Land = {
  land_id: number
  is_govt_approved: boolean
  ipfsHash: string
  current_owner: string
  previous_owners: string[]
  created_at: number
  approved_at: number
  [index: number]: string | boolean | number
}

export type { Land }
