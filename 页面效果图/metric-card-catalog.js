(() => {
  const catalogs = {
    project: ['PCB检测数','板卡良品总数','板卡良率','板卡NG数','板卡NG率','板卡不良数','板卡不良率','板卡误报数','板卡误报率','板卡直通数','板卡直通率','器件检测数','器件OK数','器件OK率','器件NG数','器件NG率','器件不良率','器件DPPM','器件误报DPPM','器件误报数','器件漏报数','器件直通数','器件直通率'],
    defect: ['缺陷总数','板卡NG总数','器件NG总数','器件直通率','板卡不良数','板卡不良率','板卡误报数','板卡误报率','器件OK数','特殊缺陷器件NG数','特殊缺陷器件误报数','特殊缺陷器件漏报数'],
    false: ['板卡误报数','板卡误报率','器件误报数','器件误报DPPM','特殊缺陷器件误报数'],
    bad: ['板卡不良数','板卡不良率','器件不良数','器件不良率','器件DPPM','特殊缺陷器件NG数']
  };
  window.spcMetricIndicatorCatalog = catalogs;
  const page = document.body.dataset.mouthPage === 'project' ? 'project' : ({'defect-analysis':'defect','false-analysis':'false','defect-analysis-machine':'bad'}[document.body.dataset.page]);
  if (!['project','defect'].includes(page)) return;
  const cards = [...document.querySelectorAll(page === 'project' ? '.metric-groups .metric' : '.metrics .metric')];
  const toolbar = document.querySelector(page === 'project' ? '.project-mouth-toolbar' : '.defect-mouth-toolbar');
  if (!cards.length || !toolbar) return;
  const labelOf = card => card.querySelector(page === 'project' ? '.metric-label' : 'label');
  const valueOf = card => card.querySelector(page === 'project' ? '.metric-value' : 'strong');
  const clean = text => text.replace(/[\sⓘ]/g,'').trim();
  const activeMouth = () => document.querySelector(page === 'project' ? '[data-mouth].active' : '[data-defect-mouth].active')?.dataset[page === 'project' ? 'mouth' : 'defectMouth'] || 'original';
  const sourceFor = () => '单板分析数据';
  const needsMouth = indicator => !['PCB检测数','器件检测数','缺陷总数'].includes(indicator);
  const ruleFor = indicator => {
    if (indicator === 'PCB检测数') return '检测记录总数';
    if (indicator === '缺陷总数') return '缺陷记录总数';
    if (indicator === '器件检测数') return '器件检测数求和';
    if (indicator === '器件DPPM') return '器件不良数 / 器件检测数 × 1,000,000';
    if (indicator === '器件误报DPPM') return '器件误报数 / 器件检测数 × 1,000,000';
    if (indicator.includes('率')) return `${indicator.replace('率','数')} / ${indicator.startsWith('板卡') ? 'PCB检测数' : '器件检测数'} × 100%`;
    return `${indicator}求和`;
  };
  cards.forEach(card => { card.dataset.metricIndicator ||= catalogs[page].find(item => clean(item) === clean(labelOf(card).textContent)) || ''; });
  const button = document.createElement('button');
  button.className = 'metric-card-edit-button';
  button.type = 'button';
  button.textContent = '编辑页面';
  toolbar.appendChild(button);
  const drawer = document.createElement('aside');
  drawer.className = 'metric-card-editor';
  drawer.hidden = true;
  drawer.innerHTML = '<div class="metric-card-editor-head"><h3>指标卡</h3><button type="button" data-metric-close aria-label="关闭">×</button></div><div class="metric-card-editor-body"></div><div class="metric-card-editor-foot"><button type="button" data-metric-save>保存</button></div>';
  document.body.appendChild(drawer);
  let selected = null;
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function open(card) {
    selected = card;
    cards.forEach(item => item.classList.toggle('metric-card-selected', item === card));
    const used = new Set(cards.filter(item => item !== card).map(item => item.dataset.metricIndicator));
    const indicator = card.dataset.metricIndicator;
    drawer.querySelector('.metric-card-editor-body').innerHTML = `<div class="metric-card-tabs"><button type="button" class="active" data-metric-tab="base">基础配置</button><button type="button" data-metric-tab="custom">样式配置</button></div><div data-metric-panel="base"><label class="metric-card-field">标题<input data-metric-title value="${escape(labelOf(card).textContent.replace('ⓘ','').trim())}"></label><label class="metric-card-field">统计指标<select data-metric-indicator>${catalogs[page].map(item => `<option value="${escape(item)}"${item === indicator ? ' selected' : ''}${used.has(item) ? ' disabled' : ''}>${escape(item)}</option>`).join('')}</select></label></div><div data-metric-panel="custom" hidden><label class="metric-card-field">背景颜色<select><option>默认</option><option>浅蓝</option><option>白色</option></select></label><label class="metric-card-field">文字颜色<select><option>默认</option><option>深色</option><option>蓝色</option></select></label><label class="metric-card-field">小数精度<select><option>整数</option><option>1位小数</option><option>2位小数</option></select></label><label class="metric-card-field">数字格式<select><option>数字（千分位）</option><option>百分比</option></select></label></div>`;
    drawer.hidden = false;
    document.body.classList.add('metric-card-editing');
    drawer.querySelector('[data-metric-indicator]').onchange = event => {
      drawer.querySelector('[data-metric-title]').value = event.target.value;
    };
    drawer.querySelectorAll('[data-metric-tab]').forEach(tab => tab.onclick = () => {
      drawer.querySelectorAll('[data-metric-tab]').forEach(item => item.classList.toggle('active',item === tab));
      drawer.querySelectorAll('[data-metric-panel]').forEach(panel => { panel.hidden = panel.dataset.metricPanel !== tab.dataset.metricTab; });
    });
  }
  function close() { drawer.hidden = true; document.body.classList.remove('metric-card-editing'); cards.forEach(card => card.classList.remove('metric-card-selected')); selected = null; }
  button.onclick = () => { document.body.classList.add('metric-card-editing'); open(cards[0]); };
  cards.forEach(card => card.onclick = () => { if (document.body.classList.contains('metric-card-editing')) open(card); });
  drawer.querySelector('[data-metric-close]').onclick = close;
  drawer.querySelector('[data-metric-save]').onclick = () => {
    if (!selected) return;
    const indicator = drawer.querySelector('[data-metric-indicator]').value;
    const changed = indicator !== selected.dataset.metricIndicator;
    selected.dataset.metricIndicator = indicator;
    labelOf(selected).textContent = drawer.querySelector('[data-metric-title]').value.trim() || indicator;
    if (changed) valueOf(selected).textContent = '—';
    close();
  };
})();
