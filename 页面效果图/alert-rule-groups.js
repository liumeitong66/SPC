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
  object.innerHTML = '<label>统计维度 <em>*</em></label><div class="period-choice" role="radiogroup" aria-label="统计维度"><label><input type="radio" name="rule-dimension" value="device" checked> 设备</label><label><input type="radio" name="rule-dimension" value="project"> 项目</label></div>';
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

  const kinds = [
    ['threshold', '累计检出'], ['continuous', '连续检出'],
    ['ratio', '单片检出'], ['compare', '较上一周期变化']
  ];
  const boardMetrics = ['板卡不良', '板卡直通', '板卡误报', '板卡漏报'];
  const partMetrics = ['器件不良', '器件直通', '器件误报', '器件漏报', '特殊缺陷'];
  const defects = '缺件/错位/错件/少锡/多锡/虚焊/连锡/立碑/极反/多件/翻件/本体浮高/翘脚/爬锡不良/损件/飞件/跨件连锡/脏污异物/锡球/金手指缺陷/红胶/侧立/偏移/其他/冷焊/少胶/多胶/桥丝断裂/测距 NG/SN NG'.split('/');
  const comparisons = ['大于', '小于', '等于', '大于等于', '小于等于'];

  function replaceOptions(select, options) {
    const previous = select.value;
    select.replaceChildren(...options.map(option => {
      const [value, label] = Array.isArray(option) ? option : [option, option];
      return new Option(label, value);
    }));
    if (options.some(option => (Array.isArray(option) ? option[0] : option) === previous)) {
      select.value = previous;
    }
  }

  function updateMetricPicker(metric, options, continuous) {
    let picker = metric.nextElementSibling;
    const previous = metric.multiple
      ? Array.from(metric.selectedOptions, option => option.value)
      : [metric.value];
    metric.multiple = continuous;
    metric.hidden = continuous;
    replaceOptions(metric, options);
    if (!continuous) {
      if (picker?.matches('.rule-defects')) picker.remove();
      return;
    }

    if (!picker?.matches('.rule-defects')) {
      picker = document.createElement('details');
      picker.className = 'rule-defects';
      picker.innerHTML = '<summary></summary><div class="rule-defect-options spc-select-menu"><div class="spc-select-options" role="group" aria-label="监控指标"></div></div>';
      metric.after(picker);
      picker.addEventListener('toggle', () => {
        if (!picker.open) return;
        const trigger = picker.getBoundingClientRect();
        const below = window.innerHeight - trigger.bottom;
        const above = trigger.top;
        const openAbove = below < 292 && above > below;
        const menu = picker.querySelector('.spc-select-menu');
        menu.classList.toggle('opens-above', openAbove);
        menu.style.maxHeight = Math.max(0, Math.min(280, (openAbove ? above : below) - 20)) + 'px';
      });
      picker.addEventListener('change', event => {
        const checkbox = event.target;
        const option = Array.from(metric.options).find(item => item.value === checkbox.value);
        option.selected = checkbox.checked;
        metric.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    const selected = new Set(previous.filter(value => options.includes(value)));
    if (previous.length && !selected.size) selected.add(options[0]);
    const summary = picker.querySelector('summary');
    const names = [...selected].join('、');
    summary.textContent = names || '请选择';
    summary.title = names;
    summary.setAttribute('aria-label', names ? '监控指标：' + names : '监控指标');
    const list = picker.querySelector('.spc-select-options');
    const existing = [...list.querySelectorAll('input')];
    if (existing.length !== options.length || existing.some((input, index) => input.value !== options[index])) {
      list.replaceChildren(...options.map(value => {
        const label = document.createElement('label');
        label.className = 'spc-select-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        label.append(checkbox, value);
        return label;
      }));
    }
    for (const option of metric.options) {
      option.selected = selected.has(option.value);
    }
    list.querySelectorAll('input').forEach(input => input.checked = selected.has(input.value));
  }

  function updateCondition(el) {
    const [kind, stage, metric, operator, unit] = el.querySelectorAll('select');
    const threshold = el.querySelector('input[aria-label="阈值数值"]');
    const previousCondition = el.dataset.conditionKey;
    const fixed = monitor.querySelector('input[name="period"][value="fixed"]').checked;
    replaceOptions(kind, kinds.filter(([value]) => fixed || value !== 'compare'));

    const machine = stage.value === '机器判定';
    const single = kind.value === 'ratio';
    const continuous = kind.value === 'continuous';
    const compare = kind.value === 'compare';
    const boards = single ? [] : machine ? boardMetrics.slice(0, 1) : boardMetrics;
    const parts = machine ? partMetrics.slice(0, 1) : partMetrics;
    updateMetricPicker(metric, [...boards, ...parts, ...defects], continuous);
    replaceOptions(operator, compare ? ['增加', '减少'] : comparisons);

    let units;
    if (continuous) units = ['片'];
    else if (defects.includes(metric.value)) units = ['个'];
    else if (boards.includes(metric.value)) units = ['片', '%'];
    else if (single || compare || stage.value === '最终判定') units = ['个', '%'];
    else units = ['片', '%'];
    replaceOptions(unit, units);

    const condition = [kind.value, stage.value, ...Array.from(metric.selectedOptions, option => option.value), operator.value, unit.value].join('|');
    if (previousCondition && previousCondition !== condition) threshold.value = '';
    el.dataset.conditionKey = condition;
    el.dataset.conditionKind = kind.value;
    threshold.placeholder = compare ? '变化幅度' : '阈值';
  }

  builder.querySelectorAll('.rule-line').forEach(updateCondition);
  document.addEventListener('change', event => {
    if (event.target.matches('input[name="period"]')) {
      builder.querySelectorAll('.rule-line').forEach(updateCondition);
      return;
    }
    const el = event.target.closest('.rule-line');
    if (el && builder.contains(el) && event.target.matches('select')) updateCondition(el);
  });
  document.addEventListener('click', event => {
    builder.querySelectorAll('.rule-defects[open]').forEach(picker => {
      if (!picker.contains(event.target)) picker.open = false;
    });
  });
  builder.addEventListener('keydown', event => {
    const picker = event.target.closest('.rule-defects[open]');
    if (event.key !== 'Escape' || !picker) return;
    picker.open = false;
    picker.querySelector('summary').focus();
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
    builder.querySelectorAll('.rule-line:not([data-condition-kind])').forEach(updateCondition);
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
      el.matches('.condition-group') ? serialize(el) : serializeCondition(el))
  });
  function serializeCondition(el) {
    const metric = el.querySelector('select[aria-label="监控指标"]');
    const metrics = Array.from(metric.selectedOptions, option => option.value);
    return {
      kind: el.querySelector('.rule-kind').value,
      values: [...el.querySelectorAll('select,input:not([type="checkbox"])')].map(control => control.value),
      ...(metric.multiple ? { metrics } : {}),
      defects: metrics.filter(value => defects.includes(value)),
      defectRelation: 'any'
    };
  }
  window.spcGetAlertConditions = () => ({
    object: dimensionValue(),
    ...(dimensionValue() === 'project' ? {deviceHandling: handling.value} : {}),
    ...serialize(builder.firstElementChild)
  });
})();
