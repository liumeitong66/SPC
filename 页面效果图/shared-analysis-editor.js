(() => {
  const page=document.body.dataset.page||(document.title.includes('项目统计')?'project-stats':'');
  const selectors={
    'project-stats':'[data-project-trend],[data-comparison-panel]',
    'project-detail':'.device-analysis-card',
    'defect-analysis':'.charts .panel.chart',
    'false-analysis':'.export-chart',
    'defect-analysis-machine':'.export-chart',
    'device-runtime-monitor':'[data-runtime-chart]',
    'alert-analysis':'.charts .panel.chart'
  };
  if(!selectors[page]||!window.spcQualityConfigTemplate)return;
  const q=(root,selector)=>root?.querySelector(selector);
  const copyKey=`spc-chart-copies:${decodeURIComponent(location.pathname.split('/').pop())}`;
  let copied=[];try{copied=JSON.parse(localStorage.getItem(copyKey)||'[]')}catch{}
  const initialCharts=[...document.querySelectorAll(selectors[page])];
  if(!initialCharts.length)return;
  const copyHost=initialCharts.at(-1).parentElement;
  copied.forEach((item,index)=>{
    if(!item||typeof item!=='object'||typeof item.body!=='string')return;
    const chart=document.createElement('section');
    chart.className=`${initialCharts[0].className} shared-copied-chart`;
    chart.dataset.customChart='';chart.dataset.chartType=item.type||'bar';
    chart.dataset.copyIndex=String(index);
    chart.dataset.copyConfig=JSON.stringify(item);
    chart.innerHTML=`<div class="phead"><div class="phead-title"><b></b></div></div><div class="quality-chart-body shared-copy-body"></div>`;
    q(chart,'.phead-title b').textContent=item.title||'图表';
    q(chart,'.shared-copy-body').innerHTML=item.body;
    copyHost.append(chart);
  });
  const charts=[...initialCharts,...copyHost.querySelectorAll('.shared-copied-chart')];
  const metrics=[...document.querySelectorAll('.metrics .metric')];
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const palettes=[['默认',['#3478f6','#6c9cf8','#74c6b5','#efbb78','#9586df','#43b8ed']],['清新',['#4d8bff','#00c7bd','#58ce67','#b9db30','#ffd456','#ff995a']],['明快',['#2f70f5','#ff8c35','#1cbbec','#ffc000','#3fcc55','#818c9b']],['对比',['#477fff','#f36a64','#a9b0bc','#6266dd','#ec4dbb','#863af5']],['柔和',['#b7ccff','#acdfff','#9ee6df','#b9eabe','#e8ee9a','#ffebba']],['玫瑰',['#16a7d6','#4e70d4','#304fae','#f48ccb','#e968aa','#bf4e98']]];
  const typeNames={bar:'柱状图',horizontalBar:'条形图',line:'折线图',area:'面积图',pie:'饼图',donut:'环形图',scatter:'散点图',radar:'雷达图'};
  const pageTypes={
    'project-stats':['line','horizontalBar'],
    'project-detail':['donut','horizontalBar'],
    'defect-analysis':['donut','bar'],
    'false-analysis':['pie'],
    'defect-analysis-machine':['pie'],
    'device-runtime-monitor':['barStacked'],
    'alert-analysis':['barStacked','barStacked','donut']
  };
  const titleOf=el=>q(el,'.phead-title b,.phead b,.panel-title,.phead-title,.phead .title');
  function rowsOf(el,index){
    const text=el.innerText,lines=text.split(/\n/).map(x=>x.trim()).filter(Boolean),result=[];
    if(el.dataset.copyConfig){const item=JSON.parse(el.dataset.copyConfig);return Array.isArray(item.rows)?item.rows:[]}
    const add=(label,value)=>{const number=Number(String(value).replace(/,/g,''));if(label&&Number.isFinite(number)&&number>0)result.push({label,value:number})};
    const titles=[...el.querySelectorAll('svg title')].map(node=>node.textContent.trim());
    if(titles.length){
      const grouped=new Map();
      for(const title of titles){
        let match=title.match(/^(.+?)：([\d,.]+)(?:%|次)?(?:，|$)/);
        if(page==='device-runtime-monitor')match=title.match(/^(.+?)，连接及传输正常\s+(\d+)\s*台$/);
        if(!match)continue;
        let label=match[1].replace(/^模板\s*/,'').replace(/\s+(?:一般|紧急|机器判定|一次复判|最终复判)$/,'');
        if(page==='project-stats'&&index===0&&!title.includes('机器判定'))continue;
        if((page==='alert-analysis'&&index<2)){grouped.set(label,(grouped.get(label)||0)+Number(match[2].replace(/,/g,'')));continue}
        if(!grouped.has(label))grouped.set(label,Number(match[2].replace(/,/g,'')));
      }
      if(grouped.size)return [...grouped].map(([label,value])=>({label,value})).slice(0,10);
    }
    if(page==='project-stats'&&index===1){for(let i=0;i<lines.length-1;i++)if(/^\d+(?:\.\d+)?%$/.test(lines[i+1])&&!/^\d/.test(lines[i]))add(lines[i],lines[i+1].slice(0,-1))}
    if(page==='project-detail'&&index===0){for(let i=0;i<lines.length-1;i++){const match=lines[i+1].match(/^([\d,]+)\s*块/);if(/^AOI-/.test(lines[i])&&match)add(lines[i],match[1])}}
    if(page==='project-detail'&&index===1){for(let i=0;i<lines.length-1;i++)if(/^AOI-/.test(lines[i])&&/^\d+(?:\.\d+)?%$/.test(lines[i+1]))add(lines[i],lines[i+1].slice(0,-1))}
    if(page==='defect-analysis'&&index===0)for(const line of lines){const match=line.match(/^(器件 NG|误报|直通)\s*·\s*([\d,]+)/);if(match)add(match[1],match[2])}
    if(page==='false-analysis'||page==='defect-analysis-machine')for(let i=0;i<lines.length;i++){const match=lines[i].match(/^(.+?)\s+(\d+(?:\.\d+)?)%$/);if(match)add(match[1],match[2]);else if(i<lines.length-1&&/^\d+(?:\.\d+)?%$/.test(lines[i+1])&&!/^\d/.test(lines[i]))add(lines[i],lines[i+1].slice(0,-1))}
    if(page==='alert-analysis'&&index===2)for(const line of lines){const match=line.match(/^(.+?)\s+\d+%\s*·\s*(\d+)次$/);if(match)add(match[1],match[2])}
    return result.slice(0,10);
  }
  const states=charts.map((el,i)=>{const type=el.dataset.chartType||pageTypes[page]?.[i]||'bar';const base={title:titleOf(el)?.textContent.trim()||typeNames[type]||'图表',type,theme:0,dimension:'类别',measure:titleOf(el)?.textContent.trim()||'数值',legend:true,labels:true,axes:true,grid:true,total:true,gradient:false};let saved={};try{saved=JSON.parse(localStorage.getItem(`spc-page-chart:${location.pathname}:${i}`)||'{}')}catch{}let copiedConfig={};try{copiedConfig=JSON.parse(el.dataset.copyConfig||'{}');copiedConfig={title:copiedConfig.title,type:copiedConfig.type,dimension:copiedConfig.dataset?.dimension,measure:copiedConfig.dataset?.measure}}catch{}return {...base,...Object.fromEntries(Object.entries(copiedConfig).filter(([,value])=>value!=null)),...saved}});
  const rows=charts.map(rowsOf);
  charts.forEach((chart,i)=>{chart.dataset.measureOptions=JSON.stringify([states[i].measure]);});
  const metricTitle=metric=>q(metric,'.metric-label,label')?.textContent.replace('ⓘ','').trim()||'指标卡';
  const metricValue=metric=>q(metric,'.metric-value,strong');
  metrics.forEach((metric,i)=>{metric.dataset.customMetric=metric.dataset.metricIndicator||metricTitle(metric);metric.dataset.metricEditorIndex=String(i)});
  const metricOptions=metrics.map(metric=>[metric.dataset.customMetric,metricTitle(metric)]);
  const metricStates=metrics.map((metric,i)=>{let saved={};try{saved=JSON.parse(localStorage.getItem(`spc-page-metric:${location.pathname}:${i}`)||'{}')}catch{}return {title:metricTitle(metric),indicator:metric.dataset.customMetric,...saved}});
  const metricOriginalValues=Object.fromEntries(metrics.map(metric=>[metric.dataset.customMetric,metricValue(metric)?.innerHTML||'']));
  let editing=false,selected=-1,selectedMetric=-1,drawer=null,bar=null;
  function visible(el,show){if(el){el.hidden=!show;el.style.display=show?'':'none'}}
  function configure(drawer,type,index){
    const pie=type==='pie'||type==='donut',horizontal=type.startsWith('horizontalBar'),heatmap=type==='heatmap';
    const state=states[index];
    const dimensionSection=q(drawer,'[data-quality-dimension-heading]').closest('section');
    const measureSection=q(drawer,'[data-quality-measure-heading]').closest('section');
    visible(dimensionSection,!heatmap);visible(measureSection,!heatmap);
    if(heatmap){
      const dimensions=['时间','设备名称','所在位置（一级）','所在位置（二级）','模板名称','缺陷类型','判定结果'];
      const section=document.createElement('section');section.className='quality-config-section';section.dataset.heatmapFields='';
      const options=dimensions.map(value=>`<option>${esc(value)}</option>`).join('');
      section.innerHTML=`<div class="quality-config-grid"><div class="quality-config-field full"><label>横轴维度</label><select data-heatmap="x">${options}</select></div><div class="quality-config-field full"><label>纵轴维度</label><select data-heatmap="y">${options}</select></div><div class="quality-config-field full" data-heatmap-time><label>时间粒度</label><select data-heatmap="grain"><option>天</option><option>周</option><option>月</option></select></div><div class="quality-config-field full"><label>颜色指标</label><select data-heatmap="color"><option>检测PCB数</option><option>PCB良率</option><option>PCB不良率</option><option>误报率</option><option>器件DPPM</option><option>平均检测耗时</option></select></div><div class="quality-config-field full"><label>空单元格显示为</label><select disabled><option>无数据（与 0 区分）</option></select></div></div>`;
      dimensionSection.before(section);
      state.heatmapX||='时间';state.heatmapY||='设备名称';state.heatmapGrain||='天';state.heatmapColor||='检测PCB数';
      if(!['天','周','月'].includes(state.heatmapGrain))state.heatmapGrain='天';
      const x=q(section,'[data-heatmap="x"]'),y=q(section,'[data-heatmap="y"]'),grain=q(section,'[data-heatmap="grain"]'),color=q(section,'[data-heatmap="color"]');
      x.value=state.heatmapX;y.value=state.heatmapY;grain.value=state.heatmapGrain;color.value=state.heatmapColor;
      const sync=()=>{if(x.value===y.value)y.value=dimensions.find(value=>value!==x.value);state.heatmapX=x.value;state.heatmapY=y.value;state.heatmapGrain=grain.value;state.heatmapColor=color.value;visible(q(section,'[data-heatmap-time]'),x.value==='时间');preview()};
      section.querySelectorAll('select').forEach(select=>select.onchange=sync);sync();
    }
    q(drawer,'[data-quality-dimension-heading]').textContent=pie?'扇区分组（类别）':horizontal?'纵轴（类别）':'横轴（类别）';
    q(drawer,'[data-quality-measure-heading]').textContent=pie?'扇区数值':horizontal?'横轴（字段）':'纵轴（字段）';
    visible(q(drawer,'.quality-chart-switch-row'),!pie&&!heatmap);
    visible(q(drawer,'[data-quality-group-toggle]'),!pie);
    visible(q(drawer,'[data-quality-group-fields]'),!pie);
    const grid=q(drawer,'.quality-chart-check-grid');
    [...grid.children].forEach(label=>{if(/坐标轴|网格线/.test(label.textContent))visible(label,!pie)});
    let total=q(grid,'[data-quality-total]');if(!total){grid.insertAdjacentHTML('beforeend','<label class="quality-config-check" data-quality-total><input type="checkbox" data-quality-show-total>总数</label>');total=q(grid,'[data-quality-total]')}
    visible(total,type==='donut');q(total,'input').checked=states[index].total;
    const add=q(drawer,'[data-measure-add]');visible(add,!pie);
    drawer.querySelector('.quality-config-drawer-head h3').textContent=typeNames[type.replace(/Stacked|Percent|Smooth|Filled/g,'')]||typeNames[type]||'图表';
    window.spcQualityConfigTemplate.renderTypePicker(drawer,type);
  }
  function valuesSvg(data,s){
    const type=s.switched?(s.type==='bar'?'horizontalBar':s.type==='horizontalBar'?'bar':s.type):s.type,W=620,H=250,colors=palettes[s.theme]?.[1]||palettes[0][1],total=data.reduce((a,b)=>a+b.value,0)||1;
    const labels=s.labels,legend=s.legend,isPie=['pie','donut'].includes(type),horizontal=type.startsWith('horizontalBar');
    let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(s.title)}">`;
    if(s.gradient)svg+=`<defs>${colors.map((color,i)=>`<linearGradient id="shared-chart-gradient-${i}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".35"/></linearGradient>`).join('')}</defs>`;
    const fill=i=>s.gradient?`url(#shared-chart-gradient-${i%colors.length})`:colors[i%colors.length];
    if(type==='heatmap'){const names=data.slice(0,8);const cols=8,cellW=55,cellH=29,left=126,top=36,max=Math.max(...names.map(row=>row.value),1);names.forEach((row,r)=>{svg+=`<text x="${left-9}" y="${top+r*cellH+19}" text-anchor="end" fill="#526176" font-size="10">${esc(row.label.slice(0,12))}</text>`;for(let c=0;c<cols;c++){const opacity=.25+.65*((row.value/max*.65+(c*3+r*2)%7/10)%1);svg+=`<rect x="${left+c*cellW}" y="${top+r*cellH}" width="${cellW-2}" height="${cellH-2}" fill="${colors[(c+r)%colors.length]}" fill-opacity="${opacity.toFixed(2)}"/>`}});for(let c=0;c<cols;c++)svg+=`<text x="${left+c*cellW+cellW/2}" y="${top+names.length*cellH+15}" text-anchor="middle" fill="#526176" font-size="10">${s.heatmapGrain==='月'?c+1+'月':s.heatmapGrain==='周'?'第'+(c+1)+'周':String(c+1)+'日'}</text>`}
    else if(isPie){const cx=310,cy=125,r=88;let start=-Math.PI/2;data.forEach((row,i)=>{const sweep=row.value/total*Math.PI*2,end=start+sweep;const a=`${cx+r*Math.cos(start)},${cy+r*Math.sin(start)}`,b=`${cx+r*Math.cos(end)},${cy+r*Math.sin(end)}`;svg+=`<path d="M${cx} ${cy}L${a}A${r} ${r} 0 ${sweep>Math.PI?1:0} 1 ${b}Z" fill="${fill(i)}" stroke="#fff" stroke-width="2"/>`;if(labels){const mid=start+sweep/2;svg+=`<text x="${cx+65*Math.cos(mid)}" y="${cy+65*Math.sin(mid)}" fill="#fff" font-size="11" text-anchor="middle">${(row.value/total*100).toFixed(0)}%</text>`}start=end});if(type==='donut'){svg+=`<circle cx="${cx}" cy="${cy}" r="49" fill="#fff"/>`;if(s.total)svg+=`<text x="${cx}" y="${cy-6}" text-anchor="middle" fill="#526176" font-size="11">总数</text><text x="${cx}" y="${cy+18}" text-anchor="middle" fill="#263a55" font-size="20" font-weight="700">${Math.round(total).toLocaleString()}</text>`}}
    else{const left=horizontal?105:42,top=22,ph=185,pw=W-left-22,max=Math.max(...data.map(x=>x.value),1)*1.12;if(s.grid)for(let j=0;j<5;j++){const y=top+j*ph/4;svg+=`<line x1="${left}" y1="${y}" x2="${W-22}" y2="${y}" stroke="#e5ecf4"/>`}if(s.axes)svg+=`<path d="M${left} ${top}V${top+ph}H${W-22}" fill="none" stroke="#aab8ca"/>`;const pts=[];data.forEach((row,i)=>{const x=left+(i+.5)*pw/data.length,y=top+ph-row.value/max*ph;pts.push(`${x},${y}`);if(horizontal){const bh=Math.min(20,ph/data.length*.65),yy=top+i*ph/data.length;svg+=`<rect x="${left}" y="${yy}" width="${row.value/max*pw}" height="${bh}" fill="${fill(i)}"/><text x="${left-5}" y="${yy+bh/2+4}" text-anchor="end" fill="#526176" font-size="11">${esc(row.label.slice(0,12))}</text>`}else if(!/line|area|scatter/.test(type)){const bw=Math.min(38,pw/data.length*.6);svg+=`<rect x="${x-bw/2}" y="${y}" width="${bw}" height="${top+ph-y}" fill="${fill(i)}"/>`}if(!horizontal&&s.axes)svg+=`<text x="${x}" y="${top+ph+17}" text-anchor="middle" fill="#526176" font-size="10">${esc(row.label.slice(0,9))}</text>`;if(labels)svg+=`<text x="${horizontal?Math.min(left+row.value/max*pw+6,W-35):x}" y="${horizontal?top+i*ph/data.length+14:y-7}" text-anchor="${horizontal?'start':'middle'}" fill="#334155" font-size="10">${Math.round(row.value).toLocaleString()}</text>`});if(/line|area/.test(type)){const path=pts.map((p,i)=>`${i?'L':'M'}${p}`).join(' ');if(type.startsWith('area'))svg+=`<path d="${path}L${pts.at(-1).split(',')[0]} ${top+ph}L${pts[0].split(',')[0]} ${top+ph}Z" fill="${colors[0]}" fill-opacity=".25"/>`;svg+=`<path d="${path}" fill="none" stroke="${colors[0]}" stroke-width="3"/>`}if(type==='scatter')pts.forEach(point=>{const [x,y]=point.split(',');svg+=`<circle cx="${x}" cy="${y}" r="5" fill="${colors[0]}"/>`})}
    if(legend)svg+=`<rect x="18" y="8" width="9" height="9" fill="${colors[0]}"/><text x="32" y="17" fill="#526176" font-size="11">${esc(s.measure)}</text>`;
    return svg+'</svg>';
  }
  function paintNative(el,s){
    const colors=palettes[s.theme]?.[1]||palettes[0][1];
    [...el.querySelectorAll('svg path,svg rect,svg circle,svg polygon,svg polyline')].filter(node=>!node.closest('.shared-preview')).forEach((node,i)=>{
      for(const property of ['fill','stroke']){
        const originalKey=`sharedOriginal${property}`;
        if(node.dataset[originalKey]===undefined)node.dataset[originalKey]=node.getAttribute(property)||'';
        const original=node.dataset[originalKey];
        if(!s.theme){node.style[property]='';continue}
        if(original&&!['none','#fff','#ffffff','white','transparent'].includes(original.toLowerCase()))node.style[property]=colors[i%colors.length];
      }
    });
  }
  function preview(){if(selected<0)return;const el=charts[selected],s=states[selected];let overlay=q(el,'.quality-chart-body.shared-preview');if(rows[selected].length||s.type==='heatmap'){if(!overlay){overlay=document.createElement('div');overlay.className='quality-chart-body shared-preview';el.append(overlay)}overlay.style.backgroundColor=s.colors?.['背景颜色']?.hex||(s.custom?.[0]==='透明'?'transparent':'#fff');const data=window.spcFilterQualityChartRows?.(el,[...rows[selected]],s.dimension,s.measure)||[...rows[selected]];if(s.sortBy==='横轴值')data.sort((a,b)=>a.label.localeCompare(b.label,'zh-CN'));if(['纵轴值','字段值'].includes(s.sortBy))data.sort((a,b)=>a.value-b.value);if(s.sortOrder==='倒序'&&s.sortBy!=='记录顺序')data.reverse();overlay.innerHTML=valuesSvg(data,s);const svg=q(overlay,'svg');if(svg){const font=s.colors?.['字体颜色']?.hex||(s.custom?.[1]==='浅色'?'#fff':s.custom?.[1]==='深色'?'#263a55':'#526176');svg.querySelectorAll('text').forEach(text=>{if(text.getAttribute('fill')!=='#fff')text.style.fill=font;text.style.fontSize=(Number(s.custom?.[2])||12)+'px'})}}else{overlay?.remove();paintNative(el,s)}const title=titleOf(el);if(title)title.textContent=s.title}
  function renderDrawer(){const s=states[selected];drawer?.remove();document.body.insertAdjacentHTML('beforeend',window.spcQualityConfigTemplate.drawerMarkup());drawer=q(document,'[data-quality-config-drawer]');drawer.dataset.mode='chart';q(drawer,'[data-quality-config="name"]').value=s.title;q(drawer,'[data-quality-config="type"]').value=s.type;
    const dim=q(drawer,'[data-quality-config="dimension"]');dim.innerHTML=`<option>${esc(s.dimension)}</option>`;
    const measure=q(drawer,'[data-quality-config="measure"]');measure.innerHTML=`<option>${esc(s.measure)}</option>`;
    window.spcRenderChartMeasureControls?.(drawer,charts[selected]);
    const theme=q(drawer,'.quality-source-trigger');theme.setAttribute('role','button');theme.tabIndex=0;theme.innerHTML=`<span class="quality-theme-swatch-strip">${palettes[s.theme][1].map(c=>`<i style="background:${c}"></i>`).join('')}</span><span>${palettes[s.theme][0]}</span>`;const choices=document.createElement('div');choices.className='quality-theme-choices';choices.hidden=true;choices.innerHTML=palettes.map(([name,colors],i)=>`<button type="button" data-theme-index="${i}" class="quality-theme-option"><span class="quality-theme-swatch-strip">${colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span>${name}</button>`).join('');theme.after(choices);theme.onclick=()=>choices.hidden=!choices.hidden;choices.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{s.theme=Number(btn.dataset.themeIndex);choices.hidden=true;renderDrawer();preview()});
    configure(drawer,s.type,selected);
    const customControls=[...drawer.querySelectorAll('[data-chart-panel="custom"] select,[data-chart-panel="custom"] input')];
    if(s.custom)customControls.forEach((control,i)=>{if(s.custom[i]===undefined)return;if(control.type==='checkbox')control.checked=s.custom[i]==='true';else control.value=s.custom[i]});
    setTimeout(()=>{if(!drawer||selected<0)return;drawer.querySelectorAll('[data-chart-color]').forEach(button=>{const label=button.dataset.chartColor;if(s.colors?.[label])window.spcBindColorTrigger?.(button,label==='背景颜色'?'background':'text',s.colors[label]);new MutationObserver(()=>{s.colors||={};s.colors[label]={...button._color};preview()}).observe(button,{childList:true,subtree:true,attributes:true,attributeFilter:['style']})})},0);
    const gradient=q(drawer,'[data-chart-panel="base"] .quality-config-check.full input:not([data-quality-summary-category]):not([data-quality-group])');
    if(gradient){gradient.checked=s.gradient;gradient.onchange=()=>{s.gradient=gradient.checked;preview()}}
    const checks=[['legend','[data-quality-config="legend"]'],['labels','[data-quality-config="label"]'],['axes','.quality-chart-check-grid label:nth-child(3) input'],['grid','.quality-chart-check-grid label:nth-child(4) input'],['total','[data-quality-show-total]']];checks.forEach(([name,sel])=>{const input=q(drawer,sel);if(input){input.checked=s[name];input.onchange=()=>{s[name]=input.checked;preview()}}});
    const switchInput=q(drawer,'.quality-chart-switch-row input');if(switchInput){switchInput.checked=!!s.switched;switchInput.onchange=()=>{s.switched=switchInput.checked;preview()}}
    const summary=q(drawer,'[data-quality-summary-category]'),group=q(drawer,'[data-quality-group]');
    if(summary&&group){summary.checked=s.summarized!==false;group.checked=s.grouped!==false;const sync=()=>{const pie=['pie','donut'].includes(s.type);visible(q(drawer,'[data-quality-group-toggle]'),!pie&&summary.checked);visible(q(drawer,'[data-quality-group-fields]'),!pie&&summary.checked&&group.checked)};summary.onchange=()=>{s.summarized=summary.checked;sync();preview()};group.onchange=()=>{s.grouped=group.checked;sync();preview()};sync()}
    drawer.querySelectorAll('.quality-segment-control button').forEach(button=>button.onclick=()=>{button.parentElement.querySelectorAll('button').forEach(item=>item.classList.toggle('is-active',item===button));const label=button.closest('.quality-config-field')?.querySelector('label')?.textContent.trim();if(label==='排序依据')s.sortBy=button.textContent.trim();if(label==='排序规则')s.sortOrder=button.textContent.trim();preview()});
    if(s.sortBy||s.sortOrder)drawer.querySelectorAll('.quality-segment-control').forEach(segment=>{const label=segment.closest('.quality-config-field')?.querySelector('label')?.textContent.trim(),wanted=label==='排序依据'?s.sortBy:label==='排序规则'?s.sortOrder:null;if(wanted)segment.querySelectorAll('button').forEach(button=>button.classList.toggle('is-active',button.textContent.trim()===wanted))});
    q(drawer,'[data-quality-config="name"]').oninput=e=>{s.title=e.target.value;preview()};
    q(drawer,'[data-quality-config="type"]').onchange=e=>{s.type=e.target.value;renderDrawer();preview()};
    q(drawer,'.quality-config-drawer-close').onclick=()=>finish();
    q(drawer,'[data-quality-chart-save]').onclick=()=>{localStorage.setItem(`spc-page-chart:${location.pathname}:${selected}`,JSON.stringify(s));preview()};
    drawer.querySelectorAll('[data-chart-tab]').forEach(tab=>tab.onclick=()=>{drawer.querySelectorAll('[data-chart-tab]').forEach(x=>x.classList.toggle('is-active',x===tab));drawer.querySelectorAll('[data-chart-panel]').forEach(panel=>panel.hidden=panel.dataset.chartPanel!==tab.dataset.chartTab)});
    drawer.addEventListener('change',e=>{if(e.target.closest('[data-chart-panel="custom"]')){s.custom=customControls.map(control=>control.type==='checkbox'?String(control.checked):control.value);preview()}});
    drawer.addEventListener('input',e=>{if(e.target.closest('[data-chart-panel="custom"]')){s.custom=customControls.map(control=>control.type==='checkbox'?String(control.checked):control.value);preview()}});
  }
  function select(index){selectedMetric=-1;metrics.forEach(el=>el.classList.remove('is-editor-selected'));charts.forEach((el,i)=>el.classList.toggle('is-editor-selected',i===index));selected=index;renderDrawer();preview()}
  function selectMetric(index){
    selected=-1;charts.forEach(el=>el.classList.remove('is-editor-selected'));selectedMetric=index;metrics.forEach((el,i)=>el.classList.toggle('is-editor-selected',i===index));
    const metric=metrics[index],state=metricStates[index];drawer?.remove();document.body.insertAdjacentHTML('beforeend',window.spcQualityConfigTemplate.drawerMarkup());drawer=q(document,'[data-quality-config-drawer]');drawer.dataset.mode='metric';q(drawer,'.quality-config-drawer-head h3').textContent='指标卡';
    const config={description:state.title,precision:metricValue(metric)?.textContent.includes('%')?'2位小数':'整数',format:metricValue(metric)?.textContent.includes('%')?'百分比':'数字（千分位）'};
    q(drawer,'.quality-config-drawer-body').innerHTML=window.spcQualityConfigTemplate.metricMarkup(config,metric,metricOptions);
    const title=q(drawer,'[data-metric-description]'),indicator=q(drawer,'[data-metric-indicator]');title.value=state.title;indicator.value=state.indicator;
    title.oninput=()=>{state.title=title.value;const label=q(metric,'.metric-label,label');if(label)label.textContent=state.title};
    indicator.onchange=()=>{state.indicator=indicator.value;const source=metrics.find(item=>item.dataset.customMetric===state.indicator),value=metricValue(metric);if(source&&value)value.innerHTML=metricValue(source)?.innerHTML||value.innerHTML};
    drawer.querySelectorAll('[data-metric-tab]').forEach(tab=>tab.onclick=()=>{drawer.querySelectorAll('[data-metric-tab]').forEach(item=>item.classList.toggle('is-active',item===tab));drawer.querySelectorAll('[data-metric-panel]').forEach(panel=>panel.hidden=panel.dataset.metricPanel!==tab.dataset.metricTab)});
    q(drawer,'[data-quality-chart-save]').onclick=()=>{localStorage.setItem(`spc-page-metric:${location.pathname}:${index}`,JSON.stringify(state))};
    q(drawer,'.quality-config-drawer-close').onclick=finish;
  }
  function finish(){editing=false;document.body.classList.remove('quality-page-editor-open');bar?.remove();bar=null;drawer?.remove();drawer=null;charts.forEach(el=>el.classList.remove('is-editor-selected'));metrics.forEach(el=>el.classList.remove('is-editor-selected'));selected=-1;selectedMetric=-1;entry.hidden=false}
  function start(){editing=true;document.body.classList.add('quality-page-editor-open');entry.hidden=true;bar=document.createElement('section');bar.className='quality-editor-bar';bar.innerHTML='<b>编辑分析页面</b><span>　点击图表进行配置</span><div class="quality-editor-bar-actions"><button type="button" class="primary">完成编辑</button></div>';const main=q(document,'main');main?.prepend(bar);q(bar,'button').onclick=finish;select(0)}
  const main=q(document,'main');if(!main)return;
  [...document.querySelectorAll('button')].filter(button=>button.textContent.trim()==='编辑页面'&&!button.hasAttribute('data-quality-page-edit')).forEach(button=>{button.hidden=true;button.style.display='none'});
  let anchor=q(main,page==='project-stats'?'.project-mouth-toolbar':page==='project-detail'?'.detail-breadcrumb':page==='defect-analysis'?'.defect-mouth-toolbar':page==='false-analysis'||page==='defect-analysis-machine'?'.dimension-tabs':'.quality-page-edit-host');
  if(!anchor){anchor=document.createElement('section');anchor.className='quality-page-edit-host';main.prepend(anchor)}
  const entry=document.createElement('button');entry.type='button';entry.className='quality-page-edit-button';entry.dataset.qualityPageEdit='';entry.textContent='编辑页面';entry.onclick=start;anchor.append(entry);
  charts.forEach((el,i)=>{el.dataset.customChart='';el.addEventListener('click',event=>{if(!editing||event.target.closest('button,a,input,select'))return;select(i)},true)});
  metrics.forEach((el,i)=>el.addEventListener('click',event=>{if(!editing||event.target.closest('button,a,input,select'))return;selectMetric(i)},true));
  charts.forEach((el,i)=>{if(localStorage.getItem(`spc-page-chart:${location.pathname}:${i}`)){selected=i;preview()}});selected=-1;
  metrics.forEach((metric,i)=>{if(!localStorage.getItem(`spc-page-metric:${location.pathname}:${i}`))return;const state=metricStates[i],label=q(metric,'.metric-label,label'),value=metricValue(metric);if(label)label.textContent=state.title;if(value&&metricOriginalValues[state.indicator])value.innerHTML=metricOriginalValues[state.indicator]});
  window.addEventListener('spc-chart-scope-change',event=>{if(selected>=0&&charts[selected]===event.detail.chart)preview()});
})();
