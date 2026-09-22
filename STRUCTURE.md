# Repository Structure

## Root Files

```
data-analytics-skills/
├── README.md               # Main documentation with embedded skill map
├── QUICKSTART.md           # 5-minute getting started guide
├── STRUCTURE.md            # This file
├── skill-map.svg           # Visual skill map (rendered inline in README)
├── validate_skills.py      # Skill structure validation script
└── .gitignore
```

## Skill Structure Pattern

Every skill lives inside its category folder. Most skills follow this full layout:

```
<category>/<skill-name>/
├── SKILL.md                # Skill definition, workflow, inputs, outputs (required)
├── scripts/                # Reusable Python / SQL scripts
├── references/             # Detailed guides and reference documentation
└── assets/                 # Output templates (Markdown, HTML, YAML)
```

`SKILL.md` is the only required file. `scripts/`, `references/`, and `assets/` are present in most skills and can be extended with company-specific content.

## Categories and Skills

### 01-data-quality-validation/ — 3 skills
| Skill | scripts | references | assets |
|-------|:-------:|:----------:|:------:|
| programmatic-eda | ✓ | ✓ | ✓ |
| data-quality-audit | ✓ | ✓ | ✓ |
| query-validation | ✓ | ✓ | ✓ |

### 02-documentation-knowledge/ — 7 skills
| Skill | scripts | references | assets |
|-------|:-------:|:----------:|:------:|
| semantic-model-builder | ✓ | ✓ | ✓ |
| analysis-documentation | — | ✓ | ✓ |
| data-catalog-entry | ✓ | ✓ | ✓ |
| sql-to-business-logic | ✓ | ✓ | ✓ |
| analysis-assumptions-log | ✓ | ✓ | ✓ |
| metric-reconciliation | ✓ | ✓ | ✓ |
| schema-mapper | ✓ | ✓ | ✓ |

### 03-data-analysis-investigation/ — 7 skills
| Skill | scripts | references | assets |
|-------|:-------:|:----------:|:------:|
| cohort-analysis | ✓ | ✓ | ✓ |
| segmentation-analysis | ✓ | ✓ | ✓ |
| funnel-analysis | ✓ | ✓ | ✓ |
| time-series-analysis | ✓ | ✓ | ✓ |
| root-cause-investigation | ✓ | ✓ | ✓ |
| ab-test-analysis | ✓ | ✓ | ✓ |
| business-metrics-calculator | ✓ | ✓ | ✓ |

### 04-data-storytelling-visualization/ — 5 skills
| Skill | scripts | references | assets |
|-------|:-------:|:----------:|:------:|
| insight-synthesis | — | ✓ | ✓ |
| visualization-builder | ✓ | ✓ | ✓ |
| executive-summary-generator | — | ✓ | ✓ |
| dashboard-specification | — | ✓ | ✓ |
| data-narrative-builder | — | ✓ | ✓ |

### 05-stakeholder-communication/ — 5 skills
| Skill | scripts | references | assets |
|-------|:-------:|:----------:|:------:|
| technical-to-business-translator | ✓ | ✓ | ✓ |
| stakeholder-requirements-gathering | — | ✓ | ✓ |
| analysis-qa-checklist | ✓ | ✓ | ✓ |
| methodology-explainer | — | ✓ | ✓ |
| impact-quantification | ✓ | ✓ | ✓ |

### 06-workflow-optimization/ — 4 skills
| Skill | scripts | references | assets |
|-------|:-------:|:----------:|:------:|
| analysis-planning | — | ✓ | ✓ |
| context-packager | ✓ | ✓ | ✓ |
| peer-review-template | — | ✓ | ✓ |
| analysis-retrospective | — | ✓ | ✓ |

## Summary Statistics

| | Count |
|-|------:|
| Total skills | 31 |
| Categories | 6 |
| Skills with scripts | 19 |
| Skills with references | 29 |
| Skills with assets | 29 |

## Adding Company-Specific Content

Drop files into any skill's `references/` folder to give Claude persistent context without modifying the core `SKILL.md`:

```
skill-name/
├── SKILL.md
└── references/
    ├── company-schema.md       ← table/column definitions
    ├── metric-definitions.md   ← standard formulas
    └── business-rules.md       ← thresholds, edge cases
```

Claude will pull these automatically when the skill runs.
