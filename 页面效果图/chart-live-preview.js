(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q = (root, selector) => root?.querySelector(selector);
  const field = (root, label) => [...(root?.querySelectorAll('.quality-config-field') || [])].find(node => node.firstElementChild?.tagName === 'LABEL' && node.firstElementChild.textContent.trim() === label);
  const select = (root, label) => field(root, label)?.querySelector('select')?.value;
  const check = (root, label) => [...(root?.querySelectorAll('label.quality-config-check') || [])].find(node => node.textContent.trim() === label)?.querySelector('input')?.checked;
  const color = (root, name, fallback) => q(root, `[data-chart-color="${name}"]`)?._color?.hex || fallback;
  const bySummary = (root, title) => [...(root?.querySelectorAll('details') || [])].find(node => q(node, 'summary')?.textContent.trim() === title);
  const pct = name => /率|占比/.test(name);
  const themeSchemes = [
    {id:'default',label:'默认',colors:['#3478f6','#6c9cf8','#74c6b5','#efbb78','#9586df','#43b8ed']},
    {id:'fresh',label:'清新',colors:['#4d8bff','#00c7bd','#58ce67','#b9db30','#ffd456','#ff995a']},
    {id:'vivid',label:'明快',colors:['#2f70f5','#ff8c35','#1cbbec','#ffc000','#3fcc55','#818c9b']},
    {id:'contrast',label:'对比',colors:['#477fff','#f36a64','#a9b0bc','#6266dd','#ec4dbb','#863af5']},
    {id:'soft',label:'柔和',colors:['#b7ccff','#acdfff','#9ee6df','#b9eabe','#e8ee9a','#ffebba']},
    {id:'rose',label:'玫瑰',colors:['#16a7d6','#4e70d4','#304fae','#f48ccb','#e968aa','#bf4e98']}
  ];
  const palette = themeSchemes[0].colors;
  const schemeFor = chart => themeSchemes.find(item=>item.id===chart?.dataset.chartTheme) || themeSchemes.find(item=>item.colors.includes(chart?.dataset.chartTheme)) || themeSchemes[0];
  function getRows(dimension, measure) {
    const data = window.spcQualityChartSamples;
    if (!data) return [];
    let rows = [];
    if (dimension === '检测开始时间') {
      const trend = data.trend(), labels = trend.labels;
      rows = labels.map((label, i) => ({label, recordCount:data.devices.slice(0,5).length,count: data.devices.slice(0,5).reduce((sum, d, j) => sum + Math.max(80, Math.round(d.boardTotal / labels.length * (.82 + ((i*3+j*2)%7)*.055))), 0), yield: trend.series.reduce((sum,s)=>sum+(s.values[i]||0),0)/Math.max(1,trend.series.length)}));
    } else if (dimension === '设备名称' || dimension === '设备SN' || dimension === '设备位置（一级）' || dimension === '设备位置（二级）' || dimension === '运行状态' || dimension === '启用状态') {
      rows = data.devices.map(d => ({label: dimension === '设备SN' ? d.sn : dimension === '设备位置（一级）' ? (data.comparisonDevices.find(x=>x.name===d.name)?.area||'未分配') : dimension === '设备位置（二级）' ? (data.comparisonDevices.find(x=>x.name===d.name)?.area?.replace('区域','产线')+'1') : dimension === '运行状态' ? (d.lastDataTime ? '运行中' : '离线') : dimension === '启用状态' ? '启用' : d.name, '设备名称':d.name,'设备SN':d.sn,'设备位置（一级）':data.comparisonDevices.find(x=>x.name===d.name)?.area||'未分配','设备位置（二级）':(data.comparisonDevices.find(x=>x.name===d.name)?.area||'').replace('区域','产线')+'1','运行状态':d.lastDataTime?'运行中':'离线','启用状态':'启用','模板名称':d.projects?.map(project=>project.name).join('、')||'','模板ID':d.projects?.map(project=>project.uuid).join('、')||'',recordCount:1,count:d.boardTotal, yield:d.review.yield, ng:100-d.review.yield, dppm:d.review.componentFalseDppm, falseRate:d.review.falseRate}));
    } else if (dimension === '模板名称' || dimension === '模板ID') {
      rows = data.projects.filter(p=>Number.isFinite(p.boardTotal)).map(p => ({label:dimension==='模板ID'?p.uuid:p.name,'模板名称':p.name,'模板ID':p.uuid,recordCount:data.devices.filter(d=>d.projects?.some(item=>item.uuid===p.uuid)).length,count:p.boardTotal,yield:p.review.yield,ng:100-p.review.yield,dppm:p.review.componentFalseDppm,falseRate:p.review.falseRate}));
    }
    const key = measure === '统计字段总数' ? 'recordCount' : measure === '检测PCB数' ? 'count' : measure === 'PCB良率' ? 'yield' : measure === 'PCB不良率' ? 'ng' : measure === '器件DPPM' ? 'dppm' : measure === '误报率' ? 'falseRate' : null;
    if (!key) return [];
    return rows.filter(row=>Number.isFinite(row[key])).map(row=>({...row,value:row[key]}));
  }
  window.spcQualityChartRows = getRows;
  function aggregateRows(rows,calculation){const groups=new Map();for(const row of rows){if(!groups.has(row.label))groups.set(row.label,[]);groups.get(row.label).push(row.value)}return [...groups].map(([label,values])=>({label,value:calculation==='max'?Math.max(...values):calculation==='min'?Math.min(...values):calculation==='avg'?values.reduce((a,b)=>a+b,0)/values.length:values.reduce((a,b)=>a+b,0)}))}
  function active(root, label) { return [...(root?.querySelectorAll('.quality-segment-control')||[])].find(el=>el.closest('.quality-config-field')?.querySelector('label')?.textContent.trim()===label)?.querySelector('button.is-active')?.textContent.trim(); }
  const point = (x,y) => `${x.toFixed(1)},${y.toFixed(1)}`;
  function renderSvg(rows, type, options) {
    const W=620,H=260, left=type.startsWith('horizontalBar')?120:55,right=24,top=26,bottom=45, pw=W-left-right,ph=H-top-bottom;
    const values=rows.map(r=>r.value), rawMax=Math.max(...values,1), min=Number.isFinite(options.min)?options.min:0, max=Number.isFinite(options.max)&&options.max>min?options.max:Math.max(rawMax*1.12,min+1);
    const valueY=v=>top+ph-(Math.max(min,Math.min(max,v))-min)/(max-min)*ph;
    const colors=options.colors, primary=colors[0], horizontal=type.startsWith('horizontalBar');
    const isPie=type==='pie'||type==='donut',isRadar=type.startsWith('radar'),isScatter=type==='scatter';
    const isLine=type.startsWith('line')||type.startsWith('area'),isArea=type.startsWith('area');
    const stacked=/Stacked|Percent/.test(type), percent=/Percent/.test(type);
    const n=rows.length, gap=pw/n;
    const total=values.reduce((a,b)=>a+b,0)||1;
    const labelValue=(row)=>options.labelContent==='系列名'?(options.seriesName||options.measure):options.labelContent==='占比'?`${(row.value/total*100).toFixed(1)}%`:pct(options.measure)?`${row.value.toFixed(1)}%`:Math.round(row.value).toLocaleString();
    let elements='';
    const gridColor=options.gridColor, font=esc(options.fontColor),size=options.fontSize;
    const fill=options.gradient?'url(#quality-live-gradient)':primary;
    if(options.gradient)elements+=`<defs><linearGradient id="quality-live-gradient" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${primary}" stop-opacity=".24"/></linearGradient></defs>`;
    if (!isPie&&!isRadar) {
      if(options.grid) for(let i=0;i<=4;i++){const y=top+ph*i/4;elements+=`<line x1="${left}" y1="${y}" x2="${W-right}" y2="${y}" stroke="${gridColor}" stroke-width="${options.gridWidth}"/>`}
      if(options.axes) elements+=`<path d="M${left} ${top}V${top+ph}H${W-right}" fill="none" stroke="#aab8ca" stroke-width="1"/>`;
      if(options.yLabels&&!horizontal) for(let i=0;i<=4;i++){const v=min+(max-min)*(4-i)/4,x=left-8,y=top+ph*i/4+4;elements+=`<text x="${x}" y="${y}" text-anchor="end" fill="${font}" font-size="${size}" transform="rotate(${options.yAngle} ${x} ${y})">${pct(options.measure)?v.toFixed(0)+'%':Math.round(v).toLocaleString()}</text>`}
      if(options.xLabels) rows.forEach((r,i)=>{if(i%Math.max(1,Math.ceil(size*5/gap))!==0&&i!==rows.length-1)return;const label=esc(String(r.label).slice(0,11)),x=left+gap*(i+.5),y=top+ph+15;elements+=`<text x="${x}" y="${y}" text-anchor="middle" fill="${font}" font-size="${size}" transform="rotate(${options.xAngle} ${x} ${y})">${label}</text>`});
    }
    if (isPie) {
      const sum=values.reduce((a,b)=>a+b,0)||1,cx=W/2,cy=H/2,r=91;let start=-Math.PI/2;
      rows.forEach((row,i)=>{const sweep=row.value/sum*Math.PI*2,end=start+sweep,x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end),large=sweep>Math.PI?1:0;elements+=`<path d="M${cx} ${cy}L${point(x1,y1)}A${r} ${r} 0 ${large} 1 ${point(x2,y2)}Z" fill="${colors[i%colors.length]}" fill-opacity="${options.fillOpacity}" stroke="#fff" stroke-width="2"><title>${esc(row.label)}：${row.value.toLocaleString()}</title></path>`;if(options.labels){const mid=start+sweep/2;elements+=`<text x="${cx+65*Math.cos(mid)}" y="${cy+65*Math.sin(mid)}" fill="#fff" font-size="11" text-anchor="middle">${esc(labelValue(row))}</text>`}start=end});
      if(type==='donut'){elements+=`<circle cx="${cx}" cy="${cy}" r="48" fill="${options.background}"/>`;if(options.showTotal)elements+=`<text x="${cx}" y="${cy-7}" text-anchor="middle" fill="${font}" font-size="11">总数</text><text x="${cx}" y="${cy+16}" text-anchor="middle" fill="${font}" font-size="19" font-weight="700">${Math.round(total).toLocaleString()}</text>`}
    } else if(isRadar) {
      const cx=W/2,cy=H/2,r=94,m=Math.min(n,8),pts=rows.slice(0,m).map((row,i)=>{const a=-Math.PI/2+i*2*Math.PI/m,v=row.value/max;return [cx+r*v*Math.cos(a),cy+r*v*Math.sin(a)]});
      for(let ring=1;ring<=4;ring++)elements+=`<polygon points="${Array.from({length:m},(_,i)=>point(cx+r*ring/4*Math.cos(-Math.PI/2+i*2*Math.PI/m),cy+r*ring/4*Math.sin(-Math.PI/2+i*2*Math.PI/m))).join(' ')}" fill="none" stroke="${gridColor}" stroke-width="${options.gridWidth}"/>`;
      elements+=`<polygon points="${pts.map(p=>point(...p)).join(' ')}" fill="${type==='radarFilled'?primary:'none'}" fill-opacity=".25" stroke="${primary}" stroke-width="2"/>`;
      rows.slice(0,m).forEach((row,i)=>{const a=-Math.PI/2+i*2*Math.PI/m;elements+=`<text x="${cx+(r+22)*Math.cos(a)}" y="${cy+(r+22)*Math.sin(a)}" fill="${font}" text-anchor="middle" font-size="${size}">${esc(String(row.label).slice(0,8))}</text>`});
    } else if(horizontal) {
      const bh=Math.min(23,ph/n*.65),space=ph/n;rows.forEach((r,i)=>{const y=top+i*space+(space-bh)/2,w=percent?pw:Math.max(1,pw*r.value/max);elements+=`<rect x="${left}" y="${y}" width="${w}" height="${bh}" fill="${fill}" fill-opacity="${options.fillOpacity}" stroke="${options.borderColor}" stroke-width="${options.borderWidth}"/>`;if(options.labels)elements+=`<text x="${options.labelPosition==='内部'?left+w-8:Math.min(left+w+7,W-36)}" y="${y+bh/2+4}" text-anchor="${options.labelPosition==='内部'?'end':'start'}" fill="${options.labelPosition==='内部'?'#fff':font}" font-size="${size}">${percent?'100%':esc(labelValue(r))}</text>`;if(options.yLabels)elements+=`<text x="${left-8}" y="${y+bh/2+4}" text-anchor="end" fill="${font}" font-size="${size}">${esc(String(r.label).slice(0,9))}</text>`});
    } else if(isLine||isScatter) {
      const coords=rows.map((r,i)=>[left+gap*(i+.5),valueY(r.value)]),path=type==='lineSmooth'?coords.map((p,i)=>i?`Q${point((coords[i-1][0]+p[0])/2,coords[i-1][1])} ${point((coords[i-1][0]+p[0])/2,(coords[i-1][1]+p[1])/2)} T${point(...p)}`:`M${point(...p)}`).join(' '):coords.map((p,i)=>`${i?'L':'M'}${point(...p)}`).join('');
      if(isArea)elements+=`<path d="${path}L${coords.at(-1)[0]} ${top+ph}L${coords[0][0]} ${top+ph}Z" fill="${fill}" fill-opacity=".34"/>`;
      if(!isScatter)elements+=`<path d="${path}" fill="none" stroke="${primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      coords.forEach(([x,y],i)=>{elements+=`<circle cx="${x}" cy="${y}" r="${isScatter?5:3.5}" fill="${primary}" stroke="#fff" stroke-width="1.5"><title>${esc(rows[i].label)}：${rows[i].value.toLocaleString()}</title></circle>`;if(options.labels)elements+=`<text x="${x}" y="${options.labelPosition==='内部'?y+17:y-9}" text-anchor="middle" fill="${font}" font-size="${size}">${esc(labelValue(rows[i]))}</text>`});
    } else {
      const bw=Math.min(40,gap*.58);rows.forEach((r,i)=>{const x=left+gap*(i+.5)-bw/2,y=percent?top:valueY(r.value),h=top+ph-y;elements+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="${fill}" fill-opacity="${options.fillOpacity}" stroke="${options.borderColor}" stroke-width="${options.borderWidth}"/>`;if(options.labels)elements+=`<text x="${x+bw/2}" y="${options.labelPosition==='内部'?y+Math.min(19,h-2):Math.max(top+8,y-7)}" text-anchor="middle" fill="${options.labelPosition==='内部'?'#fff':font}" font-size="${size}">${percent?'100%':esc(labelValue(r))}</text>`});
    }
    const legend=options.legend?`<g transform="translate(${options.legendPosition==='右侧'?W-105:options.legendPosition==='左侧'?12:W/2-55} ${options.legendPosition==='底部'?H-7:13})"><rect width="9" height="9" fill="${primary}"/><text x="14" y="9" fill="${font}" font-size="11">${esc(options.seriesName||options.measure)}</text></g>`:'';
    const xTitle=options.xTitle?`<text x="${W/2}" y="${H-2}" text-anchor="middle" fill="${font}" font-size="11">${esc(options.xTitle)}</text>`:'';
    const yTitle=options.yTitle?`<text x="12" y="${H/2}" text-anchor="middle" transform="rotate(-90 12 ${H/2})" fill="${font}" font-size="11">${esc(options.yTitle)}</text>`:'';
    return `<svg class="quality-live-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(type)}，${esc(options.dimension)}与${esc(options.measure)}">${elements}${legend}${xTitle}${yTitle}</svg>`;
  }
  function renderMultiSvg(series,type,options){
    const W=620,H=260,horizontal=type.startsWith('horizontalBar'),left=horizontal?112:48,right=15,top=31,bottom=42,pw=W-left-right,ph=H-top-bottom;
    const names=[...new Set(series.flatMap(item=>item.rows.map(row=>row.label)))].slice(0,horizontal?8:10);
    const values=series.map(item=>{const map=new Map(item.rows.map(row=>[row.label,row.value]));return names.map(name=>map.get(name)??null)});
    const stack=/Stacked|Percent/.test(type),percent=/Percent/.test(type),isLine=/^(line|area|scatter)/.test(type),isArea=type.startsWith('area');
    const sums=names.map((_,i)=>values.reduce((sum,row)=>sum+(row[i]||0),0));
    const max=Math.max(1,...(stack?sums:values.flat().filter(Number.isFinite)))*1.08;
    const x=i=>left+pw*(i+.5)/names.length,y=value=>top+ph-(value/max)*ph;
    const color=options.colors,font=esc(options.fontColor),size=options.fontSize;
    let svg='';
    if(options.grid)for(let i=0;i<=4;i++){const yy=top+ph*i/4;svg+=`<line x1="${left}" y1="${yy}" x2="${W-right}" y2="${yy}" stroke="${options.gridColor}" stroke-width="${options.gridWidth}"/>`}
    if(options.axes)svg+=`<path d="M${left} ${top}V${top+ph}H${W-right}" fill="none" stroke="#aab8ca"/>`;
    if(!horizontal&&options.xLabels)names.forEach((name,i)=>{if(i%Math.max(1,Math.ceil(size*5/(pw/names.length)))!==0&&i!==names.length-1)return;const xx=x(i),yy=top+ph+15;svg+=`<text x="${xx}" y="${yy}" text-anchor="middle" transform="rotate(${options.xAngle} ${xx} ${yy})" font-size="${size}" fill="${font}">${esc(String(name).slice(0,10))}</text>`});
    if(horizontal&&options.yLabels)names.forEach((name,i)=>svg+=`<text x="${left-7}" y="${top+(i+.5)*ph/names.length+4}" text-anchor="end" font-size="${size}" fill="${font}">${esc(String(name).slice(0,10))}</text>`);
    if(isLine){
      values.forEach((row,j)=>{const points=row.map((value,i)=>value===null?null:[x(i),y(value)]).filter(Boolean);if(!points.length)return;const path=points.map(([xx,yy],i)=>`${i?'L':'M'}${xx.toFixed(1)} ${yy.toFixed(1)}`).join(' ');if(isArea)svg+=`<path d="${path}L${points.at(-1)[0]} ${top+ph}L${points[0][0]} ${top+ph}Z" fill="${color[j%color.length]}" fill-opacity=".18"/>`;if(type!=='scatter')svg+=`<path d="${path}" fill="none" stroke="${color[j%color.length]}" stroke-width="2.5"/>`;points.forEach(([xx,yy])=>svg+=`<circle cx="${xx}" cy="${yy}" r="3" fill="${color[j%color.length]}"/>`)});
    }else if(horizontal){
      names.forEach((_,i)=>{const rowY=top+i*ph/names.length,slot=ph/names.length;if(stack){let cursor=left;values.forEach((row,j)=>{const value=row[i];if(value===null)return;const width=pw*(percent?value/(sums[i]||1):value/max);svg+=`<rect x="${cursor}" y="${rowY+slot*.18}" width="${width}" height="${slot*.64}" fill="${color[j%color.length]}" fill-opacity="${options.fillOpacity}"/>`;cursor+=width});if(options.labels)svg+=`<text x="${Math.min(cursor+4,W-38)}" y="${rowY+slot*.62}" fill="${font}" font-size="9">${percent?'100%':Math.round(sums[i]).toLocaleString()}</text>`}else values.forEach((row,j)=>{const value=row[i];if(value===null)return;const bh=slot*.72/series.length,yy=rowY+slot*.14+j*bh,width=pw*value/max;svg+=`<rect x="${left}" y="${yy}" width="${width}" height="${bh-1}" fill="${color[j%color.length]}" fill-opacity="${options.fillOpacity}"/>`;if(options.labels)svg+=`<text x="${Math.min(left+width+3,W-38)}" y="${yy+bh*.75}" fill="${font}" font-size="9">${Math.round(value).toLocaleString()}</text>`})});
    }else{
      names.forEach((_,i)=>{const band=pw/names.length;if(stack){let cursor=top+ph;values.forEach((row,j)=>{const value=row[i];if(value===null)return;const height=ph*(percent?value/(sums[i]||1):value/max);cursor-=height;svg+=`<rect x="${x(i)-band*.26}" y="${cursor}" width="${band*.52}" height="${height}" fill="${color[j%color.length]}" fill-opacity="${options.fillOpacity}"/>`});if(options.labels)svg+=`<text x="${x(i)}" y="${Math.max(top+10,cursor-3)}" text-anchor="middle" fill="${font}" font-size="9">${percent?'100%':Math.round(sums[i]).toLocaleString()}</text>`}else values.forEach((row,j)=>{const value=row[i];if(value===null)return;const bw=band*.68/series.length,xx=x(i)-band*.34+j*bw,yy=y(value);svg+=`<rect x="${xx}" y="${yy}" width="${Math.max(2,bw-2)}" height="${top+ph-yy}" fill="${color[j%color.length]}" fill-opacity="${options.fillOpacity}"/>`;if(options.labels)svg+=`<text x="${xx+bw/2}" y="${Math.max(top+10,yy-3)}" text-anchor="middle" fill="${font}" font-size="9">${Math.round(value).toLocaleString()}</text>`})});
    }
    series.forEach((item,i)=>{const xx=14+(i%3)*200,yy=13+Math.floor(i/3)*13;svg+=`<rect x="${xx}" y="${yy-8}" width="8" height="8" fill="${color[i%color.length]}"/><text x="${xx+12}" y="${yy}" font-size="10" fill="${font}">${esc(item.name)}</text>`});
    return `<svg class="quality-live-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(series.map(item=>item.name).join('、'))}多字段图表">${svg}</svg>`;
  }
  function render(chart, drawer) {
    const body=q(chart,'.quality-chart-body'),base=q(drawer,'[data-chart-panel="base"]'),custom=q(drawer,'[data-chart-panel="custom"]');if(!body||!base)return false;
    const type=q(base,'[data-quality-config="type"]')?.value,dimension=q(base,'[data-quality-config="dimension"]')?.value,measure=q(base,'[data-quality-config="measure"]')?.value;
    if(type==='heatmap'){
      const scheme=schemeFor(chart),cells=body.querySelectorAll('svg rect[fill]');
      cells.forEach(rect=>{const strength=parseFloat(rect.getAttribute('fill-opacity'))||.5;rect.setAttribute('fill',scheme.colors[Math.min(scheme.colors.length-1,Math.floor(strength*scheme.colors.length))])});
      return false;
    }
    const selection=window.spcChartMeasureSelection?.(drawer,chart)||{mode:'value',fields:[{name:measure,calc:'sum'}]};
    const requested=selection.mode==='count'?[{name:'统计字段总数',calc:'sum'}]:(selection.fields.length?selection.fields:[{name:measure,calc:'sum'}]);
    const summarized=!!q(base,'[data-quality-summary-category]')?.checked;
    const seriesRows=requested.map(item=>{const source=window.spcFilterQualityChartRows?.(chart,getRows(dimension,item.name),dimension,item.name)||getRows(dimension,item.name);return {name:item.name,rows:summarized?aggregateRows(source,item.calc):source}});
    let rows=seriesRows[0]?.rows||[];if(seriesRows.some(item=>!item.rows.length)){body.innerHTML='<div class="quality-live-empty">当前字段组合暂无统计数据</div>';return true}
    const sortBox=q(base,'[data-quality-axis-sort]'),order=active(sortBox,'排序依据'),rule=active(sortBox,'排序规则');
    if(order==='横轴值')rows.sort((a,b)=>String(a.label).localeCompare(String(b.label),'zh-CN'));
    if(order==='纵轴值')rows.sort((a,b)=>a.value-b.value);
    if(rule==='倒序'&&order!=='记录顺序')rows.reverse();
    rows=rows.slice(0,Math.min(type.startsWith('radar')?8:10,rows.length));
    const detail=s=>bySummary(custom,s),x=detail('横轴'),y=detail('纵轴'),grid=detail('网格线与刻度标记'),axisTitle=detail('轴标题'),series=detail('系列');
    const angleValue=s=>({默认:0,垂直向上:-90,左起斜上:-45,横排:0,左起斜下:45,垂直向下:90})[s]||0;
    const scheme=schemeFor(chart),theme=scheme.colors[0];
    const colors=scheme.colors;
    const axisTitleText=q(field(axisTitle,'标题内容'),'input')?.value||'',axisSide=select(axisTitle,'选择轴');
    const minInput=field(y,'轴范围')?.querySelectorAll('input')?.[0],maxInput=field(y,'轴范围')?.querySelectorAll('input')?.[1];
    const seriesStyle=series?.querySelector('.quality-chart-option-box');
    const options={dimension,measure,colors,fontColor:color(custom,'字体颜色','#526176'),fontSize:Number(select(custom,'字号'))||12,background:color(custom,'背景颜色','#fff'),gridColor:color(custom,'网格颜色','#e5ecf4'),gridWidth:parseFloat(select(custom,'网格粗细'))||1,grid:check(base,'网格线')!==false&&!!q(grid,'[data-quality-main-grid]')?.checked,axes:check(base,'坐标轴')!==false,labels:check(base,'数据标签')!==false&&q(series,'[data-quality-data-label]')?.checked!==false,showTotal:q(base,'[data-quality-show-total]')?.checked!==false,xLabels:q(x,'label.quality-config-check input')?.checked!==false,yLabels:q(y,'label.quality-config-check input')?.checked!==false,xAngle:angleValue(select(x,'标签角度')),yAngle:angleValue(select(y,'标签角度')),legend:check(base,'图例')!==false&&select(detail('图例'),'图例位置')!=='隐藏',legendPosition:select(detail('图例'),'图例位置')||'顶部',xTitle:axisSide==='横轴'?axisTitleText:'',yTitle:axisSide==='纵轴'?axisTitleText:'',seriesName:q(series,'[data-quality-custom-series-name]')?.checked?q(series,'[data-quality-series-name] input')?.value:'',labelPosition:select(series,'标签位置'),labelContent:select(series,'标签内容'),min:minInput?.value!==''?Number(minInput?.value):NaN,max:maxInput?.value!==''?Number(maxInput?.value):NaN,gradient:!!q(base,'.quality-config-check.full:not([data-quality-group-toggle]) input:not([data-quality-summary-category])')?.checked,fillOpacity:(parseFloat(select(seriesStyle,'填充色不透明度'))||100)/100,borderColor:select(seriesStyle,'边框色')==='默认'?'none':theme,borderWidth:parseFloat(select(seriesStyle,'边框粗细'))||0};
    body.style.backgroundColor=options.background;
    const switchRows=q(base,'.quality-chart-switch-row input')?.checked;
    const visualType=switchRows?(type==='bar'?'horizontalBar':type==='horizontalBar'?'bar':type):type;
    if(seriesRows.length>1){seriesRows[0].rows=rows;const supported=/^(bar|horizontalBar|line|area|scatter)/.test(visualType);body.innerHTML=supported?renderMultiSvg(seriesRows,visualType,options):renderSvg(seriesRows.map(item=>({label:item.name,value:item.rows.reduce((sum,row)=>sum+row.value,0)})),visualType,{...options,measure:'字段值'})}
    else body.innerHTML=renderSvg(rows,visualType,{...options,measure:requested[0].name});
    return true;
  }
  window.spcRenderQualityChartPreview=render;
  let timer;
  const swatches = scheme => `<span class="quality-theme-swatch-strip">${scheme.colors.map(hex=>`<i style="background:${hex}"></i>`).join('')}</span>`;
  function ensureTheme(drawer){
    if(!drawer)return;
    const trigger=q(drawer,'.quality-source-trigger');if(!trigger)return;
    let box=q(drawer,'.quality-theme-choices');
    if(!box){
      box=document.createElement('div');box.className='quality-theme-choices';box.hidden=true;
      box.innerHTML=themeSchemes.map(scheme=>`<button type="button" class="quality-theme-option" data-theme-scheme="${scheme.id}" aria-label="${scheme.label}主题色">${swatches(scheme)}${scheme.id==='default'?'<span class="quality-theme-default-badge">默认</span>':''}</button>`).join('');
      trigger.after(box);trigger.setAttribute('role','button');trigger.tabIndex=0;trigger.setAttribute('aria-haspopup','listbox');
      trigger.onclick=()=>{box.hidden=!box.hidden;trigger.setAttribute('aria-expanded',String(!box.hidden))};
      trigger.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();trigger.click()}};
      box.querySelectorAll('button').forEach(button=>button.onclick=()=>{const chart=q(document,'[data-custom-chart].is-editor-selected');if(chart)chart.dataset.chartTheme=button.dataset.themeScheme;box.hidden=true;trigger.setAttribute('aria-expanded','false');schedule()});
    }
    const scheme=schemeFor(q(document,'[data-custom-chart].is-editor-selected'));
    box.querySelectorAll('button').forEach(button=>button.classList.toggle('is-active',button.dataset.themeScheme===scheme.id));
    if(trigger.dataset.themeScheme===scheme.id)return;
    trigger.dataset.themeScheme=scheme.id;
    q(trigger,'.quality-theme-preview')?.remove();
    trigger.querySelector('[data-theme-trigger-swatches]')?.remove();
    trigger.querySelector('[data-theme-trigger-label]')?.remove();
    trigger.insertAdjacentHTML('afterbegin',`<span data-theme-trigger-swatches>${swatches(scheme)}</span><span data-theme-trigger-label>${scheme.id==='default'?'默认':''}</span>`);
    [...trigger.children].filter(el=>!el.hasAttribute('data-theme-trigger-swatches')&&!el.hasAttribute('data-theme-trigger-label')).forEach(el=>el.remove());
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>{const drawer=q(document,'[data-quality-config-drawer][data-mode="chart"]'),chart=q(document,'[data-custom-chart].is-editor-selected');if(drawer&&chart){ensureTheme(drawer);render(chart,drawer)}},0)}
  document.addEventListener('input',e=>{if(e.target.closest('[data-quality-config-drawer][data-mode="chart"]'))schedule()});
  document.addEventListener('change',e=>{if(e.target.closest('[data-quality-config-drawer][data-mode="chart"]'))schedule()});
  document.addEventListener('click',e=>{const d=e.target.closest('[data-quality-config-drawer][data-mode="chart"]');if(!d)return;if(e.target.closest('.quality-segment-control button,.quality-config-check,.quality-chart-type-tile,.quality-chart-type-trigger,.quality-theme-choices button'))schedule()},true);
  document.addEventListener('click',e=>{const d=q(document,'[data-quality-config-drawer][data-mode="chart"]');if(!d)return;const picker=q(d,'[data-chart-type-picker]');if(picker&&!picker.contains(e.target)){const menu=q(picker,'.quality-chart-type-menu'),trigger=q(picker,'.quality-chart-type-trigger');if(menu)menu.hidden=true;if(trigger)trigger.setAttribute('aria-expanded','false')}});
  new MutationObserver(records=>{if(records.some(r=>r.target?.classList?.contains('quality-config-drawer-body')||r.target?.closest?.('.spc-color-popup,.spc-color-trigger')))schedule()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['style']});
})();
