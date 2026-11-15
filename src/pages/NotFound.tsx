import { Button } from '../components/ui/Button'
import { Page } from '../components/ui/Section'

export default function NotFound() {
  return (
    <Page width="narrow">
      <h1 className="mb-3 text-h1 text-primary">Halaman tidak ditemukan</h1>
      <p className="mb-6 text-lead text-ink-2">Alamat yang Anda buka tidak ada atau sudah dipindahkan.</p>
      <Button to="/">Kembali ke beranda</Button>
    </Page>
  )
}
