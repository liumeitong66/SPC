# Project Detail PCB Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将项目详情改造成以项目 PCB 明细为核心的统计总览，并补充项目级板卡/器件指标与设备分布饼图。

**Architecture:** 保持单 HTML 原型结构，在 `01A-项目明细.html` 内复用项目统计页的指标分组和公共筛选样式。页面脚本从现有项目、设备、PCB 模拟数据派生指标与设备分布，并统一驱动饼图、筛选和 PCB 表格。

**Tech Stack:** HTML5、CSS Grid/Flex、原生 JavaScript、SVG。

## Global Constraints

- 以 1440×900 为主要验收尺寸。
- 查询筛选区复用现有公共组件，末尾只能有“重置”“查询”。
- 页面和卡片不得横向溢出；宽表只允许在表格容器内部滚动。
- 不修改现有模拟数据的业务含义。

---

### Task 1: 重构页面信息架构

**Files:**
- Modify: `页面效果图/01A-项目明细.html`

**Interfaces:**
- Consumes: `projects`、`project.devices`、`pcbRows`。
- Produces: `[data-metric-group]`、`[data-device-pie]`、`[data-project-pcb-rows]` 页面挂载点。

- [ ] **Step 1: 替换设备对比与下钻 DOM**

删除 `.project-analysis-body` 的设备对比/右侧抽屉，按“指标组、设备分布、筛选区、PCB 列表”顺序建立结构。

- [ ] **Step 2: 建立 1440×900 布局样式**

复用项目统计页 `.metric-group/.metrics/.metric` 规格；饼图使用固定紧凑高度；PCB 表格容器使用 `flex:1; min-height:0; overflow:auto`。

- [ ] **Step 3: 检查结构关键字**

Run: `rg -n "板卡统计|器件统计|检测设备分布|设备SN|项目检测PCB" "页面效果图/01A-项目明细.html"`

Expected: 五类关键结构均存在，设备质量对比和下钻面板不存在。

### Task 2: 实现统计、饼图和筛选交互

**Files:**
- Modify: `页面效果图/01A-项目明细.html`

**Interfaces:**
- Consumes: `project`、`deviceStats`、`pcbRows`。
- Produces: `renderMetrics()`、`renderDevicePie()`、`renderPcbTable()`、`applyFilters()`。

- [ ] **Step 1: 派生项目指标**

由项目数据生成 PCB 检测数、板卡直通率、板卡 NG 率、板卡不良率，以及器件检测数、器件直通率、器件 NG 率、器件不良率。

- [ ] **Step 2: 渲染设备分布饼图**

使用 SVG 圆环扇区按设备 PCB 数量计算占比；每个扇区带 `<title>`，内容为设备名称、设备 SN、数量和占比，保证原生鼠标悬停提示。饼图右侧增加复用项目统计页视觉规范的设备良率横向条形图，直接展示当前项目全部设备，不提供时间或“查看全部”控件，超出高度时在图表内部纵向滚动。

- [ ] **Step 3: 实现 PCB 列表筛选**

时间范围、条码号、设备 SN、检测结果共同过滤 `pcbRows`；设备 SN 使用输入框，并通过 `localStorage` 保存和展示最近 5 条查询记录；重置恢复默认值。表格新增设备 SN 列并沿用现有详情链接。每个 PCB 只生成一行，多个条码号使用英文逗号连接，并写入单元格 `title` 供悬停查看完整内容。

- [ ] **Step 4: 验证脚本解析**

Run: `node -e "const fs=require('fs');const s=fs.readFileSync('页面效果图/01A-项目明细.html','utf8');let p=0,n=0;while((p=s.indexOf('<script',p))>=0){const a=s.indexOf('>',p)+1,b=s.indexOf('</script>',a);if(b<0)throw Error('unclosed script');const x=s.slice(a,b);if(x.trim()){new Function(x);n++}p=b+9}console.log(n)"`

Expected: 输出 `1` 且退出码为 0。

### Task 3: 完成边界与一致性验收

**Files:**
- Verify: `页面效果图/01A-项目明细.html`
- Reference: `页面效果图/01-项目统计首页.html`
- Reference: `页面效果图/spc-common.css`

**Interfaces:**
- Consumes: Task 1 和 Task 2 的最终页面。
- Produces: 可交付的静态 HTML。

- [ ] **Step 1: 核对组件一致性**

比对项目统计页的指标名称、卡片层级、字号、间距、边框及筛选按钮顺序。

- [ ] **Step 2: 核对布局边界**

确认 1440×900 下主内容区宽度扣除 200px 侧栏和页面内边距后，所有卡片宽度为 `minmax(0,1fr)`；表格宽度只在 `.pcb-table-scroll` 内产生横向滚动。

- [ ] **Step 3: 执行最终静态检查**

Run: `git diff --check -- "页面效果图/01A-项目明细.html"`

Expected: 无空白错误。
