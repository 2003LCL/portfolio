import { useEffect, useRef } from 'react'

/**
 * 滚动入场：元素进入视口时为其加上 .is-visible。
 * 用法：const ref = useReveal(); <div ref={ref} className="reveal">...
 * 支持子元素批量：传入 { stagger: true } 时，对带 .reveal 的子元素逐个延迟。
 */
export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    if (options.stagger) {
      const items = el.querySelectorAll('.reveal')
      items.forEach((item, i) => {
        item.style.setProperty('--reveal-delay', `${i * (options.step ?? 0.08)}s`)
        observer.observe(item)
      })
    } else {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [options.stagger, options.step])

  return ref
}
