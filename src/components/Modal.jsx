import { useEffect } from 'react'
import './Modal.css'

/**
 * 通用弹层 —— 暗色玻璃质感，ESC / 点击遮罩关闭，打开时锁定滚动。
 */
export default function Modal({ open, onClose, label, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={label}>
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__panel" role="document">
        <button className="modal__close" onClick={onClose} aria-label="关闭">
          <span />
          <span />
        </button>
        <div className="modal__scroll">{children}</div>
      </div>
    </div>
  )
}
