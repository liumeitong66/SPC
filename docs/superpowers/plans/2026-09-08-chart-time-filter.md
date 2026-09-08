# Chart Time Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace chart shortcut buttons with one reusable date-range and period-select component across project, device, and defect analysis pages.

**Architecture:** Define shared visual rules in `spc-common.css`, adapt the existing comparison state in `spc-prototype.js` to native selects, and update page-specific markup and defect chart behavior without changing datasets or unrelated controls.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js syntax validation, headless Chrome rendering

## Global Constraints

- Keep the controls on one desktop header row.
- Preserve existing comparison dimensions, chart data, modal behavior, and “查看全部” actions.
- Invalid date ranges restore the last valid values without redrawing.
- Verify at the annotated viewport and 1440×900.

---

### Task 1: Shared component styling

**Files:**
- Modify: `页面效果图/spc-common.css`

**Interfaces:**
- Produces: `.chart-time-range` and `.chart-period-select` styles used by all three pages.

- [x] Add shared one-line date-range and period-select styles.
- [x] Add compact desktop-width rules that keep controls within chart cards.

### Task 2: Project and device comparison controls

**Files:**
- Modify: `页面效果图/01-项目统计首页.html`
- Modify: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: `comparisonDateRange`, `currentComparisonPeriod`, `setComparisonPeriod()`, and `renderProjectComparison()`.
- Produces: native `select[data-chart-period-context="comparison"]` controls synchronized across the page and comparison modal.

- [x] Replace the project comparison shortcut button group with a period select.
- [x] Change project comparison header CSS from wrapped two-row layout to one row.
- [x] Generate the same date-range and period-select component for device comparison and the comparison modal.
- [x] Update synchronization and change handlers for select values and custom dates.

### Task 3: Defect comparison control

**Files:**
- Modify: `页面效果图/03-缺陷分析.html`

**Interfaces:**
- Consumes: `periodRanges`, `dateRangeState`, `period`, and `render()`.
- Produces: `.defect-period-select` with the same preset/custom behavior.

- [x] Replace the three defect period buttons with one select.
- [x] Keep device/region mode controls, date range, and period select on one line.
- [x] Preserve chart redraw behavior for preset and manual date changes.

### Task 4: Verification

**Files:**
- Test: `页面效果图/01-项目统计首页.html`
- Test: `页面效果图/03-缺陷分析.html`
- Test: `页面效果图/09-设备质量分析.html`
- Test: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: all updated HTML, CSS, and JavaScript.
- Produces: syntax, structure, interaction, and rendering verification results.

- [x] Parse all updated scripts with Node.js syntax validation.
- [x] Verify each target exposes one date range and one period select with the required options.
- [x] Exercise preset and custom-date changes in a browser.
- [x] Render all three pages at the annotated viewport and 1440×900 and inspect for overflow.
- [x] Run `git diff --check` on the changed files.
