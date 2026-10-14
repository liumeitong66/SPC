(() => {
  const chart=()=>document.querySelector('[data-custom-chart].is-editor-selected');
  const drawer=()=>document.querySelector('[data-quality-config-drawer][data-mode="chart"]');
  const read=(root,label)=>[...root.querySelectorAll('.quality-config-field')].find(node=>node.firstElementChild?.tagName==='LABEL'&&node.firstElementChild.textContent.trim()===label);
  const angle={默认:0,垂直向上:-90,左起斜上:-45,横排:0,左起斜下:45,垂直向下:90};
  const state=new WeakMap();
  const rgba=c=>{if(!c?.hex)return '';if(c.hex==='transparent')return 'transparent';const rgb=c.hex.slice(1).match(/../g)?.map(v=>parseInt(v,16));return rgb?`rgba(${rgb.join(',')},${c.opacity/100})`:''};
  function apply(el,s){
    if(!el||!s)return;
    el.style.backgroundColor=rgba(s.background);
    const body=el.querySelector('.quality-chart-body');if(!body)return;
    body.querySelectorAll('svg text,.quality-bar span,.quality-bar b,.quality-custom-placeholder').forEach(node=>{node.style.fill=rgba(s.fontColor);node.style.color=rgba(s.fontColor);node.style.fontSize=s.fontSize?`${s.fontSize}px`:''});
    body.querySelectorAll('.gridline').forEach(node=>{node.style.stroke=rgba(s.gridColor);node.style.strokeWidth=s.grid?s.gridWidth:'';node.style.display=s.grid?'':'none'});
    body.querySelectorAll('.axis').forEach(node=>{const vertical=node.classList.contains('vertical');node.style.display=(vertical?!s.yLabels:!s.xLabels)?'none':'';node.style.transform=`rotate(${angle[vertical?s.yAngle:s.xAngle]||0}deg)`;node.style.transformBox='fill-box';node.style.transformOrigin='center'});
    const legend=el.querySelector('.legend');if(legend){legend.hidden=s.legend==='隐藏';legend.style.position=s.legend==='顶部'?'':'absolute';legend.style.zIndex=s.legend==='顶部'?'':'4';legend.style.top=s.legend==='底部'?'auto':s.legend==='顶部'?'':s.legend==='左侧'||s.legend==='右侧'?'50%':'8px';legend.style.bottom=s.legend==='底部'?'8px':'';legend.style.left=s.legend==='左侧'?'8px':s.legend==='右侧'?'auto':'';legend.style.right=s.legend==='右侧'||s.legend==='底部'?'8px':'';legend.style.transform=['左侧','右侧'].includes(s.legend)?'translateY(-50%)':'';legend.style.flexDirection=['左侧','右侧'].includes(s.legend)?'column':''}
  }
  function enhance(){const d=drawer();if(!d)return;
    const custom=d.querySelector('[data-chart-panel="custom"]');if(!custom||d._chartEnhancedPanel===custom)return;d._chartEnhancedPanel=custom;
    for(const [label,kind] of [['背景颜色','background'],['字体颜色','text'],['网格颜色','text']]){
      const field=read(custom,label);if(!field)continue;const select=field.querySelector('select');if(!select)continue;
      const button=document.createElement('button');button.type='button';button.dataset.chartColor=label;select.replaceWith(button);window.spcBindColorTrigger?.(button,kind);
    }
    for(const section of ['横轴','纵轴']){const detail=[...custom.querySelectorAll('details')].find(item=>item.querySelector('summary')?.textContent===section);if(!detail)continue;const check=detail.querySelector('label.quality-config-check input');const box=detail.querySelector('.quality-chart-option-box');if(check&&box){check.dataset.chartAxis=section;check.onchange=()=>box.hidden=!check.checked;box.hidden=!check.checked}}
    const grid=d.querySelector('[data-quality-main-grid]'),fields=d.querySelector('[data-quality-grid-fields]');if(grid&&fields){grid.onchange=()=>fields.hidden=!grid.checked;fields.hidden=!grid.checked}
    const selected=chart(),saved=selected&&state.get(selected);if(saved){for(const [label,color] of Object.entries(saved.colors||{})){const btn=d.querySelector(`[data-chart-color="${label}"]`);if(btn)window.spcBindColorTrigger?.(btn,label==='背景颜色'?'background':'text',color)}const font=read(custom,'字号')?.querySelector('select');if(font)font.value=saved.fontSize;const legend=read(custom,'图例位置')?.querySelector('select');if(legend)legend.value=saved.legend;for(const [axis,shown,angleName] of [['横轴',saved.xLabels,saved.xAngle],['纵轴',saved.yLabels,saved.yAngle]]){const detail=[...custom.querySelectorAll('details')].find(item=>item.querySelector('summary')?.textContent===axis);if(detail){const check=detail.querySelector('[data-chart-axis]');if(check){check.checked=shown;check.dispatchEvent(new Event('change'))}const select=read(detail,'标签角度')?.querySelector('select');if(select)select.value=angleName}}if(grid){grid.checked=saved.grid;grid.dispatchEvent(new Event('change'))}const width=read(custom,'网格粗细')?.querySelector('select');if(width)width.value=saved.gridWidth}
  }
  function capture(){const d=drawer(),el=chart();if(!d||!el)return;const custom=d.querySelector('[data-chart-panel="custom"]');const axis=section=>{const detail=[...custom.querySelectorAll('details')].find(item=>item.querySelector('summary')?.textContent===section);return {shown:detail?.querySelector('[data-chart-axis]')?.checked??true,angle:read(detail,'标签角度')?.querySelector('select')?.value||'默认'}};const x=axis('横轴'),y=axis('纵轴');const colors=Object.fromEntries([...custom.querySelectorAll('[data-chart-color]')].map(btn=>[btn.dataset.chartColor,{...btn._color}]));const s={colors,background:colors['背景颜色'],fontColor:colors['字体颜色'],fontSize:read(custom,'字号')?.querySelector('select')?.value,legend:read(custom,'图例位置')?.querySelector('select')?.value||'顶部',xLabels:x.shown,xAngle:x.angle,yLabels:y.shown,yAngle:y.angle,grid:d.querySelector('[data-quality-main-grid]')?.checked||false,gridColor:colors['网格颜色'],gridWidth:read(custom,'网格粗细')?.querySelector('select')?.value||'1px'};state.set(el,s);setTimeout(()=>apply(el,s),0)}
  document.addEventListener('click',event=>{if(event.target.closest('[data-quality-chart-save]'))capture()},true);
  let scheduled=false;new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1))&&!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;enhance()})}}).observe(document.documentElement,{childList:true,subtree:true});enhance();
})();
