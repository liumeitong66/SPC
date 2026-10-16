(() => {
  const scope = chart => window.spcReadChartScope?.(chart) || { rules: [] };
  function period(rules) {
    const value = rules.find(rule => /时间|日期/.test(rule.field))?.value;
    return value === 'pastHalfYear' ? 'halfYear' : value === 'past30' ? 'month' : value === 'past7' ? '7d' : null;
  }
  function timeRange(rules) {
    const rule = rules.find(item => /时间|日期/.test(item.field));
    if (!rule) return null;
    if (rule.value === 'range') return { start: rule.start, end: rule.end };
    if (rule.value === 'date') return { start: rule.date, end: rule.date };
    const end = new Date('2026-08-04T00:00:00'), start = new Date(end);
    if (rule.value === 'past7') start.setDate(start.getDate() - 6);
    else if (rule.value === 'past30') start.setDate(start.getDate() - 29);
    else if (rule.value === 'pastHalfYear') start.setMonth(start.getMonth() - 6);
    else if (rule.value === 'thisMonth') start.setDate(1);
    else if (rule.value === 'lastMonth') { start.setDate(1); start.setMonth(start.getMonth() - 1); end.setDate(0); }
    else if (['today', 'tomorrow', 'yesterday'].includes(rule.value)) { start.setDate(start.getDate() + (rule.value === 'tomorrow' ? 1 : rule.value === 'yesterday' ? -1 : 0)); end.setTime(start.getTime()); }
    else return null;
    const iso = date => date.toISOString().slice(0, 10);
    return { start: iso(start), end: iso(end) };
  }
  function apply(chart) {
    if (!chart) return;
    const rules = scope(chart).rules;
    if (chart.matches('[data-project-trend]')) { window.spcApplyProjectTrendScope?.(timeRange(rules)); chart.classList.add('chart-scope-controls-replaced'); }
    if (chart.matches('[data-comparison-panel]')) {
      const selected = period(rules);
      const time = rules.find(rule => /时间|日期/.test(rule.field));
      const custom = time?.value === 'range' ? { start: time.start, end: time.end } : time?.value === 'date' ? { start: time.date, end: time.date } : null;
      if (chart.dataset.comparisonScope === 'project') window.spcApplyProjectComparisonScope?.(custom ? 'custom' : selected || '7d', custom);
      if (selected) {
        const select = chart.querySelector('[data-chart-period-context="comparison"]');
        if (select && select.value !== selected) { select.value = selected; select.dispatchEvent(new Event('change', { bubbles: true })); }
        chart.querySelector(`[data-chart-period="${selected}"]`)?.click();
      }
      if (custom) {
        for (const [key, value] of [['start', custom.start], ['end', custom.end]]) {
          const input = chart.querySelector(`[data-comparison-date="${key}"]`);
          if (input && value) { input.value = value; input.dispatchEvent(new Event('change', { bubbles: true })); }
        }
      }
      if (chart.dataset.dimension === '设备位置（一级）') chart.querySelector('[data-comparison-type="area"]')?.click();
      else if (chart.dataset.dimension === '设备名称') chart.querySelector('[data-comparison-type="device"]')?.click();
      chart.classList.add('chart-scope-controls-replaced');
    }
    if (chart.matches('[data-device-trend]')) chart.classList.add('chart-scope-controls-replaced');
    if (document.body.dataset.page === 'alert-analysis' && chart.matches('.charts .panel.chart')) {
      if (window.spcRenderAlertDailyChart) { window.spcRenderAlertDailyChart(chart); return; }
      const dimension = chart.dataset.dimension;
      if (dimension === '设备位置（一级）') chart.querySelector('[data-alert-mode="region"],[data-alert-chart="region"]')?.click();
      else if (dimension === '设备名称') chart.querySelector('[data-alert-mode="device"],[data-alert-chart="device"]')?.click();
      if (chart === document.querySelector('.charts .panel.chart')) {
        const selected = period(rules);
        const label = selected === 'halfYear' ? '最近半年' : selected === 'month' ? '最近一个月' : selected === '7d' ? '最近7天' : null;
        if (label) chart.querySelector(`[data-alert-period="device"][data-period="${label}"]`)?.click();
      }
    }
  }
  window.addEventListener('spc-chart-scope-change', event => apply(event.detail.chart));
  document.addEventListener('spc-chart-dimension-change', event => apply(event.target));
  document.querySelectorAll('[data-custom-chart]').forEach(chart => { apply(chart); window.spcApplyNativeChartScope?.(chart); });
  const style = document.createElement('style');
  style.textContent = `[data-device-trend].chart-scope-controls-replaced [data-device-trend-range],
    [data-project-trend].chart-scope-controls-replaced [data-project-trend-range],
    [data-project-trend].chart-scope-controls-replaced .comparison-switch:has([data-project-trend-mode]),
    [data-device-trend].chart-scope-controls-replaced [data-chart-device-config],
    [data-device-trend].chart-scope-controls-replaced .comparison-switch:has([data-device-trend-mode]),
    [data-comparison-panel].chart-scope-controls-replaced [data-comparison-date-range],
    [data-comparison-panel].chart-scope-controls-replaced [data-chart-period-context="comparison"],
    [data-comparison-panel].chart-scope-controls-replaced .comparison-switch:has([data-comparison-type]),
    body[data-page="alert-analysis"] .charts .panel.chart:first-child .phead .switcher{display:none!important}`;
  document.head.append(style);
})();
