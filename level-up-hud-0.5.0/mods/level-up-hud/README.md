<div align="center">

# 🎮 Claude HUD

**Your status line shows you numbers. This tells you what to do about them.**

A live heads-up display for Claude Code: usage limits, context, and a coach that spots wasted context in every session, with a one-click fix.

![Claude HUD demo](docs/demo.gif)

</div>

---

## ⚡ Install

In Claude Code, run:

```
/plugin install level-up-hud --marketplace nimrodfisher/claude-data-mods
```

1. Answer **`y`** to add the marketplace.
2. Pick the **user** scope, so the HUD shows up in every project.
3. Restart Claude Code. The pane opens beside the chat. Run **`/hud`** to reopen it at any time.

<details>
<summary>Other ways to install, update or remove</summary>

The same in two steps, inside Claude Code:

```
/plugin marketplace add nimrodfisher/claude-data-mods
/plugin install level-up-hud@claude-data-mods
```

From your shell:

```bash
claude plugin marketplace add nimrodfisher/claude-data-mods
claude plugin install level-up-hud@claude-data-mods --scope user
```

Update to the latest version, then restart Claude Code:

```bash
claude plugin marketplace update claude-data-mods
claude plugin update level-up-hud@claude-data-mods
```

Remove it:

```bash
claude plugin uninstall level-up-hud@claude-data-mods
```

</details>

---

## 👀 What you see

| | |
| --- | --- |
| 🟣 **Level and rank** | Your XP bar, model and effort, live as you switch. |
| 🟢 **Usage limits** | 5-hour and weekly gauges with reset countdowns. They turn amber at 60% and red at 85%. |
| 🔵 **Context** | How full this session's window is. |
| 🟡 **Save context** | The biggest waste in your context right now, and how many tokens you'd get back. |
| 📊 **Where your context goes** | The five biggest parts of the window, as `/context` counts them. |
| 🏆 **Daily quest** | 20 useful actions a day, plus today's cost. |

It works everywhere Claude Code runs. **VS Code, the desktop app and mobile** draw graphic cards. The **terminal** draws the same cards in colored text. The cards use their own dark theme, so they look the same in light and dark editors.

![Claude HUD in VS Code, light and dark themes](docs/preview.png)

---

## 💡 Save context: the coach

The HUD watches what goes into your context window and lists the biggest waste first. Open a tip to see the fix:

| Tip | Shows when | One-click fix |
| --- | --- | --- |
| **Idle MCP server** | A server's tools sit in context but none were called | **`/mcp`** to turn it off |
| **Large read** | A whole file of over ~2k tokens was read | A rule: search with Grep, read line ranges |
| **Read N×** | The same file was read twice or more | A rule: summarize it once |
| **Long tool output** | A tool returned over ~2k tokens | A rule: narrow searches, pipe through `head` or `grep` |
| **Heavy memory** | A CLAUDE.md is over ~2k tokens, paid on every request | A ready-made prompt to trim it |
| **Large skill listing** | Skill descriptions take over ~3k tokens per request | **`/plugin`** to disable what you don't use |
| **Context N% full** | The window is over 50% full | **`/compact`** and **`/context`** |

> **Nothing runs on its own.** A button only puts the command or rule into your prompt box. You press Enter. **Dismiss** hides a tip for the rest of the session.

Token counts are estimates, at about 4 characters per token.

---

## 🏆 Levels: spend tokens on work, not on nothing

Using tokens is fine. Tokens that do nothing are the waste. XP follows that rule:

| What happened | XP |
| --- | ---: |
| ✏️ An edit or write that worked | **+3** |
| ⚙️ A command that worked, a line-range read, a Grep or Glob search | **+2** |
| ✅ Any other tool call that worked | **+1** |
| 💬 A finished turn | **+5** |
| 🧹 A waste tip cleared (unused context freed) | **+25** |
| 🚫 A failed call, a whole-file read, a re-read, a huge output | **0** |

**Ranks:** Novice → Apprentice → Coder → Hacker → Architect → Wizard → Archmage → Legend, one every 3 levels. Your XP is saved across sessions.

---

## ❓ FAQ

**The pane doesn't show up.** Run `/hud`. In the terminal, the pane docks beside the chat in the fullscreen layout. To open on its own it needs a terminal about 110–144 columns wide.

**The usage gauges are empty.** They fill in after Claude's first reply in a session.

**Does it send my data anywhere?** No. It reads only what Claude Code already knows about your session, and keeps your XP on your machine.
