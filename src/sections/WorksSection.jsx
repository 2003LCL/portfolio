import { useState } from 'react'
import { PROJECTS } from '../data.js'
import { useReveal } from '../hooks/useReveal.js'
import ProjectArt from '../components/ProjectArt.jsx'
import Modal from '../components/Modal.jsx'
import './WorksSection.css'

export default function WorksSection() {
  const ref = useReveal({ stagger: true, step: 0.12 })
  const [active, setActive] = useState(null)

  return (
    <section id="works" className="section works" ref={ref}>
      <div className="container">
        <div className="section-label reveal">
          <span className="idx">02</span> 精选项目
        </div>

        <div className="works__head reveal">
          <h2 className="works__title">
            从算法到产品，
            <br />
            完整经历每一次 0 到 1。
          </h2>
        </div>

        <div className="works__grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} featured={i === 0} onOpen={() => setActive(p)} />
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} label={active?.name || ''}>
        {active && <ProjectDetail project={active} />}
      </Modal>
    </section>
  )
}

function ProjectCard({ project, featured, onOpen }) {
  return (
    <article
      className={`pcard reveal ${featured ? 'pcard--featured' : ''}`}
      data-id={project.id}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
    >
      <div className="pcard__visual">
        <div className={`pcard__art pcard__art--${project.id}`} />
        <div className="pcard__svg-wrap">
          <ProjectArt id={project.id} />
        </div>
        <div className="pcard__grid-overlay" />
        <span className="pcard__index">{project.index}</span>
        <div className="pcard__period">{project.period}</div>
      </div>

      <div className="pcard__info">
        <div className="pcard__role">{project.role}</div>
        <h3 className="pcard__name">{project.name}</h3>
        <p className="pcard__summary">{project.summary}</p>

        <div className="pcard__metric">{project.metric}</div>

        <div className="pcard__tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <span className="pcard__more">
          查看项目详情 <span className="pcard__more-arrow">→</span>
        </span>
      </div>
    </article>
  )
}

/* 项目详情弹层 */
function ProjectDetail({ project }) {
  const d = project.detail || {}
  return (
    <div className="pdetail">
      <div className="pdetail__head">
        <div className="pdetail__top">
          <span className="pdetail__index">{project.index}</span>
          <span className="pdetail__period">{project.period}</span>
        </div>
        <h3 className="pdetail__name">{project.name}</h3>
        <div className="pdetail__role">{project.role}</div>
      </div>

      <div className="pdetail__visual">
        <div className={`pcard__art pcard__art--${project.id}`} />
        <div className="pcard__svg-wrap">
          <ProjectArt id={project.id} />
        </div>
        <div className="pcard__grid-overlay" />
        <div className="pdetail__metric">{project.metric}</div>
      </div>

      {d.overview && (
        <div className="pdetail__block">
          <span className="pdetail__label">项目概述</span>
          <p className="pdetail__overview">{d.overview}</p>
        </div>
      )}

      {d.highlights && (
        <div className="pdetail__block">
          <span className="pdetail__label">核心工作</span>
          <ul className="pdetail__points">
            {d.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {d.stack && (
        <div className="pdetail__block">
          <span className="pdetail__label">技术 / 方法</span>
          <div className="pdetail__stack">
            {d.stack.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
