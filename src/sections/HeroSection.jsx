import { useEffect, useRef } from 'react'
import { PROFILE } from '../data.js'
import './HeroSection.css'

export default function HeroSection() {
  const titleRef = useRef(null)

  // 标题逐词入场
  useEffect(() => {
    const words = titleRef.current?.querySelectorAll('.hero__word')
    words?.forEach((w, i) => {
      w.style.transitionDelay = `${0.5 + i * 0.09}s`
      requestAnimationFrame(() => w.classList.add('is-in'))
    })
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="hero">
      {/* —— 背景层：后续可替换为 <video> —— */}
      <div className="hero__bg">
        {/*
          替换为真实视频时，取消下面注释并删除 .hero__bg-fx：
          <video className="hero__video" autoPlay muted loop playsInline poster="">
            <source src="/hero-bg.webm" type="video/webm" />
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        */}
        <div className="hero__bg-fx" />
        <Particles />
        <div className="hero__bg-grid" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content container">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <span className="hero__eyebrow-text">杭州电子科技大学信息工程学院</span>
          <span className="hero__eyebrow-sep" />
          <span className="hero__eyebrow-text">自动化专业-机器人方向</span>
          <span className="hero__eyebrow-sep" />
          <span className="hero__eyebrow-text">2026 届</span>
        </div>

        <h1 className="hero__title" ref={titleRef}>
          <span className="hero__line">
            <span className="hero__word">AI</span>{' '}
            <span className="hero__word hero__word--accent">产品经理</span>
          </span>
          <span className="hero__line">
            <span className="hero__word">/</span>{' '}
            <span className="hero__word">AI</span>{' '}
            <span className="hero__word">设计师</span>
          </span>
        </h1>

        <p className="hero__subtitle">
          以 Vibe Coding 驱动 AI 产品从 0 到 1 的落地——
          <br />
          把模糊的需求，转译为可交付的产品体验。
        </p>

        <div className="hero__actions">
          <button className="btn-primary" onClick={() => scrollTo('works')}>
            查看项目
            <span className="btn-primary__arrow">→</span>
          </button>
          <button className="btn-ghost" onClick={() => scrollTo('contact')}>
            联系我
          </button>
        </div>
      </div>

      <button className="hero__scroll" onClick={() => scrollTo('about')} aria-label="向下滚动">
        <span className="hero__scroll-text">SCROLL</span>
        <span className="hero__scroll-line" />
      </button>
    </section>
  )
}

/* 轻量粒子层 —— 纯 canvas，缓慢漂浮；离开视口时暂停以避免滚动卡顿 */
function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = null
    let running = false
    let w, h, dpr
    const dots = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const COUNT = Math.min(72, Math.floor((w * h) / 22000))
    for (let i = 0; i < COUNT; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.5 + 0.15,
      })
    }

    const LINK = 132 // 连线距离阈值
    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // 邻近粒子间连线，形成星座网络
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = dx * dx + dy * dy
          if (dist < LINK * LINK) {
            const o = (1 - Math.sqrt(dist) / LINK) * 0.16
            ctx.strokeStyle = `rgba(201, 183, 141, ${o})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = w
        if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h
        if (d.y > h) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 183, 141, ${d.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (!running) {
        running = true
        draw()
      }
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = null
    }

    // 仅在 Hero 可见时运行动画
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(canvas)

    window.addEventListener('resize', resize)
    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__particles" />
}
