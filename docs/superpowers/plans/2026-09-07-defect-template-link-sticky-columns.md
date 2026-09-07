# Defect Template Link And Sticky Columns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make template names the detail-page entry, remove the operation column, and keep the first three list columns fixed during horizontal scrolling.

**Architecture:** Keep the existing single-page HTML and dynamic renderer. Update both fallback table markup and renderer output, then apply page-scoped sticky-column CSS that works after the shared selectable-export enhancement injects the checkbox column.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js syntax validation

## Global Constraints

- Do not change `03A-缺陷分析详情.html` content or pass template-specific query parameters.
- Keep the existing filter, sorting, display-column, export-selection, pagination, and statistical-mouth behavior.
- Keep all content within the table container at the annotated viewport size.

---

### Task 1: Update defect statistics table entry and columns

**Files:**
- Modify: `页面效果图/03-缺陷分析.html`

**Interfaces:**
- Consumes: existing `renderDefectTable()` and shared selectable-export enhancement.
- Produces: `.defect-template-link` anchors and a table without an operation column.

- [x] **Step 1: Update renderer output**

Render template cells as `<a class="defect-template-link" href="03A-缺陷分析详情.html">...</a>` and remove the operation header/cell.

- [x] **Step 2: Update fallback markup**

Apply the same anchor and column structure to the static table markup.

- [x] **Step 3: Add fixed-column styling**

Set sticky offsets to `0`, `44px`, and `104px`, and use widths `44px`, `60px`, and `180px` for selection, sequence, and template name.

- [x] **Step 4: Validate**

Run `node --check` against the inline script extracted from `页面效果图/03-缺陷分析.html`, verify the detail link count and absence of the operation column, and run `git diff --check` for the page.
