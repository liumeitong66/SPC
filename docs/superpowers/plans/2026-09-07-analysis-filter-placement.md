# Analysis Filter Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将误报分析与不良分析的查询条件移动到对应列表面板内部，并统一标题、查询、导出、表格的垂直顺序。

**Architecture:** 两个页面保留各自现有脚本和数据结构，直接调整静态 DOM 顺序与页面内样式。删除加载时将筛选器提到面板外的包装逻辑，避免脚本再次覆盖新布局。

**Tech Stack:** 原生 HTML、CSS、JavaScript。

## Global Constraints

- 两页结构和样式必须一致。
- 筛选按钮仅保留“重置、查询”，且顺序不变。
- 导出按钮不得进入筛选区。
- 不修改业务数据、表格列和分页。

---

### Task 1: 同步调整两页工作区结构

**Files:**
- Modify: `页面效果图/04-误报分析.html`
- Modify: `页面效果图/04A-不良导出.html`

**Interfaces:**
- Consumes: 现有 `data-query-input`、`data-list-*`、`data-export-*` 钩子。
- Produces: 左右面板内部的查询区和独立 `.export-actions-row`。

- [ ] **Step 1: 调整左侧查询区**

保留 `.tree-filters` 在 `.tree-panel` 标题下方，删除 `data-query-label` 标签节点。

- [ ] **Step 2: 调整右侧标题、查询与导出顺序**

将 `.component-toolbar` 仅用于标题；其后依次放置 `.component-list-filters`、`.export-actions-row` 和表格。

- [ ] **Step 3: 删除运行时外置筛选器逻辑**

删除创建 `.workspace-column` 并将筛选器移动到面板之前的脚本。

- [ ] **Step 4: 校正自适应样式**

让工作区直接承载两个面板；筛选区与导出行固定高度，表格区域使用剩余空间并保持内部滚动。

- [ ] **Step 5: 校验**

运行内联脚本语法检查、`git diff --check`，并确认两页的关键 DOM 顺序一致。
