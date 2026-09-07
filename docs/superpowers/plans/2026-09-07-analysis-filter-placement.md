# Analysis Filter Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将误报分析与不良分析的查询条件移动到对应列表面板内部，并统一标题、查询、导出、表格的垂直顺序。

**Architecture:** 两个页面保留各自现有脚本和数据结构，直接调整静态 DOM 顺序与页面内样式。删除加载时将筛选器提到面板外的包装逻辑，避免脚本再次覆盖新布局。

**Tech Stack:** 原生 HTML、CSS、JavaScript。

## Global Constraints

- 两页结构和样式必须一致。
- 筛选按钮仅保留“重置、查询”，且顺序不变。
- 导出按钮不得进入筛选区。
- 查询区不得显示独立外框或圆角，输入控件自身边框保持不变。
- 查询区与导出按钮区之间保持 8px 垂直间距。
- 除条码号文案与示例数据外，不修改其他业务数据、表格列和分页。

---

### Task 1: 同步调整两页工作区结构

**Files:**
- Modify: `页面效果图/04-误报分析.html`
- Modify: `页面效果图/04A-不良导出.html`

**Interfaces:**
- Consumes: 现有 `data-query-input`、`data-list-*`、`data-export-*` 钩子。
- Produces: 左右面板内部的查询区和独立 `.export-actions-row`。

- [x] **Step 1: 调整左侧查询区**

保留 `.tree-filters` 在 `.tree-panel` 标题下方，删除 `data-query-label` 标签节点。

- [x] **Step 2: 调整右侧标题、查询与导出顺序**

将 `.component-toolbar` 仅用于标题；其后依次放置 `.component-list-filters`、`.export-actions-row` 和表格。

- [x] **Step 3: 删除运行时外置筛选器逻辑**

删除创建 `.workspace-column` 并将筛选器移动到面板之前的脚本。

- [x] **Step 4: 校正自适应样式**

让工作区直接承载两个面板；移除查询区外框，在查询区与导出行之间增加 8px 留白，表格区域使用剩余空间并保持内部滚动。

- [x] **Step 5: 校验**

运行内联脚本语法检查、`git diff --check`，并确认两页的关键 DOM 顺序一致。

### Task 2: 统一条码号字段与示例数据

**Files:**
- Modify: `页面效果图/04-误报分析.html`
- Modify: `页面效果图/04A-不良导出.html`

**Interfaces:**
- Consumes: 项目详情页面条码号格式与表格原生 `title` 悬停展示规则。
- Produces: 两页一致的条码号筛选字段、表头和多条码示例数据。

- [x] **Step 1: 统一字段文案**

将筛选标签和表头改为“条码号”，输入提示改为“输入条码号”。

- [x] **Step 2: 对齐项目详情条码数据**

按 `SY-设备编号-项目编号-序号` 生成条码；同一 PCB 的多个条码使用英文逗号连接。

- [x] **Step 3: 保留完整值悬停展示**

条码单元格继续单行省略，通过 `title` 和 `aria-label` 提供完整条码号。

- [x] **Step 4: 校验**

运行内联脚本语法检查、字段文案检查、条码格式检查与 `git diff --check`。
