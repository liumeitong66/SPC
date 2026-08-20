# Task 1 — 统一导航与共享交互

## Implementation

- Updated the shared `pageMap` to use `不良分析`, and added `品质预警` plus `告警规则详情`.
- Normalized legacy sidebar labels at load time: `项目统计` → `订单统计`, `设备质量分析` → `设备分析`, and `不良导出` → `不良分析`.
- Removed `数据上传监控` from runtime navigation and role-permission menus without deleting `07-数据上传监控.html`.
- Ensured every shared-sidebar page receives the required `设备分析`、`不良分析`、`品质预警` entries in the required order; platform management remains `设备管理`、`用户管理`、`角色管理`、`个人中心`.
- Changed the former export page's body identifier and visible title to `不良分析`.
- Kept management table scrolling internal and made the management navigation independently scrollable.

## Tests / results

- `node --check 页面效果图/spc-prototype.js` — passed.
- Static navigation mapping/removal assertions — passed: all required map labels present; no legacy `pageMap` entries; upload-monitor removal present.
- `git diff --check` — passed (no whitespace errors).

## Changed files

- `页面效果图/spc-prototype.js`
- `页面效果图/management-common.css`
- `页面效果图/04A-不良导出.html`

## Self-review

- The shared initializer runs before navigation click handlers, so normalized and injected items receive the same keyboard and mouse navigation behavior.
- `normalizeManagementNavigation()` preserves the requested management-menu order after removing legacy entries.
- No changes delete or rename the existing upload-monitoring file.

## Concerns

- Legacy sidebar markup remains in some static source pages but is deterministically normalized before users can interact with it; this preserves existing page files while making all rendered navigation consistent.

## Fix follow-up

- Included the existing `页面效果图/13-品质预警.html` in the Task 1 fix commit so the new navigation destination is present in repository history; its page design was not changed.
- Added the shared `.sidebar > .nav` flex and internal-scroll rule so analytics and management sidebars keep all menu entries accessible at short viewport heights.
- Removed the two reviewed trailing-whitespace lines in `04A-不良导出.html` and `spc-prototype.js`.

### Fix verification

- `node --check 页面效果图/spc-prototype.js` — passed.
- `git diff --check 45bf2c2..HEAD` — passed after the fix commit.
- Focused static check verifies the quality-alert mapping, destination file, and shared internal-navigation scrolling rule.
