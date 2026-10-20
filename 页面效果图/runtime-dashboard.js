(() => {
  'use strict';
  const main = document.querySelector('body[data-page="device-runtime-monitor"] .main');
  const overview = main?.querySelector('.overview');
  if (!overview || !document.querySelector('[data-runtime-table]')) return;
  main.classList.add('runtime-dashboard');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const states = [
    {id:'normal',name:'连接及传输正常',color:'#20a464'},
    {id:'delayed',name:'已连接／传输异常',color:'#e6a23c'},
    {id:'disconnected',name:'未连接',color:'#df4a4a'},
    {id:'disabled',name:'停用',color:'#b7c0cb'}
  ];
  const devices = [...document.querySelectorAll('[data-runtime-device]')].map(row => ({
    id:row.dataset.runtimeDevice,name:row.dataset.deviceName,sn:row.querySelector('.device-sn').textContent,
    location:row.dataset.deviceLocation
  }));
  const stamp = value => new Date(value.replace(' ','T')).getTime();
  const end = stamp('2026-08-04 14:33:00'), start = end - 24*3600000;
  const format = value => {const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;};
  // Immutable prototype history. Live row operations never rewrite past snapshots.
  const history = devices.map(device => ({...device,events:[{at:start,state:'normal'}]}));
  function event(id,time,state){history.find(d=>d.id===id).events.push({at:stamp(time),state});}
  event('aoi-03','2026-08-03 22:16:08','disabled');
  event('aoi-01','2026-08-04 11:55:08','disconnected');
  event('aoi-01','2026-08-04 12:10:08','delayed');
  event('aoi-01','2026-08-04 14:32:56','normal');
  event('aoi-02','2026-08-04 14:14:08','delayed');
  event('aoi-02','2026-08-04 14:32:52','normal');
  event('aoi-04','2026-08-04 12:58:20','disconnected');
  event('aoi-05','2026-08-04 14:10:12','delayed');
  const metrics = {
    rates:{name:'连接率与传输正常率',title:'连接率与传输正常率趋势',type:'line',typeName:'折线图',template:'设备状态明细',available:false,fields:[]},
    status:{name:'设备状态数量',title:'设备状态数量趋势',type:'stack',typeName:'堆叠柱状图',template:'设备状态明细',available:true,fields:['location','since','duration']},
    duration:{name:'设备异常累计时长',title:'设备异常累计时长',type:'bar',typeName:'条形图',template:'异常事件记录',available:true,fields:['location','since','until']},
    distribution:{name:'设备状态分布',title:'设备状态分布',type:'donut',typeName:'环形图',template:'设备状态明细',available:true,fields:[]},
    upload:{name:'数据上传量',title:'数据上传量趋势',type:'column',typeName:'柱状图',template:'设备上传量明细',available:false,fields:['location']}
  };
  const fieldNames={location:'设备位置',since:'状态开始时间',until:'结束时间',duration:'截至所选时刻的持续时长'};
  const key='spc-runtime-dashboard-v1';
  const defaults=()=>({charts:[{id:'duration-main',metric:'rates',title:metrics.rates.title,scope:'all',hours:24,step:2,width:'half',drill:true},{id:'state-distribution',metric:'distribution',title:metrics.distribution.title,scope:'all',hours:24,step:2,width:'half',drill:false}],templates:{rates:[],status:['location','since','duration'],duration:['location','since','until'],upload:['location']}});
  let config=defaults(),editing=false,layer=null,returnFocus=null;
  try {const saved=JSON.parse(localStorage.getItem(key));if(saved && Array.isArray(saved.charts)&&saved.charts.length<=12 && saved.charts.every(c=>metrics[c.metric]&&typeof c.title==='string'&&c.title.length<=40&&['all',...devices.map(d=>d.id)].includes(c.scope)&&(!c.deviceIds||Array.isArray(c.deviceIds)&&c.deviceIds.every(id=>devices.some(d=>d.id===id)))&&[6,12,24].includes(c.hours)&&[1,2,4].includes(c.step)&&['full','half'].includes(c.width))){config={charts:saved.charts,templates:{...defaults().templates,...saved.templates}};for(const m of Object.keys(metrics))config.templates[m]=config.templates[m].filter(f=>metrics[m].fields.includes(f));}}catch{}
  config.charts.forEach((chart,index)=>{
    if(index===0&&(chart.id==='duration-main'||/设备异常累计时长/.test(chart.title))&&chart.metric!=='rates'){
      chart.metric='rates';chart.title=metrics.rates.title;chart.drill=false;
    }
    const migration='spc-runtime-rate-chart-v2:'+location.pathname+':'+chart.id;
    if(chart.metric==='rates'&&!localStorage.getItem(migration)){
      localStorage.removeItem('spc-page-chart:'+location.pathname+':'+index);
      const visualKey='spc-page-visual:'+location.pathname;
      try{const visuals=JSON.parse(localStorage.getItem(visualKey)||'[]');if(visuals[index]?.dataset){for(const field of ['runtimeMetric','runtimeChart','chartType','dimension','measureSettings','copyConfig'])delete visuals[index].dataset[field];localStorage.setItem(visualKey,JSON.stringify(visuals))}}catch{}
      localStorage.setItem(migration,'1');
    }
  });
  if(!config.charts.some(c=>c.metric==='distribution'))config.charts.push({...defaults().charts.find(c=>c.metric==='distribution')});
  config.charts.forEach(c=>{c.title=c.title.replace(/最近\s*24\s*小时/g,'').trim()});
  overview.querySelector('.exception-panel')?.remove();
  const grid=document.createElement('div');grid.className='runtime-chart-grid';overview.querySelector('.trend-panel').replaceWith(grid);
  const editButton=document.createElement('button');editButton.className='quality-page-edit-button';editButton.type='button';editButton.textContent='编辑页面';document.querySelector('.top-actions').prepend(editButton);
  const toolbar=document.createElement('section');toolbar.className='quality-editor-bar';toolbar.hidden=true;toolbar.innerHTML='<b>编辑设备运行监控页面</b><div class="quality-editor-bar-actions"><button type="button" data-add>添加组件</button><button type="button" data-reset>恢复默认</button><button type="button" data-preview>页面预览</button><button type="button" class="primary" data-finish>完成编辑</button></div>';main.prepend(toolbar);
  // Native hidden must override the shared editor toolbar display rule.
  toolbar.style.display='none';
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify(config));return true;}catch{window.SPCPrototype.toast('浏览器无法保存配置，请检查存储权限','warning');return false;}};
  function scopeDevices(chart){const panel=[...main.querySelectorAll('[data-runtime-chart]')].find(p=>p.dataset.runtimeChart===chart.id),scope=window.spcReadChartScope?.(panel),hasRules=!!scope?.rules.length;let rows=history.filter(d=>hasRules?true:chart.metric==='duration'&&Array.isArray(chart.deviceIds)?chart.deviceIds.includes(d.id):chart.scope==='all'||d.id===chart.scope);if(!hasRules||!window.spcFilterChartScopeRows)return rows;const proxy=document.createElement('div');proxy.dataset.chartScope=JSON.stringify({...scope,rules:scope.rules.filter(r=>!/时间|日期/.test(r.field))});return window.spcFilterChartScopeRows(proxy,rows.map(d=>({...d,'设备名称':d.name,'设备SN':d.sn,'设备位置（一级）':d.location.split(/[\/／]/)[0].trim(),'设备位置（二级）':d.location.split(/[\/／]/).at(-1).trim()})),'','')}
  function scopeName(chart){return devices.find(d=>d.id===chart.scope)?.name||'全部设备';}
  function snapshot(chart,time){return scopeDevices(chart).map(d=>{const e=d.events.filter(e=>e.at<=time).at(-1);return e?{...d,state:e.state,since:e.at}:null;}).filter(Boolean);}
  function intervals(chart){const from=end-chart.hours*3600000;return scopeDevices(chart).flatMap(d=>d.events.flatMap((e,i)=>{const a=Math.max(from,e.at),b=Math.min(end,d.events[i+1]?.at??end);return ['disconnected','delayed'].includes(e.state)&&b>a?[{...d,state:e.state,since:e.at,until:d.events[i+1]?.at??null,minutes:(b-a)/60000}]:[];}));}
  function samples(chart){const from=end-chart.hours*3600000;const times=[];for(let t=from;t<=end;t+=chart.step*3600000)times.push(t);if(times.at(-1)!==end)times.push(end);return times;}
  function closeLayer(){if(!layer)return;layer.remove();layer=null;document.removeEventListener('keydown',modalKeys);returnFocus?.focus();}
  function modalKeys(e){if(!layer)return;if(e.key==='Escape'){e.preventDefault();closeLayer();}if(e.key==='Tab'){const focusable=[...layer.querySelectorAll('button,input,select,a[href]')].filter(el=>!el.disabled&&!el.closest('[hidden]'));if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
  function openLayer(title,body,foot='',details=false){closeLayer();returnFocus=document.activeElement;layer=document.createElement('div');layer.className='runtime-layer'+(details?' details':'');layer.innerHTML=`<section class="quality-config-drawer" role="dialog" aria-modal="true" aria-labelledby="runtime-layer-title"><div class="quality-config-drawer-head"><h3 id="runtime-layer-title">${escape(title)}</h3><button class="quality-config-drawer-close" type="button" aria-label="关闭">×</button></div><div class="quality-config-drawer-body">${body}</div>${foot?`<div class="quality-config-drawer-foot">${foot}</div>`:''}</section>`;document.body.appendChild(layer);layer.querySelector('.quality-config-drawer-close').onclick=closeLayer;layer.addEventListener('click',e=>{e.stopPropagation();if(e.target===layer)closeLayer();});document.addEventListener('keydown',modalKeys);layer.querySelector('button').focus();return layer;}
  function field(label,control,full=false){return `<div class="quality-config-field${full?' full':''}"><label>${label}${control}</label></div>`;}
  function configure(chart,isNew=false){
    const draft={...chart};
    const modal=openLayer('图表配置',`<div class="quality-config-section"><h4>数据与展示</h4><div class="quality-config-grid">${field('图表名称','<input name="title" maxlength="40" required>',true)}${field('统计指标',`<select name="metric">${Object.entries(metrics).map(([id,m])=>`<option value="${id}">${m.name}</option>`).join('')}</select>`)}${field('图表类型','<select name="type" disabled></select>')}${field('设备范围',`<select name="scope"><option value="all">全部设备</option>${devices.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select>`)}${field('时间范围','<select name="hours"><option value="6">最近 6 小时</option><option value="12">最近 12 小时</option><option value="24">最近 24 小时</option></select>')}${field('采样间隔','<select name="step"><option value="1">1 小时</option><option value="2">2 小时</option><option value="4">4 小时</option></select>')}${field('组件宽度','<select name="width"><option value="full">整行</option><option value="half">半行</option></select>')}</div></div><div class="quality-config-section"><h4>下钻配置</h4><label class="quality-config-check"><input name="drill" type="checkbox">开启下钻</label><div class="runtime-config-note" data-unavailable hidden>暂无上传历史明细，暂不开放下钻。</div><div data-drill-fields><div class="quality-config-grid">${field('下钻模板','<select name="template" disabled></select>',true)}${field('展示方式','<select disabled><option>侧边抽屉</option></select>',true)}</div><p class="runtime-config-note" data-rule></p><h4>明细展示字段（同模板共用）</h4><label class="quality-config-check"><input type="checkbox" checked disabled>设备名称 / SN（必选）</label><label class="quality-config-check"><input type="checkbox" checked disabled><span data-required>所选时刻的状态（必选）</span></label><div data-fields></div></div></div>`, '<button type="button" data-cancel>取消</button><button type="button" class="primary" data-save>保存</button>');
    for(const name of ['title','metric','scope','hours','step','width'])modal.querySelector(`[name="${name}"]`).value=draft[name];
    const drill=modal.querySelector('[name="drill"]');drill.checked=draft.drill;
    const templateDraft=JSON.parse(JSON.stringify(config.templates));let currentMetric=draft.metric;
    function collectFields(){templateDraft[currentMetric]=[...modal.querySelectorAll('[data-field]:checked')].map(i=>i.dataset.field);}
    function sync(){const metric=modal.querySelector('[name="metric"]').value,m=metrics[metric];currentMetric=metric;modal.querySelector('[name="type"]').innerHTML=`<option>${m.typeName}</option>`;modal.querySelector('[name="template"]').innerHTML=`<option>${m.template}</option>`;drill.disabled=!m.available;if(!m.available)drill.checked=false;modal.querySelector('[data-unavailable]').hidden=m.available;modal.querySelector('[data-drill-fields]').hidden=!drill.checked;modal.querySelector('[data-required]').textContent=metric==='duration'?'异常状态 / 区间内时长（必选）':'所选时刻的状态（必选）';modal.querySelector('[data-rule]').textContent=metric==='status'?'自动传入：设备范围、点击时刻、点击状态。':'自动传入：设备范围、统计时间段、点击设备。';modal.querySelector('[name="step"]').disabled=metric==='duration';modal.querySelector('[data-fields]').innerHTML=m.fields.map(f=>`<label class="quality-config-check"><input type="checkbox" data-field="${f}" ${templateDraft[metric].includes(f)?'checked':''}>${fieldNames[f]}</label>`).join('');}
    modal.querySelector('[name="metric"]').onchange=()=>{collectFields();const metric=modal.querySelector('[name="metric"]').value;modal.querySelector('[name="title"]').value=metrics[metric].title;drill.checked=metrics[metric].available;sync();};
    drill.onchange=()=>{modal.querySelector('[data-drill-fields]').hidden=!drill.checked;};sync();
    modal.querySelector('[data-cancel]').onclick=closeLayer;
    modal.querySelector('[data-save]').onclick=()=>{const title=modal.querySelector('[name="title"]');if(!title.value.trim()){title.setCustomValidity('请输入图表名称');title.reportValidity();title.oninput=()=>title.setCustomValidity('');return;}collectFields();for(const name of ['title','metric','scope','width'])draft[name]=modal.querySelector(`[name="${name}"]`).value.trim();for(const name of ['hours','step'])draft[name]=Number(modal.querySelector(`[name="${name}"]`).value);draft.drill=drill.checked&&metrics[draft.metric].available;const previous=JSON.parse(JSON.stringify(config));if(isNew)config.charts.push(draft);else config.charts=config.charts.map(c=>c.id===chart.id?draft:c);config.templates=templateDraft;if(!persist()){config=previous;return;}closeLayer();render();window.SPCPrototype.toast('图表配置已保存');};
  }
  function configureDurationDevices(chart){
    const selected=new Set(chart.deviceIds||devices.filter(d=>chart.scope==='all'||d.id===chart.scope).map(d=>d.id));
    const rows=devices.map(d=>`<label class="proto-chart-device-row" data-chart-device-row><input type="checkbox" value="${d.id}" ${selected.has(d.id)?'checked':''}><b>${escape(d.name)}</b><span>${escape(d.sn)}</span><span class="proto-chart-device-area">${escape(d.location)}</span></label>`).join('');
    const body=`<div class="proto-chart-device-tools"><input class="proto-chart-device-search" data-chart-device-search aria-label="搜索设备名称或SN" placeholder="搜索设备名称或SN"><span class="proto-chart-device-note" data-chart-device-note>已选 ${selected.size}/${devices.length} 台</span></div><div class="proto-chart-device-list"><div class="proto-chart-device-header"><span aria-hidden="true"></span><span>设备名称</span><span>设备SN</span><span class="proto-chart-device-area">设备位置</span></div>${rows}<div class="proto-chart-device-empty" role="status" hidden>未找到匹配设备</div></div>`;
    const modal=window.SPCPrototype.openModal('配置图表展示设备',body,'保存配置',dialog=>{const ids=[...dialog.querySelectorAll('[data-chart-device-row] input:checked')].map(input=>input.value);if(!ids.length){window.SPCPrototype.toast('请至少选择 1 台设备','error');return false}chart.deviceIds=ids;chart.scope='all';if(!persist())return false;render()});
    modal.querySelector('.proto-modal').classList.add('proto-chart-device-modal');
    modal.querySelector('.proto-modal').classList.add('runtime-device-config-modal');
    const checks=[...modal.querySelectorAll('[data-chart-device-row] input')],note=modal.querySelector('[data-chart-device-note]');
    checks.forEach(input=>input.onchange=()=>{note.textContent=`已选 ${checks.filter(item=>item.checked).length}/${devices.length} 台`});
    modal.querySelector('[data-chart-device-search]').oninput=event=>{const term=event.target.value.trim().toLowerCase();let visible=0;modal.querySelectorAll('[data-chart-device-row]').forEach(row=>{const show=row.textContent.toLowerCase().includes(term);row.hidden=!show;if(show)visible++});modal.querySelector('.proto-chart-device-empty').hidden=visible>0};
  }
  function detail(chart,selection){
    const m=metrics[chart.metric];if(!chart.drill||!m.available)return;
    let rows,context,columns;
    if(chart.metric==='status'){
      rows=snapshot(chart,selection.time).filter(d=>d.state===selection.state);context=`${format(selection.time)} · 历史快照 · ${scopeName(chart)} · ${states.find(s=>s.id===selection.state).name}`;
      columns=[['name','设备名称 / SN',r=>`${escape(r.name)}<br>${escape(r.sn)}`],['state','所选时刻状态',r=>states.find(s=>s.id===r.state).name]];
    }else{rows=intervals(chart).filter(r=>r.id===selection.device);context=`${format(end-chart.hours*3600000)} 至 ${format(end)} · ${scopeName(chart)} · ${devices.find(d=>d.id===selection.device).name}`;columns=[['name','设备名称 / SN',r=>`${r.name}<br>${r.sn}`],['state','异常状态',r=>states.find(s=>s.id===r.state).name],['minutes','区间内时长',r=>`${r.minutes.toFixed(1)} 分钟`]];}
    const getters={location:r=>escape(r.location),since:r=>(r.since===start?'≤ ':'')+format(r.since),until:r=>r.until?format(r.until):'持续中',duration:r=>(r.since===start?'≥ ':'')+((selection.time-r.since)/60000).toFixed(1)+' 分钟'};
    for(const f of config.templates[chart.metric])columns.push([f,fieldNames[f],getters[f]]);
    columns.push(['action','操作',r=>`<a href="07A-设备运行记录.html?device=${encodeURIComponent(r.name)}">查看记录</a>`]);
    const modal=openLayer(m.template,`<div class="runtime-detail-context">${escape(context)}<br>示例数据</div><table class="runtime-detail-table"><thead><tr>${columns.map(c=>`<th>${c[1]}</th>`).join('')}</tr></thead><tbody></tbody></table>`, '',true);
    const pager=document.querySelector('.records .pager').cloneNode(true);modal.querySelector('.quality-config-drawer').appendChild(pager);let page=1,size=10;
    function update(){const count=Math.max(1,Math.ceil(rows.length/size));page=Math.max(1,Math.min(count,page));modal.querySelector('tbody').innerHTML=rows.length?rows.slice((page-1)*size,page*size).map(r=>`<tr>${columns.map(c=>`<td>${c[2](r)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}">暂无数据</td></tr>`;pager.querySelector(':scope>span').textContent=`共${rows.length}条`;const nav=pager.querySelectorAll('.proto-page-nav');nav[0].disabled=page<=1;nav[1].disabled=page>=count;pager.querySelectorAll('.proto-page-number,.proto-page-ellipsis').forEach(n=>n.remove());nav[1].insertAdjacentHTML('beforebegin',Array.from({length:count},(_,i)=>`<button type="button" class="proto-page-number ${page===i+1?'on':''}" data-page-number="${i+1}">${i+1}</button>`).join(''));}
    pager.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.pageNumber)page=Number(b.dataset.pageNumber);else if(b.getAttribute('aria-label')==='上一页')page--;else if(b.getAttribute('aria-label')==='下一页')page++;update();});
    pager.querySelector('select').onchange=e=>{size=parseInt(e.target.value,10);page=1;update();};pager.querySelector('input').onkeydown=e=>{if(e.key==='Enter'){page=Number(e.target.value)||1;update();e.target.value='';}};update();
  }
  const observers=[];
  window.spcRenderRuntimeScope=panel=>{const chart=config.charts.find(c=>c.id===panel?.dataset.runtimeChart);if(!chart)return false;panel.querySelector('.shared-preview')?.remove();draw(panel,chart);return true};
  function draw(panel,chart){
    const host=panel.querySelector('.runtime-chart-plot');const w=host.clientWidth-24,h=198,left=40,right=w-10,top=22,bottom=164;
    if(w<120)return;
    if(chart.metric==='rates'){
      const range=window.spcPageTimeRange;
      const requestedFrom=range?new Date(range.start).getTime():end-chart.hours*3600000;
      const from=Math.max(start,requestedFrom);
      const until=range?Math.min(end,new Date(range.end).getTime()+59999):end;
      if(until<from||!scopeDevices(chart).length){host.innerHTML='<div class="runtime-chart-empty">所选时间范围暂无历史数据</div>';return;}
      const step=Math.max(1,Math.ceil((until-from)/(12*3600000))) * 3600000;
      const times=[];for(let t=from;t<=until;t+=step)times.push(t);
      if(until>=from&&times.at(-1)!==until)times.push(until);
      const series=[{name:'连接率',color:'#3478f6',test:d=>['normal','delayed'].includes(d.state)},{name:'传输正常率',color:'#20a464',test:d=>d.state==='normal',dash:'6 4'}];
      const chartBottom=140;
      const x=t=>left+(t-from)/Math.max(1,until-from)*(right-left),y=v=>chartBottom-v/100*(chartBottom-top);
      let markup='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="连接率与传输正常率趋势">';
      [0,20,40,60,80,100].forEach(value=>markup+='<line x1="'+left+'" x2="'+right+'" y1="'+y(value)+'" y2="'+y(value)+'" stroke="#e8edf2"/><text x="'+(left-6)+'" y="'+(y(value)+4)+'" text-anchor="end">'+value+'%</text>');
      series.forEach(line=>{
        const points=times.map(time=>{const data=snapshot(chart,time).filter(d=>d.state!=='disabled');return {time,value:data.length?data.filter(line.test).length/data.length*100:null}});
        let path='',connected=false;
        points.forEach(point=>{if(point.value===null){connected=false;return}path+=(connected?' L ':' M ')+x(point.time)+' '+y(point.value);connected=true});
        markup+='<path d="'+path+'" fill="none" stroke="'+line.color+'" stroke-width="2.5"'+(line.dash?' stroke-dasharray="'+line.dash+'"':'')+'/>';
        points.filter(point=>point.value!==null).forEach(point=>markup+='<circle cx="'+x(point.time)+'" cy="'+y(point.value)+'" r="3" fill="#fff" stroke="'+line.color+'" stroke-width="2"><title>'+format(point.time)+'，'+line.name+'：'+point.value.toFixed(2)+'%</title></circle>');
      });
      markup+='<line x1="'+left+'" x2="'+right+'" y1="'+chartBottom+'" y2="'+chartBottom+'" stroke="#cfd8e4"/>';
      const ticks=Math.max(1,Math.min(5,Math.floor((right-left)/110)));
      for(let i=0;i<=ticks;i++){
        const time=from+(until-from)*i/ticks,pos=x(time),anchor=i===0?'start':i===ticks?'end':'middle',label=format(time);
        markup+='<line x1="'+pos+'" x2="'+pos+'" y1="'+chartBottom+'" y2="'+(chartBottom+4)+'" stroke="#a9b6c6"/><text x="'+pos+'" y="158" text-anchor="'+anchor+'"><tspan x="'+pos+'">'+label.slice(5,10)+'</tspan><tspan x="'+pos+'" dy="14">'+label.slice(11,16)+'</tspan></text>';
      }
      markup+='<text x="'+right+'" y="193" text-anchor="end">时间</text>';
      host.innerHTML=markup+'</svg>';return;
    }
    if(chart.metric==='distribution'){
      const range=window.spcPageTimeRange,at=range?Math.min(end,new Date(range.end).getTime()):end,items=snapshot(chart,at),total=items.length,cx=Math.min(w*.28,115),cy=95,r=62,rows=states.map(state=>({...state,count:items.filter(d=>d.state===state.id).length}));let offset=0;
      let markup='<svg viewBox="0 0 '+w+' 198" role="img" aria-label="设备状态分布"><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#edf1f5" stroke-width="22"/>';
      rows.forEach((state,i)=>{const percent=total?state.count/total*100:0;markup+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" pathLength="100" fill="none" stroke="'+state.color+'" stroke-width="22" stroke-dasharray="'+percent+' '+(100-percent)+'" stroke-dashoffset="'+(-offset)+'" transform="rotate(-90 '+cx+' '+cy+')"><title>'+escape(state.name)+'：'+state.count+' 台（'+percent.toFixed(1)+'%）</title></circle>';offset+=percent;const x=Math.max(cx+r+28,w*.52),y=44+i*34;markup+='<g><title>'+escape(state.name)+'：'+state.count+' 台</title><rect x="'+x+'" y="'+(y-9)+'" width="9" height="9" rx="2" fill="'+state.color+'"/><text x="'+(x+16)+'" y="'+y+'">'+escape(state.name)+'</text><text x="'+(w-8)+'" y="'+y+'" text-anchor="end">'+state.count+' 台</text></g>'});
      markup+='<text x="'+cx+'" y="'+cy+'" text-anchor="middle" style="font-size:24px;font-weight:650">'+total+'</text><text x="'+cx+'" y="'+(cy+20)+'" text-anchor="middle">设备总数（台）</text></svg>';host.innerHTML=markup;return;
    }
    if(chart.metric==='upload'){
host.innerHTML='<div class="runtime-chart-empty">暂无上传历史数据</div>';return;}
    let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(chart.title)}，示例数据"><text x="0" y="13">${chart.metric==='status'?'设备数（台）':'设备'}</text>`;
    const targets=[];
    const mark=(x,y,width,height,color,label,selection)=>{const index=targets.push(selection)-1;return `<g ${chart.drill?`role="button" tabindex="0" data-hit="${index}" aria-label="${escape(label)}，查看明细"`:''}><title>${escape(label)}</title><rect x="${x}" y="${y}" width="${Math.max(0,width)}" height="${Math.max(0,height)}" fill="${color}"/></g>`;};
    if(chart.metric==='status'){
      const times=samples(chart),total=scopeDevices(chart).length,max=Math.max(1,total),step=(right-left)/times.length,bw=Math.min(30,step*.65),y=v=>bottom-v/max*(bottom-top);
      for(let i=0;i<=max;i++){svg+=`<line x1="${left}" x2="${right}" y1="${y(i)}" y2="${y(i)}" stroke="#e8edf2"/><text x="${left-8}" y="${y(i)+4}" text-anchor="end">${i}</text>`;}
      times.forEach((time,i)=>{const data=snapshot(chart,time);let sum=0;const x=left+bw/2+(time-times[0])/(end-times[0])*(right-left-bw);states.forEach(state=>{const n=data.filter(d=>d.state===state.id).length;if(n)svg+=mark(x-bw/2,y(sum+n),bw,y(sum)-y(sum+n),state.color,`${format(time)}，${state.name} ${n} 台`,{time,state:state.id});sum+=n;});const stride=Math.max(1,Math.ceil(times.length/Math.max(2,Math.floor((right-left)/92))));if(i===0||i===times.length-1||(i%stride===0&&times.length-1-i>=stride))svg+=`<text x="${i===0?left:i===times.length-1?right:x}" y="180" text-anchor="${i===0?'start':i===times.length-1?'end':'middle'}">${format(time).slice(i===0||i===times.length-1?5:11,16)}</text>`;});
      svg+=`<text x="${right}" y="196" text-anchor="end">时间（快照）</text>`;
    }else{
      const rows=scopeDevices(chart).map(d=>({...d,minutes:intervals(chart).filter(r=>r.id===d.id).reduce((a,r)=>a+r.minutes,0)})).sort((a,b)=>b.minutes-a.minutes);const max=Math.max(1,...rows.map(r=>r.minutes)),x0=66,span=Math.max(1,right-x0-50),step=(bottom-top)/rows.length;
      rows.forEach((r,i)=>{const y=top+i*step;svg+=`<text x="0" y="${y+15}">${r.name}</text>`;svg+=mark(x0,y,span*r.minutes/max,18,'#e6a23c',`${r.name}，异常累计 ${r.minutes.toFixed(1)} 分钟`,{device:r.id});svg+=`<text x="${x0+span*r.minutes/max+5}" y="${y+14}">${r.minutes.toFixed(1)}</text>`;});
      svg+=`<line x1="${x0}" y1="${bottom+2}" x2="${x0+span}" y2="${bottom+2}" stroke="#cfd8e4"/>`;
      for(let i=0;i<=4;i++){const x=x0+span*i/4;svg+=`<line x1="${x}" y1="${bottom+2}" x2="${x}" y2="${bottom+6}" stroke="#a9b6c6"/><text x="${x}" y="${bottom+19}" text-anchor="middle">${(max*i/4).toFixed(0)}</text>`;}
      svg+=`<text x="${right}" y="196" text-anchor="end">累计异常时长（分钟）</text>`;
    }
    host.innerHTML=svg+'</svg>';
    host.querySelectorAll('[data-hit]').forEach(el=>{const run=()=>detail(chart,targets[Number(el.dataset.hit)]);el.addEventListener('click',run);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run();}});});
  }
  function render(){observers.splice(0).forEach(o=>o.disconnect());grid.innerHTML='';
    config.charts.forEach((chart,index)=>{const panel=document.createElement('section');panel.className='panel runtime-chart'+(chart.width==='half'||config.charts.length===2?' half':'');panel.dataset.runtimeChart=chart.id;panel.dataset.runtimeMetric=chart.metric;panel.dataset.chartType=chart.metric==='rates'?'line':chart.metric==='distribution'?'donut':chart.metric==='duration'?'horizontalBar':'barStacked';panel.innerHTML=`<div class="phead"><div class="phead-title"><b>${escape(chart.title)}</b>${['rates','duration','distribution'].includes(chart.metric)?'':`<span>最近 ${chart.hours} 小时 · ${escape(scopeName(chart))} · 示例数据</span>`}</div><div class="runtime-chart-tools">${editing?'<button type="button" class="btn" data-config>配置</button><button type="button" class="btn" data-up aria-label="上移组件">↑</button><button type="button" class="btn" data-down aria-label="下移组件">↓</button><button type="button" class="btn" data-remove>删除</button>':''}</div></div>${chart.metric==='rates'?'<div class="runtime-chart-legend"><span><i style="background:#3478f6"></i>连接率</span><span><i style="background:#20a464"></i>传输正常率</span></div>':''}${chart.metric==='status'?`<div class="runtime-chart-legend">${states.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>`:''}<div class="runtime-chart-plot"></div>`;grid.appendChild(panel);if(editing){panel.querySelector('[data-config]').onclick=()=>configure(chart);panel.querySelector('[data-up]').disabled=index===0;panel.querySelector('[data-down]').disabled=index===config.charts.length-1;const move=delta=>{[config.charts[index],config.charts[index+delta]]=[config.charts[index+delta],config.charts[index]];render();};panel.querySelector('[data-up]').onclick=()=>move(-1);panel.querySelector('[data-down]').onclick=()=>move(1);panel.querySelector('[data-remove]').onclick=()=>{config.charts=config.charts.filter(c=>c.id!==chart.id);render();};}const observer=new ResizeObserver(()=>draw(panel,chart));observer.observe(panel);observers.push(observer);draw(panel,chart);});
    if(!config.charts.length){const empty=document.createElement('section');empty.className='panel runtime-chart runtime-chart-empty';empty.textContent='暂无图表';grid.appendChild(empty);}
  }
  editButton.onclick=()=>{editing=true;toolbar.hidden=false;toolbar.style.display='flex';editButton.hidden=true;render();};
  toolbar.querySelector('[data-add]').onclick=()=>{if(config.charts.length>=12){window.SPCPrototype.toast('最多配置 12 个图表','warning');return;}configure({...defaults().charts[0],id:'chart-'+Date.now()},true);};
  toolbar.querySelector('[data-reset]').onclick=()=>{window.SPCPrototype.confirmAction('恢复默认','恢复设备运行监控图表的默认配置？',()=>{config=defaults();render();});};
  toolbar.querySelector('[data-preview]').onclick=e=>{editing=!editing;e.currentTarget.textContent=editing?'页面预览':'返回编辑';render();};
  toolbar.querySelector('[data-finish]').onclick=()=>{if(!persist())return;editing=false;toolbar.hidden=true;toolbar.style.display='none';toolbar.querySelector('[data-preview]').textContent='页面预览';editButton.hidden=false;render();window.SPCPrototype.toast('页面配置已保存');};
  const statusFilters=[
    {field:main.querySelector('.runtime-filters .connection'),values:[['connected','已连接'],['disconnected','未连接'],['unmonitored','未监控']],hint:'请选择连接状态',key:'connection'},
    {field:main.querySelector('.runtime-filters .transmission'),values:[['normal','正常'],['delayed','延迟'],['interrupted','中断'],['unmonitored','未监控']],hint:'请选择传输状态',key:'transmission'}
  ];
  let statusMenu=null;
  const closeStatusMenu=()=>{statusMenu?.remove();statusMenu=null;};
  statusFilters.forEach(filter=>{
    filter.selected=new Set(filter.values.map(([id])=>id));
    const control=filter.field.querySelector('.control'),text=control.querySelector('[data-filter-value]');
    const updateText=()=>{text.textContent=filter.selected.size===filter.values.length||!filter.selected.size?filter.hint:filter.selected.size===1?filter.values.find(([id])=>filter.selected.has(id))[1]:`已选 ${filter.selected.size} 项`;};
    control.addEventListener('click',event=>{
      event.stopPropagation();closeStatusMenu();const rect=control.getBoundingClientRect();
      statusMenu=document.createElement('div');statusMenu.className='runtime-status-menu';statusMenu.style.left=Math.min(rect.left,innerWidth-200)+'px';statusMenu.style.top=Math.min(rect.bottom+5,innerHeight-160)+'px';statusMenu.style.width=Math.max(180,rect.width)+'px';
      filter.values.forEach(([id,label])=>{const option=document.createElement('button');option.type='button';option.className='runtime-status-option';option.textContent=label;option.setAttribute('aria-selected',String(filter.selected.has(id)));option.onclick=click=>{click.stopPropagation();filter.selected.has(id)?filter.selected.delete(id):filter.selected.add(id);option.setAttribute('aria-selected',String(filter.selected.has(id)));updateText();};statusMenu.appendChild(option);});
      document.body.appendChild(statusMenu);
    });
    control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();control.click();}});
    filter.reset=()=>{filter.selected=new Set(filter.values.map(([id])=>id));updateText();};
  });
  document.addEventListener('click',event=>{if(!event.target.closest('.runtime-status-menu'))closeStatusMenu();});
  const runtimeRows=[...main.querySelectorAll('[data-runtime-table] tbody tr[data-runtime-device]')];
  main.querySelector('.runtime-filters .btn.primary').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();closeStatusMenu();const keyword=main.querySelector('#runtime-device-keyword').value.trim().toLowerCase();let count=0;runtimeRows.forEach(row=>{const match=(!keyword||(row.dataset.deviceName+' '+row.querySelector('.device-sn').textContent).toLowerCase().includes(keyword))&&statusFilters.every(filter=>filter.selected.has(row.dataset[filter.key]));row.hidden=!match;if(match)count++;});main.querySelector('.records .pager > span').textContent=`共 ${count} 条`;});
  main.querySelector('.runtime-filters .btn:not(.primary)').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();closeStatusMenu();main.querySelector('#runtime-device-keyword').value='';statusFilters.forEach(filter=>filter.reset());runtimeRows.forEach(row=>row.hidden=false);main.querySelector('.records .pager > span').textContent=`共 ${runtimeRows.length} 条`;});
  render();
})();
