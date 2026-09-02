# Account Menu and Profile Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将个人中心入口、账号摘要和退出登录统一到顶部账号菜单，并压缩个人中心资料卡。

**Architecture:** 复用所有页面加载的 `spc-prototype.js` 在运行时规范化顶部账号入口、移除侧栏个人中心项并管理菜单交互；公共视觉规则放入 `spc-common.css`。个人中心页面仅调整自身资料卡 HTML/CSS，继续复用现有修改密码弹窗。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript

## Global Constraints

- 相同组件在全部页面保持结构、尺寸、间距、颜色、圆角、状态和交互一致。
- 只实现账号菜单、侧栏入口和个人资料卡调整，不扩展真实登录流程。
- 在 1440×900 及当前浏览器尺寸下禁止横向或纵向溢出。

---

### Task 1: 公共账号菜单与侧栏清理

**Files:**
- Modify: `页面效果图/spc-common.css`
- Modify: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: 每页现有 `.account-entry`、`.account-avatar`、`.account-copy`、`.account-chevron` 和指向 `12-个人中心.html` 的侧栏 `.nav-item`。
- Produces: `initializeAccountMenu(): void`，以及 `.account-menu-wrap`、`.account-menu`、`.account-menu-summary`、`.account-menu-action` 公共结构。

- [ ] **Step 1: 添加公共菜单样式**

```css
.account-menu-wrap{position:relative}
.account-menu{position:absolute;right:0;top:calc(100% + 8px)}
.account-menu[hidden]{display:none}
```

- [ ] **Step 2: 实现公共菜单初始化**

```js
function initializeAccountMenu() {
  document.querySelectorAll('.nav-item[href="12-个人中心.html"]').forEach(item => item.remove());
  const entry = document.querySelector('.account-entry');
  if (!entry) return;
  // 将入口变成可展开按钮，并挂载账号摘要、个人中心和退出登录。
}
```

- [ ] **Step 3: 添加关闭与退出确认行为**

```js
document.addEventListener('click', event => {
  if (!wrap.contains(event.target)) menu.hidden = true;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') menu.hidden = true;
});
```

- [ ] **Step 4: 运行静态检查**

Run: `node --check 页面效果图/spc-prototype.js`
Expected: 无语法错误。

### Task 2: 个人中心资料卡压缩

**Files:**
- Modify: `页面效果图/12-个人中心.html`

**Interfaces:**
- Consumes: 现有 `[data-password-open]` 修改密码按钮和密码弹窗。
- Produces: `.profile-account-fields` 单行账号信息布局。

- [ ] **Step 1: 替换资料卡结构**

```html
<div class="identity">
  <div class="profile-account-fields">
    <span><small>账号名称</small><b>admin</b></span>
    <span><small>角色名称</small><b>平台管理员</b></span>
  </div>
  <button class="btn" type="button" data-password-open>修改密码</button>
</div>
```

- [ ] **Step 2: 调整响应式样式**

```css
.identity{justify-content:space-between}
.profile-account-fields{display:flex;align-items:center;gap:48px}
@media(max-width:760px){.identity{flex-wrap:wrap}}
```

- [ ] **Step 3: 核对修改密码入口**

Run: `rg -n "data-password-open|profile-account-fields" 页面效果图/12-个人中心.html`
Expected: 两个选择器均存在，原密码弹窗逻辑仍可定位按钮。

### Task 3: 全局一致性与边界验证

**Files:**
- Test: `页面效果图/*.html`
- Test: `页面效果图/spc-common.css`
- Test: `页面效果图/spc-prototype.js`

**Interfaces:**
- Consumes: Task 1 和 Task 2 的公共结构。
- Produces: 静态检查与 1440×900 页面验收结果。

- [ ] **Step 1: 检查遗留侧栏入口**

Run: `rg -n "nav-item[^>]*12-个人中心.html" 页面效果图 -g "*.html"`
Expected: 源 HTML 可以保留旧标记，但加载后由公共脚本统一移除；不得存在绕过公共脚本的页面。

- [ ] **Step 2: 检查所有页面加载公共脚本**

Run: `rg -L "spc-prototype.js" 页面效果图 -g "*.html"`
Expected: 需要统一导航的主页面均加载公共脚本。

- [ ] **Step 3: 浏览器验收**

在个人中心页与一个非个人中心页分别以 1440×900 检查：侧栏无个人中心、账号菜单不越界、操作项可用、资料卡不溢出。

- [ ] **Step 4: 提交实现**

```bash
git add 页面效果图/spc-common.css 页面效果图/spc-prototype.js 页面效果图/12-个人中心.html
git commit -m "feat: unify account menu and profile layout"
```
