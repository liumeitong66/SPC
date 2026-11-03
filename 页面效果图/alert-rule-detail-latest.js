(() => {
  const sections = [...document.querySelectorAll('.form-section')];
  const section = title => sections.find(el => el.querySelector('h2')?.textContent === title);
  const field = (label, value) => {
    const el = document.createElement('div'); el.className = 'form-field';
    const name = document.createElement('label'); name.textContent = label;
    const content = document.createElement('div'); content.className = 'rule-read-value'; content.textContent = value;
    el.append(name, content); return el;
  };
  const read = el => el?.querySelector('.rule-read-value')?.textContent.trim() || '—';
  const findField = (host, label) => [...host.querySelectorAll('.form-field')].find(el => el.querySelector('label')?.textContent.replace(/\*/g, '').trim() === label);
  const monitor = section('监控范围').querySelector('.section-fields');
  const period = findField(monitor, '监控周期');
  const scope = [...monitor.querySelectorAll('.form-field')].find(el => el.classList.contains('scope-field'));
  scope.querySelector('label').textContent = '监控设备';
  const node = [...monitor.querySelectorAll('.period-field')].find(el => el.querySelector('label').textContent.includes('统计节点'));
  const hours = [...monitor.querySelectorAll('.period-field')].find(el => el.querySelector('label').textContent.includes('周期时长'));
  monitor.prepend(period, scope, node, hours);
  const key = new URLSearchParams(location.search).get('rule') || 'wrong-material';
  const dimension = key === 'full-board' ? '单片PCB' : ['board-yield','pass-drop','false-positive','area-defect'].includes(key) ? '项目' : '设备';
  const dimensionField = field('统计维度', dimension); dimensionField.classList.add('detail-dimension');
  monitor.append(dimensionField);
  if (dimension === '项目') monitor.append(field('数据处理方式', key === 'pass-drop' ? '每台设备分别计算' : '跨设备合并计算'));
  const trigger = section('触发条件');
  trigger.querySelector('.form-field.full > label')?.remove();
  const relation = trigger.querySelector('.rule-builder-head .rule-read-value');
  if (relation) relation.textContent = '所有';
  const values = trigger.querySelectorAll('.rule-line .rule-read-value');
  if (values[0]?.textContent === '连续次数') values[5].textContent = '片 PCB';
  const push = section('推送配置'); trigger.after(push);
  const pushBody = push.querySelector('.section-fields');
  const template = [...pushBody.querySelectorAll('.form-field')].find(el => el.querySelector('label')?.textContent.includes('推送消息模板'));
  if (template) template.querySelector('.rule-read-value').textContent = `检测到${read(findField(section('基础信息'), '规则名称'))}，请及时处理。`;
  pushBody.querySelectorAll('.push-row').forEach(el => el.remove());
  const targets = document.createElement('div'); targets.className = 'detail-push-targets';
  [
    {platform:'企业微信',url:'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=••••••',name:'JLC-AOI品质报警'},
    {platform:'飞书',url:'https://open.feishu.cn/open-apis/bot/v2/hook/••••••',name:'AOI质量监控群',sign:'签名校验'},
    {platform:'钉钉',url:'https://oapi.dingtalk.com/robot/send?access_token=••••••',name:'生产异常通知群',sign:'加签'}
  ].forEach(data => {
    const target = document.createElement('div'); target.className = 'detail-push-target';
    const url = field('Webhook 地址', data.url); url.classList.add('detail-webhook');
    target.append(field('推送平台', data.platform), url, field('群名称', data.name));
    if (data.sign) target.append(field(data.sign, '已启用'), field('签名密钥', '••••••••'));
    targets.append(target);
  });
  pushBody.append(targets);
})();
