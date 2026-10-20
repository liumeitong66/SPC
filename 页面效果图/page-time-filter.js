// Shared compact judgement selector; retain the page's existing data handlers.
(() => {
  const selector='.quality-mouth-toolbar,.project-mouth-toolbar,.defect-mouth-toolbar,.project-mouth-global';
  const title=document.querySelector('.top-title,.top .title,.topbar .title');
  if(!title)return;
  title.classList.add('page-title-with-mouth');
  function place(field){
    title.querySelectorAll('.header-mouth-field').forEach(previous=>{if(previous!==field)previous.remove()});
    field.classList.add('header-mouth-field');
    if(field.parentElement!==title)title.append(field);
  }
  function sync(){
    const component=document.querySelector('[data-component-mouth-select]');
    if(component)place(component.closest('.component-mouth-field'));
    document.querySelectorAll(selector).forEach(toolbar=>{
      const segmented=toolbar.querySelector('.segmented');
      if(!segmented)return;
      const choices=[...segmented.querySelectorAll('[data-mouth],[data-defect-mouth]')];
      if(!choices.length)return;
      let select=toolbar._mouthSelect;
      if(!select){
        toolbar.classList.add('compact-mouth-toolbar');
        segmented.classList.add('mouth-source-options');
        segmented.setAttribute('aria-hidden','true');
        choices.forEach(choice=>choice.tabIndex=-1);
        const field=document.createElement('label');field.className='component-mouth-field';
        const label=toolbar.querySelector('.quality-mouth-label,.project-mouth-label,.defect-mouth-label');
        if(label)field.append(label);else{const text=document.createElement('span');text.textContent='统计口径';field.append(text)}
        select=document.createElement('select');select.dataset.pageMouthSelect='';select.setAttribute('aria-label','统计口径');
        choices.forEach((choice,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=choice.textContent.trim();select.append(option)});
        select.addEventListener('change',()=>choices[Number(select.value)]?.click());
        field.append(select);toolbar._mouthSelect=select;place(field);
        toolbar.classList.add('header-mouth-source');
      }
      const active=choices.findIndex(choice=>choice.classList.contains('active')||choice.classList.contains('on'));
      if(active>=0&&select.value!==String(active))select.value=String(active);
    });
  }
  sync();
  new MutationObserver(sync).observe(document.querySelector('main')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
})();
(()=>{
  const main=document.querySelector('main'),charts=()=>[...document.querySelectorAll('[data-custom-chart]')];
  if(!main||!charts().length)return;
  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const latest=window.spcAlertDailyRecords?.reduce((v,r)=>r['时间']>v?r['时间']:v,'')||'2026-08-04';
  const reference=new Date(latest+'T00:00:00'),key='spc-page-view-time:'+location.pathname;
  function preset(type){const end=new Date(reference),start=new Date(end);if(type==='month'||type==='halfYear'){const months=type==='halfYear'?6:1;start.setDate(1);start.setMonth(start.getMonth()-months);const last=new Date(start.getFullYear(),start.getMonth()+1,0).getDate();start.setDate(Math.min(end.getDate(),last));start.setDate(start.getDate()+1)}else start.setDate(start.getDate()-6);return {start:iso(start)+'T00:00',end:iso(end)+'T23:59',preset:type,presetVersion:2}}
  const defaultRange=()=>({...preset('7d'),preset:''});
  let active=defaultRange();try{const s=JSON.parse(sessionStorage.getItem(key));if(s?.start&&s?.end&&s.start<=s.end)active={...s,preset:s.presetVersion===2&&['7d','month','halfYear'].includes(s.preset)?s.preset:'',presetVersion:2}}catch{}
  window.spcPageTimeRange=active;
  window.spcPageTimeIsDefault=()=>active.start===preset('7d').start&&active.end===preset('7d').end;
  function stamp(raw){if(raw==null)return NaN;let text=String(raw).trim();if(/^\d{2}-\d{2}$/.test(text))text=reference.getFullYear()+'-'+text;if(/^\d{4}-\d{2}$/.test(text))return {month:text};if(/^\d{4}-\d{2}-\d{2}$/.test(text))text+='T00:00:00';return Date.parse(text.replace(' ','T'))}
  window.spcFilterPageTimeRows=(rows,dimension)=>{const min=Date.parse(active.start),max=Date.parse(active.end)+59999;return rows.filter(r=>{const raw=r['检测开始时间']??r['检测时间']??r['时间']??r.time??r.date??(/时间|日期/.test(dimension)?r.label:null),date=stamp(raw);if(raw==null){const period=r._sourcePeriod;return !!period&&active.start<=period.start&&active.end>=period.end}if(typeof date==='object')return date.month>=active.start.slice(0,7)&&date.month<=active.end.slice(0,7);if(/^\d{4}-\d\d-\d\d$/.test(String(raw)))return date<=max&&date+86399999>=min;return Number.isFinite(date)&&date>=min&&date<=max})};
  const original=window.spcFilterQualityChartRows;
  window.spcFilterQualityChartRows=(el,rows,dimension,measure)=>window.spcFilterPageTimeRows(original?.(el,rows,dimension,measure)||rows,dimension);
  const bar=document.createElement('section');bar.className='filters page-time-filter';bar.dataset.pageTimeFilter='';bar.innerHTML='<div class="field time"><label>时间范围</label><div class="control" data-page-time-control></div></div><select class="page-time-preset" aria-label="快捷时间范围" data-page-time-preset><option value="" disabled hidden>请选择</option><option value="7d">最近7天</option><option value="month">最近1个月</option><option value="halfYear">最近半年</option></select><div class="actions"><button class="btn" type="button" data-page-time-reset>重置</button><button class="btn primary" type="button" data-page-time-query>查询</button></div>';
  let bounding=false;
  function enforceVisualBounds(){
    if(bounding)return;bounding=true;
    try{
      const region=main.querySelector('[data-page-visual-region]'),body=region?.querySelector('[data-page-visual-body]');
      if(!body)return;
      document.querySelectorAll('[data-combo-layout],[data-custom-chart],[data-custom-metric]').forEach(el=>{
        if(body.contains(el)||el.closest('.quality-config-drawer,.proto-modal,.metric-card-editor'))return;
        if(el.closest('[data-combo-layout]')!==el&&el.closest('[data-combo-layout]'))return;
        let block=el;
        while(block.parentElement&&block.parentElement!==main&&block.parentElement!==region.parentElement&&!block.parentElement.matches('.quality-content,.alert-content')&&!block.parentElement.querySelector('table')&&!block.parentElement.matches('body'))block=block.parentElement;
        if(block.contains(region)||block.querySelector('table'))block=el;
        body.append(block);
      });
      const parent=region.parentElement,table=[...parent.children].find(node=>node!==region&&(node.matches('.shared-layout-table,.table-panel,.records,.export-workspace,.component-panel')||node.querySelector('table')));
      if(table&&(table.compareDocumentPosition(region)&Node.DOCUMENT_POSITION_FOLLOWING))table.before(region);
      main.querySelectorAll('.shared-table-drag').forEach(handle=>handle.remove());
    }finally{bounding=false}
  }
  window.spcEnforceVisualBounds=enforceVisualBounds;
  let boundsScheduled=false;
  new MutationObserver(()=>{if(boundsScheduled)return;boundsScheduled=true;queueMicrotask(()=>{boundsScheduled=false;enforceVisualBounds()})}).observe(document.body,{subtree:true,childList:true});
  function layoutVisuals(){
    if(main.querySelector('[data-page-visual-region]')?.contains(bar)){enforceVisualBounds();return;}
  if(document.body.dataset.page==='device-runtime-monitor'){main.querySelectorAll('[data-config-devices]').forEach(n=>n.remove());main.querySelectorAll('[data-runtime-chart] .phead-title span').forEach(n=>{if(n.textContent.trim()==='最近24小时')n.remove()})}
  const container=main.querySelector('.quality-content,.alert-content')||main;
  const mouth=main.querySelector('.quality-mouth-toolbar,.project-mouth-toolbar,.defect-mouth-toolbar,.project-mouth-global');
  if(mouth)mouth.classList.add('page-global-mouth-toolbar');
  const visualRoots=[...container.children].filter(n=>!n.matches('table,.table-panel,.records,.shared-layout-table')&&!n.querySelector('table')&&(n.matches('[data-custom-chart],[data-custom-metric],[data-combo-layout]')||n.querySelector('[data-custom-chart],[data-custom-metric],[data-combo-layout]')));
  const region=document.createElement('section');region.className='page-visual-region';region.dataset.pageVisualRegion='';region.setAttribute('aria-label','图表统计');
  const head=document.createElement('header');head.className='page-visual-head';const title=document.createElement('b');title.textContent='图表统计';head.append(title,bar);
  const visualBody=document.createElement('div');visualBody.className='page-visual-body';visualBody.dataset.pageVisualBody='';region.append(head,visualBody);
  if(visualRoots.length){visualRoots[0].before(region);visualRoots.forEach(n=>visualBody.append(n))}else container.prepend(region);
  }
  layoutVisuals();
  const control=bar.querySelector('[data-page-time-control]');
  function paint(range){control.dataset.start=range.start;control.dataset.end=range.end;control.innerHTML=`<span aria-hidden="true">▣</span><span>${range.start.replace('T',' ')}</span><span class="placeholder">至</span><span>${range.end.replace('T',' ')}</span>`;bar.querySelector('[data-page-time-preset]').value=range.preset||''}
  paint(active);window.spcBindTimeControl?.(control);
  const aliases={time:'检测开始时间',devices:'设备名称',templates:'模板名称',locations:'设备位置（一级）',locations2:'设备位置（二级）',deviceSn:'设备SN',judgementStage:'判定结果',defectType:'缺陷类型'};
  function metricValue(metric){const g=metric.closest('[data-combo-layout]');if(g)return window.spcGroupMetricValue?.(metric,g);let s={};try{s=JSON.parse(metric.dataset.metricScope||'{}')}catch{}const rules=(s.rules||[]).map(r=>({...r,field:aliases[r.field]||r.field}));if(s.time&&s.time!=='all')rules.push({field:'检测开始时间',operator:'等于',value:s.time==='custom'?'range':s.time==='month'?'past30':s.time,start:s.start,end:s.end});for(const [a,f]of [['devices','设备名称'],['templates','模板名称'],['locations','设备位置（一级）']])if(s[a]?.length)rules.push({field:f,operator:'包含',values:s[a]});const proxy=document.createElement('div');proxy.dataset.chartScope=JSON.stringify({match:s.match||'所有',rules});return window.spcGroupMetricValue?.(metric,proxy)}
  let refreshing=false;
  function refresh(){if(refreshing)return;refreshing=true;try{layoutVisuals();window.spcRefreshPageCharts?.();for(const c of charts()){window.spcApplyNativeChartScope?.(c);window.dispatchEvent(new CustomEvent('spc-chart-scope-change',{detail:{chart:c}}))}for(const metric of document.querySelectorAll('[data-custom-metric]')){const target=metric.querySelector('.metric-value,strong');if(target){const scope=metric.closest('[data-combo-layout]')?.dataset.chartScope||metric.dataset.metricScope||'{}';let hasScope=false;try{const s=JSON.parse(scope);hasScope=!!s.rules?.length||s.time&&s.time!=='all'||['devices','templates','locations'].some(k=>s[k]?.length)}catch{}if(!window.spcPageTimeIsDefault()||hasScope){if(!metric._pageOriginalValue)metric._pageOriginalValue=target.innerHTML;target.innerHTML=metricValue(metric)??'—'}else if(metric._pageOriginalValue)target.innerHTML=metric._pageOriginalValue}}window.dispatchEvent(new CustomEvent('spc-page-time-change',{detail:{...active}}))}finally{refreshing=false}}
  function apply(range){active={...range};window.spcPageTimeRange=active;sessionStorage.setItem(key,JSON.stringify(active));paint(active);refresh()}
  bar.querySelector('[data-page-time-preset]').onchange=e=>{if(e.target.value)apply(preset(e.target.value))};
  bar.querySelector('[data-page-time-reset]').onclick=()=>apply(defaultRange());
  bar.querySelector('[data-page-time-query]').onclick=()=>{const {start,end}=control.dataset;if(!start||!end||start>end){window.SPCPrototype?.toast?.('请选择有效的开始和结束时间','error');return}apply({start,end,preset:''})};
  window.addEventListener('spc-page-mouth-change',()=>{document.querySelectorAll('[data-custom-metric]').forEach(m=>delete m._pageOriginalValue);setTimeout(refresh,0)});
  document.addEventListener('click',e=>{if(e.target.closest('[data-quality-chart-save],[data-metric-save],[data-group-save]'))setTimeout(refresh,30)});
  let count=charts().length+document.querySelectorAll('[data-custom-metric]').length;new MutationObserver(()=>{const next=charts().length+document.querySelectorAll('[data-custom-metric]').length;if(next!==count){count=next;setTimeout(refresh,0)}}).observe(main,{subtree:true,childList:true});
  setTimeout(refresh,50);
})();
