(() => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  sidebar.querySelectorAll('.nav .item').forEach(item => {
    const label = item.textContent.replace(item.querySelector('.ico')?.textContent || '', '').trim();
    item.title = label;
    item.setAttribute('aria-label', label);
    [...item.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()).forEach(node => {
      const span = document.createElement('span');
      span.className = 'sidebar-menu-label';
      node.replaceWith(span);
      span.appendChild(node);
    });
  });
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  sidebar.querySelector('.brand').after(toggle);
  const render = collapsed => {
    sidebar.classList.toggle('is-collapsed', collapsed);
    toggle.textContent = collapsed ? '»' : '«';
    toggle.title = collapsed ? '展开菜单' : '收起菜单';
    toggle.setAttribute('aria-label', toggle.title);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    window.dispatchEvent(new Event('resize'));
  };
  render(false);
  toggle.addEventListener('click', () => render(!sidebar.classList.contains('is-collapsed')));
})();
