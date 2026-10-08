import type { AppNotification, User } from '@/types'
import { currentUser, notifications } from './mock/fixtures'

export const userService = {
  getCurrentUser(): User {
    return currentUser
  },
  getNotifications(): AppNotification[] {
    return notifications.map((notification) => ({ ...notification }))
  },
}
