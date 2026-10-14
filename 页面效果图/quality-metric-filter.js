(() => {
  if (document.body.dataset.page !== 'device-quality') return;

  const fields = [
    { key:'startTime', label:'检测开始时间', type:'time' },
    { key:'deviceName', label:'设备名称', type:'name' },
    { key:'deviceSn', label:'设备SN', type:'name' },
    { key:'location', label:'所在位置', type:'name' },
    { key:'templateName', label:'模板名称', type:'name' },
    { key:'machineResult', label:'机器判定结果', type:'name' },
    { key:'firstResult', label:'一次复判结果', type:'name' },
    { key:'finalResult', label:'最终复判结果', type:'name' },
    { key:'pcbCount', label:'检测PCB数', type:'number' },
    { key:'templateCount', label:'检测模板数', type:'number' },
    { key:'boardNgRate', label:'板卡不良率', type:'number' },
    { key:'componentDppm', label:'器件DPPM', type:'number' }
  ];
  const operators = {
    time:[['eq','等于'],['after','晚于'],['before','早于'],['empty','为空'],['notEmpty','不为空'],['contains','包含'],['notContains','不包含']],
    name:[['eq','等于'],['ne','不等于'],['contains','包含'],['notContains','不包含'],['empty','为空'],['notEmpty','不为空']],
    number:[['eq','等于'],['ne','不等于'],['gt','大于'],['gte','大于或等于'],['lt','小于'],['lte','小于或等于'],['empty','为空'],['notEmpty','不为空']]
  };
  const periods = [['specific','具体日期'],['today','今天'],['tomorrow','明天'],['yesterday','昨天'],['thisWeek','本周'],['lastWeek','上周'],['thisMonth','本月'],['lastMonth','上月'],['past7','过去7天内'],['next7','未来7天内'],['past30','过去30天内'],['next30','未来30天内']];
  const fallbackNames = {
    location:['区域A','区域B','区域C','区域D'],
    templateName:['3267504J2G_A面','1-A','329134S_P129','155042F_P9','C509048_B面','JLC_AOI_DEMO','20260804_NPI','0804-FPC','SMT2407301669-T','AOI02-MAIN','202608-NPI-02','B02-TEST','AOI04-BATCH','D04-NPI'],
    machineResult:['良好','不良','直通','误报','漏报'],
    firstResult:['良好','不良','直通','误报','漏报'],
    finalResult:['良好','不良','直通','误报','漏报']
  };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const options = (items, selected) => items.map(([value,label]) => `<option value="${escape(value)}"${value===selected?' selected':''}>${escape(label)}</option>`).join('');
  const field = key => fields.find(item => item.key === key);
  const nameOptions = key => {
    const column = key === 'deviceName' ? 'deviceName' : 'deviceSn';
    const fromTable = (key === 'deviceName' || key === 'deviceSn')
      ? [...document.querySelectorAll(`[data-device-table] tbody [data-column-key="${column}"]`)].map(cell => cell.textContent.trim()).filter(Boolean)
      : [];
    return [...new Set([...fromTable,...(fallbackNames[key] || [])])];
  };
  const isMultiName = condition => field(condition.field)?.type === 'name' && ['contains','notContains'].includes(condition.operator);
  const selectedNames = condition => Array.isArray(condition.value) ? condition.value : (condition.value ? [condition.value] : []);
  let metric = null;
  let draft = { join:'all', conditions:[] };
  const popover = document.createElement('section');
  popover.className = 'quality-conditions-popover';
  popover.setAttribute('aria-label','设置筛选条件');
  popover.hidden = true;
  document.body.appendChild(popover);

  function valueMarkup(condition, type) {
    if (condition.operator === 'empty' || condition.operator === 'notEmpty') return '<div class="quality-conditions-value quality-conditions-empty">无需填写</div>';
    if (type === 'time') return `<div class="quality-conditions-value"><select data-condition-value>${options([['','请选择时间'],...periods],condition.value)}</select>${condition.value === 'specific' ? `<input type="date" data-condition-date aria-label="具体日期" value="${escape(condition.date || '')}">` : ''}</div>`;
    if (type === 'number') return `<div class="quality-conditions-value"><input type="number" step="any" data-condition-value aria-label="数值" placeholder="请输入数值" value="${escape(condition.value || '')}"></div>`;
    if (type === 'name') {
      if (isMultiName(condition)) {
        const selected = selectedNames(condition);
        return `<div class="quality-conditions-value"><details class="quality-conditions-multi"><summary>${selected.length ? escape(selected.join('、')) : '请选择名称'}</summary><div class="quality-conditions-multi-options">${nameOptions(condition.field).map(value => `<label><input type="checkbox" data-condition-name value="${escape(value)}"${selected.includes(value) ? ' checked' : ''}><span>${escape(value)}</span></label>`).join('')}</div></details></div>`;
      }
      return `<div class="quality-conditions-value"><select data-condition-value>${options([['','请选择名称'],...nameOptions(condition.field).map(value => [value,value])],condition.value)}</select></div>`;
    }
    return '<div class="quality-conditions-value quality-conditions-empty">请选择字段</div>';
  }
  function render() {
    const rows = draft.conditions.map((condition,index) => {
      const type = field(condition.field)?.type;
      const available = type ? operators[type] : [];
      return `<div class="quality-conditions-row" data-condition-index="${index}"><select data-condition-field aria-label="筛选字段">${options([['','请选择字段'],...fields.map(item => [item.key,item.label])],condition.field)}</select><select data-condition-operator aria-label="计算方式"${type?'':' disabled'}>${options([['','请选择计算方式'],...available],condition.operator)}</select>${valueMarkup(condition,type)}<button class="quality-conditions-remove" type="button" data-remove-condition aria-label="删除条件">×</button></div>`;
    }).join('');
    popover.innerHTML = `<div class="quality-conditions-head"><strong>设置筛选条件</strong><div class="quality-conditions-mode"><span>符合以下</span><select data-condition-join aria-label="条件关系"><option value="all"${draft.join==='all'?' selected':''}>所有</option><option value="any"${draft.join==='any'?' selected':''}>任一</option></select><span>条件</span></div></div><div data-condition-rows>${rows}</div><button class="quality-conditions-add" type="button" data-add-condition>＋ 添加条件</button>`;
  }
  function place(trigger) {
    const rect = trigger.getBoundingClientRect();
    popover.style.top = `${Math.min(rect.bottom + 8, Math.max(12,innerHeight - Math.min(500,popover.scrollHeight) - 12))}px`;
    popover.style.right = '12px';
  }
  function close() { if (metric) metric._qualityFilterDraft = draft; popover.hidden = true; }
  function open(trigger) {
    const selected = document.querySelector('[data-custom-metric].is-editor-selected');
    if (!selected) return;
    metric = selected;
    try { draft = metric._qualityFilterDraft || JSON.parse(metric.dataset.metricConditions || '{"join":"all","conditions":[]}'); }
    catch { draft = { join:'all', conditions:[] }; }
    draft = { join:draft.join === 'any' ? 'any' : 'all', conditions: Array.isArray(draft.conditions) ? draft.conditions.map(item => ({...item})) : [] };
    if (!draft.conditions.length) draft.conditions.push({field:'',operator:'',value:''});
    render(); popover.hidden = false; place(trigger);
  }
  function save() {
    if (!metric || document.querySelector('[data-custom-metric].is-editor-selected') !== metric) return;
    const valid = draft.conditions.filter(item => item.field && item.operator && (['empty','notEmpty'].includes(item.operator) || (isMultiName(item) ? selectedNames(item).length > 0 : item.value && (item.value !== 'specific' || item.date))));
    metric.dataset.metricConditions = JSON.stringify({join:draft.join,conditions:valid});
    const summary = document.querySelector('.quality-filter-control > span');
    if (summary) summary.textContent = valid.length ? `已设置 ${valid.length} 个筛选条件` : '请选择';
    close();
    metric._qualityFilterDraft = null;
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('.quality-filter-link');
    if (trigger) { event.stopPropagation(); popover.hidden ? open(trigger) : close(); return; }
    if (event.target.closest('[data-quality-chart-save]')) { save(); return; }
    if (!popover.hidden && !popover.contains(event.target)) close();
  }, true);
  popover.addEventListener('click', event => {
    if (event.target.closest('[data-add-condition]')) { draft.conditions.push({field:'',operator:'',value:''}); render(); }
    const remove = event.target.closest('[data-remove-condition]');
    if (remove) { draft.conditions.splice(Number(remove.closest('[data-condition-index]').dataset.conditionIndex),1); render(); }
  });
  popover.addEventListener('change', event => {
    if (event.target.matches('[data-condition-join]')) { draft.join = event.target.value; return; }
    const row = event.target.closest('[data-condition-index]');
    if (!row) return;
    const item = draft.conditions[Number(row.dataset.conditionIndex)];
    if (event.target.matches('[data-condition-name]')) {
      const selected = selectedNames(item);
      item.value = event.target.checked ? [...selected,event.target.value] : selected.filter(value => value !== event.target.value);
      event.target.closest('details').querySelector('summary').textContent = item.value.length ? item.value.join('、') : '请选择名称';
    }
    else if (event.target.matches('[data-condition-field]')) { Object.assign(item,{field:event.target.value,operator:'',value:'',date:''}); render(); }
    else if (event.target.matches('[data-condition-operator]')) { Object.assign(item,{operator:event.target.value,value:'',date:''}); render(); }
    else if (event.target.matches('[data-condition-value]')) { item.value = event.target.value; if (field(item.field)?.type === 'time') render(); }
    else if (event.target.matches('[data-condition-date]')) item.date = event.target.value;
  });
  popover.addEventListener('input', event => {
    if (!event.target.matches('input[data-condition-value],input[data-condition-date]')) return;
    const item = draft.conditions[Number(event.target.closest('[data-condition-index]').dataset.conditionIndex)];
    if (event.target.matches('[data-condition-date]')) item.date = event.target.value;
    else item.value = event.target.value;
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !popover.hidden) close(); });
})();
