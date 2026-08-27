# “订单编号”统一为“模板名称” Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将页面原型中的完整词组“订单编号”精确替换为“模板名称”，且不改变其他订单相关文案或业务结构。

**Architecture:** 对 `页面效果图` 下 HTML 和 JavaScript 做精确词组替换。HTML 展示文案与 JavaScript 中依赖显示文案的判断、映射和提示同步更新，避免筛选与列配置交互失效。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript、PowerShell/Node.js 静态校验

## Global Constraints

- 仅替换完整词组“订单编号”为“模板名称”。
- 不修改其他包含“订单”的文案、文件名、链接、内部字段与数据值。
- 不调整布局、样式、字段顺序或功能。

---

### Task 1: 精确替换页面及脚本文案

**Files:**
- Modify: `页面效果图/*.html`
- Modify: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: 页面已有标签、表头、占位符、辅助属性及按显示文案匹配的 JavaScript 逻辑。
- Produces: 统一使用“模板名称”的展示和交互文案。

- [ ] **Step 1: 记录替换前基线**

 运行 `rg -o --glob '*.html' --glob '*.js' '订单编号' 页面效果图`，确认所有待修改位置。

- [ ] **Step 2: 执行精确词组替换**

 仅将每个完整的 `订单编号` 子串替换为 `模板名称`，不改动相邻的其他“订单”文案、内部键名和数据值。

- [ ] **Step 3: 检查词组残留与范围**

 运行 `rg -n --glob '*.html' --glob '*.js' '订单编号' 页面效果图`，预期无输出；审阅差异，预期每项业务页面差异均仅为该词组替换。

- [ ] **Step 4: 校验脚本与链接**

 运行 `node --check 页面效果图/spc-prototype.js`，并提取所有 HTML 内联脚本进行 `node --check`；扫描本地 HTML 链接，确认没有新增缺失链接。

- [ ] **Step 5: 汇报结果**

 汇总修改文件数、替换次数、残留扫描、语法检查和链接检查结果，不提交或覆盖用户已有页面改动。
