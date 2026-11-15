import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollManager } from './ScrollManager'

export function Layout() {
  return (
    <>
      <a
        href="#konten"
        className="absolute left-2 top-2 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 font-semibold text-white focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <ScrollManager />
      <Header />
      <main id="konten" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
