import { SERVICE, PROFILE } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import './ServicePage.css'

export default function ServicePage() {
  const ref = useReveal({ stagger: true, step: 0.08 })

  const handleMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="svc" ref={ref}>
      {/* 顶栏 */}
      <header className="svc-nav">
        <div className="svc-nav__inner container">
          <span className="svc-nav__brand">✦ {SERVICE.brand}</span>
          <a href={PROFILE.emailUrl} target="_blank" rel="noopener noreferrer" className="svc-nav__cta">
            立即咨询
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="svc-hero container">
        <span className="svc-hero__kicker reveal">{SERVICE.heroKicker}</span>
        <h1 className="svc-hero__title reveal">
          {SERVICE.heroTitle.map((line, i) => (
            <span key={i} className={i === 0 ? 'svc-accent' : ''}>
              {line}
              <br />
            </span>
          ))}
        </h1>
        <p className="svc-hero__sub reveal">{SERVICE.heroSub}</p>
        <div className="svc-hero__actions reveal">
          <a href="#svc-plans" className="svc-btn svc-btn--primary">查看套餐 →</a>
          <a href={PROFILE.emailUrl} target="_blank" rel="noopener noreferrer" className="svc-btn svc-btn--ghost">
            联系我
          </a>
        </div>
        <div className="svc-hero__demo reveal">
          <a href="?cases">↗ 看几个做过的案例</a>
        </div>
      </section>

      {/* 痛点 / 为什么 */}
      <section className="svc-sec container">
        <h2 className="svc-sec__title reveal">为谁而做</h2>
        <div className="svc-cards">
          {SERVICE.pains.map((p) => (
            <article key={p.title} className="svc-card reveal" onMouseMove={handleMove}>
              <span className="svc-card__border" />
              <div className="svc-card__icon">{p.icon}</div>
              <h3 className="svc-card__title">{p.title}</h3>
              <p className="svc-card__desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 套餐 */}
      <section className="svc-sec container" id="svc-plans">
        <h2 className="svc-sec__title reveal">套餐与价格</h2>
        <p className="svc-sec__sub reveal">先看效果，满意再付。早期合作，价格从优。</p>
        <div className="svc-plans">
          {SERVICE.plans.map((plan) => (
            <article
              key={plan.name}
              className={`svc-plan reveal ${plan.highlight ? 'svc-plan--hot' : ''}`}
              onMouseMove={handleMove}
            >
              <span className="svc-card__border" />
              {plan.highlight && <span className="svc-plan__badge">最受欢迎</span>}
              <div className="svc-plan__name">{plan.name}</div>
              <div className="svc-plan__price">
                <span className="svc-plan__num">¥{plan.price}</span>
                <span className="svc-plan__unit">起</span>
              </div>
              <div className="svc-plan__desc">{plan.desc}</div>
              <ul className="svc-plan__features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href={PROFILE.emailUrl} target="_blank" rel="noopener noreferrer" className="svc-plan__btn">
                选这个
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* 流程 */}
      <section className="svc-sec container">
        <h2 className="svc-sec__title reveal">下单流程</h2>
        <div className="svc-steps">
          {SERVICE.steps.map((s) => (
            <div key={s.no} className="svc-step reveal">
              <span className="svc-step__no">{s.no}</span>
              <h3 className="svc-step__title">{s.title}</h3>
              <p className="svc-step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="svc-sec container">
        <h2 className="svc-sec__title reveal">常见问题</h2>
        <div className="svc-faqs">
          {SERVICE.faqs.map((f) => (
            <div key={f.q} className="svc-faq reveal">
              <h3 className="svc-faq__q">{f.q}</h3>
              <p className="svc-faq__a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 联系收尾 */}
      <section className="svc-cta container">
        <h2 className="svc-cta__title reveal">聊聊你的需求</h2>
        <p className="svc-cta__note reveal">{SERVICE.contactNote}</p>
        <div className="svc-cta__actions reveal">
          <a href={PROFILE.emailUrl} target="_blank" rel="noopener noreferrer" className="svc-btn svc-btn--primary">
            邮箱联系 →
          </a>
        </div>
        <p className="svc-cta__contact reveal">
          邮箱：{PROFILE.email}
        </p>
      </section>

      <footer className="svc-footer">
        <span>✦ {SERVICE.brand}</span>
        <span>用心做好每一个网页</span>
      </footer>
    </div>
  )
}
