/**
 * localStorage bisa melempar error (mode privat, data situs diblokir).
 * Semua akses dibungkus agar halaman tetap berfungsi tanpa penyimpanan.
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* abaikan */
  }
}
