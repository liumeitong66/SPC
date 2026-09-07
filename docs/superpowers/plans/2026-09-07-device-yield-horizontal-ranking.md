# Device Yield Horizontal Ranking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将设备分析页设备维度的良率对比改为可纵向滚动的横向前十排名。

**Architecture:** 保留 `comparisonChartMarkup(type, showAll)` 作为唯一图表数据入口，在 `type === 'device'` 时生成横向 SVG 与滚动内容容器；区域维度继续走现有纵向图分支。`renderProjectComparison` 根据当前维度切换专用状态类，CSS 仅对设备横向图启用纵向滚动。

**Tech Stack:** 原生 HTML、CSS、JavaScript、内联 SVG。

## Global Constraints

- 仅修改设备维度，区域维度保持现状。
- 保留前 10 名、降序、统计口径和现有筛选交互。
- 外层卡片高度不变，图表只允许内部纵向滚动。
- 不修改设备明细表和业务数据。

---

### Task 1: 横向设备良率图与滚动状态

**Files:**
- Modify: `页面效果图/spc-prototype.js:717-784`

**Interfaces:**
- Consumes: `comparisonDataset(type)` 返回的 `{ name, area, value }[]`，以及 `currentMouth`。
- Produces: `comparisonChartMarkup('device', false)` 返回带 `.comparison-chart-scroll-content` 的横向 SVG；`renderProjectComparison()` 为设备图切换 `.is-device-horizontal`。

- [ ] **Step 1: 添加设备图专用滚动样式**

在公共注入样式中增加 `.is-device-horizontal`，设置 `overflow-x:hidden`、`overflow-y:auto`、稳定滚动槽，并让内部 SVG 保持按设备行数计算的高度。

- [ ] **Step 2: 实现横向设备排名 SVG**

在项目横向图分支之后增加 `type === 'device'` 分支：使用 88%–100% 横轴、32px 行高、左侧“区域 · 设备名称”、蓝色轨道条和右侧两位小数良率。

- [ ] **Step 3: 绑定维度状态类**

在 `renderProjectComparison()` 中仅当 `type === 'device'` 时添加 `.is-device-horizontal`；区域维度移除该类并沿用原图。

- [ ] **Step 4: 运行静态校验**

运行：

```powershell
node --check 页面效果图/spc-prototype.js
git diff --check -- 页面效果图/spc-prototype.js
rg -n "is-device-horizontal|type === 'device'|设备良率排名前10名" 页面效果图/spc-prototype.js
```

预期：JavaScript 语法通过、无空白错误、设备横向分支和状态类均存在。
