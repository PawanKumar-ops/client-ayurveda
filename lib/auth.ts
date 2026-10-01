const PW_KEY = 'yubhi-admin-pw'
const SESSION_KEY = 'yubhi-admin-session'
export const ADMIN_EMAIL = 'admin@co.in'

const getPassword = () => typeof window === 'undefined' ? '123456' : localStorage.getItem(PW_KEY) ?? '123456'

export const auth = {
  isAuthed: () => typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1',
  login(email: string, password: string) {
    const ok = email.trim().toLowerCase() === ADMIN_EMAIL && password === getPassword()
    if (ok && typeof window !== 'undefined') sessionStorage.setItem(SESSION_KEY, '1')
    return ok
  },
  logout: () => { if (typeof window !== 'undefined') sessionStorage.removeItem(SESSION_KEY) },
  changePassword(current: string, next: string) {
    if (current !== getPassword()) return false
    if (typeof window !== 'undefined') localStorage.setItem(PW_KEY, next)
    return true
  },
}
