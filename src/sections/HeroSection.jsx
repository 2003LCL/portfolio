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
      {/* —— 背景层：纯 CSS 光晕氛围，GPU 合成，不占主线程 —— */}
      <div className="hero__bg">
        <div className="hero__bg-fx" />
        <div className="hero__aurora" aria-hidden="true">
          <span className="hero__orb hero__orb--1" />
          <span className="hero__orb hero__orb--2" />
        </div>
        <Particles />
        <div className="hero__bg-grid" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content container">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <span className="hero__eyebrow-text">{PROFILE.school}</span>
          <span className="hero__eyebrow-sep" />
          <span className="hero__eyebrow-text">{PROFILE.major}</span>
          <span className="hero__eyebrow-sep" />
          <span className="hero__eyebrow-text">{PROFILE.grad}</span>
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

/* 轻量粒子层 —— canvas 缓慢漂浮 + 邻近连线。
   已优化：限帧 40fps、距离平方比较省去 sqrt、离开视口暂停。
   注意：背景不再叠 blur 滤镜，所以粒子开销才是可接受的。 */
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

    const COUNT = Math.min(72, Math.floor((w * h) / 24000))
    for (let i = 0; i < COUNT; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.9,
        a: Math.random() * 0.45 + 0.45,
      })
    }

    // 鼠标位置（仅在移动时更新，不每帧读 DOM）
    const mouse = { x: -9999, y: -9999, active: false }
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const onMouseLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const LINK_SQ = 150 * 150
    const MOUSE_SQ = 180 * 180 // 鼠标影响半径
    const FRAME_MS = 1000 / 40
    let last = 0

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (now - last < FRAME_MS) return
      last = now

      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        // 鼠标斥力：近处粒子被轻轻推开
        if (mouse.active) {
          const mdx = d.x - mouse.x
          const mdy = d.y - mouse.y
          const mDistSq = mdx * mdx + mdy * mdy
          if (mDistSq < MOUSE_SQ && mDistSq > 0.01) {
            const force = (1 - mDistSq / MOUSE_SQ) * 0.9
            const inv = 1 / Math.sqrt(mDistSq)
            d.vx += mdx * inv * force
            d.vy += mdy * inv * force
          }
        }
        // 阻尼 + 回归基础漂移速度，避免越推越快
        d.vx *= 0.94
        d.vy *= 0.94
        if (d.vx > -0.05 && d.vx < 0.05) d.vx += (Math.random() - 0.5) * 0.04
        if (d.vy > -0.05 && d.vy < 0.05) d.vy += (Math.random() - 0.5) * 0.04

        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = w
        else if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h
        else if (d.y > h) d.y = 0
      }

      ctx.lineWidth = 0.8
      for (let i = 0; i < dots.length; i++) {
        const di = dots[i]
        for (let j = i + 1; j < dots.length; j++) {
          const dx = di.x - dots[j].x
          const dy = di.y - dots[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < LINK_SQ) {
            const o = (1 - distSq / LINK_SQ) * 0.38
            ctx.strokeStyle = `rgba(201, 183, 141, ${o})`
            ctx.beginPath()
            ctx.moveTo(di.x, di.y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      // 鼠标与近处粒子的高亮连线（光标处像激起一片光网）
      if (mouse.active) {
        for (const d of dots) {
          const dx = d.x - mouse.x
          const dy = d.y - mouse.y
          const distSq = dx * dx + dy * dy
          if (distSq < MOUSE_SQ) {
            const o = (1 - distSq / MOUSE_SQ) * 0.55
            ctx.strokeStyle = `rgba(212, 192, 148, ${o})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(d.x, d.y)
            ctx.stroke()
          }
        }
      }

      ctx.shadowColor = 'rgba(201, 183, 141, 0.8)'
      ctx.shadowBlur = 6
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 192, 148, ${d.a})`
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    const start = () => {
      if (!running) {
        running = true
        last = 0
        raf = requestAnimationFrame(draw)
      }
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = null
    }

    // 仅在 Hero 可见时运行
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(canvas)

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />
}
