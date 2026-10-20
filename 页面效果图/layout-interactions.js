(() => {
  const page = document.body.dataset.page || (document.body.dataset.mouthPage === 'project' ? 'project-stats' : '');
  if (!['project-stats','project-detail','defect-analysis','false-analysis','defect-analysis-machine','device-runtime-monitor','alert-analysis','device-quality'].includes(page)) return;
  const key = `spc-layout:${location.pathname}`;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
  saved.charts ||= {};
  const charts = () => [...document.querySelectorAll('[data-custom-chart]')];
  const chartId = element => {
    if (!element.dataset.layoutId) element.dataset.layoutId = `chart-${charts().indexOf(element)}`;
    return element.dataset.layoutId;
  };
  const save = () => { try { localStorage.setItem(key, JSON.stringify(saved)); } catch {} };
  const clamp = (value, lower, upper) => Math.min(upper, Math.max(lower, value));
  function prepareGroup(parent) {
    if (!parent || parent.hasAttribute('data-layout-group')) return;
    const children = charts().filter(chart => chart.parentElement === parent);
    const original = children.map(child => child.getBoundingClientRect().width);
    const totalWidth = Math.max(1, original.reduce((sum, width) => sum + width, 0));
    parent.dataset.layoutGroup = '';
    parent.classList.add('shared-layout-group');
    children.forEach((child, index) => { if (!saved.charts[chartId(child)] && original[index] > 0) child.style.setProperty('--shared-chart-width', children.length > 1 ? `calc((100% - ${14 * (children.length - 1)}px) * ${(original[index] / totalWidth).toFixed(4)})` : '100%'); });
    if (children.length < 2) parent.classList.add('shared-layout-single');
    const order = saved.chartOrders?.[children[0]?.dataset.layoutGroupKey || `${page}:${parent.className}`];
    if (Array.isArray(order)) order.forEach(id => { const child = children.find(item => chartId(item) === id); if (child) parent.append(child); });
  }
  function persistOrder(parent) {
    saved.chartOrders ||= {};
    const children = charts().filter(chart => chart.parentElement === parent);
    saved.chartOrders[`${page}:${parent.className}`] = children.map(chartId);
    save();
  }
  function resizeChart(element, handle) {
    handle.addEventListener('pointerdown', event => {
      if (!document.body.classList.contains('quality-page-editor-open')) return;
      event.preventDefault(); event.stopPropagation();
      const parent = element.parentElement, start = element.getBoundingClientRect(), available = parent.getBoundingClientRect().width;
      const x = event.clientX, y = event.clientY;
      handle.setPointerCapture?.(event.pointerId);
      document.body.classList.add('quality-component-resizing');
      const move = e => {
        const width = clamp(start.width + e.clientX - x, Math.min(260, available), available);
        const height = clamp(start.height + e.clientY - y, 180, Math.max(180, window.innerHeight * 0.85));
        element.style.setProperty('width', `${Math.round(width)}px`, 'important');
        element.style.setProperty('height', `${Math.round(height)}px`, 'important');
        element.style.setProperty('flex', '0 0 auto', 'important');
      };
      const finish = () => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
        document.body.classList.remove('quality-component-resizing');
        element.dataset.layoutResized = '';
        saved.charts[chartId(element)] = { width: element.offsetWidth, height: element.offsetHeight };
        save();
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
    });
  }
  function prepareChart(element) {
    if (element.hasAttribute('data-layout-ready')) return;
    element.dataset.layoutReady = '';
    if (page === 'device-quality') { prepareGroup(element.parentElement); return; }
    const id = chartId(element), size = saved.charts[id];
    prepareGroup(element.parentElement);
    if (size && Number.isFinite(size.width) && Number.isFinite(size.height)) {
      element.dataset.layoutResized = '';
      const available = element.parentElement.getBoundingClientRect().width;
      element.style.setProperty('width', `${Math.round(clamp(size.width, Math.min(260, available), available))}px`, 'important');
      element.style.setProperty('height', `${Math.round(clamp(size.height, 180, Math.max(180, innerHeight * .85)))}px`, 'important');
      element.style.setProperty('flex', '0 0 auto', 'important');
    }
    element.style.position = 'relative';
    const drag = document.createElement('button'); drag.type = 'button'; drag.className = 'quality-component-drag shared-layout-drag'; drag.draggable = true; drag.title = '拖动调整位置'; drag.setAttribute('aria-label',drag.title); drag.textContent = '⠿';
    const resize = document.createElement('button'); resize.type = 'button'; resize.className = 'quality-component-resize shared-layout-resize'; resize.title = '拖动调整宽度和高度'; resize.setAttribute('aria-label',resize.title);
    element.append(drag, resize);
    resizeChart(element, resize);
    drag.addEventListener('click', event => event.stopPropagation());
    drag.addEventListener('dragstart', event => { if (!document.body.classList.contains('quality-page-editor-open')) { event.preventDefault(); return; } element.classList.add('quality-component-dragging'); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain','spc-chart'); });
    drag.addEventListener('dragend', () => { element.classList.remove('quality-component-dragging'); document.querySelectorAll('.quality-component-drop-before').forEach(item => item.classList.remove('quality-component-drop-before')); });
    element.addEventListener('dragover', event => { const moving = document.querySelector('.quality-component-dragging'); if (!moving || moving === element || moving.parentElement !== element.parentElement) return; event.preventDefault(); element.classList.add('quality-component-drop-before'); });
    element.addEventListener('dragleave', () => element.classList.remove('quality-component-drop-before'));
    element.addEventListener('drop', event => { const moving = document.querySelector('.quality-component-dragging'); element.classList.remove('quality-component-drop-before'); if (!moving || moving === element || moving.parentElement !== element.parentElement) return; event.preventDefault(); element.parentElement.insertBefore(moving, element); persistOrder(element.parentElement); });
  }
  function directChild(ancestor, descendant) { let node = descendant; while (node?.parentElement && node.parentElement !== ancestor) node = node.parentElement; return node?.parentElement === ancestor ? node : null; }
  function tableBlock(panel) {
    const group = charts()[0]?.parentElement;
    if (!group) return null;
    let host = group.parentElement;
    while (host && !host.contains(panel)) host = host.parentElement;
    if (!host) return null;
    const groupBlock = directChild(host, group), block = directChild(host, panel);
    return block && groupBlock && block !== groupBlock ? { host, block, groupBlock } : null;
  }
  function prepareTable(table) {
    if(document.querySelector('[data-page-visual-region]'))return;
    const panel = table.closest('section.panel,article.panel,.project-pcb-panel,.component-panel,.records,.table-panel,.alert-stats-panel');
    if (!panel || panel.hasAttribute('data-layout-table-ready')) return;
    panel.dataset.layoutTableReady = '';
    const tableId = table.dataset.layoutTableId || `table-${[...document.querySelectorAll('main table,.quality-content table')].indexOf(table)}`;
    table.dataset.layoutTableId = tableId;
    panel.classList.add('shared-layout-table');
    const head = panel.querySelector(':scope > .phead,:scope > .panel-head,:scope > .table-title,:scope > .component-toolbar,:scope > .stats-head,:scope > .pcb-toolbar') || panel;
    const handle = document.createElement('button'); handle.type = 'button'; handle.className = 'quality-component-drag shared-table-drag'; handle.draggable = true; handle.textContent = '⠿'; handle.title = '拖动调整列表位置'; handle.setAttribute('aria-label',handle.title); head.append(handle);
    handle.addEventListener('dragstart', event => { if (!document.body.classList.contains('quality-page-editor-open')) { event.preventDefault(); return; } const context = tableBlock(panel); if (!context) { event.preventDefault(); return; } window._spcTableDrag = context; context.block.classList.add('quality-component-dragging'); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain','spc-table'); });
    handle.addEventListener('dragend', () => { window._spcTableDrag?.block.classList.remove('quality-component-dragging'); window._spcTableDrag = null; });
    const context = tableBlock(panel);
    if (!context) return;
    saved.tables ||= {};
    if (saved.tables[tableId] === true) context.host.insertBefore(context.block,context.groupBlock);
    else if (saved.tables[tableId] === false) context.groupBlock.after(context.block);
    for (const target of [context.block, context.groupBlock]) {
      target.addEventListener('dragover', event => { if (window._spcTableDrag?.host === context.host) event.preventDefault(); });
      target.addEventListener('drop', event => { const moving = window._spcTableDrag; if (!moving || moving.host !== context.host || moving.block === target) return; event.preventDefault(); if (target === moving.groupBlock) { const before = event.clientY < target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2; before ? target.before(moving.block) : target.after(moving.block); } else { target.before(moving.groupBlock); } saved.tables[tableId] = !!(moving.block.compareDocumentPosition(moving.groupBlock) & Node.DOCUMENT_POSITION_FOLLOWING); save(); });
    }
  }
  function prepare() {
    charts().forEach(prepareChart);
    document.querySelectorAll('main table,.quality-content table').forEach(prepareTable);
  }
  let queued = false;
  new MutationObserver(() => { if (queued) return; queued = true; queueMicrotask(() => { queued = false; prepare(); }); }).observe(document.documentElement,{childList:true,subtree:true});
  if (page === 'device-quality') document.addEventListener('click', event => { if (event.target.closest('[data-quality-reset-page]')) { try { localStorage.removeItem(key); } catch {} } }, true);

  // Pointer dragging works with mouse/touch and does not rely on browser HTML drag events.
  let pointerDrag=null, suppressClick=false;
  const editable=()=>document.body.classList.contains('quality-page-editor-open')&&!document.body.classList.contains('quality-page-preview');
  document.addEventListener('pointerdown',event=>{
    if(!editable()||event.button!==0)return;
    const handle=event.target.closest('.quality-component-drag,.spc-metric-drag');
    const heading=event.target.closest('[data-custom-chart]>.phead,[data-custom-chart]>.panel-head,[data-custom-chart]>.export-chart-head');
    if(!handle&&(!heading||event.target.closest('button,a,input,select')))return;
    const table=handle?.closest('.shared-layout-table');
    const element=table||event.target.closest('[data-custom-chart],.spc-independent-metric,[data-custom-metric]');
    if(!element)return;
    event.preventDefault();event.stopImmediatePropagation();
    pointerDrag={element,x:event.clientX,y:event.clientY,moving:false,target:null,after:false,table:table?tableBlock(table):null};
  },true);
  document.addEventListener('dragstart',event=>{if(pointerDrag)event.preventDefault()},true);
  document.addEventListener('pointermove',event=>{
    const drag=pointerDrag;if(!drag)return;
    if(!drag.moving&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<5)return;
    drag.moving=true;event.preventDefault();drag.element.classList.add('spc-pointer-dragging');document.body.classList.add('spc-layout-drag-active');
    document.querySelectorAll('.spc-pointer-drop-before,.spc-pointer-drop-after').forEach(el=>el.classList.remove('spc-pointer-drop-before','spc-pointer-drop-after'));
    let hit=document.elementFromPoint(event.clientX,event.clientY);
    let target=hit?.closest('[data-custom-chart],.spc-independent-metric,[data-custom-metric],.shared-layout-table');
    if(drag.table)target=hit?.closest('[data-layout-group],.quality-grid,.shared-layout-table');
    if(!target||target===drag.element||drag.element.contains(target)){drag.target=null;return}
    if(!drag.table&&target.matches('.shared-layout-table')){drag.target=null;return}
    const r=target.getBoundingClientRect(),source=drag.element.getBoundingClientRect();
    const sameRow=!drag.table&&Math.abs(source.top-r.top)<Math.min(source.height,r.height)/2;
    drag.after=sameRow?event.clientX>r.left+r.width/2:event.clientY>r.top+r.height/2;
    drag.target=target;target.classList.add(drag.after?'spc-pointer-drop-after':'spc-pointer-drop-before');
    const scroller=hit?.closest('main,.quality-content');if(scroller){const b=scroller.getBoundingClientRect();if(event.clientY>b.bottom-50)scroller.scrollTop+=18;else if(event.clientY<b.top+50)scroller.scrollTop-=18}
  },{capture:true,passive:false});
  const endPointer=event=>{
    const drag=pointerDrag;if(!drag)return;pointerDrag=null;
    if(drag.moving&&drag.target&&editable()){
      const previous=drag.element.parentElement;
      if(drag.table){const target=directChild(drag.table.host,drag.target);if(target&&target!==drag.table.block){drag.after?target.after(drag.table.block):target.before(drag.table.block);saved.tables||={};const table=drag.element.querySelector('table');saved.tables[table?.dataset.layoutTableId]=!!(drag.table.block.compareDocumentPosition(drag.table.groupBlock)&Node.DOCUMENT_POSITION_FOLLOWING);save()}}
      else{drag.after?drag.target.after(drag.element):drag.target.before(drag.element);persistOrder(previous);persistOrder(drag.element.parentElement)}
      suppressClick=true;setTimeout(()=>{suppressClick=false},0);
    }
    drag.element.classList.remove('spc-pointer-dragging');document.body.classList.remove('spc-layout-drag-active');document.querySelectorAll('.spc-pointer-drop-before,.spc-pointer-drop-after').forEach(el=>el.classList.remove('spc-pointer-drop-before','spc-pointer-drop-after'));
  };
  document.addEventListener('pointerup',endPointer,true);
  document.addEventListener('pointercancel',()=>{if(pointerDrag)pointerDrag.target=null;endPointer()},true);
  document.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation()}},true);
  prepare();
})();
