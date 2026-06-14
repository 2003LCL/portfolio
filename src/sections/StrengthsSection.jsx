import { STRENGTHS } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import './StrengthsSection.css'

export default function StrengthsSection() {
  const ref = useReveal({ stagger: true, step: 0.08 })

  return (
    <section id="strengths" className="section strengths" ref={ref}>
      <div className="container">
        <div className="section-label reveal">
          <span className="idx">03</span> 个人优势
        </div>

        <div className="strengths__head reveal">
          <h2 className="strengths__title">
            工程实现力 × 产品视角，
            <br />
            两端都能落地。
          </h2>
        </div>

        <div className="strengths__grid">
          {STRENGTHS.map((s) => (
            <article key={s.title} className="scard reveal">
              <div className="scard__icon">{s.icon}</div>
              <h3 className="scard__title">{s.title}</h3>
              <p className="scard__desc">{s.desc}</p>
              <span className="scard__corner" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
