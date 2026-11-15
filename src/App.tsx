import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

// Halaman lain dimuat saat dibutuhkan
const Screening = lazy(() => import('./pages/Screening'))
const AIDemo = lazy(() => import('./pages/AIDemo'))
const Chat = lazy(() => import('./pages/Chat'))
const ModelCard = lazy(() => import('./pages/ModelCard'))
const Directory = lazy(() => import('./pages/Directory'))
const Faq = lazy(() => import('./pages/Faq'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={<p className="p-8 text-ink-3" role="status">Memuat...</p>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="skrining" element={<Screening />} />
          <Route path="ai" element={<AIDemo />} />
          <Route path="chat" element={<Chat />} />
          <Route path="faq" element={<Faq />} />
          <Route path="admin" element={<Admin />} />
          <Route path="model-card" element={<ModelCard />} />
          <Route path="direktori" element={<Directory />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
