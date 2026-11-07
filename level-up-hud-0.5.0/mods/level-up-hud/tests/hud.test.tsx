import { expect, test } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { SessionContextBreakdown } from 'claude-code'

const PANE = {
  plugin: 'level-up-hud',
  component: 'Pane',
  requestId: 'level-up-hud',
  props: {
    title: 'Claude HUD',
    isFocused: false,
    bodyColumns: 40,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const BIG = '/repo/db/schema.sql'

// The engine beneath the plugin: every call the mod makes is answered here.
function engine(on: Parameters<TestBody>[1], opts: { mcp?: boolean; breakdown?: object } = {}) {
  const filled: string[] = []
  on('command.register', () => ({ value: { command: 'hud' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('session.model', () => ({ value: 'claude-opus-5-5' }))
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: {
        window: 200000,
        percent: 30,
        breakdown: (opts.breakdown ?? (opts.mcp
          ? {
              mcpTools: [
                { name: 'mcp__monte__a', serverName: 'Monte Carlo', tokens: 9000, isLoaded: true },
                { name: 'mcp__monte__b', serverName: 'Monte Carlo', tokens: 6000, isLoaded: true },
                { name: 'mcp__miro__a', serverName: 'Miro', tokens: 4000, isLoaded: false },
              ],
            }
          : undefined)) as SessionContextBreakdown | undefined,
      },
      rateLimits: [],
      cost: { usd: 1.5 },
    },
  }))
  on('clock.now', () => ({ value: Date.parse('2026-11-06T12:00:00Z') }))
  on('ui.status', () => ({ value: undefined }))
  on('ui.toast', () => ({ value: undefined }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('env.get', () => ({ value: 'high' }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.measure', (_, e) => ({ changed: e.changed }))
  on('prompt.fill', (_, e) => {
    filled.push(e.text)
    return { isFilled: true }
  })
  return filled
}

test('the HUD shows model, effort and limits on every surface', async ($, on) => {
  engine(on)
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await $.session.measure({
    context: { window: 200000, percent: 30 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 42, resetsAt: '2099-01-01T00:00:00Z' },
      { kind: 'seven_day', percentUsed: 90 },
    ],
    changed: ['rateLimits'],
  })

  // the terminal draws text
  const term = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: /Opus 5\.5/ })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /5-hour/ })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /42%/ })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /Weekly/ })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /Looking clean/ })).toBeDefined()
  await term.unmount()

  // graphic surfaces draw SVG cards that carry the same facts
  for (const surface of ['desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    const hero = await ui.find({ type: 'Svg' })
    expect(String(hero?.props.source)).toContain('Opus 5.5')
    expect(String(hero?.props.alt)).toContain('effort high')
    const drawn = JSON.stringify(await ui.drawn())
    expect(drawn).toContain('5-hour 42%')
    expect(drawn).toContain('Weekly 90%')
    expect(drawn).toContain('Looking clean')
    await ui.unmount()
  }
})

test('a large whole-file read becomes a tip that expands, fills the prompt and dismisses', async ($, on) => {
  const filled = engine(on)
  on('tool.call', () => ({ result: {}, text: 'x'.repeat(40000) }))
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })
  await $.tool.call({ tool: 'Read', file_path: BIG })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /Large read · schema\.sql/ })).toBeDefined()
    expect(JSON.stringify(await ui.drawn())).toMatch(/~8\.0k/)
    // collapsed until pressed
    expect(await ui.find({ type: 'Text', text: /Search it with Grep/ })).toBeUndefined()
    await ui.unmount()
  }

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: `tip:read:${BIG}` })
  expect(await ui.find({ type: 'Text', text: /Search it with Grep/ })).toBeDefined()
  expect(await ui.find({ type: 'Link' })).toBeDefined()

  await ui.press({ key: `do:read:${BIG}:Save as project rule` })
  expect(filled[0]).toMatch(/^Add this rule to CLAUDE\.md: for large files/)

  await ui.press({ key: `dismiss:read:${BIG}` })
  expect(await ui.find({ type: 'Text', text: /Large read/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /Looking clean/ })).toBeDefined()
  await ui.unmount()
})

test('a ranged read and a small read raise no tip', async ($, on) => {
  engine(on)
  on('tool.call', () => ({ result: {}, text: 'x'.repeat(40000) }))
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })
  await $.tool.call({ tool: 'Read', file_path: BIG, offset: 1, limit: 2000 })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Looking clean/ })).toBeDefined()
  await ui.unmount()
})

test('reading the same file three times is one repeat tip', async ($, on) => {
  engine(on)
  on('tool.call', () => ({ result: {}, text: 'x'.repeat(8000) }))
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })
  for (let i = 0; i < 3; i++) await $.tool.call({ tool: 'Read', file_path: '/repo/src/app.ts' })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Read 3× · app\.ts/ })).toBeDefined()
  await ui.unmount()
})

test('loaded MCP servers that went unused are one tip, with /mcp ready to run', async ($, on) => {
  const filled = engine(on, { mcp: true })
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  // Miro's tools load on demand, so only Monte Carlo counts
  expect(await ui.find({ type: 'Text', text: /1 idle MCP server$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^15k$/ })).toBeDefined()

  await ui.press({ key: 'tip:mcp' })
  expect(await ui.find({ type: 'Text', text: /Monte Carlo \(15k\)/ })).toBeDefined()
  await ui.press({ key: 'do:mcp:/mcp' })
  expect(filled).toEqual(['/mcp'])
  await ui.unmount()
})

test('a server whose tools were called is not idle', async ($, on) => {
  engine(on, { mcp: true })
  on('tool.call', () => ({ result: {}, text: 'ok' }))
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })
  await $.tool.call({ tool: 'mcp__monte__a' })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /idle MCP/ })).toBeUndefined()
  await ui.unmount()
})

test('a filling context window offers /compact', async ($, on) => {
  engine(on)
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })
  await $.session.measure({ context: { window: 200000, percent: 78 }, rateLimits: [], changed: ['context'] })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Context 78% full/ })).toBeDefined()
  await ui.press({ key: 'tip:context' })
  expect(await ui.find({ key: 'do:context:/compact' })).toBeDefined()
  await ui.unmount()
})

test('a heavy CLAUDE.md is a tip with a ready-made trim prompt', async ($, on) => {
  const filled = engine(on, {
    breakdown: { mcpTools: [], categories: [], memoryFiles: [{ path: '/repo/CLAUDE.md', type: 'Project', tokens: 4000 }] },
  })
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Heavy memory · CLAUDE\.md/ })).toBeDefined()
  await ui.press({ key: 'tip:memory:/repo/CLAUDE.md' })
  await ui.press({ key: 'do:memory:/repo/CLAUDE.md:Trim it' })
  expect(filled[0]).toMatch(/^Shorten CLAUDE\.md/)
  await ui.unmount()
})

test('long output from any tool, not only Bash, is a tip', async ($, on) => {
  engine(on)
  on('tool.call', () => ({ result: {}, text: 'x'.repeat(12000) }))
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })
  await $.tool.call({ tool: 'Grep', pattern: 'TODO' })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Long tool output/ })).toBeDefined()
  await ui.press({ key: 'tip:output' })
  expect(await ui.find({ type: 'Text', text: /Grep: TODO/ })).toBeDefined()
  await ui.unmount()
})

test('the context-use card lists the biggest parts of the window on every surface', async ($, on) => {
  engine(on, {
    breakdown: {
      mcpTools: [],
      memoryFiles: [],
      categories: [
        { name: 'System tools', tokens: 12000, color: 'x', isDeferred: false, kind: 'used' },
        { name: 'Messages', tokens: 30000, color: 'x', isDeferred: false, kind: 'used' },
        { name: 'Free space', tokens: 150000, color: 'x', isDeferred: false, kind: 'free' },
      ],
    },
  })
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })

  const term = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: /Messages/ })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /Free space/ })).toBeUndefined()
  await term.unmount()

  const ui = await $.ui.mount({ ...PANE, surface: 'vscode' })
  const drawn = JSON.stringify(await ui.drawn())
  expect(drawn).toContain('WHERE YOUR CONTEXT GOES')
  expect(drawn).toContain('Messages')
  await ui.unmount()
})

test('XP follows the work: an edit earns and counts toward the quest, a wasteful read earns nothing', async ($, on) => {
  engine(on)
  on('tool.call', (_, e) => ({ result: {}, text: e.tool === 'Read' ? 'x'.repeat(40000) : 'ok' }))
  await $.session.start({ cwd: '/repo', surface: 'terminal', isInteractive: true })

  // a whole-file read of ~10k tokens is waste: no XP
  await $.tool.call({ tool: 'Read', file_path: BIG })
  let ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /^0 \/ 40 XP$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^0\/20$/ })).toBeDefined()
  await ui.unmount()

  // a small edit is work: +3 XP and one useful action
  await $.tool.call({ tool: 'Edit', file_path: '/repo/a.ts', old_string: 'a', new_string: 'b' })
  ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /^3 \/ 40 XP$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^1\/20$/ })).toBeDefined()
  await ui.unmount()
})
