(() => {
  const nav = document.querySelector('.sidebar .nav');
  if (!nav || nav.querySelector('.sidebar-branch')) return;
  const links = [...nav.querySelectorAll('a')];
  const find = label => links.find(link => link.textContent.trim() === label || link.textContent.trim().endsWith(label));
  const component = find('不良分析') || find('器件分析');
  const falseAnalysis = find('误报分析');
  if (component) {
    const active = component.classList.contains('active') || falseAnalysis?.classList.contains('active');
    component.classList.toggle('active', !!active);
    component.href='04A-不良导出.html';
    component.title='器件分析';component.setAttribute('aria-label','器件分析');
    const label=component.querySelector('.sidebar-menu-label');
    if(label)label.textContent='器件分析';else [...component.childNodes].filter(node=>node.nodeType===3).forEach(node=>node.textContent='器件分析');
  }
  falseAnalysis?.remove();
  const alert = find('告警分析');
  let runtime = find('设备运行监控');
  if (!runtime && alert) {
    runtime = document.createElement('a');
    runtime.className = alert.className.replace(/\bactive\b/g, '').trim();
    runtime.href = '07-数据上传监控.html';
    runtime.innerHTML = '<span class="ico nav-icon">▧</span><span class="sidebar-menu-label">设备运行监控</span>';
    runtime.title = '设备运行监控';
    runtime.setAttribute('aria-label', '设备运行监控');
  }
  const key = 'spc-sidebar-groups-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) {}
  document.querySelectorAll('.sidebar .group,.sidebar .nav-label').forEach(label => {
    if (['质量分析', '数据管理', '系统管理'].includes(label.textContent.trim())) label.remove();
  });
  const fragment = document.createDocumentFragment();
  [
    ['detection', '检测分析', [...['项目统计', '设备分析', '缺陷分析'].map(find), component]],
    ['monitor', '监控告警', [runtime, alert]],
    ['data', '数据管理', ['单板查询', '设备管理', '告警管理'].map(find)],
    ['system', '系统管理', ['用户管理', '角色管理'].map(find)]
  ].forEach(([id, label, children]) => {
    children = children.filter(Boolean);
    if (!children.length) return;
    const branch = document.createElement('div');
    branch.className = 'sidebar-branch';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sidebar-branch-toggle';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-controls', `sidebar-${id}`);
    const icon = children[0].querySelector('.ico,.nav-icon')?.cloneNode(true);
    if (icon) button.append(icon);
    const text = document.createElement('span');
    text.className = 'sidebar-menu-label';
    text.textContent = label;
    button.append(text);
    const arrow = document.createElement('span');
    arrow.className = 'sidebar-branch-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    button.append(arrow);
    const list = document.createElement('div');
    list.className = 'sidebar-branch-items';
    list.id = `sidebar-${id}`;
    children.forEach(link => list.append(link));
    const render = open => {
      button.setAttribute('aria-expanded', String(open));
      list.hidden = !open;
    };
    render(children.some(link => link.classList.contains('active')) || saved[id] !== false);
    button.addEventListener('click', () => {
      const sidebar = nav.closest('.sidebar');
      const collapsed = sidebar.classList.contains('is-collapsed');
      if (collapsed) sidebar.querySelector('.sidebar-toggle')?.click();
      const open = collapsed || button.getAttribute('aria-expanded') !== 'true';
      render(open);
      saved[id] = open;
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch (_) {}
    });
    branch.append(button, list);
    fragment.append(branch);
  });
  nav.prepend(fragment);
})();
