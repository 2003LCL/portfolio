/**
 * 项目主视觉 —— 纯手绘 SVG 线条图，按项目主题区分。
 * 描边用香槟金 (var(--accent))，矢量、任意尺寸清晰，契合克制科技感。
 */

const STROKE = 'var(--accent)'

function Frame({ children }) {
  return (
    <svg
      className="pcard__svg"
      viewBox="0 0 400 220"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      role="img"
    >
      {children}
    </svg>
  )
}

// 01 动作识别 —— 骨架关键点（合理人体比例）
function ActionRecognition() {
  const joints = [
    [200, 46],  // 0 head
    [200, 70],  // 1 neck
    [200, 132], // 2 hip (脊柱)
    [176, 78],  // 3 L shoulder
    [224, 78],  // 4 R shoulder
    [166, 110], // 5 L elbow
    [234, 110], // 6 R elbow
    [160, 142], // 7 L hand
    [240, 142], // 8 R hand
    [184, 178], // 9 L knee
    [216, 178], // 10 R knee
    [180, 206], // 11 L foot
    [220, 206], // 12 R foot
  ]
  const bones = [
    [0, 1], [1, 2],            // 头-颈-髋
    [1, 3], [1, 4],            // 肩
    [3, 5], [5, 7],            // 左臂
    [4, 6], [6, 8],            // 右臂
    [2, 9], [9, 11],           // 左腿
    [2, 10], [10, 12],         // 右腿
  ]
  return (
    <Frame>
      <g stroke={STROKE} strokeWidth="1.6" strokeLinecap="round">
        {bones.map(([a, b], i) => (
          <line key={i} x1={joints[a][0]} y1={joints[a][1]} x2={joints[b][0]} y2={joints[b][1]} opacity="0.5" />
        ))}
      </g>
      {joints.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 0 ? 9 : 3.2} fill={i === 0 ? 'none' : STROKE} stroke={i === 0 ? STROKE : 'none'} strokeWidth="1.6" />
          {i !== 0 && <circle cx={x} cy={y} r="8" stroke={STROKE} strokeWidth="1" opacity="0.22" />}
        </g>
      ))}
      {/* 检测框 */}
      <rect x="138" y="30" width="124" height="190" stroke={STROKE} strokeWidth="1" strokeDasharray="4 5" opacity="0.4" />
    </Frame>
  )
}

// 02 ROV —— 四螺旋桨水下航行器（以等距长方体为基准定位螺旋桨）
function RovQgc() {
  // 等距坐标系：以机身长方体顶面为基准
  const C = { x: 200, y: 102 }   // 顶面中心
  const R = { x: 30, y: 15 }     // 右向等距单位
  const L = { x: -30, y: 15 }    // 左(深)向等距单位
  const H = 30                   // 机身高度

  // 顶面四角
  const add = (...ps) => ps.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 })
  const neg = (p) => ({ x: -p.x, y: -p.y })
  const corners = {
    back: add(C, neg(R), neg(L)),
    right: add(C, R, neg(L)),
    front: add(C, R, L),
    left: add(C, neg(R), L),
  }
  // 螺旋桨在各角外延（同一水平面上，沿对角方向伸出）
  const ext = 1.9
  const prop = (corner) => ({
    x: C.x + (corner.x - C.x) * ext,
    y: C.y + (corner.y - C.y) * ext,
  })
  const P = {
    back: prop(corners.back),
    right: prop(corners.right),
    front: prop(corners.front),
    left: prop(corners.left),
  }

  // 螺旋桨：水平圆在等距视图中投影为固定比例椭圆；近(front)略大、远(back)略小
  const Prop = ({ at, scale = 1, op = 0.8 }) => {
    const rx = 24 * scale, ry = 12 * scale
    return (
      <g opacity={op}>
        <ellipse cx={at.x} cy={at.y} rx={rx} ry={ry} strokeWidth="1.5" />
        <ellipse cx={at.x} cy={at.y} rx={rx * 0.92} ry={ry * 0.92} strokeWidth="0.8" opacity="0.4" />
        {/* 桨叶 */}
        <path d={`M${at.x} ${at.y} q${rx * 0.6} ${-ry} ${rx} ${-ry * 0.2}`} strokeWidth="1.1" opacity="0.7" />
        <path d={`M${at.x} ${at.y} q${-rx * 0.6} ${ry} ${-rx} ${ry * 0.2}`} strokeWidth="1.1" opacity="0.7" />
        <circle cx={at.x} cy={at.y} r="2.6" fill={STROKE} />
      </g>
    )
  }
  const Arm = ({ from, to }) => (
    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} strokeWidth="1.6" opacity="0.55" />
  )

  return (
    <Frame>
      <g stroke={STROKE} fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* —— 后层：远端螺旋桨 + 臂（先画，被机身遮挡） —— */}
        <Arm from={corners.back} to={P.back} />
        <Arm from={corners.left} to={P.left} />
        <Arm from={corners.right} to={P.right} />
        <Prop at={P.back} scale={0.82} op={0.55} />
        <Prop at={P.left} scale={0.95} op={0.7} />
        <Prop at={P.right} scale={0.95} op={0.7} />

        {/* —— 机身长方体 —— */}
        {/* 顶面 */}
        <path d={`M${corners.back.x} ${corners.back.y} L${corners.right.x} ${corners.right.y} L${corners.front.x} ${corners.front.y} L${corners.left.x} ${corners.left.y} Z`} strokeWidth="1.7" fill={STROKE} fillOpacity="0.14" />
        {/* 左前侧面 */}
        <path d={`M${corners.left.x} ${corners.left.y} L${corners.front.x} ${corners.front.y} L${corners.front.x} ${corners.front.y + H} L${corners.left.x} ${corners.left.y + H} Z`} strokeWidth="1.7" fill={STROKE} fillOpacity="0.2" />
        {/* 右前侧面 */}
        <path d={`M${corners.front.x} ${corners.front.y} L${corners.right.x} ${corners.right.y} L${corners.right.x} ${corners.right.y + H} L${corners.front.x} ${corners.front.y + H} Z`} strokeWidth="1.7" fill={STROKE} fillOpacity="0.07" />

        {/* 前向摄像头/灯 */}
        <circle cx={corners.front.x} cy={corners.front.y + H * 0.5} r="4.5" fill={STROKE} opacity="0.85" />

        {/* —— 前层：近端螺旋桨 + 臂（最后画，盖在机身上） —— */}
        <Arm from={corners.front} to={P.front} />
        <Prop at={P.front} scale={1.34} op={0.92} />
      </g>
    </Frame>
  )
}

// 03 数字孪生 —— 城市高楼天际线（线条）
function DigitalTwin() {
  // 每栋楼: [x, 宽, 高]，从底线 198 往上
  const base = 198
  const towers = [
    [70, 30, 70], [104, 38, 120], [146, 26, 90],
    [176, 44, 150], [224, 30, 100], [258, 40, 134],
    [302, 28, 78],
  ]
  return (
    <Frame>
      <g stroke={STROKE} fill="none">
        {/* 地平线 */}
        <line x1="50" y1={base} x2="350" y2={base} strokeWidth="1.2" opacity="0.5" />
        {towers.map(([x, w, h], i) => {
          const top = base - h
          // 窗格横线
          const rows = []
          for (let yy = top + 14; yy < base - 6; yy += 16) {
            rows.push(<line key={yy} x1={x + 5} y1={yy} x2={x + w - 5} y2={yy} strokeWidth="0.8" opacity="0.22" />)
          }
          return (
            <g key={i}>
              <rect x={x} y={top} width={w} height={h} strokeWidth="1.4" opacity="0.62" fill={STROKE} fillOpacity="0.05" />
              {/* 顶部天线/结构 */}
              {h > 110 && <line x1={x + w / 2} y1={top} x2={x + w / 2} y2={top - 14} strokeWidth="1.2" opacity="0.5" />}
              {rows}
            </g>
          )
        })}
      </g>
      {/* 数据扫描线 */}
      <line x1="50" y1="64" x2="350" y2="64" stroke={STROKE} strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />
    </Frame>
  )
}

// 04 智能微仓 —— 立体货柜（开口朝前，内部货架沿内壁透视排布）
function SmartWarehouse() {
  // 等距基准：与 ROV 一致的方向单位
  const R = { x: 40, y: 20 }   // 右向（增大占地面积）
  const L = { x: -40, y: 20 }  // 左(深)向
  const H = 92                 // 柜体高度
  const O = { x: 200, y: 56 }  // 顶面后角(最远)

  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
  // 顶面四角
  const tBack = O
  const tRight = add(O, R)
  const tLeft = add(O, L)
  const tFront = add(add(O, R), L)
  // 底面 = 顶面 + 高度
  const down = (p) => ({ x: p.x, y: p.y + H })
  const bBack = down(tBack), bRight = down(tRight), bLeft = down(tLeft), bFront = down(tFront)

  const path = (...pts) => 'M' + pts.map((p) => `${p.x} ${p.y}`).join(' L') + ' Z'

  // 内部货架：沿左内壁(深度方向)与右内壁，各 3 层
  const shelves = []
  const levels = [0.28, 0.56, 0.84]
  levels.forEach((lv, li) => {
    const y = H * lv
    // 左内壁层板：从后墙沿 L 方向延伸的水平横档
    const a = add(tBack, { x: 0, y }), b = add(tLeft, { x: 0, y })
    shelves.push(
      <g key={`L${li}`} opacity={0.4 + li * 0.05}>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth="1.1" />
        {/* 货箱 */}
        <path d={path(
          add(b, { x: 8, y: -2 }),
          add(b, { x: 8 + 12, y: -2 - 6 }),
          add(b, { x: 8 + 12, y: -2 - 6 + 12 }),
          add(b, { x: 8, y: -2 + 12 })
        )} strokeWidth="0.9" fill={STROKE} fillOpacity={li === 1 ? 0.22 : 0.05} />
      </g>
    )
    // 右内壁层板：从后墙沿 R 方向
    const a2 = add(tBack, { x: 0, y }), b2 = add(tRight, { x: 0, y })
    shelves.push(
      <g key={`R${li}`} opacity={0.4 + li * 0.05}>
        <line x1={a2.x} y1={a2.y} x2={b2.x} y2={b2.y} strokeWidth="1.1" />
        <path d={path(
          add(b2, { x: -20, y: -2 }),
          add(b2, { x: -20 + 12, y: -2 - 6 }),
          add(b2, { x: -20 + 12, y: -2 - 6 + 12 }),
          add(b2, { x: -20, y: -2 + 12 })
        )} strokeWidth="0.9" fill={STROKE} fillOpacity="0.05" />
      </g>
    )
  })

  return (
    <Frame>
      <g stroke={STROKE} fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* 后内壁（左、右），先画作为背景 */}
        <path d={path(tBack, tLeft, bLeft, bBack)} strokeWidth="1" fill={STROKE} fillOpacity="0.16" opacity="0.8" />
        <path d={path(tBack, tRight, bRight, bBack)} strokeWidth="1" fill={STROKE} fillOpacity="0.08" opacity="0.8" />
        {/* 地面 */}
        <path d={path(bBack, bLeft, bFront, bRight)} strokeWidth="1" fill={STROKE} fillOpacity="0.04" opacity="0.6" />

        {/* 内部货架（在内壁之上、外框之下） */}
        {shelves}

        {/* 外框立柱（开口朝前，仅画边线，不挡内部） */}
        <path d={path(tBack, tLeft, tFront, tRight)} strokeWidth="1.7" fill={STROKE} fillOpacity="0.1" />
        <line x1={tBack.x} y1={tBack.y} x2={bBack.x} y2={bBack.y} strokeWidth="1.4" opacity="0.7" />
        <line x1={tLeft.x} y1={tLeft.y} x2={bLeft.x} y2={bLeft.y} strokeWidth="1.6" />
        <line x1={tRight.x} y1={tRight.y} x2={bRight.x} y2={bRight.y} strokeWidth="1.6" />
        <line x1={tFront.x} y1={tFront.y} x2={bFront.x} y2={bFront.y} strokeWidth="1.6" />
      </g>
    </Frame>
  )
}

// 05 智能车 —— 车道线 + 视觉识别框
function SmartCar() {
  return (
    <Frame>
      <g stroke={STROKE} fill="none">
        {/* 透视车道 */}
        <path d="M150 210 L185 60" strokeWidth="1.4" opacity="0.5" />
        <path d="M250 210 L215 60" strokeWidth="1.4" opacity="0.5" />
        {/* 中线虚线 */}
        <line x1="200" y1="210" x2="200" y2="60" strokeWidth="1.4" strokeDasharray="10 12" opacity="0.55" />
        {/* 地平线 */}
        <line x1="120" y1="60" x2="280" y2="60" strokeWidth="1" opacity="0.2" />
      </g>
      {/* 识别框 + 标签 */}
      <g stroke={STROKE}>
        <rect x="176" y="96" width="48" height="34" strokeWidth="1.4" />
        <line x1="176" y1="96" x2="176" y2="88" strokeWidth="1.4" />
        <line x1="176" y1="88" x2="206" y2="88" strokeWidth="1.4" />
      </g>
      <circle cx="200" cy="113" r="3" fill={STROKE} />
    </Frame>
  )
}

const MAP = {
  'action-recognition': ActionRecognition,
  'rov-qgc': RovQgc,
  'digital-twin': DigitalTwin,
  'smart-warehouse': SmartWarehouse,
  'smart-car': SmartCar,
}

export default function ProjectArt({ id }) {
  const Art = MAP[id]
  return Art ? <Art /> : null
}
