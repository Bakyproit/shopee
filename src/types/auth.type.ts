// chua interface

import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  refresh_token: string
  access_token: string
  expires: string
  user: User
}>
