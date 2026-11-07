// Pure SVG builders for the HUD's graphic surfaces (VS Code, desktop, mobile).
// No engine imports: every function takes plain data and returns markup.

export const W = 360

const FONT = `'Segoe UI Variable Display','Segoe UI',Inter,system-ui,-apple-system,sans-serif`
const MONO = `'Cascadia Code','JetBrains Mono',Consolas,ui-monospace,monospace`

export const C = {
  text: '#f8fafc',
  muted: '#94a3b8',
  faint: 'rgba(255,255,255,0.08)',
  line: 'rgba(255,255,255,0.10)',
  cyan: '#22d3ee',
  indigo: '#818cf8',
  violet: '#c084fc',
  ok: '#34d399',
  warn: '#fbbf24',
  bad: '#f87171',
  gold: '#facc15',
}

export const heatColor = (pct: number) => (pct >= 85 ? C.bad : pct >= 60 ? C.warn : C.ok)
const heatPair = (pct: number): [string, string] =>
  pct >= 85 ? ['#fb7185', '#ef4444'] : pct >= 60 ? ['#fde047', '#f59e0b'] : ['#5eead4', '#22c55e']

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))

function frame(h: number, body: string, defs = '') {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" font-family="${FONT}">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1020"/><stop offset="1" stop-color="#1a1440"/></linearGradient>` +
    `<linearGradient id="ai" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".55" stop-color="${C.indigo}"/><stop offset="1" stop-color="${C.violet}"/></linearGradient>` +
    `<radialGradient id="glow" cx=".85" cy="0" r=".9"><stop offset="0" stop-color="${C.violet}" stop-opacity=".45"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>` +
    defs +
    `</defs>` +
    `<rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="16" fill="url(#bg)" stroke="${C.line}"/>` +
    body +
    `</svg>`
  )
}

function ring(cx: number, cy: number, r: number, stroke: number, pct: number, paint: string) {
  const circ = 2 * Math.PI * r
  const off = circ * (1 - clamp(pct) / 100)
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.faint}" stroke-width="${stroke}"/>` +
    (pct > 0
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${paint}" stroke-width="${stroke}" stroke-linecap="round" ` +
        `stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`
      : '')
  )
}

function pill(x: number, y: number, w: number, h: number, pct: number, paint: string) {
  const fill = Math.max(pct > 0 ? h : 0, (w * clamp(pct)) / 100)
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.faint}"/>` +
    (fill > 0 ? `<rect x="${x}" y="${y}" width="${fill.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${paint}"/>` : '')
  )
}

// ── hero: level ring, rank, XP, model and effort ─────────────
export type HeroData = {
  level: number
  rank: string
  xp: number
  nextXp: number
  levelPct: number
  model: string
  effort: string
  effortLevel: number // 0 when unknown
}

export function heroSvg(d: HeroData) {
  const h = 136
  const xpText = `${d.xp.toLocaleString('en-US')} / ${d.nextXp.toLocaleString('en-US')} XP`
  const modelW = 18 + d.model.length * 7.2
  const effortX = 112 + modelW + 8
  const dots = Array.from({ length: 5 }, (_, i) =>
    `<circle cx="${effortX + 14 + i * 9}" cy="111" r="3" fill="${i < d.effortLevel ? C.violet : 'rgba(255,255,255,0.18)'}"/>`,
  ).join('')
  const effortW = 14 + 5 * 9 + 6 + d.effort.length * 6.6 + 10
  const body =
    `<rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="16" fill="url(#glow)">` +
    `<animate attributeName="opacity" values=".7;1;.7" dur="6s" repeatCount="indefinite"/></rect>` +
    ring(58, 62, 38, 8, d.levelPct, 'url(#ai)') +
    `<text x="58" y="67" text-anchor="middle" font-size="30" font-weight="700" fill="${C.text}">${d.level}</text>` +
    `<text x="58" y="84" text-anchor="middle" font-size="8.5" letter-spacing="2" fill="${C.muted}">LEVEL</text>` +
    `<text x="112" y="34" font-size="10" font-weight="600" letter-spacing="2.4" fill="${C.cyan}">CLAUDE HUD</text>` +
    `<text x="112" y="60" font-size="22" font-weight="700" fill="${C.text}">${esc(d.rank)}</text>` +
    pill(112, 70, W - 112 - 20, 6, d.levelPct, 'url(#ai)') +
    `<text x="112" y="91" font-size="11" fill="${C.muted}" font-family="${MONO}">${esc(xpText)}</text>` +
    // model chip
    `<rect x="112" y="100" width="${modelW.toFixed(0)}" height="22" rx="11" fill="${C.faint}" stroke="${C.line}"/>` +
    `<text x="${112 + 10}" y="115" font-size="11.5" font-weight="600" fill="${C.text}">${esc(d.model)}</text>` +
    // effort chip
    `<rect x="${effortX}" y="100" width="${effortW.toFixed(0)}" height="22" rx="11" fill="${C.faint}" stroke="${C.line}"/>` +
    dots +
    `<text x="${effortX + 14 + 5 * 9 + 2}" y="115" font-size="11" fill="${C.muted}">${esc(d.effort)}</text>`
  return frame(h, body)
}

// ── gauges: limits and context as rings ──────────────────────
export type Gauge = { label: string; pct: number; note?: string }

export function gaugesSvg(gauges: Gauge[]) {
  const h = 132
  if (gauges.length === 0) {
    return frame(
      64,
      `<text x="${W / 2}" y="37" text-anchor="middle" font-size="12" fill="${C.muted}">Usage limits show after the first reply</text>`,
    )
  }
  const slot = W / gauges.length
  let defs = ''
  const body = gauges
    .map((g, i) => {
      const cx = slot * i + slot / 2
      const [a, b] = heatPair(g.pct)
      defs += `<linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`
      return (
        ring(cx, 52, 30, 7, g.pct, `url(#g${i})`) +
        `<text x="${cx}" y="57" text-anchor="middle" font-size="16" font-weight="700" fill="${C.text}">${Math.round(g.pct)}<tspan font-size="10" fill="${C.muted}">%</tspan></text>` +
        `<text x="${cx}" y="102" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.text}">${esc(g.label)}</text>` +
        (g.note
          ? `<text x="${cx}" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">${esc(g.note)}</text>`
          : '')
      )
    })
    .join('')
  return frame(h, body, defs)
}

// ── save context: total and a stacked bar by tip ─────────────
export type WasteSlice = { label: string; tokens: number; color: string }

export function wasteSvg(total: string | null, slices: WasteSlice[], urgent: string | null) {
  if (total === null && urgent === null) {
    const h = 64
    return frame(
      h,
      `<circle cx="34" cy="32" r="13" fill="rgba(52,211,153,0.15)" stroke="${C.ok}" stroke-width="1.5"/>` +
        `<path d="M28 32.5l4 4 8-9" fill="none" stroke="${C.ok}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<text x="58" y="29" font-size="13" font-weight="700" fill="${C.text}">Looking clean</text>` +
        `<text x="58" y="45" font-size="11" fill="${C.muted}">Tips on saving context show up here as you work</text>`,
    )
  }
  const h = slices.length > 0 ? 104 : 64
  const sum = slices.reduce((n, s) => n + s.tokens, 0)
  const barX = 20
  const barW = W - 40
  let x = barX
  const segs = slices
    .map((s, i) => {
      const w = Math.max(4, (barW * s.tokens) / sum - (i < slices.length - 1 ? 3 : 0))
      const seg = `<rect x="${x.toFixed(1)}" y="56" width="${w.toFixed(1)}" height="8" rx="4" fill="${s.color}"/>`
      x += w + 3
      return seg
    })
    .join('')
  let lx = barX
  const legend = slices
    .slice(0, 3)
    .map(s => {
      const label = s.label.length > 16 ? `${s.label.slice(0, 15)}…` : s.label
      const item =
        `<circle cx="${lx + 4}" cy="84" r="4" fill="${s.color}"/>` +
        `<text x="${lx + 13}" y="88" font-size="10.5" fill="${C.muted}">${esc(label)}</text>`
      lx += 13 + label.length * 5.8 + 14
      return item
    })
    .join('')
  const body =
    `<text x="20" y="28" font-size="10" font-weight="600" letter-spacing="2.4" fill="${C.cyan}">SAVE CONTEXT</text>` +
    (total !== null
      ? `<text x="${W - 20}" y="30" text-anchor="end" font-size="20" font-weight="700" fill="${C.text}">~${esc(total)}<tspan font-size="11" font-weight="400" fill="${C.muted}"> tokens</tspan></text>`
      : '') +
    (urgent !== null
      ? `<text x="20" y="46" font-size="11" fill="${C.bad}">● ${esc(urgent)}</text>`
      : `<text x="20" y="46" font-size="11" fill="${C.muted}">Open a tip below to see the fix</text>`) +
    segs +
    legend
  return frame(h, body)
}

// ── where the context goes: the biggest parts of the window, as /context counts them ──
export type UsageBar = { label: string; tokens: string; pct: number }
const USAGE_COLORS = [C.violet, C.indigo, C.cyan, C.ok, C.gold]

export function usageSvg(total: string, rows: UsageBar[]) {
  const h = 44 + rows.length * 22
  const body =
    `<text x="20" y="26" font-size="10" font-weight="600" letter-spacing="2.4" fill="${C.cyan}">WHERE YOUR CONTEXT GOES</text>` +
    `<text x="${W - 20}" y="26" text-anchor="end" font-size="11" fill="${C.muted}" font-family="${MONO}">${esc(total)}</text>` +
    rows
      .map((r, i) => {
        const y = 48 + i * 22
        const label = r.label.length > 20 ? `${r.label.slice(0, 19)}…` : r.label
        return (
          `<text x="20" y="${y}" font-size="11" fill="${C.text}">${esc(label)}</text>` +
          pill(160, y - 7, 130, 6, r.pct, USAGE_COLORS[i % USAGE_COLORS.length] ?? C.indigo) +
          `<text x="${W - 20}" y="${y}" text-anchor="end" font-size="10.5" fill="${C.muted}" font-family="${MONO}">${esc(r.tokens)}</text>`
        )
      })
      .join('')
  return frame(h, body)
}

// ── footer: daily quest and session cost ─────────────────────
export function footerSvg(turns: number, goal: number, tools: number, cost: string) {
  const h = 52
  const pct = clamp((turns / goal) * 100)
  const done = turns >= goal
  const body =
    `<defs><linearGradient id="q" x1="0" x2="1"><stop offset="0" stop-color="#fde047"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>` +
    `<text x="20" y="22" font-size="11" font-weight="600" fill="${C.text}">${done ? 'Daily quest cleared ✓' : 'Daily quest'}</text>` +
    `<text x="148" y="22" text-anchor="end" font-size="10.5" fill="${C.muted}" font-family="${MONO}">${Math.min(turns, goal)}/${goal}</text>` +
    pill(20, 30, 128, 6, pct, 'url(#q)') +
    `<text x="${W - 20}" y="22" text-anchor="end" font-size="15" font-weight="700" fill="${C.text}" font-family="${MONO}">$${esc(cost)}</text>` +
    `<text x="${W - 20}" y="38" text-anchor="end" font-size="10.5" fill="${C.muted}">${tools} tools today</text>`
  return frame(h, body)
}
