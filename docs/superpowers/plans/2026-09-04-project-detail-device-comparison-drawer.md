# Project Detail Device Comparison Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stacked device-table-to-PCB-table interaction with a desktop split workspace that compares devices on the left and drills into the selected device’s PCB records on the right.

**Architecture:** Keep the implementation self-contained in the existing static project-detail HTML. Reuse the current generated `deviceStats` and PCB record data, introduce a single selected-device state, and render the device comparison and PCB drawer from that state so filters, row selection, and drawer content stay synchronized.

**Tech Stack:** Static HTML, CSS, browser JavaScript, existing `spc-common.css` and `spc-prototype.js`.

## Global Constraints

- Modify only `页面效果图/01A-项目明细.html` for the product implementation.
- Use 1440×900 as the primary design and acceptance viewport.
- Keep true left/right columns at 1440×900, 1766×1272, and 1920×1080.
- Stack device comparison above PCB drill-down only at viewport widths of 1200px or less.
- Keep filters, export actions, PCB data, status copy, and detail links available.
- Keep horizontal scrolling inside the device comparison table and vertical scrolling inside the PCB drill-down list.
- Do not change shared component styles or unrelated dirty-worktree changes.

---

### Task 1: Build the split comparison workspace

**Files:**
- Modify: `页面效果图/01A-项目明细.html:9-150`

**Interfaces:**
- Consumes: existing `project`, `deviceStats`, `pcbRows`, `selectedResults()`, `barcodeInput`, `deviceSelect`, and `resultControl` values in the page script.
- Produces: `selectedDeviceSn: string`, `drawerOpen: boolean`, `renderWorkspace(): void`, and `selectDevice(sn: string): void`.

- [ ] **Step 1: Run the pre-change structural check**

Run:

```powershell
rg -n "device-panel|pcb-panel|data-project-device-rows|data-project-pcb-rows" "页面效果图/01A-项目明细.html"
```

Expected: the page contains separate stacked `device-panel` and `pcb-panel` sections and therefore does not yet satisfy the split-workspace design.

- [ ] **Step 2: Replace the stacked page structure**

In `页面效果图/01A-项目明细.html`, replace the two panel sections and the filter block between them with one `project-analysis-workspace` containing:

```html
<section class="panel project-analysis-panel">
  <div class="phead">
    <div class="phead-title"><b>设备质量对比</b></div>
    <div class="tools"><button class="btn">导出设备明细</button></div>
  </div>
  <div class="project-analysis-body">
    <div class="device-comparison-pane">...</div>
    <aside class="pcb-drilldown-pane" data-pcb-drawer>...</aside>
  </div>
</section>
```

Move the existing time range, board barcode, device SN, detection-result, reset, and query controls into the PCB drill-down pane above its PCB list. Keep “重置” before “查询”.

- [ ] **Step 3: Add scoped responsive styles**

Add styles scoped to the project-detail page:

```css
.project-analysis-panel{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.project-analysis-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,65fr) minmax(360px,35fr);gap:12px;padding:12px}
.device-comparison-pane,.pcb-drilldown-pane{min-width:0;min-height:0;background:#fff;border:1px solid var(--line);border-radius:6px;overflow:hidden}
.device-comparison-pane{display:flex;flex-direction:column}
.pcb-drilldown-pane{display:flex;flex-direction:column}
.device-comparison-scroll{flex:1;min-height:0;overflow:auto}
.pcb-drilldown-list{flex:1;min-height:0;overflow:auto}
.project-analysis-panel.drawer-closed .project-analysis-body{grid-template-columns:minmax(0,1fr)}
.project-analysis-panel.drawer-closed .pcb-drilldown-pane{display:none}
@media(max-width:1200px){.project-analysis-body{grid-template-columns:1fr}.project-analysis-panel.drawer-closed .project-analysis-body{grid-template-columns:1fr}}
```

At 1440×900, keep the filter controls compact enough to fit the 35% pane by using wrapping two-column fields and a full-width action row instead of shrinking text or allowing overflow.

- [ ] **Step 4: Centralize selection and rendering**

Introduce state and functions with these exact responsibilities:

```js
let selectedDeviceSn = deviceStats.reduce((worst, item) => item.rate < worst.rate ? item : worst, deviceStats[0]).sn;
let drawerOpen = true;

const selectDevice = sn => {
  selectedDeviceSn = sn;
  drawerOpen = true;
  deviceSelect.value = sn;
  renderWorkspace();
};

const renderWorkspace = () => {
  renderDeviceComparison();
  renderPcb(selectedDeviceSn);
  analysisPanel.classList.toggle('drawer-closed', !drawerOpen);
};
```

Render every device row with the same `data-device-row` value used by its device-name and “查看 PCB” controls. Apply the existing selected-row background to only the current device. Render the drawer header from the selected device’s name, SN, yield, and DPPM.

- [ ] **Step 5: Synchronize filters and drawer controls**

Wire interactions as follows:

```js
devicePane.addEventListener('click', event => {
  const trigger = event.target.closest('[data-select-device]');
  if (trigger) selectDevice(trigger.dataset.selectDevice);
});

drawerClose.addEventListener('click', () => {
  drawerOpen = false;
  analysisPanel.classList.add('drawer-closed');
});

deviceSelect.addEventListener('change', () => {
  selectedDeviceSn = deviceSelect.value || selectedDeviceSn;
  renderPcb(deviceSelect.value);
});
```

The query action applies time, barcode, device SN, and result filters to the PCB list. Reset restores the original date range and empty barcode/result filters, selects the default anomalous device, and opens the drawer.

- [ ] **Step 6: Add honest empty and status states**

When the filtered PCB array is empty, render:

```html
<div class="pcb-empty">当前设备暂无符合条件的 PCB</div>
```

Show device judgments with both a colored dot and one of the visible labels “正常”, “关注”, or “异常”. Do not use color alone.

- [ ] **Step 7: Run static and script validation**

Run:

```powershell
rg -n "project-analysis-body|device-comparison-pane|pcb-drilldown-pane|data-select-device|renderWorkspace" "页面效果图/01A-项目明细.html"
git diff --check -- "页面效果图/01A-项目明细.html"
```

Then extract each inline script body and pass it to `new Function(...)` in Node. Expected: all selectors are present, all inline scripts parse, and `git diff --check` reports no whitespace errors.

- [ ] **Step 8: Verify layout and interaction at required viewports**

Open `页面效果图/01A-项目明细.html` at 1440×900, 1766×1272, and 1920×1080. At each size verify:

- device comparison is left and PCB drill-down is right;
- no page-level horizontal or vertical overflow is introduced;
- selecting AOI-01, AOI-03, and AOI-04 updates the selected row, drawer summary, and PCB list;
- closing the drawer expands the device comparison to full width;
- query and reset preserve the defined selection behavior.

At 1200px wide, verify the panes stack with device comparison above PCB drill-down and all controls remain readable.

- [ ] **Step 9: Commit the implementation**

```powershell
git add -- "页面效果图/01A-项目明细.html"
git commit -m "feat: redesign project detail device drilldown"
```
