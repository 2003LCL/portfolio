# Tech Spec — 李超立 AI 产品经理作品集

## 依赖清单

### 核心框架

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^18.3.0 | UI 框架 |
| react-dom | ^18.3.0 | DOM 渲染 |
| vite | ^6.0.0 | 构建工具 |
| @vitejs/plugin-react | ^4.3.0 | Vite React 支持 |

### 动画

| 包名 | 版本 | 用途 |
|------|------|------|
| gsap | ^3.12.0 | 核心动画引擎：ScrollTrigger 插件（滚动触发）、SplitText 插件（文字拆分）、stagger、timeline 等所有动画 |

> GSAP 自带 `ScrollTrigger` 和 `SplitText`（Club 插件，需手动注册）。本项目中 Hero 逐词 reveal 使用 `SplitText`，滚动触发动画使用 `ScrollTrigger`。

### 平滑滚动

| 包名 | 版本 | 用途 |
|------|------|------|
| lenis | ^1.1.0 | 平滑滚动（惯性滚动），全站覆盖 |

### 样式

| 包名 | 版本 | 用途 |
|------|------|------|
| tailwindcss | ^4.0.0 | 原子化 CSS |
| @tailwindcss/vite | ^4.0.0 | Tailwind v4 Vite 插件 |

### 字体

Google Fonts 通过 `<link>` 在 `index.html` 中加载，无需 npm 包：
- `Noto Sans SC:wght@300;400;500;700`
- `Manrope:wght@200;400;500;700`
- `JetBrains+Mono:wght@400`

---

## 组件清单

### Layout

| 组件 | 来源 | 复用 |
|------|------|------|
| Navigation | 自建 | 单实例（fixed 导航） |
| CustomCursor | 自建 | 单实例（全局） |
| PageLoader | 自建 | 单实例（加载覆盖层） |

### Sections

| 组件 | 来源 |
|------|------|
| HeroSection | 自建 |
| AboutSection | 自建 |
| WorksSection | 自建 |
| StrengthsSection | 自建 |
| FooterSection | 自建 |

### 可复用组件

| 组件 | 来源 | 使用位置 |
|------|------|----------|
| PrimaryButton | 自建 | Navigation CTA、Footer CTA |
| SecondaryButton | 自建 | About 社交链接 |
| TagChip | 自建 | WorksSection 项目标签 |
| ProjectCard | 自建 | WorksSection（4 张） |
| StrengthCard | 自建 | StrengthsSection（6 张） |
| DataCounter | 自建 | AboutSection（4 个数据） |
| SectionLabel | 自建 | About、Works、Strengths、Footer（标签 + 细线组合） |

---

## 动画实现方案

| 动画 | 库 / 插件 | 实现方式 | 复杂度 |
|------|-----------|----------|--------|
| 页面加载 — 终端文字逐字打印 | GSAP | `gsap.to()` 配合 `textContent` 逐字符更新 + `setInterval` 模拟打字机，`JetBrains Mono`，完成后覆盖层 `opacity→0` | Medium |
| Hero 标题逐词 Reveal | GSAP + SplitText | `SplitText` 拆分标题为 `<span>` 词单元，`gsap.from()` + `stagger: 0.08s`，`y:60→0, opacity:0→1` | High |
| Hero 斜杠闪烁 | GSAP | 单独的 `gsap.fromTo()`，`opacity: 0.3→1.0→0.8`，在标题动画完成后 `0.3s` 触发（通过 timeline 的 position 参数） | Low |
| 导航栏滚动响应 | GSAP ScrollTrigger | `ScrollTrigger.create({ start: '100px', toggleActions })` 切换背景色 + `backdrop-filter` class | Low |
| 导航链接高亮 | GSAP ScrollTrigger | 为每个 section 创建 ScrollTrigger，`onEnter/onLeaveBack` 回调设置活跃 nav link | Medium |
| 底部标语 / 滚动指示器淡入 | GSAP | 延迟动画，`delay: 1.8s`（在加载动画后），`opacity→1, y:10→0` | Low |
| 导航入场（加载后） | GSAP | `gsap.from()`，`y:-20→0, opacity:0→1`，logo `delay:0.8s`，links stagger `0.1s` `delay:1.0s` | Low |
| About 各元素滚动入场 | GSAP ScrollTrigger | 每个子元素独立 `gsap.from()` + `ScrollTrigger`，交错延迟 | Medium |
| 数据指标数字递增 | GSAP | `gsap.to()` 配合 `onUpdate` 回调插值 `textContent`，`duration: 1.5s`；或使用 `countUp.js`（如需精确控制） | Medium |
| Works 卡片交错入场 | GSAP ScrollTrigger | `gsap.from()` + `ScrollTrigger: { start: 'top 85%' }`，卡片 `stagger: 0.15s` | Medium |
| 卡片 Hover 图片放大 | CSS | `transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)`，`hover: scale(1.03)` | Low |
| Strengths 卡片交错入场 | GSAP ScrollTrigger | 同 Works 卡片模式，`stagger: 0.1s` | Medium |
| Footer CTA 标题 / 按钮 / 分隔线入场 | GSAP ScrollTrigger | Timeline 串联：标题 → 副文本 → 按钮 → 分隔线 `scaleX:0→1` → 联系信息 stagger | Medium |
| 自定义光标跟随 | RAF + lerp | 手写 `requestAnimationFrame` 循环，`lerp: 0.15` 插值位置，根据 `hover` 目标切换 size/text（通过 data-cursor 属性或 context） | High |
| 平滑滚动 | Lenis | `new Lenis({ lerp: 0.08 })`，与 GSAP ScrollTrigger 通过 `lenis.on('scroll', ScrollTrigger.update)` 同步 | Low |

---

## 关键架构决策

### Lenis + GSAP ScrollTrigger 同步

Lenis 的滚动事件必须同步到 ScrollTrigger，否则所有滚动触发动画不工作。实现方式：

```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

此同步逻辑放在顶层 `App` 组件的 `useEffect` 中，通过 React Context 或 ref 将 `lenis` 实例传给需要 `scrollTo` 的组件（如导航链接）。

### 自定义光标与 Lenis 的联动

自定义光标在滚动时需要轻微收缩（`scale: 0.9`）。通过在 Lenis 的 `on('scroll')` 回调中检测滚动速度，速度 > 阈值时触发光标收缩动画（GSAP `gsap.to(cursorEl, { scale: 0.9, duration: 0.15 })`）。

### GSAP SplitText 的可用性

GSAP SplitText 是 Club GreenSock 的付费插件。若项目无法使用，**降级方案**：手写文字拆分函数——将目标文本按词拆分为 `<span>` 数组，每个 span 独立包裹，手动添加 class 用于 stagger 动画。效果等价。

### 图片素材处理

6 张 AI 生成图片 + 1 个视频，预计总资源体积较大：
- 图片使用 WebP 格式（`<img>` 内联 + `<picture>` 回退），控制在每张 < 200KB
- 视频使用 MP4 (H.264) + WebM 双 `<source>`，压缩至 < 5MB
- 人物肖像图（Portrait）考虑添加 `<link rel="preload">` 以加速首屏

### 中文字体子集化

`Noto Sans SC` 全量约 8MB+，必须使用子集化。方案：
- 通过 `cn-font-split` 或类似工具，根据页面实际出现的汉字提取子集
- 生成的 woff2 子集文件通过 `@font-face` 本地加载
- Fallback 链：`Noto Sans SC, "PingFang SC", "Microsoft YaHei", sans-serif`

### 文件结构

```
src/
├── main.jsx
├── App.jsx
├── index.css                 # Tailwind 指令 + 全局样式（cursor:none, 字体变量）
├── components/
│   ├── Navigation.jsx
│   ├── CustomCursor.jsx
│   ├── PageLoader.jsx
│   ├── PrimaryButton.jsx
│   ├── SecondaryButton.jsx
│   ├── TagChip.jsx
│   ├── ProjectCard.jsx
│   ├── StrengthCard.jsx
│   ├── DataCounter.jsx
│   └── SectionLabel.jsx
├── sections/
│   ├── HeroSection.jsx
│   ├── AboutSection.jsx
│   ├── WorksSection.jsx
│   ├── StrengthsSection.jsx
│   └── FooterSection.jsx
├── hooks/
│   ├── useLenis.js           # Lenis 实例 + ScrollTrigger 同步
│   └── useCursorState.js     # 光标状态管理（size、text、hover target）
└── assets/
    ├── portrait.jpg
    ├── project-1.jpg
    ├── project-2.jpg
    ├── project-3.jpg
    ├── project-4.jpg
    ├── hero-bg.mp4
    └── hero-bg.webm
```
