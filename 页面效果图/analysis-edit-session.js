(()=>{
  const base=window.localStorage,tab=window.sessionStorage,sessionKey='spc-analysis-edit-session',draftKey='spc-analysis-edit-drafts';let active=tab.getItem(sessionKey)==='active',drafts={};try{drafts=JSON.parse(tab.getItem(draftKey)||'{}')}catch{}
  const managed=k=>/^spc-(?:page-|chart-|layout:|combo-layout:|native-page:)/.test(String(k));
  const persist=()=>tab.setItem(draftKey,JSON.stringify(drafts));
  const read=k=>active&&Object.hasOwn(drafts,k)?drafts[k]:base.getItem(k);
  const keys=()=>[...new Set([...Object.keys(base),...(active?Object.keys(drafts):[])])].filter(k=>read(k)!==null);
  const api={getItem:k=>read(String(k)),setItem:(k,v)=>{k=String(k);if(active&&managed(k)){drafts[k]=String(v);persist()}else base.setItem(k,v)},removeItem:k=>{k=String(k);if(active&&managed(k)){drafts[k]=null;persist()}else base.removeItem(k)},key:i=>keys()[i]??null,clear:()=>{if(active){keys().forEach(k=>{if(managed(k))drafts[k]=null;else base.removeItem(k)});persist()}else base.clear()}};
  const proxy=new Proxy(base,{get:(target,p)=>p==='length'?keys().length:p in api?api[p]:typeof p==='string'?read(p):Reflect.get(target,p,target),set:(target,p,v)=>{api.setItem(p,v);return true},deleteProperty:(target,p)=>{api.removeItem(p);return true},ownKeys:keys,getOwnPropertyDescriptor:(target,p)=>keys().includes(p)?{configurable:true,enumerable:true,writable:true,value:read(p)}:undefined});
  Object.defineProperty(window,'localStorage',{configurable:true,value:proxy});
  let flushing=false;
  function flush(){if(!active||flushing)return;flushing=true;try{window.spcFlushEditorPage?.();document.querySelector('[data-combo-drawer] [data-group-save]')?.click();window.dispatchEvent(new Event('spc-editor-flush'))}finally{flushing=false}}
  window.spcEditSession={begin(){active=true;tab.setItem(sessionKey,'active')},flush,commit(){flush();for(const [k,v]of Object.entries(drafts))v===null?base.removeItem(k):base.setItem(k,v);drafts={};active=false;tab.removeItem(draftKey);tab.removeItem(sessionKey)},isActive:()=>active};
  document.addEventListener('click',e=>{const close=e.target.closest('.quality-config-drawer-close');if(close&&document.body.classList.contains('quality-page-editor-open')){e.preventDefault();e.stopImmediatePropagation();const panel=close.closest('.quality-config-drawer');flush();if(panel?.isConnected)panel.hidden=true;document.querySelectorAll('.is-editor-selected,.metric-card-selected').forEach(el=>el.classList.remove('is-editor-selected','metric-card-selected'));document.querySelectorAll('.metric-scope-dialog').forEach(el=>el.hidden=true);return}if(e.target.closest('[data-finish],[data-quality-publish]')){window.spcEditSession.commit();return}const link=e.target.closest('a[href]');if(active&&link&&!link.getAttribute('href').startsWith('#'))flush()},true);
  addEventListener('pagehide',flush);addEventListener('beforeunload',flush);
  const resume=()=>{if(active&&!document.body.classList.contains('quality-page-editor-open'))document.querySelector('[data-quality-page-edit]')?.click()};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(resume,0));
})();
