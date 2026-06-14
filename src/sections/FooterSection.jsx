import { PROFILE } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import './FooterSection.css'

export default function FooterSection() {
  const ref = useReveal({ stagger: true, step: 0.1 })
  const year = 2026

  return (
    <section id="contact" className="footer" ref={ref}>
      <div className="footer__bg" />
      <div className="footer__inner container">
        <div className="footer__main">
          <div className="section-label reveal" style={{ justifyContent: 'center' }}>
            <span className="idx">04</span> 联系方式
          </div>

          <h2 className="footer__headline reveal">
            一起把好想法
            <br />
            <span className="footer__headline-accent">变成好产品。</span>
          </h2>

          <p className="footer__sub reveal">
            正在寻找 AI / 机器人 / To B 方向的产品经理机会，欢迎随时联系。
          </p>

          <a href={PROFILE.emailUrl} target="_blank" rel="noopener noreferrer" className="footer__cta reveal">
            <span>{PROFILE.email}</span>
            <span className="footer__cta-arrow">→</span>
          </a>

          <div className="footer__contacts reveal">
            <FooterLink label="GitHub" value={PROFILE.githubLabel} href={PROFILE.github} external />
            <span className="footer__divider" />
            <FooterLink label="电话" value={PROFILE.phone} href={`tel:${PROFILE.phone.replace(/-/g, '')}`} />
            <span className="footer__divider" />
            <FooterLink label="所在地" value={PROFILE.location} />
          </div>
        </div>

        <div className="footer__bar reveal">
          <span className="footer__copy">
            © {year} {PROFILE.name}. Built with React + Vite.
          </span>
          <button
            className="footer__top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            返回顶部 ↑
          </button>
        </div>
      </div>
    </section>
  )
}

function FooterLink({ label, value, href, external }) {
  const content = (
    <>
      <span className="footer__link-label">{label}</span>
      <span className="footer__link-value">{value}</span>
    </>
  )
  return href ? (
    <a
      className="footer__link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  ) : (
    <div className="footer__link">{content}</div>
  )
}
