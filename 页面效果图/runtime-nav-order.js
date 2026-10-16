(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const items = [...nav.children];
  const alert = items.find(item => item.matches('.nav-item,.item') && item.textContent.includes('告警分析'));
  if (!alert) return;
  let runtime = items.find(item => item.matches('.nav-item,.item') && item.textContent.includes('设备运行监控'));
  if (!runtime) {
    runtime = document.createElement('a');
    runtime.className = alert.className.replace(/\bactive\b/g, '').trim();
    runtime.href = '07-数据上传监控.html';
    const iconClass = alert.querySelector('.ico,.nav-icon')?.className || 'ico nav-icon';
    runtime.innerHTML = `<span class="${iconClass}">▧</span><span class="sidebar-menu-label">设备运行监控</span>`;
    runtime.title = '设备运行监控';
    runtime.setAttribute('aria-label', '设备运行监控');
  }
  if (alert.nextElementSibling !== runtime) alert.after(runtime);
})();
