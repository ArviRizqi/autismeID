/**
 * Unggahan lewat proxy Vercel dibatasi sekitar 4,5 MB. Foto ponsel sering lebih besar, jadi foto di atas
 * ambang diperkecil di browser (sisi terpanjang 2000 px, JPEG kualitas 0,92). Model sendiri memperkecil
 * gambar ke ukuran masukannya, dan MTCNN bekerja baik pada resolusi ini.
 */
export const UPLOAD_SHRINK_ABOVE_BYTES = 3_500_000
const MAX_SIDE = 2000

export function targetSize(w: number, h: number, maxSide = MAX_SIDE): { w: number; h: number } {
  const scale = Math.min(1, maxSide / Math.max(w, h))
  return { w: Math.max(1, Math.round(w * scale)), h: Math.max(1, Math.round(h * scale)) }
}

export async function prepareUpload(file: File): Promise<File> {
  if (file.size <= UPLOAD_SHRINK_ABOVE_BYTES || typeof createImageBitmap !== 'function') return file
  try {
    const bitmap = await createImageBitmap(file)
    const { w, h } = targetSize(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (blob && blob.size < file.size) return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    /* format tidak bisa didekode di browser: kirim apa adanya */
  }
  return file
}
