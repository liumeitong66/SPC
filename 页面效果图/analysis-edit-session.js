(()=>{
  const base=window.localStorage,tab=window.sessionStorage,sessionKey='spc-analysis-edit-session',draftKey='spc-analysis-edit-drafts';let active=tab.getItem(sessionKey)==='active',drafts={};try{drafts=JSON.parse(tab.getItem(draftKey)||'{}')}catch{}
  const managed=k=>/^spc-(?:page-|chart-|metric-copies:|layout:|combo-layout:|native-page:)/.test(String(k));
  const persist=()=>tab.setItem(draftKey,JSON.stringify(drafts));
  const ownsPage=k=>{let name;try{name=decodeURIComponent(k)}catch{name=k}const path=decodeURIComponent(location.pathname),file=path.split('/').pop();return managed(k)&&(name.includes(path)||name==='spc-chart-copies:'+file||name==='spc-metric-copies:'+file)};
  // Repair the legacy project template once, before any copied component or layout is restored.
  const templateVersion='project-original-two-charts-v1',templateKey='spc-template-version:'+location.pathname;
  if(decodeURIComponent(location.pathname).split('/').pop()==='01-项目统计首页.html'&&base.getItem(templateKey)!==templateVersion){
    const pageKeys=[...new Set([...Object.keys(base),...Object.keys(drafts)])].filter(ownsPage);
    if(pageKeys.length){const backup={saved:Object.fromEntries(pageKeys.map(k=>[k,base.getItem(k)])),drafts:Object.fromEntries(pageKeys.filter(k=>Object.hasOwn(drafts,k)).map(k=>[k,drafts[k]]))};base.setItem('spc-template-backup:'+location.pathname+':'+templateVersion,JSON.stringify(backup));for(const k of pageKeys){base.removeItem(k);delete drafts[k]}persist()}
    base.setItem(templateKey,templateVersion);
  }
  const read=k=>active&&Object.hasOwn(drafts,k)?drafts[k]:base.getItem(k);
  const keys=()=>[...new Set([...Object.keys(base),...(active?Object.keys(drafts):[])])].filter(k=>read(k)!==null);
  const api={getItem:k=>read(String(k)),setItem:(k,v)=>{k=String(k);if(active&&managed(k)){drafts[k]=String(v);persist()}else base.setItem(k,v)},removeItem:k=>{k=String(k);if(active&&managed(k)){drafts[k]=null;persist()}else base.removeItem(k)},key:i=>keys()[i]??null,clear:()=>{if(active){keys().forEach(k=>{if(managed(k))drafts[k]=null;else base.removeItem(k)});persist()}else base.clear()}};
  const proxy=new Proxy(base,{get:(target,p)=>p==='length'?keys().length:p in api?api[p]:typeof p==='string'?read(p):Reflect.get(target,p,target),set:(target,p,v)=>{api.setItem(p,v);return true},deleteProperty:(target,p)=>{api.removeItem(p);return true},ownKeys:keys,getOwnPropertyDescriptor:(target,p)=>keys().includes(p)?{configurable:true,enumerable:true,writable:true,value:read(p)}:undefined});
  Object.defineProperty(window,'localStorage',{configurable:true,value:proxy});
  let flushing=false,reloading=false;
  function flush(){if(!active||flushing||reloading)return;flushing=true;try{window.spcFlushEditorPage?.();document.querySelector('[data-combo-drawer] [data-group-save]')?.click();window.dispatchEvent(new Event('spc-editor-flush'))}finally{flushing=false}}
  window.spcEditSession={begin(){active=true;tab.setItem(sessionKey,'active')},flush,commit(){flush();for(const [k,v]of Object.entries(drafts))v===null?base.removeItem(k):base.setItem(k,v);drafts={};active=false;tab.removeItem(draftKey);tab.removeItem(sessionKey)},isActive:()=>active};

  const approvedDeletes=new WeakSet();
  window.addEventListener('click',event=>{
    const trigger=event.target.closest('.quality-component-menu [data-component-delete],.shared-chart-action-menu [data-delete]');
    if(!trigger||approvedDeletes.has(trigger))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(document.querySelector('[data-editor-delete-dialog]'))return;
    const root=document.createElement('div');root.className='proto-backdrop';root.dataset.editorDeleteDialog='';
    root.innerHTML='<section class="proto-modal" role="dialog" aria-modal="true" aria-labelledby="editor-delete-title"><header class="proto-modal-head"><h3 id="editor-delete-title">删除组件</h3><button type="button" class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body">确认删除当前组件？</div><footer class="proto-modal-foot"><button type="button" data-editor-delete-cancel>取消</button><button type="button" class="primary" data-editor-delete-confirm>确认删除</button></footer></section>';
    document.body.append(root);const close=()=>{root.remove();trigger.focus()};
    root.querySelector('.proto-close').onclick=close;root.querySelector('[data-editor-delete-cancel]').onclick=close;
    root.querySelector('[data-editor-delete-confirm]').onclick=()=>{root.remove();approvedDeletes.add(trigger);try{trigger.click()}finally{approvedDeletes.delete(trigger)}};
    root.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close()}};
    root.querySelector('[data-editor-delete-cancel]').focus();
  },true);
  let finishApproved=false;
  function confirmFinish(trigger){
    if(document.querySelector('[data-editor-save-dialog]'))return;
    const root=document.createElement('div');root.className='proto-backdrop';root.dataset.editorSaveDialog='';
    root.innerHTML='<section class="proto-modal" role="dialog" aria-modal="true" aria-labelledby="editor-save-title"><header class="proto-modal-head"><h3 id="editor-save-title">保存页面</h3><button type="button" class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body">确认保存当前页面的修改并完成编辑？</div><footer class="proto-modal-foot"><button type="button" data-editor-save-cancel>取消</button><button type="button" class="primary" data-editor-save-confirm>确认保存</button></footer></section>';
    document.body.append(root);
    const close=()=>{root.remove();trigger.focus()};
    root.querySelector('.proto-close').onclick=close;root.querySelector('[data-editor-save-cancel]').onclick=close;
    root.querySelector('[data-editor-save-confirm]').onclick=()=>{root.remove();finishApproved=true;try{trigger.click()}finally{finishApproved=false}};
    root.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();close()}if(event.key==='Tab'){const buttons=[...root.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}};
    root.querySelector('[data-editor-save-cancel]').focus();
  }
  function confirmRestore(trigger){
    if(document.querySelector('[data-editor-restore-dialog]'))return;
    const root=document.createElement('div');root.className='proto-backdrop';root.dataset.editorRestoreDialog='';
    root.innerHTML='<section class="proto-modal" role="dialog" aria-modal="true" aria-labelledby="editor-restore-title"><header class="proto-modal-head"><h3 id="editor-restore-title">恢复默认</h3><button type="button" class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body">确认恢复当前页面的默认图表和布局？当前编辑的配置将被替换。</div><footer class="proto-modal-foot"><button type="button" data-editor-restore-cancel>取消</button><button type="button" class="primary" data-editor-restore-confirm>确认恢复</button></footer></section>';
    document.body.append(root);const close=()=>{root.remove();trigger?.focus()};
    root.querySelector('.proto-close').onclick=close;root.querySelector('[data-editor-restore-cancel]').onclick=close;root.querySelector('[data-editor-restore-confirm]').onclick=restorePage;
    root.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();close()}};
    root.querySelector('[data-editor-restore-cancel]').focus();
  }
  function restorePage(){reloading=true;for(const k of new Set([...Object.keys(base),...Object.keys(drafts)]))if(ownsPage(k))api.removeItem(k);persist();location.reload()}
  function exitPage(){reloading=true;for(const k of Object.keys(drafts))if(ownsPage(k))delete drafts[k];persist();active=false;tab.removeItem(sessionKey);location.reload()}
  function confirmExit(trigger){if(document.querySelector('[data-editor-exit-dialog]'))return;const root=document.createElement('div');root.className='proto-backdrop';root.dataset.editorExitDialog='';root.innerHTML='<section class="proto-modal" role="dialog" aria-modal="true" aria-labelledby="editor-exit-title"><header class="proto-modal-head"><h3 id="editor-exit-title">退出编辑</h3><button type="button" class="proto-close" aria-label="关闭">×</button></header><div class="proto-modal-body">当前页面的修改将不被保存，是否退出？</div><footer class="proto-modal-foot"><button type="button" data-editor-exit-cancel>取消</button><button type="button" class="primary" data-editor-exit-confirm>退出</button></footer></section>';document.body.append(root);const close=()=>{root.remove();trigger?.focus()};root.querySelector('.proto-close').onclick=close;root.querySelector('[data-editor-exit-cancel]').onclick=close;root.querySelector('[data-editor-exit-confirm]').onclick=exitPage;root.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const buttons=[...root.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};root.querySelector('[data-editor-exit-cancel]').focus()}
  document.addEventListener('click',e=>{if(e.target.closest('[data-editor-exit]')){e.preventDefault();e.stopImmediatePropagation();confirmExit(e.target.closest('button'));return}if(e.target.closest('[data-reset],[data-quality-reset-page]')&&document.body.classList.contains('quality-page-editor-open')){e.preventDefault();e.stopImmediatePropagation();confirmRestore(e.target.closest('button'))}},true);
  const addExit=()=>document.querySelectorAll('.quality-editor-bar-actions').forEach(actions=>{if(actions.querySelector('[data-editor-exit]'))return;const b=document.createElement('button');b.type='button';b.dataset.editorExit='';b.textContent='退出';actions.append(b)});
  document.addEventListener('DOMContentLoaded',()=>{addExit();new MutationObserver(addExit).observe(document.body,{subtree:true,childList:true})});
  document.addEventListener('click',e=>{const close=e.target.closest('.quality-config-drawer-close');if(close&&document.body.classList.contains('quality-page-editor-open')){e.preventDefault();e.stopImmediatePropagation();const panel=close.closest('.quality-config-drawer');if(panel?.isConnected)panel.hidden=true;document.querySelectorAll('.is-editor-selected,.metric-card-selected').forEach(el=>el.classList.remove('is-editor-selected','metric-card-selected'));document.querySelectorAll('.metric-scope-dialog').forEach(el=>el.hidden=true);return}if(e.target.closest('[data-finish],[data-quality-publish]')){if(!finishApproved){e.preventDefault();e.stopImmediatePropagation();confirmFinish(e.target.closest('button'));return}window.spcEditSession.commit();return}const link=e.target.closest('a[href]');if(active&&link&&!link.getAttribute('href').startsWith('#'))flush()},true);
  addEventListener('pagehide',flush);addEventListener('beforeunload',flush);
  const resume=()=>{if(active&&!document.body.classList.contains('quality-page-editor-open'))document.querySelector('[data-quality-page-edit]')?.click()};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(resume,0));
})();
