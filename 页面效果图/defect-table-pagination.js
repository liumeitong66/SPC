document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.defect-stat-table');
  const wrap = table.closest('.table-wrap');
  const panel = wrap.closest('.table-panel');
  const main = panel.closest('.main');
  const pager = panel.querySelector('.pager');
  const size = pager.querySelector('.proto-page-size');
  if (!size) return;
  const nav = [...pager.querySelectorAll('.proto-page-nav')];
  const jump = pager.querySelector('.proto-page-jump input');
  let page = 1;
  function render() {
    const limit = parseInt(size.value, 10);
    const rows = [...table.tBodies[0].rows].filter(row => !row.hidden);
    const count = Math.max(1, Math.ceil(rows.length / limit));
    page = Math.min(count, Math.max(1, page));
    [...table.tBodies[0].rows].forEach(row => { row.style.display = 'none'; });
    rows.slice((page - 1) * limit, page * limit).forEach(row => { row.style.display = ''; });
    pager.firstElementChild.textContent = `共${rows.length}条`;
    nav[0].disabled = page === 1;
    nav[1].disabled = page === count;
    pager.querySelectorAll('.proto-page-number,.proto-page-ellipsis').forEach(button => button.remove());
    for (let index = 1; index <= count; index++) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'proto-page-number' + (index === page ? ' on' : '');
      button.textContent = index;
      button.onclick = () => { page = index; render(); };
      nav[1].before(button);
    }
    const longPage = limit === 50;
    if (longPage) main.style.setProperty('overflow-y', 'auto', 'important');
    else main.style.removeProperty('overflow-y');
    if (longPage) {
      const controlsHeight = wrap.getBoundingClientRect().top - panel.getBoundingClientRect().top;
      const bottomPadding = parseFloat(getComputedStyle(main).paddingBottom);
      const height = Math.max(120, main.clientHeight - controlsHeight - pager.offsetHeight - bottomPadding - 1);
      panel.style.setProperty('flex', '0 0 auto', 'important');
      panel.style.setProperty('height', 'auto', 'important');
      wrap.style.setProperty('flex', '0 0 auto', 'important');
      wrap.style.setProperty('height', `${height}px`, 'important');
      wrap.style.setProperty('overflow', 'auto', 'important');
    } else {
      for (const element of [panel, wrap]) {
        element.style.removeProperty('flex');
        element.style.removeProperty('height');
      }
      wrap.style.removeProperty('overflow');
    }
    wrap.scrollTop = 0;
  }
  size.addEventListener('change', () => { page = 1; render(); });
  nav.forEach((button, index) => button.addEventListener('click', () => { page += index ? 1 : -1; render(); }));
  jump?.addEventListener('keydown', event => { if (event.key === 'Enter') { page = parseInt(jump.value, 10) || 1; render(); } });
  new MutationObserver(render).observe(table, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden']});
  window.addEventListener('resize', render);
  wrap.addEventListener('wheel', event => {
    if (parseInt(size.value, 10) !== 50 || event.deltaY <= 0 || event.shiftKey || Math.abs(event.deltaX) > event.deltaY) return;
    const distance = panel.getBoundingClientRect().top - main.getBoundingClientRect().top;
    if (distance <= 2 || main.scrollTop >= main.scrollHeight - main.clientHeight - 1) return;
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? main.clientHeight : 1);
    main.scrollTop += Math.min(distance, delta);
    if (delta > distance) wrap.scrollTop += delta - distance;
  }, {passive:false});
  const style = document.createElement('style');
  style.textContent = '.defect-stat-table thead th{position:sticky;top:0;z-index:2}';
  document.head.append(style);
  render();
});
