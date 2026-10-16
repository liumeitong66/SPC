(() => {
  const panels = [...document.querySelectorAll('.charts .chart')];
  if (panels.length !== 4) return;
  document.querySelector('.alert-content > .metrics')?.remove();
  panels[3].remove();
  const areas = window.spcAlertDeviceAreas = {'AOI-01':'区域A','AOI-02':'区域B','AOI-03':'区域C','AOI-04':'区域D','AOI-05':'区域B'};
  const types = ['严重不良报警（错料）','严重不良报警（连锡）','板卡良率报警','直通率突降报警','误报率偏高报警','区不良率波动报警','整片不良告警'];
  const weights = [18,14,15,11,13,16,13], colors = ['#3478f6','#20a464','#e4a347','#8b6de3','#d44d9a','#46a1d9','#78889e'];
  const devices = Object.keys(areas), projects = ['3267504J2G_A面','C509048_B面','329134S_P129','1-A'];
  const sns = ['SI1020E1112','SI1020E1148','SI1020E1176','SI1020E1204','SI1020E1232'];
  const records = [];
  // Keep the existing seven-type totals for the latest seven days (100 alerts).
  // Earlier weeks use deterministic daily records rather than period multipliers.
  for (let week = 0; week < 26; week++) types.forEach((type, t) => {
    const count = weights[t] + (week ? (week * 3 + t * 2) % 7 - 3 : 0);
    for (let n = 0; n < count; n++) {
      const date = new Date(Date.UTC(2026,7,20)); date.setUTCDate(date.getUTCDate() - week * 7 - (n * 3 + t) % 7);
      const deviceIndex = (n + t + week) % devices.length, device = devices[deviceIndex];
      records.push({'时间':date.toISOString().slice(0,10),'设备名称':device,'设备SN':sns[deviceIndex],'设备位置（一级）':areas[device],'设备位置（二级）':areas[device].replace('区域','产线')+'1','项目名称':projects[(n+t)%projects.length],'告警类型':type,'告警级别':(n+t+week)%6===0?'紧急':'一般','告警次数':1});
    }
  });
  window.spcAlertDailyRecords = records;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.spcAlertChartRows = (chart, dimension, grain = 'day') => {
    const filtered = window.spcFilterQualityChartRows?.(chart, records, '', '') || records;
    const groups = new Map();
    filtered.forEach(record => {
      const raw = record[dimension]; if (raw == null) return;
      const label = /时间|日期/.test(dimension) ? raw.slice(0, grain === 'month' ? 7 : 10) : String(raw);
      const row = groups.get(label) || {label,value:0,normal:0,urgent:0};
      row.value++; row[record['告警级别']==='紧急'?'urgent':'normal']++; groups.set(label,row);
    });
    return [...groups.values()].sort((a,b)=>a.label.localeCompare(b.label,'zh-CN'));
  };
  window.spcRenderAlertDailyChart = chart => {
    const index = panels.indexOf(chart); if (index < 0 || index > 2) return;
    const dimension = chart.dataset.dimension || ['设备名称','时间','告警类型'][index];
    const grain = chart.dataset.timeGrain || 'day';
    const data = window.spcAlertChartRows(chart, dimension, grain), total = data.reduce((sum,row)=>sum+row.value,0);
    const head = chart.querySelector('.phead'), body = chart.querySelector('.chart-body');
    const title = head.querySelector('b')?.textContent || ['告警次数统计','告警趋势统计','告警分布'][index];
    head.innerHTML = `<b>${esc(title)}</b>${index<2?'<div class="legend"><span><i style="background:#df4a4a"></i>紧急</span><span><i style="background:#3478f6"></i>一般</span></div>':''}`;
    if (index === 2) {
      let offset=0; const circumference=358.14;
      body.style.cssText='display:flex;align-items:center;justify-content:center;gap:12px';
      body.innerHTML=`<svg style="max-width:132px;flex:0 0 110px" viewBox="0 0 190 174" aria-label="告警分布">${data.map((row,i)=>{const percent=total?row.value/total*100:0,length=circumference*percent/100;const circle=`<circle cx="87" cy="87" r="57" fill="none" stroke="${colors[i%colors.length]}" stroke-width="34" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 87 87)"><title>${esc(row.label)}：${row.value}次，占比${percent.toFixed(1)}%</title></circle>`;offset+=length;return circle}).join('')}</svg><div class="legend alert-rule-legend" style="flex:1;min-width:0;grid-template-columns:1fr;max-height:100%;overflow:auto">${data.map((row,i)=>`<span title="${esc(row.label)}：${row.value}次"><i style="background:${colors[i%colors.length]}"></i>${esc(row.label)} ${(row.value/(total||1)*100).toFixed(1)}% · ${row.value}次</span>`).join('')}</div>`;
    } else {
      const max=Math.max(1,...data.map(row=>row.value)),step=480/Math.max(1,data.length),labelStep=Math.max(1,Math.ceil(data.length/8));
      body.innerHTML=`<svg viewBox="0 0 560 174" aria-label="${esc(title)}"><path d="M38 18H545M38 61H545M38 104H545M38 150H545" class="grid"/>${data.map((row,i)=>{const x=48+i*step+step*.2,w=Math.max(.5,Math.min(46,step*.6)),normal=row.normal/max*120,urgent=row.urgent/max*120;return `<rect x="${x}" y="${150-normal}" width="${w}" height="${normal}" fill="#3478f6"><title>${esc(row.label)} 一般：${row.normal}次</title></rect><rect x="${x}" y="${150-normal-urgent}" width="${w}" height="${urgent}" fill="#df4a4a"><title>${esc(row.label)} 紧急：${row.urgent}次</title></rect>${i%labelStep===0?`<text class="axis" x="${x+w/2}" y="168" text-anchor="middle">${esc(/时间|日期/.test(dimension)?row.label.slice(grain==='month'?2:5):row.label)}</text>`:''}`}).join('')}</svg>`;
    }
    chart.dataset.alertTotal=String(total);
  };
  panels.slice(0,3).forEach(window.spcRenderAlertDailyChart);
  window.addEventListener('spc-chart-scope-change', event=>window.spcRenderAlertDailyChart(event.detail.chart));
  document.addEventListener('spc-chart-time-grain-change', event=>window.spcRenderAlertDailyChart(event.target));
  document.addEventListener('spc-chart-dimension-change', event=>window.spcRenderAlertDailyChart(event.target));
})();
