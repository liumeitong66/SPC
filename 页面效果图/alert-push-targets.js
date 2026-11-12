(() => {
  const section = [...document.querySelectorAll('.form-section')].find(s => s.querySelector('h2')?.textContent === '推送配置');
  if (!section) return;
  const body = section.querySelector('.section-fields');
  const template = body.querySelector('textarea');
  const defaultTemplate = [
    '【{{告警级别}}】{{规则名称}}', '告警时间：{{告警时间}}',
    '告警层级：{{告警层级}}', '关联项目：{{项目名称}}', '设备：{{设备编号}}', '{{命中条件}}', '{{异常明细}}'
  ].join('\n');
  template.value ||= defaultTemplate;
  template.setAttribute('aria-label', '推送消息模板');
  const preview = document.createElement('pre');
  preview.className = 'push-template-preview';
  preview.hidden = true;
  template.after(preview);

  // The prototype has no detection events. Preview one matching path through the rule.
  function sampleMatches(group) {
    const branches = group.conditions.map(condition =>
      condition.conditions ? sampleMatches(condition) : [condition]);
    return group.relation === 'any' ? branches.find(branch => branch.length) || [] : branches.flat();
  }

  function sampleActual(threshold, operator, unit) {
    if (!threshold.trim() || !Number.isFinite(Number(threshold))) return '';
    const step = unit === '%' ? 0.1 : 1;
    const offset = operator === '大于' ? step : operator === '小于' ? -step : 0;
    const value = Number((Number(threshold) + offset).toFixed(6));
    return value >= 0 && (unit !== '%' || value <= 100) ? value + unit : '';
  }

  function updatePreview() {
    if (preview.hidden) return;
    const rule = window.spcGetAlertConditions();
    const monitor = document.querySelector('.monitor-fields');
    const fixed = monitor.querySelector('input[name="period"]:checked').value === 'fixed';
    const node = monitor.querySelector('input[type="time"]').value;
    const hours = monitor.querySelector('input[type="number"]').value;
    const period = fixed ? (hours ? `${node} 起，${hours} 小时` : '本统计周期') : '实时';
    const matches = sampleMatches(rule).filter(condition => condition.values[2]);
    const levels = new Set();
    const conditions = matches.flatMap(condition => {
      const [, stage, metric, operator, threshold, unit] = condition.values;
      const compare = condition.kind === 'compare';
      const displayUnit = compare && unit === '%' ? ' 个百分点' : unit;
      const limit = threshold.trim() ? threshold + displayUnit : '待配置阈值';
      const actual = sampleActual(threshold, compare ? '等于' : operator, unit);
      const result = actual && !compare ? ' · 示例实测 ' + actual : '';
      const metrics = condition.metrics || [metric];
      return metrics.map(name => {
        const level = name.startsWith('板卡') ? '板卡级' : '器件级';
        levels.add(level);
        const prefix = `[${level}]`;
        switch (condition.kind) {
          case 'continuous': return `${prefix} 连续检出｜${stage} · ${name} · 连续片数${operator}${limit}${result}`;
          case 'ratio': return `${prefix} 单片检出｜PCB-0182 · ${stage} · ${name}${operator}${limit}${result}`;
          case 'compare': return `${prefix} 较上一周期变化｜${stage} · ${name} · ${operator}${limit}${actual ? ' · 示例变化 ' + operator + Number(threshold) + displayUnit : ''}`;
          default: return `${prefix} 累计检出｜${period} · ${stage} · ${name}${operator}${limit}${result}`;
        }
      });
    });
    const defectTypes = [...new Set(matches.flatMap(condition => condition.defects))];
    const details = defectTypes.map((type, index) => ({
      position: index ? 'U' + (index + 4) : 'R23',
      type,
      frequency: fixed ? '本统计周期内 6 片' : '最近 30 分钟内 6 片'
    }));
    const basic = document.querySelector('.basic-fields');
    const devices = [...monitor.querySelectorAll('.scope-area label:not(:first-child) input:checked')]
      .map(input => input.closest('label').textContent.trim().split(/\s+/)[0]);
    const projects = ['3267504J2G_A面'];
    if (rule.object === 'device' && matches.some(condition => condition.kind !== 'ratio')) {
      projects.push('C509048_B面');
    }
    const values = {
      规则名称: basic.querySelector('input').value.trim() || '示例告警规则',
      告警级别: basic.querySelector('select').selectedOptions[0]?.textContent.replace(/^请选择$/, '') || '示例级别',
      告警时间: '2026-08-04 14:32:18',
      告警层级: [...levels].join('、'),
      项目名称: projects.join('、'),
      设备编号: (rule.deviceHandling === 'merged' ? devices.join('、') : devices[0]) || 'AOI-01',
      命中条件: conditions.join('\n'),
      异常明细: details.length ? '异常明细\n' + details.map(item => `${item.position}｜${item.type}｜${item.frequency}`).join('\n') : '',
      异常元件位号: details.map(item => item.position).join('、'),
      异常元件NG类型: details.map(item => item.type).join('、'),
      单位时间内复发频次: details.map(item => item.frequency).join('、')
    };
    const message = (template.value || defaultTemplate).split('\n').map(line => {
      const tokens = [...line.matchAll(/\{\{([^{}]+)\}\}/g)];
      if (tokens.length && tokens.every(([, key]) => values[key] === '')) return '';
      return line.replace(/\{\{([^{}]+)\}\}/g, (token, key) => Object.hasOwn(values, key) ? values[key] : token);
    }).filter(Boolean).join('\n');
    preview.textContent = '模拟预览\n' + message;
  }

  const form = section.closest('.form-grid');
  form.addEventListener('input', updatePreview);
  document.addEventListener('change', event => {
    if (form.contains(event.target)) updatePreview();
  });
  new MutationObserver(updatePreview).observe(form.querySelector('.rule-builder'), {childList:true, subtree:true});

  body.querySelectorAll('.push-row,.push-add').forEach(el => el.remove());
  const targets = document.createElement('div');
  targets.className = 'push-targets';
  const add = document.createElement('button');
  add.type = 'button'; add.className = 'push-add'; add.textContent = '＋ 添加推送目标';
  body.append(targets, add);
  function createTarget() {
    const target = document.createElement('div');
    target.className = 'push-target';
    target.innerHTML = '<div class="form-field"><label>推送平台</label><select data-platform aria-label="推送平台"><option value="">请选择</option><option value="wecom">企业微信</option><option value="feishu">飞书</option><option value="dingtalk">钉钉</option></select></div><div class="form-field push-webhook"><label>Webhook 地址</label><input type="url" data-webhook placeholder="请输入群机器人 Webhook 地址" aria-label="Webhook 地址"></div><div class="form-field"><label>群名称</label><input data-group placeholder="选填" aria-label="群名称"></div><div class="form-field push-signature" hidden><label data-sign-label>签名校验</label><div class="period-choice"><label><input type="checkbox" data-sign> 启用</label></div></div><div class="form-field push-secret" hidden><label>签名密钥</label><input type="password" data-secret autocomplete="new-password" placeholder="请输入签名密钥" aria-label="签名密钥"></div><div class="push-target-actions"><button type="button" class="btn" data-test>测试推送</button><button type="button" class="push-remove" aria-label="删除推送目标">×</button></div><div class="push-target-feedback" role="status" hidden></div>';
    const platform = target.querySelector('[data-platform]'), sign = target.querySelector('[data-sign]');
    const feedback = target.querySelector('.push-target-feedback');
    const update = () => {
      const supportsSign = ['feishu', 'dingtalk'].includes(platform.value);
      target.querySelector('.push-signature').hidden = !supportsSign;
      target.querySelector('[data-sign-label]').textContent = platform.value === 'dingtalk' ? '加签' : '签名校验';
      target.querySelector('.push-secret').hidden = !supportsSign || !sign.checked;
      feedback.hidden = true;
    };
    target.addEventListener('change', update);
    target.querySelector('.push-remove').onclick = () => target.remove();
    target.querySelector('[data-test]').onclick = () => {
      const message = validate(target, true);
      if (!message) {
        preview.hidden = false;
        updatePreview();
      }
      feedback.textContent = message || '当前为页面原型，尚未接入推送服务，未发送测试消息';
      feedback.classList.toggle('is-error', !!message); feedback.hidden = false;
    };
    targets.append(target); update();
  }
  function validate(target, testing = false) {
    const platform = target.querySelector('[data-platform]').value;
    const webhook = target.querySelector('[data-webhook]');
    const group = target.querySelector('[data-group]').value.trim();
    const sign = target.querySelector('[data-sign]').checked && ['feishu','dingtalk'].includes(platform);
    const secret = target.querySelector('[data-secret]').value.trim();
    if (!testing && !platform && !webhook.value.trim() && !group && !sign && !secret) return '';
    if (!platform) return '请选择推送平台';
    if (!webhook.value.trim()) return '请填写 Webhook 地址';
    let url;
    try { url = new URL(webhook.value.trim()); } catch { return '请填写正确的 Webhook 地址'; }
    const host = {wecom:'qyapi.weixin.qq.com',feishu:'open.feishu.cn',dingtalk:'oapi.dingtalk.com'}[platform];
    if (url.protocol !== 'https:' || url.hostname !== host || !webhook.checkValidity()) return '请填写与推送平台对应的 HTTPS Webhook 地址';
    if (sign && !secret) return '请填写签名密钥';
    return '';
  }
  add.onclick = createTarget;
  createTarget();
  window.addEventListener('click', event => {
    if (!event.target.closest('[data-alert-save]')) return;
    for (const target of targets.children) {
      const message = validate(target);
      const feedback = target.querySelector('.push-target-feedback');
      feedback.hidden = !message;
      if (!message) continue;
      event.preventDefault(); event.stopImmediatePropagation();
      feedback.textContent = message; feedback.classList.add('is-error');
      target.scrollIntoView({block:'center',behavior:'smooth'}); return;
    }
  }, true);
})();
