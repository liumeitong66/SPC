# Statistical Mouth Final Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一所有统计口径为机器判定、一次复判、最终复判，并统一全平台复判字段文案。

**Architecture:** 保留内部 `second` 数据键和 URL 参数，通过现有 segmented 组件增加第三个入口。共享页面继续使用 `mouthData()` 派生最终复判数据，独立页面补齐对应数据集和渲染逻辑。

**Tech Stack:** 原生 HTML、CSS、JavaScript。

## Global Constraints

- 用户可见文案不得再出现“二次复判”。
- 统计口径顺序固定为机器判定、一次复判、最终复判。
- 内部 `second` 键、查询参数和数据字段保持不变。
- 相同 segmented 组件结构和样式保持一致。
- 不修改无关字段、数据和交互。

---

### Task 1: 补齐四处统计口径

**Files:**
- Modify: `页面效果图/01-项目统计首页.html`
- Modify: `页面效果图/01A-项目明细.html`
- Modify: `页面效果图/03-缺陷分析.html`
- Modify: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: `data-mouth`、`data-defect-mouth`、`mouthData()`、`setMouth()`。
- Produces: 使用内部值 `second` 的“最终复判”入口。

- [ ] **Step 1: 添加第三个 segmented 选项**

在四处统计口径末尾增加内部值为 `second` 的“最终复判”。

- [ ] **Step 2: 补齐缺陷分析最终复判数据**

在 `mouthDatasets` 中增加 `final` 数据集，并由 `data-defect-mouth="final"` 驱动。

- [ ] **Step 3: 补齐项目详情数据联动**

依据当前口径计算板卡、器件指标和设备良率，点击 segmented 后重新渲染。

### Task 2: 统一最终复判文案

**Files:**
- Modify: `页面效果图/01A-项目明细.html`
- Modify: `页面效果图/01B-订单PCB详情.html`
- Modify: `页面效果图/02-单板查询与结果追溯.html`
- Modify: `页面效果图/02B-单板记录详情.html`
- Modify: `页面效果图/03A-缺陷分析详情.html`
- Modify: `页面效果图/04-误报分析.html`
- Modify: `页面效果图/04A-不良导出.html`
- Modify: `页面效果图/13A-告警规则详情.html`
- Modify: `页面效果图/13B-新增告警规则.html`
- Modify: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: 现有页面文案与 `second` 数据值。
- Produces: 全平台统一的“最终复判”用户文案。

- [ ] **Step 1: 替换用户可见名称**

将所有“二次复判”标签、表头、选项、提示和可访问文本改为“最终复判”。

- [ ] **Step 2: 保留内部字段**

确认 `second`、`secondReviewer` 等内部字段和 URL 参数未被改名。

### Task 3: 验证

**Files:**
- Test: `页面效果图/*.html`
- Test: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: 修改后的静态页面和脚本。
- Produces: 文案、结构、脚本语法和格式检查结果。

- [ ] **Step 1: 检查四处统计口径结构**

确认每处均包含 `original`、`review`、`second` 三项。

- [ ] **Step 2: 检查旧文案**

全局搜索“二次复判”，预期无用户可见结果。

- [ ] **Step 3: 检查脚本与格式**

使用 `node --check` 校验共享脚本和所有 HTML 内联脚本，并运行 `git diff --check`。
