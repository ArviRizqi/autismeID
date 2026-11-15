import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'

const linkCls = 'flex min-h-touch items-center text-on-deep'

export function Footer() {
  const { contact } = siteConfig
  const hasContact = Boolean(contact.email || contact.whatsapp)
  return (
    <footer className="on-dark bg-primary-deep text-on-deep print:hidden">
      <div className="mx-auto max-w-site px-gutter pb-8 pt-14">
        <div className="mb-10 flex flex-wrap gap-x-12 gap-y-8">
          <div className="min-w-[min(18rem,100%)] flex-[2_1_18rem]">
            <p className="mb-3 font-display text-[1.625rem] font-semibold text-white">AutismeID</p>
            <p className="max-w-[24rem]">
              Informasi dan dukungan awal untuk keluarga yang memiliki atau mengkhawatirkan perkembangan anak, dengan
              menghormati keberagaman cara berpikir.
            </p>
          </div>
          <nav aria-label="Jelajahi" className="min-w-[min(10rem,100%)] flex-[1_1_10rem]">
            <p className="mb-2 font-bold text-white">Jelajahi</p>
            <Link to="/skrining" className={linkCls}>Skrining</Link>
            <Link to="/#tanda" className={linkCls}>Kenali tanda</Link>
            <Link to="/#mitos" className={linkCls}>Mitos dan fakta</Link>
            <Link to="/direktori" className={linkCls}>Direktori layanan</Link>
          </nav>
          <nav aria-label="Transparansi" className="min-w-[min(10rem,100%)] flex-[1_1_10rem]">
            <p className="mb-2 font-bold text-white">Transparansi</p>
            <Link to="/ai" className={linkCls}>Eksperimen AI</Link>
            <Link to="/model-card" className={linkCls}>Model card</Link>
            <Link to="/chat" className={linkCls}>Tanya AI</Link>
            <Link to="/faq" className={linkCls}>Pertanyaan umum</Link>
          </nav>
          {hasContact && (
            <div className="min-w-[min(12rem,100%)] flex-[1_1_12rem]">
              <p className="mb-2 font-bold text-white">Kontak</p>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className={linkCls}>
                  {contact.email}
                </a>
              )}
              {contact.whatsapp && <p>{contact.whatsapp}</p>}
            </div>
          )}
        </div>
        <div className="space-y-2 border-t border-line-footer pt-5 text-caption">
          <p>Informasi di situs ini bersifat edukasi dan tidak menggantikan konsultasi dengan tenaga kesehatan.</p>
          <p>Dalam keadaan darurat, hubungi 112 atau segera ke IGD terdekat.</p>
          <p>© {siteConfig.year} AutismeID</p>
        </div>
      </div>
    </footer>
  )
}
