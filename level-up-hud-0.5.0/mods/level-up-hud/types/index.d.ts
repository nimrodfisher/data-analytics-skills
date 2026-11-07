export type Limit = { kind: string; percentUsed: number; resetsAt?: string }
export type Hud = {
  model: string
  effort: string
  limits: Limit[]
  contextPct: number | null
  costUsd: number
}
/** XP, and today's counts; `workToday` is useful actions: edits and commands that worked, none of them waste. */
export type Progress = { xp: number; day: string; turnsToday: number; toolsToday: number; workToday: number }

/** One whole-file read: the tokens of its biggest result and how often it was read. */
export type FileRead = { path: string; tokens: number; count: number; isRanged: boolean }
/** One long tool result (Bash, Grep, WebFetch, an MCP tool…): what ran and its tokens. */
export type LongOutput = { command: string; tokens: number }
/** One MCP server whose tool schemas sit in the context window. */
export type McpServer = { name: string; tokens: number; tools: string[] }
/** A memory file (CLAUDE.md and the like) loaded into every request. */
export type MemoryFile = { path: string; tokens: number }
/** One row of /context's breakdown: what part of the window holds how much. */
export type UsageRow = { name: string; tokens: number }

/** What the waste detector has seen this session. */
export type Waste = {
  reads: FileRead[]
  outputs: LongOutput[]
  servers: McpServer[]
  usedTools: string[]
  memory: MemoryFile[]
  skillsTokens: number
  usage: UsageRow[]
}

/** The pane's own view state: which tip is open, and what was dismissed. */
export type TipsView = {
  open: string | null
  showAll: boolean
  dismissed: string[]
  shown: string[]
}

declare module 'claude-code' {
  interface PluginState {
    'level-up-hud': {
      hud: Shaped<Hud>
      progress: Shaped<Progress>
      waste: Shaped<Waste>
      tips: Shaped<TipsView>
    }
  }
}
