import { useEffect, useRef, useState } from 'react'
import { PROFILE, STATS, AWARDS, INTERNSHIPS } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import Modal from '../components/Modal.jsx'
import './AboutSection.css'

const DETAILS = { awards: AWARDS, internships: INTERNSHIPS }

export default function AboutSection() {
  const ref = useReveal({ stagger: true, step: 0.1 })
  const [openKey, setOpenKey] = useState(null)

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container">
        <div className="section-label reveal">
          <span className="idx">01</span> 关于我
        </div>

        <div className="about__grid">
          {/* —— 左：标题 + 意向 —— */}
          <div className="about__head reveal">
            <h2 className="about__name">
              {PROFILE.name}
              <span className="about__role">{PROFILE.title}</span>
            </h2>
            <div className="about__tag">
              <span className="about__dot" />
              开放工作机会 · {PROFILE.intent}
            </div>
          </div>

          {/* —— 右：介绍 + 联系 —— */}
          <div className="about__body">
            <p className="about__intro reveal">{PROFILE.intro}</p>
            <p className="about__intro about__intro--dim reveal">{PROFILE.intro2}</p>

            <div className="about__contact reveal">
              <ContactItem label="求职意向" value={PROFILE.intent} />
              <ContactItem label="所在地" value={PROFILE.location} />
              <ContactItem label="邮箱" value={PROFILE.email} href={`mailto:${PROFILE.email}`} />
              <ContactItem label="电话" value={PROFILE.phone} href={`tel:${PROFILE.phone.replace(/-/g, '')}`} />
            </div>
          </div>
        </div>

        {/* —— 数据指标 —— */}
        <div className="about__stats reveal">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} onOpen={s.detailKey ? () => setOpenKey(s.detailKey) : null} />
          ))}
        </div>
      </div>

      <Modal open={!!openKey} onClose={() => setOpenKey(null)} label={openKey ? DETAILS[openKey].title : ''}>
        {openKey && <DetailContent data={DETAILS[openKey]} type={openKey} />}
      </Modal>
    </section>
  )
}

/* 弹层内容 —— 竞赛列表 / 实习时间线 */
function DetailContent({ data, type }) {
  return (
    <div className="detail">
      <div className="detail__head">
        <span className="detail__kicker">{type === 'awards' ? 'AWARDS' : 'EXPERIENCE'}</span>
        <h3 className="detail__title">{data.title}</h3>
        <p className="detail__subtitle">{data.subtitle}</p>
      </div>

      {type === 'awards' ? (
        <ul className="award-list">
          {data.items.map((it, i) => (
            <li className="award-item" key={i}>
              <span className="award-item__no">{String(i + 1).padStart(2, '0')}</span>
              <div className="award-item__body">
                <span className="award-item__name">{it.name}</span>
                <span className="award-item__year">{it.year}</span>
              </div>
              <span className="award-item__award">{it.award}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="intern-list">
          {data.items.map((it, i) => (
            <article className="intern-item" key={i}>
              <div className="intern-item__top">
                <h4 className="intern-item__company">{it.company}</h4>
                <span className="intern-item__period">{it.period}</span>
              </div>
              <div className="intern-item__role">{it.role}</div>
              <p className="intern-item__summary">{it.summary}</p>
              <ul className="intern-item__points">
                {it.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactItem({ label, value, href }) {
  const inner = (
    <>
      <span className="about__contact-label">{label}</span>
      <span className="about__contact-value">{value}</span>
    </>
  )
  return href ? (
    <a className="about__contact-item about__contact-item--link" href={href}>
      {inner}
    </a>
  ) : (
    <div className="about__contact-item">{inner}</div>
  )
}

/* 数字递增计数 */
function StatCard({ value, suffix, label, onOpen }) {
  const [display, setDisplay] = useState(0)
  const elRef = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = elRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            const duration = 1400
            const t0 = performance.now()
            const tick = (now) => {
              const p = Math.min((now - t0) / duration, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              setDisplay(Math.round(eased * value))
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  const clickable = !!onOpen
  return (
    <div
      className={`stat${clickable ? ' stat--clickable' : ''}`}
      ref={elRef}
      onClick={onOpen || undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onOpen() : undefined}
    >
      <div className="stat__value">
        {display}
        <span className="stat__suffix">{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
      {clickable && <span className="stat__more">查看详情 →</span>}
    </div>
  )
}
