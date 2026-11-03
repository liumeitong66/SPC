(() => {
  const section = [...document.querySelectorAll('.form-section')].find(s => s.querySelector('h2')?.textContent === '推送配置');
  if (!section) return;
  const body = section.querySelector('.section-fields');
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
