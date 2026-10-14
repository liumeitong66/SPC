(() => {
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const chart=()=>document.querySelector('[data-custom-chart].is-editor-selected');
  const drawer=()=>document.querySelector('[data-quality-config-drawer][data-mode="chart"]');
  const operators={name:['等于','不等于','包含','不包含','为空','不为空'],number:['等于','不等于','大于','大于或等于','小于','小于或等于','为空','不为空','包含','不包含'],time:['等于','晚于','早于','为空','不为空']};
  const dates=[['date','具体日期'],['today','今天'],['tomorrow','明天'],['yesterday','昨天'],['thisWeek','本周'],['lastWeek','上周'],['thisMonth','本月'],['past7','过去7天内'],['past30','过去30天内']];
  const kind=name=>/日期|时间/.test(name)?'time':/数|率|DPPM|耗时|数量|占比|金额/.test(name)?'number':'name';
  const storageKey=element=>`spc-chart-scope:${location.pathname}:${[...document.querySelectorAll('[data-custom-chart]')].indexOf(element)}`;
  const read=element=>{try{const value=JSON.parse(element?.dataset.chartScope||localStorage.getItem(storageKey(element))||'{}');return {match:value.match==='任意'?'任意':'所有',rules:Array.isArray(value.rules)?value.rules:[]}}catch{return {match:'所有',rules:[]}}};
  const summary=scope=>scope.rules.length?`${scope.rules.length} 个条件`:'全部';
  const fields=()=>{
    const root=drawer(),values=[...root?.querySelectorAll('[data-quality-config="dimension"] option,[data-heatmap="x"] option,[data-heatmap="y"] option')||[]].map(option=>option.textContent.trim()).filter(Boolean);
    return [...new Set(values.length?values:['类别'])];
  };
  function valuesFor(field){
    const values=new Set(),data=window.spcQualityChartSamples;
    const add=value=>{const text=String(value??'').trim();if(text&&text.length<100)values.add(text)};
    for(const device of data?.devices||[]){
      if(field==='设备名称')add(device.name);
      if(field==='设备SN')add(device.sn);
      if(field==='设备所在位置'||field==='所在位置（一级）')add(data.comparisonDevices?.find(item=>item.name===device.name)?.area);
      if(field==='运行状态')add(device.lastDataTime?'运行中':'离线');
      if(field==='启用状态')add('启用');
      if(field==='模板名称')device.projects?.forEach(project=>add(project.name));
      if(field==='模板ID')device.projects?.forEach(project=>add(project.uuid));
    }
    for(const table of document.querySelectorAll('table')){
      const headings=[...table.querySelectorAll('thead th')];
      const index=headings.findIndex(th=>th.textContent.trim()===field||th.textContent.trim().includes(field));
      if(index<0)continue;
      table.querySelectorAll('tbody tr').forEach(row=>add(row.cells[index]?.textContent));
    }
    return [...values].slice(0,120);
  }
  let popup,active,draft;
  function valueMarkup(rule){
    if(['为空','不为空'].includes(rule.operator))return '<span class="metric-scope-empty"></span>';
    if(kind(rule.field)==='time'){
      const allowed=rule.operator==='等于'?dates:dates.slice(0,4);
      return `<div class="metric-scope-time"><select data-rule-value aria-label="筛选值"><option value="">请选择</option>${allowed.map(([value,label])=>`<option value="${value}"${rule.value===value?' selected':''}>${label}</option>`).join('')}</select>${rule.value==='date'?`<input type="date" data-rule-date aria-label="具体日期" value="${esc(rule.date||'')}">`:''}</div>`;
    }
    const choices=valuesFor(rule.field),multi=['包含','不包含'].includes(rule.operator);
    if((choices.length||kind(rule.field)==='name')&&['等于','不等于','包含','不包含'].includes(rule.operator)){
      const selected=multi?(rule.values||[]):[rule.value].filter(Boolean);
      return `<div class="chart-scope-combo" data-scope-combo><button type="button" class="chart-scope-combo-trigger" data-combo-trigger aria-expanded="false">${esc(selected.length?multi?`已选 ${selected.length} 项`:selected[0]:'请选择')}</button><div class="chart-scope-combo-menu" hidden><input type="search" data-combo-search aria-label="搜索筛选值" placeholder="搜索"><div class="chart-scope-combo-options">${choices.map(value=>`<button type="button" data-combo-value="${esc(value)}"${selected.includes(value)?' class="is-selected"':''}>${multi?`<input type="checkbox" tabindex="-1"${selected.includes(value)?' checked':''}>`:''}<span>${esc(value)}</span></button>`).join('')}</div></div></div>`;
    }
    return `<input type="${kind(rule.field)==='number'&&!multi?'number':'text'}" data-rule-value aria-label="筛选值" value="${esc(rule.value||'')}">`;
  }
  function render(){
    const choices=fields();
    draft.rules.forEach(rule=>{if(!choices.includes(rule.field)){rule.field=choices[0];rule.operator='等于';rule.value='';rule.values=[]}});
    popup.innerHTML=`<div class="metric-scope-head"><strong>设置筛选条件</strong><span class="metric-scope-match">符合以下 <select data-scope-match aria-label="条件匹配方式"><option${draft.match==='所有'?' selected':''}>所有</option><option${draft.match==='任意'?' selected':''}>任意</option></select> 条件</span><button type="button" class="metric-scope-close" aria-label="关闭">×</button></div><div class="metric-scope-rules">${draft.rules.map((rule,index)=>`<div class="metric-scope-rule" data-scope-rule="${index}"><select data-rule-field aria-label="筛选字段">${choices.map(value=>`<option${value===rule.field?' selected':''}>${esc(value)}</option>`).join('')}</select><select class="metric-scope-operator" aria-label="筛选关系">${operators[kind(rule.field)].map(value=>`<option${value===rule.operator?' selected':''}>${value}</option>`).join('')}</select>${valueMarkup(rule)}<button type="button" class="metric-scope-remove" aria-label="移除条件">×</button></div>`).join('')}</div><button type="button" class="metric-scope-add">＋ 添加条件</button><div class="metric-scope-foot"><button type="button" data-scope-reset>重置</button><button type="button" data-scope-apply>确定</button></div>`;
    popup.querySelector('[data-scope-match]').onchange=event=>draft.match=event.target.value;
    popup.querySelector('.metric-scope-close').onclick=()=>popup.hidden=true;
    popup.querySelector('.metric-scope-add').onclick=()=>{draft.rules.push({field:choices[0],operator:'等于',value:''});render()};
    popup.querySelector('[data-scope-reset]').onclick=()=>{draft={match:'所有',rules:[]};render()};
    popup.querySelector('[data-scope-apply]').onclick=()=>{
      for(const rule of draft.rules)if(rule.value==='date'&&!rule.date){popup.querySelector('[data-rule-date]')?.focus();return}
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
      row.querySelector('.metric-scope-remove').onclick=()=>{draft.rules.splice(Number(row.dataset.scopeRule),1);render()};
    });
  }
  function ensure(){
    const root=drawer(),item=chart();if(!root||!item)return;
    const title=root.querySelector('[data-quality-title-field]');if(!title)return;
    let field=root.querySelector('[data-chart-scope-field]');
    if(!field){field=document.createElement('div');field.className='quality-config-field full metric-scope-field';field.dataset.chartScopeField='';field.innerHTML='<label>统计范围</label><button type="button" class="metric-scope-trigger" data-chart-scope>全部</button>';title.after(field)}
    const button=field.querySelector('button'),label=summary(read(item));if(button.textContent!==label)button.textContent=label;
    field.querySelector('button').onclick=()=>{active=item;draft=read(item);if(!draft.rules.length)draft.rules=[{field:fields()[0],operator:'等于',value:''}];if(!popup){popup=document.createElement('section');popup.className='metric-scope-dialog';popup.setAttribute('role','dialog');popup.setAttribute('aria-label','统计范围');document.body.append(popup)}render();popup.hidden=false;const rect=field.getBoundingClientRect();popup.style.top=Math.max(12,Math.min(rect.bottom+8,innerHeight-popup.offsetHeight-12))+'px'};
  }
  const dateFor=value=>{const day=new Date(),date=new Date(day.getFullYear(),day.getMonth(),day.getDate());if(value==='tomorrow')date.setDate(date.getDate()+1);if(value==='yesterday')date.setDate(date.getDate()-1);return date};
  function matches(row,rule,dimension,measure){
    const type=kind(rule.field),raw=rule.field===dimension?row.label:rule.field===measure?row.value:row[rule.field];
    if(raw===undefined)return false;
    if(rule.operator==='为空')return raw==null||raw==='';if(rule.operator==='不为空')return raw!=null&&raw!=='';
    const value=type==='time'?(rule.value==='date'?new Date(rule.date):dateFor(rule.value)):type==='number'?Number(rule.value):String(rule.value);
    const actual=type==='time'?new Date(raw):type==='number'?Number(raw):String(raw);
    if(type==='time'&&Number.isNaN(+actual))return true;
    if(type==='time'&&rule.operator==='等于'&&!['date','today','tomorrow','yesterday'].includes(rule.value)){
      const today=dateFor('today'),start=new Date(today),end=new Date(today);
      if(rule.value==='thisWeek'||rule.value==='lastWeek'){start.setDate(start.getDate()-(start.getDay()+6)%7-(rule.value==='lastWeek'?7:0));end.setTime(+start);end.setDate(end.getDate()+7)}
      else if(rule.value==='thisMonth'||rule.value==='lastMonth'){start.setDate(1);if(rule.value==='lastMonth')start.setMonth(start.getMonth()-1);end.setTime(+start);end.setMonth(end.getMonth()+1)}
      else if(rule.value==='past7'||rule.value==='past30'){start.setDate(start.getDate()-(rule.value==='past7'?6:29));end.setDate(end.getDate()+1)}
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
  let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;ensure()})}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',()=>queueMicrotask(ensure),true);ensure();
})();
