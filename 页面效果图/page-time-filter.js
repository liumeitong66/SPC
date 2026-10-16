(()=>{
  const main=document.querySelector('main'),charts=()=>[...document.querySelectorAll('[data-custom-chart]')];
  if(!main||!charts().length)return;
  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const latest=window.spcAlertDailyRecords?.reduce((v,r)=>r['时间']>v?r['时间']:v,'')||'2026-08-04';
  const reference=new Date(latest+'T00:00:00'),key='spc-page-view-time:'+location.pathname;
  function preset(type){const end=new Date(reference),start=new Date(end);if(type==='week'){start.setDate(start.getDate()-(start.getDay()+6)%7-7);end.setTime(+start);end.setDate(end.getDate()+6)}else if(type==='month'){start.setMonth(start.getMonth()-1);if(start.getDate()!==end.getDate())start.setDate(0);start.setDate(start.getDate()+1)}else start.setDate(start.getDate()-6);return {start:iso(start)+'T00:00',end:iso(end)+'T23:59',preset:type}}
  let active=preset('7d');try{const s=JSON.parse(sessionStorage.getItem(key));if(s?.start&&s?.end&&s.start<=s.end)active=s}catch{}
  window.spcPageTimeRange=active;
  function stamp(raw){if(raw==null)return NaN;let text=String(raw).trim();if(/^\d{2}-\d{2}$/.test(text))text=reference.getFullYear()+'-'+text;if(/^\d{4}-\d{2}$/.test(text))return {month:text};if(/^\d{4}-\d{2}-\d{2}$/.test(text))text+='T00:00:00';return Date.parse(text.replace(' ','T'))}
  window.spcFilterPageTimeRows=(rows,dimension)=>{const min=Date.parse(active.start),max=Date.parse(active.end)+59999;return rows.filter(r=>{const raw=r['检测开始时间']??r['检测时间']??r['时间']??r.time??r.date??(/时间|日期/.test(dimension)?r.label:null),date=stamp(raw);if(typeof date==='object')return date.month>=active.start.slice(0,7)&&date.month<=active.end.slice(0,7);if(/^\d{4}-\d\d-\d\d$/.test(String(raw)))return date<=max&&date+86399999>=min;return Number.isFinite(date)&&date>=min&&date<=max})};
  const original=window.spcFilterQualityChartRows;
  window.spcFilterQualityChartRows=(el,rows,dimension,measure)=>window.spcFilterPageTimeRows(original?.(el,rows,dimension,measure)||rows,dimension);
  const bar=document.createElement('section');bar.className='filters page-time-filter';bar.dataset.pageTimeFilter='';bar.innerHTML='<div class="field time"><label>时间范围</label><div class="control" data-page-time-control></div></div><div class="page-time-shortcuts"><button class="btn" type="button" data-page-period="7d">最近7天</button><button class="btn" type="button" data-page-period="week" title="上一个完整的周一至周日">最近一周</button><button class="btn" type="button" data-page-period="month">最近一个月</button></div><div class="actions"><button class="btn" type="button" data-page-time-reset>重置</button><button class="btn primary" type="button" data-page-time-query>查询</button></div>';
  const anchor=main.querySelector('.metric-groups,.metrics,.quality-grid,.charts,.export-chart,[data-layout-group]');if(anchor)main.insertBefore(bar,[...main.children].find(n=>n===anchor||n.contains(anchor))||main.firstChild);else main.prepend(bar);
  const mouth=main.querySelector('.quality-mouth-toolbar,.project-mouth-toolbar,.defect-mouth-toolbar');if(mouth){mouth.classList.add('page-time-mouth-toolbar');mouth.append(bar);bar.classList.add('page-time-inline')}
  const control=bar.querySelector('[data-page-time-control]');
  function paint(range){control.dataset.start=range.start;control.dataset.end=range.end;control.innerHTML=`<span aria-hidden="true">▣</span><span>${range.start.replace('T',' ')}</span><span class="placeholder">至</span><span>${range.end.replace('T',' ')}</span>`;bar.querySelectorAll('[data-page-period]').forEach(b=>b.classList.toggle('is-active',b.dataset.pagePeriod===range.preset))}
  paint(active);window.spcBindTimeControl?.(control);
  const aliases={time:'检测开始时间',devices:'设备名称',templates:'模板名称',locations:'设备位置（一级）',locations2:'设备位置（二级）',deviceSn:'设备SN',judgementStage:'判定结果',defectType:'缺陷类型'};
  function metricValue(metric){const g=metric.closest('[data-combo-layout]');if(g)return window.spcGroupMetricValue?.(metric,g);let s={};try{s=JSON.parse(metric.dataset.metricScope||'{}')}catch{}const rules=(s.rules||[]).map(r=>({...r,field:aliases[r.field]||r.field}));if(s.time&&s.time!=='all')rules.push({field:'检测开始时间',operator:'等于',value:s.time==='custom'?'range':s.time==='month'?'past30':s.time,start:s.start,end:s.end});for(const [a,f]of [['devices','设备名称'],['templates','模板名称'],['locations','设备位置（一级）']])if(s[a]?.length)rules.push({field:f,operator:'包含',values:s[a]});const proxy=document.createElement('div');proxy.dataset.chartScope=JSON.stringify({match:s.match||'所有',rules});return window.spcGroupMetricValue?.(metric,proxy)}
  let refreshing=false;
  function refresh(){if(refreshing)return;refreshing=true;try{window.spcRefreshPageCharts?.();for(const c of charts()){window.spcApplyNativeChartScope?.(c);window.dispatchEvent(new CustomEvent('spc-chart-scope-change',{detail:{chart:c}}))}for(const metric of document.querySelectorAll('[data-custom-metric]')){const target=metric.querySelector('.metric-value,strong');if(target)target.innerHTML=metricValue(metric)??'—'}window.dispatchEvent(new CustomEvent('spc-page-time-change',{detail:{...active}}))}finally{refreshing=false}}
  function apply(range){active={...range};window.spcPageTimeRange=active;sessionStorage.setItem(key,JSON.stringify(active));paint(active);refresh()}
  bar.querySelectorAll('[data-page-period]').forEach(b=>b.onclick=()=>apply(preset(b.dataset.pagePeriod)));
  bar.querySelector('[data-page-time-reset]').onclick=()=>apply(preset('7d'));
  bar.querySelector('[data-page-time-query]').onclick=()=>{const {start,end}=control.dataset;if(!start||!end||start>end){window.SPCPrototype?.toast?.('请选择有效的开始和结束时间','error');return}apply({start,end,preset:''})};
  window.addEventListener('spc-page-mouth-change',()=>setTimeout(refresh,0));
  document.addEventListener('click',e=>{if(e.target.closest('[data-quality-chart-save],[data-metric-save],[data-group-save]'))setTimeout(refresh,30)});
  let count=charts().length+document.querySelectorAll('[data-custom-metric]').length;new MutationObserver(()=>{const next=charts().length+document.querySelectorAll('[data-custom-metric]').length;if(next!==count){count=next;setTimeout(refresh,0)}}).observe(main,{subtree:true,childList:true});
  setTimeout(refresh,50);
})();
