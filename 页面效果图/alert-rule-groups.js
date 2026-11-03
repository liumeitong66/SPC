(() => {
  const builder = document.querySelector('.rule-builder');
  if (!builder) return;
  const pushSection = [...document.querySelectorAll('.form-section')].find(section => section.querySelector('h2')?.textContent === '推送配置');
  if (pushSection) {
    builder.closest('.form-section').after(pushSection);
    pushSection.querySelectorAll('label em').forEach(marker => marker.remove());
    pushSection.querySelectorAll('input,textarea,select').forEach(control => {
      control.required = false;
      control.removeAttribute('aria-required');
    });
  }
  document.querySelectorAll('.push-row').forEach(row => {
    const webhook = row.querySelector('input[type="url"]')?.closest('.form-field');
    if (webhook) row.prepend(webhook);
  });
  const duplicateLabel = builder.parentElement.querySelector(':scope > label');
  if (duplicateLabel) duplicateLabel.remove();
  const notes = document.querySelector('.basic-fields textarea')?.closest('.form-field');
  if (notes) notes.classList.add('rule-notes');
  const template = builder.querySelector('.rule-line').cloneNode(true);
  const monitor = document.querySelector('.monitor-fields');
  const scopeField = monitor.querySelector('.scope-field');
  scopeField.querySelector('label').innerHTML = '监控设备 <em>*</em>';
  scopeField.querySelector('.scope-trigger')?.setAttribute('aria-label', '监控设备');
  const timeFields = [...monitor.querySelectorAll('.period-field')];
  const periodField = monitor.querySelector('.period-choice').closest('.form-field');
  monitor.prepend(periodField, scopeField,
    timeFields.find(field => field.querySelector('select')),
    timeFields.find(field => field.querySelector('input[type="number"]')));
  const object = document.createElement('div');
  object.className = 'form-field rule-dimension-field';
  object.innerHTML = '<label>统计维度 <em>*</em></label><div class="period-choice" role="radiogroup" aria-label="统计维度"><label><input type="radio" name="rule-dimension" value="pcb"> 单片PCB</label><label><input type="radio" name="rule-dimension" value="device" checked> 设备</label><label><input type="radio" name="rule-dimension" value="project"> 项目</label></div>';
  monitor.append(object);
  const deviceHandling = document.createElement('div');
  deviceHandling.className = 'form-field';
  deviceHandling.innerHTML = '<label>数据处理方式 <em>*</em></label><select aria-label="数据处理方式"><option value="merged">跨设备合并计算</option><option value="per-device">每台设备分别计算</option></select>';
  object.after(deviceHandling);
  const dimensionValue = () => object.querySelector('input:checked').value;
  const handling = deviceHandling.querySelector('select');
  const updateHandling = () => {
    deviceHandling.hidden = dimensionValue() !== 'project';
    handling.disabled = deviceHandling.hidden;
  };
  object.addEventListener('change', updateHandling);
  updateHandling();
  const hours = monitor.querySelector('input[type="number"]');
  hours.min = '1'; hours.step = '1'; hours.inputMode = 'numeric';
  const node = monitor.querySelector('.period-field select');
  const selectedNode = node.value || '08:00';
  const nodeTime = document.createElement('input');
  nodeTime.type = 'time'; nodeTime.step = '60';
  nodeTime.min = '00:00'; nodeTime.max = '23:59';
  nodeTime.value = selectedNode;
  nodeTime.setAttribute('aria-label', '统计节点');
  node.replaceWith(nodeTime);
  window.addEventListener('click', event => {
    if (!event.target.closest('[data-alert-save]')) return;
    if (!monitor.querySelector('input[value="fixed"]').checked) return;
    if (hours.value.trim() && Number.isSafeInteger(Number(hours.value)) && Number(hours.value) >= 1) return;
    event.preventDefault(); event.stopImmediatePropagation();
    let error = monitor.querySelector('[data-period-error]');
    if (!error) {
      error = document.createElement('div'); error.dataset.periodError = '';
      error.className = 'rule-period-error'; error.setAttribute('role', 'alert'); monitor.append(error);
    }
    error.textContent = '周期时长请输入大于等于1的整数';
    hours.focus();
  }, true);
  const relation = () => '<span>符合以下</span><select aria-label="条件关系"><option value="all">所有</option><option value="any">任意</option></select><span>条件</span>';
  const line = () => {
    const el = template.cloneNode(true);
    el.querySelectorAll('input').forEach(input => input.value = '');
    el.querySelector('.rule-remove').disabled = false;
    return el;
  };
  const group = (root = false) => {
    const el = document.createElement('section');
    el.className = root ? 'condition-group condition-root' : 'condition-group';
    el.innerHTML = '<div class="rule-builder-head">' + relation() + (root ? '' : '<button type="button" class="condition-delete">删除分组</button>') + '</div><div class="condition-items"></div><div class="condition-actions"><button type="button" class="rule-add">＋ 添加条件</button><button type="button" class="condition-add">＋ 添加条件组</button></div>';
    el.querySelector('.condition-items').append(line());
    return el;
  };
  builder.replaceChildren(group(true));
  window.addEventListener('change', event => {
    if (event.target.matches('.rule-kind') && builder.contains(event.target)) {
      event.target.closest('.rule-line').querySelector('.rule-defects')?.remove();
    }
  }, true);
  function updateDefects(el) {
    const continuous = el.querySelector('.rule-kind').value === 'continuous';
    const metric = el.querySelector('select[aria-label="监控指标"]');
    let picker = el.querySelector('.rule-defects');
    if (continuous && !picker) {
      picker = document.createElement('details');
      picker.className = 'rule-defects';
      picker.innerHTML = '<summary>选择缺陷类型</summary><div class="rule-defect-options spc-select-menu"><div class="rule-defect-hint">任意一种缺陷命中即计 1 片</div>' + ['错件','缺件','极反','翻件','连锡'].map(name => '<label class="spc-select-option"><input type="checkbox" value="' + name + '">' + name + '</label>').join('') + '</div>';
      metric.after(picker);
    }
    metric.hidden = continuous;
    if (picker) picker.hidden = !continuous;
    if (continuous) {
      const value = el.querySelector('input[aria-label="阈值数值"]');
      value.type = 'number'; value.min = '1'; value.step = '1';
      el.querySelector('.rule-unit').innerHTML = '<option>片 PCB</option>';
    } else {
      const value = el.querySelector('input[aria-label="阈值数值"]');
      value.type = 'text'; value.removeAttribute('min'); value.removeAttribute('step');
    }
  }
  document.addEventListener('change', event => {
    const el = event.target.closest('.rule-line');
    if (!el || !builder.contains(el)) return;
    if (event.target.matches('.rule-kind')) updateDefects(el);
    if (event.target.matches('.rule-defects input')) {
      const picker = event.target.closest('.rule-defects');
      const selected = [...picker.querySelectorAll('input:checked')].map(input => input.value);
      picker.querySelector('summary').textContent = selected.length ? selected.join('、') : '选择缺陷类型';
      picker.querySelector('summary').title = selected.length ? selected.join('、') + '（任意命中）' : '';
    }
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.rule-defects[open]').forEach(picker => { if (!picker.contains(event.target)) picker.open = false; });
  });
  builder.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const current = button.closest('.condition-group');
    if (!current) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const items = current.querySelector(':scope > .condition-items');
    if (button.matches('.rule-add')) items.append(line());
    if (button.matches('.condition-add')) items.append(group());
    if (button.matches('.condition-delete')) current.remove();
    if (button.matches('.rule-remove')) {
      if (items.children.length > 1) button.closest('.rule-line').remove();
    }
    builder.querySelectorAll('.condition-group').forEach(g => {
      const children = g.querySelector(':scope > .condition-items').children;
      [...children].forEach(child => {
        if (child.matches('.rule-line')) child.querySelector('.rule-remove').disabled = children.length === 1;
      });
    });
  }, true);
  const serialize = g => ({
    relation: g.querySelector(':scope > .rule-builder-head select').value,
    conditions: [...g.querySelector(':scope > .condition-items').children].map(el =>
      el.matches('.condition-group') ? serialize(el) : {
        kind: el.querySelector('.rule-kind').value,
        values: [...el.querySelectorAll('select,input:not([type="checkbox"])')].map(control => control.value),
        defects: [...el.querySelectorAll('.rule-defects input:checked')].map(input => input.value),
        defectRelation: 'any'
      })
  });
  window.spcGetAlertConditions = () => ({
    object: dimensionValue(),
    ...(dimensionValue() === 'project' ? {deviceHandling: handling.value} : {}),
    ...serialize(builder.firstElementChild)
  });
})();
