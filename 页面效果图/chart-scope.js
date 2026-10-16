(() => {
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const chart=()=>document.querySelector('[data-custom-chart].is-editor-selected');
  const drawer=()=>document.querySelector('[data-quality-config-drawer][data-mode="chart"]');
  const operators={name:['等于','不等于','包含','不包含','为空','不为空'],number:['等于','不等于','大于','大于或等于','小于','小于或等于','为空','不为空','包含','不包含'],time:['等于','晚于','早于','为空','不为空']};
  const dates=[['date','具体日期'],['range','起止日期'],['today','今天'],['yesterday','昨天'],['thisWeek','本周'],['lastWeek','上周'],['thisMonth','本月'],['lastMonth','上月'],['past7','过去7天内'],['past30','过去30天内'],['pastHalfYear','过去半年内']];
  const kind=name=>/日期|时间/.test(name)?'time':/数|率|DPPM|耗时|数量|占比|金额/.test(name)?'number':'name';
  const storageKey=element=>`spc-chart-scope:${location.pathname}:${[...document.querySelectorAll('[data-custom-chart]')].indexOf(element)}`;
  const read=element=>{element=element?.closest("[data-combo-layout]")||element;try{const value=JSON.parse(element?.dataset.chartScope||localStorage.getItem(storageKey(element))||'{}');return {match:value.match==='任意'?'任意':'所有',rules:Array.isArray(value.rules)?value.rules.map(rule=>({...rule,field:window.spcNormalizeScopeField?.(rule.field)||rule.field})):[]}}catch{return {match:'所有',rules:[]}}};
  const summary=scope=>scope.rules.length?`${scope.rules.length} 个条件`:'全部';
  const enumerations = {
    '缺陷类型':['缺件','错位/偏移','错件','少锡','多锡','虚焊','连锡','立碑','极反','多件','翻件','本体浮高','翘脚','爬锡不良','损件','飞件','跨件连锡','脏污异物','锡球','金手指缺陷','红胶','侧立','偏移','其他','冷焊','少胶','多胶','桥丝断裂','测距NG','SN NG'],
    '判定结果':['机器判定','一次复判','最终复判'],
    '机器判定结果':['良好','不良'],
    '一次复判结果':['良好','不良','直通','误报','漏报'],
    '最终复判结果':['良好','不良','直通','误报','漏报']
  };
  const fields=()=>{
    const root=drawer(),values=[...root?.querySelectorAll('[data-quality-config="dimension"] option,[data-heatmap="x"] option,[data-heatmap="y"] option')||[]].map(option=>window.spcNormalizeScopeField?.(option.textContent.trim())||option.textContent.trim()).filter(Boolean);
    return [...new Set(values.length?values:['类别'])];
  };
  function valuesFor(field){
    if(active?.matches('[data-combo-layout]')&&window.spcComboSamples){const source=window.spcComboSamples;const names=[...new Set([...source.devices.map(d=>d.name),...source.projects.flatMap(p=>p.devices||[])])];if(field==='设备名称')return names;if(field==='设备SN')return source.devices.map(d=>d.sn);if(field==='模板名称')return [...new Set([...source.projects.map(p=>p.name),...source.devices.flatMap(d=>d.projects?.map(p=>p.name)||[])])];if(field==='设备位置（一级）'||field==='设备位置（二级）')return [...new Set(names.map(n=>{const area=window.spcQualityChartSamples?.comparisonDevices?.find(d=>d.name===n)?.area||'区域'+String.fromCharCode(65+(Number(n.replace('AOI-',''))-1)%4);return field==='设备位置（二级）'?area.replace('区域','产线')+'1':area}))]}

    if(enumerations[field])return [...enumerations[field]];
    const values=new Set(),data=window.spcQualityChartSamples;
    const add=value=>{const text=String(value??'').trim();if(text&&text.length<100)values.add(text)};
    for(const device of data?.devices||[]){
      if(field==='设备名称')add(device.name);
      if(field==='设备SN')add(device.sn);if(field==='设备位置（二级）'){const area=data.comparisonDevices?.find(item=>item.name===device.name)?.area;if(area)add(area.replace('区域','产线')+'1')}
      if(field==='设备位置（一级）')add(data.comparisonDevices?.find(item=>item.name===device.name)?.area);
      if(field==='运行状态')add(device.lastDataTime?'运行中':'离线');
      if(field==='启用状态')add('启用');
      if(field==='模板名称')device.projects?.forEach(project=>add(project.name));
      if(field==='模板ID')device.projects?.forEach(project=>add(project.uuid));
    }
    if(field==='设备位置（一级）')Object.values(window.spcAlertDeviceAreas||{}).forEach(add);
    for(const record of window.spcAlertDailyRecords||[])if(record[field]!=null)add(record[field]);
    for(const table of document.querySelectorAll('table')){
      const headings=[...table.querySelectorAll('thead th')];
      const index=headings.findIndex(th=>th.textContent.trim()===field||th.textContent.trim().includes(field));
      if(index<0)continue;
      table.querySelectorAll('tbody tr').forEach(row=>add(row.cells[index]?.textContent));
    }
    return [...values].slice(0,120);
  }
  let popup,active,draft,activeFields=[];
  function valueMarkup(rule){
    if(['为空','不为空'].includes(rule.operator))return '<span class="metric-scope-empty"></span>';
    if(kind(rule.field)==='time'){
      const allowed=rule.operator==='等于'?dates:dates.filter(([value])=>['date','today','tomorrow','yesterday'].includes(value));
      return `<div class="metric-scope-time"><select data-rule-value aria-label="筛选值"><option value="">请选择</option>${allowed.map(([value,label])=>`<option value="${value}"${rule.value===value?' selected':''}>${label}</option>`).join('')}</select>${rule.value==='date'?`<input type="date" data-rule-date aria-label="具体日期" value="${esc(rule.date||'')}">`:''}${rule.value==='range'?`<input type="date" data-rule-start aria-label="开始日期" value="${esc(rule.start||'')}"><span>至</span><input type="date" data-rule-end aria-label="结束日期" value="${esc(rule.end||'')}">`:''}</div>`;
    }
    const choices=valuesFor(rule.field),multi=['包含','不包含'].includes(rule.operator);
    if((choices.length||kind(rule.field)==='name')&&['等于','不等于','包含','不包含'].includes(rule.operator)){
      const selected=multi?(rule.values||[]):[rule.value].filter(Boolean);
      return `<div class="chart-scope-combo" data-scope-combo><button type="button" class="chart-scope-combo-trigger" data-combo-trigger aria-expanded="false">${esc(selected.length?multi?`已选 ${selected.length} 项`:selected[0]:'请选择')}</button><div class="chart-scope-combo-menu" hidden><input type="search" data-combo-search aria-label="搜索筛选值" placeholder="搜索"><div class="chart-scope-combo-options">${choices.map(value=>`<button type="button" data-combo-value="${esc(value)}"${selected.includes(value)?' class="is-selected"':''}>${multi?`<input type="checkbox" tabindex="-1"${selected.includes(value)?' checked':''}>`:''}<span>${esc(value)}</span></button>`).join('')}</div></div></div>`;
    }
    return `<input type="${kind(rule.field)==='number'&&!multi?'number':'text'}" data-rule-value aria-label="筛选值" value="${esc(rule.value||'')}">`;
  }
  function render(){
    const choices=[...new Set([...activeFields,...draft.rules.map(rule=>rule.field).filter(field=>field&&field!=='类别')])];
    draft.rules.forEach(rule=>{if(rule.field==='类别')rule.field=choices[0]});
    popup.innerHTML=`<div class="metric-scope-head"><strong>设置筛选条件</strong><span class="metric-scope-match">符合以下 <select data-scope-match aria-label="条件匹配方式"><option${draft.match==='所有'?' selected':''}>所有</option><option${draft.match==='任意'?' selected':''}>任意</option></select> 条件</span><button type="button" class="metric-scope-close" aria-label="关闭">×</button></div><div class="metric-scope-rules">${draft.rules.map((rule,index)=>`<div class="metric-scope-rule" data-scope-rule="${index}"><select data-rule-field aria-label="筛选字段">${choices.map(value=>`<option${value===rule.field?' selected':''}>${esc(value)}</option>`).join('')}</select><select class="metric-scope-operator" aria-label="筛选关系">${operators[kind(rule.field)].map(value=>`<option${value===rule.operator?' selected':''}>${value}</option>`).join('')}</select>${valueMarkup(rule)}<button type="button" class="metric-scope-remove" aria-label="移除条件">×</button></div>`).join('')}</div><button type="button" class="metric-scope-add">＋ 添加条件</button><div class="metric-scope-foot"><button type="button" data-scope-reset>重置</button><button type="button" data-scope-apply>确定</button></div>`;
    popup.querySelector('[data-scope-match]').onchange=event=>draft.match=event.target.value;
    popup.querySelector('.metric-scope-close').onclick=()=>popup.hidden=true;
    popup.querySelector('.metric-scope-add').onclick=()=>{draft.rules.push({field:choices[0],operator:'等于',value:''});render()};
    popup.querySelector('[data-scope-reset]').onclick=()=>{draft={match:'所有',rules:[]};render()};
    popup.querySelector('[data-scope-apply]').onclick=()=>{
      for(const rule of draft.rules){if(rule.value==='date'&&!rule.date){popup.querySelector('[data-rule-date]')?.focus();return}if(rule.value==='range'&&(!rule.start||!rule.end||rule.start>rule.end)){popup.querySelector('[data-rule-start]')?.focus();return}}
      draft.rules=draft.rules.filter(rule=>['为空','不为空'].includes(rule.operator)||String(rule.value||'').trim());
      active.dataset.chartScope=JSON.stringify(draft);
      try{localStorage.setItem(storageKey(active),active.dataset.chartScope)}catch{}
      const button=drawer()?.querySelector('[data-chart-scope]');if(button)button.textContent=summary(draft);
      popup.hidden=true;
      drawer()?.dispatchEvent(new Event('change',{bubbles:true}));
      window.dispatchEvent(new CustomEvent('spc-chart-scope-change',{detail:{chart:active}}));
    };
    popup.querySelectorAll('[data-scope-rule]').forEach(row=>{
      const rule=draft.rules[Number(row.dataset.scopeRule)],field=row.querySelector('[data-rule-field]'),operator=row.querySelector('.metric-scope-operator'),value=row.querySelector('[data-rule-value]');
      field.onchange=()=>{rule.field=field.value;rule.operator='等于';rule.value='';rule.values=[];rule.date='';render()};
      operator.onchange=()=>{rule.operator=operator.value;rule.value='';rule.values=[];rule.date='';render()};
      if(value){value.oninput=()=>rule.value=value.value;value.onchange=()=>{rule.value=value.value;if(kind(rule.field)==='time')render()}}
      const combo=row.querySelector('[data-scope-combo]');if(combo){
        const trigger=combo.querySelector('[data-combo-trigger]'),menu=combo.querySelector('.chart-scope-combo-menu'),search=combo.querySelector('[data-combo-search]');
        trigger.onclick=()=>{menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)search.focus()};
        search.oninput=()=>{const term=search.value.trim().toLocaleLowerCase();combo.querySelectorAll('[data-combo-value]').forEach(option=>option.hidden=!option.dataset.comboValue.toLocaleLowerCase().includes(term))};
        combo.querySelectorAll('[data-combo-value]').forEach(option=>option.onclick=()=>{const selected=option.dataset.comboValue;if(['包含','不包含'].includes(rule.operator)){const list=new Set(rule.values||[]);list.has(selected)?list.delete(selected):list.add(selected);rule.values=[...list];rule.value=rule.values.join('、');option.classList.toggle('is-selected',list.has(selected));const check=option.querySelector('input');if(check)check.checked=list.has(selected);trigger.textContent=rule.values.length?`已选 ${rule.values.length} 项`:'请选择'}else{rule.value=selected;rule.values=[];render()}});
      }
      const date=row.querySelector('[data-rule-date]');if(date)date.onchange=()=>rule.date=date.value;
      const start=row.querySelector('[data-rule-start]'),end=row.querySelector('[data-rule-end]');if(start)start.onchange=()=>rule.start=start.value;if(end)end.onchange=()=>rule.end=end.value;
      row.querySelector('.metric-scope-remove').onclick=()=>{draft.rules.splice(Number(row.dataset.scopeRule),1);render()};
    });
  }
  function ensure(){
    const root=drawer(),item=chart();
    if(popup&&!popup.hidden&&active?.matches('[data-combo-layout]')&&document.querySelector('[data-combo-drawer]'))return;
    if(popup&&!popup.hidden&&(!root||item!==active))popup.hidden=true;
    if(!root||!item)return;
    const title=root.querySelector('[data-quality-title-field]');if(!title)return;
    let field=root.querySelector('[data-chart-scope-field]');
    if(!field){field=document.createElement('div');field.className='quality-config-field full metric-scope-field';field.dataset.chartScopeField='';field.innerHTML='<label>统计范围</label><button type="button" class="metric-scope-trigger" data-chart-scope>全部</button>';title.after(field)}
    const button=field.querySelector('button'),label=summary(read(item));if(button.textContent!==label)button.textContent=label;
    field.querySelector('button').onclick=()=>{active=item;activeFields=fields();draft=read(item);if(!draft.rules.length)draft.rules=[{field:activeFields[0],operator:'等于',value:''}];if(!popup){popup=document.createElement('section');popup.className='metric-scope-dialog';popup.setAttribute('role','dialog');popup.setAttribute('aria-label','统计范围');document.body.append(popup)}render();popup.hidden=false;const rect=field.getBoundingClientRect();popup.style.top=Math.max(12,Math.min(rect.bottom+8,innerHeight-popup.offsetHeight-12))+'px'};
  }
  const dateFor=value=>{const input=document.querySelector('[data-comparison-date="end"],[data-project-trend-range] input:last-of-type,[data-device-trend-range] input:last-of-type,#stats-end');const sample=window.spcAlertDailyRecords?.length?window.spcAlertDailyRecords.reduce((latest,row)=>row['时间']>latest?row['时间']:latest,''):input?.value?.slice(0,10);const day=sample?new Date(`${sample}T00:00:00`):new Date(),date=new Date(day.getFullYear(),day.getMonth(),day.getDate());if(value==='tomorrow')date.setDate(date.getDate()+1);if(value==='yesterday')date.setDate(date.getDate()-1);return date};
  function matches(row,rule,dimension,measure){
    const type=kind(rule.field),raw=rule.field===dimension?row.label:rule.field===measure?row.value:row[rule.field];
    if(raw===undefined)return false;
    if(rule.operator==='为空')return raw==null||raw==='';if(rule.operator==='不为空')return raw!=null&&raw!=='';
    const value=type==='time'?(rule.value==='date'?new Date(rule.date):dateFor(rule.value)):type==='number'?Number(rule.value):String(rule.value);
    const actual=type==='time'?new Date(/^\d{2}-\d{2}$/.test(String(raw))?`2026-${raw}`:raw):type==='number'?Number(raw):String(raw);
    if(type==='time'&&Number.isNaN(+actual))return true;
    if(type==='time'&&rule.operator==='等于'&&rule.value==='range')return actual>=new Date(`${rule.start}T00:00:00`)&&actual<=new Date(`${rule.end}T23:59:59`);
    if(type==='time'&&rule.operator==='等于'&&!['date','today','tomorrow','yesterday'].includes(rule.value)){
      const today=dateFor('today'),start=new Date(today),end=new Date(today);
      if(rule.value==='thisWeek'||rule.value==='lastWeek'){start.setDate(start.getDate()-(start.getDay()+6)%7-(rule.value==='lastWeek'?7:0));end.setTime(+start);end.setDate(end.getDate()+7)}
      else if(rule.value==='thisMonth'||rule.value==='lastMonth'){start.setDate(1);if(rule.value==='lastMonth')start.setMonth(start.getMonth()-1);end.setTime(+start);end.setMonth(end.getMonth()+1)}
      else if(rule.value==='past7'||rule.value==='past30'){start.setDate(start.getDate()-(rule.value==='past7'?6:29));end.setDate(end.getDate()+1)}
      else if(rule.value==='pastHalfYear'){start.setMonth(start.getMonth()-6);end.setDate(end.getDate()+1)}
      else return false;
      return actual>=start&&actual<end;
    }
    if(rule.operator==='等于')return type==='time'?actual.toDateString()===value.toDateString():actual===value;
    if(rule.operator==='不等于')return actual!==value;
    if(rule.operator==='包含')return rule.values?.length?rule.values.some(item=>String(actual).includes(item)):String(actual).includes(String(value));
    if(rule.operator==='不包含')return rule.values?.length?rule.values.every(item=>!String(actual).includes(item)):!String(actual).includes(String(value));
    if(rule.operator==='大于'||rule.operator==='晚于')return actual>value;
    if(rule.operator==='大于或等于')return actual>=value;
    if(rule.operator==='小于'||rule.operator==='早于')return actual<value;
    if(rule.operator==='小于或等于')return actual<=value;
    return true;
  }
  window.spcFilterQualityChartRows=(element,rows,dimension,measure)=>{const scope=read(element);if(!scope.rules.length)return rows;return rows.filter(row=>scope.match==='任意'?scope.rules.some(rule=>matches(row,rule,dimension,measure)):scope.rules.every(rule=>matches(row,rule,dimension,measure)))};
  window.spcOpenGroupScope=(element,choices)=>{active=element;activeFields=choices;draft=read(element);if(!draft.rules.length)draft.rules=[{field:choices[0],operator:'等于',value:''}];if(!popup){popup=document.createElement('section');popup.className='metric-scope-dialog';popup.setAttribute('role','dialog');popup.setAttribute('aria-label','统计范围');document.body.append(popup)}render();popup.hidden=false;popup.style.top='100px'};
  window.spcReadChartScope=read;
  window.spcScopeValueOptions=field=>enumerations[field]?[...enumerations[field]]:valuesFor(field);
  let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;ensure()})}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',()=>queueMicrotask(ensure),true);ensure();
})();
