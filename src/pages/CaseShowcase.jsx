import { CASES } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import './CaseShowcase.css'

function getCaseId() {
  if (typeof window === 'undefined') return null
  const m = window.location.search.match(/[?&]case=([\w-]+)/)
  return m ? m[1] : null
}

export default function CaseShowcase() {
  const id = getCaseId()
  const item = CASES.find((c) => c.id === id)
  if (item) return <CaseDetail item={item} />
  return <CaseGallery />
}

/* ===================== 画廊 ===================== */
function CaseGallery() {
  const ref = useReveal({ stagger: true, step: 0.08 })

  return (
    <div className="csg" ref={ref}>
      <header className="csg-top">
        <a href="?service" className="csg-back">← 返回</a>
        <span className="csg-mark">案例</span>
      </header>

      <section className="csg-hero">
        <h1 className="csg-hero__title reveal">三种风格，三个样子</h1>
        <p className="csg-hero__sub reveal">
          每个网页都按你的行业与气质单独设计。下面是三套不同方向的样板，点进去感受差别。
        </p>
      </section>

      <section className="csg-list">
        {CASES.map((c) => (
          <a
            key={c.id}
            href={`?case=${c.id}`}
            className="csg-item reveal"
            style={{ '--c': c.accent, '--paper': c.paper, '--ink': c.ink }}
          >
            <div className="csg-item__chip">{c.styleName}</div>
            <div className="csg-item__brand">{c.brand}</div>
            <div className="csg-item__industry">{c.industry}</div>
            <div className="csg-item__go">查看 →</div>
          </a>
        ))}
      </section>

      <footer className="csg-foot">以上均为虚构样板，仅供展示</footer>
    </div>
  )
}

/* ===================== 详情：按 style 分派 ===================== */
function CaseDetail({ item }) {
  const Layout =
    item.style === 'editorial' ? EditorialCase : item.style === 'bold' ? BoldCase : PersonaCase
  return <Layout c={item} />
}

function BackBar({ light }) {
  return (
    <div className={`cd-back ${light ? 'cd-back--light' : ''}`}>
      <a href="?cases">← 全部案例</a>
      <a href="?service" className="cd-back__cta">想做一个 →</a>
    </div>
  )
}

/* —— 风格一：杂志留白风（咖啡馆）—— */
function EditorialCase({ c }) {
  const ref = useReveal({ stagger: true, step: 0.1 })
  return (
    <div
      className="ed"
      ref={ref}
      style={{ '--c': c.accent, '--paper': c.paper, '--ink': c.ink }}
    >
      <BackBar />
      <div className="ed-wrap">
        {/* 封面 */}
        <div className="ed-issue reveal">{c.issue}</div>
        <h1 className="ed-headline reveal">{c.headline}</h1>
        <p className="ed-lede reveal">{c.lede}</p>

        <div className="ed-rule reveal" />

        {/* 速览三栏 */}
        <div className="ed-cols">
          {c.columns.map((col) => (
            <div key={col.k} className="ed-col reveal">
              <div className="ed-col__k">{col.k}</div>
              <div className="ed-col__v">{col.v}</div>
            </div>
          ))}
        </div>

        {/* 关于本店 */}
        <div className="ed-section reveal">
          <span className="ed-section__label">关于本店</span>
        </div>
        <div className="ed-story">
          {c.story.map((p, i) => (
            <p key={i} className="ed-story__p reveal">{p}</p>
          ))}
        </div>

        <blockquote className="ed-quote reveal">{c.quote}</blockquote>

        {/* 本周豆单 */}
        <div className="ed-section reveal">
          <span className="ed-section__label">本周豆单</span>
        </div>
        <div className="ed-beans">
          {c.beans.map((b) => (
            <div key={b.origin} className="ed-bean reveal">
              <div className="ed-bean__origin">{b.origin}</div>
              <div className="ed-bean__note">{b.note}</div>
              <div className="ed-bean__roast">{b.roast}</div>
            </div>
          ))}
        </div>

        {/* 菜单 */}
        <div className="ed-section reveal">
          <span className="ed-section__label">饮品 & 烘焙</span>
        </div>
        <div className="ed-menu">
          {c.menu.map((m) => (
            <div key={m.name} className="ed-menu__row">
              <span className="ed-menu__name">{m.name}</span>
              <span className="ed-menu__dots" />
              <span className="ed-menu__price">{m.price}</span>
            </div>
          ))}
        </div>

        {/* 营业时间 */}
        <div className="ed-section reveal">
          <span className="ed-section__label">营业时间</span>
        </div>
        <div className="ed-hours">
          {c.hours.map((h) => (
            <div key={h.d} className="ed-hours__row reveal">
              <span>{h.d}</span>
              <span className="ed-hours__t">{h.t}</span>
            </div>
          ))}
        </div>

        <div className="ed-addr reveal">{c.addr}</div>
        <div className="ed-sign reveal">{c.brand}</div>
      </div>
      <FootTag />
    </div>
  )
}

/* —— 风格二：大字潮流风（摄影）—— */
function BoldCase({ c }) {
  const ref = useReveal({ stagger: true, step: 0.08 })
  return (
    <div
      className="bd"
      ref={ref}
      style={{ '--c': c.accent, '--paper': c.paper, '--ink': c.ink }}
    >
      <BackBar light />
      <div className="bd-hero">
        <div className="bd-bigword reveal">{c.bigword}</div>
        <div className="bd-tagline reveal">{c.tagline}</div>
        <p className="bd-intro reveal">{c.intro}</p>
      </div>

      <div className="bd-marquee">
        <span>{c.marquee}{c.marquee}</span>
      </div>

      <div className="bd-stats">
        {c.stats.map((s) => (
          <div key={s.l} className="bd-stat reveal">
            <div className="bd-stat__n">{s.n}</div>
            <div className="bd-stat__l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* 作品方向 大图块 */}
      <div className="bd-works">
        {c.works.map((w) => (
          <div key={w.title} className="bd-work reveal">
            <div className="bd-work__art" />
            <div className="bd-work__body">
              <span className="bd-work__tag">{w.tag}</span>
              <h3 className="bd-work__title">{w.title}</h3>
              <p className="bd-work__desc">{w.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 服务清单（hover 整行变色）*/}
      <div className="bd-services">
        {c.services.map((s, i) => (
          <div key={s} className="bd-serv reveal">
            <span className="bd-serv__no">0{i + 1}</span>
            <span className="bd-serv__name">{s}</span>
            <span className="bd-serv__arrow">↗</span>
          </div>
        ))}
      </div>

      {/* 拍摄流程 */}
      <div className="bd-process">
        {c.process.map((p) => (
          <div key={p.no} className="bd-proc reveal">
            <span className="bd-proc__no">{p.no}</span>
            <h4 className="bd-proc__t">{p.t}</h4>
            <p className="bd-proc__d">{p.d}</p>
          </div>
        ))}
      </div>

      {/* 套餐 */}
      <div className="bd-packs">
        {c.packs.map((p) => (
          <div key={p.name} className="bd-pack reveal">
            <div className="bd-pack__name">{p.name}</div>
            <div className="bd-pack__price">{p.price}</div>
            <ul className="bd-pack__items">
              {p.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="bd-closing reveal">{c.closing}</div>
      <FootTag dark />
    </div>
  )
}

/* —— 风格三：个人品牌风（深色、大字开场、滚动叙事）—— */
function PersonaCase({ c }) {
  const ref = useReveal({ stagger: true, step: 0.08 })
  return (
    <div
      className="ps"
      ref={ref}
      style={{ '--c': c.accent, '--accent-rgb': c.accentRgb, '--paper': c.paper, '--ink': c.ink }}
    >
      <BackBar light />

      {/* 开场 */}
      <section className="ps-hero">
        <div className="ps-hero__glow" />
        <div className="ps-hero__name reveal">{c.name}　/　{c.role}</div>
        <h1 className="ps-hero__title">
          <span className="reveal">{c.heroLine1}</span>
          <span className="reveal ps-hero__accent">{c.heroLine2}</span>
        </h1>
        <p className="ps-hero__sub reveal">{c.heroSub}</p>
        <div className="ps-hero__loc reveal">
          <span className="ps-hero__dot" />
          {c.location}
        </div>
      </section>

      {/* 数据条 */}
      <section className="ps-stats">
        {c.stats.map((s) => (
          <div key={s.l} className="ps-stat reveal">
            <div className="ps-stat__n">{s.n}</div>
            <div className="ps-stat__l">{s.l}</div>
          </div>
        ))}
      </section>

      {/* 关于 */}
      <section className="ps-about">
        <span className="ps-label reveal">关于我</span>
        <p className="ps-about__text reveal">{c.about}</p>
        <div className="ps-skills">
          {c.skillGroups.map((sg) => (
            <div key={sg.g} className="ps-skillgroup reveal">
              <span className="ps-skillgroup__g">{sg.g}</span>
              <div className="ps-skillgroup__items">
                {sg.items.map((it) => <span key={it} className="ps-tag">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 经历 */}
      <section className="ps-exp-sec">
        <span className="ps-label reveal">实习经历</span>
        {c.experience.map((e) => (
          <div key={e.org} className="ps-exp reveal">
            <div className="ps-exp__time">{e.time}</div>
            <div className="ps-exp__body">
              <h3 className="ps-exp__org">{e.org}</h3>
              <div className="ps-exp__role">{e.role}</div>
              <p className="ps-exp__desc">{e.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 项目 */}
      <section className="ps-proj-sec">
        <span className="ps-label reveal">代表项目</span>
        <div className="ps-projs">
          {c.projects.map((p) => (
            <article key={p.title} className="ps-proj reveal">
              <span className="ps-proj__no">{p.no}</span>
              <div className="ps-proj__main">
                <div className="ps-proj__head">
                  <h3 className="ps-proj__title">{p.title}</h3>
                  <span className="ps-proj__tag">{p.tag}</span>
                </div>
                <p className="ps-proj__desc">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 收尾 + 联系 */}
      <section className="ps-end">
        <h2 className="ps-end__title reveal">{c.closing}</h2>
        <div className="ps-end__contacts reveal">
          <span>{c.contact.phone}</span>
          <span>{c.contact.email}</span>
          <span>微信 {c.contact.wechat}</span>
        </div>
      </section>

      <FootTag dark />
    </div>
  )
}

function FootTag({ dark }) {
  return (
    <div className={`cd-foottag ${dark ? 'cd-foottag--dark' : ''}`}>
      <span>虚构样板，仅供展示效果</span>
      <a href="?service">← 我也想做一个</a>
    </div>
  )
}
