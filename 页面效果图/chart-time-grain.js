(() => {
  const chart = () => document.querySelector('[data-custom-chart].is-editor-selected');
  const drawer = () => document.querySelector('[data-quality-config-drawer][data-mode="chart"]');
  const key = element => `spc-chart-time-grain:${location.pathname}:${[...document.querySelectorAll('[data-custom-chart]')].indexOf(element)}`;
  const isTime = value => /时间|日期/.test(value || '');
  const read = element => {
    const saved = element?.dataset.timeGrain || localStorage.getItem(key(element));
    return saved === 'month' ? 'month' : 'day';
  };
  function apply(element, grain) {
    if (!element) return;
    element.dataset.timeGrain = grain;
    try { localStorage.setItem(key(element), grain); } catch {}
    const mode = element.querySelector(`[data-project-trend-mode="${grain}"],[data-device-trend-mode="${grain}"]`);
    if (mode && !mode.classList.contains('is-active')) mode.click();
    element.dispatchEvent(new CustomEvent('spc-chart-time-grain-change', { bubbles: true, detail: { grain } }));
    updateHeader(element);
  }
  function scopeRules(element) {
    try {
      const saved = element.dataset.chartScope || localStorage.getItem(`spc-chart-scope:${location.pathname}:${[...document.querySelectorAll('[data-custom-chart]')].indexOf(element)}`) || '{}';
      return JSON.parse(saved).rules || [];
    } catch { return []; }
  }
  function updateHeader(element) {
    const rules = scopeRules(element);
    const hasTime = rules.some(rule => isTime(rule.field));
    const hasDevice = rules.some(rule => /设备名称|设备SN|设备位置|所在位置/.test(rule.field));
    element.classList.toggle('chart-scope-has-time', hasTime);
    element.classList.toggle('chart-scope-has-device', hasDevice);
    const stored = element.dataset.timeGrain || localStorage.getItem(key(element));
    element.classList.toggle('chart-has-time-grain', !!stored);
  }
  function ensure() {
    const root = drawer(), element = chart();
    if (!root || !element) return;
    const dimension = root.querySelector('[data-quality-config="dimension"]');
    const heatmapTime = root.querySelector('[data-heatmap-time]');
    if (!dimension || heatmapTime) return;
    let field = root.querySelector('[data-chart-time-grain-field]');
    if (!field) {
      field = document.createElement('div');
      field.className = 'quality-config-field full';
      field.dataset.chartTimeGrainField = '';
      field.innerHTML = '<label for="chart-time-grain">时间粒度</label><select id="chart-time-grain" data-chart-time-grain><option value="day">按天</option><option value="month">按月</option></select>';
      dimension.closest('.quality-config-field')?.after(field);
    }
    const visible = isTime(dimension.value);
    field.hidden = !visible;
    field.style.display = visible ? '' : 'none';
    const select = field.querySelector('select');
    select.value = read(element);
    select.onchange = () => apply(element, select.value);
    if (visible && element.dataset.timeGrain) updateHeader(element);
  }
  let queued = false;
  const schedule = () => { if (queued) return; queued = true; queueMicrotask(() => { queued = false; ensure(); }); };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('change', event => { if (event.target.matches('[data-quality-config="dimension"]')) schedule(); });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-quality-chart-save]')) {
      const root = drawer(), element = chart();
      const value = root?.querySelector('[data-chart-time-grain]')?.value || root?.querySelector('[data-heatmap="grain"]')?.value;
      const dimension = root?.querySelector('[data-quality-config="dimension"]')?.value;
      const heatmapX = root?.querySelector('[data-heatmap="x"]')?.value;
      if (element && value && (isTime(dimension) || isTime(heatmapX))) apply(element, value === '月' ? 'month' : value === '周' ? 'week' : value === '天' ? 'day' : value);
      else if (element && !isTime(dimension) && !isTime(heatmapX)) { delete element.dataset.timeGrain; try { localStorage.removeItem(key(element)); } catch {} updateHeader(element); }
    }
    schedule();
  }, true);
  window.addEventListener('spc-chart-scope-change', event => updateHeader(event.detail.chart));
  document.querySelectorAll('[data-custom-chart]').forEach(element => { const stored = localStorage.getItem(key(element)); if (stored) apply(element, stored); else updateHeader(element); });
  schedule();
})();
