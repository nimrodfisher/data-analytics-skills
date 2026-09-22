# Quick Start Guide

Get started with Data Analytics Skills in 5 minutes.

## 🎯 1-Minute Overview

These skills help Claude provide better data analysis by:
- Requesting the specific context needed for each task
- Following structured workflows with checkpoints
- Producing consistent, high-quality outputs
- Teaching you what information matters most

## 🚀 Your First Skill in 3 Steps

### Before you start: install the skill

Clone this repo, then copy the skill folder into your agent's skills directory:

```bash
git clone https://github.com/nimrodfisher/data-analytics-skills.git
cd data-analytics-skills
```

**Claude Code:** personal skills (all projects) go in `~/.claude/skills/`, project skills in `.claude/skills/` inside your project:

```bash
cp -r 01-data-quality-validation/programmatic-eda ~/.claude/skills/
```

**Codex:** user skills (all repos) go in `~/.agents/skills/`, repo skills in `.agents/skills/` at the repository root:

```bash
cp -r 01-data-quality-validation/programmatic-eda ~/.agents/skills/
```

### Step 1: Pick a Skill

Start with **programmatic-eda** for your first analysis (already installed above):

```
Location: ~/.claude/skills/programmatic-eda/SKILL.md   (or ~/.agents/skills/ for Codex)
Purpose: Systematic exploratory data analysis
Best for: Analyzing any new dataset
```

### Step 2: Trigger the Skill

In your conversation with Claude, simply describe what you need:

```
You: "I need to do exploratory data analysis on my customer dataset"
```

Claude will automatically use the programmatic-eda skill.

### Step 3: Provide Context When Asked

Claude will request:
1. **Your dataset** - Upload file or share connection details
2. **Business context** - What the data represents
3. **Quality thresholds** - What's acceptable (or use defaults)

That's it! Claude will execute systematic EDA with checkpoints.

## 📊 Common Scenarios

### Scenario 1: Analyzing a New Dataset

**Task**: Understand what's in your data  
**Skill**: `programmatic-eda`

```
You: "Can you analyze this sales dataset for me?"
Claude: [requests dataset and context]
You: [provides CSV file]
Claude: [runs systematic EDA with quality checks]
```

### Scenario 2: Writing SQL Queries

**Task**: Validate a query before running  
**Skill**: `query-validation`

```
You: "Can you review this SQL query for performance issues?"
Claude: [requests query, database type, schema]
You: [provides query and context]
Claude: [validates logic, checks performance, suggests optimizations]
```

### Scenario 3: Analyzing User Retention

**Task**: Understand cohort retention patterns  
**Skill**: `cohort-analysis`

```
You: "I want to analyze user retention by signup month"
Claude: [requests dataset, cohort definition, retention metric]
You: [provides user activity data]
Claude: [builds retention matrices, creates visualizations, interprets findings]
```

### Scenario 4: Documenting Metrics

**Task**: Create clear metric documentation  
**Skill**: `semantic-model-builder`

```
You: "Help me document our MRR calculation"
Claude: [requests calculation logic, business context]
You: [explains how MRR is calculated]
Claude: [creates structured documentation optimized for future use]
```

## 🎓 Learning Path

### Week 1: Foundation
1. Use `programmatic-eda` on 3 different datasets
2. Notice what context Claude requests each time
3. Try providing different levels of context

**Goal**: Understand the on-demand context pattern

### Week 2: Expand
4. Add `query-validation` for SQL work
5. Try `semantic-model-builder` for your key metrics
6. Pick one analysis skill (cohort/funnel/segmentation)

**Goal**: Build a workflow with 3-4 connected skills

### Week 3: Optimize
7. Create a "context document" with your common info (schema, metrics)
8. Reference this document in conversations to reduce repetition
9. Customize skills with company-specific defaults (optional)

**Goal**: Efficient, repeatable workflows

## 💡 Pro Tips

### Tip 1: Prepare Context in Advance

Create a simple markdown file with:
```markdown
# My Data Context

## Database
- Type: PostgreSQL 14
- Main schema: analytics

## Key Tables
- users (id, signup_date, plan)
- transactions (id, user_id, amount, date)

## Key Metrics
- MRR: SUM(amount) WHERE subscription_status = 'active'
- Churn: (churned_this_month / active_start_of_month)
```

Share this at the start of conversations.

### Tip 2: Chain Skills Together

For complex analyses:
```
1. programmatic-eda (understand the data)
2. cohort-analysis (analyze retention patterns)
3. insight-synthesis (extract key findings)
4. executive-summary-generator (create presentation)
```

Each skill builds on the previous one's output.

### Tip 3: Iterate Progressively

Don't feel you need perfect context upfront:
```
Round 1: Basic analysis with minimal context
Round 2: Dive deeper where you see patterns
Round 3: Refine based on findings
```

### Tip 4: Save Good Examples

When a skill produces great output:
- Save the conversation
- Note what context you provided
- Create a template for similar future analyses

### Tip 5: Use Checkpoints

Skills include natural checkpoints:
- Confirm understanding before execution
- Review intermediate findings
- Adjust direction based on results

Don't skip these - they improve quality!

## 🔧 Common Patterns

### Pattern: Weekly Metrics Review
```
1. Pull latest data
2. Use programmatic-eda to check quality
3. Use business-metrics-calculator for KPIs
4. Use time-series-analysis to spot anomalies
5. Use root-cause-investigation if issues found
6. Use executive-summary-generator for stakeholder update
```

### Pattern: New Dataset Investigation
```
1. Use programmatic-eda for initial profiling
2. Use schema-mapper if database is unfamiliar
3. Use semantic-model-builder to document findings
4. Build analysis using appropriate skills
```

### Pattern: Ad-Hoc Analysis Request
```
1. Use stakeholder-requirements-gathering to clarify ask
2. Use analysis-planning to break down the work
3. Execute analysis with relevant skills
4. Use methodology-explainer to document approach
5. Use analysis-qa-checklist before delivery
```

## 🆘 Troubleshooting

### "Claude isn't using the skill"

**Solution**: Be explicit in your request
```
❌ "Can you help me?"
✅ "Can you do exploratory data analysis on this dataset?"
```

### "I don't have all the context Claude is asking for"

**Solution**: That's OK! Say what you have
```
You: "I don't have the schema documentation, but I can describe the tables"
Claude: [adapts to work with what you provide]
```

### "The output isn't what I expected"

**Solution**: Use checkpoints to course-correct
```
You: "Actually, I need this analyzed differently - focus on X instead of Y"
Claude: [adjusts approach mid-workflow]
```

### "This is taking too long"

**Solution**: Start with high-level, then drill down
```
You: "Start with a quick overview, then I'll tell you where to dig deeper"
Claude: [provides summary first, waits for direction]
```

## 📚 Next Steps

### Explore All Skills
Browse the [README](README.md) to see all 31 skills across 6 categories, including the visual skill map.

---

**Ready to start?** Pick a skill from the [README](README.md) and try it with your data! 🚀
