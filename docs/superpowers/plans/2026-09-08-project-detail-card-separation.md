# Project Detail Card Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the project-detail mouth selector, split device distribution and yield comparison into separate cards, and synchronize shortened review labels with the PCB detail page.

**Architecture:** Keep the existing data renderers and `data-*` targets. Change only the project-detail DOM hierarchy and page-scoped CSS, then update static labels in the project PCB table and PCB detail fields.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js syntax validation

## Global Constraints

- Keep project-detail values on the current first-review dataset after removing the selector.
- Preserve chart hover, vertical scrolling, filters, table links, and URL parameters.
- Keep the two chart cards side by side at 1440×900 and stack them below 1100px.

---

### Task 1: Restructure project-detail cards

**Files:**
- Modify: `页面效果图/01A-项目明细.html`

**Interfaces:**
- Consumes: `[data-device-pie]`, `[data-device-pie-legend]`, and `[data-device-yield-chart]` render targets.
- Produces: `.device-analysis-grid`, `.device-distribution-card`, and `.device-yield-card` layout containers.

- [x] Remove `.project-mouth-global` markup.
- [x] Replace the combined device panel with two sibling card sections.
- [x] Add desktop two-column and narrow-screen stacked layout rules.

### Task 2: Synchronize review labels

**Files:**
- Modify: `页面效果图/01A-项目明细.html`
- Modify: `页面效果图/01B-订单PCB详情.html`

**Interfaces:**
- Consumes: existing first and final review data fields.
- Produces: consistent visible labels without changing data keys or query parameters.

- [x] Rename the four table headers in the project PCB list.
- [x] Rename the matching result and personnel labels in the PCB detail page.

### Task 3: Validate

**Files:**
- Test: `页面效果图/01A-项目明细.html`
- Test: `页面效果图/01B-订单PCB详情.html`

**Interfaces:**
- Consumes: both updated HTML files.
- Produces: syntax and structural verification output.

- [x] Parse all inline scripts with Node.js syntax validation.
- [x] Verify the selector is absent, both chart targets exist in separate cards, and old review labels are absent from the requested locations.
- [x] Run `git diff --check` for both pages.
