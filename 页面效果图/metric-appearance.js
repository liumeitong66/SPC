(() => {
  const states = new Map();
  const colors = ['#3370FF','#4D49ED','#7C32F4','#008580','#2694CF','#FFC400','#F57300','#E72A27','#52565E','#DFE8FF','#F2F3FF','#EEE5FF','#E9FAF8','#EAF8FE','#FFF0BF','#FFF3E7','#FFE4E4','#FFFFFF'];
  const textColorBases = ['#858B94','#3370FF','#009BD6','#00B99C','#25B420','#83B400','#FFC400','#F58A00','#E7362F','#E93691','#7C32F4','#4520A8'];
  const textColors = [1,.18,.38,.65,.82,.45].flatMap((shade,row)=>textColorBases.map(hex=>{
    const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16));
    return '#'+rgb.map(value=>Math.round(row===5?value*.55:255-(255-value)*shade).toString(16).padStart(2,'0')).join('').toUpperCase();
  }));
  const options = (max, selected) => Array.from({length:max-9},(_,i)=>`<option${i+10===Number(selected)?' selected':''}>${i+10}</option>`).join('');
  const card = () => document.querySelector('[data-custom-metric].is-editor-selected,.metric-card-selected,[data-custom-chart].is-editor-selected');
  const key = el => el.dataset.customMetric || el.dataset.customChart || String([...document.querySelectorAll('.metric')].indexOf(el));
  const labelEl = el => el.querySelector('.metric-label') || el.querySelector('label');
  const valueEl = el => el.querySelector('.metric-value') || el.querySelector('strong');
  function apply(el, s) {
    const rgb = hex => hex.match(/\w\w/g).map(v=>parseInt(v,16));
    const color = c => c.hex === 'transparent' ? 'transparent' : `rgba(${rgb(c.hex.slice(1)).join(',')},${c.opacity/100})`;
    el.style.backgroundColor = s.background?.hex ? color(s.background) : '';
    el.style.backdropFilter = s.background?.blur ? `blur(${s.background.blur/5}px)` : '';
    el.classList.toggle("spc-metric-sized",s.fontMode==="custom");
    const group=el.closest(".metric-group") || el.parentElement;group.classList.toggle("spc-metric-sized-group",Boolean(group.querySelector(".spc-metric-sized")));
    const label=labelEl(el),value=valueEl(el);
    [label,value].filter(Boolean).forEach(node=>node.style.color=s.text?.hex?color(s.text):'');
    if(label)label.style.fontSize=s.fontMode==='custom'?`${s.labelSize}px`:'';
    if(value){value.style.fontSize=s.fontMode==='custom'?`${s.numberSize}px`:'';value.style.overflowWrap='anywhere';value.style.maxWidth='100%';
      if(s.precision!==undefined){
        if(value.dataset.appearanceOutput!==value.textContent){const percent=value.textContent.includes('%');value.dataset.appearanceRaw=String(Number(value.textContent.replace(/[^\d.-]/g,''))/(percent?100:1));value.dataset.appearanceUnit=percent?'':value.querySelector('small')?.textContent||'';}
        const raw=Number(value.dataset.appearanceRaw);if(Number.isFinite(raw)&&/\d/.test(value.textContent)){const percent=s.format==='百分比';const shown=percent?raw*100:raw;value.textContent=shown.toLocaleString('en-US',{useGrouping:s.format==='数字（千分位）',minimumFractionDigits:Number(s.precision),maximumFractionDigits:Number(s.precision)});const unit=percent?'%':value.dataset.appearanceUnit;if(unit){const small=document.createElement('small');small.textContent=unit;value.append(small)}value.dataset.appearanceOutput=value.textContent;}
      }
    }
  }
  function customPanel(drawer){return drawer.querySelector('[data-metric-panel="custom"]');}
  function initPanel(panel){
    if(panel.dataset.appearanceReady)return;panel.dataset.appearanceReady='true';
    const selected=card(),s=selected&&states.get(key(selected)) || {};
    panel.querySelectorAll('select').forEach(select=>{
      const parent=select.parentElement;const text=(parent.querySelector('label')?.textContent||parent.firstChild?.textContent||'').trim();
      if(['背景颜色','文字颜色'].includes(text)){
        const kind=text==='背景颜色'?'background':'text';const button=document.createElement('button');button.type='button';button.className='spc-color-trigger';button.dataset.appearanceColor=kind;button._color={...(s[kind] || {hex:null,opacity:100,blur:0})};button.innerHTML='<i></i><span>默认</span>';select.replaceWith(button);updateTrigger(button);button.onclick=()=>openColor(button);
      }else if(text==='数据说明字号'||text==='数字字号'){
        select.dataset.appearanceSize=text==='数字字号'?'numberSize':'labelSize';select.innerHTML=options(text==='数字字号'?144:72,s[select.dataset.appearanceSize]|| (text==='数字字号'?22:12));
      }else if(text==='数字格式'){
        const initial=select.value==='普通数字'?'数字':select.value;select.dataset.appearanceFormat='';select.innerHTML=['数字（千分位）','数字','百分比'].map(t=>`<option>${t}</option>`).join('');select.value=s.format||initial;
      }else if(text==='小数精度'){
        const initial=/([1-4])/.exec(select.value)?.[1]||'0';select.dataset.appearancePrecision='';select.innerHTML=['整数','保留1位小数','保留2位小数','保留3位小数','保留4位小数'].map((t,i)=>`<option value="${i}">${t}</option>`).join('');select.value=s.precision??initial;
      }
    });
    if(!panel.querySelector('[data-font-mode]')){
      const wrap=document.createElement('div');wrap.innerHTML='<label class="metric-card-field">字体字号<div class="spc-font-mode" data-font-mode><button type="button" data-font-mode-value="adaptive" class="active">自适应</button><button type="button" data-font-mode-value="custom">自定义</button></div></label><div class="spc-font-fields" hidden><label class="metric-card-field">数据说明字号<select data-appearance-size="labelSize">'+options(72,s.labelSize||12)+'</select></label><label class="metric-card-field">数字字号<select data-appearance-size="numberSize">'+options(144,s.numberSize||22)+'</select></label></div>';
      panel.querySelector('[data-appearance-precision]')?.parentElement.before(wrap);
      wrap.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{wrap.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));wrap.querySelector('.spc-font-fields').hidden=btn.dataset.fontModeValue!=='custom';});
    }
    if(s.fontMode==='custom')panel.querySelector('[data-font-mode-value="custom"]')?.click();
  }
  function updateTrigger(btn){const c=btn._color;btn.querySelector('i').style.background=c.hex||'transparent';btn.querySelector('span').textContent=c.hex===null?'默认':c.hex==='transparent'?'透明':c.hex;}
  let popup,active,h=0,sat=0,val=1;
  function hsvHex(){const f=n=>{let k=(n+h/60)%6;return Math.round((val-val*sat*Math.max(0,Math.min(k,4-k,1)))*255).toString(16).padStart(2,'0')};return '#'+f(5)+f(3)+f(1);}
  function setHex(hex){const [r,g,b]=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;h=d===0?0:max===r?60*((g-b)/d%6):max===g?60*((b-r)/d+2):60*((r-g)/d+4);if(h<0)h+=360;sat=max===0?0:d/max;val=max;}
  function refresh(){const c=active._color,hex=c.hex&&c.hex!=='transparent'?c.hex:'#FFFFFF';const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16));popup.querySelector('[data-hex]').value=hex;popup.querySelectorAll('[data-rgb]').forEach((input,i)=>input.value=rgb[i]);popup.querySelector('.spc-color-sv').style.backgroundColor=`hsl(${h},100%,50%)`;const dot=popup.querySelector('.spc-color-pointer');dot.style.left=sat*100+'%';dot.style.top=(1-val)*100+'%';popup.querySelector('.spc-color-hue').value=h;popup.querySelector('.spc-color-preview').style.background=hex;popup.querySelector('[data-opacity]').value=c.opacity;popup.querySelector('[data-opacity-value]').textContent=c.opacity+'%';popup.querySelector('[data-blur]').value=c.blur;popup.querySelector('[data-blur-value]').textContent=c.blur+'%';popup.querySelectorAll('[data-swatch]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.swatch===c.hex)));updateTrigger(active);}
  function openColor(btn){
    active=btn;if(!popup){popup=document.createElement('section');popup.className='spc-color-popover';popup.setAttribute('role','dialog');popup.innerHTML='<button type="button" class="spc-color-reset">恢复默认</button><div class="spc-color-caption">推荐颜色</div><div class="spc-color-swatches"></div><button type="button" class="spc-color-transparent" aria-label="透明"></button><div class="spc-color-caption">更多颜色</div><div class="spc-color-sv"><i class="spc-color-pointer"></i></div><div class="spc-color-hue-row"><i class="spc-color-preview"></i><input class="spc-color-hue" type="range" min="0" max="360" aria-label="色相"></div><div class="spc-color-values"><label>HEX<input data-hex aria-label="HEX"></label><label>R<input data-rgb type="number" min="0" max="255" aria-label="R"></label><label>G<input data-rgb type="number" min="0" max="255" aria-label="G"></label><label>B<input data-rgb type="number" min="0" max="255" aria-label="B"></label></div><div class="spc-color-range-label"><span>不透明度</span><span data-opacity-value></span></div><input data-opacity type="range" min="0" max="100" aria-label="不透明度"><div data-background-blur><div class="spc-color-range-label"><span>背景模糊</span><span data-blur-value></span></div><input data-blur type="range" min="0" max="100" aria-label="背景模糊"></div>';document.body.append(popup);
      popup.querySelector('.spc-color-reset').onclick=()=>{active._color={hex:null,opacity:100,blur:0};setHex('#FFFFFF');refresh();};popup.querySelector('.spc-color-transparent').onclick=()=>{active._color.hex='transparent';refresh();};
      popup.querySelector('[data-hex]').onchange=e=>{if(/^#?[\da-f]{6}$/i.test(e.target.value)){active._color.hex=('#'+e.target.value.replace('#','')).toUpperCase();setHex(active._color.hex)}refresh()};
      popup.querySelectorAll('[data-rgb]').forEach(input=>input.onchange=()=>{active._color.hex='#'+[...popup.querySelectorAll('[data-rgb]')].map(i=>Math.max(0,Math.min(255,Number(i.value)||0)).toString(16).padStart(2,'0')).join('').toUpperCase();setHex(active._color.hex);refresh()});
      popup.querySelector('.spc-color-hue').oninput=e=>{h=Number(e.target.value);active._color.hex=hsvHex().toUpperCase();refresh()};
      popup.querySelector('[data-opacity]').oninput=e=>{active._color.opacity=Number(e.target.value);refresh()};popup.querySelector('[data-blur]').oninput=e=>{active._color.blur=Number(e.target.value);refresh()};
      const sv=popup.querySelector('.spc-color-sv');const move=e=>{const r=sv.getBoundingClientRect();sat=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));val=1-Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));active._color.hex=hsvHex().toUpperCase();refresh()};sv.onpointerdown=e=>{sv.setPointerCapture(e.pointerId);move(e)};sv.onpointermove=e=>{if(sv.hasPointerCapture(e.pointerId))move(e)};
    }
    popup.dataset.kind=btn.dataset.appearanceColor;popup.setAttribute('aria-label',popup.dataset.kind==='background'?'背景颜色':'文字颜色');popup.querySelector('[data-background-blur]').hidden=popup.dataset.kind!=='background';popup.querySelector('.spc-color-transparent').hidden=popup.dataset.kind!=='background';popup.querySelector('.spc-color-swatches').innerHTML=(popup.dataset.kind==='background'?colors:textColors).map((hex,i)=>`<button type="button" class="spc-color-swatch${i>=9?' light':''}" data-swatch="${hex}" style="background:${hex}" aria-label="${hex}"></button>`).join('');popup.querySelectorAll('[data-swatch]').forEach(b=>b.onclick=()=>{active._color.hex=b.dataset.swatch;setHex(b.dataset.swatch);refresh()});setHex(btn._color.hex&&btn._color.hex!=='transparent'?btn._color.hex:'#FFFFFF');popup.hidden=false;refresh();const r=btn.getBoundingClientRect();popup.style.left=Math.max(12,Math.min(r.right-popup.offsetWidth,innerWidth-popup.offsetWidth-12))+'px';popup.style.top=Math.max(12,Math.min(r.bottom+6,innerHeight-popup.offsetHeight-12))+'px';
  }
  window.spcBindColorTrigger = (button,kind,saved) => {
    button.dataset.appearanceColor=kind;
    button._color={...(saved||{hex:null,opacity:100,blur:0})};
    button.classList.add('spc-color-trigger');
    button.innerHTML='<i></i><span>默认</span>';
    updateTrigger(button);
    button.onclick=()=>openColor(button);
  };
  document.addEventListener('pointerdown',e=>{if(popup&&!popup.contains(e.target)&&!e.target.closest('.spc-color-trigger'))popup.hidden=true});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&popup)popup.hidden=true});
  document.addEventListener('click',e=>{
    if(!e.target.closest('[data-metric-save],[data-quality-chart-save]'))return;
    const el=card(),drawer=e.target.closest('.quality-config-drawer,.metric-card-editor'),panel=drawer&&customPanel(drawer);if(!el||!panel)return;
    const state={};panel.querySelectorAll('[data-appearance-color]').forEach(btn=>state[btn.dataset.appearanceColor]={...btn._color});panel.querySelectorAll('[data-appearance-size]').forEach(select=>state[select.dataset.appearanceSize]=Number(select.value));state.fontMode=panel.querySelector('[data-font-mode-value="custom"].is-active,[data-font-mode-value="custom"].active')?'custom':'adaptive';state.precision=panel.querySelector('[data-appearance-precision]')?.value;state.format=panel.querySelector('[data-appearance-format]')?.value;states.set(key(el),state);setTimeout(()=>apply(el,state),0);if(popup)popup.hidden=true;
  },true);
  let queued=false;const scan=()=>{queued=false;document.querySelectorAll('[data-metric-panel="custom"]').forEach(initPanel);document.querySelectorAll('[data-custom-metric],.metric').forEach(el=>{const state=states.get(key(el));if(state&&!el.dataset.appearanceRestored){el.dataset.appearanceRestored='true';apply(el,state)}})};
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(!popup||!popup.contains(n))))&&!queued){queued=true;queueMicrotask(scan)}}).observe(document.documentElement,{childList:true,subtree:true});scan();
})();
