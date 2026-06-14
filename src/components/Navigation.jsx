import { useEffect, useState } from 'react'
import { NAV_LINKS, PROFILE } from '../data.js'
import './Navigation.css'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 移动端菜单打开时锁定背景滚动
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // 当前区块高亮
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMove = (e) => {
    e.currentTarget.style.setProperty('--nav-mx', `${e.clientX}px`)
  }

  return (
    <header
      className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menuOpen ? 'nav--menu-open' : ''}`}
      onMouseMove={handleMove}
    >
      <span className="nav__edge" />
      <div className="nav__inner container">
        <a href="#hero" className="nav__logo" onClick={(e) => handleClick(e, 'hero')}>
          <span className="nav__logo-mark">李</span>
          <span className="nav__logo-text">{PROFILE.name}</span>
        </a>

        <nav className="nav__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav__link ${active === link.id ? 'is-active' : ''}`}
              onClick={(e) => handleClick(e, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="nav__cta" onClick={(e) => handleClick(e, 'contact')}>
          <span className="nav__cta-dot" />
          联系我
        </a>

        {/* 移动端汉堡按钮 */}
        <button
          className="nav__burger"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* 移动端全屏菜单 */}
      <div className="nav__mobile" aria-hidden={!menuOpen}>
        <nav className="nav__mobile-links">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav__mobile-link ${active === link.id ? 'is-active' : ''}`}
              style={{ '--i': i }}
              onClick={(e) => handleClick(e, link.id)}
            >
              <span className="nav__mobile-idx">0{i + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <a href={PROFILE.emailUrl} target="_blank" rel="noopener noreferrer" className="nav__mobile-cta" onClick={() => setMenuOpen(false)}>
          {PROFILE.email}
        </a>
      </div>
    </header>
  )
}
