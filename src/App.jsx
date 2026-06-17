import Navigation from './components/Navigation.jsx'
import Cursor from './components/Cursor.jsx'
import ServicePage from './pages/ServicePage.jsx'
import CaseShowcase from './pages/CaseShowcase.jsx'
import { CASES } from './data.js'
import HeroSection from './sections/HeroSection.jsx'
import AboutSection from './sections/AboutSection.jsx'
import WorksSection from './sections/WorksSection.jsx'
import StrengthsSection from './sections/StrengthsSection.jsx'
import FooterSection from './sections/FooterSection.jsx'

const search = typeof window !== 'undefined' ? window.location.search : ''
// 构建开关：VITE_SITE=service 时，本站是「接单站」，默认首页即接单页（不含个人作品集）
const SITE_SERVICE = import.meta.env.VITE_SITE === 'service'
// ?service 接单页；?cases / ?case= 案例展示；其余为个人作品集
const IS_SERVICE = SITE_SERVICE || /[?&]service\b/.test(search)
const IS_CASES = /[?&]cases?\b/.test(search) || /[?&]case=/.test(search)

// 单个案例：按风格配套不同光标
const caseMatch = search.match(/[?&]case=([\w-]+)/)
const activeCase = caseMatch ? CASES.find((c) => c.id === caseMatch[1]) : null
const CASE_CURSOR = { coffee: 'none', photo: 'crosshair', resume: 'ring' }

// 按页面动态设置标签页标题
if (typeof document !== 'undefined') {
  document.title = IS_CASES
    ? '案例展示 — 光感网页定制'
    : IS_SERVICE
    ? '光感网页定制 — 商家展示 / 个人主页 / 在线简历'
    : '李超立 — AI 产品经理 · 作品集'
}

export default function App() {
  if (IS_CASES) {
    // 案例光标：按当前案例风格选择，并用案例配色
    const variant = activeCase ? CASE_CURSOR[activeCase.id] ?? 'dot' : 'dot'
    return (
      <>
        <Cursor
          variant={variant}
          accent={activeCase?.accent}
          accentRgb={activeCase?.accentRgb}
        />
        <CaseShowcase />
      </>
    )
  }

  if (IS_SERVICE) {
    return (
      <>
        <Cursor />
        <ServicePage />
      </>
    )
  }

  return (
    <>
      <Cursor />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <StrengthsSection />
        <FooterSection />
      </main>
    </>
  )
}
