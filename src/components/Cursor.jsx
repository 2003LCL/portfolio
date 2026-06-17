import { useEffect, useRef } from 'react'
import './Cursor.css'

/**
 * 自定义光标。支持多种变体：
 *  - 'dot'       金色实心点 + 阻尼光环（主站 / 接单页默认）
 *  - 'crosshair' 取景框十字准星（摄影案例）
 *  - 'ring'      描边圆环（个人站案例）
 *  - 'none'      不启用自定义光标，使用系统默认箭头
 * 可通过 accent / accentRgb 覆盖颜色，默认用全局主题色。
 * 仅在支持精确指针（鼠标）的设备启用。
 */
export default function Cursor({ variant = 'dot', accent, accentRgb }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (variant === 'none') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    document.body.classList.add('has-custom-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = null
    let visible = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        ring.classList.add('is-active')
      }
    }
    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        ring.classList.remove('is-active')
      }
    }

    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      visible = false
    }
    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [variant])

  if (variant === 'none') return null

  // 颜色覆盖：传了就用案例色，否则用全局主题色
  const styleVars =
    accent && accentRgb ? { '--cur': accent, '--cur-rgb': accentRgb } : undefined

  return (
    <div className={`cursor cursor--${variant}`} style={styleVars}>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </div>
  )
}
