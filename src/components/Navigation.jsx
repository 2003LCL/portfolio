import { useEffect, useState } from 'react'
import { NAV_LINKS, PROFILE } from '../data.js'
import './Navigation.css'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
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

        <a
          href={`mailto:${PROFILE.email}`}
          className="nav__cta"
        >
          <span className="nav__cta-dot" />
          联系我
        </a>
      </div>
    </header>
  )
}
